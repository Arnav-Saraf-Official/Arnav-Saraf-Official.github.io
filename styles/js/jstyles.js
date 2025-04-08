// styles/js/jstyles.js

// =========================
// 🔹 Helper Function: Random Color Generator
// =========================
function getRandomColor() {
    const colors = ["#7fbcff", "#ffcb74", "#5fd18c", "#ff6b6b", "#a29bfe", "#00cec9"];
    return colors[Math.floor(Math.random() * colors.length)];
}

document.querySelectorAll("[class*='js-']").forEach(el => {
    el.addEventListener("mouseenter", () => {
        let unifiedColor = getRandomColor();
        let secondaryColor = getRandomColor(); // For gradients or secondary effects
        el.style.transition = "all 0.3s ease-in-out";

        // Hover effects based on specific classes
        if (el.classList.contains("js-bg-hover")) {
            el.style.backgroundColor = unifiedColor;
        }
        if (el.classList.contains("js-border-pulse")) {
            el.style.boxShadow = `0 0 10px ${unifiedColor}`;
        }
        if (el.classList.contains("js-color-swap")) {
            el.style.color = unifiedColor;
        }
        if (el.classList.contains("js-text-glow")) {
            el.style.textShadow = `0px 0px 10px ${unifiedColor}`;
        }
        if (el.classList.contains("js-gradient-hover")) {
            if (!el.gradientEl) {
                el.gradientEl = document.createElement('div');
                el.gradientEl.style.position = 'absolute';
                el.gradientEl.style.top = '0';
                el.gradientEl.style.left = '0';
                el.gradientEl.style.width = '100%';
                el.gradientEl.style.height = '100%';
                el.gradientEl.style.opacity = '0';
                el.gradientEl.style.transition = 'opacity 0.3s ease-in-out';
                el.appendChild(el.gradientEl);
            }
            let unifiedColor = getRandomColor();
            let secondaryColor = getRandomColor();
            el.gradientEl.style.background = `linear-gradient(45deg, ${unifiedColor}, ${secondaryColor})`;
            el.gradientEl.style.opacity = '1';
        }
        if (el.classList.contains("js-text-color")) {
            el.style.color = unifiedColor; // Make sure the color is applied
        }
        if (el.classList.contains("js-outline")) {
            el.style.backgroundColor = unifiedColor;
            el.style.boxShadow = `0 0 10px ${unifiedColor}`;
        }
    });

    el.addEventListener("mouseleave", () => {
        // Reset styles to default on mouse leave
        if (el.classList.contains("js-bg-hover")) {
            el.style.backgroundColor = "";
        }
        if (el.classList.contains("js-border-pulse")) {
            el.style.boxShadow = "none";
        }
        if (el.classList.contains("js-color-swap")) {
            el.style.color = "";
        }
        if (el.classList.contains("js-text-glow")) {
            el.style.textShadow = "none";
        }
        if (el.classList.contains("js-gradient-hover")) {
            el.gradientEl.style.opacity = '0';
        }
        if (el.classList.contains("js-text-color")) {
            el.style.color = "";
        }
        if (el.classList.contains("js-outline")) {
            el.style.backgroundColor = "";
            el.style.boxShadow = "none";
        }
    });
});

document.querySelectorAll(".js-btn-outline").forEach(el => {
    let loopColor = getRandomColor(); // Initialize with a random color

    // Update the color every 2 seconds
    setInterval(() => {
        loopColor = getRandomColor();
        el.style.color = loopColor;
        el.style.borderColor = loopColor;
    }, 2000);

    // Set initial styles
    el.style.backgroundColor = "transparent";
    el.style.color = loopColor;
    el.style.borderColor = loopColor;
    el.style.borderStyle = "solid";

    // Add event listeners for mouseenter and mouseleave
    el.addEventListener("mouseenter", () => {
        el.style.backgroundColor = loopColor;
        el.style.color = "inherit"; // Corrected to use 'inherit'
        el.style.borderColor = loopColor;
    });

    el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "transparent"; // Reset background color
        el.style.color = loopColor;
        el.style.borderColor = loopColor;
    });
});