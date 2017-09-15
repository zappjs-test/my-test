const CopyWebpackPlugin = require('copy-webpack-plugin');
const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = {
  development: {
    app: [
      `webpack-dev-server/client?http://${host}:${port}`,
      './App.jsx'
    ],
    outputPath: 'tmp'
  },
  production: {
    app: [
      './App.jsx'
    ],
    outputPath: 'build'
  }
};
const { app, baseHref, outputPath } = config[env];

const plugins = [
  new webpack.DefinePlugin({
    CONFIG: JSON.stringify({
      baseHref
    })
  }),
  //new CopyWebpackPlugin([
    //{ from: 'images', to: 'images' }
  //]),
  new HandlebarsWebpackPlugin({
    entry: path.join(process.cwd(), 'src', '*.hbs'),
    output: path.join(process.cwd(), outputPath, '[name].html'),
    data: {
      baseHref
    }
  })
];
if (env === 'production') {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app
  },
  devServer: {
    host,
    port,
    contentBase: `./${outputPath}`,
    disableHostCheck: true,
    publicPath: '/',
    hot: true,
    historyApiFallback: {
      index: 'index.html'
    },
    stats: {
      colors: true
    }
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.(js|jsx|es6)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'react',
            'stage-0'
          ]
        }
      },
      {
        test: /\.sass$/,
        loader: 'style-loader'
      },
      {
        test: /\.sass$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          url: false
        }
      },
      {
        test: /\.sass$/,
        loader: 'sass-loader'
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, outputPath)
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  }
};
