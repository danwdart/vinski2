module.exports = {
   context: __dirname+'/js',
   entry: './src/index.js',
   output: {
       path: __dirname+'/js',
       publicPath: '/js/',
       filename: "index.js"
   },
   module: {
       loaders: [
           { test: /\.bin/, loader: "file-loader" },
           { test: /\.css$/, loader: "style-loader!css-loader" },
           { test: /\.eot/, loader: "file-loader" },
           { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
           { test: /\.jpg/, loader: "file-loader" },
           { test: /\.glsl/, loader: "webpack-glsl-loader" },
           { test: /\.mp3/, loader: "file-loader" },
           { test: /\.png/, loader: "file-loader" },
           { test: /\.svg/, loader: "file-loader" },
           { test: /\.ttf/, loader: "file-loader" },
           { test: /\.woff2?/, loader: "url-loader?limit=10000&mimetype=application/font-woff" }
       ]
   }
};
