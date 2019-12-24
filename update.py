import redis
import pickle
import time
from job import run_analysis
import os


if __name__ == "__main__":
    r = redis.from_url(os.environ.get("REDIS_URL"))
    p = r.pubsub()
    p.psubscribe('job_*')

    while True:
        message = p.get_message()

        # process message if it actually contains data
        if message and type(message['data']) == bytes:
            # get data out
            data = pickle.loads(message['data'])

            # try parsing
            run_analysis(data)

        time.sleep(1)  # be nice to the system :)
