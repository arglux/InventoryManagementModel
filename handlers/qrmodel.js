let PyShell = require("./pyshell");
let formidable = require('formidable');
let Queue = require('bull');

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL);
// let pyshell = new PyShell.PyShell();
let {PythonShell} = require('python-shell');

let job_result = {};
async function calculate(req, res) {
	let form = formidable({ multiples: true });
	let script = "main.py";

	form.parse(req, async (err, fields) => {
    if (err) return;
    // console.log(fields)
    let data = {
    	id: fields.id,
			A: fields.fixedCost,
			h: fields.holdingCost,
			b: fields.backorderCost,
			P: fields.orderingCost,
			i0: fields.startingInventory,
			L: fields.leadTime,
			X: fields.X.split(","),
			Y: fields.Y.split(","),
			Q: fields.Q.split(","),
			I: fields.I.split(","),
			B: fields.B.split(","),
		};
		console.log("Data received. Processing now...")
		console.log(data);

		let jobId = workQueue.add(data);
		// console.log(workQueue);

		// let result = await pyshell.run(script, data);
		// console.log(JSON.parse(result));

		res.send(jobId);
		// res.send(JSON.parse(result));
  });
}

// define workQueue process as running pyshell
workQueue.process(function(job, done) {
	console.log("job started.");
	console.log(job.data);

	let result;
  let script = "main.py";
  let pyshell = new PythonShell(path.join(__dirname, script), this.options);

  pyshell.send(JSON.stringify(job.data));

  pyshell.on('message', function (message) {
  	console.log(message);
  	result = message;
  });

  pyshell.on('stderr', function (stderr) {
  	console.log(stderr);
  });

  pyshell.end(function (err, code, signal) {
    if (err) {
      console.log('Failure on pyshell.end()!');
      job_result[job.id] = null
      done(new Error('Failure on pyshell.end()!'));
    } else {
      console.log(`${script} finished`);
      // console.log(result);
      // resolve(result);
      job_result[job.id] = result
      done();
    }
});

async function result(req, res) {
	let id = req.body.id
	if (job_result[id] == undefined) res.send(null);
	else res.send(JSON.parse(job_result[id]));
}

exports.calculate = calculate;
exports.result = result;
