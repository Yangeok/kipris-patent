from functools import reduce
from pprintpp import pprint as pp
import glob
import os
import pandas as pd
import numpy as np
from pandas import json_normalize

start_date = '20200101'
end_date = '20201231'

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
  'businessNumber': str
}

df1 = pd.read_csv(input_patent_file, delimiter=';', dtype=df1_dtype)
df2 = pd.read_csv(input_corp_file, delimiter=';', dtype=df2_dtype)

# 파일 병합
df = pd.merge(df1, df2, how='outer', on='applicantNumber')

# 타입 통일
df[[col for col in df.columns if df[col].dtypes == object]] = df[[
    col for col in df.columns if df[col].dtypes == object]].astype('string')
df[[col for col in df.columns if df[col].dtypes == 'int64']] = df[[
    col for col in df.columns if df[col].dtypes == 'int64']].astype('string')
df[[col for col in df.columns if df[col].dtypes == 'float64']] = df[[
    col for col in df.columns if df[col].dtypes == 'float64']].astype('string')

# 파일 저장
df.to_csv(output_csv_file, index=False, header=True, sep=';')
df.to_excel(output_xl_file, index=False, header=True)
