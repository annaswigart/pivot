var app = angular.module('reflectivePath', ['angular-meteor', 'ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

Meteor.startup(function () {
    // angular.bootstrap(document, ['reflectivePath']);
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

app.run (['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 50;
}])
    