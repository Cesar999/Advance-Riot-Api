let chart_winrate = null;
let chart_solo = null;
let chart_lanes = null;

let name = document.getElementById("search-name");
let test = document.querySelector("#test");
test.addEventListener('click',fetchData);

name.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      test.click();
    }
});

function fetchData(){
    const base_url = 'https://secret-springs-92887.herokuapp.com';
    //const base_url = 'http://localhost:3000';
        fetch(base_url+'/getData',{ 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name: name.value})
        })
        .then(res =>{
            return res.json();
        })
        .then(json => {
            console.log(json);
            const u = json.user;
            createChartWinRate(u.wins,u.matches);
            const prop ='wins';
            createChartLanes(u.TOP[prop], u.MID[prop], u.BOTTOM[prop], u.JUNGLE[prop], u.SUPPORT[prop]);
            createChartSoloWinRate(u.ranked_wins,u.ranked_losses);
            createImages(u.champ_frec);
            populateText(u.tier, u.rank, u.kda, u.first_blood, u.name);
        })
        .catch((e)=>console.log(e))
}

let text = Array.from(document.querySelectorAll('.text'));
let text_h = Array.from(document.querySelectorAll('.text-h'));

function populateText(tier, rank, kda, first_blood, name){
    span_tier = document.querySelector(".tier .text");
    span_rank = document.querySelector(".rank .text");
    span_kda = document.querySelector(".kda .text");
    span_first_blood = document.querySelector(".first-blood .text");
    span_name = document.querySelector(".name .text");

    span_tier.innerHTML = `${tier}`;
    span_rank.innerHTML = `${rank}`;
    span_kda.innerHTML = `${kda}`;
    span_first_blood.innerHTML = `${first_blood}`;
    span_name.innerHTML = `${name}`;

    document.querySelector(".tier .text-h").innerHTML = `Tier:`;
    document.querySelector(".rank .text-h").innerHTML = `Rank:`;
    document.querySelector(".kda .text-h").innerHTML = `KDA:`;
    document.querySelector(".first-blood .text-h").innerHTML = `First Blood:`;

    //console.log(text);

    for(let e of text){
        if(tier === 'GOLD'){
            e.className = 'text gold';
        } else if(tier === 'SILVER'){
            e.className = 'text silver';
        }
    }

    for(let e of text_h){
        if(tier === 'GOLD'){
            e.className = 'text-h gold';
        } else if(tier === 'SILVER'){
            e.className = 'text-h silver';
        }
    }
}   


