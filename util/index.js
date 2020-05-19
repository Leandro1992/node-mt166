const Util = {

  //Response message mapper
  DISPENSER_STATUS_BOX_EMPTY: 0b10000000,
  DISPENSER_STATUS_CARD_AT_DISPENSE: 0b01000000,
  DISPENSER_STATUS_CARD_AT_READ: 0b00100000,
  DISPENSER_STATUS_CARD_SHORTAGE: 0b00010000,
  DISPENSER_STATUS_DISPENSING_CARD: 0b00001000,
  DISPENSER_STATUS_ACCEPTING_CARD: 0b00000100,
  DISPENSER_STATUS_DISPENSING_ERROR: 0b00000010,
  DISPENSER_STATUS_CARD_TIMEOUT: 0b00000001,
  RETURN_OPERATION_FAILED: 0x4E,
  RETURN_OPERATION_SUCCEED: 0x59,
  RETURN_NAK: 0x15,

  readPosition: () => Buffer.from([0x2, 0x0, 0x2, 0X31, 0x30, 0x3, 0x2]),

  dispensePosition: () => Buffer.from([0x2, 0x0, 0x2, 0X31, 0x31, 0x3, 0x3]),

  dispenseToOut: () => Buffer.from([0x2, 0x0, 0x2, 0X31, 0x32, 0x3, 0x0]),

  discard: () => Buffer.from([0x2, 0x0, 0x2, 0x33, 0x30, 0x3, 0x0]),

  checkCardAtDispensePosition: () => Buffer.from([0x2, 0x0, 0x2, 0X32, 0x30, 0x3, 0x1]),

  checkIfBoxIsEmpty: () => Buffer.from([0x2, 0x0, 0x2, 0x32, 0x30, 0x3, 0x1]),

  checkIfBoxIsPreEmpty: () => Buffer.from([0x2, 0x0, 0x2, 0x32, 0x30, 0x3, 0x1]),

  checkCardReadPostion: () => Buffer.from([0x2, 0x0, 0x2, 0x32, 0x30, 0x3, 0x1]),

  checkCardDispensePostion: () => Buffer.from([0x2, 0x0, 0x2, 0x32, 0x30, 0x3, 0x1]),

  //TODO You can do the real calc of buffer commands, you can do this using doc available on this repo.
  calcBuffer: (command) => {
    return "TODO"
  },

  handleWinPorts: port => `COM${port}`,

  //TODO
  handleLinuxPorts: port => `/tty/${port}`
}

module.exports = Util;