setInterval(function drawmarkers() {

    /* Suppression des Divs Markers */

    var list = document.getElementById("markercontainer");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    /* Tracage des Divs Markers */

    for (i = 0; i < marker.length; i++) {


        var markerdiv = document.createElement('div');
        markerdiv.className = "markerdiv";
        markerdiv.style.backgroundColor = marker[i].bcolor;
        markerdiv.innerHTML = marker[i].buttonname + Math.round(marker[i].relativetime);
        c.appendChild(markerdiv);
        markerdiv.style.top = (g.height / 2) - ((window.innerWidth * 0.03) / 2); /* Placing the Div on the timeline */
        markerdiv.style.left = (marker[i].relativetime * (g.width - (window.innerWidth * 0.03))) / timer;

        console.log("runs once!");
        /*marker[i] = 0;*/
    }
    
/* Markers Refresh Rate */
    
}, 10);