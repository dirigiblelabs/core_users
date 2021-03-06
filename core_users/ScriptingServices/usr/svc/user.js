/* globals $ */
/* eslint-env node, dirigible */

"use strict";

function unescapePath(path){
	return path.replace(/\\/g, '');
}

var HttpController = require('arestme/http').HttpController;
var UserService = function(){
	HttpController.call(this);
	this.logger = require('log/loggers').get('usr/UserService');
};

UserService.prototype = Object.create(HttpController.prototype);
UserService.prototype.constructor = UserService;

var userDataService = new UserService()
.addResourceHandler('$current', 'get', function(context, io){
	var self = userDataService;
    try{
    	var userLib = require('net/http/user');
    	
    	var userName = userLib.getName();
    	if(userName === undefined || userName === null){
    		self.logger.error("Getting currently logged in user yielded no user principal in the request. Either this is annonymous request or the resource is not protected.");
    		self.sendError(io, 404, 404, "Not Found");
    		return;
		}
    	var documentPath = unescapePath(userLib.getName());
    	try{ 							
			var documentLib = require('docs_explorer/lib/document_lib');
			var document = documentLib.getDocument(documentPath);
			if(!document.getName())
				documentPath = undefined;
		} catch(docerr){
			documentPath = undefined;						
		}
		var avatarurl = documentPath?'/services/js/usr/svc/user.js/$pics/'+ documentPath:undefined;

    	var currentUser = {
    		uname: userLib.getName(),
    		avatarUrl: avatarurl
    	};

        var jsonResponse = JSON.stringify(currentUser, null, 2);
    	io.response.println(jsonResponse);
	} catch(e) {
	    var errorCode = io.response.INTERNAL_SERVER_ERROR;
	    self.logger.error(e.message, e);
    	self.sendError(errorCode, errorCode, e.message);
    	throw e;
	}			
})
.addResourceHandlers({
	"$pics/{userid}": {		
		"get": {
			handler: function(context, io){
				var self = userDataService;
				try{
					var userid = context.pathParams.userid;
					var documentPath = '/'+userid;
					if (documentPath)
						documentPath = unescapePath(documentPath);
					var documentLib = require('docs_explorer/lib/document_lib');
					var document = documentLib.getDocument(documentPath);
					var contentStream;
					try {
						contentStream = documentLib.getDocumentStream(document);
					} catch(ioe) {
						self.logger.info('Requested resource not found: ' + documentPath);
						self.sendError(io.response.NOT_FOUND, io.response.NOT_FOUND, "Not found");
						return;
					}
					var contentType = contentStream.getInternalObject().getMimeType();
					io.response.setContentType(contentType);
					io.response.writeStream(contentStream.getStream());
				} catch(e) {
		    	    var errorCode = io.response.INTERNAL_SERVER_ERROR ;
		    	    self.logger.error(e.message, e);
		        	self.sendError(errorCode, errorCode, e.message);
		        	throw e;
				}	
			}
		},
		"post": {
			handler: function(context, io){
				var self = userDataService;
				var userid = context.pathParams.userid;
				var userLib = require('net/http/user');
				if(!userLib.isInRole('owner') && userLib.getName() !== userid){
					self.logger.error('Unauthorized for access: user['+userLib.getName()+']');
		        	self.sendError(403, 403, "Unauthorized");
		        	return;
				}
				var documentLib = require('docs_explorer/lib/document_lib');
				var folderLib = require('docs_explorer/lib/folder_lib');
			    try{
	
					var upload = require('net/http/upload');
					var result = [];
					if (upload.isMultipartContent()) {
						var documents = upload.parseRequest();
						if(documents && documents.length){
							var folder = folderLib.getFolder('/');
							documents[0].name = userid;
							result.push(documentLib.uploadDocument(folder, documents[0]));
						}
					}
			        var jsonResponse = JSON.stringify(result , null, 2);
			    	io.response.println(jsonResponse);
				} catch(e) {
		    	    var errorCode = io.response.INTERNAL_SERVER_ERROR ;
		    	    self.logger.error(e.message, e);
		        	self.sendError(errorCode, errorCode, e.message);
		        	throw e;
				}			
			}
		}		
	}
});

userDataService.service();
