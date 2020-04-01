let PyShell = require("./pyshell");

let pyshell = new PyShell.PyShell();

async function calculate(req, res) {
	let script = "main.py"
	let data = {
		"hello": "world"
	}

	let result = pyshell.run(script, data)
	console.log(result)

	res.send({
		"result": result
	})
}

exports.calculate = calculate;
