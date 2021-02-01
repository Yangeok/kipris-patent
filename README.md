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

```js
const obj = {
  // getDataSummary
  inventionTitle: '발명이름',
  applicant: '출원인',
  applicationNumber: '출원번호',
  applicationDate: '출원일자',
  astrtCont: '요약',
  registerStatus: '등록상태',
  ipcCode: 'IPC번호',

  // getDataDetail
  // 서지정보
  ipcCodes: ['IPC번호'],
  cpcCodes: ['CPC번호'],
  applicationNumber: '출원번호',
  applicationDate: '출원일자',
  registerNumber: '등록번호',
  registerDate: '등록일자',
  openNumber: '공개번호', 
  openDate: '공개일자',
  noticeNumber: '공보번호', 
  noticeDate: '공보일자',
  intlApplicationNumber: '국제출원번호', 
  intlApplicationDate: '국제출원일자',
  intlOpenNumber: '국제공개번호', 
  intlOpenDate: '국제공개일자',
  legalStatus: '법적상태',
  reviewStatus: '심사진행상태',
  judgeMatter: '심판사항',
  division: '구분',
  initialApplicationNumber: '원출원번호', 
  initialApplicationDate: '원출원일자',
  Number:'관련 출원번호', 
  : '기술이전 희망',
  : '심사청구여부',
  : '심사청구일자'
  : '심사청구항수'
  : '요약'

  // 인명정보
  applicants: [
    {
      name: '출원인명',
      number: '출원인번호',
      nationality: '출원인국적',
      address: '출원인주소'
    }
  ],
  inventors: [
    {
      name: '발명자명',
      number: '발명자번호',
      nationality: '발명자국적',
      address: '발명자주소'
    }
  ],
  attorneys: [
    {
      name: '대리인명',
      number: '대리인번호',
      nationality: '대리인국적',
      address: '대리인주소'
    }
  ],
  rightful: {
    name: '권리자명',
    nationality: '권리자국적',
    address: '권리자주소'
  },

  // 행정처리
  ['서류명', '접수/발송일자', '처리상태', '접수/발송번호']

  // 청구항
  ['청구항']

  // 지정국
  
  // 인용/피인용
  '인용'
  '국가', '공보번호', '공보일자', '발명의명칭', 'IPC'
  
  '피인용'
  '출원번호', '출원일자', '발명의명칭', 'IPC'
  
  // 패밀리정보
  '국가별 특허문헌코드'
  ['패밀리번호', '국가코드', '국가명', '종류']
  'DOCDB 패밀리정보'
  ['패밀리번호', '국가코드', '국가명', '종류']

  // 국가 R&D 연구정보
  ['연구부처', '주관기관', '연구사업', '연구과제']
}
```