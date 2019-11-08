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

//deletes the last character on the display (triggered by the back button)
function back() {
    display.textContent = display.textContent.substr(0, display.textContent.length-1);
}

//changes button's colors when they're clicked
function buttonClick() {
    if(this.getAttribute('data-value') != '=')
        display.textContent += this.getAttribute('data-value');
    this.style.background = '#5F6368';
    this.style.color = '#f5f5f5';
    setTimeout(resetColor, 100, this);
    setDisplayWidth();
}

//after a bit, the color will reset to normal
function resetColor(button) {
    button.style.background = '#f5f5f5';
    button.style.color = '#5F6368';
}

function parseDisplay() {
    refreshPositions();
    
    //fixes decimal points without a 0 before them
    let lastNumIndex = 0;
    for(let i = 0; i < numbers.length; i++){
        if(display.textContent.indexOf(numbers[i], lastNumIndex) == -1){
            display.textContent = display.textContent.substring(0,lastNumIndex) + '0' + display.textContent.substring(lastNumIndex,);
        }
        lastNumIndex += String(numbers[i]).length + 1;
    }
    refreshPositions();

    //performs division and multiplication on the displays string
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

    //then performs the addition and subtraction operations
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
}

//refreshes the numbers/divs/mults/pluses/minuses index positions
function refreshPositions() {
    numbers = findNumbers();
    divsAndMults = (indexOfAll(display.textContent, '*').concat(indexOfAll(display.textContent,'/'))).sort();
    plusAndMinus = (indexOfAll(display.textContent, '+').concat(indexOfAll(display.textContent, '-'))).sort();
}

//fixes up the display's string if an operation has been performed
function reconstructString(value, stringToReplace) {
    let string = display.textContent;
    let a = findNumbers();
    display.textContent = string.substring(0, string.indexOf(stringToReplace)) + value + string.substring(string.indexOf(stringToReplace)+stringToReplace.length,);
    refreshPositions();
}

//finds a number from the array numbers closest to the index supplied within the
//string supplied and the specified direction (lower than the index is preferred
//or higher than the index is preferred)
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

//finds all terms within an expression
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

//finds all indices of a string within another string
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

//Changes the look of the display based on how wide it is as well as the window's size
function setDisplayWidth() {
    display.parentElement.style.width = '300px';
    if(display.clientWidth > 300) {
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

//Keyboard support!
document.addEventListener('keydown', (event) => {
    switch(event.keyCode) {
        case 107:case 187:case 13:
            if(event.shiftKey || event.keyCode == 107) findAndClick('+')
            else findAndClick('=')
            break;
        case 104:case 56:
            if(event.keyCode==56 && event.shiftKey) findAndClick('*');
            else findAndClick('8'); 
            break;
        case 8: backButton.click();break;
        case 189:case 109:findAndClick('-');break;
        case 110:findAndClick('.');break;
        case 106:findAndClick('*');break;
        case 111:findAndClick('/');break;
        case 191: if(!event.shiftKey) findAndClick('/');break;
        case 32:findAndClick('clear');break;        
        case 96:case 48:findAndClick('0');break;
        case 97:case 49:findAndClick('1');break;
        case 98:case 50:findAndClick('2');break;
        case 99:case 51:findAndClick('3');break;
        case 100:case 52:findAndClick('4');break;
        case 101:case 53:findAndClick('5');break;
        case 102:case 54:findAndClick('6');break;
        case 103:case 55:findAndClick('7');break;        
        case 105:case 57:findAndClick('9');break;
    }
})

//helper function to find button based on data-value value
function findAndClick(value) {
    for(index in buttons) {
        if(buttons[index].dataset && buttons[index].dataset.length!=0 && buttons[index].dataset['value'] == value || buttons[index].id==value)
            buttons[index].click();
    }
}

//quick centering of the calculator on page load as well as if the window size is changed
centerCalc();
window.onresize = centerCalc;