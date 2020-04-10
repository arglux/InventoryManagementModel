window.onload = function () {
    const input = document.getElementById( 'data' );
    const infoArea = document.getElementById( 'file-name' );
    input.addEventListener( 'change', function showFileName( event ) {
        let fileName = event.srcElement.files[0].name;
        infoArea.innerText = ''+ fileName;
    })
};

/*************Chart Functions*************/

const chart1 = document.getElementById("chart1");
const chartc = document.getElementById("chart-container");
let tog=true;
let graph=false;
let barChart = new Chart(chart1, {});
barChart.destroy();

function drawChart() {
    graph=true;
    chart1.style.visibility="visible";
    chartc.style.maxHeight="1000px";
    barChart.destroy();
    barChart = new Chart(chart1, {
        type: 'bar',
        data: {
            labels: X,
            datasets: [
                {
                    data: Y,
                    label: "Demand",
                    backgroundColor: "#007bff",
                    fill: false
                },
            ]
        }
    });
}



function hideChart() {
    if (graph) {
        tog=!tog;
        if (!tog) {
            chartc.style.maxHeight="0"
        } else {
            chartc.style.maxHeight="1000px"
        }
    }
}


