/**
* Handles data packets sent from the client.
* @param argument0 - Data buffer.
*/
var command = buffer_read(argument0, buffer_string);
show_debug_message("Networking event: " + string(command));

switch(command) {
	case "HELLO":
		server_time = buffer_read(argument0, buffer_string);
		room_goto_next();
		show_debug_message("Server welcome you @ " + server_time);
		break;
	case "LOGIN":
		status = buffer_read(argument0, buffer_string);
		if (status == "TRUE") {
			// Read data from .
			target_room = buffer_read(argument0, buffer_string);
			target_x = buffer_read(argument0, buffer_u16);
			target_y = buffer_read(argument0, buffer_u16);
			name = buffer_read(argument0, buffer_string);
			// Go to target room.
			goto_room = asset_get_index(target_room);
			room_goto(goto_room);
			// Initiate a player in this room.
			with(instance_create_depth (target_x, target_y, 1, player_hero)) {
				name = other.name;
				break;
			}
		} else {
			show_message("Login failed: User doesn't exist or username or password incorrect.");
		}
		break;
	case "REGISTER":
		status = buffer_read(argument0, buffer_string);
		if (status == "TRUE") {
			show_message("Register success: Please login.");
		} else {
			show_message("Register failed: Username taken.");
		}
		break;
	case "ENTER":
	case "POS":
		username = buffer_read(argument0, buffer_string);
		target_x = buffer_read(argument0, buffer_u16);
		target_y = buffer_read(argument0, buffer_u16);
		foundPlayer = -1;
		with(player_network) {
			// Check if the player exists
			if (name == other.username) {
				other.foundPlayer = id;
				break;
			}
		}
		// Move the player position if player was found:
		if (foundPlayer != -1) {
			with(foundPlayer) {
				target_x = other.target_x;
				target_y = other.target_y;
			}
		// If the player was not found (player logging in), create a player.
		} else {
			with(instance_create_depth(target_x, target_y, 1, player_network)) {
				name = other.username;
			}
		}
}
