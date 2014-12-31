a simple & fast websocket frame parser and generator separated from [RocketEngine](https://github.com/abbshr/RocketEngine)

#### Parser

`parse(buffer)`
+ params: raw buffer from TCP Socket
+ return: JSON format Object

return object:
```json
{
  frame: {
    FIN: 
    Opcode: 
    MASK: 
    Payload_len: 
    Payload_data: <Buffer>
  },

  remain: <Buffer> (remain data in @buffer)
}
```

#### Generator

`generate(frame)`
+ params: JSON format frame object
+ return: binary frame

input frame format:
```json
{
  FIN: 
  Opcode: 
  MASK: 
  [ Masking_key: <Buffer> ]
  Payload_data: <String|Buffer>
}
```
