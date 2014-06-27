import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');

if (jquery);
var $window = $(window);

class SmartStickers {
    private stickers:Sticker[] = [];

    constructor() {
        $('.sticker').each((i, el) => {
            this.add(new Sticker(el));
        });
        $window.on('scroll', this.onScroll.bind(this));
    }

    private onScroll() {
        this.reposition($window.scrollTop());
    }

    private add(sticker:Sticker) {
        this.stickers.push(sticker);
    }

    private reposition(scrollTop:number) {
        this.stickers.forEach((sticker:Sticker) => {
            sticker.reposition(this.getStackHeight(sticker, scrollTop));
        });
    }

    private getStackHeight(sticker:Sticker, scrollTop:number):number {
        var candidatesToStick = this.stickers.filter(sticker.canStickTo.bind(sticker));
        if (candidatesToStick.length == 0) {
            return scrollTop;
        }
        var height = scrollTop;
        for (var i = 0, len = candidatesToStick.length; i < len; i++) {
            if (height < candidatesToStick[i].getOffset().top + candidatesToStick[i].getOffset().height) {
                height = candidatesToStick[i].getOffset().top + candidatesToStick[i].getOffset().height;
            }
        }
        return height;


//        var prevStickerIndex = this.stickers.indexOf(sticker) - 1,
//            height = scrollTop;
//
//        for (var k = prevStickerIndex; k >= 0; k--) {
//            var prevSticker = this.stickers[k];
//
//            if (sticker.canStickTo(prevSticker)) {
//                var prevStickerOffset = prevSticker.getOffset();
//                height = prevStickerOffset.top + prevStickerOffset.height;
//                break;
//            }
//        }
//        return height;
    }
}

export = SmartStickers;