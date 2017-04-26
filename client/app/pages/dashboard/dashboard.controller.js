(function () {
  'use strict';

  class DashboardController {

    constructor(Auth) {
      this.Auth = Auth;
    }

  }

  angular.module('blurAdminFullstackApp.pages.dashboard')
    .controller('DashboardController', DashboardController);
})();
