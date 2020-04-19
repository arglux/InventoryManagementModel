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
}

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

    // Create a HTML Table element.
    var table = document.createElement("table");

    //table header
    var thead=document.createElement("thead");
    table.appendChild(thead);
    // // Add the header row.
    // var row = table.insertRow(-1);

    // Add the header cells.
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "X (Day)";
    thead.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Y (Demand)";
    thead.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Q (Raw Order Qty)";
    thead.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "I (Raw Inventory Qty)";
    thead.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "B (Raw Backorder Qty)";
    thead.appendChild(headerCell);

    let tbody =document.createElement("tbody");
    table.appendChild(tbody);

    // Add the data rows from Excel file.
    console.log(excelRows.length);
    for (let i = 0; i < excelRows.length; i++) {
        // Add the data row.
        let row = tbody.insertRow(-1);

        // Add the data cells.
        let cell = row.insertCell(-1);
        cell.innerText = excelRows[i].x;
        X.push(excelRows[i].x);

        cell = row.insertCell(-1);
        cell.innerText = excelRows[i].y;
        Y.push(excelRows[i].y);

        cell = row.insertCell(-1);
        cell.innerText = excelRows[i].Q;
        Q.push(excelRows[i].Q);

        cell = row.insertCell(-1);
        cell.innerText = excelRows[i].I;
        I.push(excelRows[i].I);

        cell = row.insertCell(-1);
        cell.innerText = excelRows[i].B;
        B.push(excelRows[i].B);
    }

    let chart2 = document.getElementById("chart2");
    table.className="table table-hover table-sm";
    chart2.innerHTML = "";
    chart2.appendChild(table);
    drawChart();
}

let X = [];
let Y = [];

let Q = [];
let I = [];
let B = [];
let Q_optimized;
let I_optimized;
let B_optimized;

let Qc;
let Ic;
let Bc;
let Tc;
let cum_Tc;
let Qc_optimized;
let Ic_optimized;
let Bc_optimized;
let Tc_optimized;
let cum_Tc_optimized;

let counter = 0;
let result;

function report(result) {
    // append variable report
    counter += 1;
    console.log(result);

    let header = document.createElement("li");
    header.innerHTML = `Results ${counter}:`;
    header.style.fontWeight="bold";
    header.className="list-group-item";

    let mu = document.createElement("li");
    mu.innerHTML = `Daily Demand Mean (μ): ${result.mu}\n`;
    mu.className="list-group-item";

    let std = document.createElement("li");
    std.innerHTML = `Daily Demand Standard Dev (σ): ${result.std}\n`;
    std.className="list-group-item";

    let kyu = document.createElement("li");
    kyu.innerHTML = `Optimal Order Qty (Q): ${result.kyu}\n`;
    kyu.className="list-group-item";

    let r = document.createElement("li");
    r.innerHTML = `Optimal Reorder Point (r): ${result.r}\n`;
    r.className="list-group-item";

    let c = document.createElement("li");
    c.innerHTML = `Optimal Total Cost (c): ${result.c}\n`;
    c.className="list-group-item";

    let f = document.createElement("p");
    f.innerHTML = `Optimal Fill Rate (f): ${result.f}%\n`;
    f.className="list-group-item";

    let wrapper=document.createElement("ul");
    wrapper.className="list-group pt-3 pb-3";
    wrapper.style.backgroundColor="transparent";

    let resultReport = document.getElementById("resultReport");
    wrapper.appendChild(header);
    wrapper.appendChild(mu);
    wrapper.appendChild(std);
    wrapper.appendChild(kyu);
    wrapper.appendChild(r);
    wrapper.appendChild(c);
    wrapper.appendChild(f);
    resultReport.appendChild(wrapper);

    //////////////////////////////////////////////

    // calculate cumulative
    cum_Tc = getCumulative(result.Tc);
    cum_Tc_optimized = getCumulative(result.Tc_optimized);

    //////////////////////////////////////////////

    // append cost data (column) report
    console.log(`Qc (Order Cost) Result ${counter}`, result.Qc);
    console.log(`Ic (Inventory Cost) Result ${counter}`, result.Ic);
    console.log(`Bc (Backorder Cost) Result ${counter}`, result.Bc);
    console.log(`Tc (Total Cost) Result ${counter}`, result.Tc);
    console.log(`Cumulative Total Cost Result ${counter}`, cum_Tc);

    Qc = result.Qc;
    Ic = result.Ic;
    Bc = result.Bc;
    Tc = result.Tc;

    // append optimized data (column) report
    console.log(`Q* (Opt Order Qty) Result ${counter}`, result.Q_optimized);
    console.log(`I* (Opt Inventory Qty) Result ${counter}`, result.I_optimized);
    console.log(`B* (Opt Backorder Qty) Result ${counter}`, result.B_optimized);

    Q_optimized = result.Q_optimized;
    I_optimized = result.I_optimized;
    B_optimized = result.B_optimized;

    console.log(`Qc* (Opt Order Cost) Result ${counter}`, result.Qc_optimized);
    console.log(`Ic* (Opt Inventory Cost) Result ${counter}`, result.Ic_optimized);
    console.log(`Bc* (Opt Backorder Cost) Result ${counter}`, result.Bc_optimized);
    console.log(`Tc* (Opt Total Cost) Result ${counter}`, result.Tc_optimized);
    console.log(`Cumulative Opt Total Cost Result ${counter}`, cum_Tc_optimized);

    Qc_optimized = result.Qc_optimized;
    Ic_optimized = result.Ic_optimized;
    Bc_optimized = result.Bc_optimized;
    Tc_optimized = result.Tc_optimized;
}

// function console.log(header, result) {
//     // Add the header row.
//     let table = document.getElementById("table");
//     var row = table.rows[0];
//
//     // Add the header cells.
//     var headerCell = document.createElement("TH");
//     headerCell.innerHTML = header;
//     row.appendChild(headerCell);
//
//     // Add the data rows from Excel file.
//     for (var i = 0; i < result.length; i++) {
//         // Add the data row.
//         var row = table.rows[i+1];
//
//         // Add the data cells.
//         var cell = row.insertCell(-1);
//         cell.innerHTML = result[i];
//     }
// }




function getCumulative(cost_list) {
    cumulative_cost = [];
    for (var i = 0; i < cost_list.length; i++) {
        if (i == 0) cumulative_cost.push(parseFloat(cost_list[i]));
        else cumulative_cost.push(parseFloat(cumulative_cost[i-1]) + parseFloat(cost_list[i]));
    }
    return cumulative_cost
}

const parameters=document.getElementById("parameters");
parameters.onsubmit = async(e) => {
    e.preventDefault();
    if (X.length === 0 || Y.length === 0) {
        alert("Excel file must be submitted AND extracted!");
        return
    }

    let loading=document.getElementById("loading");
    let loadingText=document.getElementById("loadingText");
    loading.style.display="flex";
    loadingText.innerText="Processing...";

    let body = new FormData(parameters);
    body.append("X", X);
    body.append("Y", Y);
    body.append("Q", Q);
    body.append("I", I);
    body.append("B", B);

    try {
        let response = await fetch('/calculate', {
            method: 'POST',
            body: body
        });
        let result= await response.json();
        report(result);

        //graphs
        drawChart2();

    } catch (e) {
        console.log(e.message);
        alert("Something went wrong")
    }
    finally {
        loading.style.display="none";
        loadingText.innerText="Process with Parameters";
    }
};

