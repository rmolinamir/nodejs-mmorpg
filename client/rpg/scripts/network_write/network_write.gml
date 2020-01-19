// argument0: socket
// argument1: buffer of data to send

// Initialize
var packetSize = buffer_tell(argument1);
var bufferPacket = buffer_create(1, buffer_grow, 1);

// Write the size and the packet into new buffer
buffer_write(bufferPacket, buffer_u8, packetSize + 1);
buffer_copy(argument1, 0, packetSize, bufferPacket, 1);
buffer_seek(bufferPacket, 0, packetSize + 1);

// Sent the packet to the server
network_send_raw(argument0, bufferPacket, buffer_tell(bufferPacket));

// Destroy the buffers to clean memory
buffer_delete(argument1);
buffer_delete(bufferPacket);
