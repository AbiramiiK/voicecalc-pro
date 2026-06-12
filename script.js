
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const count = document.getElementById("count");
const themeBtn = document.getElementById("themeBtn");

let history =
JSON.parse(localStorage.getItem("calcHistory")) || [];

let total =
parseInt(localStorage.getItem("calcCount")) || 0;

count.textContent = total;

renderHistory();

function append(value){
    display.value += value;
}

function clearDisplay(){
    display.value = "";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}

function calculate(){

    try{

        let expression = display.value;
        let result = eval(expression);

        display.value = result;

        history.unshift(
            `${expression} = ${result}`
        );

        total++;

        localStorage.setItem(
            "calcCount",
            total
        );

        localStorage.setItem(
            "calcHistory",
            JSON.stringify(history)
        );

        count.textContent = total;

        renderHistory();

    }catch{
        display.value = "Error";
    }
}

function renderHistory(){

    historyList.innerHTML = "";

    history.forEach(item=>{

        let li =
        document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);
    });
}

function clearHistory(){

    history = [];

    localStorage.removeItem(
        "calcHistory"
    );

    renderHistory();
}

document.addEventListener("keydown",(e)=>{

    if(!isNaN(e.key) ||
        "+-*/.%".includes(e.key))
        append(e.key);

    if(e.key==="Enter")
        calculate();

    if(e.key==="Backspace")
        deleteLast();

    if(e.key==="Escape")
        clearDisplay();
});

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");
    themeBtn.innerHTML = "☀️";
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeBtn.innerHTML = "☀️";

    }else{

        localStorage.setItem(
            "theme",
            "light"
        );

        themeBtn.innerHTML = "🌙";
    }
});

function startVoice(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert(
        "Voice recognition not supported."
        );

        return;
    }

    const recognition =
    new SpeechRecognition();

    recognition.start();

    recognition.onresult =
    function(event){

        let text =
        event.results[0][0]
        .transcript
        .toLowerCase();

        text = text
        .replace(/plus/g,'+')
        .replace(/minus/g,'-')
        .replace(/times/g,'*')
        .replace(/divided by/g,'/')
        .replace(/multiplied by/g,'*');

        try{

            let result = eval(text);

            display.value = result;

            let speech =
            new SpeechSynthesisUtterance(
                "The answer is " +
                result
            );

            speechSynthesis
            .speak(speech);

        }catch{

            display.value =
            "Voice Error";
        }
    };
}

function downloadPDF(){

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    doc.setFontSize(18);

    doc.text(
        "VoiceCalc Pro History",
        20,
        20
    );

    let y = 40;

    history.forEach(item=>{

        doc.text(item,20,y);

        y += 10;

        if(y > 280){

            doc.addPage();
            y = 20;
        }
    });

    doc.save(
        "VoiceCalc-History.pdf"
    );
}