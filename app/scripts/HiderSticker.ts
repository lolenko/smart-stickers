import SimpleSticker = require('SimpleSticker');

enum ScrollDirection {
    UP,
    DOWN
}

class HiderSticker extends SimpleSticker {
    private scrollDir:ScrollDirection;
    private oldScrollTop:number;
    private hiderDelta:number;

    constructor(element, options?) {
        super(element, options);
        this.oldScrollTop = 0;
        this.hiderDelta = 0;
        this.scrollDir = ScrollDirection.DOWN;
    }

    public reposition(top:number):SimpleSticker {
        var scrollDelta = top - this.oldScrollTop;
        var scrollDir = this.updateScrollDir(top);

        top += this.top;
        var dims = this.dims;


        if (top <= dims.minTop) {
            top = dims.minTop;
            this.unStick();
        } else if (top >= dims.maxTop + this.hiderDelta) {
            top = dims.maxTop + this.hiderDelta;
            this.unStick();
        } else {
            if (scrollDir == ScrollDirection.DOWN) {
                this.hiderDelta = Math.min(this.hiderDelta + scrollDelta, dims.height - 5);
            } else {
                this.hiderDelta = Math.max(this.hiderDelta + scrollDelta, 0);
            }
            top -= this.hiderDelta;
            this.stick();
        }

        this.position(top);

        return this;
    }

    private updateScrollDir(scrollTop:number) {
        if (scrollTop > this.oldScrollTop) {
            this.scrollDir = ScrollDirection.DOWN;
        } else {
            this.scrollDir = ScrollDirection.UP;
        }
        this.oldScrollTop = scrollTop;
        return this.scrollDir;
    }

    public getOffset() {
        var offset = super.getOffset();
        offset.height -= this.hiderDelta;
        return offset;
    }
}

export = HiderSticker;

