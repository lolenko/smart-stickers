
class Sticker {
    private els:{
        $el:JQuery;
        $placeholder:JQuery;
        $context:JQuery;
    };
    private dims;

    constructor(element, options) {
        this.els.$el = $(element);
        this.els.$context = this.els.$el.parent();

        this.wrapWithPlaceholder();
    }

    private wrapWithPlaceholder() {

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

}
export = Sticker;

