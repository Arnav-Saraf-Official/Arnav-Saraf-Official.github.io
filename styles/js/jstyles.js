// =========================
// 🔹 Helper Function: Random Color Generator
// =========================
function getRandomColor() {
    const colors = ["#7fbcff", "#ffcb74", "#5fd18c", "#ff6b6b", "#a29bfe", "#00cec9"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// =========================
// 🔥 Hover Effects
// =========================

// 1️⃣ Random Background on Hover
document.querySelectorAll(".js-bg-hover").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.backgroundColor = getRandomColor();
    });
    el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "";
    });
});

// 2️⃣ Border Pulse on Hover
document.querySelectorAll(".js-border-pulse").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.boxShadow = `0 0 10px ${getRandomColor()}`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.boxShadow = "none";
    });
});

// 3️⃣ Color Swap on Hover
document.querySelectorAll(".js-color-swap").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.color = getRandomColor();
    });
    el.addEventListener("mouseleave", () => {
        el.style.color = "";
    });
});

// 4️⃣ Text Glow on Hover
document.querySelectorAll(".js-text-glow").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.textShadow = `0px 0px 10px ${getRandomColor()}`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.textShadow = "none";
    });
});

// 5️⃣ Gradient Shift on Hover
document.querySelectorAll(".js-gradient-hover").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.background = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.background = "";
    });
});

// 6️⃣ Scale Bounce on Hover
document.querySelectorAll(".js-scale-bounce").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.1)";
    });
    el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
    });
});

// 7️⃣ Double Line Animation (Before & After)
document.querySelectorAll(".js-doubleline-hover").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.classList.add("doubleline-animate");
    });
    el.addEventListener("mouseleave", () => {
        el.classList.remove("doubleline-animate");
    });
});

// =========================
// 🔄 Looping Animations
// =========================

// 1️⃣ Pulsating Effect
document.querySelectorAll(".js-pulse-loop").forEach(el => {
    setInterval(() => {
        el.style.transform = "scale(1.05)";
        setTimeout(() => {
            el.style.transform = "scale(1)";
        }, 500);
    }, 1000);
});

// 2️⃣ Floating Animation (Subtle Up & Down)
document.querySelectorAll(".js-float-loop").forEach(el => {
    setInterval(() => {
        el.style.transform = "translateY(-0.5vh)";
        setTimeout(() => {
            el.style.transform = "translateY(0)";
        }, 1000);
    }, 2000);
});

// 3️⃣ Color Cycle Animation
document.querySelectorAll(".js-color-cycle").forEach(el => {
    setInterval(() => {
        el.style.color = getRandomColor();
    }, 1500);
});
