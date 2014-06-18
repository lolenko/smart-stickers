import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');

if (jquery);
var $window = $(window);

class SmartStickers {
    private stickers:Sticker[] = [];

    constructor() {
        $('.sticker').each((i, el) => {
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

    private reposition(scrollTop:number) {
        this.stickers.forEach((sticker:Sticker) => {
            sticker.reposition(this.getStackHeight(sticker, scrollTop));
        });
    }

    private getStackHeight(sticker:Sticker, scrollTop:number):number {
        var prevStickerIndex = this.stickers.indexOf(sticker) - 1,
            height = scrollTop;

        for (var k = prevStickerIndex; k >= 0; k--) {
            var prevSticker = this.stickers[k];

            if (prevSticker.isStuck() && sticker.canStickTo(prevSticker)) {
                var prevStickerOffset = prevSticker.getOffset();
                height = prevStickerOffset.top + prevStickerOffset.height;
                break;
            }
        }
        return height;
    }
}

export = SmartStickers;