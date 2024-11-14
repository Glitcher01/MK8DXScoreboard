window.onload = init;
const fs = require('fs');
const path = require('path');
const mainPath = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR, 'Resources');

// Contains HTML for Team 1 and Team 2
var T1 = [null, null, null, null];
var T2 = [null, null, null, null];

// Current Mode of Matches (First_to / Best_of)
var matches = null;
function init() {
    T1 = [document.getElementById('T1I'),
          document.getElementById('T1N'),
          document.getElementById('T1P'),
          document.getElementById('T1S')];
    T2 = [document.getElementById('T2I'),
          document.getElementById('T2N'),
          document.getElementById('T2P'),
          document.getElementById('T2S')];
    matches = document.getElementById('bestOfNum');
    document.getElementById("swapRegion").addEventListener('click', swap);
    document.getElementById("updateRegion").addEventListener('click', update);

    document.getElementById("best_of").addEventListener('click', changeBestOf);
    document.getElementById("first_to").addEventListener('click', changeBestOf);
    document.getElementById('best_of').style.color = 'var(--text2)';
    document.getElementById('best_of').style.backgroundColor = 'var(--back2)';
}

function swap() {
    if (T1.length != T2.length) {
        return null;
    }
    for (let i = 0; i < T1.length; i++) {
        const temp = T1[i].value;
        T1[i].value = T2[i].value;
        T2[i].value = temp;
    }
}

function update() {
    if (T1[2].value == '') {
        
    }
    let scoreJSON = {
        T1Init: T1[0].value,
        T1Name: T1[1].value,
        T1Points: T1[2].value == '' ? '0' : T1[2].value,
        T1Sets: T1[3].value == '' ? '0' : T1[3].value,
        T2Init: T2[0].value,
        T2Name: T2[1].value,
        T2Points: T2[2].value == '' ? '0' : T2[2].value,
        T2Sets: T2[3].value == '' ? '0' : T2[3].value,
        TotalSets: matches.value,
        SetNum: document.getElementById('SN').value == '' ? '1' : document.getElementById('SN').value,
        RaceNum: document.getElementById('RN').value == '' ? '1' : document.getElementById('RN').value
    };
    let data = JSON.stringify(scoreJSON, null, 2);
    fs.writeFileSync(mainPath + '/Scoreboard.json', data);
}