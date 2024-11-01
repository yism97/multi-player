import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
import { getHandlerById } from '../handler/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 헤더의 전체 길이 (패킷 전체 길이 + 패킷 유형 길이)
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

  // 버퍼에 처리 가능한 데이터가 남아 있는 동안 반복
  while (socket.buffer.length > totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(TOTAL_LENGTH);

    // 버퍼에 현재 패킷을 처리할 충분한 데이터가 있는지 확인
    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);
      try {
        // 패킷 유형에 따라 적절한 처리 수행
        switch (packetType) {
          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload } = packetParser(packet);

            const handler = getHandlerById(handlerId);

            handler({ socket, userId, payload });
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // 버퍼에 충분한 데이터가 없는 경우 루프 종료
      break;
    }
  }
};
