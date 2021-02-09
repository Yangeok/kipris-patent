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


### Response

#### Patent Data


- 어미가 `*s`인 변수는 복수 개의 데이터를 의미합니다.
- 복수 개의 데이터를 담은 필드는 문자열 처리한 json 포맷입니다.
- python에서 사용하시려면 json을 파싱하신 후에 사용해주세요.

- 파일명 컨벤션: `patent_<start_date>_<end_date>.csv`
- applicationNumber: 출원번호
- inventionTitle: 발명명
- applicationDate: 출원일자
- registerStatus: 등록상태
- registerNumber: 등록번호
- registerDate: 등록일자
- publishNumber: 공개번호
- publishDate: 공개일자
- intlApplNumber: 국제출원번호
- intlApplDate: 국제출원일자
- intlPublishNumber: 국제공개번호
- intlPublishDate: 국제공개일자
- claimReqDate: 청구일자
- claimCount: 청구항수
- astrtCont: 요약
- applicants: 출원인 (json 타입)
  - name: 출원인명
  - number: 출원인번호
  - nationality: 출원인국적
  - address: 출원인주소
- inventors: 발명인 (json 타입)
  - name: 발명인명
  - number: 발명인번호
  - nationality: 발명인국적
  - address: 발명인주소
- claims: 청구항 (json 타입)
  - claimDescription: 청구항설명
- citatingPatents: 인용특허 (json 타입)
  - nationality: 국적
  - publishNumber: 공보번호
  - publishDate: 공보일자
  - inventionTitle: 발명명
  - ipcCode: IPC코드
- citatedPatents: 피인용특허 (json 타입)
  - applicationDate: 출원일자
  - inventionTitle: 발명명
  - ipcCode: IPC코드
- familyPatents: 패밀리특허 (json 타입)
  - number: 패밀리번호
  - nationalityCode: 국가코드
  - nationality: 패밀러특허국적
  - type: 패밀리타입

#### Corporation Data

- 어미가 `*s`인 변수는 복수 개의 데이터를 의미합니다.
- 복수 개의 데이터를 담은 필드는 문자열 처리한 json 포맷입니다.
- python에서 사용하시려면 json을 파싱하신 후에 사용해주세요.

- 파일명 컨벤션: `patent_<start_date>_<end_date>.csv`
- applicantNumber: 출원인번호
- corpNumber: 법인번호
- businessNumber: 사업자등록번호
- repName: 대표자명
- estDate: 설립일자
- address: 주소
- corpName: 법인명
- corpScale: 법인규모
- corpForm: 법인형태
- indCat: 산업분류
- nationality: 법인국적
- isExtAudit: 외감여부
- isClose: 폐업여부
- isPublic: 상장여부
- totalSales: 시가총액
- bizProfits: 매출액
- crtmNetIncome: 당기순이익
- assets: 자산
- liabilities: 부채
- capital: 자본
- employees: 종업원수

### Available Data

#### Patent Data

- 공고번호
- 공고일자
- 심판사항
- 특허구분
- 원출원번호
- 원출원일자
- 관련 출원번호
- 기술이전 희망
- 대리인
  - 출원번호
  - 이름
  - 국적
  - 주소
- 최종권리자
  - 출원번호
  - 이름
  - 국적
  - 주소
- 행정처리
  - 출원번호
  - 서류명
  - 접수일자
  - 발송일자
  - 처리상태
  - 접수번호
  - 발송번호
- 지정국
  - 출원번호
  - 구분
  - 국가명
- 국가 R&D 연구정보
  - 출원번호
  - 연구부처
  - 주관기관
  - 연구사업
  - 연구과제

#### Corporation Data

- 딥서치
  - 홈페이지
  - 전화번호
  - 주거래은행
  - 관련주제
  
- 공공데이터포털 (예정)
  - 요약재무제표조회
    - 법인등록번호
    - 사업연도
    - 재무제표구분코드
    - 재무제표구분코드명
    - 기업매출금액
    - 기업영업이익
    - 포괄손익계산금액
    - 기업당순이익
    - 기업총자산금액
    - 기업총부채금액
    - 기업총자본금액
    - 기업자본금액
    - 재무제표부채비율
  - 재무상태표조회
    - 법인등록번호
    - 사업연도
    - 재무제표구분코드
    - 재무제표구분코드명
    - 계정과목ID
    - 계정과목명
    - 당분기계정과목금액
    - 당기계정과목금액
    - 전분기계정과목금액
    - 전기계정과목금액
    - 전전기계정과목금액
  - 손익계산서조회
    - 법인등록번호
    - 사업연도
    - 재무제표구분코드
    - 재무제표구분코드명
    - 계정과목ID
    - 계정과목명
    - 당분기계정과목금액
    - 당기계정과목금액
    - 전분기계정과목금액
    - 전기계정과목금액
    - 전전기계정과목금액