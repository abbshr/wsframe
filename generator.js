/* WebSocket Frame Generator */

var typeOf = require('../utils/typeOf.js');
/*
* @frame<JSON>: a JSON object as readable_data resolved by decoder
* return: frame<Buffer>
*/

/*
* standard input-frame format:
* {
*   FIN: ,
*   Opcode: ,
*   MASK: ,
*   [Masking_key: <Buffer>,]
*   Payload_data: <String|Buffer>
* }
*/
module.exports = function (frame) {

  // for control bit: FIN, Opcode, MASK, Payload_len
  var preBytes = [], payBytes = null, masking_key;
  // if Payload_data is a string, encode the payload_data
  if (typeOf(frame['Payload_data']) == 'string')
    payBytes = new Buffer(frame['Payload_data']);
  else if (frame['Payload_data'] instanceof Buffer)
    payBytes = frame['Payload_data'];
  else
    payBytes = new Buffer(0);

  var dataLength = payBytes.length;

  preBytes.push((frame['FIN'] << 7) + frame['Opcode']);

  if (dataLength < 126) {
    preBytes.push((frame['MASK'] << 7) + dataLength);
  } else if (dataLength < 65536) {
    preBytes.push(
      (frame['MASK'] << 7) + 126, 
      (dataLength & 0xFF00) >> 8,
      dataLength & 0xFF
    );
  } else {
    preBytes.push(
      (frame['MASK'] << 7) + 127,
      0, 0, 0, 0,
      (dataLength & 0xFF000000) >> 24,
      (dataLength & 0xFF0000) >> 16,
      (dataLength & 0xFF00) >> 8,
      dataLength & 0xFF
    );
  }

  // encode control bit data
  preBytes = new Buffer(preBytes);
  // if MASK is set, encode the Payload-data
  if (frame['MASK']) {
    masking_key = frame['Masking_key'];
    preBytes = Buffer.concat([preBytes, masking_key]);
    for (var i = 0; i < dataLength; i++) 
      payBytes[i] ^= masking_key[i % 4];
  }
  // return the raw frame
  return Buffer.concat([preBytes, payBytes]);
};