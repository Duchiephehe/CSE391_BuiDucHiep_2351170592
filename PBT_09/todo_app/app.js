const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const footer = document.getElementById("footer");
const todoCount = document.getElementById("todoCount");
const filters = document.querySelectorAll(".filters a");
const clearCompletedBtn = document.getElementById("clearCompleted");

// Lấy danh sách todos từ localStorage, nếu không có thì dùng mảng rỗng
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all"; // all, active, completed

// Lưu vào localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Render lại giao diện
function render() {
    // 1. Lọc mảng
    let filteredTodos = todos;
    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // 2. Clear danh sách hiện tại
    todoList.innerHTML = "";

    // 3. Hiển thị từng item
    filteredTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.textContent = todo.text;
        span.className = "todo-text";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete-btn";

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });

    // 4. Cập nhật đếm số lượng
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

    // 5. Ẩn/hiện footer và nút clear completed
    footer.style.display = todos.length > 0 ? "flex" : "none";
    
    const completedCount = todos.length - activeCount;
    clearCompletedBtn.style.display = completedCount > 0 ? "block" : "none";

    saveTodos();
}

// Tính năng Thêm (Add)
todoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text !== "") {
        todos.push({
            id: Date.now().toString(),
            text: text,
            completed: false
        });
        todoInput.value = "";
        render();
    }
});

// Tính năng Xóa và Toggle completed (Dùng Event Delegation)
todoList.addEventListener("click", function(e) {
    const li = e.target.closest("li");
    if (!li) return;
    const id = li.dataset.id;

    // Nhấn nút xóa
    if (e.target.classList.contains("delete-btn")) {
        todos = todos.filter(t => t.id !== id);
        render();
    }
    // Nhấn vào chữ để toggle trạng thái
    else if (e.target.classList.contains("todo-text")) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            render();
        }
    }
});

// Tính năng Edit (Double click)
todoList.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("todo-text")) {
        const li = e.target.closest("li");
        const id = li.dataset.id;
        const todo = todos.find(t => t.id === id);
        
        // Đổi thẻ span thành thẻ input
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "edit-input";
        editInput.value = todo.text;

        li.replaceChild(editInput, e.target);
        editInput.focus();

        // Xử lý khi Enter hoặc click ra ngoài (blur)
        const saveEdit = () => {
            const newText = editInput.value.trim();
            if (newText !== "") {
                todo.text = newText;
            } else {
                todos = todos.filter(t => t.id !== id);
            }
            render();
        };

        editInput.addEventListener("blur", saveEdit);
        editInput.addEventListener("keypress", function(ev) {
            if (ev.key === "Enter") {
                saveEdit();
            }
        });
    }
});

// Tính năng Filter All / Active / Completed
filters.forEach(filterBtn => {
    filterBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Đổi class selected cho nút bấm
        filters.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        
        currentFilter = this.dataset.filter;
        render();
    });
});

// Tính năng Clear completed
clearCompletedBtn.addEventListener("click", function() {
    todos = todos.filter(t => !t.completed);
    render();
});

// Khởi chạy
render();
