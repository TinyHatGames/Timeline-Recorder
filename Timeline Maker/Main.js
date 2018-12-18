/* Declaration des variables globales */

var timer = 0;
var offsetlines = [];
var lines = [];
var marker = [];
var bc = document.getElementById('buttoncontainer');
var c = document.getElementById('markercontainer');
var g = document.getElementById('graph');
var minig = document.getElementById('minigraph');
var palette = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c"];
var currentbuttoncolor = 0;

function tracegraph() {

    var button = document.getElementsByClassName("button");
    var containerHeight = document.getElementById('secondary').clientHeight;
    var containerWidth = document.getElementById('secondary').clientWidth;
    g.width = containerWidth;
    g.height = containerHeight;
    minig.width = containerWidth;
    minig.height = containerHeight / 4;

    /* Tracage */

    /* Lignes d'Event */



    for (i = 0; i < button.length; i++) {

        var currentbuttoncolor = button[i].childNodes[1].style.backgroundColor;
        var offset = i * (0.02 * window.innerHeight);
        var markerzoneposition = (g.height / 2) - ((button.length * (0.02 * window.innerHeight)) / 2);
        var ctx = g.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(0, markerzoneposition + offset);
        ctx.lineTo(g.width, markerzoneposition + offset);
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = currentbuttoncolor;
        ctx.lineWidth = 2;
        ctx.stroke();

        offsetlines[i] = markerzoneposition + offset;

    }

    /* Ligne Emojis */

    var emojilineyposition = g.height - (0.03 * window.innerHeight);
    var ctx = g.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(0, emojilineyposition);
    ctx.lineTo(g.width, emojilineyposition);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "lightgrey";
    ctx.setLineDash([7, 5]);
    ctx.lineWidth = 3;
    ctx.stroke();

}

var timerinterval = 0;
var timerstarted = 0;
var timerstartstop;

function clicktimer() {

    var playbuttontext = document.getElementById('playbuttontxt').textContent;
    console.log(playbuttontext);

    if (playbuttontext == "►") {

        start();
        timerinterval = 1;
        document.getElementById('playbuttontxt').textContent = "■";

    } else if (playbuttontext == "■") {

        stop();
        timerinterval = -1;
        document.getElementById('playbuttontxt').textContent = "►";
    }

    function start() {

        var playbuttontext = document.getElementById('playbuttontxt').textContent;
        timerstartstop = setInterval(timerplay, 10);
        timerstarted = 1;

    }

    function stop() {

        clearInterval(timerstartstop);

    }

    function timerplay() {

        /* We calculate each part of the timer, minutes, seconds, and millisec, then format them so they have only two digits with added 0 */

        seconds = Math.floor(timer);
        milliseconds = Math.round(timer * 1000);
        minutes = Math.floor(timer / 60);

        millisecondstr = ((milliseconds - (seconds * 1000)) / 10);
        millisecondstr2 = millisecondstr.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        secondstr = (seconds - (minutes * 60));
        secondstr2 = secondstr.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        minutestr = minutes.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });

        /* We display each part separated by : */

        document.getElementById("timerobject").innerHTML = minutestr + ":" + secondstr2 + ":" + millisecondstr2;

        /* We add a millisec to the timer */

        timer += timerinterval * 0.01;
    }

}

function createmarker() {

    var content = this.parentElement.parentElement.innerText;
    lastmarkerindex = 0;
    
    for(i = 0; i < marker.length;i++){
        
        if(marker[i].buttonname === content){
            
            lastmarkerindex = i;
            
        }
        
    }

    console.log(lastmarkerindex);
    
    if (this.previousSibling.checked == false) {

        marker.push({
            buttonname: content,
            relativetime: timer,
            bcolor: this.style.backgroundColor,
            state: "start",
            end: 0
        });

    } else {
        
        marker[lastmarkerindex].end = timer;
        
    }

}

function create_emoji_marker() {

    var content = this.innerText;
    emojimarker.push({
        buttonname: content,
        relativetime: timer,
        bcolor: this.style.backgroundColor
    }); 

}

