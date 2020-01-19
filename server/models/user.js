// Dependencies
const mongoose = require("mongoose");
const config = require('../resources/config');
const startingRoom = require('../resources/game_data/maps/hometown');

const UserSchema = new mongoose.Schema({
	username: { type: String, unique: true, },
	password: { type: String, },
	sprite: String,
	current_room: String,
	pos_x: Number,
	pos_y: Number,
	// TODO:
	pos_z: Number,
});

UserSchema.statics.register = function(username, password, callback) {
	// Create a new user instance.
	const newUser = new User({
		username,
		// TODO: Hash the password using Passport or something else before saving it to the database.
		// This is very insecure.
		password,
		sprite: 'spr_Hero',
		current_room: startingRoom.room,
		pos_x: startingRoom.start_x,
		pos_y:  startingRoom.start_y,
	});

	// Save the new user instance to the database.
	newUser.save(function(error) {
		if (!error) {
			callback(true);
		} else {
			callback(false);
		}
	});
};

UserSchema.statics.login = function(username, password, callback) {
	User.findOne({ username }, function(error, user) {
		// If there were no errors and a user was found:
		if (!error && user) {
			// TODO: Add salt by using Passport or another library
			// Check if the password matches the stored user's password
			// @ts-ignore
			const isSamePassword = user.password === password;
			if (isSamePassword) {
				callback(true, user);
			} else {
				callback(false, null);
			}
		// If there was an error:
		} else {
			console.log('error: ', error);
			callback(false, null);
		}
	})
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
