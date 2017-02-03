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
			type: "String"
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

// Read all entities, parse and return them as an array of JSON objets
UserDAO.prototype.listByUName = function(limit, offset, sort, order, expanded, username) {

	this.$log.info('Listing USR_USER entity collection expanded['+expanded+'] with list operators: limit['+limit+'], offset['+offset+'], sort['+sort+'], order['+order+'], entityName['+username+']');
	
    var connection = this.datasource.getConnection();
    try {
        var entities = [];
        var sql = "SELECT";
        if (limit !== null && offset !== null) {
            sql += " " + this.datasource.getPaging().genTopAndStart(limit, offset);
        }
        
        sql += " * FROM USR_USER";
        if (username !== undefined && username !== null) {
        	sql += " WHERE USRU_UNAME LIKE '" + username + "%%'";
    	}
        if (sort !== undefined && sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if ((sort !== undefined && sort !== null) && (sort !== undefined && order !== null)) {
            sql += " " + order;
        }
        if ((limit !== undefined && limit !== null) && (offset !== undefined && offset !== null)) {
            sql += " " + this.datasource.getPaging().genLimitAndOffset(limit, offset);
        }

        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
        	var entity = this.createEntity(resultSet);
            entities.push(entity);
        }
        
        this.$log.info('' + entities.length +' USR_USER entities found');
        
        return entities;
    } finally {
        connection.close();
    }
};

exports.get = function(){
	return new UserDAO(orm);
};

})();
