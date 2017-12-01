const { exec } = require('child_process');

const readline = require('readline');
const fs = require('fs-extra');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let response = '';

function commit(deploy, callback){
  console.log("\n\nPushing to:", deploy);
  exec(deploy, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    callback();
  });
}

function ignore(deploy){
  const file = ".gitignore";
  const output = (deploy === "origin") ?
  `
    # dependencies
    /node_modules

    # testing
    /coverage

    /build
  `:
  `
    # dependencies
    /node_modules

    # testing
    /coverage

    /src
    /config
    /test
    /scripts
  `;

  fs.outputFileSync(file, output);
  // .then(() => fs.readFile(file, 'utf8'))
  // .then(data => {
  //   console.log(data) // => hello!
  // })
  // .catch(err => {
  //   console.error(err)
  // });
}

function add(deploy){
  if(response){
    commit(`git add --all && git commit -m "${response}" && git push ${deploy} master`, function(){
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
}

add("origin");
