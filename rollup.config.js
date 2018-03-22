import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'index.next.js',
    plugins: [
        resolve({
            jsnext: true,
        }),
    ],
    output: [
        {
            file: 'hydris.js',
            format: 'umd',
        },
    ],
};
