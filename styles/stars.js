function generateStars(elementId, numStars) {
    let stars = [];
    for (let i = 0; i < numStars; i++) {
        let x = Math.floor(Math.random() * window.innerWidth);
        let y = Math.floor(Math.random() * 2000); // Random height
        stars.push(`${x}px ${y}px #FFF`);
    }
    document.getElementById(elementId).style.boxShadow = stars.join(", ");
}

// Generate stars dynamically
generateStars("stars", 700);  // Small stars
generateStars("stars2", 200); // Medium stars
generateStars("stars3", 100); // Large stars
