var config = {}
config.web = {};
config.debug = {};
config.db = {
	'url' : 'mongodb://localhost/test'
};

config.server_name =  'zine-server';
config.web.port = process.env.WEB_PORT || 32768;
config.debug.verbositylevel = 3;
module.exports = config;