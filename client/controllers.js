if (Meteor.isClient) {

// ***********************************
// NavBarController
// ***********************************
angular.module('reflectivePath').controller('NavBarController', ['$scope', 
    '$meteor','$stateParams', '$state', '$meteorUtils', '$window',
    function($scope, $meteor, $stateParams, $state, $meteorUtils, $window){

    // Data for autocomplete search
    $meteor.subscribe('autoCompleteData').then(function(sub){                       
          $scope.searchTerms = Autocomplete.findOne({ _id : '123'}).searchValues;   
    });

    // Used in typeahead filter, on $viewValue to match on the start of a term
    $scope.startsWith = function(state, viewValue) {
      return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
    } 
    
    //**** QUERYING ****

    $scope.query = $window.localStorage.getItem('currentQuery');

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on category or skill
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

    // referenced to hide search box in nav bar on home search screen
    $scope.currentState = $state.current.name;


}]);



// ***********************************
// HomeSearchController
// ***********************************
angular.module('reflectivePath').controller('HomeSearchController', ['$scope', '$meteor',
'$state', '$window', '$http', function($scope, $meteor, $state, $window, $http){   

    // Data for autocomplete search
    $meteor.subscribe('autoCompleteData').then(function(sub){                       
          $scope.searchTerms = Autocomplete.findOne({ _id : '123'}).searchValues;   
    });

    // Used in typeahead filter, on $viewValue to match on the start of a term
    $scope.startsWith = function(state, viewValue) {
      return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
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
        $scope.queryStack = _.uniq($scope.queryStack).slice(0,3);
        $window.localStorage.queryStack = JSON.stringify($scope.queryStack);
     
        // construct query string for URL (replace spaces with +)
        $scope.queryStringURL = input.split(' ').join('+');

        return $scope.query;
    }

    // **** VIEWED CAREERS ****

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

    $scope.topCareers = ['Software Engineer', 'Medical Manager', 'Sales Representative', 'Product Manager', 'User Experience Designer', 'Data Scientist'];
    $scope.topSkills = ['communication', 'programming', 'design', 'customer service', 'marketing', 'analytics'];
    $scope.topCategories = ['Information Technology', 'Consulting', 'Health Care', 'Design', 'Nonprofit', 'Sales'];



}]);


// ***********************************
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope', 
    '$meteor','$stateParams', '$state', '$rootScope', '$meteorUtils', '$window', '$http',
    function($scope, $meteor, $stateParams, $state, $rootScope, $meteorUtils, $window, $http){

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



    //**** QUERYING ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on category or skill
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


    $scope.getWikiData = function(querySelection) {

        var query = querySelection;

        // some hard-coded wikipedia redirections
        if (query == 'python'){
            query = 'Python_%28programming_language%29';

        } else if (query == 'javascript') {
            query = 'JavaScript';

        } else if (query == 'java') {
            query = 'Java_%28programming_language%29';

        } else if (query == 'ruby') {
            query = 'Ruby_%28programming_language%29';

        } else if (query == 'sql') {
            query = 'SQL'

        } else if (query == 'microsoft powerpoint') {
            query = 'Microsoft PowerPoint';

        } else if (query == 'microsoft excel') {
            query = 'Microsoft Excel';

        } else if (query == 'microsoft sharepoint') {
            query = 'Microsoft SharePoint';

        } else if (query == 'microsoft word') {
            query = 'Microsoft Word';

        } else if (query == 'microsoft dynamics') {
            query = 'Microsoft Dynamics';
        
        } else if (query == 'sox') {
            query = 'Sarbanes–Oxley_Act';
        
        } else if (query == 'peoplesoft') {
            query = 'PeopleSoft';

        } else if (query == 'html') {
            query = 'HTML';

        } else if (query == 'autocad') {
            query = 'AutoCAD';
        }


        

        queryString = query.split(' ').join('%20');

        $scope.method = 'JSONP';
        $scope.url = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=' + queryString + '&callback=JSON_CALLBACK';
        var redirectMergeRegex = new RegExp("This is a redirect from a page that was");
        var redirectCapRegex = new RegExp("another method of capitalisation");

        $scope.code = null;
        $scope.response = null;

        $http({method: 'JSONP', url: $scope.url}).
            success(function(data, status) {
              $scope.status = status;
              $scope.data = data;

              var extract = _.values($scope.data.query.pages)[0].extract

              if (redirectMergeRegex.test(extract) || redirectCapRegex.test(extract) ){
                $scope.wikiText = "Sorry, we weren't able to automatically find a blurb about " + "<b>" + query + "</b>" + 
                                  ". But you should totally still look it up!";

              } else {
                $scope.wikiText = _.values($scope.data.query.pages)[0].extract;
              }

              console.log($scope.data);
              console.log($scope.status);
              

            }).
            error(function(data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;

                $scope.wikiTextMissing = "Sorry, we weren't able to find a blurb about " + "<b>" + query + "</b>" + ". But you should totally still look it up!"
            });

        // console.log(_.findKey($scope.data, 'extract'));

        // console.log(_.pluck($scope.data.query.pages, ));

    }

    //**** PINNED CAREERS ****


    // init pinned careers in local storage
    if($window.localStorage.getItem("pinnedCareers") === null){
        $window.localStorage.pinnedCareers = '[]';
    }
    
     // parse string from local storage
    $scope.pinnedCareers = _.uniq(JSON.parse($window.localStorage.pinnedCareers), 'id');

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        var pinnedCareer = {name: careerName, id: careerId};

        // if career id is pinned, remove it
        if (_.contains(_.pluck($scope.pinnedCareers, 'id'), careerId)) {
            // remove id from pinned list
            $scope.pinnedCareers = _.without($scope.pinnedCareers, _.findWhere($scope.pinnedCareers, {id: careerId}));
            // and remove from compared list if it's there
            if (_.contains($scope.comparedCareers, careerId)) {
                $scope.comparedCareers = _.without($scope.comparedCareers, careerId);
            }
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        return _.contains(_.pluck($scope.pinnedCareers, 'id'), careerId);
    }

    // **** VIEWED CAREERS ****

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
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope', '$meteor',
 '$stateParams', '$state', '$window', '$rootScope', '$location', '$anchorScroll',
function($scope, $meteor, $stateParams, $state, $window, $rootScope, $location, $anchorScroll){


    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerProfileResults', $stateParams.careerId).then(function(sub) {

            $scope.career = Careers.findOne({_id: $stateParams.careerId});

            function getDegreeOrder(degree) {

                if(degree == "Less than a High School Diploma"){
                    return 1;
                    
                } else if (degree == "High School Diploma or GED") {
                    return 2;

                } else if (degree == "Associate's Degree"){
                    return 3;

                } else if (degree == "Post-Secondary Certificate"){
                    return 4;

                } else if (degree == "Bachelor's Degree"){
                    return 5;

                } else if (degree == "Master's Degree"){
                    return 6;
                
                } else if (degree == "First Professional Degree"){
                    return 7;

                } else if (degree == "Doctoral Degree"){
                    return 8;
                }

            }

            // reshape education data to include ordinal degree rank
            // TODO: move this functinoality to server-side on data import
            var newEdArray = []
            _($scope.career.education).each(function(percent, degree) {
                            newEdArray.push({degree: degree, percent: percent, order: getDegreeOrder(degree)});
                        });

            $scope.career.education = newEdArray;
        });
        

    });

    // SKILLS CHARTS
    $scope.getSkillPercent = function(skillCount, numIds) {
        return Math.round(skillCount/numIds * 100);
    }

    $scope.getSalaryWidth = function(salary) {
        return salary / 900;
    }

    $scope.getEdWidth = function(edPercent) {
        return edPercent * 1.5;
    }

    $scope.getRoundedPercent = function(percent) {
        var rounded = Math.round(percent)
        if (rounded == 0) {
            return "<1"
        } else {
            return rounded;
        }
    }

    // $scope.lookupIdByName = function(careerTitle){
    //     id = Careers.findOne({standardized_title: careerTitle}, {fields : {_id: 1}})
    //     console.log(id);
    //     return id;
    // }

    //**** QUERYING BY TAG ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on category or skill
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
    $scope.pinnedCareers = _.uniq(JSON.parse($window.localStorage.pinnedCareers), 'id');

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        var pinnedCareer = {name: careerName, id: careerId};

        // if career id is pinned, remove it
        if (_.contains(_.pluck($scope.pinnedCareers, 'id'), careerId)) {
            // remove id from pinned list
            $scope.pinnedCareers = _.without($scope.pinnedCareers, _.findWhere($scope.pinnedCareers, {id: careerId}));
            // and remove from compared list if it's there
            if (_.contains($scope.comparedCareers, careerId)) {
                $scope.comparedCareers = _.without($scope.comparedCareers, careerId);
            }
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        return _.contains(_.pluck($scope.pinnedCareers, 'id'), careerId);
    }

    // **** VIEWED CAREERS ****

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

    // **** ONET DATA ****

    // Hide O*Net-related info if no O*Net title associated with this career
    $scope.onetIsNull = function(onetName) {
        return onetName == 'null'
    }

    // **** URL STRINGS ****

    $scope.createUrlString = function(string, glassdoorString) {
        if (glassdoorString) {
            var urlString = string.split(' ').join('-');
        } else {
        var urlString = string.replace(' ').join('+');
        }
        return urlString
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
// CompareViewController
// ***********************************
angular.module('reflectivePath').controller('CompareViewController', ['$scope', '$meteor',
 '$stateParams', '$window', '$rootScope', '$location', '$anchorScroll',
function($scope, $meteor, $stateParams, $window, $rootScope, $location, $anchorScroll){

    $meteor.autorun($scope, function() {
        $meteor.subscribe('careerCompareResults', $stateParams.careerId1, $stateParams.careerId2).then(function(sub) {

            $scope.career1 = Careers.findOne({_id: $stateParams.careerId1});
            $scope.career2 = Careers.findOne({_id: $stateParams.careerId2});

            function getDegreeOrder(degree) {

                if(degree == "Less than a High School Diploma"){
                    return 1;
                    
                } else if (degree == "High School Diploma or GED") {
                    return 2;

                } else if (degree == "Associate's Degree"){
                    return 3;

                } else if (degree == "Post-Secondary Certificate"){
                    return 4;

                } else if (degree == "Bachelor's Degree"){
                    return 5;

                } else if (degree == "Master's Degree"){
                    return 6;
                
                } else if (degree == "First Professional Degree"){
                    return 7;

                } else if (degree == "Doctoral Degree"){
                    return 8;
                }

            }

             $scope.getSalaryWidth = function(salary) {
                return salary / 900;
            }

            $scope.getEdWidth = function(edPercent) {
                return edPercent * 1.2;
            }

             $scope.getRoundedPercent = function(percent) {
                var rounded = Math.round(percent)
                if (rounded == 0) {
                    return "<1"
                } else {
                    return rounded;
                }
            }

            // reshape education data to include ordinal degree rank
            // TODO: move this functinoality to server-side on data import
            var newEdArray1 = []
            _($scope.career1.education).each(function(percent, degree) {
                            newEdArray1.push({degree: degree, percent: percent, order: getDegreeOrder(degree)});
                        });

            var newEdArray2 = []
            _($scope.career2.education).each(function(percent, degree) {
                            newEdArray2.push({degree: degree, percent: percent, order: getDegreeOrder(degree)});
                        });

            $scope.career1.education = newEdArray1;
            $scope.career2.education = newEdArray2;


            // *** Skill Intersection for Compare View
            // get top 20 skills for each career
            $scope.skills1 = _.pluck(_.sortBy($scope.career1.skills, -'count').slice(0,20), 'name');
            $scope.skills2 = _.pluck(_.sortBy($scope.career2.skills, -'count').slice(0,20), 'name');

            // get intersecting and unique skills
            $scope.skillsIntersect = _.intersection($scope.skills1, $scope.skills2);
            $scope.skills1 = _.xor($scope.skills1, $scope.skillsIntersect);
            $scope.skills2 = _.xor($scope.skills2, $scope.skillsIntersect);


            // *** Category Intersection for Compare View
            // get top 10 categories for each career
            $scope.categories1 = _.pluck(_.sortBy($scope.career1.categories, -'count').slice(0,10), 'name');
            $scope.categories2 = _.pluck(_.sortBy($scope.career2.categories, -'count').slice(0,10), 'name');

            // get intersecting and unique categories
            $scope.categoriesIntersect = _.intersection($scope.categories1, $scope.categories2);
            $scope.categories1 = _.xor($scope.categories1, $scope.categoriesIntersect);
            $scope.categories2 = _.xor($scope.categories2, $scope.categoriesIntersect);

            // *** Work Context Intersection for Compare View
            // get work contexts for each career
            $scope.contexts1 = $scope.career1.work_context.top_work_contexts;
            $scope.contexts2 = $scope.career2.work_context.top_work_contexts;

            // get intersecting and unique contexts
            $scope.contextIntersect = _.intersection($scope.contexts1, $scope.contexts2);
            $scope.contexts1 = _.xor($scope.contexts1, $scope.contextIntersect);
            $scope.contexts2 = _.xor($scope.contexts2, $scope.contextIntersect);
            console.log($scope.contextIntersect);
            console.log($scope.contexts1);
            console.log($scope.contexts2);

        });

    });

    //**** QUERYING BY TAG ****

    // init queryStack in local storage, if doesn't exist
    if($window.localStorage.getItem("queryStack") === null){
        $window.localStorage.queryStack = '[]';
    }

    // JSON.parse to read the stack in as an array
    $scope.queryStack = JSON.parse($window.localStorage.getItem('queryStack'));

    // needed for querying by clicking on category or skill
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
    $scope.pinnedCareers = _.uniq(JSON.parse($window.localStorage.pinnedCareers), 'id');

    // toggle pinned career (remove / add)
    $scope.togglePinnedCareer = function(careerName, careerId){

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        var pinnedCareer = {name: careerName, id: careerId};

        // if career id is pinned, remove it
        if (_.contains(_.pluck($scope.pinnedCareers, 'id'), careerId)) {
            // remove id from pinned list
            $scope.pinnedCareers = _.without($scope.pinnedCareers, _.findWhere($scope.pinnedCareers, {id: careerId}));
            // and remove from compared list if it's there
            if (_.contains($scope.comparedCareers, careerId)) {
                $scope.comparedCareers = _.without($scope.comparedCareers, careerId);
            }
        } else {
            // else add to pinnedCareers
            $scope.pinnedCareers.push(pinnedCareer);
        }

        $window.localStorage.pinnedCareers = JSON.stringify($scope.pinnedCareers);
    }

    // apply class to pinned careers
    $scope.isPinned = function(careerId) {

        // parse string from local storage
        // $scope.pinnedCareers = JSON.parse($window.localStorage.pinnedCareers);

        return _.contains(_.pluck($scope.pinnedCareers, 'id'), careerId);
    }

    // **** ONET DATA ****

    // Hide O*Net-related info if no O*Net title associated with this career
    $scope.onetIsNull = function(career) {
        return career == 'null'
    }

    // **** VIEWED CAREERS ****

    // parse string from local storage
    $scope.viewedCareers = JSON.parse($window.localStorage.viewedCareers);

    $scope.viewCareer = function(careerName, careerId) {
        var viewedCareer = {name: careerName, id: careerId};
        var oldViewed = $scope.viewedCareers.slice(); // makes copy of viewed careers object

        oldViewed.unshift(viewedCareer);
        $scope.viewedCareers = _.uniq(oldViewed, 'id').slice(0,3);
        $window.localStorage.viewedCareers = JSON.stringify($scope.viewedCareers);   
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


} //if Meteor isClient
