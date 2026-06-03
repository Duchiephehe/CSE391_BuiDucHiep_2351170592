const galleryGrid = document.getElementById('galleryGrid');
const loadTrigger = document.getElementById('load-trigger');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingText = document.getElementById('loadingText');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxAuthor = document.getElementById('lightboxAuthor');
const closeLightbox = document.getElementById('closeLightbox');

let currentPage = 1;
const limit = 20;
let isFetching = false;

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

async function loadMorePhotos() {
    if (isFetching) return;
    isFetching = true;
    
    loadingSpinner.classList.remove('hidden');
    loadingText.classList.remove('hidden');

    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=${limit}`);
        if (!response.ok) throw new Error("Fetch error");
        const data = await response.json();
        
        data.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'img-card';
            
            const thumbUrl = `https://picsum.photos/id/${photo.id}/400/300`;
            const fullUrl = `https://picsum.photos/id/${photo.id}/1200/800`;
            
            card.innerHTML = `
                <img data-src="${thumbUrl}" alt="Photo by ${photo.author}">
                <div class="author-overlay">${photo.author}</div>
            `;
            
            card.addEventListener('click', () => {
                lightboxImg.src = fullUrl;
                lightboxAuthor.textContent = `Photo by ${photo.author}`;
                lightbox.classList.remove('hidden');
            });

            galleryGrid.appendChild(card);
            
            const imgEl = card.querySelector('img');
            imageObserver.observe(imgEl);
        });
        
        currentPage++;
    } catch (error) {
        console.error(error);
        loadingText.textContent = "Có lỗi xảy ra khi tải ảnh!";
    } finally {
        isFetching = false;
        loadingSpinner.classList.add('hidden');
        if (!loadingText.textContent.includes("lỗi")) {
            loadingText.classList.add('hidden');
        }
    }
}

const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMorePhotos();
    }
}, { rootMargin: '100px' });

scrollObserver.observe(loadTrigger);

closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    setTimeout(() => { lightboxImg.src = ''; }, 300);
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }
});
