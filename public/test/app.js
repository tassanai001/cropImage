describe('App Test', function () {
    var $route;
    beforeEach(function () {
        module('MainApp');
        inject(function (_$route_) {
            $route = _$route_;
        });
    });

    it('should map routes to many controllers', function () {
        expect($route.routes['/'].controller).toBe('mainCtrl');
        expect($route.routes['/sample'].templateUrl).
            toEqual('/views/sample/sample.html');

        //expect($route.routes['/phones/:phoneId'].templateUrl).
        //    toEqual('partials/phone-detail.html');
        //expect($route.routes['/phones/:phoneId'].controller).
        //    toEqual('PhoneDetailCtrl');
        //
        //// otherwise redirect to
        //expect($route.routes[null].redirectTo).toEqual('/phones')
    });
});