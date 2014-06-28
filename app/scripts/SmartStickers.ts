import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');

if (jquery);
var $window = $(window);

class SmartStickers {
    private stickers:Sticker[] = [];
    private rootChildrens:Sticker[] = []

    constructor() {
        $('.sticker').each((i, el) => {
            this.add(new Sticker(el));
        });
        this.buildTree();
        console.log(this.rootChildrens);
        $window.on('scroll', this.onScroll.bind(this));
    }

    private onScroll() {
        this.reposition($window.scrollTop());
    }

    private add(sticker:Sticker) {
        this.stickers.push(sticker);
    }

    private buildTree() {
        this.stickers.forEach((sticker:Sticker) => {
            var candidatesToStick = this.stickers.filter(sticker.canStickTo.bind(sticker));
            console.log(sticker, candidatesToStick);
            if (candidatesToStick.length > 0) {
                var mainCandidate = candidatesToStick[0];
                for (var i = 1, len = candidatesToStick.length; i < len; i++) {
                    if (mainCandidate.getOffset().top + mainCandidate.getOffset().height < candidatesToStick[i].getOffset().top + candidatesToStick[i].getOffset().height) {
                        mainCandidate = candidatesToStick[i];
                    }
                }
                sticker.setParent(mainCandidate);
                mainCandidate.addChild(sticker);
            } else {
                this.rootChildrens.push(sticker);
            }
        });
    }

    private reposition(scrollTop:number) {
        this.rootChildrens.forEach((sticker:Sticker) => {
            sticker.reposition(scrollTop);
        });
    }
}

export = SmartStickers;