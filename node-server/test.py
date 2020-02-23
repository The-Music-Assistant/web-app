import winsound
import time
import sys

from flask import Flask, request
app = Flask(__name__)
@app.route('/', methods=['POST'])
def result():
    if len(list(request.form)) > 0:
        args = list(request.form)[0].split(" ")
        if args[0] == "play":
            winsound.PlaySound(args[1], winsound.SND_ASYNC)
        else:
            winsound.PlaySound(None, winsound.SND_PURGE)
    print(list(request.form), file=sys.stderr)
    return 'Received !' # response to your request.

# print("started")
# time.sleep(5)
# print("slept")
# winsound.PlaySound(None, winsound.SND_PURGE)
# print("purged")