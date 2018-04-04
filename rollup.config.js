import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    plugins: [resolve({
        ignore: ['puppeteer'],
    })],
    output: [{
        interop: false,
        file: 'hydris.js',
        format: 'cjs',
    }],
    external: ['puppeteer'],
};
