// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const historyList = document.getElementById('historyList');

// States
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const successState = document.getElementById('successState');

// Weather Data Elements
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.getElementById('tempValue');
const weatherDesc = document.getElementById('weatherDesc');
const humidityValue = document.getElementById('humidityValue');
const windValue = document.getElementById('windValue');

// Local Storage Key
const HISTORY_KEY = 'weather_history';

// Map Weather Codes to description and icon (Open-Meteo standard codes)
const weatherMap = {
    0: { desc: 'Trời quang đãng', icon: '☀️' },
    1: { desc: 'Đôi lúc có mây', icon: '🌤️' },
    2: { desc: 'Nhiều mây', icon: '⛅' },
    3: { desc: 'U ám', icon: '☁️' },
    45: { desc: 'Sương mù', icon: '🌫️' },
    48: { desc: 'Sương mù lạnh', icon: '🌫️' },
    51: { desc: 'Mưa phùn nhẹ', icon: '🌧️' },
    53: { desc: 'Mưa phùn vừa', icon: '🌧️' },
    55: { desc: 'Mưa phùn dày', icon: '🌧️' },
    61: { desc: 'Mưa nhỏ', icon: '🌧️' },
    63: { desc: 'Mưa vừa', icon: '🌧️' },
    65: { desc: 'Mưa to', icon: '🌧️' },
    71: { desc: 'Tuyết rơi nhẹ', icon: '❄️' },
    73: { desc: 'Tuyết rơi vừa', icon: '❄️' },
    75: { desc: 'Tuyết rơi dày', icon: '❄️' },
    95: { desc: 'Giông bão', icon: '⛈️' },
    96: { desc: 'Giông bão kèm mưa đá nhẹ', icon: '⛈️' },
    99: { desc: 'Giông bão kèm mưa đá dữ dội', icon: '⛈️' }
};

// Initialize app
function init() {
    renderHistory();
    
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        }
    });
}

// Show a specific state
function showState(state) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    successState.classList.add('hidden');

    if (state === 'loading') loadingState.classList.remove('hidden');
    if (state === 'error') errorState.classList.remove('hidden');
    if (state === 'success') successState.classList.remove('hidden');
}

// Main logic to fetch weather
async function getWeather(city) {
    showState('loading');
    
    try {
        // Bước 1: Geocoding (Chuyển đổi tên thành phố thành tọa độ lat/lon)
        // Dùng API geocoding của Open-Meteo vì nó chính xác và nhanh
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) throw new Error('Network error (Geocoding)');
        
        const geoData = await geoResponse.json();
        
        // Kiểm tra xem có kết quả thành phố không
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Không tìm thấy thành phố này!');
        }

        const { latitude, longitude, name: resolvedName } = geoData.results[0];

        // Bước 2: Gọi API thời tiết với tọa độ lấy được
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error('Network error (Weather)');
        
        const weatherData = await weatherResponse.json();
        
        // Cập nhật giao diện
        updateWeatherUI(resolvedName, weatherData.current);
        
        // Lưu lịch sử
        saveHistory(resolvedName);
        renderHistory();
        
        // Xóa input
        cityInput.value = '';
        
        showState('success');
    } catch (error) {
        console.error("Lỗi tải thời tiết:", error);
        // Phân biệt lỗi mất mạng (fetch failed) và lỗi không tìm thấy
        errorMessage.textContent = error.message.includes('Network') || error.message.includes('Failed to fetch')
            ? 'Mất mạng! Không thể kết nối tới máy chủ.' 
            : error.message;
        showState('error');
    }
}

// Update DOM with weather data
function updateWeatherUI(name, current) {
    cityName.textContent = name;
    tempValue.textContent = Math.round(current.temperature_2m);
    humidityValue.textContent = `${current.relative_humidity_2m}%`;
    windValue.textContent = `${current.wind_speed_10m} km/h`;

    const code = current.weather_code;
    const weatherInfo = weatherMap[code] || { desc: 'Không rõ', icon: '❓' };
    
    weatherDesc.textContent = weatherInfo.desc;
    weatherIcon.textContent = weatherInfo.icon;
}

// History Management (Lưu tối đa 5 thành phố)
function getHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

function saveHistory(city) {
    let history = getHistory();
    
    // Xóa thành phố nếu đã tồn tại để đẩy nó lên đầu
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Thêm vào đầu mảng
    history.unshift(city);
    
    // Chỉ giữ lại 5 phần tử mới nhất
    if (history.length > 5) {
        history = history.slice(0, 5);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
    const history = getHistory();
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<span class="history-title" style="opacity:0.5; margin:0; font-style:italic">Chưa có dữ liệu</span>';
        return;
    }
    
    history.forEach(city => {
        const span = document.createElement('span');
        span.className = 'history-tag';
        span.textContent = city;
        // Click vào history để tìm lại
        span.addEventListener('click', () => {
            cityInput.value = city;
            getWeather(city);
        });
        historyList.appendChild(span);
    });
}

// Khởi chạy app
init();
