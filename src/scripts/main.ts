///<reference path="vendor/jquery.d.ts" />

import jquery = require('vendor/jquery');
import Sticker = require('Sticker');

if (jquery) $.noop();

var stickers = [];

$('.sticker').each(function(i, el) {
    stickers.push(new Sticker(el));
});

$(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    stickers.forEach(function(sticker) {
        sticker.reposition(scrollTop);
    });
})