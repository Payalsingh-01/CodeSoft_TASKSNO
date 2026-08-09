var typed = new Typed("#typed", {
  strings: ["Web Developer", "Frontend Designer", "Problem Solver", "Tech Enthusiast", "Canva Designer"],
  typeSpeed: 80,
  backSpeed: 50,
  backDelay: 1500,
  loop: true
});

const menuIcon = document.querySelector(".nav3 i");
const navLinks = document.querySelector(".nav2");

menuIcon.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
  navLinks.style.flexDirection = "column";
  navLinks.style.background = "#2c3e50";
  navLinks.style.position = "absolute";
  navLinks.style.top = "60px";
  navLinks.style.right = "20px";
  navLinks.style.padding = "10px";
});

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - 60,
      behavior: 'smooth'
    });
  });
});
