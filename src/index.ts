import axios from 'axios';
import fs from 'fs';

const RestApiKey = process.env.REST_API_KEY;
const kiprisUrl = 'http://plus.kipris.or.kr';

async function getAllAppNum() {
  /**
   * `*`, ` `로 모든 특허출원번호 추출
   */
  const url = `${kiprisUrl}/kipo-api/kipi/patUtiModInfoSearchSevice/getWordSearch?word= &year=10&ServiceKey=${RestApiKey}`
}

async function getPatentFieldsByAppNum() {
  /**
   * 나머지 필드는 필요한 API 사용해서 추출
   */
}

async function getCorpInfoByAppNum() {
  /**
   * 키프리스 API에서 제공하지 않는 정보 NICE에서 추출
   */
}

(async function main() {
})()