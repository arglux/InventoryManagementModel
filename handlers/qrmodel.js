let PyShell = require("./pyshell");
let formidable = require('formidable');

let pyshell = new PyShell.PyShell();

async function calculate(req, res) {
	let form = formidable({ multiples: true });
	let script = "main.py";

	form.parse(req, async (err, fields) => {
    if (err) return;
    console.log(fields)
    let data = {
			A: fields.fixedCost,
			h: fields.holdingCost,
			b: fields.backorderCost,
			i0: fields.startingInventory,
			X: fields.X.split(","),
			Y: fields.Y.split(","),
		};
		console.log(data);

		let result = await pyshell.run(script, data);
		console.log(JSON.parse(result));

		res.send(JSON.parse(result));
  });
}

exports.calculate = calculate;
