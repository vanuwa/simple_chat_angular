/**
 * Created by ivan on 12/4/13.
 */
(function () {
	"use strict";

	var urls = {
		getUsers: "list_users_json",
		getMessages: "last_messages_json",
		getLastMessage: "last_messages_json?limit=1",
		createMessage: "post_message"
	};

	var app = angular.module('MyApp', ['ngCookies']).
				config(['$httpProvider', '$interpolateProvider', function($httpProvider, $interpolateProvider) {
						$interpolateProvider.startSymbol('<%');
						$interpolateProvider.endSymbol('%>');
						$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
					}]);
	app.run(['$http', '$cookies', function($http, $cookies) {
			$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
		}]);

	app.controller('ChatController', function ($scope, $http) {
		var intervalId;
		var requestUsers = function (callback) {
			$http.get(urls.getUsers)
				.success(function (response) {
					callback(null, response.users);
				})
				.error(function (response) {
					callback(response, null);
				});
		};

		var requestMessages = function (callback) {
			$http.get(urls.getMessages)
				.success(function (response) {
					callback(null, response.messages);
				})
				.error(function (response) {
					callback(response, null);
				});
		};

		$scope.getModels = function () {
			async.parallel({
				users: requestUsers,
				messages: requestMessages
			}, function (errors, results) {
				if (errors) {
					console.error("[ OOPS ] ", response);
				} else {
					console.log("getModels ", results);

					/* assign messages to user */
					_.forEach(results.users, function (item) {
						item.messages = _.first(_.filter(results.messages, {"author": item.id}));
					});

					/* assign author to message */
					_.forEach(results.messages, function (item) {
						item.author = _.find(results.users, {"id": item.author})
					});

					$scope.messages = results.messages;
					$scope.users = results.users;
				}
			});
		};

		var isNewMessageExists = function (callback) {
			$http.get(urls.getLastMessage)
				.success(function (response) {
					var lastClientMessageTime = new Date(_.last($scope.messages).sent).getTime();
					var lastServerMessageTime = new Date(response.messages[0].sent).getTime();
					if (lastClientMessageTime < lastServerMessageTime) {
						callback(null, true);
					}
				})
				.error(function (response) {
					callback(response, null);
				});
		};

		$scope.createMessage = function () {
			if ($scope.text) {
				$http.post(urls.createMessage, $(".b-chat-room__enter-new-message form:eq(0)").serialize()).success(function (response) {
						$scope.text = "";
						$scope.getModels();
					}).error(function (response) {
						console.log(" [ NOPE ] ", response);
					});
			}
		};

		$scope.startMessageChecker = function () {
			intervalId = setInterval(function () {
				isNewMessageExists(function (error, isExist) {
					if (isExist) {
						$scope.getModels();
					}
				});
			}, 3000);
		};

		$scope.letMeStart = function () {
			$scope.getModels();
			$scope.startMessageChecker();

			$('.hastip').tooltipsy({
				offset: [-10, 0],
				css: {
					'padding': '10px',
					'max-width': '200px',
					'color': '#303030',
					'background-color': '#f5f5b5',
					'border': '1px solid #deca7e',
					'-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
					'-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
					'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
					'text-shadow': 'none'
				}
			});
		};
	});
}());