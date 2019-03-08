function createImages(arr){
    let img1 = document.querySelector('#img1');
    let img2 = document.querySelector('#img2');
    let img3 = document.querySelector('#img3');
    img1.src = `http://ddragon.leagueoflegends.com/cdn/9.4.1/img/champion/${arr[0]}.png`;
    img2.src = `http://ddragon.leagueoflegends.com/cdn/9.4.1/img/champion/${arr[1]}.png`;
    img3.src = `http://ddragon.leagueoflegends.com/cdn/9.4.1/img/champion/${arr[2]}.png`;
}