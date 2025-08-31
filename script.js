
        // Image data - in a real app, this might come from an API or server
        const images = [
            {
                src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Mountain Landscape",
                caption: "Beautiful mountain view with trees and lake",
                category: "nature"
            },
            {
                src: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Cityscape",
                caption: "Urban city landscape during sunset",
                category: "travel"
            },
            {
                src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Portrait",
                caption: "Professional portrait of a woman",
                category: "people"
            },
            {
                src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Forest Path",
                caption: "Mystical forest path in autumn",
                category: "nature"
            },
            {
                src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Snowy Mountains",
                caption: "Majestic snow-covered mountain range",
                category: "nature"
            },
            {
                src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Night Sky",
                caption: "Starry night with milky way",
                category: "nature"
            },
            {
                src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Urban Travel",
                caption: "Traveling through a bustling city",
                category: "travel"
            },
            {
                src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "Woman Portrait",
                caption: "Professional portrait photography",
                category: "people"
            }
        ];

        // DOM Elements
        const gallery = document.querySelector('.gallery');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImage = document.querySelector('.lightbox-image');
        const lightboxTitle = document.querySelector('.lightbox-title');
        const lightboxDescription = document.querySelector('.lightbox-description');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-control.prev');
        const lightboxNext = document.querySelector('.lightbox-control.next');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchBox = document.querySelector('.search-box');

        // Current image index for lightbox navigation
        let currentImageIndex = 0;

        // Initialize the gallery
        function initGallery() {
            renderGallery(images);
            setupEventListeners();
        }

        // Render gallery items
        function renderGallery(imagesToRender) {
            gallery.innerHTML = '';
            
            imagesToRender.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.dataset.index = index;
                galleryItem.dataset.category = image.category;
                
                galleryItem.innerHTML = `
                    <img src="${image.src}" alt="${image.title}" class="gallery-image" loading="lazy">
                    <div class="image-overlay">
                        <h3 class="image-title">${image.title}</h3>
                        <p class="image-caption">${image.caption}</p>
                    </div>
                `;
                
                gallery.appendChild(galleryItem);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Gallery item click - open lightbox
            gallery.addEventListener('click', (e) => {
                const galleryItem = e.target.closest('.gallery-item');
                if (galleryItem) {
                    currentImageIndex = parseInt(galleryItem.dataset.index);
                    openLightbox(currentImageIndex);
                }
            });

            // Lightbox controls
            lightboxClose.addEventListener('click', closeLightbox);
            lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
            lightboxNext.addEventListener('click', () => navigateLightbox(1));

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('open')) {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowLeft') navigateLightbox(-1);
                    if (e.key === 'ArrowRight') navigateLightbox(1);
                }
            });

            // Close lightbox when clicking outside
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            // Filter buttons
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Filter images
                    const filter = button.dataset.filter;
                    filterImages(filter);
                });
            });

            // Search functionality
            searchBox.addEventListener('input', () => {
                const searchTerm = searchBox.value.toLowerCase();
                searchImages(searchTerm);
            });
        }

        // Open lightbox with specific image
        function openLightbox(index) {
            const image = images[index];
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title;
            lightboxTitle.textContent = image.title;
            lightboxDescription.textContent = image.caption;
            
            lightbox.classList.add('open');
            
            // Prevent body scrolling when lightbox is open
            document.body.style.overflow = 'hidden';
        }

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = 'auto';
        }

        // Navigate between images in lightbox
        function navigateLightbox(direction) {
            currentImageIndex += direction;
            
            // Handle wrap-around for first and last image
            if (currentImageIndex < 0) {
                currentImageIndex = images.length - 1;
            } else if (currentImageIndex >= images.length) {
                currentImageIndex = 0;
            }
            
            openLightbox(currentImageIndex);
        }

        // Filter images by category
        function filterImages(category) {
            if (category === 'all') {
                renderGallery(images);
                return;
            }
            
            const filteredImages = images.filter(image => image.category === category);
            renderGallery(filteredImages);
        }

        // Search images by title or caption
        function searchImages(term) {
            if (term === '') {
                // If search is empty, show all images or filtered images
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                filterImages(activeFilter);
                return;
            }
            
            const searchedImages = images.filter(image => 
                image.title.toLowerCase().includes(term) || 
                image.caption.toLowerCase().includes(term)
            );
            
            renderGallery(searchedImages);
        }

        // Initialize the gallery when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGallery);