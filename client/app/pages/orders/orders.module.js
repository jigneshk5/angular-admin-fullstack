(function() {
	'use strict';

	function routeConfig($stateProvider) {
		$stateProvider
			.state('orders', {
				url: '/orders',
				templateUrl: 'app/pages/orders/orders.html',
				title: 'Orders',
				controller: 'OrdersController',
				controllerAs: 'ctr',
				sidebarMeta: {
					order: 10,
					icon: 'fa fa-list-ol'
				},
				authenticate: true
			});
	}

	angular.module('blurAdminFullstackApp.pages.orders', [])
	.config(routeConfig);
})();
