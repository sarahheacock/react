const renderFullPage = (html, preloadedState) => {
  //get rid of script tags .replace(/</g, '||u003c') to prevent dangerous injection
  //bundle.js sits in the build folder
  return `
    <!doctype html>
    <html>
      <head>
        <title>Your SSR React Router Node app initialized with data!</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '||u003c')}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `
}

export default renderFullPage;
