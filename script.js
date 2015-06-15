$('a').click(function()
{
    $('html, body').animate({
    scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
    }, 500);
    return false;
});

nokia = ({
    back: "#bcc700",snake: "#6f6005",food: "#6f6005", 
    text: "#6f6005",wall: "#6f6005"
});

orangy = ({
    back: "#f6f6ee",snake: "#8fbcdb",food: "#ff6600",
    text: "#ff6600",wall: "#6f6005"
});

darkncool = ({
    back: "#294052",snake: "#8fbcdb",food: "#f4d6bc",
    text: "#ffffff",wall: "#6f6005"
});


nokiasnake = $("#screen").JSnake({colors:nokia,pause:true,gameSpeed:100,resolution:30, wallWidth:3, width: 450,height: 290,onScore:"scored",renderPause:false,showStart:false});
 function scored(score)
{
    $("#screenScore").html(score);
    console.log("A");
}

$("#snake1").JSnake({
    walls: true,
    resolution: 30,
    showScore: true,
    showStart: true,
    colors: darkncool,
    snakeLength: 10,
    width: 270,
    height: 200,
    glow: 0 
});

$("#snake2").JSnake({
    walls: false,
    resolution: 12,
    showScore: false,
    showStart: true,
    wallWidth:0,
    colors: orangy,
    snakeLength: 5,
    width: 270,
    height: 200,
    glow: 0
});

snake_external = $("#snake_external").JSnake({
    walls: true,
    showWalls: true,
    resolution: 30,
    showScore: true,
    showStart: true,
    colors: darkncool,
    snakeLength: 10,
    width: 250,
    height: 200,
    glow: true
});

$("#phone").click(function(e) {
    $("#screen").click();
})
$("#phone").mouseenter(function(e) {
    $("#screen").mouseenter();
})
$("#phone").mouseout(function(e) {
    $("#screen").mouseout();
})

$("#beepButton").click(function(e){     
    snake_external.beep();
});

$("#scoreButton").click(function(e){    
    alert( "The score is : " + snake_external.getScore());
});

$("#togglePauseButton").click(function(e){
    snake_external.togglePause();
});