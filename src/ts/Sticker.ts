import widget = require("portal/widget");

class Sticker extends widget.Widget {
    constructor(element, config) {
        super(element, config);
        this.initEls();
        this.behavior = this.getState('behavior').value || 'default';
        this.resize();
        this.stick();
        this.unStick();
        this.register('sticker');
    }

    behavior:string = 'default';
    els;
    dims;
    private _isStuck:boolean = false;

    static stickyCSS = {
        'margin': '0',
        'width': '100%',
        'position': 'absolute'
    };

    private initEls() {
        this.els = {
            $sticker: this.getNode('sticker'),
            $context: this.rootNode.parent(),
            $placeholder: this.rootNode,
            $window: $(window),
            $document: $(document)
        };
    }

    private setPosition(position:string):Sticker {
        this.removeState('position');
        this.setState('position', position);
        return this;
    }

    private stick():Sticker {
        if (!this.isStuck()) {
            this.setPosition('fixed');
            this._isStuck = true;
        }
        return this;
    }

    private unStick():Sticker {
        if (this.isStuck()) {
            this.setPosition('static');
            this._isStuck = false;
        }
        return this;
    }

    isStuck():boolean {
        return this._isStuck;
    }

    private resize() {
        var els = this.els,
            $sticker = els.$sticker,
            $context = els.$context,
            $placeholder = els.$placeholder,
            placeholderCSS = {},
            stickerCSS = $.extend({}, Sticker.stickyCSS);

        placeholderCSS['position'] = placeholderCSS['position'] == 'absolute' ? 'absolute' : 'relative';
        placeholderCSS['height'] = $sticker.outerHeight(true) + 'px';

        $placeholder.css(placeholderCSS);
        $sticker.css(stickerCSS);

        this.dims = {
            sticker: {
                offset: $sticker.offset(),
                width: $sticker.outerWidth(),
                height: $sticker.outerHeight()
            },
            placeholder: {
                offset: $placeholder.offset(),
                width: $placeholder.outerWidth(),
                height: $placeholder.outerHeight()
            },
            context: {
                offset: $context.offset(),
                width: $context.outerWidth(),
                height: $context.height()
            },
            window: {
                height: els.$window.height()
            },
            document: {
                height: els.$document.height()
            }
        };
        var dims = this.dims;
        switch (this.behavior) {
            case 'default':
                dims.minY = 0;
                dims.maxY = dims.context.height - dims.sticker.height - (dims.placeholder.offset.top - dims.context.offset.top);
                break;
            case 'bottom':
                dims.minY = - (dims.placeholder.offset.top - dims.context.offset.top);
                dims.maxY = 0;
                break;
        }
    }

    private resetOffset() {
        this.dims.sticker.offset = this.els.$sticker.offset();
    }

    reposition(top) {
        var els = this.els,
            dims = this.dims,
            minY = dims.minY,
            maxY = dims.maxY;

        top = top - els.$placeholder.offset().top;
        if (this.behavior === 'bottom') {
            top = top + dims.window.height - dims.placeholder.height;
        }

        this.unStick();
        if (top <= minY) {
            top = minY;
        } else if (top >= maxY) {
            top = maxY;
        } else {
            this.stick();
        }

        els.$sticker.css({'top': top});
        this.resetOffset();
    }

    private stickWithScroll(top) {
        /*        var scrollDirection = scrollTop > this.oldScrollTop ? 'down' : 'up';
         if (scrollDirection === 'down') {
         this.stickToBottom(scrollTop, marginTop);
         } else {
         this.stickToTop(scrollTop, marginTop);
         }
         this.oldScrollTop = scrollTop;*/
    }

    isChildOf(sticker:Sticker):boolean {
        return this.els.$sticker.closest(sticker.els.$sticker).length > 0;
    }

    canStickTo(sticker:Sticker):boolean {
        var ownDims = this.dims.sticker,
            overDims = sticker.getDims().sticker;
        return overDims.offset.left + overDims.width > ownDims.offset.left
            && ownDims.offset.left + ownDims.width > overDims.offset.left;
    }

    getDims() {
        return this.dims;
    }

    setZIndex(index:number):Sticker {
        this.els.$sticker.css({'z-index': index});
        return this;
    }
}
export = Sticker;

