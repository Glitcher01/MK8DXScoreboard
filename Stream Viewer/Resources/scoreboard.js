window.onload = init;
var t1_data = [0, 0]; //Amount of sets and points earned by Team 1 (sets won, points won)
var t2_data = [0, 0]; //Same for team 2
var setsRequired = 3; // Amount of sets needed to win
var match_info = [0, 0];
fadeInTime  = 0.3;
fadeOutTime = 0.2;
let startup = true;

function init() {
    async function mainLoop() {
		const scInfo = await getInfo();
		getData(scInfo);
	}
    
	mainLoop();
	setInterval( () => { mainLoop(); }, 500); // Routinely checks for any updates to JSON file
}

function getInfo() {
	return new Promise(function (resolve) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", 'Resources/Scoreboard.json');
		oReq.send();

		//will trigger when file loads
		function reqListener () {
			resolve(JSON.parse(oReq.responseText))
		}
	})
	//i would gladly have used fetch, but OBS local files wont support that :(
}

function changeValue(element, value, startup) {
    let color = element.style.color;
    element.classList.add('text-fade');
    setTimeout(() => {
        element.textContent = value;
        element.classList.remove('text-fade');
        element.classList.add('show');
        element.style.color = color;
      }, 500);
    element.classList.remove('show');
}
//Not sure if this needs to be async, Leaving the way it is for now
async function getData(scInfo) {
    let T1Init = document.getElementById('IL');
    let T1Name = document.getElementById('NL');
    let T1Points = document.getElementById('SL');

    let T2Init = document.getElementById('IR');
    let T2Name = document.getElementById('NR');
    let T2Points = document.getElementById('SR');

    let setNum = document.getElementById('set-num');
    let raceNum = document.getElementById('race-num');
    if (startup) {
        T1Init.textContent = scInfo['T1Init'];
        T1Name.textContent = scInfo['T1Name'];
        T1Points.textContent = scInfo['T1Points'];
        T1Points.setAttribute("ScoreTo",scInfo['T1Points'])

        T2Init.textContent = scInfo['T2Init']; 
        T2Name.textContent = scInfo['T2Name'];
        T2Points.textContent = scInfo['T2Points'];
        T2Points.setAttribute("ScoreTo",scInfo['T2Points'])

        updateSets(setsRequired);
        updateInfo([0, 0]);
        startup = false;
    }
    else {
        if (T1Init.textContent != scInfo['T1Init'] || T1Name.textContent != scInfo['T1Name'] || T1Points.getAttribute("ScoreTo") != scInfo['T1Points']) {
                updateScore(scInfo['T1Points'],1000,T1Points)
                updateTeams([T1Init, T1Name], [scInfo['T1Init'], scInfo['T1Name']]);
        }
        if(T2Init.textContent != scInfo['T2Init'] || T2Name.textContent != scInfo['T2Name'] || T2Points.getAttribute("ScoreTo") != scInfo['T2Points']) {
                updateScore(scInfo['T2Points'],1000,T2Points)
                updateTeams([T2Init, T2Name], [scInfo['T2Init'], scInfo['T2Name']]);
        }
        if (setsRequired != scInfo['TotalSets'] || t1_data[0] != parseInt(scInfo['T1Sets']) || t2_data[0] != parseInt(scInfo['T2Sets'])) {
            updateSets([scInfo['TotalSets'], scInfo['T1Sets'], scInfo['T2Sets']])
        }
        
        if(match_info[0] != parseInt(scInfo['SetNum']) || match_info[1] != parseInt(scInfo['RaceNum'])) {
            updateInfo([scInfo['SetNum'], scInfo['RaceNum']]);
        }
    }
}

