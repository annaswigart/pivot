// Global Variables can go here (if necessary)

var jobs = 
[{
    job_id: 1,
    title: 'Dog Walker',
    skills: ['timliness', 'trunk strength', 'communication skills']
    
  }, {
    job_id: 2,
    title: 'Web Developer',
    skills: ['HTML/CSS', 'JavaScipt', 'git', 'communication skills']
  },{
    job_id: 3,
    title: 'Insurance Agent',
    skills: ['writing', 'Microsoft Office', 'communication skills']
  }
];

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
'$state', '$meteorCollection', '$meteorSubscribe', '$http',
function($scope, $state, $meteorCollection, $meteorSubscribe, $http){

  
    $http.get('data/test_data.json').success(function(data){
        $scope.jobs = data;
        console.log($scope.jobs);
    });   
        
    // $scope.jobs = jobs;
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
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope','$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils', '$http',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils, $http){

    $scope.resultsLoading = true;

    $http.get('data/test_data.json').success(function(data){
        $scope.jobs = data;
        $scope.careers = _.chain($scope.jobs)
            .groupBy('standardized_title')
            .map(function(value, key) {
                return {
                    standardized_title: key,
                    skills: _.chain(_.flatten(_.pluck(value, "skills")))
                                    .groupBy(function(skill) {return skill;})
                                    .sortBy(function(skill) { return -skill.length;}) //sort descending by frequency
                                    .flatten()
                                    .uniq()
                                    .value(),
                    categories: _.chain(_.flatten(_.pluck(value, "category")))
                                    .groupBy(function(cat) {return cat;})
                                    .sortBy(function(cat) { return -cat.length;}) //sort descending by frequency
                                    .flatten()
                                    .uniq()
                                    .value(),
                    job_ids: _.flatten(_.pluck(value, "job_id")),
                    num_ids: _.flatten(_.pluck(value, "job_id")).length
                }
            })
            .value();

        $scope.resultsLoading = false;
        console.log($scope.careers);
    });  


// var result = _.chain(data)
//     .groupBy("FlexCategoryName")
//     .map(function(value, key) {
//         return {
//             FlexCategoryName: key,
//             Cost: sum(_.pluck(value, "Cost")),
//             Impressions: sum(_.pluck(value, "Impressions"))
//         }
//     })
//     .value();

    // $scope.jobs = jobs;
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
// CareerViewController
// ***********************************
angular.module('reflectivePath').controller('CareerViewController', ['$scope',
'$meteorSubscribe', '$stateParams', '$meteorObject', '$meteorCollection', '$meteorUtils',
function($scope, $meteorSubscribe, $stateParams, $meteorObject, $meteorCollection, $meteorUtils){

    $scope.jobs = jobs;

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

    $scope.jobs = jobs;
    // $meteorSubscribe.subscribe('jobs').then(function(sub){
    //     $scope.jobs = $meteorCollection(function(){
    //         return Datasets.find({});
    //     });
    // });

    // $scope.checkState = function(name){
    //     return $state.current.name == name;
    // }


}]);
