const SerialPort = require('serialport')
const Util = require('./util/');

class MT166 {
    constructor(options) {
        let default_options = {
            port: 6,
            baudRate: 9600,
            callbackConnection: console.log, // Send this if you must know when is connected!
        }
        this.connected = false;
        this.reading = false;
        this.options = Object.assign(default_options, options)
        this.port = new SerialPort(Util.handleWinPorts(this.options.port), { baudRate: this.options.baudRate, autoOpen: false })
        if (options.autoDiscovery) {
            this.autoDiscoveryConnection(1, 20);
        } else {
            this.port.open((err) => this.options.callbackConnection({ success: false, connected: false, info: err }));
            this.port.on('open', () => {
                this.connected = true;
                this.options.callbackConnection({ success: true, connected: true, info: "System is ready!" });
                this.port.on('error', (data) => {
                    this.connected = false;
                    this.options.callbackConnection({ success: false, connected: false, info: "Lost Port Connection!" });
                })
            })
        }
    }

    autoDiscoveryConnection(startPort, endPort) {
        console.log(`Staring Port Scan...`)
        if(this.port) {
            this.port.removeAllListeners("open");
            this.port.removeAllListeners("error");
        }
        console.log(`Trying to connect in port #${startPort}...`)
        this.options.port = startPort;
        this.port = new SerialPort(Util.handleWinPorts(startPort), { baudRate: this.options.baudRate, autoOpen: false })
        this.port.open((err) => {
            if (err) {
                console.log(`Error opening port ${startPort}: ${err}`)
                if (startPort == endPort) {
                    console.log(`There is no device recognized!`)
                } else {
                    this.autoDiscoveryConnection(startPort + 1, endPort)
                }
            }
        })
        this.port.on('open', () => {
            this.connected = true;
            console.log(`Connected to Port #${startPort}!, Trying send command to test if is dispesner device..`);
            this.sendCommand(Util.checkCardAtDispensePosition()).then((data) => {
                console.log(`Connection completed on port #${startPort} response data: ${data}`);
                this.options.callbackConnection({ success: true, connected: true, info: "System is ready!" });
            }).catch((err) => {
                console.log(`It is not our hardware on port ${startPort}: ${err}`)
                if (startPort == endPort) {
                    console.log(`There is no device recognized!`)
                    this.options.callbackConnection({ success: false, connected: false, info: "There is no device recognized!" });
                } else {
                    this.autoDiscoveryConnection(startPort + 1, endPort)
                }
            })
            this.port.on('error', (data) => {
                this.connected = false;
                this.options.callbackConnection({ success: false, connected: false, info: "Lost Port Connection!" });
            })
        })
    }

    checkBufferResult(buffer, compare) {
        if (buffer[5] & compare) {
            return true;
        }
        return false;
    }

    checkStock() {
        return new Promise((resolve, reject) => {
            let stock = { empty: false, ending: false };
            this.sendCommand(Util.checkIfBoxIsPreEmpty()).then((data) => {
                stock.ending = this.checkBufferResult(data, Util.DISPENSER_STATUS_CARD_SHORTAGE);
                stock.empty = this.checkBufferResult(data, Util.DISPENSER_STATUS_BOX_EMPTY);
                resolve({ success: true, data: stock });
            }).catch(reject)
        })
    }

    allowCard() {
        return new Promise((resolve, reject) => {
            this.sendCommand(Util.allowCard()).then((data) => {
                resolve({ success: true, data: data });
            }).catch(reject)
        })
    }


    readingPosition() {
        return new Promise((resolve, reject) => {
            this.checkStock().then((stock) => {
                if (stock.success && !stock.data.empty) {
                    this.sendCommand(Util.readPosition()).then((data) => {
                        if (this.checkBufferResult(data, Util.RETURN_OPERATION_SUCCEED)) {
                            resolve({ success: true, data: { info: "Card on the read position", stock: stock.data } });
                        } else {
                            resolve({ success: false, data: { info: "Error send card to read position", stock: stock.data } });
                        }
                    }).catch(reject);
                } else {
                    resolve({ success: false, data: { info: "Stock is empty!", stock: stock.data } })
                }
            }).catch(reject);
        })
    }

