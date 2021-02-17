from pprintpp import pprint as pp
import glob
import os
import pandas as pd

start_date = '20200101'
end_date = '20201231'

input_patent_file = f'./corp-{start_date}-{end_date}.csv'
input_corp_file = f'./corp-{start_date}-{end_date}.csv'
output_file = f'./{start_date}-{end_date}.xlsx'

dtype_conv_dict = {
    'applicantNumber': 'string',
    'corpNumber': 'string',
    'businessNumber': 'string',
    'bizProfits': 'string',
    'crtmNetIncome': 'string',
    'assets': 'string',
    'liabilities': 'string',
    'capital': 'string',
    'employees': 'string'
}

df1 = pd.read_csv(input_patent_file, delimiter=';')
df2 = pd.read_csv(input_corp_file, delimiter=';')

df = pd.merge(df1, df2, how='inner', on='applicantNumber')

pp(df)

df.to_excel(output_file, index=False, header=True)
'''
- 특허파일에 기업파일을 머지할 예정
- 특허파일을 열어서 출원인번호로 필터한 열 찾기
- 공통키를 가진 열끼리 머지
- 머지가 끝난 파일을 xlsx로 변경
'''

'''
import pyexcel

sheet = pyexcel.get_sheet(file_name="myFile.csv", delimiter=",")
sheet.save_as("myFile.xlsx")
'''
