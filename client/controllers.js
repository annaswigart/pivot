// (function(){
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
'$state', '$window', function($scope, $meteor, $state, $window){   
    
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
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    }

    $scope.appendQueryStack = function(input) {
        currentQueryService.queryStack.push(input);
    }


}]);

// ***********************************
// SidebarController
// ***********************************
angular.module('reflectivePath').controller('SidebarController', ['$scope', '$meteor',
 '$stateParams', '$state', '$window',
function($scope, $meteor, $stateParams, $state, $window){

    $scope.query = $window.localStorage.getItem('currentQuery');
    
    if ($scope.submittedQuery == undefined) {
        $scope.submittedQuery = $scope.query;
    }

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = _.uniq(JSON.parse($window.localStorage.getItem('queryStack'))).slice(0,3);

    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    }

   
    $scope.showMoreResults = function() {
            var numLeft = $scope.careers.length - $scope.numResultsDisplayed
            $scope.numResultsDisplayed += Math.min(10, numLeft);
    }

    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    $scope.viewCareer = function(careerName, careerId) {
        var viewedCareer = {name: careerName, id: careerId};
        var oldViewed = $scope.viewedCareers.slice(); // makes copy of viewed careers object

        oldViewed.unshift(viewedCareer);
        $scope.viewedCareers = _.uniq(oldViewed, 'id').slice(0,3);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);   
    }
    

    // **** PINNED CAREERS ****

        // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        var pinnedCareer = {name: careerName, id: careerId};

        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }

        // if career id is pinned, remove it
        if (_.contains(pinnedIds, careerId)) {
            // remove id from pinned list
            pinnedIds = _.without(pinnedIds, careerId);

            var listCopy = [];
            // for each pinnedId, add pinnedCareer object to listCopy
            for (var i = 0; i < pinnedIds.length; i++) {
                listCopy.push(_.findWhere($scope.pinnedCareers, {id: pinnedIds[i]}));
            }
            // update pinnedCareers (pin removed)
            $scope.pinnedCareers = listCopy;
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {
        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }
        // return true if pinnedIds contains careerId
        return _.contains(pinnedIds, careerId);
    }


    // **** COMPARE CAREERS ****

    // init compared careers in local storage
    if($window.localStorage.getItem("checkedCareers") === null){
        $window.localStorage.comparedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.comparedCareers = JSON.parse($window.localStorage.comparedCareers);

    // toggle compared career (check / uncheck)
    $scope.toggleComparedCareer = function(careerId) {
        if (_.contains($scope.comparedCareers, careerId)) {
            $scope.comparedCareers = _.without($scope.comparedCareers, careerId);
        } else {
            $scope.comparedCareers.push(careerId);
        }
        $scope.comparedCareers = $scope.comparedCareers.slice(0,2);
        $window.localStorage.comparedCareers = JSON.stringify($scope.comparedCareers);
    }

    // apply checkbox style if checked
    $scope.isCompared = function(careerId) {
        return _.contains($scope.comparedCareers, careerId);
    }

    // apply inactive style when 2 are checked
    $scope.isNotActive = function(careerId) {
        if (!$scope.isCompared(careerId) && $scope.comparedCareers.length == 2) {
            return true;
        } else {
            return false;
        }
    }

}]);

// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope', 
    '$meteor','$stateParams', '$state', '$rootScope', '$meteorUtils', '$window',
    function($scope, $meteor, $stateParams, $state, $rootScope, $meteorUtils, $window){

    $scope.query = $window.localStorage.getItem('currentQuery');

    $scope.numResultsDisplayed = 10;

    $scope.resultsLoading = true;
    
    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerResults', {
            sort: {score: -1},
            limit:  parseInt($scope.getReactively('numResultsDisplayed')),            
        }, $scope.getReactively('query')).then(function(sub){
            
            $scope.careers = $meteor.collection(function() {
                return CareerSearch.find({}, {sort: {score: -1}}); 
            });

            $scope.getNumDisplayed = function(){
                if ($scope.careers.length <10){
                    return $scope.careers.length;
                } else {
                    return $scope.numResultsDisplayed;
                }
            }

            $scope.resultsLoading = false;

        });
    });

    $scope.showMoreResults = function() {
        var numLeft = $scope.careers.length - $scope.numResultsDisplayed
        $scope.numResultsDisplayed += Math.min(10, numLeft);
    }


    //**** QUERYING BY TAG ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on industry or skill
    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    } 

    //**** PINNED CAREERS ****


    // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        var pinnedCareer = {name: careerName, id: careerId};

        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }

        // if career id is pinned, remove it
        if (_.contains(pinnedIds, careerId)) {
            // remove id from pinned list
            pinnedIds = _.without(pinnedIds, careerId);

            var listCopy = [];
            // for each pinnedId, add pinnedCareer object to listCopy
            for (var i = 0; i < pinnedIds.length; i++) {
                listCopy.push(_.findWhere($scope.pinnedCareers, {id: pinnedIds[i]}));
            }
            // update pinnedCareers (pin removed)
            $scope.pinnedCareers = listCopy;
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }


    // apply class to pinned careers
    $scope.isPinned = function(careerId) {
        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }
        // return true if pinnedIds contains careerId
        return _.contains(pinnedIds, careerId);
    }

    // VIEWED CAREERS

    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    $scope.viewCareer = function(careerName, careerId) {
        var viewedCareer = {name: careerName, id: careerId};
        var oldViewed = $scope.viewedCareers.slice(); // makes copy of viewed careers object

        oldViewed.unshift(viewedCareer);
        $scope.viewedCareers = _.uniq(oldViewed, 'id').slice(0,3);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);   
    }


}]);



