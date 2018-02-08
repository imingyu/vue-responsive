(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery-tool-extend')) :
	typeof define === 'function' && define.amd ? define(['jquery-tool-extend'], factory) :
	(global.VueResponsiveData = factory(global.extend));
}(this, (function (extend) { 'use strict';

extend = extend && extend.hasOwnProperty('default') ? extend['default'] : extend;

var options = {
    delay: 300,
    media: {
        xs: {
            max: 768
        },
        sm: {
            min: 768,
            max: 992
        },
        md: {
            min: 992,
            max: 1200
        },
        lg: {
            min: 1200,
            max: 1920
        },
        xl: {
            min: 1920
        }
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Components = [];
var emitTimer;
var emitMediaChange = function emitMediaChange(event) {
    var width = document.body.clientWidth;
    Components.forEach(function (item) {
        item.__documentWidth__ = width;
    });
};
(window.addEventListener || window.attachEvent)('resize', function (event) {
    if (emitTimer) {
        clearTimeout(emitTimer);
    }
    setTimeout(function () {
        emitMediaChange(event);
    }, options.delay);
});

var createMixin = (function () {
    var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    extend(true, ops, options);
    var mixin = {
        props: {},
        data: {
            __responsiveOptions__: ops,
            __documentWidth__: document.body.clientWidth
        },
        watch: {
            __documentWidth__: function __documentWidth__() {
                var _this = this;

                var medias = this.mediaNames;

                medias && medias.length > 0 && medias.forEach(function (prop) {
                    var media = _this.__responsiveOptions__.media[prop];
                    var propValue = _this[media.prop || prop];
                    propValue = _typeof(media.convert) ? media.convert(propValue) : propValue;
                    if ((typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) === 'object') {
                        Object.keys(propValue).forEach(function (name) {
                            _this.$set(_this, name, propValue[name]);
                        });
                    }
                });
            }
        },
        computed: {
            mediaNames: function mediaNames() {
                var arr = [];
                for (var prop in __responsiveOptions__.media) {
                    var item = __responsiveOptions__.media[prop];
                    var min = item.min || 0;
                    var max = item.max || Infinity;
                    if (this.__documentWidth__ >= min && this.__documentWidth__ <= max) {
                        arr.push(prop);
                    }
                }
                return arr;
            }
        },
        created: function created() {
            Components.push(this);
        },
        beforeDestroy: function beforeDestroy() {
            Components.splice(Components.indexOf(this), 1);
        }
    };
    for (var prop in ops.media) {
        var item = ops.media[prop];
        prop = item.prop || prop;
        mixin.props[prop] = {};
        mixin.props[prop].type = item.type || null;
        if (typeof item.validator === 'function') {
            mixin.props[prop].validator = item.validator;
        }
    }
    return mixin;
});

var version = "1.0.0";

createMixin.version = version;
createMixin.install = function (Vue) {
    var ops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    extend(true, options, ops);
    Vue.mixin(createMixin(options));
};

return createMixin;

})));
//# sourceMappingURL=index.js.map
