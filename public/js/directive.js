(function(){
    app.directive('directiveSample',function() {
        return {
            restrict: 'AEC',
            replace: true,
            require: 'ngModel',
            scope: true,
            //template : "",
            //templateUrl : "",
            link: function (scope, element, attr, ngModel) {
                ngModel.$render = function () {
                    element.empty();
                    element.append(ngModel.$viewValue);
                };
            }
        }
    });
})();