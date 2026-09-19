const path = require('path');
const webpack = require('webpack');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    mode: 'production',

    bail: true,

    devtool: 'source-map',

    entry: {
        APlayer: './src/js/index.js',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    sourceMap: true,
                    ecma: 2015,
                    module: true,
                    toplevel: true,
                },
                extractComments: false,
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].min.js',
        library: {
            type: 'module',
        },
        chunkFormat: 'module',
        publicPath: '/',
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.scss'],
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [['@babel/preset-env', { corejs: '3.8', useBuiltIns: 'entry' }]],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer, cssnano],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 40000,
                },
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.art$/,
                loader: 'art-template-loader',
                options: {
                    minimize: true,
                },
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            APLAYER_VERSION: `"${require('../package.json').version}"`,
            GIT_HASH: JSON.stringify(gitRevisionPlugin.version()),
        }),
        new MiniCssExtractPlugin({ filename: '[name].min.css' }),
    ],
};
