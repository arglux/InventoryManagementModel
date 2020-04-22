let {PythonShell} = require('python-shell');
let path = require("path");

function PyShell() {
	this.options = {
		pythonPath: process.env.PYTHON_PATH, // leave it blank for heroku
        // pythonPath: "C:\\Users\\aaron\\AppData\\Local\\Programs\\Python\\Python36\\python.exe"
	};
	console.log(this.options);

	this.test = function() {
		console.log("PyShell instantiated.");
	};

  this.run = function(file, args) {
    return new Promise((resolve, reject) => {
    	let result;
      let script = file;
      let pyshell = new PythonShell(path.join(__dirname, script), this.options);

      pyshell.send(JSON.stringify(args));

      pyshell.on('message', function (message) {
      	// console.log(message);
      	result = message;
      });

      pyshell.on('stderr', function (stderr) {
      	console.log(stderr);
      });

      pyshell.end(function (err, code, signal) {
        if (err) {
          console.log('Failure on pyshell.end()!');
          reject(err)
        } else {
	        console.log(`${script} finished`);
	        // console.log(result);
	        resolve(result);
        }
      });
    });
  }
}

// exports
exports.PyShell = PyShell;
