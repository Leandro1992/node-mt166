
const MT166 = require('./index.js')
let dispenserAvailable = false;
let dispenser = new MT166({
    port: 6, callbackConnection: (result) => {
        console.log(result)
        if (result.connected) {
            console.log("Connected")
            dispenserAvailable = true;

            //All responses of promises follow the partern: {success: true/false, data: obj/int/bool/string}

            //Ceck stock status
            // dispenser.checkStock().then((data) => {
            //     console.log(data)
            // }).catch(console.log);

            //Send to read position
            // dispenser.readingPosition().then((data) => {
            //     console.log(data)
            // }).catch(console.log);


            // Check card on read position
            // dispenser.readingPositionIsOccupied().then((data) => {
            //     console.log(data)
            // }).catch(console.log);

            //Send to dispense position
            // dispenser.finalPosition().then((data) => {
            //     console.log(data)
            // }).catch(console.log);

            //Check card on dispense position
            // dispenser.finalPositionIsOccupied().then((data) => {
            //     console.log(data)
            // }).catch(console.log);

            //Discard card
            // dispenser.discard().then((data) => {
            //     console.log(data)
            // }).catch(console.log);

            //Send card to out
            // dispenser.sendCardToOut().then((data) => {
            //     console.log(data.data)
            // }).catch(console.log);

            // Deny Card
            dispenser.allowCard().then((data) => {
                console.log(data.data)
            }).catch(console.log);

        }
    }
});