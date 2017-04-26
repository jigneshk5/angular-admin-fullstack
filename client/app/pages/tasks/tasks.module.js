(function() {
	'use strict';

	function routeConfig($stateProvider) {
		$stateProvider
			.state('tasks', {
				url: '/tasks',
				templateUrl: 'app/pages/tasks/tasks.html',
				title: 'Tasks',
				controller: 'TasksController',
				controllerAs: 'ctr',
				sidebarMeta: {
					order: 3,
					icon: 'fa fa-car'
				},
				authenticate: true
			});
	}

	angular.module('blurAdminFullstackApp.pages.tasks', [])
	.config(routeConfig);
})();
