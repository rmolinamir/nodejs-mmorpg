const now = require('performance-now');
const packet = require('./packet');
const _ = require('underscore');

class Client {
	constructor(socket, maps) {
		// Client globals
		this.socket = socket;
		this.maps = maps;
		// Client Socket Handlers
		this.init = this.init.bind(this);
		this.data = this.data.bind(this);
		this.debug = this.debug.bind(this);
		this.error = this.error.bind(this);
		this.end = this.end.bind(this);
		// Client Methods
		this.broadcastRoom = this.broadcastRoom.bind(this);
		this.enterRoom = this.enterRoom.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	// User variable will be added at runtime:
	user = null;
	maps = null;

	// Client Socket Handlers

	init() {
		console.log('Client initiated.');
		// Send the connection handshacke packet to the client.
		this.socket.write(packet.build(['HELLO', now().toString()]));
	}

	data(data) {
		console.log('Cliet.data - data: ', data.toString());
		packet.parse(this, data);
	}

	debug() {
		console.log('Client Boolean(this.socket): ', Boolean(this.socket));
		console.log('Client this.data: ', this.data);
		console.log('Client this.error: ', this.error);
		console.log('Client this.end: ', this.end);
		console.log('Client this.user: ', this.user);
		console.log('Client this.setUser: ', this.setUser);
	}

	error(error = {}) {
		console.log('Client.error - error: ', error.message);
	}

	// Remove client from room.
	end() {
		console.log('Client.end - Socket closed.');
		const room = this.maps[this.user.current_room];
		// Removing client from room.
		if (Array.isArray(room.clients)) {
			room.clients.filter(otherClient => otherClient !== this);
			// TODO: Send packet to other clients to remove user from rooms.
		}
		// Saving user.
		this.user.save();
	}

	// Client Methods

	/**
	 * Broadcast the movement of one client to every client in the same room.
	 * @param {Buffer} packetData - Movement data packet.
	 */
	broadcastRoom(packetData) {
		const room = this.maps[this.user.current_room];
		console.log('broadcastRoom - room: ', room);
		if (Array.isArray(room.clients)) {
			room.clients.forEach(otherClient => {
				if (otherClient.user.username !== this.user.username) {
					otherClient.socket.write(packetData);
				}
			});
		}
	}

	/**
	 * Room object.
	 // @ts-ignore
	 * @param {Room} selectedRoom - Client's selected room object containing other connected clients.
	 */
	enterRoom(selectedRoom) {
		const room = this.maps[selectedRoom];
		console.log('enterRoom - room: ', room);
		// Push this client into the current room.
		this.maps[selectedRoom].clients.push(this);
		// Notify other clients that this client entered the room.
		if (Array.isArray(room.clients)) {
			room.clients.forEach(otherClient => {
				otherClient.socket.write(packet.build([
					'ENTER',
					this.user.username,
					this.user.pos_x,
					this.user.pos_y,
				]));
			});
		}
	}

	// TODO:
	// Leave room handler to remove client from room.

	setUser(user) {
		this.user = user;
	}
}

module.exports = Client
