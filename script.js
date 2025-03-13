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


// IDIOMAS
let language = window.navigator.language;
let lang = language.substr(0, 2);
var menuhome = document.getElementById("menuhome")



if (lang === 'es') {
    menuhome.innerHTML = "Casa";
}else{
    menuhome.innerHTML = "Home"
}