document.addEventListener("DOMContentLoaded", function () {
    const scrollSections = document.querySelectorAll(".sidescrolljs");

    scrollSections.forEach((section) => {
        // Function to update scrolling
        function scrollContent(direction) {
            const scrollStep = 100; // Adjust scroll step size
            let newScrollAmount = section.scrollLeft + direction * scrollStep;

            // Ensure newScrollAmount is within valid bounds
            newScrollAmount = Math.max(0, Math.min(newScrollAmount, section.scrollWidth - section.clientWidth));

            section.scrollTo({
                left: newScrollAmount,
                behavior: "smooth",
            });
        }

        // Get the left and right scroll buttons by their specific classes
        const leftButton = section.querySelector(".js-left-scroll");
        const rightButton = section.querySelector(".js-right-scroll");

        // Assign click events to buttons for scrolling
        if (leftButton) {
            leftButton.addEventListener("click", () => scrollContent(-1));
        }
        if (rightButton) {
            rightButton.addEventListener("click", () => scrollContent(1));
        }
    });
});
    


document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.news-panel');
    
    // Add backdrop
    let backdrop = document.createElement('div');
    backdrop.classList.add('popup-backdrop');
    document.body.appendChild(backdrop);
    backdrop.style.display = 'block';

    panel.classList.add('expanded');
    document.body.classList.add('lock-scroll');

    // Close on backdrop click
    backdrop.addEventListener('click', () => {
      panel.classList.remove('expanded');
      document.body.classList.remove('lock-scroll');
      backdrop.remove();
    });
  });
});

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.news-panel');
    panel.classList.remove('expanded');
    document.body.classList.remove('lock-scroll');
    document.querySelector('.popup-backdrop')?.remove();
  });
});


  