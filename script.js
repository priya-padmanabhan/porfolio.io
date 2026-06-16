document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded!');
    
    // Remove hash from URL and scroll to top
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
    window.scrollTo(0, 0);
    
    // Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
    });
    
    // Interactive blob movement
    const hero = document.querySelector('#hero');
    const blobs = document.querySelectorAll('.blob');
    
    console.log('Hero:', hero);
    console.log('Blobs found:', blobs.length);
    
    if (hero && blobs.length > 0) {
        console.log('Setting up blob interaction...');
        
        let mouseX = 0;
        let mouseY = 0;
        let isMouseInHero = false;
        let scrollY = 0;
        
        // Track current positions for smooth interpolation
        const blobPositions = Array.from(blobs).map(() => ({ x: 0, y: 0 }));
        
        // Parallax scrolling for blobs
        window.addEventListener('scroll', function() {
            scrollY = window.pageYOffset;
        });
        
        hero.addEventListener('mousemove', function(e) {
            const heroRect = hero.getBoundingClientRect();
            mouseX = e.clientX - heroRect.left;
            mouseY = e.clientY - heroRect.top;
            isMouseInHero = true;
        });
        
        hero.addEventListener('mouseleave', function() {
            isMouseInHero = false;
        });
        
        // Smooth animation loop
        function animate() {
            const heroRect = hero.getBoundingClientRect();
            
            blobs.forEach((blob, index) => {
                const blobRect = blob.getBoundingClientRect();
                const blobCenterX = blobRect.left + blobRect.width / 2 - heroRect.left;
                const blobCenterY = blobRect.top + blobRect.height / 2 - heroRect.top;
                
                let targetX = 0;
                let targetY = 0;
                
                // Parallax effect - different speeds for each blob
                const parallaxSpeeds = [0.3, 0.5, 0.4, 0.6];
                const parallaxY = scrollY * parallaxSpeeds[index];
                
                if (isMouseInHero) {
                    const deltaX = blobCenterX - mouseX;
                    const deltaY = blobCenterY - mouseY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    
                    if (distance < 500 && distance > 0) {
                        const force = (500 - distance) / 500;
                        targetX = (deltaX / distance) * force * 120;
                        targetY = (deltaY / distance) * force * 120;
                    }
                }
                
                // Smooth interpolation (lerp) for fluid movement
                blobPositions[index].x += (targetX - blobPositions[index].x) * 0.1;
                blobPositions[index].y += (targetY - blobPositions[index].y) * 0.1;
                
                blob.style.transform = `translate(${blobPositions[index].x}px, ${blobPositions[index].y + parallaxY}px)`;
                blob.style.transition = 'none'; // Remove CSS transition for smoother JS animation
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Reset blobs when mouse leaves hero
        function resetBlobs() {
            blobs.forEach(blob => {
                blob.style.transform = 'translate(0, 0)';
                blob.style.transition = 'transform 0.5s ease-out';
            });
        }
        
        hero.addEventListener('mouseleave', resetBlobs);
        
        // Reset when scrolling past hero
        window.addEventListener('scroll', function() {
            const heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom < 0) {
                resetBlobs();
            }
        });
    }
    
    const navLinks = document.querySelectorAll('nav a, .cta-row a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Flip card click toggle
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        let touchStartTime = 0;
        
        card.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
        });
        
        card.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            // Only toggle if it's a tap (not a swipe)
            if (touchDuration < 200 && !e.target.closest('a')) {
                e.preventDefault();
                this.classList.toggle('is-flipped');
            }
        });
        
        card.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            // Prevent double-firing on mobile
            if (e.detail === 0) return;
            this.classList.toggle('is-flipped');
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('is-flipped');
            }
        });
    });

    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.previousElementSibling;
            const teaser = content.previousElementSibling;
            const isExpanded = content.classList.contains('expanded');
            
            if (isExpanded) {
                content.classList.remove('expanded');
                this.classList.remove('expanded');
                teaser.style.display = 'block';
                this.textContent = 'Read more';
            } else {
                content.classList.add('expanded');
                this.classList.add('expanded');
                teaser.style.display = 'none';
                this.textContent = 'Read less';
            }
        });
    });

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    console.log('Carousel elements:', { track, prevBtn, nextBtn });
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        
        console.log('Total slides:', totalSlides);
        
        function updateCarousel() {
            const percentage = currentIndex * 100;
            console.log('Moving to index:', currentIndex, 'Percentage:', percentage);
            track.style.transform = `translateX(-${percentage}%)`;
            
            // Hide prev arrow on first slide, next arrow on last slide
            prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
            nextBtn.style.display = currentIndex === totalSlides - 1 ? 'none' : 'flex';
        }
        
        // Set initial arrow visibility
        updateCarousel();
        
        nextBtn.addEventListener('click', () => {
            console.log('Next clicked, current index:', currentIndex);
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            console.log('Prev clicked, current index:', currentIndex);
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchStartX - touchEndX > 50 && currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
            if (touchEndX - touchStartX > 50 && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }
});
