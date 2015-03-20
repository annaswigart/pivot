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
'$state', '$meteorCollection', '$meteorSubscribe',
function($scope, $state, $meteorCollection, $meteorSubscribe){

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
// ResultsController
// ***********************************

angular.module('reflectivePath').controller('ResultsController', ['$scope','$meteorCollection',
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe,
        $state, $meteorObject, $rootScope, $meteorUtils){

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
