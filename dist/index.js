(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueResponsiveData = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var extend = function extend() {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        class2type = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object'
    },
        jQuery = {
        isFunction: function isFunction(obj) {
            return jQuery.type(obj) === 'function';
        },
        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === 'array';
        },
        isWindow: function isWindow(obj) {
            return obj != null && obj == obj.window;
        },
        isNumeric: function isNumeric(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function type(obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
        },
        isPlainObject: function isPlainObject(obj) {
            if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType) {
                return false;
            }
            try {
                if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key);
        }
    };
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && !jQuery.isFunction(target)) {
        target = {};
    }
    if (length === i) {
        target = this;
        --i;
    }
    for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};

var jqueryToolExtend = extend;

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

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Components = [];
var emitTimer;
var emitMediaChange = function emitMediaChange(event) {
    var width = document.body.clientWidth;
    Components.forEach(function (item) {
        item.documentWidth__ = width;
    });
};
window.addEventListener('resize', function (event) {
    if (emitTimer) {
        clearTimeout(emitTimer);
    }
    console.log(event);
    emitTimer = setTimeout(function () {
        emitTimer = null;
        emitMediaChange(event);
    }, options.delay);
}, false);

var createMixin = (function () {
    var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    jqueryToolExtend(true, ops, options);
    var mixin = {
        props: {},
        data: function data() {
            return {
                responsiveOptions__: ops,
                documentWidth__: document.body.clientWidth
            };
        },

        watch: {
            documentWidth__: function documentWidth__() {
                var _this = this;

                var medias = this.mediaNames;

                medias && medias.length > 0 && medias.forEach(function (prop) {
                    var media = _this.responsiveOptions__.media[prop];
                    var propValue = _this[media.prop || prop];
                    propValue = typeof media.convert === 'function' ? media.convert(propValue) : propValue;
                    if ((typeof propValue === 'undefined' ? 'undefined' : _typeof$1(propValue)) === 'object') {
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
                for (var prop in this.responsiveOptions__.media) {
                    var item = this.responsiveOptions__.media[prop];
                    var min = item.min || 0;
                    var max = item.max || Infinity;
                    if (this.documentWidth__ >= min && this.documentWidth__ <= max) {
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

    jqueryToolExtend(true, options, ops);
    Vue.mixin(createMixin(options));
};

return createMixin;

})));
