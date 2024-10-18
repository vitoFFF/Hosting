const svg = document.getElementById('rollerSvg');
const radiusInput = document.getElementById('radiusInput');
const radiusValue = document.getElementById('radiusValue');
const dInput = document.getElementById('dInput');
const dValue = document.getElementById('dValue');
const eInput = document.getElementById('eInput');
const eValue = document.getElementById('eValue');
const nInput = document.getElementById('nInput');
const nValue = document.getElementById('nValue');
const holeSizeInput = document.getElementById('holeSizeInput');
const holeSizeValue = document.getElementById('holeSizeValue');
const equationsOutput = document.getElementById('equationsOutput');

let R = parseInt(radiusInput.value);
let d = parseInt(dInput.value);
let e = parseFloat(eInput.value);
let n = parseInt(nInput.value);
let holeSize = parseInt(holeSizeInput.value);




function zoomSvg(zoomFactor) {
    svg.style.transform = `scale(${zoomFactor})`;
    svg.style.transformOrigin = 'center'; // Ensure scaling from the center
}

// Example usage: Zoom in by a factor of 2 (adjust as needed)
zoomSvg(2.8);


function resizeSvg() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = 16 / 9; // You can adjust the aspect ratio as needed
    const padding = 10; // Adjust padding as needed

    let svgWidth, svgHeight;

    if (screenWidth / screenHeight > aspectRatio) {
        // Screen is wider, adjust SVG height
        svgHeight = screenHeight - padding * 2; // Apply padding to both top and bottom
        svgWidth = svgHeight * aspectRatio;
    } else {
        // Screen is taller or has similar aspect ratio, adjust SVG width
        svgWidth = screenWidth - padding * 2; // Apply padding to both left and right
        svgHeight = svgWidth / aspectRatio;
    }

    // Calculate the left and top positions to center the SVG horizontally and vertically
    const svgLeft = (screenWidth - svgWidth) / 2;
    const svgTop = (screenHeight - svgHeight) / 2;

    // Set the width, height, left, and top properties of the SVG container
    svg.style.width = svgWidth + 'px';
    svg.style.height = svgHeight + 'px';
    svg.style.left = svgLeft + 'px';
    svg.style.top = svgTop + 'px';

    draw(); // Redraw SVG based on new size
}


window.addEventListener('resize', resizeSvg);


function drawDashedCircle(radius) {
    const dashedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dashedCircle.setAttribute('cx', svg.width.baseVal.value / 2);
    dashedCircle.setAttribute('cy', svg.height.baseVal.value / 2);
    dashedCircle.setAttribute('r', radius);
    dashedCircle.setAttribute('fill', 'none');
    dashedCircle.setAttribute('stroke', 'gray');
    dashedCircle.setAttribute('stroke-dasharray', '5 5');
    dashedCircle.setAttribute('stroke-width', '2');
    svg.appendChild(dashedCircle);
}


function drawRotor(t) {
    const psi = -Math.atan(Math.sin((1 - n) * t) / ((R / (e * n)) - Math.cos((1 - n) * t)));
    const x = R * Math.cos(t) - d * Math.cos(t - psi) - e * Math.cos(n * t) + e;
    const y = -R * Math.sin(t) + d * Math.sin(t - psi) + e * Math.sin(n * t);
    return `${x + svg.width.baseVal.value / 2},${y + svg.height.baseVal.value / 2}`;
}

//???
function drawRoller(x, y) {
    const roller = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    roller.setAttribute('cx', x + svg.width.baseVal.value / 2);
    roller.setAttribute('cy', y + svg.height.baseVal.value / 2);
    roller.setAttribute('r', d);
    roller.setAttribute('fill', 'white');
    roller.setAttribute('stroke', 'red');
    roller.setAttribute('stroke-width', '0');
    svg.appendChild(roller);
}




//output holes
function rollerPinsCircle(cx, cy, radius, parentGroup) {
    const pinRadius = holeSize - (2 * e); // Use the selected hole size
    const holeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    holeCircle.setAttribute('cx', cx);
    holeCircle.setAttribute('cy', cy);
    holeCircle.setAttribute('r', pinRadius);
    holeCircle.setAttribute('fill', '#212d40');
    holeCircle.setAttribute('stroke', 'none');
    holeCircle.setAttribute('stroke-width', '0');
    parentGroup.appendChild(holeCircle);
}


