const dotenv = require('dotenv'); // Loads environment variables from a .env file into process.env.
dotenv.config();

const {
    NODE_ENV = 'test',
    PORT,
    IP = '0.0.0.0',
} = process.env;

// Common config. I.E. name, version, max players, etc.
const common_conf = {
    name: 'mmo server',
    version: "0.0.1",
    environment: NODE_ENV,
    maxPlayers: 100,
    data_paths: {
        items: `${__dirname}/game_data/items`,
        maps: `${__dirname}/game_data/maps`,
    },
    starting_zone: 'map_home'
};

// Environment specific configurations.
const conf = {
    production: {
        ip: IP,
        port: Number(PORT) || 8081,
        // TODO: Add database address and name to env file.
        database: 'mongodb+srv://superuser:robfran0310@cluster0-midna.mongodb.net/test?retryWrites=true&w=majority',
        dbName: 'mmorpg',
    },
    test: {
        ip: IP,
        port: Number(PORT) || 8082,
        // TODO: Add database address and name to env file.
        database: 'mongodb+srv://superuser:robfran0310@cluster0-midna.mongodb.net/test?retryWrites=true&w=majority',
        dbName: 'mmorpg',
    }
}

Object.assign(conf.production, common_conf);
Object.assign(conf.test, common_conf);

const config = conf[NODE_ENV];

module.exports = config;
