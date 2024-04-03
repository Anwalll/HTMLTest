/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from "@hboictcloud/api";

try {
    api.configure({
        url: "https://api.hbo-ict.cloud",
        apiKey: "pb1d2324_afkira4.MKzowdCuqczB4VG3",
        database: "pb1d2324_afkira4_live",
        environment: "live",
    });
} catch (reason) {
    console.error(reason);
}

function getCurentPage() {
    const currentpagelink = window.location.href;
    const splittedpage = currentpagelink.split("/");
    const pageindex = splittedpage.length;
    return splittedpage[pageindex - 1];
}
function checkPage() {
    const currentpage = getCurentPage();
    if (currentpage === "bekijker.html") {
        addPayment();
        history();
        deleteEvent();
        calculatePrice();
        saveEvent();
    }
    if (currentpage === "register.html") {
        register();
    }
}
checkPage();

function saveEvent() {
    document.getElementById("dateInput").value = new Date().toISOString().substr(0, 10);

    document.getElementById("saveKnop").addEventListener("click", function () {
        console.log("hallo");
        const emailInvoer = document.getElementById("emailInput").value;
        const eInvoer = document.getElementById("textInput").value;
        const dInvoer = document.getElementById("dateInput").value;

        api.queryDatabase(
            `INSERT INTO event (description, dateCreated) VALUES ('${eInvoer}', '${dInvoer}')`
        ).then(() => {
            api.queryDatabase(`SELECT userID, username FROM user WHERE email='${emailInvoer}'`).then(
                (IDresult) => {
                    const userID = IDresult.map((user) => user.userID);
                    const username = IDresult.map((user) => user.username);
                    console.log(userID);
                    console.log(username);
                    api.queryDatabase(`SELECT eventID FROM event WHERE description='${eInvoer}'`).then(
                        (eventResult) => {
                            const eventID = eventResult.map((event) => event.eventID);
                            console.log(eventID);
                            alert("Event aangemaakt!");
                            api.queryDatabase(
                                `INSERT INTO participant (eventID, name, userID) VALUES ('${eventID}','${username}','${userID}')`
                            );
                        }
                    );
                }
            );
        });
    });
}
    
function addParticipant() {
    const partAdd = document.getElementById("partAdd");
    partAdd.addEventListener("click", function () {
        const newPart = document.getElementById("newPart").value;
        const selectEvent = document.getElementById("selectEvent").value;
        api.queryDatabase(`SELECT eventID FROM event WHERE description='${selectEvent}'`).then(
            (eventresult) => {
                const eventID = eventresult.map((event) => event.eventID);
                api.queryDatabase(`SELECT userID,username FROM user WHERE email='${newPart}'`).then(
                    (userresult) => {
                        const userID = userresult.map((user) => user.userID);
                        const username = userresult.map((user) => user.username);
                        api.queryDatabase(`INSERT INTO participant (eventID,name,userID) VALUES ('${eventID}','${username}','${userID}')`);
                        alert("toegevoegd!");
                    }
                );
            }
        );
    });
}

function emailviewer() {
    const eventlist = document.querySelector(".eventlist");
    const viewerBtn = document.getElementById("viewerBtn");
    viewerBtn.addEventListener("click", function () {
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput").value;
        api.queryDatabase(`SELECT username,password FROM user WHERE email= '${emailInput.value}'`).then(
            (userresult) => {
                const username = userresult.map((user) => user.username)[0];
                const password = userresult.map((user) => user.password)[0];
                api.queryDatabase(`SELECT name, eventID FROM participant WHERE name='${username}'`).then(
                    (partresult) => {
                        const partname = partresult.map((participant) => participant.name)[0];
                        const eventIDs = partresult.map((participant) => participant.eventID);
                        if (partname.includes(username) && passwordInput === password) {
                            const maildiv = document.getElementById("mail+btn");
                            maildiv.style.display = "none";
                            eventlist.style.display = "block";
                            api.queryDatabase(
                                `SELECT description FROM event WHERE eventID IN (${eventIDs.join(",")})`
                            ).then((descresult) => {
                                const descriptions = descresult.map((event) => event.description);
                                const selectEvent = document.getElementById("selectEvent");

                                for (let i = 0; i < descriptions.length; i++) {
                                    const description = descriptions[i];
                                    const optionEvent = document.createElement("option");
                                    optionEvent.id = "optionID";
                                    optionEvent.value = description;
                                    optionEvent.text = description;
                                    selectEvent.appendChild(optionEvent);
                                }
                            });
                        }
                    }
                );
            }
        );
    });
}

