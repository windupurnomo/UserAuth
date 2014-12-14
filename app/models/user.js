
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	role: {type: String, default: 'USER'},
	activationCode: String,
	status: {type: Number, default: 0},//0: not active, 1: active, 2: disable
	createdAt: { type: Date, default: Date.now }
});