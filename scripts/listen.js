const chokidar = require('chokidar');

let obj = {
  event: [],
  path: []
};

function send(e){
  setTimeout(() => {
    if(e > 0 && e === obj.event.length){
      process.send(obj);
      obj = {
        event: [],
        path: []
      };
      return send(0);
    }
    return send(obj.event.length);
  }, 500);
}
send(0);

const client = chokidar.watch('build', {
  persistent: true
});

client.on('all', function(event, path){
  obj.event.push(event);
  obj.path.push(path);
});

process.on('message', (m) => {
  console.log(process.pid + ': LISTEN CHILD got message:' + m);
  console.log('');
});


process.once('SIGINT', function() {  // ctrl C
  console.log("SIGINT");
  client.close();
  process.exit(0);
});
