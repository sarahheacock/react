import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import fs from 'fs'

// import renderFullPage from './renderFullPage';
import App from '../../components/App';

import express from 'express';
// const path = require('path');
const router = express.Router();

//=============MIDDLEWARE==============================
// const jsFiles = fs.readdirSync('./build/static/js');

const display = (req, res, next) => {
  // let css = new Set()
  //
  // const context = {
  //   insertCss: (...styles) => {
  //     styles.forEach(style => css.add(style._getCss()))
  //   },
  // }
  // var appDirectory = fs.realpathSync(process.cwd());
  // function resolveApp(relativePath) {
  //   return relativePath;
  //   //return path.resolve(appDirectory, relativePath);
  // }

  // fs.readFile("build/asset-manifest.json", (err, d) => {
  //   let data = JSON.parse(d);
  //   console.log(data)
  //
  //   const html = renderToString(
  //     <StaticRouter context={{}} location={req.url}>
  //       <App data={req.data} />
  //     </StaticRouter>
  //   )
  //   const root = `<div id="root">${html}</div><script>window.__PRELOADED_STATE__ = ${JSON.stringify(req.data).replace(/</g, '||u003c')}</script>`;
  //   const css = `<link href="${resolveApp("build/" + data['main.css'])}" rel="stylesheet">`;
  //   const script = `<script src="${resolveApp("build/" + data['main.js'])}"></script>`
  //   const result = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"><meta name="theme-color" content="#000000"><title>React App</title></head><body><noscript>You need to enable JavaScript to run this app.</noscript>${root}${css}${script}</body></html>`;
  //
  //   console.log("RESULT", result);
  //   res.status(200).send(result);
  // });

}

//===========ROUTES===================================
router.get("/", (req, res, next) => {
  req.data = {
    "name": "Home"
  }
  next();
}, display);

router.get("/about", (req, res, next) => {
  req.data = {
    "name": "About"
  }
  next();
}, display);


export default router;
