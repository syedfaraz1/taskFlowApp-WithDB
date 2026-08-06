const API = '/api/tasks';
let tasks = [];
let currentFilter = 'all';

const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const priorityInput = document.getElementById('priorityInput');

async function fetchTasks() {
    const res = await fetch(API);
    tasks = await res.json();
    render();
}

async function createTask(task) {
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    await fetchTasks();
}

async function toggleTask(id) {
    await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
    await fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await fetchTasks();
}

function render() {
    const filtered = tasks.filter(t => {
        if (currentFilter === 'pending') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    taskList.innerHTML = '';
    emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

    filtered
        .slice()
        .sort((a, b) => a.completed - b.completed)
        .forEach(task => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M4 12L9 17L20 6" stroke="#0f1220" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
                </div>
                <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
                <button class="delete-btn" data-id="${task.id}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            `;
            taskList.appendChild(card);
        });

    document.querySelectorAll('.checkbox').forEach(el => {
        el.addEventListener('click', () => toggleTask(el.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(el => {
        el.addEventListener('click', () => deleteTask(el.dataset.id));
    });

    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('doneCount').textContent = done;
    document.getElementById('pendingCount').textContent = total - done;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;
    await createTask({
        title,
        description: descInput.value.trim(),
        priority: priorityInput.value,
        completed: false
    });
    titleInput.value = '';
    descInput.value = '';
    priorityInput.value = 'MEDIUM';
    titleInput.focus();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

fetchTasks();
