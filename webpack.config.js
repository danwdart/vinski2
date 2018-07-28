const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    context: __dirname+'/public',
    devServer: {
        contentBase: './.app',
        hot: true
    },
    entry: './js/src/index.js',
    output: {
        path: __dirname+'/.app/js',
        publicPath: '/js/',
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            { test: /\.eot/, use: "file-loader" },
            { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
            { test: /\.jpg/, use: "file-loader" },
            { test: /\.glsl/, use: "webpack-glsl-loader" },
            { test: /\.mp3/, use: "file-loader" },
            { test: /\.svg/, use: "file-loader" },
            { test: /\.ttf/, use: "file-loader" },
            { test: /\.woff2?/, use: "url-loader?limit=10000&mimetype=application/font-woff" }
        ]
    },
    plugins: [
        /*new CleanWebpackPlugin(
            [
                '.app'
            ]
        ),*/
        new CopyWebpackPlugin(
            [
                {
                    from: 'index.html',
                    to: '..'
                },
                {
                    from: 'CNAME',
                    to: '..'
                },
                /*{
                    from: 'public/js',
                    to: '.app/js'
                }*/
            ]
        ),
        new webpack.HotModuleReplacementPlugin()
    ]
};
