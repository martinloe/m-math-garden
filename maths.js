var answer = 5;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;
    answer = n1 + n2;

}

function checkAnswer() {
    const prediction = predictImage();
    console.log(`answer: ${answer}, prediction: ${prediction}`);
    
    if (answer == prediction) {
        score = Math.max(score+1,0);
        console.log(`Correct! Score: ${score}`);
        if (score <= 6) {
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        } else {
            alert('Well done! Your math garden is in full bloom! Want to start again?');
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages;
        }
        
    } else {
        alert(`Wrong! Score: ${score}`);
        score = Math.min(Math.max(score-1,0),6);
        console.log(`Wrong! Score: ${score}`);
        backgroundImages.pop();
        setTimeout(function () {
            document.body.style.backgroundImage = backgroundImages
        },500);
    }
}