function drawHoleCircle(cx, cy, radius) {
    const holeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    holeCircle.setAttribute('cx', cx);
    holeCircle.setAttribute('cy', cy);
    holeCircle.setAttribute('r', radius);
    holeCircle.setAttribute('fill', '#676469');
    holeCircle.setAttribute('stroke', 'white');
    holeCircle.setAttribute('stroke-width', '2');
    svg.appendChild(holeCircle);
}

//yellow circle
function drawCentralCircle(parentGroup) {
    const centralCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const centerX = svg.width.baseVal.value / 2; // Center X
    const centerY = svg.height.baseVal.value / 2; // Center Y

    centralCircle.setAttribute('cx', centerX);
    centralCircle.setAttribute('cy', centerY);
    centralCircle.setAttribute('r', 2.5); // Radius of the circle
    centralCircle.setAttribute('fill', '#FFD700'); // Gold color fill
    centralCircle.setAttribute('stroke', '#000'); // Black stroke
    centralCircle.setAttribute('stroke-width', '1');
    parentGroup.appendChild(centralCircle);

    // Return the center coordinates of the central circle
    return { x: centerX, y: centerY };
}

function drawConnectingLine(fromX, fromY, toX, toY, parentGroup) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('stroke', 'orange');
    line.setAttribute('stroke-width', '2');
    parentGroup.appendChild(line);
}



function draw() {
    svg.innerHTML = '';
    //createGridPattern();
    
    // Group for graphics
    const graphicsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    graphicsGroup.setAttribute('transform', 'translate(-150, 0)'); // Move elements to the left

    drawDashedCircle(R, graphicsGroup);
 

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('fill', 'orange');//#f72585
    path.setAttribute('stroke', 'blue');
    path.setAttribute('stroke-width', '0');
    path.setAttribute('d', `M${drawRotor(0)} ${Array.from({ length: Math.ceil(2 * Math.PI / 0.01) }, (_, i) => drawRotor(i * 0.01)).join(' ')}`);
    graphicsGroup.appendChild(path);

    for (let k = 1; k <= n; k++) {
        const angle = (2 * Math.PI / n) * k;
        const rollerX = R * Math.cos(angle);
        const rollerY = R * Math.sin(angle);
        drawRoller(rollerX, rollerY, graphicsGroup);
    }

    drawHole(graphicsGroup);
    drawOutHole(graphicsGroup); // Draw holes around the center hole
    rollerPins(graphicsGroup);




    const centralCircleCoords = drawCentralCircle(graphicsGroup); // Draw the central circle and get its coordinates
    const holeCoords = drawHole(graphicsGroup); // Draw the hole and get its center coordinates

    // Draw a connecting line between the central circle and the hole
    drawConnectingLine(centralCircleCoords.x, centralCircleCoords.y, holeCoords.x, holeCoords.y, graphicsGroup);


        // Draw the central circle after all other elements
        drawCentralCircle(graphicsGroup);


    svg.appendChild(graphicsGroup);
}

function drawDashedCircle(radius, parentGroup) {
    const dashedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dashedCircle.setAttribute('cx', svg.width.baseVal.value / 2);
    dashedCircle.setAttribute('cy', svg.height.baseVal.value / 2);
    dashedCircle.setAttribute('r', radius);
    dashedCircle.setAttribute('fill', 'none');
    dashedCircle.setAttribute('stroke', 'gray');
    dashedCircle.setAttribute('stroke-dasharray', '5 5');
    dashedCircle.setAttribute('stroke-width', '2');
    parentGroup.appendChild(dashedCircle);
}

function drawRoller(x, y, parentGroup) {
    const roller = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    roller.setAttribute('cx', x + svg.width.baseVal.value / 2);
    roller.setAttribute('cy', y + svg.height.baseVal.value / 2);
    roller.setAttribute('r', d);
    roller.setAttribute('fill', 'cyan');
    roller.setAttribute('stroke', 'red');
    roller.setAttribute('stroke-width', '0');
    parentGroup.appendChild(roller);
}








