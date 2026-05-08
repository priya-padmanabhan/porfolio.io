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
    
    const navLinks = document.querySelectorAll('nav a');
    
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

    const expandButtons = document.querySelectorAll('.expand-btn');
    
    // Position timeline dotted line precisely between first and last circles
    function updateTimeline() {
        const story = document.querySelector('.career-story');
        const chapters = document.querySelectorAll('.career-chapter');
        if (!story || chapters.length < 2) return;
        
        const storyRect = story.getBoundingClientRect();
        const firstChapter = chapters[0];
        const lastChapter = chapters[chapters.length - 1];
        const firstRect = firstChapter.getBoundingClientRect();
        const lastRect = lastChapter.getBoundingClientRect();
        
        // First circle: top: 40px from chapter, 14px + 2*2 border = 18px tall, center at 49px
        const firstCircleCenter = (firstRect.top - storyRect.top) + 49;
        // Last circle (filled): top: 40px from chapter, 18px + 2*3 border = 24px tall, center at 52px
        const lastCircleCenter = (lastRect.top - storyRect.top) + 52;
        
        story.style.setProperty('--timeline-top', firstCircleCenter + 'px');
        story.style.setProperty('--timeline-height', (lastCircleCenter - firstCircleCenter) + 'px');
    }
    
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
            
            // Update timeline after expansion animation completes
            setTimeout(updateTimeline, 350);
        });
    });
    
    // Initial timeline calculation (after layout settles)
    setTimeout(updateTimeline, 100);
    window.addEventListener('resize', updateTimeline);

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
        }
        
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
