const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT||3000;

const path = require('path');
const publicPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(publicPath));

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.listen(port,()=>{
    console.log(`Riot Service on port ${port}`);
});

const key = `?api_key=RGAPI-8ad54a15-e23c-4398-b455-7b6e5688e952`;
const riot_url = `https://la1.api.riotgames.com`;
const account_url = `/lol/summoner/v4/summoners/by-name/`; 
const ranked_url = `/lol/league/v4/positions/by-summoner/`;
const matches_url = `/lol/match/v4/matches/`;
const matches_list_url = `/lol/match/v4/matchlists/by-account/`;

const mastery_url = `/lol/champion-mastery/v4/champion-masteries/by-summoner/`;
const champions_json = `http://ddragon.leagueoflegends.com/cdn/9.4.1/data/en_US/champion.json`;

const champion_data = function(champ){
    return `http://ddragon.leagueoflegends.com/cdn/9.4.1/data/en_US/champion/${champ}.json`;
}
const square_img = function(champ){
    return `http://ddragon.leagueoflegends.com/cdn/9.4.1/img/champion/${champ}.png`;
}
const loading_img = function(champ){
    return `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_0.jpg`;
}
const big_img = function(){
    return`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`;
}

const versions = `https://ddragon.leagueoflegends.com/api/versions.json`;
const season9 = 1548384351159;
const solo_queue = 420;
const flex_queue = 440;

function getSummonerByName(name){
    return fetch(riot_url+account_url+name+key)
    .then(res => res.json())
    .then((data)=>{
        const summoner = {};
        summoner['id'] = data.id;
        summoner['accountId'] = data.accountId;
        summoner['name'] = data.name;
        return summoner;
    })
    .catch((e)=>console.log(e));
}

function getRankById(id){
    return fetch(riot_url+ranked_url+id+key)
    .then(res => res.json())
    .then((data)=>{
        //console.log(data);
        const rank = {};
        for(let e of data){
            if(e.queueType === 'RANKED_SOLO_5x5'){
                rank['tier'] = e.tier;
                rank['rank'] = e.rank;
                rank['wins'] = e.wins;
                rank['losses'] = e.losses;
                rank['queueType'] = e.queueType;
                rank['summonerName'] = e.summonerName;
            }
        }
        return rank;
    })
    .catch((e)=>console.log(e));
}

async function getMatchListByAccountId(accountId){
    let bi = 0;
    let ei = 15; //100
    let output = [];
    while(ei<101){
        let temp = await recursiveMatchList(accountId, bi, ei);
        bi+=100;
        ei+=100;
        output=output.concat(temp);
        if(temp.length<100){
            break;
        }
    }
    return Promise.resolve(output);
}

function recursiveMatchList(accountId, bi, ei){
    return fetch(riot_url+matches_list_url+accountId+key+'&beginTime=1548384351159'+`&endIndex=${ei}&beginIndex=${bi}&queue=${solo_queue}`)
    .then(res => res.json())
    .then((data)=>{
        const match_list = [];
        if(data['matches']){
            for(let e of data.matches){
                let obj = {};
                obj['gameId'] = e.gameId;
                obj['lane'] = e.lane;
                obj['champion'] = e.champion;
                obj['timestamp'] = e.timestamp;
                obj['role'] = e.role;
                match_list.push(obj);
            }
            return match_list;
        }
        return [];
    })
    .catch((e)=>console.log(e));
}

function getMatchById(gameId, summonerId, lane, role){
    return fetch(riot_url+matches_url+gameId+key)
    .then(res => res.json())
    .then((data)=>{
        const match = {};
        match['duration'] = data.gameDuration;
        for(let p of data.participantIdentities){
            if(p.player.summonerId === summonerId){
                match['participantId'] = p.participantId;
                match['championId'] = p.championId;
                match['summonerName'] = p.player.summonerName;
            }
        }
        //console.log(gameId, summonerId, lane, role);
        for(p of data.participants){
            if(p.participantId === match['participantId']){
                match['championId'] = p.championId;
                match['win'] = p.stats.win;
                match['kills'] = p.stats.kills;
                match['deaths'] = p.stats.deaths;
                match['assists'] = p.stats.assists;
                match['totalDamageDealtToChampions'] = p.stats.totalDamageDealtToChampions;
                match['wardsPlaced'] = p.stats.wardsPlaced;
                match['firstBloodKill'] = p.stats.firstBloodKill;
                match['firstTowerKill'] = p.stats.firstTowerKill;
                match['totalMinionsKilled'] = p.stats.totalMinionsKilled;
                match['championId'] = p.championId;
                if(lane === 'BOTTOM' || lane === 'NONE'){
                    if(role === 'DUO_SUPPORT'){
                        match['lane'] = 'SUPPORT';
                    } else {
                        match['lane'] = 'BOTTOM';
                    }
                } else {
                    match['lane'] = lane;
                }
                
            }
        }

        return match;
    })
    .catch((e)=>console.log(e));
}

