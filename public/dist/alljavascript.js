var app = {};
(function() {
        app = angular.module("MainApp", ['ngRoute', 'ngSanitize', 'ngResource', 'ngAnimate', 'mgcrea.ngStrap']);
        app.config(function ($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
            $routeProvider
            .when("/",{
                templateUrl: '/views/index.html', controller: 'mainCtrl'
            })
            .when("/sample",{
                templateUrl: '/views/sample/sample.html', controller: 'sampleCtrl'
            }).otherwise({
                redirectTo: "/"
            });
        });
    }
)();
var spinner = {};
var token = "XXX";
(function() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    var optSpinerModal = {
        lines: 11, // The number of lines to draw
        length: 23, // The length of each line
        width: 8, // The line thickness
        radius: 40, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 9, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 50, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        //className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent in px
        left: '50%' // Left position relative to parent in px
    };

    var spinnerObj = null;
    spinner.show = function () {
        var spinner_div = document.getElementById('spinner');
        if (spinnerObj == null) {
            spinnerObj = new Spinner(optSpinerModal).spin(spinner_div);
        } else {
            spinnerObj.spin(spinner_div);
        }
        $.blockUI({message: null, overlayCSS: {backgroundColor: '#5c5c5c'}});
    }

    spinner.hide = function () {
        var spinner_div = document.getElementById('spinner');
        spinnerObj.stop(spinner_div);
        $.unblockUI();
    }
})();
(function () {
    app.controller("globalCtrl", function ($rootScope, $scope) {
        $scope.pageData = [
            {Name: 'Home'},
            {Name: 'Sample'}
        ];
        $scope.directiveTest = "HELLO WORLD";
        $rootScope.images = "exampleimage.png";

        $('.upload-btn').on('click', function () {
            $('#upload-input').click();
            $('.progress-bar').text('0%');
            $('.progress-bar').width('0%');
        });

        $('#upload-input').on('change', function () {
            var files = $(this).get(0).files;
            if (files.length > 0) {
                var formData = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    formData.append('uploads[]', file, file.name);
                }

                $.ajax({
                    url: '/upload/',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        $rootScope.images = data;
                        $rootScope.cropper.destroy();
                        var image = document.getElementById("image");
                        image.src = "uploads/" + $rootScope.images;
                        $rootScope.initmainMT();
                    },
                    xhr: function () {
                        var xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);
                                $('.progress-bar').text(percentComplete + '%');
                                $('.progress-bar').width(percentComplete + '%');
                                if (percentComplete === 100) {
                                    $('.progress-bar').html('Done');
                                }
                            }
                        }, false);
                        return xhr;
                    }
                });
            }
        });
    });
})();
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
(function() {
    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    }
    app.filter('DateTrick', function () {
        return function (input) {
            if (input !== null) {
                var DateCal = input.addHours(7);
                return DateCal;
            } else {
                return {};
            }
        }
    });
})();
(function () {
    app.controller("mainCtrl", function ($rootScope, $scope, mainService, searchEngineService) {
        $scope.activePage = 1; // Home
        $scope.initMT = function () {
            mainService.GetSample().then(function (data) {
                $scope.testData = data;
            });
        };

        $scope.SubmitKeyword = function () {
            searchEngineService.addKeyword({keywords: $scope.inputkeywords}).then(function (result) {
                console.log(result);
            });
        };

        $rootScope.initmainMT = function () {
            console.log("---------- initmainMT ----------");
            var image = document.getElementById("image");
            image.src = "uploads/" + $rootScope.images;
            var previews = document.querySelectorAll(".preview");
            $rootScope.cropper = new Cropper(image, {
                ready: function (param1, param2) {
                    var clone = this.cloneNode();
                    clone.className = "";
                    clone.style.cssText = (
                        "display: block;" +
                        "width: 100%;" +
                        "min-width: 0;" +
                        "min-height: 0;" +
                        "max-width: none;" +
                        "max-height: none;"
                    );
                    angular.forEach(previews, function (elem) {
                        elem.appendChild(clone.cloneNode());
                    });
                },
                aspectRatio: 16 / 9,
                crop: function (e) {
                    var data = e.detail;
                    var cropper = this.cropper;
                    var imageData = cropper.getImageData();
                    var previewAspectRatio = data.width / data.height;
                    angular.forEach(previews, function (elem) {
                        console.log("elem: ", elem);
                        var previewImage = elem.getElementsByTagName("img").item(0);
                        var previewWidth = elem.offsetWidth;
                        var previewHeight = previewWidth / previewAspectRatio;
                        var imageScaledRatio = data.width / previewWidth;
                        elem.style.height = previewHeight + "px";
                        previewImage.style.width = imageData.naturalWidth / imageScaledRatio + "px";
                        previewImage.style.height = imageData.naturalHeight / imageScaledRatio + "px";
                        previewImage.style.marginLeft = -data.x / imageScaledRatio + "px";
                        previewImage.style.marginTop = -data.y / imageScaledRatio + "px";
                    });
                }
            });
        };

        $scope.retateImage = function (side) {
            if (side === "left") {
                $rootScope.cropper.rotate(-45);
            } else {
                $rootScope.cropper.rotate(45);
            }
        };

        $scope.getCroppedCanvas = function () {
            $rootScope.cropper.getCroppedCanvas({
                width: 160,
                height: 90
            });
            $rootScope.cropper.getCroppedCanvas().toBlob(function (blob) {
                var formData = new FormData();
                formData.append("croppedImage", blob);
                $.ajax({
                    url: "/upload/getCropp/",
                    method: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log("----: Upload success :----");
                        $rootScope.images = response;
                        console.log(response);
                        var imagecrop = document.getElementById("imagecrop");
                        imagecrop.src = "uploads/" + response;
                    },
                    error: function () {
                        console.log("Upload error");
                    }
                });
            });
        };

        // TODO : Bluma Modal
        $(".modal-button").click(function () {
            var target = $(this).data("target");
            $("html").addClass("is-clipped");
            $(target).addClass("is-active");
        });

        $(".modal-close").click(function () {
            $("html").removeClass("is-clipped");
            $(this).parent().removeClass("is-active");
        });

    });
})();

