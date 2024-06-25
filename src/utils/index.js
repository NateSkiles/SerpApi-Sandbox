import readline from "readline";

const getInput = (question, cb) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(question, (answer) => {
    cb(answer).then(() => rl.close());
  });
};

export { getInput };
