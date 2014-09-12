define(['StackSticker', 'jquery'], function(StackSticker, $) {

    'use strict';

    function SmartStickers(rootEl) {
        var _this = this;
        this.stickers = [];
        this.rootChildrens = [];
        this.$root = $(rootEl);
        this.scrollTop = this.$root.scrollTop();
        this.$root.on('scroll', this.onScroll.bind(this));
        this.onScroll();
    }

    SmartStickers.prototype.onScroll = function () {
        this.scrollTop = this.$root.scrollTop();
        this.reposition(this.scrollTop);
        //requestAnimationFrame(this.onScroll.bind(this));
    };

    SmartStickers.prototype.add = function (sticker) {
        var candidatesToStick = this.stickers.filter(sticker.canStickTo.bind(sticker));
        if (candidatesToStick.length > 0) {
            var mainCandidate = candidatesToStick[0];
            for (var i = 1, len = candidatesToStick.length; i < len; i++) {
                if (mainCandidate.getStackHeight() < candidatesToStick[i].getStackHeight()) {
                    mainCandidate = candidatesToStick[i];
                }
            }
            mainCandidate.attach(sticker);
        } else {
            var candidateChildrens = this.rootChildrens;
            for (var i = 0; i < candidateChildrens.length; i++) {
                if (candidateChildrens[i].canStickTo(sticker)) {
                    var tempSticker = candidateChildrens.splice(i, 1)[0];
                    sticker.attach(tempSticker);
                    i--;
                }
            }
            if (this.rootChildrens.indexOf(sticker) < 0) {
                this.rootChildrens.push(sticker);
            }
            sticker.setTop(0);
        }

        if (this.stickers.indexOf(sticker) < 0) {
            this.stickers.push(sticker);
        }

        // Пересооденить подходящие дочерние стикеру к новому
        var candidateToBeChildrens = this.stickers.filter(function (candidate) {
            return candidate.canStickTo(sticker);
        });
        candidateToBeChildrens.forEach(this.add.bind(this));

        this.reposition(this.scrollTop);
    };

    SmartStickers.prototype.reposition = function (scrollTop) {
        var _this = this;
        this.rootChildrens.forEach(function (sticker) {
            sticker.reposition(scrollTop + _this.getOffset().top);
        });
    };

    SmartStickers.prototype.getOffset = function () {
        if (this.$root[0] === $(window)[0]) {
            return {
                top: 0,
                left: 0
            };
        } else {
            return this.$root.offset();
        }
    };

    return SmartStickers;

});
