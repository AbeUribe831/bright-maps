from threading import local
from time import localtime
from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
from flask import make_response
from astral import sun, Observer
import json
import requests
import datetime
import dateutil.tz
import re
import backend_methods

def create_app():
    app = Flask(__name__)
    #app.config.from_object(config_class)
    return app

app = create_app()
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
'''
@app.route('/spa/<date>/<time>/<lat>/<lon>/<elev>')
def get_sun_position(date, time, lat, lon, elev):
    due to limit on weather data available we will exclude it for now
    weather = _get_pressure_and_temperature(lat, lon)
    sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([str(date) + ' ' + str(time)]),
        latitude=float(lat), longitude=float(lon), altitude=float(elev), pressure=float(weather['pressure']) * 100, temperature=float(weather['temp']))
    print('\nCHECKING IF THIS PRINTS\n',sol,'\n')
    return make_response(jsonify({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0])}), 200)
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
    for loc_and_time in date_time["loc_and_time"]:
        sol = pvlib.solarposition.get_solarposition(time=pd.DatetimeIndex([loc_and_time["date"]]),
            latitude=float(loc_and_time["lat"]), longitude=float(loc_and_time["lng"]), altitude=float(loc_and_time["elevation"]))
        sunPosArr.append({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0]), 'lat': str(loc_and_time['lat']), 'lng': str(loc_and_time['lng'])})
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

'''
@app.route('/fo', methods=['GET'])
def demo_post_fo():
    return jsonify({'message': 'success'})

# used when given only one date input
@app.route('/demoSunriseSunset', methods=['POST'])
def demo_post_sunrise_sunset():
    date_time = request.json
    if  'utc_offset' not in date_time:
        return Response("{\"message\": \"no utc_offset in request\"}", status=400)
    elif re.search("[+-]([01][0-9]|2[0-3])[0-5][0-9]",date_time['utc_offset']) is None:
        return Response("{\"message\": \"utc_offset is not formatted correctly, format should be (+/-)(HHMM)\"}", status=400)
    elif date_time['loc_and_time'] is None or date_time['loc_and_time'] == '':
        return Response("{\"message\": \"no loc_and_time in request or loc_and_time is empty\"}", status=400)
    sunPosArr = []
    try:
        # convert tz to seconds
        tz_hour = date_time['utc_offset']
        tzSec = (int(tz_hour[1:3]) * 60 * 60) + (int(tz_hour[3:5]) * 60)
        tzSec = -tzSec if  tz_hour[0] == '-' else tzSec
        # calculation is done in local time due to UTC getting sunset on future date
        for loc_and_time in date_time["loc_and_time"]:
            observer = Observer(latitude=loc_and_time['lat'], longitude=loc_and_time['lng'], elevation=loc_and_time['elevation'])
            localDateTime = datetime.datetime(year=int(loc_and_time['date']['year']), month=int(loc_and_time['date']['month']), day=int(loc_and_time['date']['day']), hour=int(loc_and_time['date']['hour']), minute=int(loc_and_time['date']['minute']), second=int(loc_and_time['date']['second']), tzinfo=dateutil.tz.tzoffset(None, tzSec))
            sunrise = sun.sunrise(observer, date=localDateTime, tzinfo=dateutil.tz.tzoffset(None, tzSec))
            sunset = sun.sunset(observer, date=localDateTime, tzinfo=dateutil.tz.tzoffset(None, tzSec))
            sunPosArr.append({'lat': loc_and_time['lat'], 'lng': loc_and_time['lng'],'glareAtSunrise': backend_methods._is_time_a_within_an_hour_ahead_of_time_b(localDateTime, sunrise), 'glareAtSunset': backend_methods._is_time_a_within_an_hour_ahead_of_time_b(sunset, localDateTime), 'local_time': localDateTime.strftime('%c')})

            #sunPosArr.append({'elevation': str(sol['elevation'][0]) ,'azimuth': str(sol['azimuth'][0]), 'lat': str(loc_and_time['lat']), 'lng': str(loc_and_time['lng'])})
    except ValueError:
        return Response("{\"message\": \"bad loc_and_time data\"}", status=400) 
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
    '''
    tempBool = False
    for i in range(0, len(sunPosArr)):
        sunPosArr[i]['hasGlare'] = 'true' if tempBool else 'false'
        tempBool = not tempBool
    '''
    return make_response(jsonify(sunPosArr))
app.run(host='127.0.0.1', port=3000)