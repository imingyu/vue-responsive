import extend from 'jquery-tool-extend';
import options from './options';
const Components = [];
var emitTimer;
const emitMediaChange = (event) => {
    var width = document.body.clientWidth;
    Components.forEach(item => {
        item.__documentWidth__ = width;
    });
}
(window.addEventListener || window.attachEvent)('resize', event => {
    if (emitTimer) {
        clearTimeout(emitTimer);
    }
    setTimeout(() => {
        emitMediaChange(event);
    }, options.delay);
});

export default (ops = {}) => {
    extend(true, ops, options);
    const mixin = {
        props: {},
        data: {
            __responsiveOptions__: ops,
            __documentWidth__: document.body.clientWidth
        },
        watch: {
            __documentWidth__() {
                var medias = this.mediaNames;

                medias && medias.length > 0 && medias.forEach(prop => {
                    var media = this.__responsiveOptions__.media[prop];
                    var propValue = this[media.prop || prop];
                    propValue = typeof media.convert ? media.convert(propValue) : propValue;
                    if (typeof propValue === 'object') {
                        Object.keys(propValue).forEach(name => {
                            this.$set(this, name, propValue[name])
                        })
                    }
                });
            }
        },
        computed: {
            mediaNames() {
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
        created() {
            Components.push(this);
        },
        beforeDestroy() {
            Components.splice(Components.indexOf(this), 1);
        }
    };
    for (let prop in ops.media) {
        const item = ops.media[prop];
        prop = item.prop || prop;
        mixin.props[prop] = {};
        mixin.props[prop].type = item.type || null;
        if (typeof item.validator === 'function') {
            mixin.props[prop].validator = item.validator;
        }
    }
    return mixin;
}