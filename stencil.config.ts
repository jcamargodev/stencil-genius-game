import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

// https://stenciljs.com/docs/config

export const config: Config = {
    globalScript: 'src/global/app.ts',
    globalStyle: 'src/global/app.scss',
    taskQueue: 'async',
    outputTargets: [
        {
            type: 'www',
            serviceWorker: null,
        },
    ],
    plugins: [
        sass({
            includePaths: ['./node_modules', './src/global/styles'],
        }),
        postcss({
            plugins: [autoprefixer()],
        }),
    ],
    devServer: {
        openBrowser: false,
    },
};
