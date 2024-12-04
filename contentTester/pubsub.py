import twitchAPI.oauth
from twitchAPI.pubsub import PubSub
from twitchAPI.twitch import Twitch
from twitchAPI.helper import first
from twitchAPI.type import AuthScope
from twitchAPI.oauth import UserAuthenticator
import twitchAPI
import asyncio
from pprint import pprint
from uuid import UUID
from datetime import datetime, timedelta
import os
import json
import csv
from threading import Timer

APP_ID = '024l49so34okrye48q3uy0r7ctsi5d'
APP_SECRET = 'u7hfylduc3afka9og9lltund5w2ogl'
# USER_SCOPE = [AuthScope.WHISPERS_READ, AuthScope.MODERATOR_MANAGE_AUTOMOD]
TARGET_CHANNEL = 'hughierin'
TOKEN = "lioupdoen5j4ui2svezs3hkucn9dua"
REFRESH_TOKEN = "fhxs0ms5hjy6q31ceze3in3qqptj04xvy8udljkqj6ojwz0zu9"

msg_sent = [datetime.now(), 0]
dataSendDr = os.path.join(os.getcwd(), 'dataToSend')
def getNextfile(done_count):
    files = os.listdir(dataSendDr)
    for file in files: 
        if os.path.isfile(os.path.join(dataSendDr, file)):
            nextFile = file
            break

    if os.path.isfile(os.path.join(os.getcwd(), 'dataSendCurrNum.json')):
        data = [{"current_json":nextFile,"fileNum":done_count}]
        done_count += 1
        with open(os.path.join(os.getcwd(), 'dataSendCurrNum.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
    return nextFile

def write(fileName, data):
    now = datetime.now()
    folderName = now.strftime("%m-%d-%Y")
    todayResults = os.path.join(os.getcwd(), '/results/'+folderName)

    if os.path.isdir(todayResults):
        with open(fileName, 'w', newline='\n') as csvfile:
            fieldnames = ['name', 'branch', 'year', 'cgpa']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
    else: 
        with open(fileName, 'a') as csvfile:
            csv.write(data)
    print("CSV file written successfully! ")

async def callback_automod(uuid: UUID, data: dict) -> None:
    print('got callback for UUID ' + str(uuid))
    pprint(data)

done_count = -1
async def run_example(TOKEN, REFRESH_TOKEN):
    # setting up Authentication and getting your user id
    twitch = await Twitch(APP_ID, APP_SECRET)
    # auth = UserAuthenticator(twitch, [AuthScope.WHISPERS_READ, AuthScope.CHANNEL_MODERATE], force_verify=False)
    # token, refresh_token = await auth.authenticate()
    # print(token, refresh_token)

    # you can get your user auth token and user auth refresh token following the example in twitchAPI.oauth
    await twitch.set_user_authentication(TOKEN, [AuthScope.WHISPERS_READ, AuthScope.CHANNEL_MODERATE], REFRESH_TOKEN)
    user = await first(twitch.get_users(logins=[TARGET_CHANNEL]))

    while True:
        startTime = datetime.now()
        while((startTime + timedelta(seconds=30)) > datetime.now()):
            # starting up PubSub
            pubsub = PubSub(twitch)
            pubsub.start()
            # you can either start listening before or after you started pubsub.
            uuid = await pubsub.listen_automod_queue(user.id, user.id, callback_automod)

            input("Press enter to close: ")
            await pubsub.unlisten(uuid)
            pubsub.stop()
            await twitch.close()
            exit()
        TOKEN, REFRESH_TOKEN = await twitchAPI.oauth.refresh_access_token(REFRESH_TOKEN, APP_ID, APP_SECRET, None, 'https://id.twitch.tv/oauth2/')
        await twitch.set_user_authentication(TOKEN, [AuthScope.WHISPERS_READ, AuthScope.CHANNEL_MODERATE], REFRESH_TOKEN)
        user = await first(twitch.get_users(logins=[TARGET_CHANNEL]))
        print("Token refreshed! ")

asyncio.run(run_example(TOKEN, REFRESH_TOKEN)) 

# {'data': {'caught_message_reason': {'automod_failure': {'category': 'namecalling',
#                                                         'level': 2,
#                                                         'positions_in_message': [{'end_pos': 23,
#                                                                                   'start_pos': 0}]},
#                                     'blocked_term_failure': {'contains_private_term': False,
#                                                              'terms_found': None},
#                                     'reason': 'AutoModCaughtMessageReason'},
#           'content_classification': {'category': 'namecalling', 'level': 2},
#           'id': 'b13c3ed7-1a06-4557-a0c6-d61749d1ad3c',
#           'message': {'channel_id': '1135845304',
#                       'channel_login': 'hughierin',
#                       'content': {'fragments': [{'automod': {'topics': {'bullying': 6,
#                                                                         'identity': 5,
#                                                                         'vulgar': 6}},
#                                                  'text': 'stupid assss bitch '
#                                                          'loser'},
#                                                 {'text': ' kill yourself'}],
#                                   'text': 'stupid assss bitch loser kill '
#                                           'yourself'},
#                       'id': 'b13c3ed7-1a06-4557-a0c6-d61749d1ad3c',
#                       'non_broadcaster_language': 'en',
#                       'sender': {'display_name': 'mollykim123',
#                                  'login': 'mollykim123',
#                                  'user_id': '1103563061'},
#                       'sent_at': '2024-12-04T04:26:31.419918289Z'},
#           'reason_code': 'AutoModCaughtMessageReason',
#           'resolver_id': '',
#           'resolver_login': '',
#           'status': 'PENDING'},
#  'type': 'automod_caught_message'}

# {'data': {'caught_message_reason': {'automod_failure': {'category': 'racism',
#                                                         'level': 1,
#                                                         'positions_in_message': [{'end_pos': 4,
#                                                                                   'start_pos': 0},
#                                                                                  {'end_pos': 17,
#                                                                                   'start_pos': 13}]},
#                                     'blocked_term_failure': {'contains_private_term': False,
#                                                              'terms_found': None},
#                                     'reason': 'AutoModCaughtMessageReason'},
#           'content_classification': {'category': 'racism', 'level': 1},
#           'id': '86d8e755-1aed-475b-a014-b7a2c83c44c6',
#           'message': {'channel_id': '1135845304',
#                       'channel_login': 'hughierin',
#                       'content': {'fragments': [{'automod': {'topics': {'bullying': 5}},
#                                                  'text': 'loser'},
#                                                 {'text': ' yellow '},
#                                                 {'automod': {'topics': {'bullying': 7,
#                                                                         'identity': 7}},
#                                                  'text': 'chink'}],
#                                   'text': 'loser yellow chink'},
#                       'id': '86d8e755-1aed-475b-a014-b7a2c83c44c6',
#                       'non_broadcaster_language': 'en',
#                       'sender': {'display_name': 'mollykim123',
#                                  'login': 'mollykim123',
#                                  'user_id': '1103563061'},
#                       'sent_at': '2024-12-04T04:59:42.431116937Z'},
#           'reason_code': 'AutoModCaughtMessageReason',
#           'resolver_id': '',
#           'resolver_login': '',
#           'status': 'PENDING'},
#  'type': 'automod_caught_message'}