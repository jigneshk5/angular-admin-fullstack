(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/pages/home/home.html',
        controller: 'DashboardController',
        controllerAs: 'ctr',
        title: 'Home',
        sidebarMeta: {
          icon: 'fa fa-tachometer',
          order: 0
        },
        authenticate: false
      });
  }

  angular.module('angularAdminFullstackApp.pages.home', [
  ]).config(routeConfig);
})();
