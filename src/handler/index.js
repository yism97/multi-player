import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPayload',
  },
};
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw Error();
  }
  return handlers[handlerId].handler;
};
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw Error();
  }
  return handlers[handlerId].protoType;
};
