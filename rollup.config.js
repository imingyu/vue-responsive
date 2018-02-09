import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
export default {
    input: './src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'VueResponsiveData',
        sourcemap: false
    },
    // external: ['jquery-tool-extend'],
    plugins: [
        json(),
        resolve(),
        babel(),
        commonJS()
    ]
}