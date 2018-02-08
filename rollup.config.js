import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
export default {
    input: './src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'VueResponsiveData',
        sourcemap: true
    },
    external: ['jquery-tool-extend'],
    plugins: [
        json(),
        babel()
    ]
}