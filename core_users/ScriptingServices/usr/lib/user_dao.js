/* globals $ */
/* eslint-env node, dirigible */
(function(){
"use strict";

var orm = {
	dbName: "USR_USER",
	properties: [
		{
			name: "id",
			dbName: "USRU_ID",
			id: true,
			required: true,
			type: "Long"
		},{
			name: "uname",
			dbName: "USRU_UNAME",
			required: true,
			type: "String",
			size: 255
		},{
			name: "pic",
			dbName: "USRU_PIC",
			type: "String"
		}
	]
};

var DAO = require('daoism/dao').DAO;
var UserDAO = function(orm){
	DAO.call(this, orm, 'User DAO');
};
UserDAO.prototype = Object.create(DAO.prototype);
UserDAO.prototype.constructor = UserDAO;

exports.get = function(){
	return new UserDAO(orm);
};

})();
