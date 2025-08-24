from flask import Flask, render_template, request, jsonify
import time
from collections import deque
import heapq

app = Flask(__name__)

DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]

def is_valid(x, y, rows, cols, maze, visited):
    if not (0 <= x < rows and 0 <= y < cols):
        return False
    if maze[x][y] not in ['empty', 'start', 'end']:
        return False
    return not visited[x][y]

def bfs(maze, start, end, rows, cols):
    visited = [[False for _ in range(cols)] for _ in range(rows)]
    parent = [[None for _ in range(cols)] for _ in range(rows)]
    queue = deque([start])
    visited[start[0]][start[1]] = True

    while queue:
        x, y = queue.popleft()
        if (x, y) == end:
            break
        for dx, dy in DIRECTIONS:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny, rows, cols, maze, visited):
                queue.append((nx, ny))
                visited[nx][ny] = True
                parent[nx][ny] = (x, y)

    path = reconstruct_path(parent, start, end)
    return get_visited_order(visited), path

def dfs(maze, start, end, rows, cols):
    visited = [[False for _ in range(cols)] for _ in range(rows)]
    parent = [[None for _ in range(cols)] for _ in range(rows)]
    stack = [start]
    visited[start[0]][start[1]] = True

    while stack:
        x, y = stack.pop()
        if (x, y) == end:
            break
        for dx, dy in DIRECTIONS:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny, rows, cols, maze, visited):
                stack.append((nx, ny))
                visited[nx][ny] = True
                parent[nx][ny] = (x, y)

    path = reconstruct_path(parent, start, end)
    return get_visited_order(visited), path

def dijkstra(maze, start, end, rows, cols):
    visited = [[False for _ in range(cols)] for _ in range(rows)]
    parent = [[None for _ in range(cols)] for _ in range(rows)]
    dist = [[float('inf')] * cols for _ in range(rows)]
    dist[start[0]][start[1]] = 0
    pq = [(0, start)]

    while pq:
        d, (x, y) = heapq.heappop(pq)
        if visited[x][y]:
            continue
        visited[x][y] = True
        if (x, y) == end:
            break
        for dx, dy in DIRECTIONS:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny, rows, cols, maze, visited):
                new_dist = d + 1
                if new_dist < dist[nx][ny]:
                    dist[nx][ny] = new_dist
                    parent[nx][ny] = (x, y)
                    heapq.heappush(pq, (new_dist, (nx, ny)))

    path = reconstruct_path(parent, start, end)
    return get_visited_order(visited), path

def reconstruct_path(parent, start, end):
    path = []
    current = end
    while current and current != start:
        path.append(current)
        current = parent[current[0]][current[1]]
    if current == start:
        path.append(start)
        path.reverse()
        return path
    return []

def get_visited_order(visited):
    order = []
    for i in range(len(visited)):
        for j in range(len(visited[0])):
            if visited[i][j]:
                order.append((i, j))
    return order

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error loading template: {str(e)}", 500

@app.route('/solve', methods=['POST'])
def solve():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400
        maze = data.get('maze')
        start = data.get('start')
        end = data.get('end')
        algorithm = data.get('algorithm')

        if not all([maze, start, end, algorithm]):
            return jsonify({'error': 'Missing required fields'}), 400
        if not isinstance(maze, list) or not maze or not isinstance(maze[0], list):
            return jsonify({'error': 'Invalid maze format'}), 400
        if not isinstance(start, list) or len(start) != 2 or not isinstance(end, list) or len(end) != 2:
            return jsonify({'error': 'Invalid start/end format'}), 400

        rows, cols = len(maze), len(maze[0])
        start = tuple(start)
        end = tuple(end)

        start_time = time.perf_counter()

        if algorithm == 'bfs':
            visited, path = bfs(maze, start, end, rows, cols)
        elif algorithm == 'dfs':
            visited, path = dfs(maze, start, end, rows, cols)
        elif algorithm == 'dijkstra':
            visited, path = dijkstra(maze, start, end, rows, cols)
        else:
            return jsonify({'error': 'Invalid algorithm'}), 400

        execution_time = time.perf_counter() - start_time

        return jsonify({
            'visited': visited,
            'path': path,
            'execution_time': round(execution_time, 4)
        })
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
