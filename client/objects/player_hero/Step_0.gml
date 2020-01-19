// Handles steps.
if (target_x > x) { x += 4;	};
if (target_x < x) { x -= 4;	};
if (target_y > y) { y += 4;	};
if (target_y < y) { y -= 4;	};

// If the targets are equal, player is not moving.
if (target_x == x && target_y == y) {
	moving = false
}

// If not moving, and player is pressing movement left key, move player object.
if (keyboard_check(ord("A")) && !moving && place_free(x - 32, y)) {
	target_x -= 32;
	moving = true;
	event_user(0);
}

// If not moving, and player is pressing movement up key, move player object.
if (keyboard_check(ord("W")) && !moving && place_free(x, y - 32)) {
	target_y -= 32;
	moving = true;
	event_user(0);
}

// If not moving, and player is pressing movement right key, move player object.
if (keyboard_check(ord("D")) && !moving && place_free(x + 32, y)) {
	target_x += 32;
	moving = true;
	event_user(0);
}

// If not moving, and player is pressing movement down key, move player object.
if (keyboard_check(ord("S")) && !moving && place_free(x, y + 32)) {
	target_y += 32;
	moving = true;
	event_user(0);
}