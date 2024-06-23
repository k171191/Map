const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let currentTool = null;  // 默认不能放置
let squareSize = 1;
let currentColor = '#000000';
let scale = 1;
let offsetX = 0;
let offsetY = 0;
const scaleDisplay = document.getElementById('scaleDisplay');
const placedShapes = [];

document.getElementById('add1x1').addEventListener('click', () => {
    squareSize = 1;
    currentTool = 'draw';
});

document.getElementById('add2x2').addEventListener('click', () => {
    squareSize = 2;
    currentTool = 'draw';
});

document.getElementById('add3x3').addEventListener('click', () => {
    squareSize = 3;
    currentTool = 'draw';
});

document.getElementById('add4x4').addEventListener('click', () => {
    squareSize = 4;
    currentTool = 'draw';
});

document.getElementById('add5x5').addEventListener('click', () => {
    squareSize = 5;
    currentTool = 'draw';
});

document.getElementById('add6x6').addEventListener('click', () => {
    squareSize = 6;
    currentTool = 'draw';
});

document.getElementById('add7x7').addEventListener('click', () => {
    squareSize = 7;
    currentTool = 'draw';
});

document.getElementById('add8x8').addEventListener('click', () => {
    squareSize = 8;
    currentTool = 'draw';
});

document.getElementById('add9x9').addEventListener('click', () => {
    squareSize = 9;
    currentTool = 'draw';
});

document.getElementById('eraser').addEventListener('click', () => {
    currentTool = 'erase';
});

document.getElementById('colorPicker').addEventListener('input', (event) => {
    currentColor = event.target.value;
});

document.getElementById('exportMap').addEventListener('click', () => {
    exportMap();
});

document.getElementById('importMapButton').addEventListener('click', () => {
    document.getElementById('importMap').click();
});

document.getElementById('importMap').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            importMap(e.target.result);
        };
        reader.readAsText(file);
    }
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - offsetX) / scale;
    const y = (event.clientY - rect.top - offsetY) / scale;
    const gridX = Math.floor(x / 10) * 10;
    const gridY = Math.floor(y / 10) * 10;

    if (gridX >= 0 && gridX + squareSize * 10 <= 2000 && gridY >= 0 && gridY + squareSize * 10 <= 2000) {
        if (currentTool === 'draw') {
            ctx.fillStyle = currentColor;
            ctx.fillRect(gridX, gridY, squareSize * 10, squareSize * 10);
            placedShapes.push({ x: gridX, y: gridY, size: squareSize, color: currentColor });
        } else if (currentTool === 'erase') {
            ctx.clearRect(gridX, gridY, squareSize * 10, squareSize * 10);
            placedShapes.push({ x: gridX, y: gridY, size: squareSize, color: 'white' });
        }
    }
    draw(); // 重新绘制以确保网格在顶层
});

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const { offsetX: mouseX, offsetY: mouseY, deltaY } = event;
    const zoomFactor = deltaY < 0 ? 1.1 : 0.9;
    const newScale = scale * zoomFactor;

    // 限制缩放比例
    if (newScale >= 0.25 && newScale <= 1) {
        const worldX = (mouseX - offsetX) / scale;
        const worldY = (mouseY - offsetY) / scale;

        scale = newScale;
        offsetX = mouseX - worldX * scale;
        offsetY = mouseY - worldY * scale;
    }

    draw();
    updateScaleDisplay();
});

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换矩阵
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    // 绘制已放置的形状
    placedShapes.forEach(shape => {
        ctx.fillStyle = shape.color;
        ctx.fillRect(shape.x * scale + offsetX, shape.y * scale + offsetY, shape.size * 10 * scale, shape.size * 10 * scale);
    });

    drawGrid();
}

function drawGrid() {
    const step = 10;
    ctx.strokeStyle = '#ddd';
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY); // 应用缩放和平移
    ctx.beginPath();

    for (let x = 0; x < 2000; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 2000);
    }

    for (let y = 0; y < 2000; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(2000, y);
    }

    ctx.stroke();
}

function updateScaleDisplay() {
    scaleDisplay.innerText = `Scale: ${(scale * 100).toFixed(0)}%`;
}

function exportMap() {
    const mapData = JSON.stringify(placedShapes);
    const blob = new Blob([mapData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importMap(data) {
    placedShapes.length = 0; // 清空当前地图
    const importedShapes = JSON.parse(data);
    importedShapes.forEach(shape => placedShapes.push(shape));
    draw();
}

draw();
updateScaleDisplay();
