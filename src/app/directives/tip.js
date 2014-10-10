define([
  'angular',
  'kbn',
],
function (angular, kbn) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('tip', function($compile) {
      return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
          var _t = '<i class="grafana-tip icon-'+(attrs.icon||'question-sign')+'" bs-tooltip="\''+
            kbn.addslashes(elem.text())+'\'"></i>';
          elem.replaceWith($compile(angular.element(_t))(scope));
        }
      };
    });

  angular
    .module('grafana.directives')
    .directive('editorOptBool', function($compile) {
      return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
          var ngchange = attrs.change ? (' ng-change="' + attrs.change + '"') : '';
          var tip = attrs.tip ? (' <tip>' + attrs.tip + '</tip>') : '';
          var showIf = attrs.showIf ? (' ng-show="' + attrs.showIf + '" ') : '';

          var template = '<div class="editor-option text-center"' + showIf + '>' +
                         ' <label for="' + attrs.model + '" class="small">' +
                           attrs.text + tip + '</label>' +
                          '<input class="cr1" id="' + attrs.model + '" type="checkbox" ' +
                          '       ng-model="' + attrs.model + '"' + ngchange +
                          '       ng-checked="' + attrs.model + '"></input>' +
                          ' <label for="' + attrs.model + '" class="cr1"></label>';
          elem.replaceWith($compile(angular.element(template))(scope));
        }
      };
    });

  angular.module('grafana.directives')
    .directive('gfTip', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var getter = $parse(attrs.gfTip), setter = getter.assign, value = getter(scope);
          var my = attrs.my || 'top center';
          var at = attrs.at || 'bottom center';
          var content;

          if (value) {
            content = { 'text': value, title: 'This is a just a test' };
          }
          else {
            content = attrs.content;
          }

          element.qtip({
            content: content,
            position: {
              my: my,
              at: at,
            },
            style: { classes: 'qtip-dark' }
          });
        }
      };
    });

});
