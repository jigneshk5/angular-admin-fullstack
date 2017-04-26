(function() {
	'use strict';

	function routeConfig($stateProvider) {
		$stateProvider
			.state('times', {
				url: '/times',
				templateUrl: 'app/pages/times/times.html',
				title: 'Times',
				controller: 'TimesController',
				controllerAs: 'ctr',
				sidebarMeta: {
					order: 8,
					icon: 'fa fa-clock-o'
				},
				authenticate: true
			});
	}

	angular.module('blurAdminFullstackApp.pages.times', [])
	.config(routeConfig);
})();
