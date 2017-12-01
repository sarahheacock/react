const { exec } = require('child_process');
// if git or npm is not init call init.js


const readline = require('readline');
// const fs = require('fs-extra');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let response = '';

function commit(deploy, callback){
  console.log("\n\n", deploy);
  exec(deploy, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
    callback();
  });
}


function add(deploy){
  if(deploy === "origin"){
    // ignore(deploy);
    commit(`git push ${deploy} master`, function(){
      console.log("DONE")
    });
  }
  else {
    // ignore(deploy);
    rl.question('commit note:\n ', (answer) => {
      response = answer;
      console.log(`\n\nCommiting changes: ${response}`);
      rl.close();

      commit(`git add --all && git commit -m "${response}" && git push ${deploy} master`, function(){
        add("origin");
      });
    });
  }
}

add("heroku");
