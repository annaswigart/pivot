
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
'$state', '$meteorCollection', '$meteorSubscribe', 'currentQueryService',
function($scope, $state, $meteorCollection, $meteorSubscribe, currentQueryService){   

    // $scope.resultsLoading = true;

    // // $meteorSubscribe.subscribe('jobs').then(function(sub){
    // //     $scope.jobs = $meteorCollection(function(){
    // //         return Jobs.find({});
    // //     });
    // // });

    // $meteorSubscribe.subscribe('careers').then(function(sub){
    //     $scope.careers = $meteorCollection(function(){
    //         return Careers.find({});
    //     });
    //     $scope.resultsLoading = false;
        
    // });

    $scope.setQuery = function(input) {
        $scope.query = currentQueryService.setQuery(input);
        console.log($scope.query);
        console.log("Get query " + currentQueryService.getCurrentQuery());
        return $scope.query;
    }

    // $scope.query = currentQueryService.query;
    // console.log($scope.query);

}]);

// Query field, shared across controllers
angular.module('reflectivePath').service('currentQueryService', function () {

    return {
        query: 'sales',
        getCurrentQuery: function () {
            return query;
        },
        setQuery: function(input) {
            var split = input.split(" ");
            query = split.join("+");
            return query;

        },
    };
});




// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope','$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils', 'currentQueryService',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils, currentQueryService){

    $scope.resultsLoading = true;

    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Jobs.find({}, {reactive: false}).fetch();
    //     });
    // });

    $meteorSubscribe.subscribe('careers').then(function(sub){
        $scope.careers = $meteorCollection(function(){
            return Careers.find({});
        });

        // Pagination
        $scope.currentPage = 0; 
        $scope.pageSize = 20;
        $scope.setCurrentPage = function(currentPage) {
            $scope.currentPage = currentPage;
        }

        $scope.getNumberAsArray = function (num) {
            return new Array(num);
        };

        $scope.numberOfPages = function() {
            return Math.ceil($scope.careers.length/ $scope.pageSize);
        };

        $scope.resultsLoading = false;

    });

    $scope.setQuery = function(input) {
        $scope.query = currentQueryService.setQuery(input);
        console.log($scope.query);
        return $scope.query;
    }

    $scope.query = currentQueryService.getCurrentQuery();

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
