import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');

if (jquery);
var $window = $(window);

class SmartStickers {
    private stickers:Sticker[] = [];

    constructor() {
        var $stickers = $('.sticker');
        $stickers.each((i, el) => {
            this.register(new Sticker(el));
        });
        $window.on('scroll', this.onScroll.bind(this));
    }

    private onScroll() {
        this.reposition($window.scrollTop());
    }

    private register(sticker:Sticker) {
        this.stickers.push(sticker);
    }

    private reposition(scrollTop) {
        this.stickers.forEach((sticker:Sticker) => {
            sticker.reposition(this.getStackHeight(sticker, scrollTop));
        });
    }

    private getStackHeight(sticker:Sticker, scrollTop:number) {
        var prevStickerIndex = this.stickers.indexOf(sticker) - 1,
            height = scrollTop;

        for (var k = prevStickerIndex; k >= 0; k--) {
            var curSticker = this.stickers[k];

            if (curSticker.isStuck() && sticker.canStickTo(curSticker)) {
                var curStickerOffset = curSticker.getOffset();
                height = curStickerOffset.top + curStickerOffset.height + scrollTop;
                break;
            }
        }
        return height;
    }
}

export = SmartStickers;