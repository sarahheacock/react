const renderFullPage = (html, preloadedState) => {
  const DEV = process.env.NODE_ENV === 'development';
  const src = "/index.js";
  const href = '<link href="/index.css" rel="stylesheet">';

  //console.log(browser);
  //const load = (reload) ? `<script>window.location.reload(true)</script>` : "";

  //process.env.BROWSER = false;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        ${href}
        <title>Your SSR React Router Node app initialized with data!</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '||u003c')}
        </script>
        <script type="text/javascript" src=${src}></script>
        <script type="text/javascript" src="/socket.js"></script>
      </body>
    </html>
  `
}

export default renderFullPage;
