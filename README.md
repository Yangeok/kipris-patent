# SA-PATENT-CRAWLER

### Installation & Execution

#### Installation

```sh
# common
mkdir outputs # csv 파일 만들 폴더

# using npm
npm install && npm start # 실행 스크립트 

# using yarn
yarn && yarn start # 실행 스크립트
```

#### Execution

```ts
// crawler/src/index.ts

(...)

const startDate = '20200501' // 수집 시작날짜
const endDate = '20200630' // 수집 종료날짜
(...)
const startPage = 40 // /current_page.log 기준으로 재시도 가능
```

### Response

#### Patent Data

- 파일명 컨벤션: `patent_<start_date>_<end_date>.csv`
- inventionTitle: 발명명
- applicationNumber: 출원번호
- applicationDate: 출원일자
- registerStatus: 등록상태
- registerNumber: 등록번호
- registerDate: 등록일자
- publishNumber: 공개번호
- publishDate: 공개일자
<!-- - intlApplNumber: 국제출원번호
- intlApplDate: 국제출원일자
- intlPublishNumber: 국제공개번호
- intlPublishDate: 국제공개일자 -->
- claimReqDate: 청구일자
- claimCount: 청구항수
- applicantName: 출원인명
- ipcCode_n: IPC코드
- cpcCode_n: CPC코드
- citatingIpcCode_n: 인용특허 IPC코드
- citatedIpcCode_n: 피인용특허 IPC코드
- familyNumber_n: 패밀리특허번호
<!-- - applicantNumber: 출원인번호
- citatingPatents: 인용특허 (json 타입)
  - nationality: 국적
  - publishNumber: 공보번호
  - publishDate: 공보일자
  - inventionTitle: 발명명
  - ipcCode: IPC코드
- cpcs: CPC (json 타입)
  - code: CPC 코드
  - date: CPC 일자
- ipcs: IPC (json 타입)
  - code: IPC 코드
  - date: IPC 일자
- citatedPatents: 피인용특허 (json 타입)
  - applicationDate: 출원일자
  - inventionTitle: 발명명
  - ipcCode: IPC코드
- familyPatents: 패밀리특허 (json 타입)
  - number: 패밀리번호
  - nationalityCode: 국가코드
  - nationality: 패밀러특허국적
  - type: 패밀리타입 -->

#### Corporation Data

- 파일명 컨벤션: `corp_<start_date>_<end_date>.csv`
- applicantNumber: 출원인번호
- corpNumber: 법인번호
<!-- - businessNumber: 사업자등록번호
- repName: 대표자명
- estDate: 설립일자 -->
- corpName: 법인명
- corpScale: 법인규모
- corpForm: 법인형태
- indCat: 산업분류
- nationality: 법인국적
- isExtAudit: 외감여부
- isClose: 폐업여부
- isPublic: 상장여부
- revenue: 매출액 
- salesCost: 매출원가 
- sellingAndAdmnstExp: 판매비와관리비 
- nonOprtIncome: 영업외수익 
- profit_yyyy: 수익
- grossProfitLoss_yyyy: 매출총이익(손실)
- operatingProfitLoss_yyyy: 영업이익(손실)
- poofitBeforeIncomeTaxLos_yyyys: 법인세비용차감전계속사업이익(손실)
- incomeTaxExp_yyyy: 계속영업손익법인세비용(부의법인세비용)
- continuingOperatingProfitLoss_yyyy: 계속영업이익(손실)
- discontinuedOperatingProfitLoss_yyyy: 중단영업이익(손실)
- totalNetIncome_yyyy: 총당기순이익
- otherComprehensiveIncome_yyyy: 기타포괄손익
- comprehensiveIncome_yyyy: 포괄손익
- currentAssets_yyyy: 유동자산
- nonCurrentAssets_yyyy: 비유동자산
- currentLiabilities_yyyy: 유동부채
- nonCurrentLiabilities_yyyy: 비유동부채
- totalAassets_yyyy: 자산총계
- totalLiabilities_yyyy: 부채총계
- totalEquity_yyyy: 자본총계
- totalLiabilitiesAndEquity_yyyy: 부채와자본총계