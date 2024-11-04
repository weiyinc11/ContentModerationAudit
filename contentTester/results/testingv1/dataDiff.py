import pandas as pd 

og_data = pd.read_csv('data_1.csv')
new_data = pd.read_csv('data1.csv')

print(len(og_data))
print(len(new_data))

diff = {}

for each in og_data['Example']:
    if each not in list(new_data['message']):
        diff[each] = 1
    else: 
        diff[each] = 0

