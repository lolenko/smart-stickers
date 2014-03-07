/*
import Sticker = require("./sticker");


class StickersStack {
    constructor(behavior:string) {
        this.behavior = behavior;
        this.$window = $(window);
        this.windowHeight = this.$window.height();
    }

    _stack: Sticker[] = [];
    scrollTop:number;
    behavior:string;
    $window:JQuery;
    windowHeight:number;

    push(sticker:Sticker):StickersStack {
        this._stack.push(sticker);
        this.updateOrder();
        return this;
    }

    private updateOrder():StickersStack {
        var stack = this._stack;
        this.sort(this.behavior === 'bottom');

        var stackLength = stack.length;
        if (this.behavior === 'default') {
            stackLength += 100;
        }
        stack.forEach(function(sticker) {
            sticker.setZIndex(stackLength--);
        });
        return this;
    }

    private sort(inverse:boolean = false) {
        this._stack.sort((function(prevSticker, nextSticker) {
            var delta =  prevSticker.getDims().placeholder.offset.top - nextSticker.getDims().placeholder.offset.top;
            return !inverse ? delta : -delta;
        }).bind(this));
    }

    repositionStickers(scrollTop:number):StickersStack {
        var stack = this._stack,
            stackLength = stack.length;
        this.scrollTop = scrollTop;

        for (var i = 0; i < stackLength; i++) {
            var sticker = stack[i];
            sticker.reposition(scrollTop + this.getStackHeight(sticker));
        }

        return this;
    }

    private getStackHeight(sticker:Sticker):number {
        var stack = this._stack,
            prevStickerIndex = stack.indexOf(sticker) - 1,
            stackLength = stack.length,
            height = 0;

        for (var k = prevStickerIndex; k >= 0; k--) {
            var curSticker = stack[k];

            if (curSticker.isStuck() && sticker.canStickTo(curSticker) && !sticker.isChildOf(curSticker)) {
                var curStickerDims = curSticker.getDims().sticker;
                height = curStickerDims.offset.top - this.scrollTop;
                height = this.behavior === 'default' ? height + curStickerDims.height : height - this.windowHeight;
                break;
            }
        }
        return height;
    }
}

export = StickersStack;
*/
