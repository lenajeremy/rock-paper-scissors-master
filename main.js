// initialising all the important variables
const displayArea = document.querySelector('.game-options');
const closeRules = document.querySelector('.icon-close');
const overlay = document.querySelector('.overlay');
const rulesDiv = document.querySelector('.rules');
const score = document.querySelector('.score-value');
const showRules = document.querySelector('.showRules');
const time = document.querySelector('.time');
const paperDiv = document.querySelector('.game-options .image-gradient.paper');
const scissorsDiv = document.querySelector('.game-options .image-gradient.scissors');
const rockDiv = document.querySelector('.game-options .image-gradient.rock');
const arrayofChoices = [rockDiv, paperDiv, scissorsDiv];

// Event listener on the closeRules image to close the rules picture when clicked
closeRules.addEventListener('click', () => {
    overlay.style.display = 'none';
    rulesDiv.style.display = 'none';
});

// Event listener of the showRules button to show the rules when clicked
showRules.addEventListener('click', () => {
    overlay.style.display = 'block';
    rulesDiv.style.display = 'block';
});
/* Adds a click event listener to all the game-options and does
a number of stuffs that would be explained in the function, so sit tight */
arrayofChoices.forEach(div => div.addEventListener('click', mainFunction))

function mainFunction(e) {
    
    // The next three lines removes the first game-options div and creates another one
    // so that the player's choices div and the bot's choices div can be appended to the new 
    // game options div
    let div = e.currentTarget;
    displayArea.remove();
    var newDisplay = document.createElement('div');
    newDisplay.setAttribute('class', 'game-options display');
    newDisplay.appendChild(div); //appends the playerChoice to the new div created
    div.setAttribute('id', 'humanChoice'); //sets the id of the choice to a certain
    //  value so that it can be referenced by some other functions
    createHeaderText(div); //A function whose functionality would be explained when find it

    document.querySelector('.game-area').appendChild(newDisplay); //appends the new game-options div 
    // to the game area which serves as contanier for all the game elements;

    let botChoice = botChooser(); //Returns a random div and serves as the bot's choice;


    //In the case whereby the botChoice and the humanChoice are the same, appending the same element 
    // to a single container would result to only one showing, so I had to clone the bot's Choice so that
    // they'd look different in the DOM but still contain the exact same elements and content;
    if (botChoice === div) {
        botChoice = botChoice.cloneNode(true);
        botChoice.querySelector('h4').remove(); //removes the header text which was added to the human Div;
    }
    setTimeout(() => {
        botChoice.setAttribute('id', 'botChoice'); //sets the id of the bot's Choice to a value
        //  so it can be used by the function on the next line
        createHeaderText(botChoice); //adds a text to the choice and shows it on the top
        newDisplay.appendChild(botChoice); //appends the botsChoice to the new game-options Div
        setTimeout(() => {
            let gameStatus = incrementScore(div, botChoice); //it does not do what the name says it does... pardon me on that
            //it just takes the bot and human choices and decides whether there's a win or a loss or a draw.
            newDisplay.insertBefore(tryagain(gameStatus), botChoice); //inserts a new set of element returned by the 'Try Again Function'
            changeScore(gameStatus); //This guy is actually responsible for the score changing on the frontEnd
            botChoice.removeEventListener('click', mainFunction);
            div.removeEventListener('click', mainFunction);
        }, 1000)
    }, 1000)

    function tryagain(gameStatus) {
        var resultsDiv = document.createElement('div');
        resultsDiv.setAttribute('class', 'sampletext');
        let header = document.createElement('h1');
        let button = document.createElement('button');
        button.textContent = 'try again';
        resultsDiv.appendChild(header);
        resultsDiv.appendChild(button);
        button.addEventListener('click', () => { //event listeneer on the button
            //when the button is clicked, it first of all removes the new-game-options DIV : line 77
            const secondDisplay = document.querySelector('.game-options.display');
            secondDisplay.remove();
            div.querySelector('h4').remove();
            botChoice.querySelector('h4').remove();
            // then also removes the header which was appended by the createHeaderText() function;

            displayArea.appendChild(div); //appends the human Choice to the former game-options
            if (!comparison(div, botChoice)) {
                displayArea.appendChild(botChoice);
            };
            botChoice.addEventListener('click', mainFunction);
            div.addEventListener('click', mainFunction);
            //appends the botChoice also, if the botChoice is not the same or is not a clone of the human Choice,
            //the comparison() function is just a witty way of finding whether or not the human choice and the bot choice
            //are the same or not
            document.querySelector('.game-area').appendChild(displayArea);
            //then append the old game-options to the game-area
        })
        //checks the game status from above and does some simple stuffs
        if (gameStatus === 'win') {
            header.textContent = 'YOU WIN';
            button.style.color = 'green';
        } else if (gameStatus === 'loss') {
            header.textContent = 'YOU LOSE';
            button.style.color = 'red';
        } else {
            header.textContent = 'YOU DREW';
        }
        return resultsDiv; //returns the resultDiv which contains the buttons  and the header text;
    }
}

