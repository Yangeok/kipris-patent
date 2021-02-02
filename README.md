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
    "inventionTitle": "발 명이름",
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

- `.csv` 포맷으로는 다음과 같이 저장됩니다.
- 출원인코드, 발명자, 발명자국적이 복수인 경우 `,` 구분자로 구분했습니다.
- CPC코드, IPC코드, 인용특허(IPC코드), 피인용특허(IPC코드), 패밀리특허(패밀리번호)이 복수인 경우 `,` 구분자로 구분했습니다.
- 청구항이 복수인 경우 `["", "", ...]`의 형태로 배열로 묶었습니다.

출원인코드 | 출원번호 | 출원일자 | 출원연도 | 발명의명칭 | 요약 | 청구항 | 청구항수 | 발명자명() | 발명자국적 | 등록번호 | 등록일자 | 최종처분내용 | CPC코드 | IPC코드 | 인용특허(IPC코드) | 피인용특허(IPC코드) | 패밀리특허(패밀리번호)
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
applicants | applicationNumber | applicationDate | applicationDate | inventionTitle | astrtCont | claims[i] | claimCount | inventors | inventors[i].nationality | registerNumber | registerDate | registerStatus | cpcs | ipcs | citating | citated | familyPatents
520190449335 | 2020197000055 | 2019-05-17 | 2019 | 자력 흡착형 커넥터(MAGNETIC ATTRACTION CONNECTOR) | 본 고안은 커넥터 분야에 속하고, 특히 자력 흡착형 커넥터에 관한 것이다... | 자력 흡착형 커넥터이며, 상기 자력 흡착형 커넥터는 수컷 커넥터 및 암컷 커넥터를 포함하... | 16 | 쟝더후이 | | | | 공개 | | H01R 13/6205, H01R 24/60, H01R 31/06, H01R 2107/00 | H01R 13/62, H01R 24/60, H01R 31/06, H01R 107/00 | H01R 13/11, H01R 11/30, H01R 13/62 | | CN209029597, CN209592526
419980221873, 420120691454, 420160076460 | 2020200003518 | 2020-09-28 | 2020 | 전자발찌(Electronic anklets) | 본 고안은 전자추적장치 등이 장착된 단말기의 양쪽 연결밴드가 결속기구에 의하여 착용자의 발목... | 전자추적장치 등이 장착된 단말기(1)의 양쪽 연결밴드(2)가 결속기구(10)에 형성된 기초판... | 3 | 권정수, 권민정, 권민석 | 대한민국, 대한민국, 대한민국 | | | 공개 | | | A44C 5/00, A44C 5/02, G08B 25/10, G08B 21/04 | E05B 75/00, G08B 21/18 | | |
120190151227 | 2020200003478 | 2020-09-23 | 2020 | 젤네일 스티커 보관함(CASE FOR GELNAIL STICKER) | 본 고안은 젤네일 스티커 보관함에 관한 것으로, 바닥부, 벽부 및 개폐 가능한 덮개부를 포함하는 박... | 바닥부, 벽부 및 개폐 가능한 덮개부를 포함하는 박스부 상기 박스부의 바닥면에 설치되고, 절첩 구조로 형성되는 바디부 및... | 5 | 우리경 | | | | 공개 | | A45D 29/20, A45D 29/00, B65D 5/66, B65D 75/40 | B42D 1/08, A45D 29/20 | |

#### 특허데이터 중 기업데이터

- 응답값 중 중첩된 데이터는 `JSON.stringify()`로 문자열로 직렬화된 채로 저장됨
- JSON으로는 따로 저장하지 않음

```json
```

- `.csv` 포맷으로는 다음과 같이 저장됩니다.

```csv
registrationNumber;corporateNumber;repName;estDate
김명선,우리경;2019-03-04;110111-7031068;797-81-01169
이규철;2011-04-11;070-7456-2190;110111-4577081
문장덕;1995-12-01;043-213-2087;150111-0044979
박지원,정연인;1962-09-20;055-278-6114;194211-0000943
박정석;2000-02-17;043-854-3560;151111-0014707
김재원;;180111-0034974;608-81-16377
```

기업명 | 사업자번호 | 주소 | 출원인코드 | 출원인명 | 출원인국적 | 법인번호 | 대표자명 | 설립일자
--- | --- | --- | --- | --- | --- | --- | --- | --- 
corpName | businessNumber | address | applicantNumber | applicantName | applicantNationality | corpNumber | repName | estDate
주식회사 미스터바우어 | 797-81-01169 | 서울 강남구 역삼1동 662-9번지 에프앤에프사옥 본관 2층 | 120190151227 | 주식회사 미스터바우어 | 대한민국 | 110111-7031068 | 김명선, 우리경 | 2019-03-04
(주)케이디랩 | 206-86-52610 | 경기 안양시 동안구 관양2동 1802번지 평촌오비즈타워 B동 101호, 102호 | 120130080714 | (주)케이디랩 | 대한민국 | 206-86-52610 | 이규철 | 2011-04-11
한빛이앤씨(주) | 301-81-41785 | 충북 청주시 청원구 북이면 광암리 169-3번지 | 120190479260 | 한빛이앤씨(주) | 대한민국 | 150111-0044979 | 문장덕 | 1995-12-01
두산중공업(주) | 609-81-04684 | 경남 창원시 성산구 귀곡동 555-1번지 | 119980043286 | 두산중공업(주) | 대한민국 | 194211-0000943 | 박지원,정연인 | 1962-09-20

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