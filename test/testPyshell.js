let PyShell = require("../handlers/pyshell");

let pyshell = new PyShell.PyShell();

data = {
	"hello": "world",
}

pyshell.test();
pyshell.run("main.py", data);
