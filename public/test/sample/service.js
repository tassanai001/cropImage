describe("Unit: Testing For Services", function() {
    describe("sampleService Test:", function() {

        beforeEach(function () {
            angular.module('MainApp');
        });
        var sampleService;
        beforeEach(inject(function ($rootScope, $controller , $compile, _sampleService_) {
            sampleService = _sampleService_;
        }));

        it('should contain a searchService',inject(function(){
            expect(sampleService).not.to.equal(null);
        }));

        it('should contain two search options',inject(function(){
            expect(sampleService.getSearchOptions()).to.equal(2);
        }));
    });
});