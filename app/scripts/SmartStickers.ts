import jquery = require('vendor/jquery');
import Sticker = require('./Sticker');

if (jquery);
var $window = $(window);

class SmartStickers {
    private stickers:Sticker[] = [];
    private rootChildrens:Sticker[] = [];
    private scrollTop:number;

    constructor() {
        $('.sticker').each((i, el) => {
            setTimeout(() => {
                this.add(new Sticker(el));
            }, Math.random() * 5000)

        });
        console.log(this.rootChildrens);
        $window.on('scroll', this.onScroll.bind(this));
    }

    private onScroll() {
        this.scrollTop = $window.scrollTop();
        this.reposition(this.scrollTop);
    }

    // Вставляет новый стикер на нужное место в дереве
    private add(sticker:Sticker) {
        var candidatesToStick = this.stickers.filter(sticker.canStickTo.bind(sticker));
        if (candidatesToStick.length > 0) {
            var mainCandidate = candidatesToStick[0];
            for (var i = 1, len = candidatesToStick.length; i < len; i++) {
                if (mainCandidate.getStackHeight() < candidatesToStick[i].getStackHeight()) {
                    mainCandidate = candidatesToStick[i];
                }
            }
            // Пересооденить подходящие дочерние стикеру к новому
            var candidateChildrens = mainCandidate.childrens;
            for (var i = 0; i < candidateChildrens.length; i++) {
                if (!candidateChildrens[i].canStickTo(sticker)) {
                    continue;
                }
                var tempSticker = candidateChildrens.splice(i, 1)[0];
                tempSticker.setParent(sticker);
                sticker.addChild(tempSticker);
                i--;
            }

            sticker.setParent(mainCandidate);
            mainCandidate.addChild(sticker);
        } else {
            var candidateChildrens = this.rootChildrens;
            for (var i = 0; i < candidateChildrens.length; i++) {
                if (!candidateChildrens[i].canStickTo(sticker)) {
                    continue;
                }
                var tempSticker = candidateChildrens.splice(i, 1)[0];
                tempSticker.setParent(sticker);
                sticker.addChild(tempSticker);
                i--;
            }
            this.rootChildrens.push(sticker);
        }
        this.stickers.push(sticker);
        this.reposition(this.scrollTop);
    }


    private reposition(scrollTop:number) {
        this.rootChildrens.forEach((sticker:Sticker) => {
            sticker.reposition(scrollTop);
        });
    }
}

export = SmartStickers;