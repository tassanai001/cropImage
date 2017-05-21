describe("globalCtrl Test ", function() {
    beforeEach(module("MainApp"));
    var globalCtrl,
        scope;
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        globalCtrl = $controller("globalCtrl", {
            $scope: scope
        });
    }));
    it("globalCtrl should be equal Home at Index 1", function () {
        expect(scope.pageData[0].Name).toEqual("Home");
    });
});