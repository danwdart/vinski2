module.exports = {
    context: __dirname+'/js',
    entry: './src/index.js',
    output: {
        path: __dirname+'/js',
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
    }
};
