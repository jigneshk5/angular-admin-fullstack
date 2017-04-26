(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('account.settings', {
        parent: 'account',
        url: '/settings',
        templateUrl: 'app/pages/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        title: 'Settings',
        sidebarMeta: {
          order: 5
        },
        authenticate: true
      });
  }

  angular.module('blurAdminFullstackApp.pages.account.settings', [])
    .config(routeConfig);
})();
