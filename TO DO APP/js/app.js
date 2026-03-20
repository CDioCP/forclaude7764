document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, text: 'Complete project proposal', category: 'Work', isCompleted: false, isImportant: false, timestamp: Date.now() },
        { id: 2, text: 'Review design mockups', category: 'Design', isCompleted: false, isImportant: true, timestamp: Date.now() - 10000 }
    ];

    // --- Selectors ---
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');

    const totalCountEl = document.getElementById('total-count');
    const pendingCountEl = document.getElementById('pending-count');
    const importantCountEl = document.getElementById('important-count');
    const completedCountEl = document.getElementById('completed-count');

    // --- Functions ---

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateDashboard();
        renderTasks();
    }

    function updateDashboard() {
        const total = tasks.length;
        const pending = tasks.filter(t => !t.isCompleted).length;
        const important = tasks.filter(t => t.isImportant && !t.isCompleted).length; // Usually important tasks are pending ones? Or all? Let's say all important. Actually dashboard usually shows active important. Let's count all marked important.
        // Actually, let's filter important to be 'Priority tasks' which usually implies pending.
        const importantPending = tasks.filter(t => t.isImportant && !t.isCompleted).length;
        
        const completed = tasks.filter(t => t.isCompleted).length;

        animateValue(totalCountEl, parseInt(totalCountEl.innerText), total, 500);
        animateValue(pendingCountEl, parseInt(pendingCountEl.innerText), pending, 500);
        animateValue(importantCountEl, parseInt(importantCountEl.innerText), importantPending, 500);
        animateValue(completedCountEl, parseInt(completedCountEl.innerText), completed, 500);
    }

    // Number animation utility
    function animateValue(obj, start, end, duration) {
        if (start === end) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    function renderTasks() {
        taskList.innerHTML = '';

        // Sort: Pending first, then Completed. Within that, Important first.
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.isCompleted === b.isCompleted) {
                if (a.isImportant === b.isImportant) {
                    return b.timestamp - a.timestamp; // Newest first
                }
                return b.isImportant - a.isImportant; // Important first
            }
            return a.isCompleted - b.isCompleted; // Pending first
        });

        sortedTasks.forEach(task => {
            const el = document.createElement('div');
            el.className = `task-item ${task.isCompleted ? 'completed' : ''}`;
            
            // Randomly assign a category for demo purposes if not set
            const categoryClass = task.category === 'Work' ? 'tag-work' : 'tag-design';
            
            el.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.isCompleted ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="meta-tag ${categoryClass}">${task.category}</span>
                        <span><i class="fa-regular fa-calendar"></i> Today</span> 
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn star-btn ${task.isImportant ? 'active' : ''}">
                        <i class="${task.isImportant ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                    </button>
                    <button class="action-btn delete-btn">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;

            // Event Listeners
            const checkbox = el.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleComplete(task.id));

            const starBtn = el.querySelector('.star-btn');
            starBtn.addEventListener('click', () => toggleImportant(task.id));

            const deleteBtn = el.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(el);
        });
    }

    function addTask(text) {
        if (!text.trim()) return;
        
        const newTask = {
            id: Date.now(),
            text: text,
            category: Math.random() > 0.5 ? 'Work' : 'Design', // Mock category assignment
            isCompleted: false,
            isImportant: false,
            timestamp: Date.now()
        };

        tasks.unshift(newTask);
        saveTasks();
        taskInput.value = '';
    }

    function deleteTask(id) {
        if(confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
        }
    }

    function toggleComplete(id) {
        tasks = tasks.map(t => {
            if (t.id === id) {
                return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
        });
        saveTasks();
    }

    function toggleImportant(id) {
        tasks = tasks.map(t => {
            if (t.id === id) {
                return { ...t, isImportant: !t.isImportant };
            }
            return t;
        });
        saveTasks();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Event Bindings ---
    addBtn.addEventListener('click', () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    // Initial Render
    updateDashboard(); // Run once to set initial numbers without animation or with 0 start
    renderTasks();
});
