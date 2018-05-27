
const webpack = require("webpack");
require("dotenv").config();

module.exports = () => {
  return {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/index.tsx",
    output: {
      filename: "bundle.js",
      path: __dirname + "/public/dist"
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
      new webpack.DefinePlugin({
        MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN)
      })
    ],
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    }
  };
};
