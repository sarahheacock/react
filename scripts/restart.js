//const reload = require('../src/server/reload.js');

function restart(){
  //reload.toggle(true);

  const fs = require('fs');
  // const { URL } = require('url');
  // const fileUrl = new URL('file:///reload.json');
  fs.writeFile('reload.json', '{"reload": "true"}', (err) => {
    if (err) throw err;
    console.log("restarting...");
  });
  //console.log(fs.readFileSync('reload.json', 'utf8'));
  // require('../src/server/reload.js').toggle(true);
  // console.log("restarting...", require('../src/server/reload.js').reload, require('../src/server/reload.js'));
  //process.env.LOAD = true;

  // var patterns = '*.css *.less *.styl *.scss *.sass *.png *.jpeg *.jpg *.gif *.webp *.svg *.js';
  // const browserRefreshClient = require('browser-refresh-client')
  //   browserRefreshClient.enableSpecialReload(patterns, { autoRefresh: false })
  //   .onFileModified(function(path) {
  //       // Code to handle the file modification goes here.
  //
  //       // Now trigger a refresh when we are ready:
  //       // if (isImage(path)) {
  //       //     browserRefreshClient.refreshImages();
  //       // } else if (isStyle(path)) {
  //       //     browserRefreshClient.refreshStyles();
  //       // } else {
  //           browserRefreshClient.refreshPage();
  //       // }
  //   });
};

restart();
