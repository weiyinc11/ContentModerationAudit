# Documentation for Running Bots

## 1. File Structure
    |
    |___ /dataToSend : folder for storing messages to send (requires messages to be under a 'text' column)
    |       |
    |       |__ data.json
    |
    |___ data.js : file for converting csv to json files, requires you to type the path in the file to run the process
    |
    |___ bot1.js : bot as a chatting user for britishman420
    |
    |___ bot2.js : bot as a chatting user for mollykim123
    |
    |___ /resultsBot : contains files for running the results script (will expand)
    |       |
    |       |__ listener.js : file that completes verification and handles incoming POST requests
    |       |
    |       |__ tokenHandler.js : Includes Docs on token handling and info on each user account involved
    |
    |___ /results : stores json files produced from experiment

## 2. Running files

    * For Setting up the Bots, autorefresh functions within the bot files allow us to run **'node bot1.js'** and **'node bot2.js'** in split terminals to allow both bots to connect to the bb3e chat
      - To run the audit / experiments where files from the /datatoSend folder are sent into the chat, move to the bb3e chat and type in **!audit1 for 'britishman420'** and **!audit2 for 'mollykim123'**
      - *todo* : have the files that are have been run through the chat to another folder
               : need to change britishman420 to littleelly000 because I lost the login info for britishman420

    * Running Results Bot
      - No need for refreshing tokens
      - To start the process of grabbing messages from bb3e chat:
          1. Set up Ngrok - run **'brew install ngrok'** if you don't already have it installed
          2. Set up ngrok via my account - run **'ngrok config add-authtoken 2jyofp2t31yUZ368LCNVHZQBf9M_56RqVbrFxeRdLAYZWwEuT'** in the same terminal
          3. Run the static url link to http://localhost:8080 by running this command **'ngrok http --domain=touching-willingly-shiner.ngrok-free.app 8080'**
      - Split the terminal from before and run **'node listener.js'**
