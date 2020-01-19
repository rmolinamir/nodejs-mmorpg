/// @description Insert description here
// You can write your code in this editor
draw_self();

if (focused) {
	// Draw rectangle around it, if focused.
	draw_rectangle(x ,y, x + (16*image_xscale), y + (16*image_yscale), 2);
	draw_sprite_ext(sprite_index, image_index, x, y, image_xscale, image_yscale, image_angle, c_gray, 1.0);
}

if (string_length(text) > 0 || focused) {
	draw_text(x + 3, y + 8, string(text));
} else {
	draw_text(x + 3, y + 8, string(placeholder));
}