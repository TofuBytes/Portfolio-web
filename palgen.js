
//default palette
let pal_colors = ["#9cddbf", "#67a68a", "#edbb99", "#9cadbc", "#d6f4ff"];
var current_color = pal_colors[0];
var cur_brush = 1; 
const rows = 25;
const columns = 25;
const cell_size = 20; // 20x20 grid
var eraser = false;


function setColors() {
    var color1 = pal_colors[0]
    document.getElementById("input1").value = color1;
    document.getElementById("pal1").style.backgroundColor = color1;
    document.getElementById("c1").style.color = color1;
    
    
    var color2 = pal_colors[1]
    document.getElementById("input2").value = color2;
    document.getElementById("pal2").style.backgroundColor = color2;
    document.getElementById("c2").style.color = color2;

    
    var color3 = pal_colors[2]
    document.getElementById("input3").value = color3;
    document.getElementById("pal3").style.backgroundColor = color3;
    document.getElementById("c3").style.color = color3;

    
    var color4 = pal_colors[3]
    document.getElementById("input4").value = color4;
    document.getElementById("pal4").style.backgroundColor = color4;
    document.getElementById("c4").style.color = color4;

    
    var color5 = pal_colors[4]
    document.getElementById("input5").value = color5;
    document.getElementById("pal5").style.backgroundColor = color5;
    document.getElementById("c5").style.color = color5;

}


function onBrew() {
    clickedColor = document.getElementById("colorpicker").value;
    //alert(document.getElementById("colorpicker"));
    pal_colors[0] = clickedColor;
    var rgb = hexTorgb(clickedColor);
    //alert(rgb);
    callApi(rgb)

    setBrush(1);
}


function hexTorgb(hex) {
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}


function callApi(rgb) {
    var url = "http://colormind.io/api/";
    var data = {
        model : "default",
        input : [rgb,"N","N","N","N","N"]
    }

    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            result = JSON.parse(http.responseText).result;
            for (var x = 1; x < result.length; x++){
                pal_colors[x] = rgbtoHex(result[x][0], result[x][1], result[x][2])
            }
            setColors()
        }
    }

    http.open("POST", url, true);
    http.send(JSON.stringify(data));
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbtoHex(r,g,b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);    
}

function copyColor(title) {
    // Get the text field
    var copyText = document.getElementById(title);
    // Select the text field
    copyText.select();  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //alert("Copied the text: " + copyText.value);
}

function setBrush(c) {

    current_color = pal_colors[c - 1]
    document.getElementById("c" + cur_brush).style.outlineStyle = 'none';
    document.getElementById("c" + c).style.outlineStyle = 'solid';
    cur_brush = c; 

    eraser = false;
    document.getElementById('erase').style.outlineStyle = 'none';

}

function setEraser() {
    eraser = true;
    document.getElementById('erase').style.outlineStyle = 'solid';
    document.getElementById("c" + cur_brush).style.outlineStyle = 'none';

}


document.getElementById('reset').addEventListener('click', function(e) {
    document.querySelectorAll('.pixel').forEach(function(item) {
        item.setAttribute('data-color', null)
        item.style.background = '#ffffff';
    });
});

////////
let config = {
    width: 20,
    height: 20,
    color: current_color,
    drawing: true,
    eraser: eraser
}

let events = {
    mousedown: false
}


document.getElementById('pixel-art-area').style.width = `calc(${(1.75 * config.width)}rem + ${(config.height * 2)}px)`;
document.getElementById('pixel-art-area').style.height = `calc(${(1.75 * config.height)}rem + ${(config.width * 2)}px)`;

function createGrid() {
    for (let i = 0; i < config.width; i++) {
        for (let j = 0; j < config.height; ++j) {
            let createEl = document.createElement('div');
            createEl.classList.add('pixel');
            document.getElementById('pixel-art-area').appendChild(createEl);
        }
    }
}


createGrid();

document.querySelectorAll('.pixel').forEach(function(item) {
    item.addEventListener('pointerdown', function(e) {
        if(eraser === true) {
            item.setAttribute('data-color', null);
            item.style.background = '#ffffff';
        } else {
            item.setAttribute('data-color', current_color);
            item.style.background = current_color;
        }
        events.mousedown = true;
    });
});

document.getElementById('pixel-art-area').addEventListener('pointermove', function(e) {
    if(config.drawing === true && events.mousedown === true || config.eraser === true && events.mousedown === true) {
        if(e.target.matches('.pixel')) {
            if(eraser === true) {
                e.target.setAttribute('data-color', null);
                e.target.style.background = '#ffffff';
            } else {
                e.target.setAttribute('data-color', current_color);
                e.target.style.background = current_color;
            }
        }
    }
});



document.body.addEventListener('pointerup', function(e) {
    events.mousedown = false;
});



/////