define(function() {

    'use strict';

    /**
     * Наследует ctor от superCtor
     *
     * @param {constructor} ctor - целевоей конструктор
     * @param {constructor} superCtor - наследуемый конструктор
     */

    var inherits = function(ctor, superCtor) {
        ctor.super_ = superCtor;
        var F = function() {};
        F.prototype = superCtor.prototype;
        ctor.prototype = new F();
        ctor.prototype.constructor = ctor;
    };

    var testCSSValue = function( property, value, noPrefixes ) {
        // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
        var prop = property + ':',
            el = document.createElement( 'test' ),
            mStyle = el.style;

        if( !noPrefixes ) {
            mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
        } else {
            mStyle.cssText = prop + value;
        }
        return mStyle[ property ].indexOf( value ) !== -1;
    };

    return {
        inherits: inherits,
        testCSSValue: testCSSValue
    };

});