document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterPriority = document.getElementById('filter-priority');
    const showCompleted = document.getElementById('show-completed');
    const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskIndex = null;

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (!task.completed || showCompleted.classList.contains('active')) {
                if (!filterPriority.value || task.priority === filterPriority.value) {
                    const li = document.createElement('li');
                    li.className = `list-group-item list-group-item-${getPriorityClass(task.priority)}`;
                    li.innerHTML = `
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="form-check-input me-2 complete-task" data-index="${index}">
                        ${task.name}
                        <span class="badge badge-${getPriorityClass(task.priority)}">${task.priority}</span>
                        <button class="btn btn-info btn-sm float-right edit-task" data-index="${index}">Edit</button>
                        <button class="btn btn-danger btn-sm float-right me-2 delete-task" data-index="${index}">Delete</button>
                    `;
                    taskList.appendChild(li);
                }
            }
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const taskName = document.getElementById('task-name').value;
        const taskPriority = document.getElementById('task-priority').value;
        tasks.push({ name: taskName, priority: taskPriority, completed: false });
        saveTasks();
        renderTasks();
        taskForm.reset();
        addTaskModal.hide();
    }

    function editTask() {
        const taskName = document.getElementById('edit-task-name').value;
        const taskPriority = document.getElementById('edit-task-priority').value;
        if (editingTaskIndex !== null) {
            tasks[editingTaskIndex] = { name: taskName, priority: taskPriority, completed: tasks[editingTaskIndex].completed };
            saveTasks();
            renderTasks();
            editTaskModal.hide();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function completeTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function getPriorityClass(priority) {
        switch (priority) {
            case 'Low':
                return 'secondary';
            case 'Medium':
                return 'warning';
            case 'High':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask();
    });

    document.getElementById('edit-task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        editTask();
    });

    taskList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-task')) {
            const index = e.target.getAttribute('data-index');
            deleteTask(index);
        }

        if (e.target.classList.contains('edit-task')) {
            editingTaskIndex = e.target.getAttribute('data-index');
            const task = tasks[editingTaskIndex];
            document.getElementById('edit-task-name').value = task.name;
            document.getElementById('edit-task-priority').value = task.priority;
            document.getElementById('edit-task-index').value = editingTaskIndex;
            editTaskModal.show();
        }

        if (e.target.classList.contains('complete-task')) {
            const index = e.target.getAttribute('data-index');
            completeTask(index);
        }
    });

    filterPriority.addEventListener('change', renderTasks);

    showCompleted.addEventListener('click', function () {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? 'Hide Completed' : 'Show Completed';
        renderTasks();
    });

    renderTasks();
});
