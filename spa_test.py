import spa_code
import unittest
import time
import calendar
from astropy.time import Time as astTime

def unixTimeFromDate(day, month, year, hour, minute, second):
    sday = '%02d' %  day
    smon = '%02d' % month
    shour = '%02d' % hour
    smin = '%02d' % minute
    ssec = '%02d' % second
    dateAsString = "{d} {mon} {yr} {hr} {min} {sec}".format(d=sday, mon=smon, yr=year, hr=shour, min=smin, sec=ssec)

    return calendar.timegm(time.strptime(dateAsString, "%d %m %Y %H %M %S"))


def astTimeFromDate(day, month, year, hour, minute, second):
    return astTime(unixTimeFromDate(day, month, year, hour, minute, second), format='unix', scale='utc')

class JulianTime(unittest.TestCase):
    def test_ratioOfTimePassed(self):
        self.assertAlmostEqual(spa_code.ratioOfTimePassed(12, 30, 30), 0.521180556, 4, "ratio from time 12:30:30 is at about 0.5211")
        self.assertEqual(spa_code.ratioOfTimePassed(00, 0, 0), 0, "ratio from time 00:00:00 is at about 0")
        self.assertAlmostEqual(spa_code.ratioOfTimePassed(23, 59, 59), 0.999988, 4, "ratio from time 00:00:00 is at about 0.9999")

    def test_JD(self):
        self.assertAlmostEqual(spa_code.JD(unixTimeFromDate(1, 1, 2000, 12, 0, 0)), 2451545.0, 1, "Julian day is at about 2451545")
        self.assertAlmostEqual(spa_code.JD(unixTimeFromDate(1, 1, 1970, 0, 0, 0)),  2440587.50000, 4, "Julian day is at about 2440587.50000")
        self.assertAlmostEqual(spa_code.JD(unixTimeFromDate(31, 12, 6000, 23, 59, 59)), 3912880.49999, 4, "Julian day is at about 3912880.49999")
        self.assertAlmostEqual(spa_code.JD(unixTimeFromDate(20, 10, 1963, 15, 42, 5)), 2438323.1542245, 4, "Julian day is at about 2438323.1542245")
        self.assertAlmostEqual(spa_code.JD(unixTimeFromDate(9, 8, 2012, 0, 0, 50)), 2456148.50058, 4, "Julian day is at about 2456148.50058")

    #Since we are using epoch we cannot go before Jan 1, 1970. For Bright Maps, this is fine
    def test_JDE(self):
        astTest = astTimeFromDate(1, 1, 2000, 12, 0, 0)
        self.assertAlmostEqual(spa_code.JDE(2451545.0, astTest.unix, astTest.unix_tai), 2451544.999349722, 4, "JDE is about 2451544.9993")
        astTest = astTimeFromDate(1, 1, 1970, 0, 0, 0)
        self.assertAlmostEqual(spa_code.JDE(2440587.5, astTest.unix, astTest.unix_tai), 2440587.499627499, 4, "JDE is about 2440587.4996")
        astTest = astTimeFromDate(31, 12, 6000, 23, 59, 59)
        self.assertAlmostEqual(spa_code.JDE(3912880.4999, astTest.unix, astTest.unix_tai), 3912880.499290852, 3, "JDE is about 3912880.4992")
        astTest = astTimeFromDate(9, 8, 2012, 0, 0, 50)
        self.assertAlmostEqual(spa_code.JDE(2456148.50058, astTest.unix, astTest.unix_tai), 2456148.499895, 4, "JDE is about 2456148.499895")

    def test_JCE(self):
        self.assertAlmostEqual(spa_code.JCE(2451544.999349722), -0.000000018, 9, "JCE is about -0.000000018")
        self.assertAlmostEqual(spa_code.JCE(2440587.499627499), -0.30000001, 8, "JCE is about -0.30000001")
        self.assertAlmostEqual(spa_code.JCE(3912880.499290852), 40.00918547, 8, "JCE is about 40.00918547")
        self.assertAlmostEqual(spa_code.JCE(2456148.499895), 0.126036958, 9, "JCE is about 0.126036958")
        
    def test_JME(self):
        self.assertAlmostEqual(spa_code.JME(-0.000000018), -0.0000000018, 10, "JCE is about -0.0000000018")
        self.assertAlmostEqual(spa_code.JME(-0.30000001), -0.030000001, 9, "JCE is about -0.030000001")
        self.assertAlmostEqual(spa_code.JME(40.00918547), 4.000918547, 9, "JCE is about 4.000918547")
        self.assertAlmostEqual(spa_code.JME(0.126036958), .0126036958, 10, "JCE is about .0126036958")
 
if __name__ == '__main__':
    unittest.main()