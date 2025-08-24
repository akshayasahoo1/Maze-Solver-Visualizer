const ROWS = 25;
const COLS = 50;
let maze = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
let start = null;
let end = null;
let isDrawing = false;
let drawingType = 'wall';  // Default to wall

const mazeDiv = document.getElementById('maze');
const timeDiv = document.getElementById('time');

// Create grid
for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('mousedown', handleMouseDown);
        cell.addEventListener('mouseover', handleMouseOver);
        cell.addEventListener('mouseup', handleMouseUp);
        mazeDiv.appendChild(cell);
    }
}

document.addEventListener('mouseup', () => isDrawing = false);

function handleMouseDown(e) {
    isDrawing = true;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    toggleCell(row, col);
}

function handleMouseOver(e) {
    if (isDrawing) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        toggleCell(row, col);
    }
}

function handleMouseUp() {
    isDrawing = false;
}

function toggleCell(row, col) {
    const cell = getCell(row, col);
    if (drawingType === 'start') {
        if (start) getCell(start[0], start[1]).classList.remove('start');
        start = [row, col];
        maze[row][col] = 'start';
        cell.classList.add('start');
    } else if (drawingType === 'end') {
        if (end) getCell(end[0], end[1]).classList.remove('end');
        end = [row, col];
        maze[row][col] = 'end';
        cell.classList.add('end');
    } else if (drawingType === 'wall') {
        if (maze[row][col] === 'wall') {
            maze[row][col] = 'empty';
            cell.classList.remove('wall');
        } else if (maze[row][col] === 'empty') {
            maze[row][col] = 'wall';
            cell.classList.add('wall');
        }
    }
}

function getCell(row, col) {
    return mazeDiv.children[row * COLS + col];
}

function selectAlgorithm(algorithm) {
    if (!start || !end) {
        alert('Please set start and end points.');
        return;
    }
    clearPath();  // Clear previous path/visited
    fetch('/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maze, start, end, algorithm })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }
        animateVisited(data.visited, data.path, data.execution_time);
    });
}

function animateVisited(visited, path, execution_time) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < visited.length) {
            const [row, col] = visited[i];
            if (maze[row][col] !== 'start' && maze[row][col] !== 'end') {
                getCell(row, col).classList.add('visited');
            }
            i++;
        } else {
            clearInterval(interval);
            animatePath(path, execution_time);
        }
    }, 10);  // Animation speed
}

function animatePath(path, execution_time) {
    if (path.length === 0) {
        alert('No path found!');
        timeDiv.textContent = `Execution Time: ${execution_time} seconds`;
        return;
    }
    let i = 0;
    const interval = setInterval(() => {
        if (i < path.length) {
            const [row, col] = path[i];
            if (maze[row][col] !== 'start' && maze[row][col] !== 'end') {
                getCell(row, col).classList.add('path');
            }
            i++;
        } else {
            clearInterval(interval);
            timeDiv.textContent = `Execution Time: ${execution_time} seconds (Path Length: ${path.length})`;
        }
    }, 20);
}

function generateRandomMaze() {
    clearWalls();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (Math.random() < 0.3) {  // 30% chance of wall
                maze[i][j] = 'wall';
                getCell(i, j).classList.add('wall');
            }
        }
    }
}

function clearWalls() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (maze[i][j] === 'wall') {
                maze[i][j] = 'empty';
                getCell(i, j).classList.remove('wall');
            }
        }
    }
}

function clearPath() {
    timeDiv.textContent = '';
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            getCell(i, j).classList.remove('visited', 'path');
        }
    }
}

// Set drawing type via keyboard (optional enhancement)
document.addEventListener('keydown', (e) => {
    if (e.key === 's') drawingType = 'start';
    if (e.key === 'e') drawingType = 'end';
    if (e.key === 'w') drawingType = 'wall';
});
