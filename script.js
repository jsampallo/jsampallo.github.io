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
let language = navigator.language;
let lang = language.substr(0, 2);
var menuhome = document.getElementById("menuhome")
var menuabout = document.getElementById("menuabout")
var menuwork = document.getElementById("menuwork")
var menucontact = document.getElementById("menucontact")
var desc = document.getElementById("desc")



if (lang === 'es') {
    menuhome.innerHTML = "Inicio";
    menuabout.innerHTML = "Sobre Mí";
    menuwork.innerHTML = "Trabajos";
    menucontact.innerHTML = "Contacto";
    desc.innerHTML = "Soy diseñador visual<br>de productos digitales";
}else{}