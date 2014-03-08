/*require.config({

});*/
///<reference path="vendor/jquery.d.ts" />

import jquery = require('vendor/jquery');
import Sticker = require('Sticker');

if (jquery) $.noop();

$('.sticker').each(function(i, el) {
    new Sticker(el);
});