const buttons = document.querySelectorAll('#calculatorOutline div');
const display = document.querySelector('#display span');
let divButton;
const backButton = document.querySelector('#back');
let toBeDeleted = [];
let divsAndMults;
let plusAndMinus;
let numbers;
for(let i = 0; i < buttons.length; i++){
    if('value' in buttons[i].dataset) {
        if(buttons[i].dataset['value'] == '/')
            divButton = buttons[i];
        if(buttons[i].getAttribute('data-value') == '=')
            buttons[i].addEventListener('click', parseDisplay)
        buttons[i].addEventListener('click', buttonClick);
    }
    if(buttons[i].getAttribute('id') == 'clear')
        buttons[i].addEventListener('click', resetDisplay);
}
backButton.addEventListener('click',buttonClick);
backButton.addEventListener('click',back);

function back() {
    display.textContent = display.textContent.substr(0, display.textContent.length-1);
}

function buttonClick() {
    if(this.getAttribute('data-value') != '=')
        display.textContent += this.getAttribute('data-value');
    this.style.background = '#5F6368';
    this.style.color = '#f5f5f5';
    setTimeout(resetColor, 100, this);
    setDisplayWidth();
}

function resetColor(button) {
    button.style.background = '#f5f5f5';
    button.style.color = '#5F6368';
}

function parseDisplay() {
    console.log(display.clientWidth)
    refreshPositions();
    
    let lastNumIndex = 0;
    for(let i = 0; i < numbers.length; i++){
        if(display.textContent.indexOf(numbers[i], lastNumIndex) == -1){
            display.textContent = display.textContent.substring(0,lastNumIndex) + '0' + display.textContent.substring(lastNumIndex,);
        }
        lastNumIndex += String(numbers[i]).length + 1;
    }
    refreshPositions();

    while(divsAndMults.length>0) {
        let operation = display.textContent.charAt(divsAndMults[0]);
        let leftNumber = findNumber(divsAndMults[0], display.textContent, 'l', numbers);
        let rightNumber = findNumber(divsAndMults[0], display.textContent,  'r', numbers);
        let value;
        switch(operation) {
            case '/':
                value = leftNumber/rightNumber;    
                break;
            case '*':
                value = leftNumber * rightNumber;
                break;
        }
        reconstructString(value, leftNumber+operation+rightNumber);
    }

    while(plusAndMinus.length>0) {
        let operation = display.textContent.charAt(plusAndMinus[0]);
        let leftNumber = findNumber(plusAndMinus[0], display.textContent, 'l', numbers);
        let rightNumber = findNumber(plusAndMinus[0], display.textContent,  'r', numbers);
        let value;
        switch(operation) {
            case '+':
                value = leftNumber+rightNumber;
                break;
            case '-':
                value = leftNumber-rightNumber;
            break;
        }
        reconstructString(value, leftNumber+operation+rightNumber);
    }
    console.log(isOverflown(display));


    
    console.table(numbers);
}

function refreshPositions() {
    numbers = findNumbers();
    divsAndMults = (indexOfAll(display.textContent, '*').concat(indexOfAll(display.textContent,'/'))).sort();
    plusAndMinus = (indexOfAll(display.textContent, '+').concat(indexOfAll(display.textContent, '-'))).sort();
}

function reconstructString(value, stringToReplace) {
    let string = display.textContent;
    let a = findNumbers();
    display.textContent = string.substring(0, string.indexOf(stringToReplace)) + value + string.substring(string.indexOf(stringToReplace)+stringToReplace.length,);
    refreshPositions();
}

function findNumber (index, string, dir, numbers){
    let lastNumIndex = 0;
    switch(dir) {
        case 'l':
            for(let i = 0; i < numbers.length; i++) {
                if(string.indexOf(numbers[i], lastNumIndex) >= index)
                    return numbers[i-1];
                lastNumIndex += String(numbers[i]).length+1;
            }
            break;
        case 'r':
            for(let i = 0; i < numbers.length; i++) {
                if(string.indexOf(numbers[i], lastNumIndex) >= index)
                    return numbers[i];
                lastNumIndex += String(numbers[i]).length+1;
            }
            break;
    }
}

function findNumbers (){
    let numStart = 0;
    let numEnd = 0;
    let numbers = [];
    for(let i = 0; i < display.textContent.length; i++) {
        if(!/[0-9.]/.test(display.textContent.charAt(i))){
            if(i==0) {
                displayError();
                break;
            }
            else if(/[+-/*]/.test(display.textContent.charAt([i-1])))
                displayError();
            else {
                numEnd = i;
                numbers.push(Number(display.textContent.substring(numStart,numEnd)));
                if(display.textContent.length> i+1)
                    numStart = i+1;
            }
        }
        else if(i == display.textContent.length-1){
            numEnd = i+1;
            numbers.push(Number(display.textContent.substring(numStart,numEnd)));
            
        }
    }
    return numbers;
}

function indexOfAll (stringToSearch, stringSearchedFor) {
    let foundLocations = [];
    let pos = 0;
    while (true) {
        pos = stringToSearch.indexOf(stringSearchedFor, pos+1);
        if(pos==-1 || pos>=stringToSearch.length-1)
            break;
        foundLocations.push(pos);
    }
    return foundLocations;
}

function displayError() {
    display.textContent='ERROR';
    setTimeout(resetDisplay, 500);
}

function resetDisplay() {
    display.textContent = '';
    centerCalc();
}

function centerCalc() {
    document.querySelector('#calculatorOutline').firstElementChild.style.marginLeft = ((window.innerWidth-300)/2) + 'px';
    setDisplayWidth();
    backButton.style.position='absolute'
    backButton.style.top='83px';
    backButton.style.left = divButton.getBoundingClientRect().right+'px';
}

centerCalc();
setDisplayWidth();
window.onresize = centerCalc;


function isOverflown(element) {
    return element.clientWidth > 300;
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function setDisplayWidth() {
    display.parentElement.style.width = '300px';
    if(isOverflown(display)) {
        display.parentElement.style.width = '';
        display.parentElement.style.textAlign = 'center';
        display.parentElement.style.marginLeft = '';
        display.style.background = '#23232321';
        display.parentElement.style.background = '';
        display.style.position = 'absolute'
        display.style.left = ((window.innerWidth-display.clientWidth)/2) + 'px';
    } else {
        display.parentElement.style.textAlign = 'left';
        display.style.left = '';
        display.parentElement.style.background = '#23232321';
        display.style.background = '';
        display.style.position = 'absolute'
        display.parentElement.style.marginLeft = document.querySelector('#calculatorOutline').firstElementChild.style.marginLeft = ((window.innerWidth-300)/2) + 'px';
    }
}