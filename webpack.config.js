var path = require("path");
var webpack = require("webpack");

// Yoga cannot be minified.

var plugins = [
// 	new webpack.optimize.UglifyJsPlugin({
// 		compress: false,
// 		mangle: false,
// 		beautify: true,
// 		comments: true,
// 		sourceMap: true
// 	})
];
if (process.env.WEBPACK_ENV === "build") {
	plugins = [
// 		new webpack.DefinePlugin({
// 			"process.env": {
// 				NODE_ENV: JSON.stringify("production")
// 			}
// 		}),
// 		new webpack.optimize.UglifyJsPlugin({
// 			compress: true,
// 			mangle: true,
// 			beautify: false,
// 			comments: false,
// 			sourceMap: false
// 		})
	];
}

module.exports = {
	entry: "./source/index.js",
	output: {
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$|\.jsx$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						["es2015", { modules: false }],
						"react"
					]
				}
			},
// 			{// begin bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
// 				test: /\.js$/,
// 				loader: "babel-loader",
// 				include: [
// 					/node_modules\/yoga-layout\/sources\/entry-common/, // Bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
// 					/node_modules\/yoga-layout\/sources\/entry-node/, // Bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
// 					/node_modules\/yoga-layout\/sources\/entry-browser/, // Bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
// 					/node_modules\/yoga-layout\/build\/Release\/nbind/ // Bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
// 				],
// 				options: {
// 					presets: [
// 						"es2015"
// 					]
// 				}
// 			},// end bug fix // ERROR in bundle.js from UglifyJs // Unexpected token: name (original) [./~/yoga-layout/sources/entry-common.js:12,0][bundle.js:45147,8]
			{
				test: /\.css$/,
				loader: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	plugins: plugins,
	node: { // Bug fix // ERROR in ./~/yoga-layout/build/Release/nbind.js // Module not found: Error: Can't resolve 'fs'
		fs: "empty",
// 		module: "empty"
	}
}