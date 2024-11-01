import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';

const serializer = (message, type) => {
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(message.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  const message = location.create(payload);
  const locationPacket = location.encode(message).finish();
  return serializer(locationPacket, PACKET_TYPE.LOCATION);
};
