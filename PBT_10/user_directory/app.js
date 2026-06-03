const api = {
    baseURL: "https://jsonplaceholder.typicode.com",
    
    async getUsers() {
        const response = await fetch(`${this.baseURL}/users`);
        if (!response.ok) throw new Error("Không thể tải danh sách");
        return await response.json();
    },
    
    async getUser(id) {
        const response = await fetch(`${this.baseURL}/users/${id}`);
        if (!response.ok) throw new Error("Không thể tải chi tiết user");
        return await response.json();
    },
    
    async createUser(data) {
        const response = await fetch(`${this.baseURL}/users`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' }
        });
        if (!response.ok) throw new Error("Không thể thêm user");
        return await response.json();
    },
    
    async updateUser(id, data) {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' }
        });
        if (!response.ok) throw new Error("Không thể cập nhật user");
        return await response.json();
    },
    
    async deleteUser(id) {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Không thể xóa user");
        return true;
    }
};

const ui = {
    userGrid: document.getElementById('userGrid'),
    skeletonContainer: document.getElementById('skeletonContainer'),
    toastContainer: document.getElementById('toastContainer'),
    
    renderUsers(users) {
        this.userGrid.innerHTML = '';
        if (users.length === 0) {
            this.userGrid.innerHTML = '<p>Không tìm thấy user nào.</p>';
            return;
        }
        
        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><i class="fa-solid fa-envelope"></i> ${user.email}</p>
                <p><i class="fa-solid fa-phone"></i> ${user.phone}</p>
                <div class="user-actions">
                    <button class="btn btn-secondary btn-sm" onclick="app.editUser(${user.id})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteUser(${user.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            `;
            this.userGrid.appendChild(card);
        });
    },
    
    showLoading() {
        this.skeletonContainer.classList.remove('hidden');
        this.userGrid.classList.add('hidden');
    },
    
    hideLoading() {
        this.skeletonContainer.classList.add('hidden');
        this.userGrid.classList.remove('hidden');
    },
    
    showError(message) {
        this.showToast(message, 'error');
    },
    
    showSuccess(message) {
        this.showToast(message, 'success');
    },
    
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

const app = {
    users: [],
    
    modalOverlay: document.getElementById('modalOverlay'),
    userForm: document.getElementById('userForm'),
    modalTitle: document.getElementById('modalTitle'),
    userId: document.getElementById('userId'),
    nameInput: document.getElementById('nameInput'),
    emailInput: document.getElementById('emailInput'),
    phoneInput: document.getElementById('phoneInput'),
    
    async init() {
        this.bindEvents();
        await this.loadUsers();
    },
    
    bindEvents() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });
        
        document.getElementById('addBtn').addEventListener('click', () => {
            this.openModal();
        });
        
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });
        
        this.userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveUser();
        });
    },
    
    async loadUsers() {
        ui.showLoading();
        try {
            this.users = await api.getUsers();
            ui.renderUsers(this.users);
        } catch (error) {
            ui.showError(error.message);
        } finally {
            ui.hideLoading();
        }
    },
    
    filterUsers(query) {
        const q = query.toLowerCase();
        const filtered = this.users.filter(u => 
            u.name.toLowerCase().includes(q) || 
            u.email.toLowerCase().includes(q)
        );
        ui.renderUsers(filtered);
    },
    
    openModal(user = null) {
        if (user) {
            this.modalTitle.textContent = "Cập nhật User";
            this.userId.value = user.id;
            this.nameInput.value = user.name;
            this.emailInput.value = user.email;
            this.phoneInput.value = user.phone;
        } else {
            this.modalTitle.textContent = "Thêm User Mới";
            this.userForm.reset();
            this.userId.value = "";
        }
        this.modalOverlay.classList.remove('hidden');
    },
    
    closeModal() {
        this.modalOverlay.classList.add('hidden');
    },
    
    async saveUser() {
        const id = this.userId.value;
        const data = {
            name: this.nameInput.value,
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
        
        try {
            if (id) {
                await api.updateUser(id, data);
                const index = this.users.findIndex(u => u.id == id);
                if (index !== -1) {
                    this.users[index] = { ...this.users[index], ...data };
                }
                ui.showSuccess("Cập nhật thành công!");
            } else {
                const newUser = await api.createUser(data);
                this.users.unshift(newUser);
                ui.showSuccess("Thêm user thành công!");
            }
            ui.renderUsers(this.users);
            this.closeModal();
            document.getElementById('searchInput').value = '';
        } catch (error) {
            ui.showError(error.message);
        }
    },
    
    async editUser(id) {
        const user = this.users.find(u => u.id == id);
        if (user) {
            this.openModal(user);
        }
    },
    
    async deleteUser(id) {
        if (!confirm("Bạn có chắc chắn muốn xóa user này?")) return;
        
        try {
            await api.deleteUser(id);
            this.users = this.users.filter(u => u.id != id);
            ui.renderUsers(this.users);
            ui.showSuccess("Xóa thành công!");
        } catch (error) {
            ui.showError(error.message);
        }
    }
};

app.init();
