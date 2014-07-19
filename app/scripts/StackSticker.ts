import jquery = require('vendor/jquery');
import SmartStickers = require('./SmartStickers');
import SimpleSticker = require('./SimpleSticker');
if (jquery);

class StackSticker {
    private sticker:SimpleSticker;
    private startOffset;
    private parent:StackSticker;
    private childrens:StackSticker[];

    constructor(element, options?) {
        this.sticker = new SimpleSticker(element);
        this.childrens = [];
        this.startOffset = $.extend({}, this.sticker.getOffset(), true);
        this.sticker.getRoot().trigger('register.stacksticker', {sticker: this});
    }

    public reposition(top:number):StackSticker {
        this.sticker.reposition(top);
        top += this.getOffset().height;
        this.childrens.forEach((sticker) => {
            sticker.reposition(top);
        });
        return this;
    }

    public getOffset() {
        return this.sticker.getOffset();
    }

    public getStartOffset() {
        return this.startOffset;
    }

    private getRoot():JQuery {
        return this.sticker.getRoot();
    }

    public contains(sticker:StackSticker):boolean {
        return $.contains(sticker.getRoot()[0], this.getRoot()[0])
    }

    public compareHorizontalTo(sticker:StackSticker):number {
        var ownOffset = this.getOffset(),
            overOffset = sticker.getOffset();

        if (overOffset.left + overOffset.width < ownOffset.left) {
            return ownOffset.left - (overOffset.left + overOffset.width);
        } else if (ownOffset.left + ownOffset.width < overOffset.left) {
            return (ownOffset.left + ownOffset.width) - overOffset.left;
        } else {
            return 0
        }
    }

    public compareVerticalTo(sticker:StackSticker):number {
        var ownOffset = this.getStartOffset(),
            overOffset = sticker.getStartOffset();

        if (overOffset.top + overOffset.height < ownOffset.top) {
            return ownOffset.top - (overOffset.top + overOffset.height);
        } else if (ownOffset.top + ownOffset.height < overOffset.top) {
            return (ownOffset.top + ownOffset.height) - overOffset.top;
        } else {
            return 0
        }
    }

    public canStickTo(sticker:StackSticker):boolean {
        return !this.contains(sticker)
            && this.compareHorizontalTo(sticker) == 0
            && this.compareVerticalTo(sticker) > 0;
    }

    public getStackHeight() {
        return this.getOffset().height + (this.parent ? this.parent.getStackHeight() : 0);
    }

    public addChild(sticker:StackSticker) {
        this.childrens.push(sticker);
    }

    public getChildrens() {
        return this.childrens;
    }

    public emptyChildrens() {
        this.childrens = [];
        return this;
    }

    public setParent(sticker:StackSticker) {
        this.parent = sticker;
    }

    public getParent():StackSticker {
        return this.parent;
    }

    public deattach() {
        if (this.parent) {
            var parentChildrens = this.parent.getChildrens();
            parentChildrens.splice(parentChildrens.indexOf(this), 1);
            this.setParent(null);
        }
    }

    public attach(sticker:StackSticker) {
        sticker.deattach();
        this.addChild(sticker);
        sticker.setParent(this);
        sticker.setTop(this.getStackHeight())
    }

    public setTop(top:number) {
        this.sticker.setTop(top);
    }
}

export = StackSticker;

