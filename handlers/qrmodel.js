let PyShell = require("./pyshell");
let formidable = require('formidable');
let Queue = require('bull');

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL);
let pyshell = new PyShell.PyShell();

let result = {};
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

		workQueue.add(data);
		// console.log(workQueue);

		// let result = await pyshell.run(script, data);
		// console.log(JSON.parse(result));

		res.sendStatus(200);
		// res.send(JSON.parse(result));
  });
}

// define workQueue process as running pyshell
workQueue.process(async function(job) {
	result[job.data.id] = await pyshell.run(script, job.data);
	throw new Error('pyshell error!')
});

async function calculate(req, res) {
	let id = req.body.id
	res.send(JSON.parse(result[id]))
}

exports.calculate = calculate;
