let PyShell = require("./pyshell");

let pyshell = new PyShell.PyShell();

async function calculate(req, res) {
	let script = "main.py"
	let data = {
		"hello": "world"
	}

	let result = await pyshell.run(script, data)
	console.log(JSON.parse(result))

	res.send(JSON.parse(result))
}

exports.calculate = calculate;
