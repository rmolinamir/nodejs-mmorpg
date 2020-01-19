// Dependencies
const mongoose = require('mongoose');
const config = require('../resources/config');

// Connecting to the database
mongoose.connect(
	config.database,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		dbName: config.dbName,
	}
)
	// @ts-ignore
	.then(function(db) { console.log('Successfully connected to the database: ', db.connections[0]['$dbName']); })
	.catch(function(err) { console.log('Couldn\'t connect to the database: ', err.reason); });