function comparison(div, botChoice) {
    //This function just compares the srcs of the image of the human and the botChoices,
    //if they are the same, then it means the elements are the same;
    if (div.querySelector('img').src === botChoice.querySelector('img').src) {
        return true;
    }
    //NOTE: I did not use the === operator because the elements were cloned and the DOM now sees them 
    //as different elements and can be in no wise equal using the === operator
}

function createHeaderText(player) {
    //takes in a player and adds a header to the player's DIV based on the id of the Player
    var headerText = document.createElement('h4');
    headerText.setAttribute('class', 'result')
    if (player.id === 'humanChoice') {
        headerText.textContent = 'YOU PICKED';
    } else if (player.id === 'botChoice') {
        headerText.textContent = 'THE HOUSE PICKED';
    }
    player.appendChild(headerText);
}

function botChooser() {
    return arrayofChoices[Math.floor(Math.random() * arrayofChoices.length)];
    //returns a random element from the arrayofChoices array;
}

function incrementScore(humanChoice, botChoice) {
    //this is where the login for win or loss or draw is, takes in the human Choice and the bot Choice,
    //and then decides whether the gamestatus is a win, loss or draw
    let gameStatus;
    if (comparison(humanChoice, botChoice)) {
        gameStatus = 'draw';
    } else if (humanChoice.classList.contains('scissors') && botChoice.classList.contains('paper')) {
        gameStatus = 'win';
    } else if (humanChoice.classList.contains('paper') && botChoice.classList.contains('rock')) {
        gameStatus = 'win';
    } else if (humanChoice.classList.contains('rock') && botChoice.classList.contains('scissors')) {
        gameStatus = 'win'
    } else {
        gameStatus = 'loss'
    }
    return gameStatus;
}

function changeScore(gameStatus) {
    // Changes the score on the frontEnd;
    if (gameStatus === 'win') {
        score.textContent = Number(score.textContent) + 1;
    } else if (gameStatus === 'loss') {
        if (Number(score.textContent) !== 0) {
            score.textContent = Number(score.textContent) - 1;
        }
    }
    if(score.textContent === '2'){
        if(time.textContent !== '0:00'){
            confetti.start();
            clearInterval()
            time.textContent = '0:00'
        }
}}
function timer() {
    let timeInSeconds = 5 * 60;
    setInterval(() => {
        timeInSeconds -= 1;
        let minutes, seconds
        console.log('hello');
        minutes = Math.floor(timeInSeconds / 60);
        seconds = (timeInSeconds % 60);
        if (seconds < 10) {
            seconds = seconds.toString().padStart(2, '0');
        }
        time.textContent = `${minutes}:${seconds}`;
        if (minutes === 3) {
            time.style.color = 'red';
        }
    }, 1000)
}
timer();
/***************************************/
//THANKS FOR COMING THIS FAR, I HOPE YOU UNDERSTOOD, IT A SIMPLE STUFF THOUGH
//PLEASE TELL ME IF THERE'S A WAY I CAN IMPROVE OR IF THERE'S A FLAW SOMEWHERE
/************************************/