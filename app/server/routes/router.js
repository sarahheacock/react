import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import renderFullPage from './renderFullPage';
import App from '../../components/App';

import express from 'express';
const router = express.Router();

//=============MIDDLEWARE==============================
const display = (req, res, next) => {
  const context = {};
  const html = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App data={req.data} />
    </StaticRouter>
  )

  res.status(200).send(renderFullPage(html, req.data));
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
