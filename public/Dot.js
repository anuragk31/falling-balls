function Dot(){
    this.diameter = (Math.ceil(Math.random() * 10) * 10); // This will return random value btw 10 to 100 with the step of 10
}
Dot.DropSpeed = 1;
Dot.isAnimationFramePaused = false;
Dot.SpeedPerSecond = 2; //Default is 10px but this is looking too fast so making it 5px

Dot.prototype.onClick = function(clickHandler){
    let dotValue = (11 - this.diameter/10);
    if (Game.isRunning) {
        this.detach();
        clickHandler(dotValue);
    }
};

Dot.prototype.detach = function(){
    if(this.element && this.element.parentElement) {
        this.parent.removeChild(this.element);
        window.cancelAnimationFrame(this.requestId);
        delete Dot.list[this.id];
    }
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
    this.id = Date.now();
    Dot.list[this.id] = this;
};
Dot.list = {};
Dot.removeAll = ()=>{
  Object.keys(Dot.list).forEach(id =>{
      let dot = Dot.list[id];
      dot.detach();
  })
};

Dot.prototype.verifyXViewPort = function(){
    let frameRate = 1/60;
    let playgroundHeight = this.parent.offsetHeight;
    let positionY = parseFloat(this.element.style.top);
    let newPosition = positionY + (frameRate * Dot.DropSpeed * Dot.SpeedPerSecond);
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
