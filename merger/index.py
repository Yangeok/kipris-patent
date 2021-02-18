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
df1 = pd.read_csv(input_patent_file, delimiter=';')
df2 = pd.read_csv(input_corp_file, delimiter=';')

# 파일 병합
df = pd.merge(df1, df2, how='inner', on='applicantNumber')

# 중복열 제거
res = df.drop_duplicates(keep='first')

# 타입 통일
res[[col for col in res.columns if res[col].dtypes == object]] = res[[
    col for col in res.columns if df[col].dtypes == object]].astype('string')
res[[col for col in res.columns if res[col].dtypes == 'int64']] = res[[
    col for col in res.columns if df[col].dtypes == 'int64']].astype('string')
res[[col for col in res.columns if res[col].dtypes == 'float64']] = res[[
    col for col in res.columns if df[col].dtypes == 'float64']].astype('string')

# 파일 저장
res.to_csv(output_csv_file, index=False, header=True)
res.to_excel(output_xl_file, index=False, header=True)
