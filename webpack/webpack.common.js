const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ProgressPlugin } = webpack
const paths = require("./paths");

const env = {
    isProd: process.env.NODE_ENV === "production",
    isDev: process.env.NODE_ENV === "development",
};

const { isProd } = env;

const jsFilename = isProd
    ? "js/[name].[contenthash].bundle.js"
    : "js/[name].bundle.js"

const cssFilename = 'css/[name].css'

module.exports = {
    entry: {
        app: `${paths.appSrc}/index.js`,
    },
    output: {
        filename: jsFilename,
        path: paths.appDist,
        clean: true,
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
                    "style-loader",
                    isProd && MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
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
        new MiniCssExtractPlugin({
            filename: cssFilename
        })
    ],
    cache: {
        type: "filesystem",
    },
};