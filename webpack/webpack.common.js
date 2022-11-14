const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ProgressPlugin, DefinePlugin } = webpack
const paths = require("./paths");

require('dotenv').config()

const env = {
    isProd: process.env.NODE_ENV === "production",
    isDev: process.env.NODE_ENV === "development",
};

const { isProd, isDev } = env;

const jsFilename = isProd
    ? "js/[name].[contenthash:8].bundle.js"
    : "js/[name].bundle.js"

const jsChunkFilename = isProd
    ? "js/[name].[contenthash:8].chunk.js"
    : "js/[name].chunk.js"


module.exports = {
    entry: {
        app: `${paths.appSrc}/index.js`,
    },
    output: {
        filename: jsFilename,
        chunkFilename: jsChunkFilename,
        path: paths.appDist,
        clean: true
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", 'jsx'],
        alias: {
            "@": paths.appSrc,
        },
        modules: ["node_modules", paths.appSrc],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                include: paths.appSrc,
                use: {
                    loader: "swc-loader"
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: paths.appSrc,
                type: "asset/resource",
                generator: {
                    filename: 'static/imgs/[hash][ext]',
                },
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: paths.appSrc,
                type: "asset/resource",
                generator: {
                    filename: 'static/fonts/[hash][ext]',
                },
            },
            {
                test: /\.(scss|sass)$/,
                include: paths.appSrc,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                                localIdentContext: paths.appSrc,
                            },
                            importLoaders: 2,
                        },
                    }
                    ,
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                    ],
                                ],
                            },
                        },
                    }, "sass-loader"].filter(Boolean),
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "webpack speed",
            template: paths.appHtml,
        }),
        new ProgressPlugin(),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    cache: {
        type: "filesystem",
    },
    stats: {
        all: false,
		version: true,
		timings: true,
		errors: true,
		errorsCount: true,
		warnings: true,
		warningsCount: true,
		logging: "warn"
    }
};