
CareerData = new Mongo.Collection("careerData");



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
    $window.localStorage.searchCategory = $scope.selectedCategory.name;

    // change selected search category
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
        $window.localStorage.searchCategory = $scope.selectedCategory.name;
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
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,4);
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
    
    if ($scope.submittedQuery == undefined) {
        $scope.submittedQuery = $scope.query;
    }

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    $scope.selectedCategory = JSON.stringify($window.localStorage.getItem('searchCategory'));

    // JSON.parse to read the stack in as an array
    $scope.queryStack = _.uniq(JSON.parse($window.localStorage.getItem('queryStack'))).slice(0,4);

    $scope.setQuery = function(input) {
        //set query
        $scope.query = input;
        $scope.submittedQuery = $scope.query;
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

    
    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerResults', {
            limit:  parseInt($scope.getReactively('numResultsDisplayed')),
            sort: {num_ids: -1},
            reactive: false,
        }, $scope.getReactively('submittedQuery')).then(function(sub){
            
            $scope.resultsLoading = true;

            $scope.careers = $meteor.collection(function() {
                return Careers.find({});
                $scope.resultsLoading = false;
            });

            console.log($scope.careers);
            
        });
    });

    $scope.careers = $meteor.collection(function() {
                return Careers.find({}, {sort: {score: -1}});
                $scope.resultsLoading = false;
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


    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    // view career
    $scope.viewCareer = function(career) {
        // update array of viewed careers and only keep 4
        $scope.viewedCareers.unshift(career);
        $scope.viewedCareers = _.uniq($scope.viewedCareers).slice(0,4);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);
    }


    // placeholder text
    $scope.placeholderText = [
        {text: "Vivendum incorrupte nam cu, eu eam alii dolor scribentur, an everti option principes eum."},
        {text: "Qui cu epicurei accusamus. Eu dicit partem erroribus per, ei diam labitur volumus vel, et mel quis nominavi."},
        {text: "Ex mel tamquam recusabo. His aliquip accusata an, stet consul ne sit, mucius possim pri in."},
        {text: "Recteque disputando signiferumque no vis. In rebum numquam pri."},
        {text: "Sed primis adipiscing eu, te pro graecis nominavi reprehendunt. Aeterno integre fierent no his, at est propriae copiosae. "},
        {text: "Ne posse tractatos definiebas sea, ei exerci putent mea, ne deserunt."},
        {text: "At pri movet audire feugiat, vix eu alia urbanitas. Cu his atqui facilis facilisi, eos at velit sadipscing."},
        {text: "Malorum offendit vis ei, purto aperiri neglegentur ex mel, omnis numquam mei et."},
        {text: "Vim dicunt nominati te, amet periculis vim ei. Forensibus reprimique ne sea."},
        {text: "Per vidisse perfecto aliquando id. Purto timeam ius at, sit modo dico maiorum et. Eos at atomorum deseruisse."}
    ];

}]);



// ***********************************
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope', '$meteor',
 '$stateParams', '$window',
function($scope, $meteor, $stateParams, $window){

    // $scope.careerID = $stateParams.careerId;

    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerProfileResults', $stateParams.careerId).then(function(sub) {
            $scope.career = $meteor.object(Careers, {_id: $stateParams.careerId});
            console.log($scope.career);
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


    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    // view career
    $scope.viewCareer = function(career) {
        // update array of viewed careers and only keep 4
        $scope.viewedCareers.unshift(career);
        $scope.viewedCareers = _.uniq($scope.viewedCareers).slice(0,4);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);
    }

    // placeholder text
    $scope.placeholderText = [
        {text: "Vivendum incorrupte nam cu, eu eam alii dolor scribentur, an everti option principes eum."},
        {text: "Qui cu epicurei accusamus. Eu dicit partem erroribus per, ei diam labitur volumus vel, et mel quis nominavi."},
        {text: "Ex mel tamquam recusabo. His aliquip accusata an, stet consul ne sit, mucius possim pri in."},
        {text: "Recteque disputando signiferumque no vis. In rebum numquam pri."},
        {text: "Sed primis adipiscing eu, te pro graecis nominavi reprehendunt. Aeterno integre fierent no his, at est propriae copiosae. "},
        {text: "Ne posse tractatos definiebas sea, ei exerci putent mea, ne deserunt."},
        {text: "At pri movet audire feugiat, vix eu alia urbanitas. Cu his atqui facilis facilisi, eos at velit sadipscing."},
        {text: "Malorum offendit vis ei, purto aperiri neglegentur ex mel, omnis numquam mei et."},
        {text: "Vim dicunt nominati te, amet periculis vim ei. Forensibus reprimique ne sea."},
        {text: "Per vidisse perfecto aliquando id. Purto timeam ius at, sit modo dico maiorum et. Eos at atomorum deseruisse."}
    ];
   


}]); 


// ***********************************
// CompareViewController
// ***********************************
angular.module('reflectivePath').controller('CompareViewController', ['$scope', '$meteor',
 '$stateParams', '$window',
function($scope, $meteor, $stateParams, $window){



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
// SidebarController
// ***********************************

angular.module('reflectivePath').controller('SidebarController', ['$scope', '$meteor',
 '$stateParams', '$window',
function($scope, $meteor, $stateParams, $window){


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

    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    // view career
    $scope.viewCareer = function(career) {
        // update array of viewed careers and only keep 4
        $scope.viewedCareers.unshift(career);
        $scope.viewedCareers = _.uniq($scope.viewedCareers).slice(0,4);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);
    }

}]);


} //if Meteor isClient
