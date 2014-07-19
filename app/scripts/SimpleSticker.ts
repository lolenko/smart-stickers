import jquery = require('vendor/jquery');
if (jquery);
var $window = $(window);

class SimpleSticker {
    private els:{
        $sticker?:JQuery;
        $placeholder?:JQuery;
        $context?:JQuery;
    };
    private _isStuck:boolean = false;
    private defaultInlineStyles:string;
    private isWrappedWithPlaceholder:boolean = false;
    dims:{
        maxTop?:number;
        minTop?:number;
        height?:number;
        width?:number;
        placeholderOffsetTop?:number;
        offset?:{
            left:number;
            top:number;
        };
    } = {};
    top:number;

    constructor(element, options?) {
        this.els = {};
        this.els.$sticker = $(element);
        this.els.$context = this.els.$sticker.parent();
        this.defaultInlineStyles = this.els.$sticker.attr('style') || '';
        this.wrapWithPlaceholder();
        this.updateDims(true);
        this.top = 0;
        $window.on('resize', this.resetPlaceholder.bind(this));
    }

    private wrapWithPlaceholder() {
        if (this.isWrappedWithPlaceholder) {
            return this;
        }
        var boxCSS = {
            margin: null,
            boxSizing: null,
            float: null,
            clear: null,
            display: null
        };
        var positionCSS = {
            position: 'absolute',
            top: 0,
            right: 'auto',
            bottom: 'auto',
            left: 0
        };

        var placeholderCSS:any = {};
        for (var CSSprop in boxCSS) {
            placeholderCSS[CSSprop] = this.els.$sticker.css(CSSprop);
        }
        placeholderCSS.width = this.els.$sticker.outerWidth();
        placeholderCSS.height = this.els.$sticker.outerHeight();

        var placeholderPositionCSS = $.extend({}, positionCSS);
        for (var CSSprop in placeholderPositionCSS) {
            placeholderPositionCSS[CSSprop] = this.els.$sticker.css(CSSprop);
        }
        placeholderPositionCSS['position'] = (placeholderPositionCSS['position'] == 'relative' || placeholderPositionCSS['position'] == 'static') ? 'relative' : placeholderPositionCSS['position']
        $.extend(placeholderCSS, placeholderPositionCSS);

        this.els.$placeholder = $('<div></div>');
        this.els.$placeholder.css(placeholderCSS);
        this.els.$sticker.wrap(this.els.$placeholder);
        this.els.$placeholder = this.els.$sticker.parent();
        this.els.$sticker.css($.extend({}, positionCSS, {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            margin: 0,
            left: 0
        }));
        this.isWrappedWithPlaceholder = true;
        return this;
    }

    private unwrapPlaceholder():SimpleSticker {
        if (!this.isWrappedWithPlaceholder) {
            return this;
        }
        this.els.$sticker.unwrap();
        this.resetInlineStylesToDefault();
        this.isWrappedWithPlaceholder = false;
        return this;
    }

    private resetInlineStylesToDefault():SimpleSticker {
        this.els.$sticker.attr('style', this.defaultInlineStyles);
        return this;
    }

    private updateDims(afterResize?:boolean):SimpleSticker {
        var dims = this.dims;
        var els = this.els;

        dims.offset = els.$sticker.offset();
        if (afterResize) {
            dims.height = els.$sticker.outerHeight();
            dims.width = els.$sticker.outerWidth();
            dims.placeholderOffsetTop = els.$placeholder.offset().top;
            dims.minTop = dims.placeholderOffsetTop;
            dims.maxTop = (els.$context.offset().top + els.$context.outerHeight() - parseInt(els.$context.css('padding-bottom'), 10) - parseInt(els.$context.css('border-bottom'), 10)) - (dims.height);
        }

        return this;
    }

    private resetPlaceholder():SimpleSticker {
        this.unwrapPlaceholder();
        this.wrapWithPlaceholder();
        this.updateDims(true);
        return this;
    }

    public reposition(top:number):SimpleSticker {
//        this.updateDims(true);
        // если хранить значение топ, его не надо пересчитывать.. но тогда видимо будут трудности при стикерах которые могут прятоться
        top += this.top;
        var dims = this.dims;

        if (top <= dims.minTop) {
            top = dims.minTop;
            this.unStick();
        } else if (top >= dims.maxTop) {
            top = dims.maxTop;
            this.unStick();
        } else {
            this.stick();
        }

        this.position(top);

        return this;
    }

    position(top:number):SimpleSticker {
        this.els.$sticker.css({'top': top - this.dims.placeholderOffsetTop});
        return this;
    }

    public isStuck():boolean {
        return this._isStuck;
    }

    stick():SimpleSticker {
        this.els.$sticker.addClass('_is-stuck');
        this._isStuck = true;
        return this;
    }

    unStick():SimpleSticker {
        this.els.$sticker.removeClass('_is-stuck');
        this._isStuck = false;
        return this;
    }


    public getOffset() {
        return {
            left: this.dims.offset.left,
            top: this.dims.offset.top,
            width: this.dims.width,
            height: this.dims.height
        }
    }

    public getRoot():JQuery {
        return this.els.$sticker;
    }

    public setTop(top:number) {
        this.top = top;
    }
}

export = SimpleSticker;

