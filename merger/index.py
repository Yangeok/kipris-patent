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
input_finance_file = f'./finance-{start_date}-{end_date}.csv'

output_xl_file = f'./{start_date}-{end_date}.xlsx'
output_csv_file = f'./{start_date}-{end_date}.csv'

df1 = pd.read_csv(input_patent_file, delimiter=';')
df2 = pd.read_csv(input_corp_file, delimiter=';')
df3 = pd.read_csv(input_finance_file, delimiter=';')

# 파일 병합
# df = reduce(lambda df_left,df_right: pd.merge(df_left, df_right, left_index=True, right_index=True, how='outer'), dfs).fillna('')
merged1 = pd.merge(df1, df2, how='outer', on='applicantNumber')
merged2 = pd.merge(merged1, df3, how='outer', on='applicantNumber')

# 중복열 제거
res = merged2.drop_duplicates(keep='first')

# 타입 통일
res[[col for col in res.columns if res[col].dtypes == object]] = res[[
    col for col in res.columns if merged2[col].dtypes == object]].astype('string')
# res[[col for col in res.columns if res[col].dtypes == 'int64']] = res[[
#     col for col in res.columns if merged2[col].dtypes == 'int64']].astype('string')
# res[[col for col in res.columns if res[col].dtypes == 'float64']] = res[[
#     col for col in res.columns if merged2[col].dtypes == 'float64']].astype('string')

# 파일 저장
res.to_csv(output_csv_file, index=False, header=True)
res.to_excel(output_xl_file, index=False, header=True)
