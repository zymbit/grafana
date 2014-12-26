define([
  'angular',
  'lodash'
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('SubmenuCtrl', function($scope, $q, $rootScope, templateValuesSrv, datasourceSrv) {
    var _d = {
      enable: true
    };

    _.defaults($scope.pulldown,_d);

    $scope.init = function() {
      $scope.panel = $scope.pulldown;
      $scope.row = $scope.pulldown;
      $scope.variables = $scope.dashboard.templating.list;
      $scope.datasources = datasourceSrv.getMetricSources();
      $scope.currentDatasource = $scope.datasources[0].name;
    };

    $scope.disableAnnotation = function (annotation) {
      annotation.enable = !annotation.enable;
      $rootScope.$broadcast('refresh');
    };

    $scope.setVariableValue = function(param, option) {
      templateValuesSrv.setVariableValue(param, option);
    };

    $scope.setDatasource = function(datasource) {
      $scope.appEvent('ds-changed', datasource.name);
      $scope.currentDatasource = datasource.name;
    };

    $scope.init();

  });

});
