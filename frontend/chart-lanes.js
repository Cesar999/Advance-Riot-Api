function createChartLanes(top,mid,bottom,jungle,support){
    const obj = [
      {data: top, color1: '#c72e23', label: 'Top', 'color2':'#e71809'},
      {data: mid, color1: '#3e95cd', label: 'Mid', 'color2':'#1b9ae9'},
      {data: bottom, color1: '#9845be', label: 'Bottom', 'color2':'#aa17ee'},
      {data: jungle, color1: '#1f9e34', label: 'Jungle', 'color2':'#08bd26'},
      {data: support, color1: '#f3bbfa', label: 'Support', 'color2':'#ff7ae2'},
    ]

    const datas = [];
    const colors = [];
    const labels = [];
    const hover = [];

    for(let o of obj){
      if(o.data>0){
        datas.push(o.data);
        colors.push(o.color1);
        labels.push(o.label);
        hover.push(o.color2);
      }
    }

    if(chart_lanes!=null){
      chart_lanes.destroy();
    }

    let ctx = document.getElementById("lanes").getContext('2d');
    chart_lanes = new Chart(document.getElementById("lanes"), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Lanes",
          data: datas,
          backgroundColor: colors,
          hoverBackgroundColor: hover
        }
      ]
    },
    options: {
      title: {
        display: true,
        responsive: true,
        maintainAspectRatio: false,
        text: 'Lanes Victories on last 15 Games'
      },
      elements: {
        arc: {
            borderWidth: 0
        }
      },
      cutoutPercentage: 50,
      tooltips: {
        enabled: true
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
