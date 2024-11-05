import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';

// 패킷을 직렬화하여 특정 형식의 패킷으로 생성하는 함수
const serializer = (message, type) => {
  // 전체 패킷 길이를 담는 버퍼를 생성합니다.
  const packetLength = Buffer.alloc(TOTAL_LENGTH);

  // 패킷 길이 설정: 메시지 길이 + 총 길이(TOTAL_LENGTH) + 패킷 유형 길이(PACKET_TYPE_LENGTH)
  packetLength.writeUInt32BE(message.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);

  // 패킷 유형을 설정 이때, type 인자를 통해 지정된 패킷 유형을 설정
  packetType.writeInt8(type, 0);

  // 패킷 길이, 패킷 유형, 메시지를 하나로 합쳐 최종 패킷을 반환
  return Buffer.concat([packetLength, packetType, message]);
};
// 위치 업데이트 패킷을 생성하는 함수
export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  // 위치 업데이트를 나타내는 LocationUpdate 메시지 타입을 불러옴
  const location = protoMessages.gameNotification.LocationUpdate;
  // 위치 업데이트에 포함될 데이터를 구성
  const payload = { users };
  // payload를 LocationUpdate 메시지로 생성
  const message = location.create(payload);
  // 생성된 메시지를 프로토콜 버퍼 형식으로 인코딩하여 직렬화
  const locationPacket = location.encode(message).finish();
  // 직렬화된 메시지를 지정된 유형(PACKET_TYPE.LOCATION)으로 패킷화하여 반환
  return serializer(locationPacket, PACKET_TYPE.LOCATION);
};
// 핑(ping) 패킷을 생성하는 함수
export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const location = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = location.create(payload);
  const PingPacket = location.encode(message).finish();
  return serializer(PingPacket, PACKET_TYPE.PING);
};