setInterval(function drawmarkers() {

    /* Setting Offsets */

    sliders = document.getElementsByClassName("slider");

    for (j = 0; j < sliders.length; j++) {

        for (i = 0; i < marker.length; i++) {

            if (sliders[j].parentElement.parentElement.innerText == marker[i].buttonname) {

                marker[i].offset = j * (0.02 * window.innerHeight) + (g.height / 2) - ((sliders.length * (0.02 * window.innerHeight)) / 2);

            }
        }

    }

    /* Defining button */

    var button = document.querySelectorAll('.button');

    /* Suppression des Divs Markers */

    var list = document.getElementById("markercontainer");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    /* Tracage des Divs Markers de type Event */

    for (i = 0; i < marker.length; i++) {

        var markerdiv = document.createElement('div');

        if (marker[i].state == "start" && marker[i].end > 0) {

            var currentmarkercolor = marker[i].bcolor;
            var currenttime = marker[i].relativetime;
            var start = marker[i].relativetime;
            var end = marker[i].end;

            /*  if (marker.bcolor == currentmarkercolor && marker.relativetime > currenttime && marker.state == "end"){

                 var end = marker.relativetime;

             }*/

            markerdiv.className = "markerdiv";
            markerdiv.style.backgroundColor = marker[i].bcolor;
            markerdiv.innerHTML = marker[i].buttonname + Math.round(marker[i].relativetime);
            c.appendChild(markerdiv);
            markerdiv.style.top = marker[i].offset; /* Placing the Div on the timeline */
            markerdiv.style.left = (marker[i].relativetime * (g.width - (window.innerWidth * 0.03))) / timer;


            markerdiv.style.width = ((end - start) / timer) * g.width;

        } else if (marker[i].state == "start" && marker[i].end == 0) {

            var start = marker[i].relativetime;
            var end = timer;

            markerdiv.className = "markerdiv";
            markerdiv.style.backgroundColor = marker[i].bcolor;
            markerdiv.innerHTML = marker[i].buttonname + Math.round(marker[i].relativetime);
            c.appendChild(markerdiv);
            /* markerdiv.style.top = (g.height / 2) - ((window.innerWidth * 0.03) / 2); */

            /* Placing the Div on the timeline */

            markerdiv.style.left = (marker[i].relativetime * (g.width - (window.innerWidth * 0.03))) / timer;


            markerdiv.style.width = ((end - start) / timer) * g.width;
            markerdiv.style.top = marker[i].offset;

        }

        console.log("runs once!");
        /*marker[i] = 0;*/
    }
    /* Markers Refresh Rate */

}, 10);

function addbutton(button) {

    /* Defining the elements */

    /* Button */
    var newbutton = document.createElement('div');
    /* Text */
    var newbuttontext = document.createElement('p');
    /* Switch */
    var newlabel = document.createElement('label');
    /* Input */
    var newinput = document.createElement('input');
    /* Slider */
    var newslider = document.createElement('div');
    /* Button */
    var newdivbutton = document.createElement('div');

    /* Assigning classes */

    newbuttontext.className = "buttontext";
    newbuttontext.innerHTML = "Event " + bc.childElementCount;
    newslider.onclick = createmarker;
    newbutton.className = "button";
    newlabel.className = "switch";
    newinput.type = "checkbox";
    newslider.className = "slider";
    newdivbutton.className = "sliderbutton";

    /* Colouring */

    newslider.style.borderColor = palette[currentbuttoncolor];
    newlabel.style.backgroundColor = palette[currentbuttoncolor];
    newslider.style.backgroundColor = palette[currentbuttoncolor];
    newdivbutton.style.backgroundColor = palette[currentbuttoncolor];

    if (currentbuttoncolor < palette.length - 1) {
        currentbuttoncolor += 1;
        console.log(currentbuttoncolor);
    } else {
        currentbuttoncolor = 0;
    }

    /* Appending */

    bc.insertBefore(newbutton, button);
    newbutton.appendChild(newbuttontext);
    newbutton.appendChild(newlabel);
    newlabel.appendChild(newinput);
    newlabel.appendChild(newslider);
    newslider.appendChild(newdivbutton);

    /* Re-drawing canvas */

    tracegraph();

}

function removebutton() {

    if (bc.lastChild) {
        bc.removeChild(bc.lastChild);
    }

    tracegraph();

}




/* 

Plan:
----

define var marker et marker.timstamp marker.relativetime marker.value au moins

draw function for each marker create X at ( marker.relativetime * canvas.width ) / timer 

marker.type peut etre puntual,continuous

button.type start(tag),stop(tag),stamp,stopwatch(clicks),etc

button.color

*/