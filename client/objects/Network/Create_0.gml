/// Initiate the connecton

// Instance variables
savedBuffer = buffer_create(1, buffer_grow, 1);
reading = 0;
cutBuffer = buffer_create(1, buffer_grow, 1);

// Initiate the socket
socket = network_create_socket(network_socket_tcp);
network_connect_raw(socket, "127.0.0.1", 8626);