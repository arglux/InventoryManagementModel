let {PythonShell} = require('python-shell');
let path = require("path");

async function calculate(req, res) {
  let args = req.body;
  console.log("args:", args);

  let result = await qrmodel(args.A) || null;

  console.log(result);
  res.send({
    "result": result
  })
};

function qrmodel(args) {
  return new Promise((resolve, reject) => {
    let script = "qrmodel.py";
    let options = {
      mode: 'text',
      args: ['my First Argument', 'My Second Argument', '--option=123']
    }

    PythonShell.run(script, options, function (err, results) {
    if (err) throw reject(err);
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
    resolve(results)
    });
  });
};

// exports
exports.calculate = calculate;
exports.qrmodel = qrmodel;
