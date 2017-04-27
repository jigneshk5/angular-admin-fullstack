(function () {
  'use strict';

  class HomeController {

    constructor(Auth) {
      this.Auth = Auth;
    }

  }

  angular.module('angularAdminFullstackApp.pages.home')
    .controller('HomeController', HomeController);
})();
