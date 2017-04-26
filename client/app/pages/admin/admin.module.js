(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<div ui-view></div>',
        abstract: true,
        title: 'Admin',
        sidebarMeta: {
          icon: 'fa fa-lock',
          order: 20
        },
        authenticate: true
      });
  }

  angular.module('blurAdminFullstackApp.pages.admin', [
    'blurAdminFullstackApp.pages.admin.users',
    'blurAdminFullstackApp.pages.admin.signup',
    'blurAdminFullstackApp.pages.admin.server'
  ]).config(routeConfig);
})();
