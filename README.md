# SA-PATENT-CRAWLER

### Introduction

#### Kipris

- `POST  http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch#page1`
- 응답없음 => Chromium으로 추출
![](./docs/Kipris-01.png)

- `GET http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub01&applno=2020200003518&getType=BASE&link=N`
- 응답있음 => html 파싱으로 추출
![](./docs/Kipris-01.png)

#### DeepSearch

- 출원인번호가 `1`로 시작하는 경우 딥서치에서 해당 출원인(기업)을 Chromium으로 추출
### Installation & Execution

```sh
# common
mkdir outputs

# using npm
npm install && npm start:ch 

# using yarn
yarn && yarn start:ch
```

### Request

<!-- - 검색어별
```js
const obj = {
  keyword: '검색어'
}
```

- 날짜별
```js
const obj = {
  date: '날짜 (YYYY-MM-DD ~ YYYY-MM-DD)'
}
```

- 검색어 + 날짜별
```js
const obj = {
  keyword: '검색어',
  date: '날짜 (YYYY-MM-DD ~ YYYY-MM-DD)'
}
``` -->

### Response

#### 특허 데이터
- 응답값 중 중첩된 데이터는 `JSON.stringify()`로 문자열로 직렬화된 채로 저장됨
- 예시
```js
  let result
  // as-is
  result = [
    {
      nationality: '일본',
      publishNumber: '61144053 U',
      publishDate: '1986.09.05',
      inventionTitle: '뚜껑부 용기 ',
      ipcCode: ' B65D 45/02 '
    }
  ]

  // to-be
  result = '[{"nationality":"일본","publishNumber":"61144053 U","publishDate":"1986.09.05","inventionTitle":"뚜껑부 용기 ","ipcCode":" B65D 45/02 "}]'
  ```

```json
{
  "inventionTitle": "발명이름",
  "applicant": "출원인",
  "applicationNumber": "출원번호",
  "applicationDate": "출원일자",
  "registerStatus": "등록상태",
  "applicants": [{
    "name": "출원자명", 
    "number": "출원자번호",
    "nationality": "국적",
    "address": "주소"
  }],
  "inventors": [{
    "name": "발명자명", 
    "number": "발명자번호",
    "nationality": "국적",
    "address": "주소"
  }],
  "registerNumber": "등록번호",
  "registerDate": "등록일자",
  "astrtCont": "요약",
  "ipcs": [{
    "ipcCode": "IPC 번호", "ipcDate": "IPC 등록일"
  }],
  "cpcs": [{
    "cpcCode": "CPC 번호", "cpcDate": "CPC 등록일"
  }],
  "claims": ["청구항"],
  "claimCount": "청구항수",
  "citating": [{
    "nationality": "국적",
    "publishNumber": "공보번호",
    "publishDate": "공보일자",
    "inventionTitle": "발명이름",
    "ipcCode": "IPC 번호"
  }],
  "citated": [{
    "publishNumber": "공보번호",
    "publishDate": "공보일자",
    "inventionTitle": "발명이름",
    "ipcCode": "IPC 번호""publishNumbre"
  }],
  "familyPatents": [{
    "failyNumber": "패밀리이름", 
    "nationalityCode": "국가코드", 
    "nationality": "국적", 
    "failyType": "패밀리타입"
  }]
}
```

- csv 포맷으로는 다음과 같이 저장됨

```csv
inventionTitle;applicationNumber;applicationDate;registerStatus;applicants;inventors;registerNumber;registerDate;astrtCont;ipcs;cpcs;claims;claimCount;citating;citated;familyPatents
전자발찌(Electronic anklets);2020200003518;2020-09-28;공개;[{"name":"권정수 KWON, JONG SOO","number":"419980221873","nationality":"대한민국","address":"서울특별시 강서구"}];[{"name":"권정수KWON, JONG SOO","number":"419980221873","nationality":"대한민국","address":"서울특별시 강서구"}];;;본 고안은 전자추적장치 등이 장착된 단말기의 양쪽 연결밴드가 결속기구에 의하여 착용자의 발목에 채울 수 있는 전자발찌에...;[];[{"ipcCode":"A44C 5/00","ipcDate":"2006-01-01"}];["전자추적장치 등이 장착된 단말기(1)의 양쪽 연결밴드(2)가 결속기구(10)에 형성된 기초판(100)의 고정핀(150)의 끝단에 눌림커버(200)의 결속유니트(210)가 눌려진..."];3;[{"nationality":"대한민국","publishNumber":"2003669220000 Y1","publishDate":"2004.11.10","inventionTitle":"신체구속용 결박밴드 ","ipcCode":" E05B 75/00 "}];;
```
#### 특허데이터 중 기업데이터

- 응답값 중 중첩된 데이터는 `JSON.stringify()`로 문자열로 직렬화된 채로 저장됨
- JSON으로는 따로 저장하지 않음

```json
```

- csv 포맷으로는 다음과 같이 저장됨

```csv
registrationNumber;corporateNumber;repName;estDate
["김명선","우리경"];2019-03-04;110111-7031068;797-81-01169
["이규철"];2011-04-11;070-7456-2190;110111-4577081
["문장덕"];1995-12-01;043-213-2087;150111-0044979
["박지원","정연인"];1962-09-20;055-278-6114;194211-0000943
["박정석"];2000-02-17;043-854-3560;151111-0014707
["김재원"];;180111-0034974;608-81-16377
```

### Available Fields

- 서지정보
  - 공개번호/일자
  - 공고번호/일자
  - 국제출원번호/일자
  - 국제공개번호/일자
  - 법적상태
  - 심사진행상태
  - 심판사항
  - 구분국내출원/변경
  - 원출원번호/일자
  - 관련 출원번호
  - 기술이전 희망
  - 심사청구여부/일자
  - 심사청구항수
- 인명정보
  - 대리인
  - 최종권리자
- 행정처리
- 청구항
- 지정국
- 인용/피인용
- 패밀리정보
  - 국가별 특허문헌코드
- 국가 R&D 연구정보
  - 연구부처
  - 주관기관
  - 연구사업
  - 연구과제