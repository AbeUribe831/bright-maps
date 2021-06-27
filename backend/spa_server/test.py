import unittest
from backend_methods import _is_time_a_within_an_hour_ahead_of_time_b 
import datetime
import unittest
from sunglare_backend import app
import pytest
import json

app.testing = True

class WithinAnHourAhead(unittest.TestCase):

    def test_wrong_class_in_time_a(self):
        time_a = 'test'
        time_b = datetime.datetime(2020, 5, 24)
        self.assertRaises(TypeError, _is_time_a_within_an_hour_ahead_of_time_b, time_a, time_b)

    def test_wrong_class_in_time_b(self):
        time_a = datetime.datetime(2020, 5, 24)
        time_b = 'test'
        self.assertRaises(TypeError, _is_time_a_within_an_hour_ahead_of_time_b, time_a, time_b)

    def test_wrong_class_in_both_args(self):
        time_a = 'test'
        time_b = 'test'
        self.assertRaises(TypeError, _is_time_a_within_an_hour_ahead_of_time_b, time_a, time_b)   

    def test_time_a_is_within_an_hour_of_time_b(self):
        time_a = datetime.datetime(2020, 5, 24, hour=10, minute=30)
        time_b = datetime.datetime(2020, 5, 24, hour=10)
        result = _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b)
        self.assertEqual(result, 'true')

    def test_time_a_is_exactly_one_hour_after_time_b(self):
        time_a = datetime.datetime(2020, 5, 24, hour=11)
        time_b = datetime.datetime(2020, 5, 24, hour=10)
        result = _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b)
        self.assertEqual(result, 'true')
        
    def test_time_a_is_exact_same_as_time_b(self):
        time_a = datetime.datetime(2020, 5, 24, hour=11)
        time_b = datetime.datetime(2020, 5, 24, hour=11)
        result = _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b)
        self.assertEqual(result, 'true')

    def test_time_a_is_over_an_hour_after_time_b(self):
        time_a = datetime.datetime(2020, 5, 24, hour=11, second=1)
        time_b = datetime.datetime(2020, 5, 24, hour=10)
        result = _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b)
        self.assertEqual(result, 'false')

    def test_time_a_before_time_b(self):
        time_a = datetime.datetime(2020, 5, 24, hour=9, minute=59, second=59)
        time_b = datetime.datetime(2020, 5, 24, hour=10)
        result = _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b)
        self.assertEqual(result, 'false')

class TestClient(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
       pass 

    #TODO:: figure out create_app
    def setUp(self):
        pass

    def tearDown(self):
        pass

    # Check for response 200
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/fo')
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)

    # check if content return is application/json
    def test_index_content(self):
        tester = app.test_client(self)
        response = tester.get('/fo')
        self.assertEqual(response.content_type, 'application/json') 

    #check for Data returned
    def test_index_data(self):
        tester = app.test_client(self)
        response = tester.get('/fo')
        self.assertTrue(b'message' in response.data)

    def test_demo_no_offset(self):
        with app.test_client() as client:
            # send POST data
            data = {'loc_and_time': 'test'}
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            self.assertEqual(result.status, '400 BAD REQUEST')

    def test_demo_bad_offset(self):
        with app.test_client() as client:
            # send POST data
            data = {'loc_and_time': 'test', 'utc_offset': 'test'}
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            self.assertEqual(result.status, '400 BAD REQUEST')

    def test_demo_no_loc_and_time(self):
        with app.test_client() as client:
            # send POST data
            data = {'loc_and_time': 'test', 'utc_offset': 'test'}
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            self.assertEqual(result.status, '400 BAD REQUEST')
            
    def test_demo_empty_request(self):
        with app.test_client() as client:
            # send POST data
            data = {}
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            self.assertEqual(result.status, '400 BAD REQUEST')
    
    # two dates -> sun glare => sunrise, sunglare => sunset, no sunglare
    def test_demo_one_date_with_sunrise_true(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "6",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunrise'], 'true')
            self.assertEqual(result_json[0]['glareAtSunset'], 'false')
            
    def test_demo_one_date_with_sunset_true(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "20",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunset'], 'true')
            self.assertEqual(result_json[0]['glareAtSunrise'], 'false')

    def test_demo_one_date_with_no_sunglare(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "15",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunrise'], 'false')
            self.assertEqual(result_json[0]['glareAtSunset'], 'false')

    def test_demo_two_dates_with_sunrise_true(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "6",
                        "minute": "0",
                        "second": "0"
                    }
                },
                {
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "27",
                        "hour": "6",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunrise'], 'true')
            self.assertEqual(result_json[0]['glareAtSunset'], 'false')
            self.assertEqual(result_json[1]['glareAtSunrise'], 'true')
            self.assertEqual(result_json[1]['glareAtSunset'], 'false')
    
    def test_demo_two_dates_with_sunset_true(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "20",
                        "minute": "0",
                        "second": "0"
                    }
                },
                {
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "27",
                        "hour": "20",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunset'], 'true')
            self.assertEqual(result_json[0]['glareAtSunrise'], 'false')
            self.assertEqual(result_json[1]['glareAtSunset'], 'true')
            self.assertEqual(result_json[1]['glareAtSunrise'], 'false')

    def test_demo_two_date_with_no_sunglare(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "15",
                        "minute": "0",
                        "second": "0"
                    }
                },
                {
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "27",
                        "hour": "15",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunrise'], 'false')
            self.assertEqual(result_json[0]['glareAtSunset'], 'false')
            self.assertEqual(result_json[1]['glareAtSunrise'], 'false')
            self.assertEqual(result_json[1]['glareAtSunset'], 'false')

    def test_demo_one_sunrise_one_sunset_sunglare(self):
        with app.test_client() as client:
            # send POST data
            data =  \
            {
                "loc_and_time": [{
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "26",
                        "hour": "6",
                        "minute": "0",
                        "second": "0"
                    }
                },
                {
                    "lat":36.68083269254035, 
                    "lng": -121.67038261904688,
                    "elevation": 16.55,
                    "date": {
                        "year": "2021",
                        "month": "6",
                        "day": "27",
                        "hour": "20",
                        "minute": "0",
                        "second": "0"
                    }
                }],
                "utc_offset": "-0700"
            
            }
            result = client.post(
                '/demoSunriseSunset',
                json=data
            )
            result_json = json.loads(result.data.decode('utf-8'))
            self.assertEqual(result_json[0]['glareAtSunrise'], 'true')
            self.assertEqual(result_json[0]['glareAtSunset'], 'false')
            self.assertEqual(result_json[1]['glareAtSunrise'], 'false')
            self.assertEqual(result_json[1]['glareAtSunset'], 'true')

if __name__ == "__main__":
    unittest.main()