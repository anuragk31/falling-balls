function DotGame(){

    function Dot(){
        this.diameter = (Math.ceil(Math.random() * 10) * 10);
    }
    Dot.DropSpeed = 1;
    Dot.isAnimationFramePaused = false;

    Dot.prototype.onClick = function(clickHandler){
        let dotValue = (11 - this.diameter/10);
        if (isRunning) {
            this.detach();
            clickHandler(dotValue);
        }
    };

    Dot.prototype.detach = function(){
        this.parent.removeChild(this.element);
        window.cancelAnimationFrame(this.requestId);
    };

    Dot.prototype.createElement = function(clickHandler){
        function getLeftPosition (min, max){
            return Math.ceil(Math.random() * (max - min) + min);
        }
        let positionX = getLeftPosition(0, window.innerWidth - this.diameter);
        let dotElement = document.createElement('span');
        dotElement.setAttribute('class', 'dot');
        dotElement.style.width = this.diameter + 'px';
        dotElement.style.height = this.diameter + 'px';
        dotElement.style.top = 0 + 'px';
        dotElement.style.left = positionX + "px";
        dotElement.classList.add("color-" + this.diameter);
        dotElement.addEventListener("mousedown", this.onClick.bind(this, clickHandler));
        this.element = dotElement;
    };

    Dot.prototype.verifyXViewPort = function(){
        let frameRate = 1/60;
        let playgroundHeight = this.parent.offsetHeight;
        let positionY = parseFloat(this.element.style.top);
        let newPosition = positionY + (frameRate * Dot.DropSpeed * 10);
        if (newPosition > playgroundHeight) {
            this.detach();
        } else {
            this.element.style.top = newPosition + "px";
        }
    };
    Dot.prototype.verifyYViewPort = function(){
        let viewPortWidth = window.outerWidth;
        let dotLastPixel = parseFloat(this.element.style.left) + this.diameter/2;
        (viewPortWidth < dotLastPixel) && this.detach();
    };

    Dot.prototype.startMove = function(parentElement){
        this.parent = parentElement;
        parentElement.appendChild(this.element);
        function updateFrame(){
            Dot.isAnimationFramePaused = false;
            if(this.element.parentNode) {
                (Dot.DropSpeed != 0) && this.verifyXViewPort();
                this.verifyYViewPort();
                window.requestAnimationFrame(updateFrame.bind(this));
            }
        }
        this.requestId = window.requestAnimationFrame(updateFrame.bind(this));
    };



    let currentScore = 0, isRunning = false, dotInterval;
    let scoreArea = document.querySelector(".score-label"),
        startButton = document.querySelector(".start-btn"),
        playGround = document.querySelector("main");

    function initGame() {
        isRunning = false;
        updateScore(0);
        updateSpeed(1);
    }
    function updateSpeed(value) {
        Dot.DropSpeed = isRunning ? value : 0;
    }

    function updateScore(value) {
        currentScore += value;
        scoreArea.innerHTML = currentScore;
    }

    function toggleGameState() {
        if (isRunning) {
            startButton.innerHTML = "Start";
            clearInterval(dotInterval);
            updateSpeed(0);
            isRunning = false;
        } else {
            isRunning = true;
            startButton.innerHTML = "Pause";
            updateSpeed(document.querySelector("#dot-speed").value);
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


    return {
        setup: initGame,
        start: toggleGameState,
        updateSpeed: updateSpeed
    }
}

window.onload = function() {
    let slider = document.querySelector("#dot-speed");
    let dotGame = DotGame();
    dotGame.setup();
    document.querySelector(".start-btn").addEventListener("click", dotGame.start);
    slider.addEventListener('change', event => dotGame.updateSpeed(slider.value));
};