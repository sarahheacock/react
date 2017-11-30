const { exec } = require('child_process');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let response = '';

function add(deploy){
  exec('git add --all', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);

    if(response){
      commit(deploy, function(){
        console.log("DONE")
      });
    }
    else {
      rl.question('commit note:\n ', (answer) => {
        response = answer;
        console.log(`\n\nCommiting changes: ${response}`);
        rl.close();

        commit(deploy, add("heroku"))
      });
    }    
  });
}

function commit(deploy, callback){
  exec(`git commit -m "${response}" && git push ${deploy} master`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    callback();
  });
}

add("origin");
