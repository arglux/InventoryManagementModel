let PyShell = require("./pyshell");
let formidable = require('formidable');

let pyshell = new PyShell.PyShell();

async function calculate(req, res) {
	let form = formidable({ multiples: true });
	let script = "main.py";

	form.parse(req, async (err, fields) => {
    if (err) return;
    // console.log(fields)
    let data = {
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
		// console.log(data);

		let result = await pyshell.run(script, data);
		// console.log(JSON.parse(result));

		res.send(JSON.parse(result));
  });
}

exports.calculate = calculate;
