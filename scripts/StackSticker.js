define(['jquery', 'SimpleSticker'], function($, SimpleSticker) {

    'use strict';

    function StackSticker(element, options) {
        //this.sticker = new HiderSticker(element);
        this.sticker = new SimpleSticker(element);
        this.childrens = [];
        this.startOffset = $.extend({}, this.sticker.getOffset(), true);
        this.sticker.getRoot().trigger('register.stacksticker', { sticker: this });
    }

    StackSticker.prototype.reposition = function (top) {
        var _this = this;
        this.sticker.reposition(top);

        //        top = this.getStackHeight();
        this.childrens.forEach(function (sticker) {
            sticker.setTop(_this.getStackHeight());
            sticker.reposition(top);
        });
        return this;
    };

    StackSticker.prototype.getOffset = function () {
        return this.sticker.getOffset();
    };

    StackSticker.prototype.getStartOffset = function () {
        return this.startOffset;
    };

    StackSticker.prototype.getRoot = function () {
        return this.sticker.getRoot();
    };

    StackSticker.prototype.contains = function (sticker) {
        return $.contains(sticker.getRoot()[0], this.getRoot()[0]);
    };

    StackSticker.prototype.compareHorizontalTo = function (sticker) {
        var ownOffset = this.getOffset(), overOffset = sticker.getOffset();

        if (overOffset.left + overOffset.width < ownOffset.left) {
            return ownOffset.left - (overOffset.left + overOffset.width);
        } else if (ownOffset.left + ownOffset.width < overOffset.left) {
            return (ownOffset.left + ownOffset.width) - overOffset.left;
        } else {
            return 0;
        }
    };

    StackSticker.prototype.compareVerticalTo = function (sticker) {
        var ownOffset = this.getStartOffset(), overOffset = sticker.getStartOffset();

        if (overOffset.top + overOffset.height < ownOffset.top) {
            return ownOffset.top - (overOffset.top + overOffset.height);
        } else if (ownOffset.top + ownOffset.height < overOffset.top) {
            return (ownOffset.top + ownOffset.height) - overOffset.top;
        } else {
            return 0;
        }
    };

    StackSticker.prototype.canStickTo = function (sticker) {
        return !this.contains(sticker) && this.compareHorizontalTo(sticker) == 0 && this.compareVerticalTo(sticker) > 0;
    };

    StackSticker.prototype.getStackHeight = function () {
        return this.getOffset().height + (this.parent ? this.parent.getStackHeight() : 0);
    };

    StackSticker.prototype.addChild = function (sticker) {
        this.childrens.push(sticker);
    };

    StackSticker.prototype.getChildrens = function () {
        return this.childrens;
    };

    StackSticker.prototype.emptyChildrens = function () {
        this.childrens = [];
        return this;
    };

    StackSticker.prototype.setParent = function (sticker) {
        this.parent = sticker;
    };

    StackSticker.prototype.getParent = function () {
        return this.parent;
    };

    StackSticker.prototype.deattach = function () {
        if (this.parent) {
            var parentChildrens = this.parent.getChildrens();
            parentChildrens.splice(parentChildrens.indexOf(this), 1);
            this.setParent(null);
        }
    };

    StackSticker.prototype.attach = function (sticker) {
        sticker.deattach();
        this.addChild(sticker);
        sticker.setParent(this);
        sticker.setTop(this.getStackHeight());
    };

    StackSticker.prototype.setTop = function (top) {
        this.sticker.setTop(top);
    };

    return StackSticker;

});
