# SA-PATENT-CRAWLER

### Introduction

POST  http://kpat.kipris.or.kr/kpat/searchLogina.do?next=MainSearch#page1
응답없음

=> 크로미움으로 추출

GET http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub01&applno=2020200003518&getType=BASE&link=N
응답있음

=> html 파싱으로 추출
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