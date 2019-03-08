function createChartSoloWinRate(wins,losses){
  if(chart_solo!=null){
    chart_solo.destroy();
  }

  let datas = [wins,losses];
    // Chart.defaults.global.defaultFontSize = 16;
  Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
      font: {
        size: 12,
        weight: 300
      },
    });

    let ctx = document.getElementById("win-rate-solo").getContext('2d');
    chart_solo = new Chart(document.getElementById("win-rate-solo"), {
    type: 'doughnut',
    data: {
      labels: ["Win", "Lost"],
      datasets: [
        {
          label: "Win/Lost",
          backgroundColor: ["#4e7bdd","#dd3d3d"],
          data: datas
        }
      ]
    },
    options: {
      title: {
        display: true,
        responsive: true,
        maintainAspectRatio: false,
        text: 'Win Rate Solo Ranked'
      },
      elements: {
        arc: {
            borderWidth: 0
        }
      },
      plugins: {
        datalabels: {
          fontSize: 40,
            formatter: (value, ctx) => {
                let sum = 0;
                datas.map(data => {
                    sum += data;
                });
                let percentage = Math.round(value*100 / sum)+"%";
                return percentage;
            },
            color: '#fff',
        }
    }
    }
    });
}
