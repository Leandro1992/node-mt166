# node-mt166
Node.js API to comunicate with Mingte tech MT166 RFID card collector and dispenser using node serialport 

<img width="300px" src="https://github.com/myTapp/mt166-js/blob/master/card-collector-dispenser-MT166-RF-for-both.jpg?raw=true"></img>

## Quick-start

```sh
$ npm i node-mt166
```

```javascript


const MT166 = require('node-mt166')

//Available options
const options = {
    port: 6, //default
    baudRate: 9600, //default
    callbackConnection: console.log, //default 
    autoDiscovery: false //default
}

//Static port
let dispenser = new MT166({port: 6, callbackConnection:(result) => {
    if(result.connected){
        //Your logic
    }
})

// Autodicovery Port 
let dispenser = new MT166({autoDiscovery: true, callbackConnection:(result) => {
    if(result.connected){
        //Your logic
    }
})


```

#### Building

| Dependecy  |
| ------  |
| serialport |

# Features

  - **Move To Capture Box** - Discard card
  - **Move To Read Position** - Move to reader RFID
  - **Move To Dispense Position** - Move out but not fully
  - **Card Box Status** - Check if card box is low or empty
  - **Check Card Read Position** - Check if has a card in reader position
  - **Check Card Dispense Position** - Check if has a card in reader position


## Examples

Check the 'exemple.js' file and uncomment action that you would like to test.

### Todos

See file PDF doc on root folder, in there you can see all is possible to do and get better the current implementation

 - Tests
 - Onboard RFID reader
 - Check capture box status

License
----

[MIT](https://choosealicense.com/licenses/mit/)