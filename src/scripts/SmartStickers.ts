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

    private reposition(top) {
        this.stickers.forEach((sticker:Sticker) => {
            sticker.reposition(this.getStackHeight(sticker, top));
        });
    }

    private getStackHeight(sticker:Sticker, top:number) {
        var prevStickerIndex = this.stickers.indexOf(sticker) - 1,
            height = top;

        for (var k = prevStickerIndex; k >= 0; k--) {
            var curSticker = this.stickers[k];

            if (curSticker.isStuck() && sticker.canStickTo(curSticker)) {
                var curStickerOffset = curSticker.getOffset();
                height += curStickerOffset.top + curStickerOffset.height;
                break;
            }
        }
        return height;
    }
}

export = SmartStickers;