
// ***********************************
// NavBarController
// ***********************************
angular.module('reflectivePath').controller('NavBarController', ['$scope',
'$state', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject) {



}]);



// ***********************************
// HomeSearchController
// ***********************************
angular.module('reflectivePath').controller('HomeSearchController', ['$scope',
'$state', '$meteorCollection', '$meteorSubscribe', '$window', 'currentQueryService',
function($scope, $state, $meteorCollection, $meteorSubscribe, $window, currentQueryService){   


    $scope.query = $window.localStorage.getItem('currentQuery');
    $scope.queryStackData = JSON.parse($window.localStorage.getItem('queryStack'));

   $scope.setQuery = function(input) {
        //set query
        $scope.query = currentQueryService.setQuery(input);
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        currentQueryService.queryStack = $scope.queryStackData;
        $scope.appendQueryStack(input);
        $window.localStorage.queryStack = JSON.stringify(currentQueryService.queryStack);
        $scope.queryStackData = JSON.parse($window.localStorage.queryStack);
       
        return $scope.query;
    }

    $scope.appendQueryStack = function(input) {
        currentQueryService.queryStack.push(input);
    }

}]);

// Query field, shared across controllers
angular.module('reflectivePath').service('currentQueryService', function () {

    var queryInit = '';
    var queryStackInit = []
    return {
        query: queryInit,
        queryStack: queryStackInit,
        getCurrentQuery: function () {
            // localstorage['currentQuery'] = query;
            return query;
        },
        setQuery: function(input) {
            var split = input.split(" ");
            query = split.join("+");
            // localstorage['queryStack'] = query
            return query;
        },

        getQueryStack: function() {
            // localstorage['queryStack'] = queryStack;
            return queryStack;
        }
    };
});


// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope','$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils', '$window', 'currentQueryService',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils, $window, currentQueryService){

    $scope.resultsLoading = true;
    // $scope.$storage = $localStorage;

    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Jobs.find({}, {reactive: false}).fetch();
    //     });
    // });

    $meteorSubscribe.subscribe('careers').then(function(sub){
        $scope.careers = $meteorCollection(function(){
            return Careers.find({}, {sort: {num_ids: -1}});
        });


        // Pagination
        $scope.filteredCareers = $scope.careers;

        $scope.currentPage = 0; 
        $scope.pageSize = 20;
        $scope.setCurrentPage = function(currentPage) {
            $scope.currentPage = currentPage;
        }

        $scope.getNumberAsArray = function (num) {
            return new Array(num);
        };

        $scope.numberOfPages = function() {
            return Math.ceil($scope.filteredCareers.length/ $scope.pageSize);
        };

        $scope.resultsLoading = false;

    });

    $scope.query = $window.localStorage.getItem('currentQuery');
    $scope.queryStackData = JSON.parse($window.localStorage.getItem('queryStack'));
    console.log('init query stack: ' + $scope.queryStack);

    $scope.setQuery = function(input) {
        //set query
        $scope.query = currentQueryService.setQuery(input);
        $window.localStorage.currentQuery = $scope.query;
        console.log($scope.query);

        //update query stack
        $scope.appendQueryStack(input);
        $window.localStorage.queryStack = JSON.stringify(currentQueryService.queryStack);
        $scope.queryStackData = JSON.parse($window.localStorage.queryStack);
       
        
        console.log('localstorage querystack: ' + $window.localStorage.queryStack);
        return $scope.query;
    }

    $scope.appendQueryStack = function(input) {
        currentQueryService.queryStack.push(input);
        console.log('Query stack service: ' + currentQueryService.queryStack);
        console.log('localstorage querystack: ' + localStorage['queryStack'])
    }
    

    // $scope.skills = _.chain(jobs)
    //             .groupBy('skills')
    //             .map(function(value, key) {
    //                 return {
    //                     standardized_title: key,
    //                     skills: _.chain(_.flatten(_.pluck(value, "skills")))
    //                                     .groupBy(function(skill) {return skill;})
    //                                     .sortBy(function(skill) { return -skill.length;}) //sort descending by frequency
    //                                     .flatten()
    //                                     .uniq()
    //                                     .value(),
    //                     categories: _.chain(_.flatten(_.pluck(value, "category")))
    //                                     .groupBy(function(cat) {return cat;})
    //                                     .sortBy(function(cat) { return -cat.length;}) //sort descending by frequency
    //                                     .flatten()
    //                                     .uniq()
    //                                     .value(),
    //                     job_ids: _.flatten(_.pluck(value, "job_id")),
    //                     num_ids: _.flatten(_.pluck(value, "job_id")).length
    //                 }
    //             })                        


    $scope.checkState = function(name){
        return $state.current.name == name;
    }


}]);

// Start from filter
angular.module('reflectivePath').filter('startFrom', function() {
    return function(input, start) {         
        return input.slice(start);
    };
});


// ***********************************
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope',
'$meteorSubscribe', '$stateParams', '$meteorObject', '$meteorCollection', '$meteorUtils',
function($scope, $meteorSubscribe, $stateParams, $meteorObject, $meteorCollection, $meteorUtils){


    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Datasets.find({});
    //     });
    // });

    // $scope.checkState = function(name){
    //     return $state.current.name == name;
    // }
}]); 


// ***********************************
// CompareViewController
// ***********************************
angular.module('reflectivePath').controller('CompareViewController', ['$scope',
'$state', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject){

    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Datasets.find({});
    //     });
    // });

    // $scope.checkState = function(name){
    //     return $state.current.name == name;
    // }


}]);
