import jquery = require('vendor/jquery');
if (jquery);
var $window = $(window);

class Sticker {
    private els:{
        $sticker?:JQuery;
        $placeholder?:JQuery;
        $context?:JQuery;
    };
    private _isStuck:boolean = false;
    private defaultInlineStyles:string;
    private isWrappedWithPlaceholder:boolean = false;
    private dims:{
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

    constructor(element, options?) {
        this.els = {};
        this.els.$sticker = $(element);
        this.els.$context = this.els.$sticker.parent();
        this.defaultInlineStyles = this.els.$sticker.attr('style') || '';
        this.wrapWithPlaceholder();
        this.updateDims(true);
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
            margin: placeholderCSS.margin,
            left: - parseInt(this.els.$placeholder.css('margin-left'), 10)
        }));
        this.isWrappedWithPlaceholder = true;
        return this;
    }

    private unwrapPlaceholder():Sticker {
        if (!this.isWrappedWithPlaceholder) {
            return this;
        }
        this.els.$sticker.unwrap();
        this.resetInlineStylesToDefault();
        this.isWrappedWithPlaceholder = false;
        return this;
    }

    private resetInlineStylesToDefault():Sticker {
        this.els.$sticker.attr('style', this.defaultInlineStyles);
        return this;
    }

    private updateDims(afterResize?:boolean):Sticker {
        var dims = this.dims;
        var els = this.els;

        dims.offset = els.$sticker.offset();
        if (afterResize) {
            dims.height = els.$sticker.outerHeight();
            dims.width = els.$sticker.outerWidth();
            dims.placeholderOffsetTop = els.$placeholder.offset().top;
            dims.minTop = - parseInt(els.$placeholder.css('margin-top'), 10);
            dims.maxTop = (els.$context.offset().top + els.$context.outerHeight() - parseInt(els.$context.css('padding-bottom'), 10)) - (dims.height + dims.placeholderOffsetTop);
        }

        return this;
    }

    private resetPlaceholder():Sticker {
        this.unwrapPlaceholder();
        this.wrapWithPlaceholder();
        this.updateDims(true);
        return this;
    }

    reposition(scrollTop:number):Sticker {
        var dims = this.dims;
        var top = scrollTop - dims.placeholderOffsetTop;

        if (top <= dims.minTop) {
            top = dims.minTop;
            this.unStick();
        } else if (top >= dims.maxTop) {
            top = dims.maxTop;
            this.stick();
        } else {
            this.stick();
        }

        this.els.$sticker.css({'top': top});
        this.updateDims();
        return this;
    }

    public isStuck():boolean {
        return this._isStuck;
    }

    private stick():Sticker {
        this._isStuck = true;
        return this;
    }

    private unStick():Sticker {
        this._isStuck = false;
        return this;
    }

    public canStickTo(sticker:Sticker):boolean {
        var ownOffset = this.getOffset(),
            overOffset = sticker.getOffset();
        return overOffset.left + overOffset.width > ownOffset.left
            && ownOffset.left + ownOffset.width > overOffset.left;
    }

    public getOffset() {
        return {
            left: this.dims.offset.left,
            top: this.dims.offset.top,
            width: this.dims.width,
            height: this.dims.height
        }
    }
}
export = Sticker;