function updateTeams(elements, data) {
    if (elements.length != data.length) {
        return;
    }
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent != data[i]) {
            changeValue(elements[i], data[i]);
        }
    }
}
//Updates Score through animation
async function updateScore(score, duration, element) {
    let startTime = null;
    console.log(element.textContent)
    let start = Number(element.textContent + "");
    element.setAttribute("ScoreTo",score);
    duration = Number(duration);
    const step = (timestamp) => {
        if(startTime == null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        element.textContent = Math.floor((element.getAttribute("ScoreTo") - start) * progress) + start;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function updateSets(scInfo) {
    setsRequired = scInfo[0];
    if (parseInt(scInfo[1]) == NaN) {
        t1_data[0] = 0;
    }
    else {
        t1_data[0] = scInfo[1];
    }
    if (parseInt(scInfo[2]) == NaN) {
        t2_data[0] = 0;
    }
    else {
        t2_data[0] = scInfo[2];
    }
    let set_multiplier = 1; // determines size of visible sets
    if (setsRequired > 1) {
        set_multiplier = 0.95;
    }
    if (document.getElementById('T1SW').childElementCount == setsRequired && document.getElementById('T2SW').childElementCount == setsRequired) {
        for(let i = 0; i < setsRequired; i++) {
            let T1SNum = document.getElementById('T1S' + i);
            let T2SNum = document.getElementById('T2S' + i);
            if (i < t1_data[0] && T1SNum.style.backgroundColor == 'transparent') {
                T1SNum.classList.add('fade');
                setTimeout(() => {
                    T1SNum.style.backgroundColor = '#de1b22';
                    T1SNum.classList.remove('fade');
                    T1SNum.classList.add('show');
                }, 500);
                T1SNum.classList.remove('show');
            }
            else if (i >= t1_data[0] && T1SNum.style.backgroundColor != 'transparent') {
                T1SNum.classList.add('fade');
                T1SNum.style.backgroundColor = 'transparent';
                T1SNum.classList.remove('fade');
            }
            if (i > setsRequired - t2_data[0] - 1 && T2SNum.style.backgroundColor == 'transparent') {
                T2SNum.classList.add('fade');
                setTimeout(() => {
                    T2SNum.style.backgroundColor = '#3363ff';
                    T2SNum.classList.remove('fade');
                    T2SNum.classList.add('show');
                }, 500);
                T2SNum.classList.remove('show');
            }
            else if (i <= setsRequired - t2_data[0] - 1 && T2SNum.style.backgroundColor != 'transparent') {
                T2SNum.classList.add('fade');
                T2SNum.style.backgroundColor = 'transparent';
                T2SNum.classList.remove('fade');
            }
        }
    }
    else {
        document.getElementById('T1SW').innerHTML = '';
        document.getElementById('T2SW').innerHTML = '';
        for (let i = 0; i < setsRequired; i++) {
            let TS1 = "<div id=\'T1S" + (i) + "\'style=\'width:calc(" + Math.abs(set_multiplier) + "* var(--board_width) / " + (setsRequired) + "); border-radius: 0.5vh; ";
            let TS2= "<div id=\'T2S" + (i) + "\'style=\'width:calc("+ Math.abs(set_multiplier) +" * var(--board_width) / " + (setsRequired) + "); border-radius: 0.5vh; ";
            if (i < setsRequired - 1) {
                TS1 += "margin-right:calc(" + Math.abs(1 - set_multiplier) + " * var(--board_width) / " + (setsRequired - 1) + ");";
                TS2 += "margin-right:calc(" + Math.abs(1 - set_multiplier) + " * var(--board_width) / " + (setsRequired - 1) + ");";
            }
            if (i < t1_data[0]) {
                TS1 += 'background-color: #de1b22;';
            }
    
            if (i > setsRequired - t2_data[0] - 1) {
                TS2 += 'background-color: #3363ff;'
            }
            document.getElementById('T1SW').innerHTML += TS1 + "\'></div>";
            document.getElementById('T2SW').innerHTML += TS2 + "\'></div>";
        }
    }
    // if (t1_data[0] >= setsRequired && t2_data[0] < setsRequired) {
    //     document.getElementById('Crazy8').style.fill = '#de1b22';
    // }
    // else if(t2_data[0] >= setsRequired && t1_data[0] < setsRequired) {
    //     document.getElementById('Crazy8').style.fill = '#3363ff';
    // }
    // else {
    //     document.getElementById('Crazy8').style.fill = '#ffffff';
    // }
}

function updateInfo(matchInfo) {
    match_info[0] = parseInt(matchInfo[0]) == NaN ? 0 : parseInt(matchInfo[0]);
    match_info[1] = parseInt(matchInfo[1]) == NaN ? 0 : parseInt(matchInfo[1]);
    document.getElementById('set-num').textContent = 'Set ' + match_info[0];
    fitText('set-num');
    document.getElementById('race-num').textContent = 'Race ' + match_info[1];
    fitText('race-num');
}

// Fixes font size to fit inside.
function fitText(element) {
     // max font size in pixels
     const maxFontSize = 50;
     // get the DOM output element by its selector
     let outputDiv = document.getElementById(element);
     // get element's width & height
     let width = outputDiv.clientWidth;
     let height = outputDiv.clientHeight;
     // get content's width
     let contentWidth = outputDiv.scrollWidth;
     let contentHeight = outputDiv.scrollHeight;
     // get fontSize
     let fontSize = parseInt(window.getComputedStyle(outputDiv).getPropertyValue('font-size'));
     // if content's width is bigger then elements width - overflow
     if (contentWidth > width || contentHeight > height){
         fontSize = Math.min(Math.ceil(fontSize * width/contentWidth), Math.ceil(fontSize * height/contentHeight));
         fontSize =  fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize - 1;
         outputDiv.style.fontSize = fontSize+'px';
         console.log([width, contentWidth, height, contentHeight, fontSize]);
     }else{
         // content is smaller then width... let's resize in 1 px until it fits 
         while (contentWidth === width && contentHeight === height && fontSize < maxFontSize){
             fontSize = Math.ceil(fontSize) + 1;
             fontSize = fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize;
             outputDiv.style.fontSize = fontSize+'px';   
             // update widths
             width = outputDiv.clientWidth;
             contentWidth = outputDiv.scrollWidth;
             height = outputDiv.clientHeight;
             contentHeight = outputDiv.scrollHeight;
             if (contentWidth > width || contentHeight > height){
                 outputDiv.style.fontSize = fontSize-1+'px'; 
             }
         }
     }
}