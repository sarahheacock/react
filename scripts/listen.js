const chokidar = require('chokidar');

let obj = {
  event: [],
  path: []
};

const readline = require('readline');
// const fs = require('fs-extra');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function send(e){
  setTimeout(() => {
    if(e > 0 && e === obj.event.length){
      const str = "Change in files:\n\t" + obj.path.filter(function(path, i){
        return obj.path.indexOf(path) === i;
      }).join("\n\t") + "\npid: " + process.pid;

      rl.question('\nYou are welcome to install npm dependencies while terminal is running.\n\n', (answer) => {
        if(answer.includes("npm") && answer.includes("install")){
          process.send({request: answer});
        }
        else {
          process.send({message: answer});
        }
      });

      process.send({message: str});

      obj = {
        event: [],
        path: []
      };
      return send(0);
    }
    return send(obj.event.length);
  }, 1000);
}
send(0);

const client = chokidar.watch(['build', 'package.json'], {
  persistent: true
});

client.on('all', function(event, path){
  obj.event.push(event);
  obj.path.push(path);
});


process.once('SIGINT', function() {  // ctrl C
  rl.close();
  client.close();
  process.exit(0);
  console.log("SIGINT");
});

process.send({
  message: "Listener process connected...\npid: " + process.pid
})