    readingPositionIsOccupied() {
        return new Promise((resolve, reject) => {
            this.sendCommand(Util.checkCardReadPostion()).then((data) => {
                if (this.checkBufferResult(data, Util.DISPENSER_STATUS_CARD_AT_READ)) {
                    resolve({ success: true, data: { info: "Card on the read position" } })
                } else {
                    resolve({ success: false, data: { info: "No card on the read position" } })
                }
            }).catch(reject);
        })
    }

    finalPosition(force) {
        return new Promise((resolve, reject) => {
            this.checkStock().then((stock) => {
                if (stock.success && !stock.data.empty || force) {
                    this.sendCommand(Util.dispensePosition()).then((data) => {
                        if (this.checkBufferResult(data, Util.RETURN_OPERATION_SUCCEED)) {
                            resolve({ success: true, data: { info: "Card on the dispense position", stock: stock.data } });
                        } else {
                            resolve({ success: false, data: { info: "Error send card to dispense position", stock: stock.data } });
                        }
                    }).catch(reject);
                } else {
                    resolve({ success: false, data: { info: "Stock is empty!", stock: stock.data } })
                }
            }).catch(reject);
        })
    }

    sendCardToOut(force) {
        return new Promise((resolve, reject) => {
            this.checkStock().then((stock) => {
                if (stock.success && !stock.data.empty || force) {
                    this.sendCommand(Util.dispenseToOut()).then((data) => {
                        if (this.checkBufferResult(data, Util.RETURN_OPERATION_SUCCEED)) {
                            resolve({ success: true, data: { info: "Card sended to out", stock: stock.data } });
                        } else {
                            resolve({ success: false, data: { info: "Error send card to out", stock: stock.data } });
                        }
                    }).catch(reject);
                } else {
                    resolve({ success: false, data: { info: "Stock is empty!", stock: stock.data } })
                }
            }).catch(reject);
        })
    }

    finalPositionIsOccupied() {
        return new Promise((resolve, reject) => {
            this.sendCommand(Util.checkCardDispensePostion()).then((data) => {
                if (this.checkBufferResult(data, Util.DISPENSER_STATUS_CARD_AT_DISPENSE)) {
                    resolve({ success: true, data: { info: "Card on the dispense position" } })
                } else {
                    resolve({ success: false, data: { info: "No card on the dispense position" } })
                }
            }).catch(reject);
        })
    }

    discard() {
        return new Promise((resolve, reject) => {
            this.readingPositionIsOccupied().then(isOccupied => {
                if (isOccupied.success) {
                    this.sendCommand(Util.discard()).then((data) => {
                        if (this.checkBufferResult(data, Util.RETURN_OPERATION_SUCCEED)) {
                            resolve({ success: true, data: { info: "Card moved to down box!" } });
                        } else {
                            resolve({ success: false, data: { info: "Error on move card to down box" } });
                        }
                    }).catch(reject);
                } else {
                    resolve({ success: true, data: { info: "There is no card to discard!" } })
                }
            }).catch(reject);
        })
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (this.reading) {
                reject({ success: false, data: { reading: true, info: "Transmiting data, try again later" } });
            } else {
                this.port.removeAllListeners("error");
                this.port.removeAllListeners("once");
                this.reading = true;
                this.port.flush();
                this.port.write(command);
                this.port.once('data', (data) => {
                    this.reading = false;
                    resolve(data);
                });
                this.port.once('error', (err) => {
                    this.reading = false;
                    this.options.callbackConnection({ success: false, connected: false, info: "Lost Port Connection!" });
                    reject({ success: false, data: err });
                });
            }
            let wait = setTimeout(() => {
                this.reading = false;
                clearTimeout(wait);
                reject({ success: false, data: "Timeout connection, probably unconnected or without response from hardware!" });
            }, 5000)
        });
    }
}

module.exports = MT166


