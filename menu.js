//https://stackoverflow.com/questions/15455289/changing-variable-by-html-button

var mode = 0;
localStorage.something = "pvp" ; 

localStorage.test = "test" ; 
//document.getElementById("selectMode").addEventListener("click", selectMode);
window.updateMode = updateMode;
function updateMode(){
    mode++;
    if(mode%3==0){
        document.getElementById("selectMode").innerHTML="Player VS Player";
        localStorage.something = "pvp" ; 
    }
    else if(mode%3==1){
        document.getElementById("selectMode").innerHTML="Player VS Bot";
        localStorage.something = "pva" ; 
    }
    else if(mode%3==2){
        document.getElementById("selectMode").innerHTML="Bot VS Bot";
        localStorage.something = "ava" ; 
    }
}
//export {blackAI,whiteAI,playerVSAI,playerVSplayer,AIVSAI}