// ***********************************
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope', '$meteor',
 '$stateParams', '$state', '$window',
function($scope, $meteor, $stateParams, $state, $window){


    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerProfileResults', $stateParams.careerId).then(function(sub) {
            $scope.career = $meteor.object(Careers, {_id: $stateParams.careerId});
        });
    });


    //**** QUERYING BY TAG ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on industry or skill
    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    } 


    // **** PINNED CAREERS ****

    // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        var pinnedCareer = {name: careerName, id: careerId};

        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }

        // if career id is pinned, remove it
        if (_.contains(pinnedIds, careerId)) {
            // remove id from pinned list
            pinnedIds = _.without(pinnedIds, careerId);

            var listCopy = [];
            // for each pinnedId, add pinnedCareer object to listCopy
            for (var i = 0; i < pinnedIds.length; i++) {
                listCopy.push(_.findWhere($scope.pinnedCareers, {id: pinnedIds[i]}));
            }
            // update pinnedCareers (pin removed)
            $scope.pinnedCareers = listCopy;
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {
        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }
        // return true if pinnedIds contains careerId
        return _.contains(pinnedIds, careerId);
    }


    // Hide O*Net-related info if no O*Net title associated with this career
    $scope.onetIsNull = function(career) {
        return career == 'null'
    }

   $scope.createUrlString = function(string, stringType) {
        if (stringType === "glassdoor") {
            var urlString = string.replace(' ', '-');
        } else {
        var urlString = string.replace(' ', '+');
        }
        return urlString
   }


}]); 


// ***********************************
// CompareViewController
// ***********************************
angular.module('reflectivePath').controller('CompareViewController', ['$scope', '$meteor',
 '$stateParams', '$window',
function($scope, $meteor, $stateParams, $window){

    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerCompareResults', $stateParams.careerId1, $stateParams.careerId2).then(function(sub) {
            $scope.career1 = $meteor.object(Careers, {_id: $stateParams.careerId1});
            $scope.career2 = $meteor.object(Careers, {_id: $stateParams.careerId2});
        });
    });

    //**** QUERYING BY TAG ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on industry or skill
    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $window.localStorage.currentQuery = $scope.query;

        //update query stack
        $scope.queryStack.unshift(input);
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    } 


    // **** PINNED CAREERS ****

    // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
    // parse string from local storage
    $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        var pinnedCareer = {name: careerName, id: careerId};

        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }

        // if career id is pinned, remove it
        if (_.contains(pinnedIds, careerId)) {
            // remove id from pinned list
            pinnedIds = _.without(pinnedIds, careerId);

            var listCopy = [];
            // for each pinnedId, add pinnedCareer object to listCopy
            for (var i = 0; i < pinnedIds.length; i++) {
                listCopy.push(_.findWhere($scope.pinnedCareers, {id: pinnedIds[i]}));
            }
            // update pinnedCareers (pin removed)
            $scope.pinnedCareers = listCopy;
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {
        // create list of pinnedIds
        var pinnedIds = []
        for (var i = 0; i < $scope.pinnedCareers.length; i++) {
            pinnedIds.push($scope.pinnedCareers[i].id);
        }
        // return true if pinnedIds contains careerId
        return _.contains(pinnedIds, careerId);
    }


    // toggle compared career (check / uncheck)
    $scope.toggleComparedCareer = function(careerId) {
        if (_.contains($scope.comparedCareers, careerId)) {
            $scope.comparedCareers = _.without($scope.comparedCareers, careerId);
        } else {
            $scope.comparedCareers.push(careerId);
        }
        $scope.comparedCareers = $scope.comparedCareers.slice(0,2);
        $window.localStorage.comparedCareers = JSON.stringify($scope.comparedCareers);
    }

    // apply checkbox style if checked
    $scope.isCompared = function(careerId) {
        return _.contains($scope.comparedCareers, careerId);
    }

    // apply inactive style when 2 are checked
    $scope.isNotActive = function(careerId) {
        if (!$scope.isCompared(careerId) && $scope.comparedCareers.length == 2) {
            return true;
        } else {
            return false;
        }
    }

    // Hide O*Net-related info if no O*Net title associated with this career
    $scope.onetIsNull = function(career) {
        return career == 'null'
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    $scope.viewCareer = function(careerName, careerId) {
        var viewedCareer = {name: careerName, id: careerId};
        var oldViewed = $scope.viewedCareers.slice(); // makes copy of viewed careers object

        oldViewed.unshift(viewedCareer);
        $scope.viewedCareers = _.uniq(oldViewed, 'id').slice(0,3);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);   
    }

}]);


} //if Meteor isClient

// })();
