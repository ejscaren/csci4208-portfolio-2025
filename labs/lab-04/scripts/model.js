const passcode = Math.floor( Math.random()*1000 );
let tries = 10;
const guess = new Guess();
let timeLeft = 30;
let gameover = false;
let then = Date.now();

function main(){
const now = Date.now();
if (gameover){
return;
}
else if (timeLeft <= 0){
printGameOver('LOSE');
}
else if (now - then > 1000){
timeLeft--;
printDigits();
printAttemptsRemaining();
then = Date.now();
}
requestAnimationFrame(main);
}

main();


function guessNumber(guess){
tries--;
if ( guess == passcode ){
gameover = true;
printGameOver('WIN');
}
else{
giveClue(guess);
}
}


function giveClue(guess){
if (guess > passcode){
printClue('HI', guess);
}
else{
printClue('LO', guess);
}
}
