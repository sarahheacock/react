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
  const same = `
  # See https://help.github.com/ignore-files/ for more about ignoring files.

  # dependencies
  /node_modules

  # testing
  /coverage

  # misc
  .DS_Store
  .env.local
  .env.development.local
  .env.test.local
  .env.production.local

  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  `;

  const output = (deploy === "origin") ?
  `
  ${same}
  /build
  `:
  `
  ${same}
  /src
  /config
  /scripts
  /test
  `;

  fs.outputFileSync(file, output);
}

function add(deploy){
  if(deploy === "heroku"){
    // ignore(deploy);
    commit("git push heroku `git subtree split --prefix build master`:master --force", function(){
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
        add("heroku");
      });
    });
  }
}

add("origin");
