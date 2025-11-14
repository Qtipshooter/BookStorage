import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: {
    /** auth_level/filename: ./src/page/file/location */
    "public/home": "./src/pages/home.jsx",
    "public/about": "./src/pages/about.jsx",
    "public/books": "./src/pages/books.jsx",
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
