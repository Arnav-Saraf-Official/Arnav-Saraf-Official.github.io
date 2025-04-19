document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel");
  
    carousels.forEach((carousel) => {
      const track = carousel.querySelector(".carousel-track");
      const slides = Array.from(track.children);
      const nextButton = carousel.querySelector(".carousel-button.next");
      const prevButton = carousel.querySelector(".carousel-button.prev");
      const indicators = Array.from(carousel.querySelectorAll(".carousel-indicator"));
  
      let currentSlide = 0;
  
      const updateSlide = (index) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        indicators.forEach((dot, i) =>
          dot.classList.toggle("current-slide", i === index)
        );
        currentSlide = index;
      };
  
      nextButton?.addEventListener("click", () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        updateSlide(nextIndex);
      });
  
      prevButton?.addEventListener("click", () => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide(prevIndex);
      });
  
      indicators.forEach((dot, index) => {
        dot.addEventListener("click", () => updateSlide(index));
      });
  
      // Optional: Resize responsiveness
      window.addEventListener("resize", () => updateSlide(currentSlide));
  
      updateSlide(0);
    });
  });
  