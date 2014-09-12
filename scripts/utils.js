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

    return {
        inherits: inherits
    };

});