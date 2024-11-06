import net from 'net';
import { v4 as uuidv4 } from 'uuid';
import { getProtoMessages, loadProtos } from './src/init/loadProto.js';

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;
let clientCount = 0;

// 패킷 타입 정의
const PACKET_TYPE = {
  PING: 0,
  NORMAL: 1,
  LOCATION: 3,
};

const CLIENT_VERSION = '1.0.0'; // 클라이언트 버전 (예시)

class Client {
  _protoMessages = getProtoMessages();
  _socket;
  _id;
  _latency;
  _latencyInterval;
  _locationInterval;
  _framerate;
  _x;
  _y;
  buffer = Buffer.alloc(0);
  _userId = ''; // 서버로부터 받은 userId 저장
  _speed = 3; // 초당 3칸 이동
  _direction; // 이동 방향 (라디안 단위)

  constructor(id) {
    this._socket = new net.Socket();
    this._id = id;
    this._latency = this._generateInitialLatency();
    this._framerate = this._generateInitialFramerate();
    this._x = 0;
    this._y = 0;
    this._direction = this._generateInitialDirection();
  }

  _generateInitialLatency() {
    // 초기 레이턴시 값을 50ms에서 150ms 사이로 설정
    return 250 + Math.random() * 500;
  }

  _generateInitialFramerate() {
    // 프레임레이트를 10fps에서 30fps 사이로 설정
    return 10 + Math.random() * 20;
  }

  _generateInitialDirection() {
    // 0에서 2π 사이의 임의의 방향 설정
    return Math.random() * 2 * Math.PI;
  }

  _updateLatency() {
    // 레이턴시를 약간씩 변동시켜 실제 환경과 유사하게 만듦
    const variation = (Math.random() - 0.5) * 10; // ±5ms 변동
    this._latency = Math.max(50, Math.min(150, this._latency + variation));
  }

  _updateFramerate() {
    // 프레임레이트를 약간씩 변동시킴
    const variation = (Math.random() - 0.5) * 5; // ±2.5fps 변동
    this._framerate = Math.max(10, Math.min(30, this._framerate + variation));
  }

  _changeDirection() {
    // 일정 확률로 방향 변경
    if (Math.random() < 0.1) {
      this._direction = Math.random() * 2 * Math.PI;
    }
  }

  init() {
    // 소켓 연결 및 이벤트 핸들러 설정
    this._socket.connect(PORT, HOST, () => {
      console.log(`Client ${this._id} connected to ${HOST}:${PORT}`);
      console.log(`Total: ${++clientCount}`);

      // 초기 패킷 전송
      this._sendInitialPacket();

      // 레이턴시 업데이트 타이머 시작
      this._latencyInterval = setInterval(() => {
        this._updateLatency();
      }, 3000); // 1초마다 레이턴시 업데이트
    });

    // 데이터 수신 이벤트 핸들러 설정
    this._socket.on('data', (data) => {
      this._handleServerData(data);
    });

    // 에러 이벤트 핸들러 설정
    this._socket.on('error', (err) => {
      console.error(`Client ${this._id} encountered error:`, err);
    });

    // 연결 종료 이벤트 핸들러 설정
    this._socket.on('close', () => {
      console.log(`Client ${this._id} coneection cloesed`);
      clearInterval(this._latencyInterval);
      clearInterval(this._locationInterval);
    });
  }

  _sendInitialPacket() {
    const protoMessages = this._protoMessages;
    console.log(protoMessages);
    const InitialPayload = protoMessages.initial.InitialPayload;

    const initialPayload = {
      deviceId: this._id,
      playerId: Math.floor(Math.random() * 4),
      latency: this._latency,
    };

    const payloadBuffer = InitialPayload.encode(initialPayload).finish();

    const handlerId = 0; // 초기 패킷에 대한 handlerId (서버와 약속된 값)
    const version = CLIENT_VERSION;

    const Packet = protoMessages.common.Packet;
    const packetMessage = Packet.create({
      handlerId,
      userId: '', // 초기에는 빈 문자열
      version,
      payload: payloadBuffer,
    });

    const packetBuffer = Packet.encode(packetMessage).finish();

    // 패킷 전체 길이 및 타입 추가
    const packetType = PACKET_TYPE.NORMAL; // 초기 패킷은 NORMAL 타입으로 전송
    const packetLength = 4 + 1 + packetBuffer.length; // length (4 bytes) + type (1 byte) + packet

    const buffer = Buffer.alloc(packetLength);
    buffer.writeUInt32BE(packetLength); // 패킷 전체 길이
    buffer.writeUInt8(packetType, 4); // 패킷 타입
    packetBuffer.copy(buffer, 5); // 패킷 내용 복사

    this._socket.write(buffer);
    console.log(`Client ${this._id} sent initial packet`);
  }

