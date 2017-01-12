(function(angular){
"use strict";

	angular.module('users-board', ['users'])
	.controller('Profile', ['$LoggedUser', function($LoggedUser) {
		var self = this;
		$LoggedUser.get()
		.then(function(userData){
			self.user = userData;
		});	
	}])
	.controller('ProfileEdit', ['$window', 'FileUploader', '$LoggedUser', function($window, FileUploader, $LoggedUser){
		var self = this;
		var uploader = this.uploader = new FileUploader();	
		$LoggedUser.get()
		.then(function(userData){
			self.user = userData;
			uploader.url = self.user.avatarUrl;
		});	
		
	    this.uploader.onCompleteItem = function(/*fileItem, response, status, headers*/) {
			//$state.reload();
	    	$LoggedUser.get()
			.then(function(userData){
			 	$window.location.reload();
			});				
	    };
	    this.uploader.onAfterAddingFile = function(/*fileItem*/) {
	    	self.uploader.uploadAll();
	    };
	}]);

})(angular);
