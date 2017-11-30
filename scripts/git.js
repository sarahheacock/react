const { exec } = require('child_process');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



exec('git add --all', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);

  rl.question('commit note:\n ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Commiting changes: ${answer}`);
    rl.close();

    exec(`git commit -m "${answer}" && git push heroku master`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });
  });
});

console.log("done");
