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
    },
    {
        input : 'src/wrapper/SuperMarqueeWC.js',
        output : [
            {
                format: 'iife',
                name : 'SuperMarquee',
                file : 'dist/SuperScrollWC.min.js',
                indent: '\t',
                plugins: [
                    uglify()
                ]
            },
            {
                format: 'iife',
                name : 'SuperMarquee',
                file : 'dist/SuperScrollWC.js',
                indent: '\t',
                plugins: []
            }
        ]
    }
];