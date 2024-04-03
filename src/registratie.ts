
import { api, url} from "@hboictcloud/api";
import "./config";


function registreren(): void {
    // Stuurt registratie naar de database
    const knop: any = document.getElementById("registreerknop") as HTMLButtonElement;
    knop.addEventListener("click", function () {
        const email: string = (document.getElementById("email") as HTMLInputElement).value;
        const password: string = (document.getElementById("password") as HTMLInputElement).value;
        const username: string = (document.getElementById("username") as HTMLInputElement).value;
        const firstname: string = (document.getElementById("firstname") as HTMLInputElement).value;
        const lastname: string = (document.getElementById("lastname") as HTMLInputElement).value;

        if (email === "" || password === "" || username === ""|| firstname === ""|| lastname === "") { // Kijkt of alles wel is ingevuld of niet.
            alert("Vul alle velden in om te registreren.");
        } else {
            const sqlQuery: string = `INSERT INTO user (email, password, username, firstname, lastname) VALUES ('${email}','${password}', '${username}', '${firstname}', '${lastname}')`;
            api.queryDatabase(sqlQuery);
            alert("Registratie is gelukt.");
            url.redirect("login.html");
        }
    });
}

registreren();