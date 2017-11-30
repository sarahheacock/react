const { exec } = require('child_process');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let response = '';

function commit(deploy, callback){
  exec(deploy, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    callback();
  });
}


function add(deploy){
  // exec('git add --all', (err, stdout, stderr) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(stdout);
  //   console.log("add", deploy);

    if(response){
      commit(`git push ${deploy} master`, function(){
        console.log("DONE")
      });
    }
    else {
      rl.question('commit note:\n ', (answer) => {
        response = answer;
        console.log(`\n\nCommiting changes: ${response}`);
        rl.close();

        commit(`git add --all && git commit -m "${response}" && git push ${deploy} master`, function(){
          add("heroku");
        });
      });
    }
  // });
}

add("origin");
