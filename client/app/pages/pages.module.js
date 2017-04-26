(function () {
  'use strict';

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.when('/', '/dashboard');
    $urlRouterProvider.otherwise('/dashboard');

    baSidebarServiceProvider.addStaticItem({
      title: 'Login',
      icon: 'fa fa-sign-in',
      stateRef: 'account.login',
      authenticate: false
    });
  }

  angular.module('blurAdminFullstackApp.pages', [
    'ui.router',
    'blurAdminFullstackApp.pages.dashboard',
    'blurAdminFullstackApp.pages.admin',
    'blurAdminFullstackApp.pages.account'
  ]).config(routeConfig);

})();
