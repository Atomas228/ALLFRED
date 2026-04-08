
const majorChords = ["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"];
const minorChords = ["Cm","C♯m","Dm","E♭m","Em","Fm","F♯m","Gm","G♯m","Am","B♭m","Bm"];
let mainChord;
let allChords = [];
let addedTextPart = false;
let chord2;
let chord3;
let chord4;
let chord5;
let chord6;
let chord7;
let minutesWork;
let secondsWork;
let interval;
let iteration = 0;
let timeState = "stopped";
let chordFingerPlacement = [
    {name: "C", frets: [null, 3, 2, 0, 1, 0]}
]
if (localStorage.getItem("timerAttached") === "true") {
    let elem = document.getElementsByClassName("sticky-timer")[0];
    elem.style.display = "block";   
    let mainElem = document.getElementsByClassName("pomodoro-timer")[0];
    if (mainElem) {
        mainElem.style.display = "none";
        let btn = document.getElementById("attach-timer")
        btn.style.display = "none";  
    }
    minutesWork = localStorage.getItem("minutesWork");
    secondsWork = localStorage.getItem("secondsWork"); 
    stickyElem = document.getElementsByClassName("overlay-text")[0]; 
    stickyElem.textContent = `${String(minutesWork).padStart(2, "0")}:${String(secondsWork).padStart(2, "0")}`;
    iteration = localStorage.getItem("iteration");
    timeState = localStorage.getItem("timeState");
    if (timeState ==="running"){
        interval = setInterval(showTime, 1000)
    };
}
function resetTimer() {
    clearInterval(interval)
    interval = null;        
    let elem = document.getElementsByClassName("overlay-text")[0];
    let mainElem = document.getElementsByClassName("overlay-text")[1];
    let stickyElem = document.getElementsByClassName("sticky-timer")[0];
    stickyElem.style.display = "none";
    elem.textContent = `25:00`;
    mainElem.textContent = elem.textContent;        
    iteration = 0;
    minutesWork = 4;
    secondsWork = 59;
    timeState = "stopped";
    timer_elem = document.getElementsByClassName("pomodoro-timer")[0];
    timer_elem.style.display = "block";
    btn = document.getElementById("attach-timer")
    btn.style.display = "block";
    localStorage.setItem("timerAttached", "false");
}
function startTimer() {
    if (timeState === "running") {
        clearInterval(interval);
        interval = null;
        timeState = "paused";    
    }
    else if (timeState === "paused") {
        timeState = "running";
        interval = setInterval(showTime, 1000)
    }
    else {
        iteration++
        localStorage.setItem("iteration", iteration);
        let elem = document.getElementsByClassName("overlay-text")[0];
        let mainElem = document.getElementsByClassName("overlay-text")[1];
        if (iteration % 8 != 0 && iteration % 2 === 0) {
            elem.textContent = `05:00`;
            minutesWork = 4;
            secondsWork = 59;
        }
        else if (iteration % 8 === 0) {
            elem.textContent = `30:00`;
            minutesWork = 29;
            secondsWork = 59;
        }
        else {
            elem.textContent = `25:00`;
            minutesWork=24;
            secondsWork=59;
            timeState = "running"
            interval = setInterval(showTime, 1000)
        }
        if (mainElem) {
            mainElem.textContent = elem.textContent;
        }
    };
    localStorage.setItem("timeState",timeState);
    };
