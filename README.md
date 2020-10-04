# Local Favorites

Local Favorites is a Vue.js web app to save and review your favorite local places, powered by Google Maps Javascript API. Bootstrapped with [Vue CLI tool](https://github.com/vuejs/vue-cli).

<p align="center"><a href="https://joshrosenhanst.com/local-favorites/"><img src="https://joshrosenhanst.com/assets/img/local-favorites/local-favorites-main.png" alt="Local Favorites Preview"></a></p>

## Local Development

1. `npm install`
2. Get a Google Maps API key that is enabled for both `Maps Javascript API` and `Places API for Web`
3. Create a `.env.local` file in the root directory and add the following line: `VUE_APP_MAP_API=<your Maps API key>`
4. `npm run serve`

## Webpack / Babel settings

The app uses the Vue CLI settings to compile Vue, Sass, and JS code. To support IE 10/11 the app uses the `useBuiltIns: entry` option in `babel.config.js` and `import @babel/polyfill` in main.js.

Sass variables, located in `scss/_variables.scss` are available to all Vue component files using the `css` options in `vue.config.js`.

## Available Scripts

Compiles and hot-reloads for development
```
npm run serve
```

Compiles and minifies for production
```
npm run build
```

Lints and fixes files
```
npm run lint
```
