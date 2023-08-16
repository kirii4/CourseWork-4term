let circle = document.querySelector(".icons__circle");
if (circle !== null && circle.innerHTML === ``) {
    circle.classList.add("icons__circle_none");
} else if (circle !== null) {
    circle.classList.remove("icons__circle_none");
}

$(function () {
    $("#burger-menu-link").on("click", function (open) {
        let menuItem = $(open.currentTarget);

        if (menuItem.attr("aria-expanded") === "true") {
            $(this).attr("aria-expanded", "false");
        } else {
            $(this).attr("aria-expanded", "true");
        }
    });
});

const profileInfoForm = document.querySelector('.profile-info__form');
const profileGuardForm = document.querySelector('.profile-guard__form');
const profileCatalogForm = document.querySelector('.profile-catalog__form');

function openTab(evt, tab) {
    let tabLinks;
    if (tab === "info") {


        tabLinks = document.getElementsByClassName("profile-list__item");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].classList.remove("active");
        }

        document.getElementById("profile-info__form").style.display = "block";
        document.getElementById("profile-guard__form").style.display = "block";
        document.getElementById("my-order").style.display = "block";
        document.getElementById("profile-catalog__form").style.display = "none";
        document.getElementById("product-catalog-show").style.display = "none";
        document.getElementById("product-order-show").style.display = "none";
        evt.currentTarget.parentElement.classList.add("active");
    } else if (tab === "catalog") {
        tabLinks = document.getElementsByClassName("profile-list__item");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].classList.remove("active");
        }

        document.getElementById("profile-info__form").style.display = "none";
        document.getElementById("profile-guard__form").style.display = "none";
        document.getElementById("my-order").style.display = "none";
        document.querySelector(".profile-catalog__form").style.display = "block";
        document.querySelector(".product-catalog-show").style.display = "block";
        document.querySelector(".product-order-show").style.display = "block";
        evt.currentTarget.parentElement.classList.add("active");
    }
}