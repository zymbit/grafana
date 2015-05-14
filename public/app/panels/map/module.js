define([
  'angular',
  'app',
  'lodash',
  'require',
  'components/panelmeta',
  './leaflet/mapbox',
],
function (angular, app, _, require, PanelMeta) {
  'use strict';

  var module = angular.module('grafana.panels.map', []);
  app.useModule(module);

  module.directive('grafanaPanelMap', function() {
    return {
      controller: 'MapPanelCtrl',
      templateUrl: 'app/panels/map/module.html',
    };
  });

  module.controller('MapPanelCtrl', function($scope, panelSrv) {

    $scope.panelMeta = new PanelMeta({
      panelName: 'Text',
      editIcon:  "fa fa-text-width",
      fullscreen: true,
    });

    // Set and populate defaults
    var _d = {
    };

    _.defaults($scope.panel, _d);

    $scope.init = function() {
      panelSrv.init($scope);
      $scope.editor = { index: 0 };
    };

    $scope.refreshData = function() {
      $scope.panelMeta.loading = false;
      $scope.render();
    };

    var map;

    $scope.render = function() {
      if (!map) {
        map = L.mapbox.map('map', 'examples.map-y7l23tes').setView([37.9, -77], 5);
        // map = L.map('map').setView([51.505, -0.09], 13);
        // // add an OpenStreetMap tile layer
        // Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo(map);
      }
    };

    $scope.init();
  });
});
