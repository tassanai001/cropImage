describe('Directive Test', function () {
    beforeEach(module("MainApp"));
    var scope;
    var element;
    var globalCtrl;
    beforeEach(inject(function ($rootScope, $controller , $compile) {
        scope = $rootScope.$new();
        globalCtrl = $controller("globalCtrl", { $scope: scope });
        element = angular.element('<directive-sample ng-model="directiveTest"></directive-sample>');
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should create my directive', inject(function() {
        expect(element.text()).toBe('HELLO WORLD');
    }));
});