// Central Hole
function drawHole(parentGroup) {
    const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const centerX = svg.width.baseVal.value / 2 + e; // Adjusted for eccentricity
    const centerY = svg.height.baseVal.value / 2;

    // Get the current value from the holeSize slider
    const centralHoleSize = parseInt(document.getElementById('holeSize').value);

    hole.setAttribute('cx', centerX);
    hole.setAttribute('cy', centerY);
    hole.setAttribute('r', centralHoleSize);
    hole.setAttribute('fill', '#8657a5');
    hole.setAttribute('stroke', 'white');
    hole.setAttribute('stroke-width', '0');
    parentGroup.appendChild(hole);

    // Return the center coordinates of the hole
    return { x: centerX, y: centerY };
}




// Event listener for the central hole size slider
document.getElementById('holeSize').addEventListener('input', function() {
    const centralHoleSizeValue = document.getElementById('centralholeSizeValue');
    centralHoleSizeValue.textContent = this.value;
    draw(); // Redraw the SVG with the new hole size
});

// Make sure to call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... (other initialization code)
    
    // Initialize the central hole size value
    const holeSizeSlider = document.getElementById('holeSize');
    const centralHoleSizeValue = document.getElementById('centralholeSizeValue');
    centralHoleSizeValue.textContent = holeSizeSlider.value;
    
    draw(); // Initial draw of the SVG
});












let outputHoleRadius = 64; // Default value, you can adjust this

//wgite circle
function drawOutHole(parentGroup) {
    const numHoles = 6; // Number of holes around the center hole
    const holeRadius = holeSize; // Use the selected hole size
    const eccentricity = e; // Eccentricity value

    for (let i = 0; i < numHoles; i++) {
        const angle = (2 * Math.PI / numHoles) * i;
        const holeX = svg.width.baseVal.value / 2 + outputHoleRadius* Math.cos(angle) + eccentricity; // Add some space between the center and output holes
        const holeY = svg.height.baseVal.value / 2 + outputHoleRadius * Math.sin(angle); // Add some space between the center and output holes
        drawHoleCircle(holeX, holeY, holeRadius, parentGroup);
    }
}


// Function to draw a hole circle radius
function rollerPins(parentGroup) {
    const numHoles = 6; // Number of holes around the center hole
    const pinRadius = holeSize - (2 * e); // Use the selected hole size
    const eccentricity = e; // Eccentricity value

    for (let i = 0; i < numHoles; i++) {
        const angle = (2 * Math.PI / numHoles) * i;
        const holeX = svg.width.baseVal.value / 2 + outputHoleRadius * Math.cos(angle) - eccentricity; // Add some space between the center and output holes
        const holeY = svg.height.baseVal.value / 2 + outputHoleRadius * Math.sin(angle); // Add some space between the center and output holes
        rollerPinsCircle(holeX, holeY, pinRadius, parentGroup);
    }
}














function drawHoleCircle(cx, cy, radius, parentGroup) {
    const holeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    holeCircle.setAttribute('cx', cx);
    holeCircle.setAttribute('cy', cy);
    holeCircle.setAttribute('r', radius);
    holeCircle.setAttribute('fill', '#8657a5');
    holeCircle.setAttribute('stroke', 'white');
    holeCircle.setAttribute('stroke-width', '0');
    parentGroup.appendChild(holeCircle);
}



radiusInput.addEventListener('input', () => {
    R = parseInt(radiusInput.value);
    radiusValue.textContent = R + ' mm'; // Add mm
    draw();
    printEquations();
});

dInput.addEventListener('input', () => {
    d = parseInt(dInput.value);
    dValue.textContent = d + ' mm'; // Add mm
    draw();
    printEquations();
});

eInput.addEventListener('input', () => {
    e = parseFloat(eInput.value);
    eValue.textContent = e + ' mm'; // Add mm

    // Check if the eccentricity meets the assumption e < R/n
    if (e >= R / n) {
        // If the condition is not met, adjust the eccentricity value
        e = R / n - 0.01; // Adjust the eccentricity to be slightly smaller than R/n
        eInput.value = e.toFixed(2); // Update the input field with the adjusted value
        eValue.textContent = e.toFixed(2) + ' mm'; // Update the displayed value
        alert("Eccentricity should be less than R/n. Adjusted eccentricity value.");
    }

    draw();
    printEquations();
});

nInput.addEventListener('input', () => {
    n = parseInt(nInput.value);
    nValue.textContent = n + ' mm'; // Add mm
    draw();
    printEquations();
});

