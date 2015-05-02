angular.module('reflectivePath').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){
    // debugger;
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: '/',
            views: {
                navBar: {
                    templateUrl: 'client/templates/nav-bar.ng.html',
                    controller: 'NavBarController'
                },
                // search box-- initial view
                main: {
                    templateUrl: 'client/templates/home-search.ng.html',
                    controller: 'HomeSearchController'
                }
            },
        })
        
        .state('results', {
            url: '/results/:queryString', //query terms should probably be in the URL
            views: {
                navBar: {
                    templateUrl: 'client/templates/nav-bar.ng.html',
                    controller: 'NavBarController'
                },
                // search results
                'main@': {
                    templateUrl: 'client/templates/results.ng.html',
                    controller: 'ResultsController'
                },
                'sidebar@': {
                    templateUrl: 'client/templates/sidebar.ng.html',
                    controller: 'SidebarController'
                }
            }
        })

        .state('careerView', {
            url: '/:careerId',
            views: {
                navBar: {
                    templateUrl: 'client/templates/nav-bar.ng.html',
                    controller: 'NavBarController'
                },
                // view that lets user drill into a career
                'main@': {
                    templateUrl: 'client/templates/view-career.ng.html',
                    controller: 'CareerViewController'
                },
                'sidebar@': {
                    templateUrl: 'client/templates/sidebar.ng.html',
                    controller: 'SidebarController'
                }
            }
        })
        .state('compareView', {
            url: '/compare/:careerId1&:careerId2',
            views: {
                navBar: {
                    templateUrl: 'client/templates/nav-bar.ng.html',
                    controller: 'NavBarController'
                },
                // view that lets user compare two careers at a time
                "main@": {
                    templateUrl: 'client/templates/compare-careers.ng.html',
                    controller: 'CompareViewController'
                },
                'sidebar@': {
                    templateUrl: 'client/templates/sidebar.ng.html',
                    controller: 'SidebarController'
                }
            }
        })
}]);
