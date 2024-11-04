from datetime import datetime
import os
import time
import csv
import json
import copy
import pandas as pd
currTime = datetime.now()

folderName = currTime.strftime('%m-%d-%Y')
print(folderName)
currentDir = os.getcwd()

dataToSendCSV = currentDir + '/dataToSendCSV'
results = currentDir + '/results'

# Check to see if there is a new folder for the current date in the dataToSendCSV folder
# if so, convert the csv files to a json file with the text header column as the data

def make_json(csvFilePath):
    data = {}
    fileName = csvFilePath.split('.')[0].split(currentDir)[1].split('/')[-1]
    headers = []
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        data = [row for row in csvReader]

    with open(currentDir+'/dataToSend/'+fileName+'.json', 'w+') as jsonf:
        json.dump(data, jsonf)

def setupDataToSendFiles():
    currDateDataToSend = ''

    listofFilesinDTS = os.listdir(dataToSendCSV)
    for each in listofFilesinDTS: 
        if os.path.isdir(dataToSendCSV+'/'+each): 
            if each == folderName:
                currDateDataToSend = dataToSendCSV + "/" + each

    if currDateDataToSend == '': 
        time.sleep(60)
        setupDataToSendFiles()
    else: 
        for each in os.listdir(currDateDataToSend):
            make_json(currDateDataToSend+'/'+each)
        return
        
setupDataToSendFiles()
print("Experimental Setup Complete. Data Ready to parse.")

# Check to see if there is a new folder for the current date in the results folder
# if so, start grabbing the diff and output the diff csv file into a folder called 'results/today/modData'
# then, move the data just processed into a folder inside dataSent from dataToSendCSV organized by date folders

def processResults():
    resultsCurrDateFolder = ''

    for each in os.listdir(results): 
        if os.path.isdir(results+'/'+each): 
                if each == folderName:
                    resultsCurrDateFolder = results + "/" + each
    
    if resultsCurrDateFolder == '': 
        time.sleep(10)
        processResults()
    else: 
        loop = True
        while loop:
            res = list(os.listdir(dataToSendCSV+'/'+folderName))
            if len(res) > 0:
                for index, each in enumerate(os.listdir(resultsCurrDateFolder)):
                    if not os.path.isdir(resultsCurrDateFolder+'/'+each) and '_d' not in each:
                        fileNameRes = each
                        fileNameOG = [x for x in res if x.split('_')[1].split('.')[0] in each][0]
                        print(fileNameOG)

                        og_data = pd.read_csv(dataToSendCSV+'/'+ folderName +'/'+fileNameOG)
                        new_data = pd.read_csv(resultsCurrDateFolder+'/'+fileNameRes)

                        diff = {}

                        for each in og_data['text']:
                            if each not in list(new_data['message']):
                                diff[each] = 1
                            else: 
                                diff[each] = 0
                        
                        fileName = fileNameRes.split('.')[0]

                        if not os.path.exists(currentDir+'/results/'+folderName+'/modData'):
                            os.makedirs(currentDir+'/results/'+folderName+'/modData') 

                        df = pd.json_normalize(diff).T
                        df.to_csv(currentDir+'/results/'+folderName+'/modData/'+fileName+'modData.csv', encoding='utf-8')
                        print("Message diff complete.")

                        old_file = os.path.join(resultsCurrDateFolder, fileName+'.csv')
                        os.rename(old_file, os.path.join(resultsCurrDateFolder, fileName+'_d.csv'))

                temp = [each for each in os.listdir(resultsCurrDateFolder) if not os.path.isdir(resultsCurrDateFolder+'/'+each) and '_d' not in each]
                print("Waiting for updated data results...")
                time.sleep(120)
                temp2 = [each for each in os.listdir(resultsCurrDateFolder) if not os.path.isdir(resultsCurrDateFolder+'/'+each) and '_d' not in each]
                loop = temp <= temp2

processResults() 