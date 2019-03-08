function createChartWinRate(wins,matches){
  if(chart_winrate!=null){
    chart_winrate.destroy();
  }

  let datas = [wins,matches-wins];
  
    let ctx = document.getElementById("win-rate").getContext('2d'); 
    chart_winrate = new Chart(document.getElementById("win-rate"), {
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
        text: 'Win Rate on Last 15 Games'
      },
      elements: {
        arc: {
            borderWidth: 0
        }
      },
      plugins: {
        datalabels: {
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
