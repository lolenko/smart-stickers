
class Sticker {
    private els:{
        $sticker:JQuery;
        $placeholder:JQuery;
        $context:JQuery;
    };
    private dims;

    constructor(element, options) {
        this.els.$sticker = $(element);
        this.els.$context = this.els.$sticker.parent();

        this.wrapWithPlaceholder();
    }

    private wrapWithPlaceholder() {
        var boxCSS = {
            margin: null,
            borderWidth: null,
            padding: null,
            height: null,
            width: null,
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
        var placeholderPositionCSS = $.extend({}, positionCSS);
        for (var CSSprop in boxCSS) {
            boxCSS[CSSprop] = this.els.$sticker.css(CSSprop);
        }
        for (var CSSprop in placeholderPositionCSS) {
            placeholderPositionCSS[CSSprop] = this.els.$sticker.css(CSSprop);
        }
        placeholderPositionCSS['position'] = (placeholderPositionCSS['position'] == 'relative' || placeholderPositionCSS['position'] == 'static') ? 'relative' : placeholderPositionCSS['position']
        var placeholderCSS = $.extend({}, placeholderPositionCSS, boxCSS);

        this.els.$placeholder = $('<div></div>');
        this.els.$placeholder.css(placeholderCSS);
        this.els.$sticker.wrap(this.els.$placeholder);
        this.els.$sticker.css($.extend({}, positionCSS, boxCSS));
    }

    private unwrapPlaceholder() {
        this.els.$sticker.unwrap();
        this.resetCSSToDefault();
    }

    private resetCSSToDefault() {

    }

    private updateDims() {

    }

    private resize() {
        this.unwrapPlaceholder();
        this.wrapWithPlaceholder();
        this.updateDims();
    }




/*
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


    canStickTo(sticker:Sticker):boolean {
        var ownDims = this.dims.sticker,
            overDims = sticker.getDims().sticker;
        return overDims.offset.left + overDims.width > ownDims.offset.left
            && ownDims.offset.left + ownDims.width > overDims.offset.left;
    }
*/

}
export = Sticker;

