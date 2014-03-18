import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');
if (jquery);
var $window = $(window);

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
            sticker.reposition(top);
        });
    }
}

export = SmartStickers;