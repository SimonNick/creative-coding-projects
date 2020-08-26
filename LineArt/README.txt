npm init -y
npm i webpack webpack-cli html-webpack-plugin webpack-dev-server react-dev-utils minify-html-webpack-plugin --save-dev
npm i p5

add the following to package.json:

  "scripts": {
    "dev": "webpack-dev-server --mode development --hot --inline --open",
    "build": "webpack --mode production"
  },

Start dev server by running 'npm run dev'