function showTime() {
    let elem = document.getElementsByClassName("overlay-text")[0];
    let mainElem = document.getElementsByClassName("overlay-text")[1];
    if (minutesWork > 0 && secondsWork === 0) {
        elem.textContent = `${String(minutesWork).padStart(2, "0")}:${String(secondsWork).padStart(2, "0")}`;
        minutesWork--;
        secondsWork=59;
    }
    else if (secondsWork > 0) {
        elem.textContent = `${String(minutesWork).padStart(2, "0")}:${String(secondsWork).padStart(2, "0")}`;
        secondsWork--;
    }
    else {
        elem.textContent = `05:00`;
        clearInterval(interval);
        interval = null;
        timeState = "stopped";
    }
    if (mainElem) {
        mainElem.textContent = elem.textContent;
    }
    localStorage.setItem("minutesWork", minutesWork);
    localStorage.setItem("secondsWork", secondsWork);
    localStorage.setItem("timeState",timeState);
};
function attachTimer() {
    let elem = document.getElementsByClassName("sticky-timer")[0];
    elem.style.display = "block";   
    let mainElem = document.getElementsByClassName("pomodoro-timer")[0];
    mainElem.style.display = "none";   
    let btn = document.getElementById("attach-timer")
    btn.style.display = "none";
    localStorage.setItem("timerAttached", "true");
}
document.addEventListener("DOMContentLoaded", () => {
let button_timer = document.querySelector("#start-timer");
button_timer.addEventListener("click", startTimer);
});
document.addEventListener("DOMContentLoaded", () => {
let button_reset = document.querySelector("#reset-timer");
button_reset.addEventListener("click", resetTimer);
});
document.addEventListener("DOMContentLoaded", () => {
let button_reset = document.querySelector("#attach-timer");
button_reset.addEventListener("click", attachTimer);
});
function showChords(chord) {
    let mainChordIndex = majorChords.indexOf(chord);
    if (mainChordIndex === -1) {
        mainChordIndex = minorChords.indexOf(chord);
        chord2 = minorChords[(mainChordIndex+2)%minorChords.length];
        chord3 = majorChords[(mainChordIndex+3)%minorChords.length];
        chord4 = minorChords[(mainChordIndex+5)%minorChords.length];
        chord5 = minorChords[(mainChordIndex+7)%minorChords.length];
        chord6 = majorChords[(mainChordIndex+8)%minorChords.length];
        chord7 = majorChords[(mainChordIndex+10)%minorChords.length];
    }
    else {
        chord4 = majorChords[(mainChordIndex+5)%majorChords.length];
        chord5 = majorChords[(mainChordIndex+7)%majorChords.length];
        let chord6Index = (mainChordIndex+9)%majorChords.length;
        chord6 = minorChords[chord6Index];
        chord2 = minorChords[(chord6Index+5)%majorChords.length];
        chord3 = minorChords[(chord6Index+7)%majorChords.length];
        chord7 = minorChords[(chord6Index+14)%majorChords.length];
    }
    let chordsElem = document.getElementsByClassName("chords-line")[0];
    let chordsElemEnd = document.getElementsByClassName("chords-line")[1];
    document.getElementsByClassName("chords-line")[0];
    allChords = [chord,chord2,chord3,chord4,chord5,chord6,chord7];
    chordsElem.textContent = `${chord}, ${chord2}, ${chord3},`;
    chordsElemEnd.textContent = `${chord4}, ${chord5}, ${chord6}, ${chord7}`;
    divs = document.querySelectorAll(".modes-order div span");
    firstChord = document.querySelector(".vibe-chords-names.main-chord");
    firstChord.textContent = chord;
    secondChord = document.querySelectorAll(".vibe-chords-names.second");
    secondChord.forEach(text => {
        text.textContent = chord2;
    });
    thirdChord = document.querySelectorAll(".vibe-chords-names.third");
    thirdChord.forEach(text => {
        text.textContent = chord3;
    });
    fourthChord = document.querySelectorAll(".vibe-chords-names.fourth");
    fourthChord.forEach(text => {
        text.textContent = chord4;
    });
    fifthChord = document.querySelectorAll(".vibe-chords-names.fifth");
    fifthChord.forEach(text => {
        text.textContent = chord5;
    });
    sixthChord = document.querySelectorAll(".vibe-chords-names.sixth");
    sixthChord.forEach(text => {
        text.textContent = chord6;
    });
    seventhChord = document.querySelectorAll(".vibe-chords-names.seventh");
    seventhChord.forEach(text => {
        text.textContent = chord7;
    });
    allChordPaths = document.querySelectorAll(".key-slice");
    allChordPaths.forEach(path => {
        path.classList.remove("active")
    })
    len = divs.length;
    for (let i=0; i<len; i++) {
        divs[i].textContent = ` - ${allChords[i]}`;
    }
    allChordsLen = allChords.length
    for (let i=0; i<allChordsLen; i++) {
        textChord = [...document.querySelectorAll("text")].find(d => d.textContent.trim() === allChords[i]);
        parentG = textChord.closest("g")
        parentG.classList.add("active")
    }
}
document.querySelectorAll("g.key-slice").forEach(g => {
        g.addEventListener("click", () => {
            const mainChord = g.querySelector("text").textContent.trim();
            showChords(mainChord)
        })
    });


function keyWork(key) {
    let allChordPaths = document.querySelectorAll(".scale-keys");
    allChordPaths.forEach(g => {
    g.classList.remove("active")
    })
    key.classList.add("active");
    localStorage.setItem("keyValue",key.querySelector("text").textContent)
}
function scaleNotesPlacement(data) {
    let standardTuningLetters = document.querySelectorAll("#main-string-svg text");
    standardTuningLetters.forEach((text => {
        text.setAttribute("fill", "#c0b9b9")
    }))
    let dataLen = data.length;
    const keyColor = ["orange","blue","red","yellow","white","green","purple"]
    const svg = document.getElementById("main-string-svg");
    const svgNS = "http://www.w3.org/2000/svg";
    document.querySelectorAll(".scales-note-circle").forEach( circle => circle.remove())
    
    for (let i=0; i<dataLen; i++) {
        let stringNotes = data[i];
        let stringLen = stringNotes.length;
        let xAxisPlacement;
        for (let n=0; n<stringLen; n++) {
            if (stringNotes[n] === 0){
                stringString = document.getElementById(`${i}_string`)
                stringString.setAttribute("fill", "orange")
                if (n === 0 || stringNotes[n] === stringNotes[0]+12){
                    stringString.setAttribute("fill", "#D84040")
                }
                else {
                    stringString.setAttribute("fill", "orange")
                }
                }
            else {
                if (stringNotes[n] === 1) {
                    xAxisPlacement = 60;
                }
                else {
                    xAxisPlacement = 80 * (stringNotes[n]-1) + 60;
                }
                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttribute("cx", xAxisPlacement);
                circle.setAttribute("cy",30*(5-i)+30);
                circle.setAttribute("r",10);
                circle.classList.add("scales-note-circle")
                console.log(n)
                if (n === 0 || stringNotes[n] === stringNotes[0]+12){
                    circle.setAttribute("fill", "#8E1616")
                }
                else {
                    circle.setAttribute("fill", "orange")
                }
                svg.appendChild(circle);
            }
        }
    }
}
    document.querySelectorAll("g.scale-keys").forEach(g => {
g.addEventListener("click", () => {
    const mainKey = g;
    keyWork(mainKey);
})
});
document.querySelectorAll(".key-buttons").forEach(button => {
button.addEventListener("click", () => {
    if (localStorage.getItem("keyValue")) {
    fetch(`/api/scale/${localStorage.getItem("keyValue")}/${button.textContent}`)
    .then(response => response.json())
    .then(data => {
        scaleNotesPlacement(data)
    });
}
})
});