holeSizeInput.addEventListener('input', () => {
    holeSize = parseInt(holeSizeInput.value);
    holeSizeValue.textContent = holeSize + ' mm'; // Add mm
    draw();
});

function printEquations() {
    equationsOutput.textContent = `
        x(t) = ${R} * cos(t) - ${d} * cos(t - psi) - ${e} * cos(${n} * t) + ${e}
        y(t) = -${R} * sin(t) + ${d} * sin(t - psi) + ${e} * sin(${n} * t)
        psi = -atan(sin((${1 - n}) * t) / (${R} / (${e} * ${n}) - cos((${1 - n}) * t)))
    `;
}

function downloadRotorSvg(svgEl, name) {
    let clonedSvg = svgEl.cloneNode(true);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', () => {
        downloadRotorSvg(document.getElementById('rollerSvg'), 'complete_design.svg');
    });
});

document.getElementById('infoButton').addEventListener('click', function() {
    alert("Information about CycloDrive...");
});

function enableDirectInput(spanElement, inputElement, min, max, step) {
    spanElement.addEventListener('dblclick', () => {
        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.min = min;
        inputField.max = max;
        inputField.step = step;
        inputField.value = parseFloat(spanElement.textContent); // Extract numeric value
        inputField.classList.add('direct-input');

        inputField.addEventListener('blur', () => {
            let newValue = parseFloat(inputField.value);
            if (isNaN(newValue) || newValue < min || newValue > max) {
                newValue = parseFloat(spanElement.textContent);
            }
            inputElement.value = newValue;
            spanElement.textContent = newValue + ' mm'; // Add mm
            updateValues(); // Ensure values are updated
            draw(); // Update the visualization with new values
            printEquations(); // Update the equations display
            spanElement.style.display = 'inline';
            inputField.remove();
        });

        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                inputField.blur();
            }
        });

        spanElement.style.display = 'none';
        spanElement.parentNode.insertBefore(inputField, spanElement.nextSibling);
        inputField.focus();
    });
}

function updateValues() {
    // Update all slider and display values
    R = parseInt(radiusInput.value);
    radiusValue.textContent = R + ' mm'; // Update displayed value

    d = parseInt(dInput.value);
    dValue.textContent = d + ' mm'; // Update displayed value

    e = parseFloat(eInput.value);
    eValue.textContent = e + ' mm'; // Update displayed value

    n = parseInt(nInput.value);
    nValue.textContent = n + ' mm'; // Update displayed value

    holeSize = parseInt(holeSizeInput.value);
    holeSizeValue.textContent = holeSize + ' mm'; // Update displayed value
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach the direct input functionality
    enableDirectInput(radiusValue, radiusInput, 50, 310, 1);
    enableDirectInput(dValue, dInput, 1, 33, 1);
    enableDirectInput(eValue, eInput, 0.1, 14, 0.1);
    enableDirectInput(nValue, nInput, 1, 20, 1);
    enableDirectInput(holeSizeValue, holeSizeInput, 10, 70, 1);

    // Initial call to set the values
    updateValues();
});


// Initial call to set the values with "mm"
updateValues();

resizeSvg();
printEquations();


















// Event listener for the central hole size slider
holeSizeInput.addEventListener('input', function() {
    holeSize = parseInt(holeSizeInput.value);
    holeSizeValue.textContent = holeSize;  // Display the current value of hole size
    draw();  // Redraw the SVG with the new hole size
});

// Also, make sure the initial drawing is done when the page loads or when inputs change
window.addEventListener('load', draw);

// Optional: You may want to update the drawing when any other input changes (radius, d, e, n, etc.)
radiusInput.addEventListener('input', function() {
    R = parseInt(radiusInput.value);
    radiusValue.textContent = R;
    draw();  // Redraw the SVG
});

dInput.addEventListener('input', function() {
    d = parseInt(dInput.value);
    dValue.textContent = d;
    draw();  // Redraw the SVG
});

eInput.addEventListener('input', function() {
    e = parseFloat(eInput.value);
    eValue.textContent = e;
    draw();  // Redraw the SVG
});

nInput.addEventListener('input', function() {
    n = parseInt(nInput.value);
    nValue.textContent = n;
    draw();  // Redraw the SVG
});
