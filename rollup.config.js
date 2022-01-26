import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input : 'src/core/SuperMarquee.js',
        output : [
            {
                format: 'umd',
                name : 'SuperMarquee',
                file : 'dist/SuperMarquee.min.js',
                indent: '\t',
                plugins: [
                    uglify()
                ]
            },
            {
                format: 'umd',
                name : 'SuperMarquee',
                file : 'dist/SuperMarquee.js',
                indent: '\t',
                plugins: []
            }
        ]
    },
    {
        input : 'src/wrapper/SuperMarqueeJQ.js',
        output : [
            {
                format: 'umd',
                name : 'SuperMarquee',
                file : 'dist/jquery.supermarquee.min.js',
                indent: '\t',
                plugins: [
                    uglify()
                ]
            },
            {
                format: 'umd',
                name : 'SuperMarquee',
                file : 'dist/jquery.supermarquee.js',
                indent: '\t',
                plugins: []
            }
        ]
    }
];