import pandas as pd 

og_data = pd.read_csv('data_1.csv')
new_data = pd.read_csv('data0.csv')

print(len(og_data))
print(len(new_data))

for each in og_data['Example']:
    if each not in list(new_data['message']):
        print(each)

