const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

let expression = "";

/* ========= SOM ========= */
function playSound(){
  const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_click.mp3");
  audio.volume = 0.2;
  audio.play();
}

/* ========= CALC ========= */
function updateDisplay(){
  display.textContent = expression || "0";
}

function calculate(){
  try{
    const result = eval(
      expression
        .replace(/×/g,"*")
        .replace(/÷/g,"/")
        .replace(/−/g,"-")
    );

    addHistory(expression + " = " + result);
    expression = result.toString();
  }catch{
    expression = "Erro";
  }
  updateDisplay();
}

function addHistory(text){
  const li = document.createElement("li");
  li.textContent = text;
  historyList.prepend(li);
}

/* ========= CLIQUES ========= */
buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    playSound();

    const val = btn.textContent;

    if(val==="C"){
      expression="";
    }
    else if(val==="="){
      calculate();
      return;
    }
    else{
      expression+=val;
    }

    updateDisplay();
  });
});

/* ========= TECLADO ========= */
document.addEventListener("keydown",(e)=>{
  if("0123456789.+-*/()".includes(e.key)){
    expression+=e.key;
  }
  if(e.key==="Enter") calculate();
  if(e.key==="Backspace") expression=expression.slice(0,-1);
  updateDisplay();
});

/* ========= TEMA ========= */
themeToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
};

/* ========= ARRASTAR (MOUSE + TOUCH) ========= */
const calc = document.getElementById("calculator");
const dragArea = document.getElementById("dragArea");

let offsetX, offsetY, isDragging=false;

function startDrag(x,y){
  isDragging=true;
  offsetX = x - calc.offsetLeft;
  offsetY = y - calc.offsetTop;
}

function moveDrag(x,y){
  if(!isDragging) return;
  calc.style.left = x-offsetX+"px";
  calc.style.top = y-offsetY+"px";
}

dragArea.addEventListener("mousedown",e=>startDrag(e.clientX,e.clientY));
document.addEventListener("mousemove",e=>moveDrag(e.clientX,e.clientY));
document.addEventListener("mouseup",()=>isDragging=false);

dragArea.addEventListener("touchstart",e=>{
  const t=e.touches[0];
  startDrag(t.clientX,t.clientY);
});

document.addEventListener("touchmove",e=>{
  const t=e.touches[0];
  moveDrag(t.clientX,t.clientY);
});

document.addEventListener("touchend",()=>isDragging=false);
