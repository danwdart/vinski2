module.exports = {
   entry: __dirname+"/js/src/index.js",
   output: {
       path: __dirname+'/js',
       filename: "index.js"
   },
   module: {
       loaders: [
           { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
           { test: /\.css$/, loader: "style-loader!css-loader" }
       ]
   }
};
