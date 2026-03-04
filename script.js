const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const calc = document.getElementById("calculator");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

let expression = "";
let history = [];

/* ===== SOM ===== */
const clickSound = new Audio("click.mp3");

/* ===== FUNÇÃO SOM ===== */
function playSound(){
  clickSound.currentTime = 0;
  clickSound.play();
}

/* ===== ATUALIZA DISPLAY ===== */
function updateDisplay(value){
  display.innerText = value || "0";
}

/* ===== ADICIONAR HISTÓRICO ===== */
function addHistory(item){
  history.unshift(item);
  history = history.slice(0,10);

  historyList.innerHTML = "";
  history.forEach(h=>{
    const li = document.createElement("li");
    li.textContent = h;
    historyList.appendChild(li);
  });
}

/* ===== BOTÕES ===== */
buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const value = btn.innerText;
    playSound();

    if(value === "C"){
      expression = "";
      updateDisplay("0");
      return;
    }

    if(value === "="){
      try{
        const result = eval(expression);
        addHistory(`${expression} = ${result}`);
        expression = result.toString();
        updateDisplay(expression);
      }catch{
        updateDisplay("Erro");
        expression="";
      }
      return;
    }

    expression += value;
    updateDisplay(expression);
  });
});

/* ===== TECLADO ===== */
document.addEventListener("keydown", (e)=>{
  const key = e.key;

  if("0123456789+-*/().".includes(key)){
    expression += key;
    updateDisplay(expression);
    playSound();
  }

  if(key === "Enter"){
    try{
      const result = eval(expression);
      addHistory(`${expression} = ${result}`);
      expression = result.toString();
      updateDisplay(expression);
    }catch{
      updateDisplay("Erro");
    }
  }

  if(key === "Backspace"){
    expression = expression.slice(0,-1);
    updateDisplay(expression);
  }
});

/* ===== DRAG + TOUCH ===== */
let isDragging=false, offsetX=0, offsetY=0;

function startDrag(x,y){
  isDragging=true;
  offsetX=x-calc.offsetLeft;
  offsetY=y-calc.offsetTop;
}

function moveDrag(x,y){
  if(!isDragging) return;
  calc.style.left = x-offsetX+"px";
  calc.style.top = y-offsetY+"px";
}

function stopDrag(){ isDragging=false; }

calc.addEventListener("mousedown", e=>startDrag(e.clientX,e.clientY));
document.addEventListener("mousemove", e=>moveDrag(e.clientX,e.clientY));
document.addEventListener("mouseup", stopDrag);

calc.addEventListener("touchstart", e=>{
  const t=e.touches[0];
  startDrag(t.clientX,t.clientY);
});

document.addEventListener("touchmove", e=>{
  const t=e.touches[0];
  moveDrag(t.clientX,t.clientY);
});

document.addEventListener("touchend", stopDrag);

/* ===== TEMA ===== */
themeToggle.addEventListener("click", ()=>{
  calc.classList.toggle("light");
  themeToggle.innerText = calc.classList.contains("light") ? "☀️" : "🌙";
});
