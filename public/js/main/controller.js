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
