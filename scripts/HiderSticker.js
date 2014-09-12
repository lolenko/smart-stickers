define(['SimpleSticker', 'utils'], function(SimpleSticker, utils) {

    'use strict';

    var ScrollDirection = {
        UP: 0,
        DOWN: 1
    };

    function HiderSticker(element, options) {
        SimpleSticker.call(this, element, options);
        this.oldScrollTop = 0;
        this.hiderDelta = 0;
        this.scrollDir = ScrollDirection.DOWN;
    }

    utils.inherit(HiderSticker, SimpleSticker)

    HiderSticker.prototype.reposition = function (top) {
        var scrollDelta = top - this.oldScrollTop;
        var scrollDir = this.updateScrollDir(top);

        top += this.top;
        var dims = this.dims;

        if (top <= dims.minTop) {
            top = dims.minTop;
            this.unStick();
        } else if (top >= dims.maxTop + this.hiderDelta) {
            top = dims.maxTop + this.hiderDelta;
            this.unStick();
        } else {
            if (scrollDir == ScrollDirection.DOWN) {
                this.hiderDelta = Math.min(this.hiderDelta + scrollDelta, dims.height - 5);
            } else {
                this.hiderDelta = Math.max(this.hiderDelta + scrollDelta, 0);
            }
            top -= this.hiderDelta;
            this.stick();
        }

        this.position(top);

        return this;
    };

    HiderSticker.prototype.updateScrollDir = function (scrollTop) {
        if (scrollTop > this.oldScrollTop) {
            this.scrollDir = ScrollDirection.DOWN;
        } else {
            this.scrollDir = ScrollDirection.UP;
        }
        this.oldScrollTop = scrollTop;
        return this.scrollDir;
    };

    HiderSticker.prototype.getOffset = function () {
        var offset = SimpleSticker.super_.prototype.getOffset.call(this);
        offset.height -= this.hiderDelta;
        return offset;
    };

    return HiderSticker;

});
