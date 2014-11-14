define([
  'angular',
],
function (angular) {
  'use strict';

  angular
    .module('grafana.services')
    .service('datasourceVarSrv', function(datasourceSrv, VariableDatasource) {

      this.init = function(datasourceName) {
        datasourceSrv.add(new VariableDatasource(datasourceName));
      };

    })
    .factory('VariableDatasource', function(datasourceSrv, $rootScope) {

      function VariableDatasource(datasourceName) {
        this.name = 'var';
        var self = this;

        self.__proto__ = datasourceSrv.get(datasourceName);

        $rootScope.onAppEvent('ds-changed', function(e, ds) {
          console.log('ds-changed');
          self.__proto__= datasourceSrv.get(ds);
          console.log(self);
          $rootScope.$broadcast('refresh');
        });
      }

      return VariableDatasource;

    });
});