function fixedChampFrec(obj){
    const arr = [];
    for(let k in obj){
        arr.push({id: k, value: obj[k]});
    }

    arr.sort((a,b)=>b.value-a.value);

    return [arr[0].id,arr[1].id,arr[2].id];
}

function getMasteryChamps(id){
    return fetch(riot_url+mastery_url+id+key)
    .then(res => res.json())
    .then((data)=>{
        return [
            data[0].championId.toString(),
            data[1].championId.toString(),
            data[2].championId.toString()];
    })
    .catch((e)=>console.log(e));
}

function getChampsJson(){
    return fetch(champions_json)
    .then(res => res.json())
    .then((data)=>{
        return data.data;
    })
    .catch((e)=>console.log(e));
}

app.post('/getData', async function(req, res) {
    //console.log(req.body.name);
    const name = req.body.name;

    let summoner = await getSummonerByName(name);
    //console.log(summoner);

    let rank = await getRankById(summoner.id);
    //console.log(rank);

    let match_list = await getMatchListByAccountId(summoner.accountId);
    //console.log(match_list);
    //console.log(match_list.length);
    const matches = [];

    if(match_list.length>0){
        for(let m of match_list){
            let match = await getMatchById(m.gameId, summoner.id, m.lane, m.role);
            matches.push(match);
        }    
        //console.log(matches);
    }

    let champs = await getChampsJson();

    let mastery = await getMasteryChamps(summoner.id);
    //console.log(mastery, 'mastery');
    const champs_names = [];
    for(let c in champs){
        let temp = champs[c];
        if(mastery['length']){
            if(mastery.indexOf(temp.key)>-1){
                champs_names.push(temp.name);
            }
        }
    }

    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let winsCounts = 0;
    let first_bloods = 0;
    let damage = 0;
    let wards = 0;
    let minions = 0;
    let duration = 0;
    let champ_frec = {};
    let obj_lane = {
        'TOP': {'times': 0, wins: 0},
        'MID': {'times': 0, wins: 0},
        'JUNGLE': {'times': 0, wins: 0},
        'BOTTOM': {'times': 0, wins: 0},
        'SUPPORT': {'times': 0, wins: 0}
    };
    for(m of matches){
        if(champ_frec[m.championId] === undefined){
            champ_frec[m.championId] = 1;
        } else {
            champ_frec[m.championId] += 1;
        }

        kills += m.kills;
        deaths += m.deaths;
        assists += m.assists;
        damage += m.totalDamageDealtToChampions; 
        wards += m.wardsPlaced;
        minions += m.totalMinionsKilled
        duration += m.duration;
        obj_lane[m.lane].times+=1; 
        if(m.win){
            obj_lane[m.lane].wins+=1; 
            winsCounts++;
        }

        if(m.firstBloodKill){
            first_bloods++;
        }
        //console.log(m.lane)
    }

    let champ_arr = fixedChampFrec(champ_frec);
    const champs_arr_names = [];
    for(let c in champs){
        let temp = champs[c];
        if(champ_arr['length']){
            if(champ_arr.indexOf(temp.key)>-1){
                champs_arr_names.push(temp.name.replace(/ /g,'').replace(/'Koz/g,'koz'));
            }
        }
    }

    let user = {
        name: '',
        kills: 0,
        deaths: 0,
        assists: 0,
        wins: 0,
        matches: 0,
        first_blood: 0,
        totalDamageDealtToChampions: 0,
        wardsPlaced: 0,
        totalMinionsKilled: 0,
        duration: 0,
        'kda': '',
        'TOP': {'times': 0, wins: 0},
        'MID': {'times': 0, wins: 0},
        'JUNGLE': {'times': 0, wins: 0},
        'BOTTOM': {'times': 0, wins: 0},
        'SUPPORT': {'times': 0, wins: 0},
        'rank': '',
        'tier': '',
        'ranked_wins': '',
        'ranked_losses': '',
        'best_champs': [],
        'champ_frec': []
    };

    user.name = name;
    user.kills = kills;
    user.deaths = deaths;
    user.assists = assists;
    user.first_blood = first_bloods;
    user.TOP = obj_lane.TOP;
    user.MID = obj_lane.MID;
    user.JUNGLE = obj_lane.JUNGLE;
    user.BOTTOM = obj_lane.BOTTOM;
    user.SUPPORT = obj_lane.SUPPORT;
    user.wins = winsCounts;
    user.matches = matches.length;
    user.kda = `${(kills/matches.length).toFixed(2)}/${(deaths/matches.length).toFixed(2)}/${(assists/matches.length).toFixed(2)}`;
    user.rank = rank.rank;
    user.tier = rank.tier;
    user.ranked_wins = rank.wins;
    user.ranked_losses = rank.losses;
    user.best_champs = champs_names;
    user.wardsPlaced = (wards/matches.length).toFixed(2);
    user.totalDamageDealtToChampions = (damage/matches.length).toFixed(2);
    user.totalMinionsKilled = (minions/matches.length).toFixed(2);
    user.duration = Math.floor((duration/matches.length)/60);
    user.champ_frec = champs_arr_names;
    res.send({user: user});
});

