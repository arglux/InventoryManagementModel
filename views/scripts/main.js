function extract() {
  // Reference the data element.
  var data = document.getElementById("data");

  // Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(data.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();

      // For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function (e) {
          parse(e.target.result);
        };
        reader.readAsBinaryString(data.files[0]);
      } else {
          // For IE Browser.
          reader.onload = function (e) {
            var data = "";
            var bytes = new Uint8Array(e.target.result);
            for (var i = 0; i < bytes.byteLength; i++) {
              data += String.fromCharCode(bytes[i]);
            }
            parse(data);
          };
          reader.readAsArrayBuffer(data.files[0]);
        }
    } else {
    	alert("This browser does not support HTML5.");
    }
  } else {
  	alert("Please upload a valid Excel file.");
  }
};

function parse(data) {
  // Read the Excel File data.
  var workbook = XLSX.read(data, {
    type: 'binary'
  });

  // Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];

  // Read all rows from First Sheet into an JSON array.
  var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

  // reinitialize X and Y
  X = [];
  Y = [];
  var table;

  // Create a HTML Table element.
  table = document.getElementById("table");
  table.border = "1";

  // Add the header row.
  var row = table.insertRow(-1);

  // Add the header cells.
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "X (Dates)";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Y (Demand)";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Q (Raw Order Qty)";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "I (Raw Inventory Qty)";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "B (Raw Backorder Qty)";
  row.appendChild(headerCell);

  // Add the data rows from Excel file.
  for (var i = 0; i < excelRows.length; i++) {
    // Add the data row.
    var row = table.insertRow(-1);

    // Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].x;
    X.push(excelRows[i].x);

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].y;
    Y.push(excelRows[i].y);

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].Q;
    Q.push(excelRows[i].Q);

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].I;
    I.push(excelRows[i].I);

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].B;
    B.push(excelRows[i].B);
  }

  var dataTable = document.getElementById("dataTable");
  dataTable.innerHTML = "";
  dataTable.appendChild(table);
  console.log(X, Y);
  drawChart();
};

let X = [];
let Y = [];
let Q = [];
let I = [];
let B = [];
let Q_optimized;
let I_optimized;
let B_optimized;
let counter = 0;

function report(result) {
	counter += 1;
	let header = document.createElement("h3");
	header.innerHTML = `Results ${counter}:`;

	let mu = document.createElement("p");
	mu.innerHTML = `Mean (μ)	: ${result.mu}\n`;

	let std = document.createElement("p");
	std.innerHTML = `Standard Dev (σ)	: ${result.std}\n`;

	let kyu = document.createElement("p");
	kyu.innerHTML = `Order Qty (Q)	: ${result.kyu}\n`;

	let r = document.createElement("p");
	r.innerHTML = `Reorder Point (r)	: ${result.r}\n`;

	let c = document.createElement("p");
	c.innerHTML = `Total Cost (c)	: ${result.c}\n`;

	let f = document.createElement("p");
	f.innerHTML = `Fill Rate (f)	: ${result.f}%\n`;

	let line = document.createElement("hr");

	let resultReport = document.getElementById("resultReport");
	resultReport.appendChild(header);
	resultReport.appendChild(mu);
	resultReport.appendChild(std);
	resultReport.appendChild(kyu);
	resultReport.appendChild(r);
	resultReport.appendChild(c);
	resultReport.appendChild(f);
	resultReport.appendChild(line);
}

function appendColumn(header, result) {
  // Add the header row.
  let table = document.getElementById("table")
  var row = table.rows[0];

  // Add the header cells.
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = header;
  row.appendChild(headerCell);

  // Add the data rows from Excel file.
  for (var i = 0; i < result.length; i++) {
    // Add the data row.
    var row = table.rows[i+1];

    // Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = result[i];
  }

}

parameters.onsubmit = async(e) => {
	e.preventDefault();

	if (X.length == 0 || Y.length == 0) {
		alert("Excel file must be submitted AND extracted!");
		return
	}

	let body = new FormData(parameters);
	body.append("X", X);
	body.append("Y", Y);

  let response = await fetch('/calculate', {
    method: 'POST',
    body: body
  });

  let result = await response.json();

  report(result);
  appendColumn(`Q* (Optimized Order Qty) - Result ${counter}`, result.Q);
  appendColumn(`I* (Optimized Inventory Qty) - Result ${counter}`, result.I);
  appendColumn(`B* (Optimized Backorder Qty) - Result ${counter}`, result.B);

  I_optimized = result.I;
  B_optimized = result.B;
  Q_optimized = result.Q;

  alert("Successfully Processed!")
  // alert(JSON.stringify(result));
}

