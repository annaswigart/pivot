
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


    // $scope.resultsLoading = true;
    
    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerResults', {
            sort: {score: -1},
            limit:  parseInt($scope.getReactively('numResultsDisplayed')),            
        }, $scope.getReactively('submittedQuery')).then(function(sub){
            
            $scope.careers = $meteor.collection(function() {
                return Careers.find({});
                $scope.resultsLoading = false;
            });

            console.log($scope.careers);
            
        });
    });

 $meteor.autorun($scope, function() {
    $scope.careers = $meteor.collection(function() {
            return Careers.find({},{sort: {score: -1}}, {limit: parseInt($scope.getReactively('numResultsDisplayed'))});
                // $scope.resultsLoading = false;
     });
});
            
            


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


    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);


    // view career
    $scope.viewCareer = function(careerName, careerId) {

        var viewedCareer = {name: careerName, id: careerId};

        // update array of viewed careers and only keep 3
        $scope.viewedCareers.unshift(viewedCareer);
        
        // temp var for the for loop
        var uniqIds = [];
        var listCopy = [];

        // iterate through viewedCareers
        for (var i = 0; i < $scope.viewedCareers.length; i++) {
            var thisId = $scope.viewedCareers[i].id;
            if (!_.contains(uniqIds, thisId)) {
                // track ids encountered
                uniqIds.push(thisId);
                // add uniq object to listCopy
                listCopy.push($scope.viewedCareers[i]);
            }
        }

        // update with deduped list, keep only 3
        $scope.viewedCareers = listCopy.slice(0,3);

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

    // functions for search sidebar

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


    // init viewed careers in local storage
    if($window.localStorage.getItem("viewedCareers") === null){
        $window.localStorage.viewedCareers = '[]';
    }

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    // view career
    $scope.viewCareer = function(careerName, careerId) {

        var viewedCareer = {name: careerName, id: careerId};

        // update array of viewed careers and only keep 3
        $scope.viewedCareers.unshift(viewedCareer);
        
        // temp var for the for loop
        var uniqIds = [];
        var listCopy = [];

        // iterate through viewdCareers
        for (var i = 0; i < $scope.viewedCareers.length; i++) {
            var thisId = $scope.viewedCareers[i].id;
            if (!_.contains(uniqIds, thisId)) {
                // track ids encountered
                uniqIds.push(thisId);
                // add uniq object to listCopy
                listCopy.push($scope.viewedCareers[i]);
            }
        }

        // update with deduped list, keep only 3
        $scope.viewedCareers = listCopy.slice(0,3);

        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);
    }

    // Hide O*Net-related info if no O*Net title associated with this career
    $scope.onetIsNull = function(career) {
        return career == 'null'
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


    // // init pinned careers in local storage
    // if($window.localStorage.getItem("pinnedCareers") === null){
    //     $window.localStorage.pinnedCareers = '[]';
    // }
    
    // // parse string from local storage
    // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

    // // toggle pinned career (remove / add)
    // $scope.togglePinnedCareer = function(career){
    //     if (_.contains($scope.pinnedCareers, career)) {
    //         $scope.pinnedCareers = _.without($scope.pinnedCareers, career);
    //         $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    //     } else {
    //         $scope.pinnedCareers.push(career);
    //         $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    //     }
    // }

    // // apply class to pinned careers
    // $scope.isPinned = function(career) {
    //     return _.contains($scope.pinnedCareers, career);
    // }

    // // init viewed careers in local storage
    // if($window.localStorage.getItem("viewedCareers") === null){
    //     $window.localStorage.viewedCareers = '[]';
    // }

    // // parse string from local storage
    // $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    // // view career
    // $scope.viewCareer = function(careerName, careerId) {

    //     var viewedCareer = {name: careerName, id: careerId};

    //     // update array of viewed careers and only keep 3
    //     $scope.viewedCareers.unshift(viewedCareer);
        
    //     // temp var for the for loop
    //     var uniqIds = [];
    //     var listCopy = [];   

    //     // iterate through viewdCareers
    //     for (var i = 0; i < $scope.viewedCareers.length; i++) {
    //         var thisId = $scope.viewedCareers[i].id;
    //         if (!_.contains(uniqIds, thisId)) {
    //             // track ids encountered
    //             uniqIds.push(thisId);
    //             // add uniq object to listCopy
    //             listCopy.push($scope.viewedCareers[i]);
    //         }
    //     }

    //     // update with deduped list, keep only 3
    //     $scope.viewedCareers = listCopy.slice(0,3);

    //     $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);
    // }

}]);


} //if Meteor isClient
