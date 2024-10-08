
models = [
    "gemma2-9b-it",
    "gemma-7b-it",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768"
]
str = ""
for model in models:
    str += f"python gen_dataset.py {model} > 'results/{model}_output.json & \n"
print(str)
