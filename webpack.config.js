const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = function (env, argv) {
    const environment = argv.mode;
    const entries = ['index', 'second'];
    const html = entries.map(entryName => {
        return new HtmlWebPackPlugin({
            filename: `${entryName}.html`,
            template: `./src/${entryName}.twig`,
        })
    });
    const css = new MiniCssExtractPlugin({
        filename: `./dist/css/main.css`,
        chunkFilename: `./src/main.css`
    });

    const entryOptions = entries.map(entryName => {
        return `./src/${entryName}.js`
    });

    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.twig$/,
                    use: ['html-loader', 'twig-html-loader']
                },
                {
                    test: /\.(png|jpe?g)/i,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                name: "./img/[name].[ext]",
                                limit: 10000
                            }
                        },
                        {
                            loader: "img-loader"
                        }
                    ]
                },
                {
                    test: /\.sass$/,
                    use: [
                        environment === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => {
                                    return environment === 'production' ? [autoprefixer, cssnano] : [autoprefixer];
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ],
        },
        entry: entryOptions,
        output: {
            path: __dirname,
            filename: "./dist/js/[name].js"
        },
        stats: 'errors-only',
        plugins: [...html, css]
    }
};
