// Dependencies
const config = require(`${__dirname}/resources/config`);
const fs = require('fs'); // File System
const net = require('net'); // Access to creating server, listening to ports, GET requests, etc.
const Client = require('./client');

// Load the initializers
require('./initializers/01_mongodb'); // Connecting to the database using mongoose

const initFiles = fs.readdirSync(`${__dirname}/initializers`);
initFiles.forEach(initFile => {
	console.log('initFile: ', initFile);
	require(`${__dirname}/initializers/${initFile}`);
});

// Load the models
const modelFiles = fs.readdirSync(`${__dirname}/models`);
modelFiles.forEach(modelFile => {
	console.log('modelFile: ', modelFile);
	require(`${__dirname}/models/${modelFile}`);
});

// Load the maps
const maps = {};
const mapFiles = fs.readdirSync(config.data_paths.maps);
mapFiles.forEach(mapFile => {
	console.log('initFile: ', mapFile);
	const map = require(`${config.data_paths.maps}/${mapFile}`);
	maps[map.room] = map;
});

net.createServer(function(socket) {
	// When a client connects to the server, create a new instance of the Client.
	const client = new Client(socket, maps);
	console.log('Socket connected.', Boolean(client.socket));

	// Server/client handshake.
	client.init();

	// Event callbacks.
	socket.on('error', client.error);

	socket.on('end', client.end);

	socket.on('data', client.data);
}).listen(config.port);

console.log(`Initialize completed. Server running on port ${config.port} for environment: ${config.environment}.`);

// 1. Load the initializers.
// 2. Load the data models.
// 3. Load game map data.
// 4. Initiate the server and listen to the internet.
	// All of server logic.
