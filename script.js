const songName = document.getElementById('music-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const facaVoceMesmo = {
    songName : 'Faça Você Mesmo',
    artist : 'Filipe Ret',
    file : 'FilipeRet_FacaVoceMesmo',
    liked : false
};
const corteAmericano = {
    songName : 'Corte Americano',
    artist : 'Filipe Ret',
    file : 'FilipeRet_CorteAmericano',
    liked : true
};  
const konteiner = {
    songName : 'Konteiner',
    artist : 'Filipe Ret',
    file : 'FilipeRet_Konteiner',
    liked : false
};
const neuroticoDeGuerra = {
    songName : 'Neurótico De Guerra',
    artist : 'Filipe Ret',
    file : 'FilipeRet_NeuroticoDeGuerra',
    liked : false
};  
const invicto = {
    songName : 'Invicto',
    artist : 'Filipe Ret',
    file : 'FilipeRet_Invicto',
    liked : false
};  
const soPrecisamosDeNos = {
    songName : 'Só Precisamos de Nós',
    artist : 'Filipe Ret',
    file : 'FilipeRet_SoPrecisamosDeNos',
    liked : false
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalplaylist = JSON.parse(localStorage.getItem('playlist')) ?? [
    facaVoceMesmo,
    corteAmericano,
    konteiner,
    neuroticoDeGuerra,
    invicto,
    soPrecisamosDeNos
];
let sortedPlaylist = [...originalplaylist];
let index = 0; 

function playsong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying =  true;
}

function pausesong(){
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying =  false;
}

function playPauseDecider(){
    if (isPlaying === true) {
        pausesong();
    } else {
        playsong();
    }
}

function likeButtonRender(){
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else{
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `sons/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if (index === 0) {
        index = sortedPlaylist.length - 1;    
    } else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong(){
    if (index === sortedPlaylist.length - 1) {
        index = 0;    
    } else {
        index += 1;
    }
    initializeSong();
    playsong();
}

function updateProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}; 

function shuffleArray(preShuffleArray){
    let size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1; 
    }
    
} 

function shuffleButtonClicked(){

    if (isShuffled == false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalplaylist];
        shuffleButton.classList.remove('button-active');
    }

}

function repeatButtonClicked(){
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');

    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat(){
    if (repeatOn === false) {
        nextSong();
    } else {
        playsong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours* 3600 - min* 60);

return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime(){
    toHHMMSS(song.duration);
    totalTime.innerText = toHHMMSS(song.duration);;
}

function likeButtonClicked(){
    if (sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    } else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalplaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);