(function(){
    app.factory('mainService', function ($http,$q) {
        var thisfact = {};
        thisfact.GetSample = function(){
            spinner.show();
            var defer = $q.defer();
            $http({method: 'GET', url: '/sample'}).
                success(function(data) {
                    spinner.hide();
                    defer.resolve(data);
                }).
                error(function(err) {
                    spinner.hide();
                    defer.reject(err);
                });
            return defer.promise;
        };

        return thisfact;

    });
})();
(function() {
    app.controller('sampleCtrl', function ($scope, $modal, sampleService) {
        $scope.activePage = 2; //"Sample";
        $scope.readSampleData = [];

        ///------------ Create Section ---------------------
        $scope.createSample = function () {
            sampleService.createSample().then(function (result) {
                if (result != "ERROR") {
                    toastr.success('การบันทึกสำเร็จ', 'การบันทึกข้อมูล');
                    $scope.readSampleData.push(result);
                } else {
                    toastr.warning('การบันทึกผิดพลาด' + result, 'การบันทึกข้อมูล');
                }
            })
        };
        $scope.createNewSample = function () {
            sampleService.createNewSample($scope.modalData).then(function (result) {
                if (result != "ERROR") {
                    toastr.success('การบันทึกสำเร็จ', 'การบันทึกข้อมูล');
                    $scope.readSampleData.push(result);
                } else {
                    toastr.warning('การปรับปรุงผิดพลาด' + result, 'การปรับปรุงผิดพลาด');
                }
            });
        }
        ///-------------------------------------------------

        ///------------- Read Section ----------------------
        $scope.modalData = {};
        $scope.read = function (id, cb) {
            sampleService.readSample(id).then(function (result) {
                cb(result);
            });
        }
        $scope.readAllSample = function () {
            sampleService.readAllSample().then(function (result) {
                if (result != "ERROR") {
                    $scope.readSampleData = result;
                } else {
                    toastr.warning('การอ่านข้อมูลผิดพลาด' + result, 'การอ่านข้อมูลผิดพลาด');
                }
            })
        };
        // TODO : Pagination Serverside ReadData

        ///-------------------------------------------------

        ///------------- Update Section --------------------
        $scope.updateSample = function () {
            var id = $scope.currentID;
            var index = $scope.currentIndex;
            sampleService.updateSample($scope.modalData, id).then(function (result) {
                if (result != "ERROR") {
                    $scope.readSampleData[index] = $scope.modalData;
                } else {
                    toastr.warning('การปรับปรุงผิดพลาด' + result, 'การปรับปรุงผิดพลาด');
                }
            })
        }
        ///-------------------------------------------------

        ///------------- Delete Section --------------------
        $scope.deleteConfirm = function (id, index) {
            $scope.currentID = id;
            $scope.currentIndex = index;
            $modal({scope: $scope, template: '/views/sample/modal/sampleConfirm.html', show: true});
        };
        $scope.deleteSample = function () {
            var id = $scope.currentID;
            var index = $scope.currentIndex;

            sampleService.deleteSample(id).then(function (result) {
                if (result != "ERROR") {
                    $scope.readSampleData.splice(index, 1);
                } else {
                    toastr.warning('การลบผิดพลาด' + result, 'การลบผิดพลาด');
                }
            })
        };
        ///-------------------------------------------------

        ///-------------- Other Section --------------------
        $scope.checkData = function () {
            switch ($scope.modalMode) {
                case "create" :
                    $scope.createNewSample();
                    break;
                case "edit" :
                    $scope.updateSample();
                    break;
            }
        }
        $scope.showSample = function (type, id, index) {
            $scope.modalMode = type;
            $scope.currentID = id;
            $scope.currentIndex = index;
            var myOtherModal = $modal({scope: $scope, template: '/views/sample/modal/sampleModal.html', show: false});

            switch (type) {
                case 'create' :
                    $scope.modalData = {};
                    $scope.modalData.readOnly = false;
                    myOtherModal.$promise.then(myOtherModal.show);
                    break;
                case 'show' :
                    $scope.read(id, function (result) {
                        if (result != "ERROR") {
                            myOtherModal.$promise.then(myOtherModal.show);
                            $scope.modalData = result;
                            $scope.modalData.bCreate = JSON.parse(result.bCreate);
                            $scope.modalData.readOnly = true;
                        } else {
                            toastr.warning('การอ่านข้อมูลผิดพลาด' + result, 'การอ่านข้อมูลผิดพลาด');
                        }
                    });

                    break;
                case 'edit' :
                    $scope.read(id, function (result) {
                        if (result != "ERROR") {
                            myOtherModal.$promise.then(myOtherModal.show);
                            $scope.modalData = result;
                            $scope.modalData.bCreate = JSON.parse(result.bCreate);
                            $scope.modalData.readOnly = false;
                        } else {
                            toastr.warning('การอ่านข้อมูลผิดพลาด' + result, 'การอ่านข้อมูลผิดพลาด');
                        }
                    });
                    break;
            }
        };
        ///-------------------------------------------------
    });
})();

