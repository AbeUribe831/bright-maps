from flask import Flask
from flask import request
from flask import render_template
from flask import jsonify
from flask import make_response
import json
import pandas as pd
import pvlib
import requests

app = Flask(__name__)

API_KEY = '6e63c47a00540c88d1241ecb9fd1be17'

OPEN_WEATHER_CURRENT = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_key}'

'''
@app.route('/weather/<lat>/<lon>', methods=["GET"])
def get_pressure_and_temperature(lat, lon):
    response = requests.get(OPEN_WEATHER_CURRENT.format(lat=lat, lon=lon, API_key=API_KEY))
    if(response.ok):
        weatherJson = json.loads(response.text)
        #print(weatherJson)
        temp = weatherJson['main']['temp']
        pressure = weatherJson['main']['pressure']
        print(temp, pressure)
        return make_response(jsonify({"temp" : str(temp), "pressure": str(pressure)}), 200)
    return make_response(jsonify({"message": "Request was bad"}), 400)
'''
# TODO:: fix case when error message is received
def _get_pressure_and_temperature(lat, lon):
    response = requests.get(OPEN_WEATHER_CURRENT.format(lat=lat, lon=lon, API_key=API_KEY))
    if(response.ok):
        weatherJson = json.loads(response.text)
        #print(weatherJson)
        temp = weatherJson['main']['temp']
        pressure = weatherJson['main']['pressure']
        print(temp, pressure)
        return {"temp" : temp, "pressure": pressure}
    return make_response(jsonify({"message": "Request was bad"}), 400)
# Definelty need a better way to route all this data but this should allow js app to get sun's position
@app.route('/spa/<date>/<time>/<lat>/<lon>/<elev>')
def get_sun_position(date, time, lat, lon, elev):
    '''
    due to limit on weather data available we will exclude it for now
    weather = _get_pressure_and_temperature(lat, lon)
    sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([str(date) + ' ' + str(time)]),
        latitude=float(lat), longitude=float(lon), altitude=float(elev), pressure=float(weather['pressure']) * 100, temperature=float(weather['temp']))
    print('\nCHECKING IF THIS PRINTS\n',sol,'\n')
    return make_response(jsonify({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0])}), 200)
    '''
    sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([str(date) + ' ' + str(time)]),
        latitude=float(lat), longitude=float(lon), altitude=float(elev))
    print('\nCHECKING IF THIS PRINTS\n',sol,'\n')
    return make_response(jsonify({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0])}), 200)

# used when given multiple dates from input
@app.route('/spaDateTime', methods=['POST'])
def post_sun_position_date_time():
    # as a json object
    date_time = request.json
    sunPosArr = []
    for locAndTime in date_time["locAndTime"]:
        sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([locAndTime["date"]]),
            latitude=float(locAndTime["lat"]), longitude=float(locAndTime["lng"]), altitude=float(locAndTime["elevation"]))
        sunPosArr.append({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0]), 'lat': str(locAndTime['lat']), 'lng': str(locAndTime['lng'])})
    return make_response(jsonify(sunPosArr))

# used when given only one date input
@app.route('/spaSameTime', methods=['POST'])
def post_sun_position_same_time():
    date_time = request.json
    sunPosArr = []
    for loc in date_time["location"]:
        sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([date_time["date"]]),
            latitude=float(loc["lat"]), longitude=float(loc["lng"]), altitude=float(loc["elevation"]))
        sunPosArr.append({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0]), 'lat': str(loc['lat']), 'lng': str(loc['lng'])})
    return make_response(jsonify(sunPosArr))

# used when given only one date input
@app.route('/demoSpaSameTime', methods=['POST'])
def demo_post_sun_position_same_time():
    date_time = request.json
    sunPosArr = []
    for locAndTime in date_time["locAndTime"]:
        sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([locAndTime["date"]]),
            latitude=float(locAndTime["lat"]), longitude=float(locAndTime["lng"]), altitude=float(locAndTime["elevation"]))
        sunPosArr.append({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0]), 'lat': str(locAndTime['lat']), 'lng': str(locAndTime['lng'])})
    '''
    Code from paper 'A novel method for predicting and mapping the presence of sun glare using Google Street View'
    with sunPosArr we can send this to the Google Street View API to get the right image then pass to 
    the PSPNet (neural network). 
    input: 
        - sunPosArr -> azimuth, sun elevation, lat, lng
        - GSV image -> driver direction, slope of ange of driveway (both given from the GSV image's metadata)
    output:
        - boolean on if the user will get sunglare or not
    
    TODO:: figure out when to pass data, in the for loop (one at a time), or after (the whole sunPosArr list)
    '''
    # will make every other data point return true just for demo's sake
    tempBool = False
    for i in range(0, len(sunPosArr)):
        sunPosArr[i]['hasGlare'] = 'true' if tempBool else 'false'
        tempBool = not tempBool
    return make_response(jsonify(sunPosArr))
app.run(host='127.0.0.1', port=3000)