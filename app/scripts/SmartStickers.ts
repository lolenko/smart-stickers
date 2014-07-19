import jquery = require('vendor/jquery');
import Sticker = require('./StackSticker');

if (jquery);

class SmartStickers {
    private stickers:Sticker[] = [];
    private rootChildrens:Sticker[] = [];
    private scrollTop:number;
    private $root:JQuery;

    constructor(rootEl) {
        this.$root = $(rootEl);
        this.$root.on('register.stacksticker', (ev, data) => {
            ev.stopPropagation();
            this.add(data.sticker);
        });
        this.$root.on('scroll', this.onScroll.bind(this));
        setTimeout(() => {
            console.log(this.rootChildrens);
        },5000);
    }

    private onScroll() {
        this.scrollTop = this.$root.scrollTop();
        this.reposition(this.scrollTop);
    }

    public add(sticker:Sticker) {
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
        var candidateToBeChildrens = this.stickers.filter((candidate) => {
            return candidate.canStickTo(sticker);
        });
        candidateToBeChildrens.forEach(this.add.bind(this));

        this.reposition(this.scrollTop);
    }


    private reposition(scrollTop:number) {
        this.rootChildrens.forEach((sticker:Sticker) => {
            sticker.reposition(scrollTop + this.getOffset().top);
        });
    }

    public getOffset() {
        if (this.$root[0] === $(window)[0]) {
            return {
                top: 0,
                left: 0
            };
        } else {
            return this.$root.offset();
        }
    }
}

export = SmartStickers;