# FED Project

This Progressive Web App (PWA) project was created using the [`progressive-web-app`](https://github.com/vercel/next.js/tree/master/examples/progressive-web-app) example/template, as shown below.

    npx create-next-app fed-project -e https://github.com/vercel/next.js/tree/master/examples/progressive-web-app

It makes use of the [`next-pwa`](https://github.com/shadowwalker/next-pwa) module and Googles' [Workbox](https://developers.google.com/web/tools/workbox/) toolkit for generating service worker integrations

## How to use

Start by cloning the project locally:
```bash
git clone fed-project https://github.com/sbryan/fed-project.git
cd fed-project
yarn install
```
### Run the dev server locally

```bash
yarn run
```
### Build and run the static site

```bash
yarn build
yarn start
```