module.exports = {
  entry: __dirname + "/app/js/entry.react.js",
  output: {
    path: __dirname + "/build",
    filename: "juggletutor.js"
  },
  module: {
    loaders: [
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.react.js$/, loader: "jsx-loader" },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
