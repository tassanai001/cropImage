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