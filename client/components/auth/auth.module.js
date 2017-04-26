'use strict';

angular.module('blurAdminFullstackApp.auth', ['blurAdminFullstackApp.constants',
    'blurAdminFullstackApp.util', 'ngCookies', 'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
