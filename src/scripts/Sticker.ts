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
        offset?:{
            left:number;
            top:number;
        };
    };

    constructor(element, options?) {
        this.els = {};
        this.els.$sticker = $(element);
        this.els.$context = this.els.$sticker.parent();
        this.defaultInlineStyles = this.els.$sticker.attr('style') || '';
        this.wrapWithPlaceholder();
        this.updateDims();
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
        this.els.$sticker.css($.extend({}, positionCSS, {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            margin: 0
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

    private updateDims():Sticker {
        this.dims = {
            minTop: 0,
            maxTop: this.els.$context.height() - this.els.$sticker.outerHeight(),
            height: this.els.$sticker.outerHeight(),
            width: this.els.$sticker.outerWidth(),
            offset: this.els.$sticker.offset()
        };
        return this;
    }

    private resetPlaceholder():Sticker {
        this.unwrapPlaceholder();
        this.wrapWithPlaceholder();
        this.updateDims();
        return this;
    }

    reposition(scrollTop:number):Sticker {
        var top = scrollTop - this.els.$context.offset().top;

        this.unStick();
        if (top <= this.dims.minTop) {
            top = this.dims.minTop;
        } else if (top >= this.dims.maxTop) {
            top = this.dims.maxTop;
        } else {
            this.stick();
        }

        this.els.$sticker.css({'top': top});
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
            overOffset = this.getOffset();
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

