const Client = require('./client');

// Dependencies
const PacketModels = require('./initializers/00_packetmodels');
const User = require('./models/user');

/// Parses JavaScript to GameMaker buffer.
// For new Buffer(number), replace it with Buffer.alloc(number).
//
// For new Buffer(string) (or new Buffer(string, encoding)),
// replace it with Buffer.from(string) (or Buffer.from(string, encoding)).
//
// For all other combinations of arguments (these are much rarer), also
// replace new Buffer(...arguments) with Buffer.from(...arguments).
const zeroBuffer = Buffer.from('00',  'hex');

const packet = {
	/**
	 * Builds the data packets sent to GameMaker using JS buffers.
	 * @param {Array} params - An array of JavaScript variables to be turned into buffers.
	 */
	build(params) {
		const packetParts = [];
		let packetSize = 0;
		// Compose params into a single buffer inside packetParts.
		params.forEach(function(param) {
			let buffer;
			switch (true) {
				case typeof param === 'string':
					buffer = Buffer.from(param, 'utf8');
					console.log('String buffer: ', buffer);
					buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
					break;
				case typeof param === 'number':
					buffer = Buffer.alloc(2);
					console.log('Number buffer: ', buffer);
					buffer.writeUInt16LE(param, 0);
					break;
				default: // Don't know what it is.
					console.warn('WARNING: Unkown Unknown data type in packet builder!', typeof packet);
			}
			packetSize += buffer.length;
			packetParts.push(buffer);
		});
		const dataBuffer = Buffer.concat(packetParts, packetSize);

		const size = Buffer.alloc(1);
		size.writeUInt8(dataBuffer.length + 1, 0);
		// SIZE -> DATA
		// 5HELLO <- 6 bytes

		const finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);

		return finalPacket;
	},
	/**
	 * Parse a packet to be handled for a client.
	 * @param {Client} c - Client object.
	 * @param {Buffer} data - Buffer received from the client.
	 */
	parse(c, data) {
		let index = 0;
		// 600000X11111X2222X333333
		// First loop:
		// 0----6
		// 600000
		// Second loop:
		// 0----12
		// 611111
		while (index < data.length) {
			const packetSize = data.readUInt8(index);
			const extractedPacket = new Buffer(packetSize);
			data.copy(extractedPacket, 0, index, index + packetSize);
			this.interpret(c, extractedPacket);
			index += packetSize;
		}
	},
	/**
	 * 
	 * @param {Client} c - Client object.
	 * @param {Buffer} dataPacket - Parsed buffer received from the client.
	 */
	interpret(c, dataPacket) {
		// Compares binary data, the result of the comparison is placed in the commad property of header.
		const header = PacketModels.header.parse(dataPacket);
		console.log('Interpret: ', header.command);
		const command = header.command.toUpperCase();
		switch (command) {
			case 'LOGIN': {
				const data = PacketModels.login.parse(dataPacket);
				console.log('LOGIN data: ', data.command, data.username, data.password);
				// @ts-ignore
				User.login(data.username, data.password, function(result, user) {
					if (result) {
						console.log('LOGIN SUCCESS', result, user);
						c.user = user;
						c.enterRoom(c.user.current_room);
						// Tell the client that the user logged in successfully & relevant data.
						c.socket.write(packet.build([
							'LOGIN',
							'TRUE',
							c.user.current_room,
							c.user.pos_x,
							c.user.pos_y,
							c.user.username,
						]));
					} else {
						console.log('LOGIN FAIL', result);
						c.socket.write(packet.build(['LOGIN', 'FALSE']));
					}
				});
				break;
			}
			case 'REGISTER': {
				const data = PacketModels.register.parse(dataPacket);
				console.log('REGISTER data: ', data.command, data.username, data.password);
				// @ts-ignore
				User.register(data.username, data.password, function(result) {
					if (result) {
						console.log('REGISTER SUCCESS', result);
						// Tell the client that the user registered successfully & relevant data.
						c.socket.write(packet.build(['REGISTER', 'TRUE']));
					} else {
						console.log('REGISTER FAIL', result);
						c.socket.write(packet.build(['REGISTER', 'FALSE']));
					}
				});
				break;
			}
			case 'POS': {
				const data = PacketModels.pos.parse(dataPacket);
				// TODO: We don't want to save here to protect from attackers, we should save
				// when the socket connection ends.
				c.user.pos_x = data.target_x;
				c.user.pos_y = data.target_y;
				c.user.save();
				c.broadcastRoom(packet.build(['POS', c.user.username, data.target_x, data.target_y]));
				console.log('POS data: ', data);
				break;
			}
			default:
				console.error(`Wrong command received from client buffers: [${command}].`);
		}
	}
};

module.exports = packet;
