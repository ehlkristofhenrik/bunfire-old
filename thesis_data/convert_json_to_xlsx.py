import pandas as pd

df = pd.concat([
        pd.read_json("results/gemma2-9b-it_output.json"),
        pd.read_json("results/gemma-7b-it_output.json"),
        pd.read_json("results/llama3-8b-8192_output.json"),
        pd.read_json("results/llama3-70b-8192_output.json"),
        pd.read_json("results/llama-3.1-8b-instant_output.json"),
        pd.read_json("results/llama-3.1-70b-versatile_output.json"),
        pd.read_json("results/mixtral-8x7b-32768_output.json"),
    ])
df.to_excel("output_dataset.xlsx")
