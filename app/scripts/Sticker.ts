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
    private parent:Sticker;
    private childrens:Sticker[];

    constructor(element, options?) {
        this.childrens = [];
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
        if (this.parent) {
            scrollTop = this.parent.getOffset().top + this.parent.getOffset().height;
        }
        var top = scrollTop - dims.placeholderOffsetTop;

        if (top <= dims.minTop) {
            top = dims.minTop;
            this.unStick();
        } else if (top >= dims.maxTop) {
            top = dims.maxTop;
            this.unStick();
        } else {
            this.stick();
        }

        this.els.$sticker.css({'top': top});
        this.updateDims();

        this.childrens.forEach((sticker) => {
            sticker.reposition(scrollTop);
        });

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
        return !this.contains(sticker)
            && this.compareHorizontalTo(sticker) == 0
            && this.compareVerticalTo(sticker) > 0;
    }

    public contains(sticker:Sticker):boolean {
        return $.contains(sticker.getRoot()[0], this.getRoot()[0])
    }

    public compareHorizontalTo(sticker:Sticker):number {
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

    public compareVerticalTo(sticker:Sticker):number {
        var ownOffset = this.getOffset(),
            overOffset = sticker.getOffset();

        if (overOffset.top + overOffset.height < ownOffset.top) {
            return ownOffset.top - (overOffset.top + overOffset.height);
        } else if (ownOffset.top + ownOffset.height < overOffset.top) {
            return (ownOffset.top + ownOffset.height) - overOffset.top;
        } else {
            return 0
        }
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

    public addChild(sticker:Sticker) {
        this.childrens.push(sticker);
    }

    public setParent(sticker:Sticker) {
        this.parent = sticker;
    }
}
export = Sticker;

