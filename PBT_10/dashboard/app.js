const refreshBtn = document.getElementById('refreshBtn');
const globalLoading = document.getElementById('globalLoading');
const dashboardGrid = document.getElementById('dashboardGrid');
const loadTimeDisplay = document.getElementById('loadTime');

function renderWidgetError(index, message) {
    const widget = document.getElementById(`widget-${index}`);
    const content = widget.querySelector('.widget-content');
    const errorEl = widget.querySelector('.widget-error');
    
    content.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Lỗi: ${message}`;
}

function renderWidget(index, data) {
    const widget = document.getElementById(`widget-${index}`);
    const content = widget.querySelector('.widget-content');
    const errorEl = widget.querySelector('.widget-error');
    
    errorEl.classList.add('hidden');
    content.classList.remove('hidden');
    content.innerHTML = '';
    
    if (index === 0) {
        data.forEach(user => {
            const div = document.createElement('div');
            div.className = 'user-item';
            div.innerHTML = `<strong>${user.name}</strong><br><span style="color:#94a3b8;font-size:12px">${user.email}</span>`;
            content.appendChild(div);
        });
    } else if (index === 1) {
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        content.innerHTML = `
            <div class="weather-display">
                <div class="weather-temp">${temp}°C</div>
                <div style="color:#94a3b8;margin-top:10px">Tốc độ gió: ${wind} km/h</div>
            </div>
        `;
    } else if (index === 2) {
        content.innerHTML = `<img src="${data.message}" alt="Random Dog" class="dog-image">`;
    }
}

async function fetchAPI(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
    }
    return response.json();
}

async function loadDashboard() {
    refreshBtn.disabled = true;
    dashboardGrid.classList.add('hidden');
    globalLoading.classList.remove('hidden');
    loadTimeDisplay.textContent = 'Đang tải...';

    const startTime = Date.now();
    
    const results = await Promise.allSettled([
        fetchAPI("https://jsonplaceholder.typicode.com/users?_limit=4"),
        fetchAPI("https://api.open-meteo.com/v1/forecast?latitude=21.0245&longitude=105.84117&current_weather=true"),
        fetchAPI("https://dog.ceo/api/breeds/image/random")
    ]);
    
    globalLoading.classList.add('hidden');
    dashboardGrid.classList.remove('hidden');
    
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            renderWidget(index, result.value);
        } else {
            renderWidgetError(index, result.reason.message);
        }
    });
    
    const timeTaken = Date.now() - startTime;
    loadTimeDisplay.textContent = `Data loaded in ${timeTaken} ms`;
    console.log(`Loaded in ${timeTaken}ms`);
    
    refreshBtn.disabled = false;
}

refreshBtn.addEventListener('click', loadDashboard);

loadDashboard();
