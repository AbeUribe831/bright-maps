import datetime
def _is_time_a_within_an_hour_ahead_of_time_b(time_a, time_b):
    if type(time_a) is not datetime.datetime or type(time_b) is not datetime.datetime:
        raise TypeError("one of the inputs is not a datetime object")
    total_time = (time_a - time_b).total_seconds()
    return 'true' if  total_time <= 3600 and total_time >= 0 else 'false'