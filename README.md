# Maze-Solver-Visualizer
The Maze Solver Visualizer is a web-based application that demonstrates pathfinding algorithms (BFS, DFS, and Dijkstra's) on a customizable 25x50 grid. Users can set start and end points, draw walls, and visualize the shortest path using different algorithms, with execution time displayed for analysis.
Tech Stack

Python 3.x with Flask:

Used as the backend framework to handle server-side logic, including algorithm execution and API endpoints. Flask provides a lightweight and flexible way to serve the maze-solving functionality via HTTP requests.


HTML5:

Structures the user interface, creating the grid and control buttons for an interactive experience.


CSS3:

Styles the application with a responsive design, using custom styles to animate visited cells and paths (light blue for visited, yellow for path).


JavaScript:

Manages frontend interactivity, including mouse events for drawing, AJAX calls to the backend, and animations for visualizing algorithm progress.

How to Run the Project

Prerequisites:

Install Python 3.10+ (download from python.org).
Ensure pip is installed and updated (pip install --upgrade pip).


Setup:

Clone the repository:
bashgit clone https://github.com/your-username/maze-solver.git
cd maze-solver

Create required folders:
bashmkdir templates static

Move files:

Place index.html in the templates folder.
Place styles.css and script.js in the static folder.


Install Flask:
bashpip install flask



Run the Application:

Start the Flask server:
bashpython app.py

Open your browser and navigate to http://127.0.0.1:5000/.
Interact with the grid: Use s for Start (green), e for End (red), w for walls (blue), and click algorithm buttons (BFS, DFS, Dijkstra) to visualize paths.


Usage:

Set Start and End points, draw walls, and run an algorithm to see the path animation.
Use "Random Maze" to generate a new maze or "Clear Walls"/"Clear Path" to reset.




Algorithm Details

Breadth-First Search (BFS):

Description: BFS explores all nodes at the present depth level before moving to nodes at the next depth level, using a queue data structure. It guarantees the shortest path in an unweighted graph.
Implementation: Starts from the Start point, explores neighboring cells level by level, and marks visited cells. It reconstructs the path using a parent array when the End point is reached.
Use Case: Ideal for finding the shortest path in the maze, as demonstrated by the light blue visited cells and yellow path.


Depth-First Search (DFS):

Description: DFS explores as far as possible along each branch before backtracking, using a stack (either explicitly or via recursion). It does not guarantee the shortest path but is memory-efficient.
Implementation: Begins at the Start point, dives deep into one direction, and backtracks when necessary, marking cells as visited and tracking the path with a parent array.
Use Case: Useful for exploring all possible paths, visualized by the sequence of light blue cells leading to the yellow path (if found).
