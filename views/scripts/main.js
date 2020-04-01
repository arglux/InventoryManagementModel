function extract() {
  //Reference the data element.
  var data = document.getElementById("data");

  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(data.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function (e) {
          parse(e.target.result);
        };
        reader.readAsBinaryString(data.files[0]);
      } else {
          //For IE Browser.
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
  //Read the Excel File data.
  var workbook = XLSX.read(data, {
    type: 'binary'
  });

  //Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.border = "1";

  //Add the header row.
  var row = table.insertRow(-1);

  //Add the header cells.
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "x";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "y";
  row.appendChild(headerCell);

  //Add the data rows from Excel file.
  for (var i = 0; i < excelRows.length; i++) {
    //Add the data row.
    var row = table.insertRow(-1);

    //Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].x;

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].y;
  }

  var dataTable = document.getElementById("dataTable");
  dataTable.innerHTML = "";
  dataTable.appendChild(table);
};
