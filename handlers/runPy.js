let {PythonShell} = require('python-shell');
let path = require("path");
let config = require("../config");

async function calculate(req, res) {
  let data = req.body;
  let result = await qrmodel(data);

  res.send({
    "result": result
  });
};

function qrmodel(data) {
  return new Promise((resolve, reject) => {
    let script = "qrmodel.py";
    let pyshell = new PythonShell(path.join(__dirname, script), config.options);

    let result;
    let data = { // data here
      "data" : data,
      "dummy" : [1, 1, 1]
    };

    pyshell.send(JSON.stringify(data));

    pyshell.on('message', function (result) {
      result = JSON.parse(result);
      console.log(result);
    });

    pyshell.on('stderr', function (stderr) {
      console.log(stderr);
    });

    pyshell.end(function (err, code, signal) {
      if (err) {
        let message = `Failure! Pyshell terminating!`;
        console.log(message);
        reject(err);
      };
      console.log(`${script} finished`);
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);

      message = `Success! Result: ${result}.`;
      console.log(message);
      resolve(result);
    });
  });
};

// exports
exports.calculate = calculate;