/**
 * Created by Tonman on 24/8/2558.
 */
// karma.conf.js
module.exports = function(config) {
    config.set({
        // Base path for all script '' it mean current
        basePath: '',

        // Frameworks for testscript but you can define multiple
        frameworks: ['jasmine'],


        // File are include before test must includ unittesting file
        files:[
            "./public/components/angular/angular.min.js",
            "./public/components/angular-animate/angular-animate.min.js",
            "./public/components/angular-resource/angular-resource.min.js",
            "./public/components/angular-route/angular-route.min.js",
            "./public/components/angular-sanitize/angular-sanitize.min.js",
            "./public/components/angular-mocks/angular-mocks.js",

            "./public/components/jquery/dist/jquery.min.js",
            "./public/components/angular/angular.min.js",
            "./public/components/angular-animate/angular-animate.min.js",
            "./public/components/angular-resource/angular-resource.min.js",
            "./public/components/angular-route/angular-route.min.js",
            "./public/components/angular-sanitize/angular-sanitize.min.js",
            "./public/components/angular-strap/dist/angular-strap.min.js",
            "./public/components/angular-strap/dist/angular-strap.tpl.min.js",

            "./public/components/blockUI/jquery.blockUI.js",
            "./public/components/bootstrap/dist/js/bootstrap.min.js",
            "./public/components/spin.js/spin.js",
            "./public/components/toastr/toastr.min.js",
            "./public/kendo/js/kendo.all.min.js",

            // angular-mock is test mock for angularjs
            './public/dist/alljavascript.js', // OurCurrentScript
            './public/test/**/*.js' // OurCurrentScript
        ],

        //exclud file list
        exclude:[
            ''
        ],

        // if you have alot plugins can define here.
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher'
        ],
        port:9876,
        colors:true,

        // dot,progress,junit,growl,coverage
        reporters:['dot'],
        //...

        // possible values:
        // config.LOG_DISABLE
        // config.LOG_ERROR
        // config.LOG_WARN
        // config.LOG_INFO
        // config.LOG_DEBUG
        //logLevel: config.LOG_INFO,

        //autoWatch: false,

        browsers: ['Chrome']

        //singleRun: true
    });
};