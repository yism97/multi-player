import { CLIENT_VERSION } from '../../constants/env.js';
import { getProtoTypeNameByHandlerId } from '../../handler/index.js';
import { getProtoMessages } from '../../init/loadProto.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const commonPacket = protoMessages.common.Packet;
  let packet;
  try {
    packet = commonPacket.decode(data);
  } catch (e) {
    console.error(e);
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.version;

  if (clientVersion !== CLIENT_VERSION) {
    throw Error();
  }
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw Error();
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const payloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = payloadType.decode(packet.payload);
  } catch (e) {
    console.log(e);
  }

  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields > 0) {
    throw Error();
  }
  return { handlerId, userId, payload };
};
