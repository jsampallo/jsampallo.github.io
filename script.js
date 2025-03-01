const hamburger = document.querySelector(".hamburger");
const header = document.querySelector("header");
const x = document.querySelector(".x");



hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    header.classList.toggle("active");
    x.classList.toggle("active");
})

x.addEventListener("click", () => {
    hamburger.classList.remove("active");
    header.classList.remove("active");
    x.classList.remove("active");
})

document.querySelectorAll("li").forEach(n => n.addEventListener("click", ()=> {
    hamburger.classList.remove("active");
    header.classList.remove("active");
    x.classList.remove("active");
} ))