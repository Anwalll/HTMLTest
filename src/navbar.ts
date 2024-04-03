import { session, url } from "@hboictcloud/api";

function logout(): void {
    document.getElementById("logoutButton")?.addEventListener("click", () => {
        session.remove("user");
        url.redirect("login.html");
    });
}

logout();
const navbar: HTMLElement = document.createElement("nav");
navbar.innerHTML ="<header> <a href='./index.html'><img src='./assets/img/carepay.png' class='logo' /></a> <div class='navigation'> <a href='faq.html'>FAQ</a> <a href='bekijker.html'>Bekijker</a> <a href='event.html'>Uitje</a> <a id='logoutButton'>Logout</a> </div> </header>";
const firstElementInBody: any = document.body.firstChild;

document.body.insertBefore(navbar, firstElementInBody);

document.getElementById("logoutButton")?.addEventListener("click", function () {
    session.remove("user");
    url.redirect("login.html");
});




