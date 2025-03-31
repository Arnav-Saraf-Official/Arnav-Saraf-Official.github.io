// =========================
// 🔹 Helper Function: Random Color Generator
// =========================
function getRandomColor() {
    const colors = ["#7fbcff", "#ffcb74", "#5fd18c", "#ff6b6b", "#a29bfe", "#00cec9"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// =========================
// 🔥 Hover Effects (Unified Colors)
// =========================

document.querySelectorAll("[class*='js-']").forEach(el => {
    el.addEventListener("mouseenter", () => {
        let unifiedColor = getRandomColor();
        let secondaryColor = getRandomColor(); // For gradients or secondary effects

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
            el.style.background = `linear-gradient(45deg, ${unifiedColor}, ${secondaryColor})`;
        }
    });

    el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "";
        el.style.boxShadow = "none";
        el.style.color = "";
        el.style.textShadow = "none";
        el.style.background = "";
    });
});

// =========================
// 🎨 Dynamic Button Styles
// =========================

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
        el.style.color = "inherit"; // Corrected to use a string
        el.style.borderColor = loopColor;
    });

    el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "transparent"; // Reset background color
        el.style.color = loopColor;
        el.style.borderColor = loopColor;
    });
});
