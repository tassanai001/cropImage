(function(){
    app.factory('searchEngineService', function ($http,$q) {
        var thisfact = {};
        thisfact.addKeyword = function(data){
            spinner.show();
            var defer = $q.defer();
            console.log(data);
            $http({
                method: "POST",
                url: '/searchengine/addKeyword',
                contentType: 'application/json; charset=utf-8',
                data : data,
                dataType: 'json',
                headers: {
                    'RequestVerificationToken': token
                }
            }).success(function(data) {
                spinner.hide();
                defer.resolve(data);
            }).error(function(data) {
                spinner.hide();
                defer.reject(data);
            });
            return defer.promise;
        };

        return thisfact;
    });
})();