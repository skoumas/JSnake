/*!
 * jSnake JavaScript Library v1.0.0
 * http://www.skoumas.com.com/
 *
 * Copyright 2014 George Papanikolaou
 * Released under the MIT license
 *
 * Date: 2014-12-26T08:00Z
 */

(function ($) {

    $.fn.JSnake = function (options)
    {

        var parent = $(this);
        var ctx;
        var game_loop;
        var score = 0;
        var pause = false;
        var snake = [];
        var food;
        var drawedClicktoPlay = false;
        var startScreen = false;
        var gameovers = 0;

        var settings = $.extend({
            width: 450,
            height: 450,
            //fullScreen: false, //to be implemented in the future
            direction: "right",
            gameSpeed: 50,
            startingScore: 0,
            eatSelf: true,
            walls: false,
            snakeLength: 5,
            sound: true,
            pause:false,
            showScore: false,
            showStart: true,
            renderPause:true,
            wallWidth:1,
            font:"Century Gothic, Arial",
            resolution: 50,
            showLine: true,
            glow: 0,
            keyboard: true,
            onStart:null,
            onStartScreen:null,
            onLoop:null,
            onPause:null,
            onScore:null,
            onEatSelf:null,
            onHitWall:null,
            onGameOver:null,
            startPosition: ({
                x: 0,
                y: 0
            }),
            colors: ({
                back: "#ffffff",
                snake: "#000000",
                food: "#000000",
                text: "#000000",
                wall: "#000000"
            }) 
           
        }, options);


        var direction = settings.direction;
        var area = {x:0,y:0,w:settings.width,h:settings.height};
        var canvas = $('<canvas/>');
       
        
        pause = settings.pause;

        if (settings.sound) {
            var actx = window.AudioContext || window.webkitAudioContext;
            var actx = new AudioContext();
        }
 

        //if (!(settings.fullScreen)) {

        parent.css({
            "width": settings.width +  "px",
            "height": settings.height + "px",
            "user-select": "none",
            "-o-user-select": "none",
            "-moz-user-select": "none",
            "-khtml-user-select": "none",
            "-webkit-user-select": "none"
        });

        parent.width = settings.width;
        parent.height = settings.height;
        canvas.width = settings.width;
        canvas.height = settings.height;
        canvas.attr("width", settings.width);
        canvas.attr("height", settings.height);
        canvas.appendTo(parent);

        if (settings.wallWidth!=0)
             area = {x:settings.wallWidth,y:settings.wallWidth,w:settings.width  - (settings.wallWidth*2),h:settings.height - (settings.wallWidth*2)};

 
        /*} else {
            $("body").css({
                "margin": "0px",
                "padding": "0px",
                "overflow": "hidden"
            });
            settings.width = document.body.clientWidth;
            settings.height = document.body.clientHeight;
            parent.width = settings.width;
            parent.height = settings.height;
            canvas.attr("width", settings.width);
            canvas.attr("height", settings.height);
            canvas.appendTo($("body"));
        }*/


        var textSize = parseInt(settings.width / 20);
        var cell = area.w / settings.resolution;
        var fontSize = (settings.width)/20;
        ctx = canvas[0].getContext('2d');
        init();


        function drawWalls()
        {
            if (settings.wallWidth>0)
            {
                ctx.beginPath();
                ctx.lineWidth=settings.wallWidth;
                ctx.strokeStyle=settings.colors.wall;
                ctx.rect(settings.wallWidth/2,settings.wallWidth/2,settings.width-(settings.wallWidth ),settings.height-(settings.wallWidth));
                ctx.stroke();
            }
        }

        function init()
        {

            score = 0;
            direction = "right";
            create_snake();
            getFood();
            drawBackground();
            draw_snake();
            onScore();
            drawCell(food.x, food.y, settings.colors.food);
            drawWalls();

            if (gameovers == 0 && settings.showStart )
                start();
            else 
                if (!pause) start_loop();
            

        }

        /*
        function drawPixelatedBackground()
        {
        	var res = 60;
        	for (var x=0; x< res;x++ )
        	{ 
        		for (var y=0;y< res;y++)
        		{
        			if ( ( (x%2==0) && (y%2==1)  ) || (x%2==1) && (y%2==0) ) 
        			{
        				nx = x * (settings.width/res);
        				ny = y * (settings.width/res);
        				ctx.fillStyle= settings.colors.snakeFill;
        				ctx.fillRect(nx,ny,   (settings.width/res),     (settings.height/res) );
        			}
        		}
        	}
        }
        */


        function start()
        {

            startScreen = true;

            ctx.globalAlpha = 0.7;

            ctx.globalCompositeOperation = "multiply";
            ctx.fillStyle = settings.colors.back;
            ctx.fillRect(0, 0, settings.width, settings.height);

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            ctx.fillStyle = settings.colors.text;
            ctx.font = fontSize + "px " + settings.font;
            ctx.textAlign = "center";
            ctx.fillText("CLICK TO START", (settings.width / 2), (settings.height / 2));

            pause = true;
            onStartScreen();
        }


        function start_loop()
        {
            pause = false;
            startScreen = false;

            loop();
            beep();
            drawWalls();
            onStart();

            if (typeof game_loop != "undefined") clearInterval(game_loop);
            game_loop = setInterval(loop, settings.gameSpeed);
        }

        function start_pause()
        {
            drawedClicktoPlay = false;
            pause = !(pause);
            onPause();

            if(settings.renderPause)
            {
                ctx.globalAlpha = 0.7;
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = settings.colors.back;
                ctx.fillRect(0, 0, settings.width, settings.height);

                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.fillStyle = settings.colors.text;
                ctx.font = fontSize + "px " + settings.font;
                ctx.textAlign = "center";
                ctx.fillText("PAUSED", (settings.width / 2), (settings.height / 2));
            }

            drawWalls();
        }

        function create_snake()
        {
            snake.length = 0;

            for (i = settings.snakeLength - 1; i >= 0; i--)
                
                snake.push({
                    x: i + settings.startPosition.x,
                    y: settings.startPosition.y
                });

        }

        function drawBackground()
        {
            ctx.shadowBlur=0;
            ctx.fillStyle = settings.colors.back;

            ctx.fillRect( area.x,area.y,area.w,area.h);  
        }

        function getFood()
        {

            do {
                food = {
                    x: parseInt(Math.round(Math.random() * (area.w - cell) / cell)),
                    y: parseInt(Math.round(Math.random() * (area.h - cell) / cell)),
                };
            } while (checkCollision(food.x, food.y, snake));

        }

        // The main loop of our game
        function loop()
        {

            if (pause) return 0;
            
            drawBackground();

            //Take the last item from the array -thus the tail
            var lastC = snake.pop();

            //Get the head Position
            var nx = snake[0].x;
            var ny = snake[0].y;

            //Get the next position based on direction
            if (direction == "right") nx++;
            else if (direction == "left") nx--;
            else if (direction == "up") ny--;
            else if (direction == "down") ny++;


            //Is the head touching any other part of the snake 
            if (settings.eatSelf && checkCollision(nx, ny, snake))
            {
                gameOver();
                onEatSelf(); //Call the user method if specified
                return;
            }

            //Is the future position containing a food? Yummy...
            if ((nx == food.x) && (ny == food.y))
            {
                beep(880);
                score++;

                //Push the new item into the snake after taking in considaration 
                //the snake's direction
                snake.push({x: nx, y: ny});
                onScore();
                getFood();
            }

            //We have walls?
            if (settings.walls)
            {
                //If yes then consider them and throw an error when apropriate...
                if ((nx == -1) || (ny == -1) || (nx >= area.w / cell) || (ny >= area.h / cell)) {
                    gameOver();
                    onHitWall();
                    return;
                }
            }
            else
            {
                //No walls? Show the snake into the other side of the screen...
                if (nx < 0) nx = parseInt((area.w / cell) - 1);
                if (ny <= -1) ny = parseInt((area.h / cell) - 1);
                if (nx >= area.w / cell) nx = 0;
                if (ny >= area.h / cell) ny = 0;
            }

            //Move the last element into the new position
            lastC.x = nx;
            lastC.y = ny;

            //Delete the last element and put it in front;
            snake.unshift(lastC);

            draw_snake();
            draw_Score();

            drawCell(food.x, food.y, settings.colors.food);

            onLoop(); //Call the User Funcing
        }


        function draw_Score()
        {
            sp = settings.scorePosition;
            spc = {x:0,y:0};

            if (sp=="tl")
                 spc = {x:0,y:0};
            else if (sp=="tc")
                 spc = {x:area.w/2,y:0};
            else if (sp=="tr")
                 spc = {x:area.w,y:0};
            else if (sp=="mr")
                 spc = {x:area.w,y:area.h/2};
            else if (sp=="mc" || sp=="c")
                 spc = {x:area.w/2,y:area.h/2};
            else if (sp=="ml")
                 spc = {x:0,y:area.h/2};
            else if (sp=="bl")
                 spc = {x:area.w,y:area.h};
            else if (sp=="bc")
                 spc = {x:area.w/2,y:0};
            else if (sp=="br")
                 spc = {x:area.w,y:area.h};

            if (settings.showScore)
            {
                ctx.font = fontSize + "px bold " + settings.font;
                ctx.fillColor = settings.colors.snakeFill;
                ctx.fillText(score, spc.x + (cell*2), spc.y+ (cell*2));
            }
        }

        function checkCollision(x, y, array)
        {
            //Check is the current x and y values match any value of the array provided.
            //If yes - Collision....
            for (var i = 0; i < array.length; i++) 
                if ((array[i].x == x) && (array[i].y == y)) return 1;
            
            return 0;
        }

        function draw_snake()
        {
            for (var i = 0; i < snake.length; i++)
            {
                drawCell(snake[i].x,
                snake[i].y,
                settings.colors.snake,
                settings.colors.snake,
                settings.colors.snake)
            }
        }

        function drawCell(x, y, fillColor, strokeColor, shadowColor)
        {
            if (settings.glow)
            {
                ctx.shadowColor = fillColor;
                ctx.shadowBlur = settings.glow;
            }

            ctx.fillStyle = fillColor;
            ctx.fillRect(area.x +(x* cell), area.y  +(y* cell), cell, cell);
            ctx.shadowBlur=0;
        }

        function beep(frequency)
        {
            frequency = frequency != "" ? frequency : 440;
            frequency = frequency != undefined ? frequency : 440;

            if (settings.sound)
            {
                var osc = actx.createOscillator();  
                if (!osc) return;
                gain = actx.createGain();
                gain.gain.value = 0.3;
                osc.type = 'sine';
                osc.frequency.value = frequency;
                osc.connect(gain);
                gain.connect(actx.destination);
                currentTime = actx.currentTime;
                osc.start(currentTime);
                osc.stop(currentTime + 0.1);
            }
        };

        function gameOver()
        {
            gameovers++;
            init();
            onGameOver();
        }

        /*
        if (settings.fullScreen) {
            $(window).resize(function (e) {
                settings.width = document.body.clientWidth;
                settings.height = document.body.clientHeight;
                canvas.attr("width", settings.width);
                canvas.attr("height", settings.height);
                var cell = settings.width / settings.resolution;
                parent.width = settings.width;
                parent.height = settings.height;
            });
        }
        */

        if (settings.keyboard)
        {
            $(document).keydown(function (e)
            {
                if (!pause)
                {
                    if (e.which == "39" && direction != "left") {direction = "right";e.preventDefault();}
                    else if (e.which == "37" && direction != "right") {direction = "left";e.preventDefault();}
                    else if (e.which == "38" && direction != "down") {direction = "up";e.preventDefault();}
                    else if (e.which == "40" && direction != "up") {direction = "down";e.preventDefault();}
                }
                //if (e.which == "32") start_pause();
            });
        }

        parent.click(function (e)
        {
            e.preventDefault();
            if (typeof game_loop != "undefined") start_pause();
            else start_loop();
        });

        parent.mouseenter(function (e)
        {
            if (pause && !drawedClicktoPlay && !startScreen)
            {
                ctx.fillStyle = settings.colors.text;
                ctx.font = fontSize + "px " + settings.font;
                ctx.textAlign = "center";
                ctx.fillText("CLICK TO PLAY", (settings.width / 2), (settings.height / 2) + textSize);
                drawedClicktoPlay = true;
            }
        });

        parent.mouseout(function (e)
        {
            if (!pause) start_pause();
        });


        // Internal functions
        function onStart()
        { 
            if (typeof settings.onStart === "function") 
                window[settings.onStart]();
        }
        function onStartScreen()
        { 
            if (typeof settings.onStartScreen === "function") 
                window[settings.onStartScreen]();
        }
        function onPause()
        {
            if (typeof settings.onStart === "function") 
                window[settings.onPause]();
        }
         
        function onLoop()
        { 
            if (typeof settings.onLoop === "function") 
                window[settings.onLoop]();
        }
        function onScore()
        {
            if (typeof settings.onScore === "function") 
                window[settings.onScore](score);   
        }
        function onEatSelf()
        {
            if (typeof settings.onEatSelf === "function") 
                window[settings.onEatSelf](score,gameovers);
        }
        function onHitWall()
        {  
            if (typeof settings.onHitWall === "function") 
                window[settings.onHitWall](score,gameovers);
        }
        function onGameOver()
        {  
            if (typeof settings.onGameOver === "function") 
                window[settings.onGameOver](score,gameovers);
        }
        

        //Public Functions
        return{
            onScore:function(f)
            {
                settings.onScore = f;
            },
            togglePause:function()
            {
             if (!pause)
                    start_pause();
                else
                    start_loop();
            },
            setDirection:function(d)
            {
                if (d=="right" || d=="left" || d=="up" || d=="down")
                    direction = newdirection;
            },
            getScore:function()
            {
                return score;
            },
            beep:function()
            {
                sc = settings.sound;
                settings.sound = true;
                beep();
                settings.sound = sc;
                return;
            }

        };     

}
}(jQuery));