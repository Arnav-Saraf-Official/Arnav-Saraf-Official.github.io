document.addEventListener("DOMContentLoaded", function () {
    const scrollSections = document.querySelectorAll(".sidescrolljs");

    scrollSections.forEach((section) => {
        let scrollAmount = 0;
        section.style.overflow = "hidden"; // Hide default scrollbar

        section.addEventListener("wheel", (event) => {
            event.preventDefault(); // Prevent default scrolling behavior
            scrollAmount += event.deltaY * 0.8; // Adjust speed

            // Limit scrolling to section width
            scrollAmount = Math.max(
                0,
                Math.min(scrollAmount, section.scrollWidth - section.clientWidth)
            );

            section.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        });
    });
});
