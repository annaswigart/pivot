
if (Meteor.isClient) {

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
angular.module('reflectivePath').controller('HomeSearchController', ['$scope', '$meteor',
'$state', '$meteorCollection', '$meteorSubscribe', '$window',
function($scope, $meteor, $state, $meteorCollection, $meteorSubscribe, $window){   
    
    // search categories and placeholder text
    $scope.searchCategories = [
        {name:'Skill', placeholder: "Skill"},
        {name:'Industry', placeholder: "Industry"},
        {name:'Title', placeholder: "Job Title or Career Name"}
    ];

    // init selected search category
    $scope.selectedCategory = $scope.searchCategories[0];

    // change selected search category
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    }

    // for changing style applied to search category
    $scope.isSelected = function(category) {
        return $scope.selectedCategory === category;
    }


    $scope.query = $window.localStorage.getItem('currentQuery');

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        return $scope.query;
    }

    $scope.appendQueryStack = function(input) {
        currentQueryService.queryStack.push(input);
    }


}]);


// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope', '$meteor', '$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils', '$window',
    function($scope, $meteor, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils, $window){

    $scope.query = $window.localStorage.getItem('currentQuery');

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = _.uniq(JSON.parse($window.localStorage.getItem('queryStack'))).slice(0,4);

    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,4);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        return $scope.query;
    }
    
    $scope.numResultsDisplayed = 10;

    $scope.showMoreResults = function() {
            $scope.numResultsDisplayed += 10;
    }


    $scope.resultsLoading = true;
    
    $meteor.autorun($scope, function() {
        $meteor.subscribe('careers', {
            limit:  parseInt($scope.getReactively('numResultsDisplayed')),
            sort: {num_ids: -1},
            reactive: false,
        }, $scope.getReactively('query')).then(function(sub){

            $scope.careers = $meteor.collection(function() {
                return Careers.find({});
                //return Careers.find({limit: $scope.getReactively('numResultsDisplayed')});
            });
            
            $scope.resultsLoading = false;
        });
    });
    

    // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(career){
        if (_.contains($scope.pinnedCareers, career)) {
            $scope.pinnedCareers = _.without($scope.pinnedCareers, career);
            $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
        } else {
            $scope.pinnedCareers.push(career);
            $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
        }
    }

    // apply class to pinned careers
    $scope.isPinned = function(career) {
        return _.contains($scope.pinnedCareers, career);
    }

}]);



// ***********************************
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope',
'$meteorSubscribe', '$stateParams', '$meteorObject', '$meteorCollection', '$meteorUtils',
function($scope, $meteorSubscribe, $stateParams, $meteorObject, $meteorCollection, $meteorUtils){


}]); 


// ***********************************
// CompareViewController
// ***********************************
angular.module('reflectivePath').controller('CompareViewController', ['$scope',
'$state', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject){



}]);


} //if Meteor isClient
