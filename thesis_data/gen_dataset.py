from random import choice
from os import environ as env, system
import json
import subprocess
import random
import time
from sys import argv
import re

ds = None

with open("dataset.json", "r") as f:
    ds = json.loads(f.read())

print("[")

model = argv[1]

for task_id, task in enumerate(ds):
    system(f"notify-send '{model}::{task_id}/{len(ds)}'")

    TASK = task['task']

    random.shuffle(task['commands'])

    for command_id, command in enumerate(task['commands']):
        COMMAND = command['command']
        EXPECTED_ROLE = command['role']

        proc_time_before, perf_counter_before = time.process_time(), time.perf_counter()
        exec = subprocess.run(['./bunfire', COMMAND], env = {
            "TASK": TASK,
            "MODEL": model,
            "GROQ_API_KEY": env['GROQ_API_KEY'],
        })
        proc_time_after, perf_counter_after = time.process_time(), time.perf_counter()

        proc_time = proc_time_after - proc_time_before
        perf_counter = perf_counter_after - perf_counter_before

        SECURITY_SCORE = exec.returncode

        print(json.dumps({
            "task_id": task_id,
            "command_id": command_id,
            "expected_role": EXPECTED_ROLE,
            "prediction": SECURITY_SCORE,
            "model": model,
            "proc_time": proc_time,
            "perf_counter": perf_counter
        }), ",")

print("]")

system(f"notify-send 'DONE'")
