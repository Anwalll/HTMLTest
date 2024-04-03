import "./config";
import { api, session, url } from "@hboictcloud/api";
import "./navbar";

function security(): void {
    // Als de sessie met naam user_id niet bestaat (door de ! werkt de if als nietwaar) dan is de gebruiker niet ingelogd
    if (!session.get("user") || session.get("user") === undefined) {
        // Stuur de gebruiker door naar de login pagina
        url.redirect("login.html");
    }
}
security();

const user_ID: any = session.get("user");

function emailviewer(): void {
    api.queryDatabase(`SELECT name, eventID FROM participant WHERE id='${user_ID}'`).then((partresult) => {
        const eventIDs: any = partresult.map((participant) => participant.eventID);

        if (eventIDs.length === 0) {
            const selectEvent: any = document.getElementById("selectEvent");
            const optionEvent: any = document.createElement("option");
            optionEvent.value = "(Empty)";
            optionEvent.text = "(Empty)";
            selectEvent.appendChild(optionEvent);
            return;
        }

        api.queryDatabase(`SELECT description FROM event WHERE eventID IN (${eventIDs.join(",")})`).then(
            (descresult) => {
                const descriptions: any = descresult.map((event) => event.description);
                const selectEvent: any = document.getElementById("selectEvent");

                if (descriptions.length === 0) {
                    const optionEvent: any = document.createElement("option");
                    optionEvent.value = "(Empty)";
                    optionEvent.text = "(Empty)";
                    selectEvent.appendChild(optionEvent);
                } else {
                    for (let i: any = 0; i < descriptions.length; i++) {
                        const description: any = descriptions[i];
                        const optionEvent: any = document.createElement("option");
                        optionEvent.value = description;
                        optionEvent.text = description;
                        selectEvent.appendChild(optionEvent);
                    }
                }
            }
        );
    });
}

emailviewer();
function editEvent(): void {
    document.getElementById("viewBtn")?.addEventListener("click", function () {
        const selectEvent: any = document.getElementById("selectEvent");
        const editDiv: any = document.createElement("div");
        editDiv.class = "editDiv";
        editDiv.innerHTML = "<h1>" + selectEvent.value;
        ("</h1>");
    });
}
editEvent();

function calculatePrice(): void {
    const priceStart: number = 0;
    let list: any = {};
    let total: number = 0;
    let participantsAmount: number = 0;
    const viewbtn: any = document.getElementById("viewBtn");
    const balanceContainer: any = document.getElementById("Balance");

    viewbtn.addEventListener("click", function () {
        balanceContainer.style.display = "block";
        const selectEvent: any = document.getElementById("selectEvent");
        if (selectEvent.value === "(Empty)") {
            alert("Geen uitje om te bewerken.");
            const history: any = document.querySelector(".divform");
            history.remove();
            return;
        }

        api.queryDatabase(`SELECT eventID FROM event WHERE description='${selectEvent}'`).then(
            (eventresult) => {
                const eventId: any = eventresult.map((event) => event.eventID);
                api.queryDatabase(`SELECT * FROM participant WHERE eventId = "${eventId}"`).then(
                    (results) => {
                        results.forEach((participant: any) => {
                            list[participant.name] = priceStart;
                            participantsAmount += 1;
                        });
                        api.queryDatabase(`SELECT * FROM payment WHERE eventId = "${eventId}"`).then(
                            (result) => {
                                result.forEach((payment: any) => {
                                    const payer: any = payment.name;
                                    if (list.hasOwnProperty(payer)) {
                                        list[payer] += payment.amount;
                                    }
                                });
                                for (const name in list) {
                                    const amount: any = list[name];
                                    total += amount;
                                }
                                const totalTag: any = document.createElement("h3");
                                totalTag.textContent = "In totaal: " + total;
                                balanceContainer!.appendChild(totalTag);
                                totalTag.style.color = "green";

                                const average: any = total / participantsAmount;
                                for (const name in list) {
                                    const amount: any = list[name];
                                    const newAmount: any = average - amount;
                                    if (newAmount < 0) {
                                        const balanceTag: any = document.createElement("h3");
                                        balanceTag.textContent =
                                            name + " moet " + Math.abs(newAmount).toFixed(2) + " krijgen";
                                        balanceContainer!.appendChild(balanceTag);
                                    } else {
                                        const balanceTag: any = document.createElement("h3");
                                        balanceTag.textContent =
                                            name + " moet " + newAmount.toFixed(2) + " betalen";
                                        balanceContainer!.appendChild(balanceTag);
                                        balanceTag.style.color = "red";
                                    }
                                }
                            }
                        );
                    }
                );
            }
        );
    });
}

calculatePrice();

function saveEvent(): any {
    const currentdate: any = new Date().toISOString().substr(0, 10);
    const dsInput: any = document.getElementById("descriptionInput");
    document.getElementById("saveKnop")?.addEventListener("click", function () {
        console.log("hallo");
       api.queryDatabase(`INSERT INTO event (description, dateCreated) VALUES ('${dsInput.value}', '${currentdate}')`);
       api.queryDatabase(`INSERT INTO participant (id)`)
    });
}
saveEvent();
