const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = {
    entry: {
        popup: './src/popup.jsx',
        background: './src/background.js',
        contentScript: './src/contentScript.js',
        webPageSender: './src/webPageSender.js',
        EventFunction: './src/eventFunction.js',
        Loader: './src/Loader.js',
        "regenerator-runtime/runtime.js": './src/background.js',
        "regenerator-runtime/runtime.js": './src/Controllers.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({
            template: './src/popup.html',
            filename: "popup.html"
        }),
        new HtmlWebpackPlugin({
            template: './src/devtools.html',
            filename: "devtools.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "public" },
            ],
        }),
        new MiniCssExtractPlugin(),
    ], experiments: {
        asyncWebAssembly: true,
        // WebAssembly as async module (Proposal)
        syncWebAssembly: true,
        // WebAssembly as sync module (deprecated)
        outputModule: true,
        // Allow to output ESM
        topLevelAwait: true,
        // Allow to use await on module evaluation (Proposal)
    }
};