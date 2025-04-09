'use strict';

/**
 * @ngdoc overview
 * @name mediathequeApp
 * @description
 * # mediathequeApp
 *
 * Main module of the application.
 */

// Declare app level module which depends on views, and components
angular.module('mediathequeApp', ['ngSanitize','ngResource','ui.bootstrap'/*,'ngRoute'*/])

.config(function($httpProvider) {

  //$httpProvider.interceptors.push('myHttpInterceptor');
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;char+set=UTF-8';
})

// allow DI for use in controllers, unit tests
.constant('_', window._)
// use in views, ng-repeat="x in _.range(3)"

.run(function ($rootScope) {
   $rootScope._ = window._;
   $rootScope.titrePopin = "";
});
