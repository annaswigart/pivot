var app = angular.module('reflectivePath', ['angular-meteor', 'ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 'ngSanitize']);

Meteor.startup(function () {
    
});

function onReady() {
  angular.bootstrap(document, ['reflectivePath']);
}

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

app.run (['$anchorScroll', '$rootScope', function($anchorScroll, $rootScope) {
    $anchorScroll.yOffset = 50;

    $rootScope.$on('$stateChangeSuccess', function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}]);

app.directive('ngBindAttrs', function() {
  return function(scope, element, attrs) {
    scope.$watch(attrs.ngBindAttrs, function(value) {
      angular.forEach(value, function(value, key) {
        attrs.$set(key, value);
      })
    }, true)
  }
});
    