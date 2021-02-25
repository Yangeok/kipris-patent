from functools import reduce
from pprintpp import pprint as pp
import glob
import os
import pandas as pd
import numpy as np
from pandas import json_normalize

start_date = '20200501'
end_date = '20200630'

input_patent_file = f'./patent-{start_date}-{end_date}.csv'
input_corp_file = f'./corp-{start_date}-{end_date}.csv'

output_xl_file = f'./{start_date}-{end_date}.xlsx'
output_csv_file = f'./{start_date}-{end_date}.csv'

df1_dtype = {
  'applicationNumber': str, 
  'applicantNumber': str, 
  'registerNumber': str, 
  'publishNumber': str, 
  'intlApplNumber': str, 
  'intlPublishNumber': str,
  'claimCount': str
}
df2_dtype = {
  'corpNumber': str, 
  'applicantNumber': str, 
  'applicantNumber.1': str, 
  'businessNumber': str,

  'revenue_2019': str,
  'revenue_2018': str,
  'revenue_2017': str,
  'revenue_2016': str,
  'revenue_2015': str,
  
  'salesCost_2019': str,
  'salesCost_2018': str,
  'salesCost_2017': str,
  'salesCost_2016': str,
  'salesCost_2015': str,
  
  'sellingAndAdmnstExp_2019': str,
  'sellingAndAdmnstExp_2018': str,
  'sellingAndAdmnstExp_2017': str,
  'sellingAndAdmnstExp_2016': str,
  'sellingAndAdmnstExp_2015': str,
  
  'nonOprtIncome_2019': str,
  'nonOprtIncome_2018': str,
  'nonOprtIncome_2017': str,
  'nonOprtIncome_2016': str,
  'nonOprtIncome_2015': str,
  
  'profit_2019': str,
  'profit_2018': str,
  'profit_2017': str,
  'profit_2016': str,
  'profit_2015': str,
  
  'grossProfitLoss_2019': str,
  'grossProfitLoss_2018': str,
  'grossProfitLoss_2017': str,
  'grossProfitLoss_2016': str,
  'grossProfitLoss_2015': str,
  
  'operatingProfitLoss_2019': str,
  'operatingProfitLoss_2018': str,
  'operatingProfitLoss_2017': str,
  'operatingProfitLoss_2016': str,
  'operatingProfitLoss_2015': str,
  
  'profitBeforeIncomeTaxLoss_2019': str,
  'profitBeforeIncomeTaxLoss_2018': str,
  'profitBeforeIncomeTaxLoss_2017': str,
  'profitBeforeIncomeTaxLoss_2016': str,
  'profitBeforeIncomeTaxLoss_2015': str,
  
  'incomeTaxExp_2019': str,
  'incomeTaxExp_2018': str,
  'incomeTaxExp_2017': str,
  'incomeTaxExp_2016': str,
  'incomeTaxExp_2015': str,
  
  'continuingOperatingProfitLoss_2019': str,
  'continuingOperatingProfitLoss_2018': str,
  'continuingOperatingProfitLoss_2017': str,
  'continuingOperatingProfitLoss_2016': str,
  'continuingOperatingProfitLoss_2015': str,
  
  'discontinuedOperatingProfitLoss_2019': str,
  'discontinuedOperatingProfitLoss_2018': str,
  'discontinuedOperatingProfitLoss_2017': str,
  'discontinuedOperatingProfitLoss_2016': str,
  'discontinuedOperatingProfitLoss_2015': str,
  
  'totalNetIncome_2019': str,
  'totalNetIncome_2018': str,
  'totalNetIncome_2017': str,
  'totalNetIncome_2016': str,
  'totalNetIncome_2015': str,
  
  'otherComprehensiveIncome_2019': str,
  'otherComprehensiveIncome_2018': str,
  'otherComprehensiveIncome_2017': str,
  'otherComprehensiveIncome_2016': str,
  'otherComprehensiveIncome_2015': str,
  
  'comprehensiveIncome_2019': str,
  'comprehensiveIncome_2018': str,
  'comprehensiveIncome_2017': str,
  'comprehensiveIncome_2016': str,
  'comprehensiveIncome_2015': str,

  'currentAssets_2019': str,
  'currentAssets_2018': str, 
  'currentAssets_2017': str, 
  'currentAssets_2016': str, 
  'currentAssets_2015': str, 
  
  'nonCurrentAssets_2019': str,
  'nonCurrentAssets_2018': str,
  'nonCurrentAssets_2017': str,
  'nonCurrentAssets_2016': str,
  'nonCurrentAssets_2015': str,
  
  'currentLiabilities_2019': str,
  'currentLiabilities_2018': str, 
  'currentLiabilities_2017': str, 
  'currentLiabilities_2016': str, 
  'currentLiabilities_2015': str, 
  
  'nonCurrentLiabilities_2019': str,
  'nonCurrentLiabilities_2018': str,
  'nonCurrentLiabilities_2017': str,
  'nonCurrentLiabilities_2016': str,
  'nonCurrentLiabilities_2015': str,
  
  'totalAssets_2019': str,
  'totalAssets_2018': str,
  'totalAssets_2017': str,
  'totalAssets_2016': str,
  'totalAssets_2015': str,
  
  'totalLiabilities_2019': str,
  'totalLiabilities_2018': str,
  'totalLiabilities_2017': str,
  'totalLiabilities_2016': str,
  'totalLiabilities_2015': str,
  
  'totalEquity_2019': str,
  'totalEquity_2018': str,
  'totalEquity_2017': str,
  'totalEquity_2016': str,
  'totalEquity_2015': str,
  
  'totalLiabilitiesAndEquity_2019': str,
  'totalLiabilitiesAndEquity_2018': str,
  'totalLiabilitiesAndEquity_2017': str,
  'totalLiabilitiesAndEquity_2016': str,
  'totalLiabilitiesAndEquity_2015': str,
}

df1 = pd.read_csv(input_patent_file, delimiter=';', dtype=df1_dtype)
df2 = pd.read_csv(input_corp_file, delimiter=';', dtype=df2_dtype)

# 파일 병합
df = pd.merge(df1, df2, how='outer', on='applicantNumber').drop_duplicates(keep='first')

# 타입 통일
df[[col for col in df.columns if df[col].dtypes == object]] = df[[
    col for col in df.columns if df[col].dtypes == object]].astype('string')
df[[col for col in df.columns if df[col].dtypes == 'int64']] = df[[
    col for col in df.columns if df[col].dtypes == 'int64']].astype('string')
df[[col for col in df.columns if df[col].dtypes == 'float64']] = df[[
    col for col in df.columns if df[col].dtypes == 'float64']].astype('string')

# TODO: 필드 삭제 `applicantName`, ..?

# 파일 저장
df.to_csv(output_csv_file, index=False, header=True, sep=';')
df.to_excel(output_xl_file, index=False, header=True)
