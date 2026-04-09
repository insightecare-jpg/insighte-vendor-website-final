document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    const heroContent = document.querySelector('.hero-content');

    // Subtle parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        card.style.transform = `translateY(calc(-50% + ${y * 0.5}px)) translateX(${x * 0.5}px)`;
        
        // Remove the default float animation when interacting to avoid conflict
        // Or keep it subtle. Let's keep the float but add the offset.
        // Actually, directly setting transform overrides the animation keyframes.
        // So let's apply the parallax to the content inside instead to be safer and smoother.
        
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });
});