  _handleServerData(data) {
    // 수신된 데이터를 버퍼에 추가
    this.buffer = Buffer.concat([this.buffer, data]);

    // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
    const totalHeaderLength = 4 + 1; // lenght (4 bytes) + type (1 byte)

    while (this.buffer.length >= totalHeaderLength) {
      // 1. 패킷 길이 정보 수신 (4바이트)
      const length = this.buffer.readUInt32BE(0);

      // 2. 패킷 타입 정보 수신 (1바이트)
      const packetType = this.buffer.readUInt8(4);

      if (this.buffer.length >= length) {
        // 패킷 데이터를 자르고 버퍼에서 제거
        const packet = this.buffer.slice(5, length);
        this.buffer = this.buffer.slice(length);

        switch (packetType) {
          case PACKET_TYPE.PING:
            {
              // 서버에서 온 핑 패킷을 그대로 다시 보냄 (역직렬화 없이)
              setTimeout(() => {
                const pingBuffer = Buffer.alloc(length);
                //헤더 포함 전체 패킷을 복사하여 그대로 다시 보냄
                data.copy(pingBuffer, 0, 0, length);
                this._socket.write(pingBuffer);
              }, this._latency);
            }
            break;
          case PACKET_TYPE.NORMAL: {
            // Response 패킷 처리
            const protoMessages = this._protoMessages;
            const Response = protoMessages.response.Response;

            let responseMessage;
            try {
              responseMessage = Response.decode(packet);
            } catch (err) {
              console.error(err);
              break;
            }

            const handlerId = responseMessage.handlerId;
            const responseCode = responseMessage.responseCode;
            const timestamp = responseMessage.timestamp;
            const dataBuffer = responseMessage.data;

            if (handlerId === 0 && responseCode === 0) {
              // 초기 패킷에 대한 응답 처리
              // dataBuffer 에서 userId 추출 (예시로 UTF-8 문자열로 가정)
              this._userId = JSON.parse(dataBuffer.toString('utf-8')).userId;

              //위치 업데이트 시작
              this._startLocationUpdates();
            } else {
              // 다른 응답 처리
              console.log(`Client ${this._id} received response for handlerId ${handlerId}`);
            }
          }
          case PACKET_TYPE.LOCATION:
            {
              // console.log(`location update completed`);
            }
            break;
          default:
            console.log(`Client ${this._id} received unknown packet type: ${packetType}`);
            break;
        }
      } else {
        // 아직 전체 패킷이 도착하지 않음
        break;
      }
    }
  }

  _startLocationUpdates() {
    // 위치 업데이트 타이머 시작
    const updateInterval = 1000 / this._framerate; // 밀리초 단위

    this._locationInterval = setInterval(() => {
      this._updateFramerate();
      clearInterval(this._locationInterval);
      this._startLocationUpdates(); // 프레임 레이트 변경 반영을 위해 재귀적으로 호출

      this._changeDirection(); // 방향 변경

      this._sendLocationUpdate();
    }, updateInterval);
  }

  _sendLocationUpdate() {
    if (!this._userId) {
      // 아직 userId를 받지 못한 경우, 위치 업데이트를 하지 않음
      return;
    }

    // 레이턴시 만큼 딜레이 후 위치 업데이트 패킷 전송
    setTimeout(() => {
      // deltaTime 계산 (초 단위)
      const deltaTime = 1 / this._framerate;

      // 이동 거리 계산
      const distance = this._speed * deltaTime;

      // 위치 업데이트
      this._x += distance * Math.cos(this._direction);
      this._y += distance * Math.sin(this._direction);

      const protoMessages = this._protoMessages;
      const LocationUpdatePayload = protoMessages.game.LocationUpdatePayload;
      const locationPayload = LocationUpdatePayload.create({
        x: this._x,
        y: this._y,
      });
      const payloadBuffer = LocationUpdatePayload.encode(locationPayload).finish();

      const handlerId = 2; // 위치 업데이트에 대한 handlerId (서버와 약속된 값)
      const version = CLIENT_VERSION;

      const Packet = protoMessages.common.Packet;
      const packetMessage = Packet.create({
        handlerId,
        userId: this._userId,
        version,
        payload: payloadBuffer,
      });

      const packetBuffer = Packet.encode(packetMessage).finish();

      // 패킷 전체 길이 및 타입 추가
      const packetType = PACKET_TYPE.NORMAL;
      const packetLength = 4 + 1 + packetBuffer.length;

      const buffer = Buffer.alloc(packetLength);
      buffer.writeUint32BE(packetLength, 0); // 패킷 전체 길이
      buffer.writeUint8(packetType, 4); // 패킷 타입
      packetBuffer.copy(buffer, 5); // 패킷 내용 복사

      this._socket.write(buffer);
    }, this._latency);
  }
}

// *  --------------------------------------------------------------

(async () => {
  await loadProtos();
  let LIMIT = 30;
  let dummies = [];

  for (let i = 0; i < LIMIT; i++) {
    const deviceId = uuidv4().slice(0, 5);
    console.log('deviceId =>> ', deviceId);
    const dummy = new Client(deviceId);
    dummies.push(dummy);
    dummy.init();
  }

  console.log(`${LIMIT}개의 클라이언트가 추가되었습니다.`);
})();