(function(){
    app.factory('sampleService', function ($http,$q) {
        var thisfact = {};
        thisfact.createSample = function(){
            spinner.show();
            var defer = $q.defer();
                $http({
                    method: "GET",
                    url: '/sample/create',
                    contentType: 'application/json; charset=utf-8',
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

        thisfact.createNewSample = function(obj){
            spinner.show();
            var defer = $q.defer();
            $http({
                method: "POST",
                url: '/sample/createnew',
                contentType: 'application/json; charset=utf-8',
                data: { Name: obj.Name, bCreate: obj.bCreate},
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

        thisfact.readAllSample = function(){
            spinner.show();
            var defer = $q.defer();
                $http(
                {
                    method: 'GET',
                    url: '/sample/read',
                    contentType: 'application/json; charset=utf-8',
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

        thisfact.deleteSample = function(id){
            spinner.show();
            var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: '/sample/delete/'+id,
                    contentType: 'application/json; charset=utf-8',
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

        thisfact.readSample = function(id){
            spinner.show();
            var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: '/sample/read/'+id,
                    contentType: 'application/json; charset=utf-8',
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

        thisfact.updateSample = function(obj,id){
            spinner.show();
            var defer = $q.defer();
                $http({
                    method: "POST",
                    url: '/sample/update/'+id,
                    data: { Name: obj.Name, bCreate: obj.bCreate},
                    contentType: 'application/json; charset=utf-8',
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