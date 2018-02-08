import extend from 'jquery-tool-extend';
import createMixin from './core';
import options from './options'
import { version } from '../package.json';
createMixin.version = version;
createMixin.install = function (Vue, ops = {}) {
    extend(true, options, ops);
    Vue.mixin(createMixin(options));
}
export default createMixin;