define([
  'jquery',
  '../core_module',
  '../app_events',
],
function ($, coreModule, appEvents) {
  'use strict';

  appEvents = appEvents.default;

  var editViewMap = {
    'settings':    { src: 'public/app/features/dashboard/partials/settings.html', title: "Settings" },
    'annotations': { src: 'public/app/features/annotations/partials/editor.html', title: "Annotations" },
    'templating':  { src: 'public/app/features/templating/partials/editor.html', title: "Templating" }
  };

  coreModule.default.directive('dashEditorView', function($compile, $location) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        var editorScope;
        var lastEditor;

        function hideEditorPane() {
          if (editorScope) {
            appEvents.emit('dash-editor-hidden', lastEditor);
            editorScope.dismiss();
          }
        }

        function showEditorPane(payload, editview) {
          if (editview) {
            scope.contextSrv.editview = editViewMap[editview];
            payload.src = scope.contextSrv.editview.src;
          }

          if (lastEditor === payload.src) {
            hideEditorPane();
            return;
          }

          hideEditorPane();

          lastEditor = payload.src;
          editorScope = payload.scope ? payload.scope.$new() : scope.$new();

          editorScope.dismiss = function() {
            editorScope.$destroy();
            elem.empty();
            lastEditor = null;
            editorScope = null;

            if (editview) {
              var urlParams = $location.search();
              if (editview === urlParams.editview) {
                delete urlParams.editview;
                $location.search(urlParams);
              }
            }
          };

          var src = "'" + payload.src + "'";
          var view = $('<div class="tabbed-view" ng-include="' + src + '"></div>');

          elem.append(view);
          $compile(elem.contents())(editorScope);
        }

        scope.$watch("dashboardViewState.state.editview", function(newValue, oldValue) {
          if (newValue) {
            showEditorPane({}, newValue);
          } else if (oldValue) {
            scope.contextSrv.editview = null;
            if (lastEditor === editViewMap[oldValue]) {
              hideEditorPane();
            }
          }
        });

        scope.contextSrv.editview = null;

        var sub1 = appEvents.on('hide-dash-editor', hideEditorPane);
        var sub2 = appEvents.on('show-dash-editor', showEditorPane);

        scope.$on("$destroy", function() {
          sub1.unsubscribe();
          sub2.unsubscribe();
          hideEditorPane();
        });
      }
    };
  });
});
