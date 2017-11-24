const renderFullPage = (html, preloadedState) => {
  const DEV = process.env.NODE_ENV === 'development';
  const src = "/static/js/client.js";
  const href = "/static/css/client.css";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your SSR React Router Node app initialized with data!</title>
        <link href=${href} rel="stylesheet">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '||u003c')}
        </script>
        <script type="text/javascript" src=${src}></script>
      </body>
    </html>
  `
}

export default renderFullPage;
