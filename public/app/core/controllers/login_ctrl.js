define([
  'angular',
  '../core_module',
  'app/core/config',
],
function (angular, coreModule, config) {
  'use strict';

  function getAuthFromCookie() {
    var redirectTo = getCookie('redirect_to');
    if(redirectTo !== '') {
      var redirectToDecoded = decodeURIComponent(decodeURIComponent(redirectTo));
      var components = redirectToDecoded.split('?', 2)[1].split('&');

      for(var i=0; i<components.length; i++) {
        var kv = components[i].split('=', 2);
        if(kv[0] === 'auth') {
          return kv[1].split(':', 2);
        }
      }
    }
  }

  // http://www.w3schools.com/js/js_cookies.asp
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)===' ') { c = c.substring(1); }
      if (c.indexOf(name) === 0) { return c.substring(name.length,c.length); }
    }
    return "";
  }

  coreModule.default.controller('LoginCtrl', function($scope, backendSrv, contextSrv, $location, $timeout) {
    $scope.formModel = {
      user: '',
      email: '',
      password: '',
    };

    contextSrv.sidemenu = false;

    $scope.googleAuthEnabled = config.googleAuthEnabled;
    $scope.githubAuthEnabled = config.githubAuthEnabled;
    $scope.oauthEnabled = config.githubAuthEnabled || config.googleAuthEnabled;
    $scope.disableUserSignUp = config.disableUserSignUp;
    $scope.loginHint     = config.loginHint;

    $scope.loginMode = true;
    $scope.submitBtnText = 'Log in';

    $scope.init = function() {
      $scope.$watch("loginMode", $scope.loginModeChanged);

      var params = $location.search();
      if (params.failedMsg) {
        $scope.appEvent('alert-warning', ['Login Failed', params.failedMsg]);
        delete params.failedMsg;
        $location.search(params);
      }

      // TODO: make an angular component out of this?
      $timeout(function () {
        var auth = getAuthFromCookie();
        if(auth) {
          $scope.formModel.user = auth[0];
          $scope.formModel.password = auth[1];

          $scope.loginForm.$valid = true;

          $scope.submit();
        }
      });
    };

    // build info view model
    $scope.buildInfo = {
      version: config.buildInfo.version,
      commit: config.buildInfo.commit,
      buildstamp: new Date(config.buildInfo.buildstamp * 1000)
    };

    $scope.submit = function() {
      if ($scope.loginMode) {
        $scope.login();
      } else {
        $scope.signUp();
      }
    };

    $scope.loginModeChanged = function(newValue) {
      $scope.submitBtnText = newValue ? 'Log in' : 'Sign up';
    };

    $scope.signUp = function() {
      if (!$scope.loginForm.$valid) {
        return;
      }

      backendSrv.post('/api/user/signup', $scope.formModel).then(function(result) {
        if (result.status === 'SignUpCreated') {
          $location.path('/signup').search({email: $scope.formModel.email});
        } else {
          window.location.href = config.appSubUrl + '/';
        }
      });
    };

    $scope.login = function() {
      delete $scope.loginError;

      if (!$scope.loginForm.$valid) {
        return;
      }

      backendSrv.post('/login', $scope.formModel).then(function(result) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          window.location.href = config.appSubUrl + '/';
        }
      });
    };

    $scope.init();
  });
});
