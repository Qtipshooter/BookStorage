import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: {
    /** auth_level/filename: ./src/page/file/location */
    "public/home": "./src/pages/Home.jsx",
    "public/about": "./src/pages/About.jsx",
    "public/books": "./src/pages/Books.jsx",
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