function formPrompt() {
    const viewbtn = document.getElementById("viewbtn");
    const eventlist = document.querySelector(".eventlist");
    const balanceForm = document.getElementById("Balance");
    const editForm = document.getElementById("editForm");
    const editbtn = document.getElementById("editbtn");
    viewbtn.addEventListener("click", function () {
        eventlist.style.display = "none";
        balanceForm.style.display = "block";
    });
    editbtn.addEventListener("click", function () {
        editForm.style.display = "block";
        balanceForm.style.display = "none";
        userEdit();
    });
}

function userEdit() {
    const optionSelect = document.getElementById("selectEvent").value; //uitjenaam pakken
    api.queryDatabase(`SELECT eventID FROM event WHERE description='${optionSelect}'`).then((eresult) => {
        const optionresult = eresult.map((event) => event.eventID); //eventIDs
        api.queryDatabase(`SELECT name FROM participant WHERE eventID=${optionresult}`).then((nresult) => {
            const nameresult = nresult.map((participant) => participant.name); //alle participants
            console.log(nameresult);
            const namecontainer = document.getElementById("name-container"); //nieuwe spans aanmaken
            const eventcontainer = document.getElementById("event-container");
            const eventh1 = document.createElement("h1");
            let eventName = document.createTextNode(optionSelect);
            eventh1.appendChild(eventName);
            eventcontainer.appendChild(eventh1);
            nameresult.forEach((name) => {
                const createNames = document.createElement("p");
                let nameSpan = document.createTextNode(name);
                createNames.id = "personname";
                createNames.appendChild(nameSpan);
                namecontainer.appendChild(createNames);
                document.getElementById("editbtn").addEventListener("click", function () {
                    eventcontainer.innerHTML = "";
                    namecontainer.innerHTML = "";
                });
            });
        });
    });
}

function addPayment() {
    const addPayment = document.getElementById("addPayment");
    const currentdate = new Date().toISOString().substr(0, 10);
    addPayment.addEventListener("click", function () {
        const emailInput = document.getElementById("emailInput").value;
        api.queryDatabase(`SELECT username FROM user WHERE email='${emailInput}'`).then((emailresult) => {
            const emailoutput = emailresult.map((user) => user.username);
            const optionselect = document.getElementById("selectEvent").value;
            api.queryDatabase(`SELECT eventID FROM event WHERE description ='${optionselect}'`).then(
                (idresult) => {
                    const idoutput = idresult.map((event) => event.eventID);
                    const receiptInput = document.getElementById("receiptInput").value;
                    const paymentInput = document.getElementById("paymentInput").value;
                    if (receiptInput !== "" && paymentInput !== "") {
                        api.queryDatabase(
                            `INSERT INTO payment (datePaid ,description ,amount ,eventId, name) VALUES ('${currentdate}', '${receiptInput}', '${paymentInput}', '${idoutput}', '${emailoutput}') `
                        );
                        console.log("gelukt");
                    } else {
                        alert("Vul de velden in");
                    }
                }
            );
        });
    });
}

