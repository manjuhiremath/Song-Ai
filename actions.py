
from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import logging
import soundcloud
from pyDes import *
import base64
import random

logger = logging.getLogger(__name__)


class SongMachine(object):
    def __init__(self):
      self.client_id = '8BBZpqUP1KSN4W6YB64xog2PX4Dw98b1'

    def decrypt_url(self,url):
      des_cipher = des(b"38346591", ECB, b"\0\0\0\0\0\0\0\0",pad=None, padmode=PAD_PKCS5)
      enc_url = base64.b64decode(url.strip())
      dec_url = des_cipher.decrypt(enc_url, padmode=PAD_PKCS5).decode('utf-8')
      return dec_url
    
    def fetchSong(self,song):
        try:
          req = requests.get('https://www.jiosaavn.com/api.php?__call=autocomplete.get&_marker=0&query='+song+'&ctx=android&_format=json&_marker=0')
          resonse = req.json()
          songs_data = resonse['songs']['data']

          if songs_data != []:
            song_id = songs_data[0]['id']
            title = songs_data[0]['title']
            data = requests.get('https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids='+song_id)
            data = data.json()
            encrypted_url = data[song_id]['encrypted_media_url']
            return {'url':self.decrypt_url(encrypted_url),'title':title}
          
          else:
            client = soundcloud.Client(client_id=self.client_id)
            tracks = client.get('/tracks', q=song,limit=1)
            stream_url = client.get(tracks[0].stream_url, allow_redirects=False)
            return {'url':stream_url.location,'title':tracks[0].title}
            
        except:
          return {'url':'','title':''}

        
class ActionFetchSong(Action):

    def name(self) -> Text:
        return "action_play_song"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        song_name = tracker.get_slot('song_name')
        if song_name is not None:
          machine = SongMachine()
          data = machine.fetchSong(song_name)
          if data['url'] is not '':
            dispatcher.utter_message("Here's your song")
            dispatcher.utter_message('Title: '+ song_name)
            dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
          else:
            dispatcher.utter_message("I couldn't find the song you asked for.")
        else:
          dispatcher.utter_message("Unable to respond at the movement")
        
        return []
    
class ActionFetchKannadaSadSongs(Action):
    def name(self) -> Text:
        return "action_fetch_kannada_sad_songs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        song_names = ['Neeralli Sanna(Duet Version)', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
            # song_names = ['Neeralli Sanna(Duet Version)', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
        if song_names:
            song = random.choice(song_names)
            # song = song_names
            machine = SongMachine()
            data = machine.fetchSong(song)
            if data['url']:
                dispatcher.utter_message("Here's your song")
                dispatcher.utter_message('Title: ' + song)
                dispatcher.utter_custom_json({"payload": 'audio', "url": data['url'], 'title': data['title']})
            else:
                dispatcher.utter_message("I couldn't find the song you asked for.")
        else:
            dispatcher.utter_message("Unable to respond at the moment")

        return []

class ActionFetchKannadaAngrySongs(Action):
    def name(self) -> Text:
        return "action_fetch_kannada_angry_songs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        song_names = ['Sadillade', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
  
            # song_names = ['Neeralli Sanna(Duet Version)', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
        if song_names:
            song = random.choice(song_names)
            # song = song_names
            machine = SongMachine()
            data = machine.fetchSong(song)
            if data['url']:
                dispatcher.utter_message("Here's your song")
                dispatcher.utter_message('Title: ' + song)
                dispatcher.utter_custom_json({"payload": 'audio', "url": data['url'], 'title': data['title']})
            else:
                dispatcher.utter_message("I couldn't find the song you asked for.")
        else:
            dispatcher.utter_message("Unable to respond at the moment")

        return []

class ActionFetchKannadaCalmSongs(Action):
    def name(self) -> Text:
        return "action_fetch_kannada_calm_songs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        song_names = ['Sadillade', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
  
            # song_names = ['Neeralli Sanna(Duet Version)', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']
        if song_names:
            song = random.choice(song_names)
            # song = song_names
            machine = SongMachine()
            data = machine.fetchSong(song)
            if data['url']:
                dispatcher.utter_message("Here's your song")
                dispatcher.utter_message('Title: ' + song)
                dispatcher.utter_custom_json({"payload": 'audio', "url": data['url'], 'title': data['title']})
            else:
                dispatcher.utter_message("I couldn't find the song you asked for.")
        else:
            dispatcher.utter_message("Unable to respond at the moment")

        return []

