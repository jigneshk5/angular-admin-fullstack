(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        template: '<div ui-view></div>',
        abstract: true,
        title: 'Account',
        sidebarMeta: {
          icon: 'fa fa-user',
          order: 30
        },
        authenticate: true
      });
  }

  angular.module('blurAdminFullstackApp.pages.account', [
    'blurAdminFullstackApp.pages.account.login',
    'blurAdminFullstackApp.pages.account.logout',
    'blurAdminFullstackApp.pages.account.settings'
  ]).config(routeConfig);
})();
