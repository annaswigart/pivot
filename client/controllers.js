
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
'$state', '$meteorCollection', '$meteorSubscribe', '$window', 'currentQueryService',
function($scope, $meteor, $state, $meteorCollection, $meteorSubscribe, $window, currentQueryService){   
    
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
    // JSON.parse to read the stack in as an array
    $scope.queryStackData = JSON.parse($window.localStorage.getItem('queryStack'));

    $scope.setQuery = function(input) {
        //set query
        $scope.query = currentQueryService.setQuery(input);
        $window.localStorage.currentQuery = $scope.query;


        //update query stack
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
            return query;
        },
        setQuery: function(input) {
            query = input;
            return query;
        },
        getQueryStack: function() {
            return queryStack;
        }
    };
});


// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope', '$meteor', '$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils', '$window', 'currentQueryService',
    function($scope, $meteor, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils, $window, currentQueryService){

    $scope.query = $window.localStorage.getItem('currentQuery');
    // JSON.parse to read the stack in as an array
    $scope.queryStackData = JSON.parse($window.localStorage.getItem('queryStack'));

    $scope.resultsLoading = true;
    
    $scope.numResultsDisplayed = 20;

    $scope.showMoreResults = function() {
            $scope.numResultsDisplayed += 10;
            console.log($scope.numResultsDisplayed);
    }


   
    $meteor.autorun($scope, function() {
        $meteor.subscribe('careers', {
            limit:  parseInt($scope.getReactively('numResultsDisplayed')),
            sort: {num_ids: -1},
            reactive: false
        }, $scope.getReactively('query')).then(function(sub){

            $scope.careers = $meteor.collection(function() {
                return Careers.find({});
                //return Careers.find({limit: $scope.getReactively('numResultsDisplayed')});
            });
            
            $scope.resultsLoading = false;
        });
    });
        

    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Jobs.find({}, {fields: {job_id: 1, skills: 1} });
    //     });

    // });

    // $meteorSubscribe.subscribe('skills').then(function(sub){

    //     $scope.skills = $meteorCollection(function(){
    //         return Skills.find({});
    //     });

    //     $scope.skill = $scope.skills[0]
    // });

    
    $scope.setQuery = function(input) {
        //set query
        $scope.query = currentQueryService.setQuery(input);
        $window.localStorage.currentQuery = $scope.query;
        console.log($scope.query);

        //update query stack
        $scope.appendQueryStack(input);
        $window.localStorage.queryStack = JSON.stringify(currentQueryService.queryStack);
        $scope.queryStackData = JSON.parse($window.localStorage.queryStack);
     
        return $scope.query;
    }

    $scope.appendQueryStack = function(input) {
        currentQueryService.queryStack.push(input);
    }
    

    $scope.checkState = function(name){
        return $state.current.name == name;
    }


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

// Start from filter
angular.module('reflectivePath').filter('startFrom', function() {
    return function(input, start) {         
        return input.slice(start);
    };
});


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
angular.module('reflectivePath').controller('CompareViewController', ['$scope',
'$state', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject', '$window',
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject, $window){



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


} //if Meteor isClient