class ActionFetchKannadaSongs(Action):
    def name(self) -> Text:
        return "action_fetch_kannada_songs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        song_names = ['Neeralli Sanna(Duet Version)', 'Ninna Gungalli', 'Anthu Inthu', 'Madarangi']

        if song_names:
            song = random.choice(song_names)
            song = song_names
            machine = SongMachine()
            data = machine.fetchSong(song)
            if data['url']:
                dispatcher.utter_message("Here's your song")
                dispatcher.utter_message('Title: ' + song)
                dispatcher.utter_custom_json({"payload": 'audio', "url": data['url'], 'title': data['title']})
            else:
                dispatcher.utter_message("I couldn't find the song you asked for.")
        else:
            dispatcher.utter_message("Unable to respond at the moment")

        return []

class ActionFetchHindiSongs(Action):
  def name(self) -> Text:
      return "action_fetch_Hindi_songs"

  def run(self, dispatcher: CollectingDispatcher,
          tracker: Tracker,
          domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
      # song_name = tracker.get_slot('Kannada')
      intent = tracker.latest_message['intent'].get('name')

      if intent == "Hindi_song_sad":
        song_names = ['Main Dhoondne Ko Zamaane Mein','Pehle Bhi Main','Tum Hi Ho','Uska Hi Banana','Banjaara']
      elif intent == "Hindi_song_angry":
        song_names = ['Apana Bana Le','Tum Hi Ho','O Maahi','Heeriye']
      elif intent == "Hindi_song_calm":
        song_names = ['Apana Bana Le','Dil Diyan Gallan','Galliyan','Baarish','Heeriye']
      elif intent == "Hindi_song":
        song_names = ['Apana Bana Le','Tum Hi Ho','Deva Deva (From "Brahmastra")','Heeriye']
      else:
        song_names = ['Apana Bana Le','Tum Hi Ho','O Maahi','Heeriye']
      # song_names = ['Apana Bana Le','Tum Hi Ho','O Maahi','Heeriye']

      song = random.choice(song_names)

      if song is not None:
        machine = SongMachine()
        data = machine.fetchSong(song)
        if data['url'] is not '':
          dispatcher.utter_message("Here's your song")
          dispatcher.utter_message('Title: '+ song)
          dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
        else:
          dispatcher.utter_message("I couldn't find the song you asked for.")
      else:
        dispatcher.utter_message("Unable to respond at the movement")
        
      return []

class ActionFetchTeluguSongs(Action):
  def name(self) -> Text:
      return "action_fetch_Telugu_songs"

  def run(self, dispatcher: CollectingDispatcher,
          tracker: Tracker,
          domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
      # song_name = tracker.get_slot('Kannada')
      intent = tracker.latest_message['intent'].get('name')

      if intent == "Telugu_song_sad":
        song_names = ['Po Ve Po','Kolaveri Di','Kannuladha','Yemito']
      elif intent == "Telugu_song_angry":
        song_names = ['Vellake','Life of Ram','Vikram Title','Yemito']
      elif intent == "Telugu_song_calm":
        song_names = ['Vellake','Bandhamele','Beast Mode','Ranjithame']
      elif intent == "Telugu_song":
        song_names = ['Vellake','Halamithi Habibo','Manasu Maree','Sooreede']
      else:
        song_names = ['Vellake','Beast Mode','Manasu Maree','Yemito']
      song = random.choice(song_names)

      if song is not None:
        machine = SongMachine()
        data = machine.fetchSong(song)
        if data['url'] is not '':
          dispatcher.utter_message("Here's your song")
          dispatcher.utter_message('Title: '+ song)
          dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
        else:
          dispatcher.utter_message("I couldn't find the song you asked for.")
      else:
        dispatcher.utter_message("Unable to respond at the movement")
        
      return []

class ActionFetchMarathiSongs(Action):
  def name(self) -> Text:
      return "action_fetch_Marathi_songs"

  def run(self, dispatcher: CollectingDispatcher,
          tracker: Tracker,
          domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
      # song_name = tracker.get_slot('Kannada')
      intent = tracker.latest_message['intent'].get('name')

      if intent == "Marathi_song_sad":
        song_names = ['Gulabi Sadi','Chandra','Sairat','Dolby Walya']
      elif intent == "Marathi_song_angry":
        song_names = ['Gulabi Sadi','Chandra','Sairat','Dolby Walya']
      elif intent == "Marathi_song_calm":
        song_names = ['Gulabi Sadi','Chandra','Sairat','Dolby Walya']
      elif intent == "Marathi_song":
        song_names = ['Gulabi Sadi','Chandra','Sairat','Dolby Walya']
      else:
        song_names = ['Gulabi Sadi','Chandra','Sairat','Dolby Walya']
      song = random.choice(song_names)

      if song is not None:
        machine = SongMachine()
        data = machine.fetchSong(song)
        if data['url'] is not '':
          dispatcher.utter_message("Here's your song")
          dispatcher.utter_message('Title: '+ song)
          dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
        else:
          dispatcher.utter_message("I couldn't find the song you asked for.")
      else:
        dispatcher.utter_message("Unable to respond at the movement")
        
      return []

class ActionFetchTamilSongs(Action):
  def name(self) -> Text:
      return "action_fetch_Tamil_songs"

  def run(self, dispatcher: CollectingDispatcher,
          tracker: Tracker,
          domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
      intent = tracker.latest_message['intent'].get('name')

      if intent == "Tamil_song_sad":
        song_names = ['Kaadhal En Kaviyae','Enna Solla','Unakku Thaan','Adi Penne']
      elif intent == "Tamil_song_angry":
        song_names = ['Kaadhal En Kaviyae','Hukum','Unakku Thaan','Adi Penne']
      elif intent == "Tamil_song_calm":
        song_names = ['Kaadhal En Kaviyae','Enna Solla','Unakku Thaan','Adi Penne']
      elif intent == "Tamil_song":
        song_names = ['Kaadhal En Kaviyae','Enna Solla','Unakku Thaan','Adi Penne']
      else:
        song_names = ['Kaadhal En Kaviyae','Enna Solla','Unakku Thaan','Adi Penne']
      song = random.choice(song_names)

      if song is not None:
        machine = SongMachine()
        data = machine.fetchSong(song)
        if data['url'] is not '':
          dispatcher.utter_message("Here's your song")
          dispatcher.utter_message('Title: '+ song)
          dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
        else:
          dispatcher.utter_message("I couldn't find the song you asked for.")
      else:
        dispatcher.utter_message("Unable to respond at the movement")
        
      return []

# class ActionFetchMalayalamSongs(Action):
#   def name(self) -> Text:
#       return "action_fetch_Malayalam_songs"

#   def run(self, dispatcher: CollectingDispatcher,
#           tracker: Tracker,
#           domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#       # song_name = tracker.get_slot('Kannada')
#       intent = tracker.latest_message['intent'].get('name')

#       if intent == "Malayalam_song_sad":
#         song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       elif intent == "Malayalam_song_angry":
#         song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       elif intent == "Malayalam_song_calm":
#         song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       elif intent == "Malayalam_song":
#         song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       else:
#         song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       # song_names = ['illuminati','Armadham','Kuthanthram','Uyire']
#       song = random.choice(song_names)

#       if song is not None:
#         machine = SongMachine()
#         data = machine.fetchSong(song)
#         if data['url'] is not '':
#           dispatcher.utter_message("Here's your song")
#           dispatcher.utter_message('Title: '+ song)
#           dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
#         else:
#           dispatcher.utter_message("I couldn't find the song you asked for.")
#       else:
#         dispatcher.utter_message("Unable to respond at the movement")
        
#       return []

class ActionFetchEnglishSongs(Action):
  def name(self) -> Text:
      return "action_fetch_English_songs"

  def run(self, dispatcher: CollectingDispatcher,
          tracker: Tracker,
          domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
      # song_name = tracker.get_slot('Kannada')
      intent = tracker.latest_message['intent'].get('name')

      if intent == "Malayalam_song_sad":
        song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      elif intent == "Malayalam_song_angry":
        song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      elif intent == "Malayalam_song_calm":
        song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      elif intent == "Malayalam_song":
        song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      else:
        song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      
      # song_names = ['Middle Of the Night','Let Me Love You','Let Me Down Slowly','Unstoppable']
      song = random.choice(song_names)
      if song is not None:
        machine = SongMachine()
        data = machine.fetchSong(song)
        if data['url'] is not '':
          dispatcher.utter_message("Here's your song")
          dispatcher.utter_message('Title: '+ song)
          dispatcher.utter_custom_json({"payload":'audio',"url":data['url'],'title':data['title']})
        else:
          dispatcher.utter_message("I couldn't find the song you asked for.")
      else:
        dispatcher.utter_message("Unable to respond at the movement")
        
      return []


  
# rasa run --credentials ./credentials.yml  --enable-api --model ./models --endpoints ./endpoints.yml --cors "*"
# rasa run actions --cors "*" --debug  
# rasa run -vv --model models --enable-api --cors "*"
