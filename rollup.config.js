import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    plugins: [resolve()],
    interop: false,
    output: [{
        file: 'hydris.js',
        format: 'cjs',
    }],
    external: ['puppeteer'],
};
