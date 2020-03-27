let {PythonShell} = require('python-shell');
let path = require("path");
let config = require("../config");

function calculate(req, res) {
  return new Promise((resolve, reject) => {
    let script = "qrmodel.py";
    let pyshell = new PythonShell(path.join(__dirname, script), config.options);

    let agentIds = Object.keys(this.agentTable);
    let agentPriority;

    let data = {
      "agent_ids" : agentIds,
      "tags" : [1, 1, 1]          // input tags here
    };

    pyshell.send(JSON.stringify(data));

    pyshell.on('message', function (message) {
      let agentScores = JSON.parse(message);
      agentPriority = agentScores.prioritySort(agentIds);
      console.log(agentPriority);
    });

    pyshell.on('stderr', function (stderr) {
      console.log(stderr);
    });

    pyshell.end(function (err, code, signal) {
      if (err) {
        let message = `Failure! A match cannot be found, returning null.`;
        console.log(message);
        reject(err)
      };
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log(`${script} finished`);
      message = `Success! Matches has been generated for User: ${userId}.`;
      console.log(message);
      resolve(agentPriority);
    });
  });
};

// exports
exports.calculate = calculate;
