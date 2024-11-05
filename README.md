# 리얼타임과제(클라이언트와 서버 통신하기)
## 5️⃣ 일일퀘스트

<aside>
✔️

### **필수 기능 *(1~5일차)***

1일차 **프로젝트 생성 및 이벤트 별 코드 처리**

- [✔️]  프로젝트 시작
- [✔️]  소켓 이벤트 확인
- [✔️]  기능별 폴더, 파일 분리
- [✔️]  헤더 및 **패킷 구조 설계**

2일차 **환경변수 및 상수, 에러 처리**

- [✔️]  헤더 및 **패킷 구조 설계**
- [✔️]  상수 선언 및 환경 변수 세팅

3일차 **프로토콜 버퍼 적용 및 패킷 파싱**

- [✔️]  프로토콜 버퍼 적용
- [✔️]  패킷 파싱 테스트

4일차 **유저 세션 및 게임 세션 관리**

- [✔️]  유저, 게임 클래스 선언
- [✔️]  접속 시 생성 이벤트
- [✔️]  세션 관리 로직 추가

5일차 **접속 및 이동 패킷 교환**

- [✔️]  접속 패킷 추가 및 파싱 테스트
- [✔️]  클라이언트 접속 테스트
- [✔️]  이동 패킷 추가 및 파싱 테스트
- [✔️]  멀티플레이어 이동 테스트
</aside>

-----------------------------------------------

<aside>
🏆

### **도전 기능 *(6~10일차)***

6일차 **DB 연동**

- [✔️]  DB 세팅 및 (유저 정보) 데이터 모델링
- [✔️]  (서버) 접속 및 접속 해제 시 유저 정보 기록

7일차 **DB 연동(진행 예정)**

- [✔️]  (클라이언트) 코드 확인 및 수정

8일차 **레이턴시 매니저, 추측항법 적용 - 서버(진행 예정)**

- [ ]  게임 세션 별 레이턴시 매니저 추가
- [ ]  (서버) 추측항법 계산 및 적용

9일차 **핑 체크 - 클라이언트(진행 예정)**

- [ ]  (클라이언트) ping 전송 로직 추가
- [ ]  (클라, 서버) ping 테스트

10일차 **최종 확인 및 테스트**

- [ ]  테스트
</aside>

-----------------------------------------------

### 디렉토리 구조

```
.
└── src
├── classes/models // 인스턴스 class 들을 정의
│   ├── managers
│   └── models
├── config // 환경변수, DB 설정등을 선언
├── constants // 상수 관리
├── DB // db 로직 관리
│   ├── migrations
│   ├── sql
│   └── user
├── events // socket 이벤트
├── handlers // 핸들러 관리
│   ├── game
│   └── user
├── init // 서버 초기화
├── protobuf // 패킷 구조
│   ├── notification
│   ├── request
│   └── response
├── sessions // 세션 관리
└── utils // 그 외 필요한 함수들 선언
├── db
├── notification
├── parser
└── response
├── clients
├── package-lock.json
├── package.json
├── readme.md
```

### 클라이언트 패킷 구조

#### Common

    [ProtoContract]
    public class CommonPacket
    {
    [ProtoMember(1)]
    public uint handlerId { get; set; }

        [ProtoMember(2)]
        public string userId { get; set; }

        [ProtoMember(3)]
        public string version { get; set; }
    
        [ProtoMember(4)]
        public byte[] payload { get; set; }

    }

#### InitialPayload
    [ProtoContract]
    public class InitialPayload
    {
    [ProtoMember(1, IsRequired = true)]
    public string deviceId { get; set; }

        [ProtoMember(2, IsRequired = true)]
        public uint playerId { get; set; }

        [ProtoMember(3, IsRequired = true)]
        public float latency { get; set; }

}

#### LocationUpdatePayload
    [ProtoContract]
    public class LocationUpdatePayload {
    [ProtoMember(1, IsRequired = true)]
    public float x { get; set; }
    [ProtoMember(2, IsRequired = true)]
    public float y { get; set; }
    }

#### LocationUpdate
    [ProtoContract]
    public class LocationUpdate
    {
    [ProtoMember(1)]
    public List UserLocation users { get; set; }

        [ProtoContract]
        public class UserLocation
        {
            [ProtoMember(1)]
            public string id { get; set; }

            [ProtoMember(2)]
            public uint playerId { get; set; }

            [ProtoMember(3)]
            public float x { get; set; }

            [ProtoMember(4)]
            public float y { get; set; }
    }

}

#### Response

    [ProtoContract]
    public class Response {
    [ProtoMember(1)]
    public uint handlerId { get; set; }

        [ProtoMember(2)]
        public uint responseCode { get; set; }

        [ProtoMember(3)]
        public long timestamp { get; set; }

        [ProtoMember(4)]
        public byte[] data { get; set; }

    }

#### 패킷 타입
    public enum PacketType { Ping, Normal, Location = 3 }

#### 핸들러 아이디
    public enum HandlerIds {
    Init = 0,
    LocationUpdate = 2
    }
