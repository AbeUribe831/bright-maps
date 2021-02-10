import math
import time

# get the total number of seconds from input and divide by total seconds in a day
def ratioOfTimePassed(hour, min, sec):
    return (((hour * 3600) + (min * 60) + sec)) / 86400

# calculate the Julian Day
# input: epoch time(in seconds) from time module (gregorian calendar)
def JD(epoch):
    utc = time.gmtime(epoch)
    year = utc.tm_year
    mon = utc.tm_mon
    if utc.tm_mon < 3:
        year = year - 1
        mon = mon + 12
    A = math.floor(year / 100) 
    B = 2 - A + math.floor(A / 4)
    D = utc.tm_mday + ratioOfTimePassed(utc.tm_hour, utc.tm_min, utc.tm_sec)
    return math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (mon + 1)) + D + B - 1524.5

# Calculate Julian Ephemeris Day
# input: JD, UT (in sec), TAI (in sec)
def JDE(JD, UT, TAI):
    #JD + (deltaT / 86400)
    return JD + ((UT - (TAI + 32.184)) / 86400)

def JC(JD):
    return (JD - 2451545) / 36525

def JCE(JDE):
    return (JDE - 2451545) / 36525

def JME(JCE):
    return JCE / 10