function history() {
    const balanceBtn = document.getElementById("balanceBtn");
    const viewbtn = document.getElementById("viewbtn");
    const editForm = document.getElementById("editForm");
    const balanceForm = document.getElementById("Balance");
    const backbtn = document.getElementById("backbtn");
    viewbtn.addEventListener("click", function () {
        const eventInput = document.getElementById("selectEvent").value;
        api.queryDatabase(`SELECT eventID FROM event WHERE description='${eventInput}'`).then((eresult) => {
            const IDresult = eresult.map((event) => event.eventID);
            api.queryDatabase(`SELECT amount,description,name FROM payment WHERE eventID='${IDresult}'`).then(
                (paymentresult) => {
                    const geschiedenis = paymentresult.map(
                        (payment) =>
                            payment.name + " heeft €" + payment.amount + " voor " + payment.description
                    );
                    geschiedenis.forEach((historytxt) => {
                        const createHistory = document.createElement("p");
                        let textSpan = document.createTextNode(historytxt);
                        createHistory.appendChild(textSpan);
                        balanceForm.appendChild(createHistory);
                    });
                    balanceBtn.addEventListener("click", function () {
                        editForm.style.display = "none";
                        balanceForm.style.display = "block";
                    });
                    backbtn.addEventListener("click", function () {
                        editForm.style.display = "flex";
                        balanceForm.style.display = "block";
                    });
                }
            );
        });
    });
}

function calculatePrice() {
    const priceStart = 0;
    let list = {};
    let total = 0;
    let participantsAmount = 0;
    const viewbtn = document.getElementById("viewbtn");
    const balanceContainer = document.getElementById("Balance");
    viewbtn.addEventListener("click", function () {
        balanceContainer.style.display = "block";
        const selectEvent = document.getElementById("selectEvent").value;
        api.queryDatabase(`SELECT eventID FROM event WHERE description='${selectEvent}'`).then(
            (eventresult) => {
                const eventId = eventresult.map((event) => event.eventID);
                api.queryDatabase(`SELECT * FROM participant WHERE eventId = "${eventId}"`).then((results) => {
                    results.forEach((participant) => {
                        list[participant.name] = priceStart;
                        participantsAmount += 1;});
                    const sqlPayment = `SELECT * FROM payment WHERE eventId = "${eventId}"`;
                    api.queryDatabase(sqlPayment).then((result) => {
                        result.forEach((payment) => {
                            const payer = payment.name;
                            if (list.hasOwnProperty(payer)) {
                                list[payer] += payment.amount;
                            }
                        });
                        for (const name in list) {
                            const amount = list[name];
                            total += amount;
                        }
                        const totalTag = document.createElement("h3");
                        totalTag.textContent = "In totaal: " + total;
                        balanceContainer.appendChild(totalTag);
                        totalTag.style.color = "green";

                        const average = total / participantsAmount;
                        for (const name in list) {
                            const amount = list[name];
                            const newAmount = average - amount;
                            if (newAmount < 0) {
                                const balanceTag = document.createElement("h3");
                                balanceTag.textContent =
                                    name + " moet " + Math.abs(newAmount).toFixed(2) + " krijgen";
                                balanceContainer.appendChild(balanceTag);
                            } else {
                                const balanceTag = document.createElement("h3");
                                balanceTag.textContent = name + " moet " + newAmount.toFixed(2) + " betalen";
                                balanceContainer.appendChild(balanceTag);
                                balanceTag.style.color = "red";
                            }
                        }
                    });
                });
            }
        );
    });
}

function deleteEvent() {
    const deletebtn = document.getElementById("deleteBtn");
    deletebtn.addEventListener("click", function () {
        const eventlist = document.querySelector(".eventlist");
        const selectEvent = document.getElementById("selectEvent").value;
        deletebtn.style.display = "none";
        const confirmbtn = document.createElement("button");
        confirmbtn.className = "confirmbtn";
        confirmbtn.textContent = "Confirm";
        eventlist.appendChild(confirmbtn);
        const declinebtn = document.createElement("button");
        declinebtn.className = "declinebtn";
        declinebtn.textContent = "Decline";
        document.body.appendChild(declinebtn);
        confirmbtn.addEventListener("click", function () {
            api.queryDatabase(`DELETE FROM event WHERE description=('${selectEvent}')`);
        });
        declinebtn.addEventListener("click", function () {
            declinebtn.style.display = "none";
            confirmbtn.style.display = "none";
            deletebtn.style.display = "block";
        });
    });
}
