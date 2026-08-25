/* =========================================================
   🧬 HUMAN BODY EXPLORER
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   🌙 DARK MODE
========================================================= */

const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeButton.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});


/* =========================================================
   REMEMBER USER'S THEME
========================================================= */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeButton.textContent = "☀️";

}


/* =========================================================
   🔎 SEARCH SYSTEMS
========================================================= */

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const systemCards = document.querySelectorAll(".system-card");


function searchSystems() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    systemCards.forEach(function (card) {

        const cardText =
            card.textContent.toLowerCase();


        if (cardText.includes(searchText)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* Search button */

searchButton.addEventListener(
    "click",
    searchSystems
);


/* Search while typing */

searchInput.addEventListener(
    "input",
    searchSystems
);


/* =========================================================
   ⌨️ ENTER KEY SEARCH
========================================================= */

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchSystems();

        }

    }
);


/* =========================================================
   🎯 CARD HOVER EFFECT
========================================================= */

systemCards.forEach(function (card) {

    card.addEventListener("mouseenter", function () {

        card.style.cursor = "pointer";

    });

});


/* =========================================================
   🚀 PAGE LOADED
========================================================= */

console.log(
    "🧬 Human Body Explorer loaded successfully!"
);
