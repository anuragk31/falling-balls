function DotGame(){

    let currentScore = 0, isRunning = false, dotInterval, overlayValue = 3, gameRunningTime = 60, gameTimerId, highestScore = 0;
    let scoreArea = document.querySelector(".score-label"),
        maxScoreLabelElement = document.querySelector(".highScore-label"),
        startButton = document.querySelector(".start-btn"),
        restartBtnEle = document.querySelector(".restart-btn"),
        playGround = document.querySelector("main"),
        slider = document.querySelector("#dot-speed"),
        timerTextElement = document.querySelector(".time-label"),
        overlay = document.getElementById("overlay"),
        overlayText = document.querySelector("#overlay label"),
        modalElement = document.getElementById("modal"),
        modalLabelInfo = document.querySelector("#modal .modal-body-label"),
        modalCloseBtn = document.querySelector("#modal .btn-close");

    function resetGame() {
        isRunning = false;
        updateSpeed(0);
        updateMaxScore();
        currentScore = 0;
        updateScoreElement();
        startButton.classList.remove("running");
        highestScore = localStorage.getItem("maxScore") ? JSON.parse(localStorage.getItem("maxScore")) : 0;
        gameRunningTime = 60;
        timerTextElement.innerHTML = gameRunningTime.toString();
        startButton.innerHTML = "Start";
        dotInterval && clearInterval(dotInterval);
        Dot.removeAll();
    }

    function startGameTimer(){
        gameTimerId = setInterval(()=>{
           if(isRunning && !Dot.isAnimationFramePaused){
               gameRunningTime--;
               timerTextElement.innerHTML = gameRunningTime.toString();
               (highestScore < currentScore) && updateMaxScore();
               if(gameRunningTime == 0){
                   gameTimerId && clearInterval(gameTimerId);
                   gameTimerId = null;
                   updateMaxScore();
                   showGameOverModal();
               }
           }
        },1000);
    }

    function updateMaxScore(){
        let maxScore = localStorage.getItem("maxScore");
        maxScore = maxScore && (JSON.parse(maxScore) > currentScore) ? maxScore : currentScore;
        localStorage.setItem("maxScore", maxScore);
        maxScoreLabelElement.innerHTML = maxScore;
    }
    function updateSpeed(value) {
        Dot.DropSpeed = isRunning ? value : 0;
    }

    function showGameOverModal(){
        modalLabelInfo.innerHTML = "Your score is " + currentScore + ".";
        modalElement.style.display = "block";
    }
    function closeModal(){
        resetGame();
        modalElement.style.display = "none";
    }

    function updateScore(value) {
        currentScore += Math.ceil(value * JSON.parse("1."+ Dot.DropSpeed));
        updateScoreElement();
    }
    function updateScoreElement(){
        scoreArea.innerHTML = currentScore;
    }

    function pauseGame(){
        startButton.innerHTML = "Start";
        startButton.classList.remove("running");
        clearInterval(dotInterval);
        updateSpeed(0);
        isRunning = false;
    }

    async function toggleGameState() {
        if (isRunning) {
            pauseGame();
        } else {
            await overlayOn();
            isRunning = true;
            startGameTimer();
            startButton.classList.add("running");
            startButton.innerHTML = "Pause";
            updateSpeed(slider.value);
            dotInterval = setInterval(()=>{
                if(!Dot.isAnimationFramePaused) {
                    Dot.isAnimationFramePaused = true;
                    let dot = new Dot();
                    dot.createElement(updateScore);
                    dot.startMove(playGround)
                }
            }, 1000);
        }
    }

    function updateOverlayText(value){
        overlayText.innerHTML = value.toString();
    }

    function overlayOn(){
        overlayValue = 3;
        updateOverlayText(overlayValue);
        overlay.style.display = "block";
        return new Promise(resolve => {
            let intervalID = setInterval(()=>{
                overlayValue--;
                updateOverlayText(overlayValue);
                if(overlayValue == 0){
                    clearInterval(intervalID);
                    overLayOff();
                    resolve();
                };
            }, 1000)});
    }

    function overLayOff() {
        overlay.style.display = "none";
    }


    return {
        init: resetGame,
        isRunning: function(){
            return isRunning;
        },
        addListeners: function(){
            startButton.addEventListener("click", toggleGameState);
            slider.addEventListener('change', event => updateSpeed(slider.value));
            restartBtnEle.addEventListener("click", resetGame);
            modalCloseBtn.addEventListener("click", closeModal);
        }
    }
}

window.onload = function() {
    window.Game = DotGame();
    Game.init();
    Game.addListeners();
};