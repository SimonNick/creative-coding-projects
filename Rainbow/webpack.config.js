const FILE_NAME = 'index.html';
const TEMPLATE_NAME = 'index_template.html';
const BUNDLE_NAME = 'bundle.js';
const SCRIPT_NAME = 'index.js';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');

module.exports = (env, argv) => {

    var plugin_lst = [
        new HtmlWebpackPlugin({
            template: TEMPLATE_NAME,
        }),
    ]

    if (argv.mode === 'production') {
        plugin_lst.push(
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/js/]),
            new MinifyHtmlWebpackPlugin({
                afterBuild: true,
                ignoreFileNameRegex: new RegExp('^(?!.*' + FILE_NAME + ')'),
                src: '.',
                dest: '.',
                rules: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true,
                }
            })
        )
    }

    return {
        entry: `./${SCRIPT_NAME}`,
        output: {
            path: path.resolve(__dirname, '.'),
            filename: BUNDLE_NAME
        },
        plugins: plugin_lst,
        module: {
            rules: [
                {
                test: /\.ya?ml$/,
                  include: path.resolve(process.cwd(), '/'),
                loader: 'js-yaml-loader'
                },
            ]
        }
    }
};