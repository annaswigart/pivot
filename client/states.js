angular.module('reflectivePath').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){
    // debugger;
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: '/',
            views: {
                navBar: {
                    templateUrl: 'client/templates/nav-bar.tpl',
                    controller: 'NavBarController'
                },
                // search box-- initial view
                main: {
                    templateUrl: 'client/templates/home-search.tpl',
                    controller: 'HomeSearchController'
                }
            },
        })
        .state('navBar', {
            url: '/',
            views: {
                
                navBar: {
                    templateUrl: 'client/templates/nav-bar.tpl',
                    controller: 'NavBarController'
                }
            }
        })
        .state('results', {
            url: '/results/:query', //query terms should probably be in the URL
            views: {
                // search results
                'main@': {
                    templateUrl: 'client/templates/results.tpl',
                    controller: 'ResultsController'
                }
            }
        })
        .state('results.careerView', {
            url: '/results/:query/:careerId',
            views: {
                // view that lets user drill into a career
                'main@': {
                    templateUrl: 'client/templates/view-career.tpl',
                    controller: 'CareerViewController'
                }
            }
        })
        .state('results.compareCareers', {
            url: '/results/:query/:careerId1/:careerId2',
            views: {
                // view that lets user compare two careers at a time
                "main@": {
                    templateUrl: 'client/templates/compare-careers.tpl',
                    controller: 'CompareViewController'
                }
            }
        })
}]);
