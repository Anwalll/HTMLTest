import { api } from "@hboictcloud/api";

try {
    //TODO: Pas het bestand .env en .env.production aan met de gegevens van HBO-ICT.Cloud
    api.configure({
        url: "https://api.hbo-ict.cloud",
        apiKey: "pb1d2324_afkira4.MKzowdCuqczB4VG3",
        database: "pb1d2324_afkira4_live",
        environment: "live",
    });
} catch (reason) {
    console.error(reason);
}
