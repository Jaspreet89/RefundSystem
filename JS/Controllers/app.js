
(function() {

    'use strict';

    angular
        .module('RefundSystemApp', ['ui.router', 'satellizer'])
        .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide,$locationProvider) {

            function redirectWhenLoggedOut($q, $injector) {

                return {
                    responseError: function(rejection) {
                        var $state = $injector.get('$state');
                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
                        angular.forEach(rejectionReasons, function(value, key) {
                            if(rejection.data.error === value) {
                                localStorage.removeItem('user');
                                $state.go('auth');
                            }
                        });
                        return $q.reject(rejection);
                    }
                }
            }


            $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
            $httpProvider.interceptors.push('redirectWhenLoggedOut');
            $authProvider.loginUrl = configuration.path+'/api/authenticate';
            $urlRouterProvider.otherwise('/auth');
            $stateProvider
                .state('auth', {
                    url:'/auth',
                    templateUrl: '../resources/views/AuthView.blade.php',
                    controller: 'AuthController as auth'
                })
                .state('users', {
                    url: '/users',
                    templateUrl: '../resources/views/UserView.blade.php',
                    controller: 'UserController as user'
                })
                .state('sellerrefundform', {
                    url: '/sellerrefundform',
                    templateUrl: '../resources/views/SellerRefundForm.blade.php',
                    controller: 'SellerRefundFormCtrl as sellerrefundform'
                })
                .state('manageuser', {
                    url: '/manageuser',
                    templateUrl: '../resources/views/ManageUser.blade.php',
                    controller: 'ManageUserCtrl as manageuser'
                })
                .state('warehouse', {
                    url: '/warehouse',
                    templateUrl: '../resources/views/Warehouse.blade.php',
                    controller: 'WarehouseCtrl as warehouse'
                });
        })
        .run(function($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
                 user = JSON.parse(localStorage.getItem('user'));
                if(user) {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser = user;
                    if(toState.name === "auth") {
                        event.preventDefault();
                        if(fromState.name === ""){
                            $state.go('users');
                        }
                    }
                }
            });
        });
})();