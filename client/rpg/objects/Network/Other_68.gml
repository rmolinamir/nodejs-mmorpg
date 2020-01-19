/// @description Insert description here
// You can write your code in this editor

show_debug_message("Networking event triggered")

switch(async_load[? "type"]) {
	// Take the data that arrived from the server, and append it to another buffer.
	case network_type_data:
		// Load the buffer into an endlessly growing buffer.
		buffer_copy(
			async_load[? "buffer"],
			0,
			async_load[? "size"],
			savedBuffer,
			buffer_tell(savedBuffer)
		);
		// Move the current position that we need to read the buffer from.
		buffer_seek(savedBuffer, buffer_seek_relative, async_load[? "size"] + 1);
		// The buffer received will be a bundle of buffers. The while loop will
		// parse the buffers to individually separate them from the received buffer
		// until there are no more left to separate, then handle the packet data.
		// Each time, a size variable based on the next buffer position.
		while (true) {
			var size = buffer_peek(savedBuffer, reading, buffer_u8);
			if (buffer_get_size(savedBuffer) >= reading + size) {
				// Read the packet (store the segment inside cutBuffer)
				buffer_copy(savedBuffer, reading, size, cutBuffer, 0);
				buffer_seek(cutBuffer, 0, 1);
				// Handle the packet's data
				handle_packet(cutBuffer);
				// Update the reading position if there is any left.
				if (buffer_get_size(savedBuffer) != (reading + size)) {
					reading += size;
				} else {
					// If there are no more data packets to process, reset the savedBuffer and
					// the reading position.
					buffer_resize(savedBuffer, 1);
					reading = 0;
					break;
				}
			} else {
				break;
			}
		}
		break;
}