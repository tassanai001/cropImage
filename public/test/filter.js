describe('Filter Test', function () {
    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    };

    var $filter;
    beforeEach(function () {
        module('MainApp');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('Date should be add 7 hour', function () {
        // Arrange.
        var foo = (new Date()), result;
        var DateCal = foo.addHours(7);

        // Act. if have param
        //result = $filter('DateTrick')(foo, 'capitalize');
        result = $filter('DateTrick')(foo);

        // Assert.
        expect(result).toEqual(DateCal);
    });
});/**
 * Created by Worawut on 12/22/2015.
 */
