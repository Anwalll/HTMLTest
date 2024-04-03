
import "./config";
import { api, session, url } from "@hboictcloud/api";
import { User } from "./models/user";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
async function setup(): Promise<void> {
    // Kijk of de gebruiker is ingelogd anders mag je hier niet komen.
    security();
    const userId: number = session.get("user");

    if (userId) {
        const user: User | undefined = await getUserInfo(userId);

        if (user) {
            // Laat gegevens op website zien
            document.querySelector(".firstname")!.textContent = "Voornaam:" + user.firstname;
            document.querySelector(".lastname")!.textContent = "Achternaam:" + user.lastname;
            document.querySelector(".email")!.textContent = "Email:" + user.email;
            document.querySelector(".username")!.textContent = "Gebruikersnaam:" + user.username;

            // Call profielVeranderen function with user information
            profielVeranderen(userId, user.username, user.email, user.firstname, user.lastname);
        } else {
            console.error("User data not found.");
        }
    }
}

/**
 * Check if the user is logged in
 * De methode geeft niets terug (void) en heeft daarom geen return statement
 */
function security(): void {
    // Als de sessie met naam user_id niet bestaat (door de ! werkt de if als nietwaar) dan is de gebruiker niet ingelogd
    if (!session.get("user") || session.get("user") === undefined) {
        // Stuur de gebruiker door naar de login pagina
        url.redirect("login.html");
    }
}

/**
 * Haal alle gegevens van de gebruiker op uit de database
 * @param id
 * @returns user object
 */
async function getUserInfo(userid: number): Promise<User | undefined> {
    try {
        const data: any = await api.queryDatabase("SELECT * FROM user WHERE id = ?", userid);

        console.log("database gegevens", data);

        if (data.length > 0) {
            const user: User = new User(
                data[0]["id"],
                data[0]["username"],
                data[0]["email"],
                data[0]["firstname"],
                data[0]["lastname"],
                data[0]["pfp"]
            );
            return user;
        }
        return undefined;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function profielVeranderen(userId: any, username: string, email: string, firstname: string, lastname: string): Promise<void> {
    const profielWijzigen: any = document.getElementById("profielWijzigen");

    const firstnameInput: any = document.getElementById("firstnameInput") as HTMLInputElement;
    const lastnameInput: any = document.getElementById("lastnameInput") as HTMLInputElement;
    const usernameInput: any = document.getElementById("usernameInput") as HTMLInputElement;
    const emailInput: any = document.getElementById("emailInput") as HTMLInputElement;
    firstnameInput.value = firstname;
    lastnameInput.value = lastname;
    usernameInput.value = username;
    emailInput.value = email;

    profielWijzigen!.addEventListener("click", async function () {
        if (
            firstnameInput.value !== "" &&
            lastnameInput.value !== "" &&
            usernameInput.value !== "" &&
            emailInput.value !== ""
        ) {
            try {
                await api.queryDatabase(
                    `UPDATE user SET username="${usernameInput.value}", email="${emailInput.value}", firstname="${firstnameInput.value}", lastname="${lastnameInput.value}" WHERE id='${userId}'`
                );
                alert("Succesvol gegevens gewijzigd!");
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Er is een fout opgetreden bij het bijwerken van het profiel.");
                window.location.reload();
            }
        } else {
            alert("Een of meer velden zijn leeg!");
        }
    });
}
await setup();




document.getElementById("editPF")?.addEventListener("click", function () {
    const userData: any = document.getElementById("userData");
    const editUserData: any = document.getElementById("editUserData");
    userData.style = "display: none;";
    editUserData.style = "display: flex";
});
document.getElementById("backPF")?.addEventListener("click", function () {
    const userData: any = document.getElementById("userData");
    const editUserData: any = document.getElementById("editUserData");
    userData.style = "display: block";
    editUserData.style = "display: none";
});


document.getElementById("logoutButton")?.addEventListener("click", function () {
    session.remove("user");
    url.redirect("login.html");
});
