const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = function(env, argv){
  const environment = argv.mode;
  const entries = ['index'];
  const html = entries.map(entryName => {
      return new HtmlWebPackPlugin({
        template: `./src/index.twig`,
        filename: `index.html`
      })
  });
  const css = entries.map(entryName => {
      return new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
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
          use:['html-loader','twig-html-loader']
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
                    environment === 'production' ? [autoprefixer, cssnano] : [autoprefixer]
                    return [autoprefixer, cssnano]
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
    stats: 'errors-only',
    plugins: [...html, ...css]
  }
};