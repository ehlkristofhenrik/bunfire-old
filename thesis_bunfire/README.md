# Thesis

### 🔥 Bunfire 🔥

> Your safe spot for the command line

Bunfire helps you protect your assets through intelligent command line filtering. I call it the *"human-level firewall"* or the *"OSI-8 firewall"*. Bunfire compares your employees actions with their current tasks deducing the likelyhood of malicious activity potentially disabling hacking and information leaking attempts even with privileges.

### ✋ Disclaimer

⚠️ This project is for **educational purposes only**. Do not use it in production as it might be illegal in your country. Bunfire is not an all in one solution for all needs and makes mistakes. This is an MVP!

### 🤓 How it works?

Bunfire integrates with your github repository. The issues of your repository are synced with Bunfire through the Github REST API to allow easy and dynamic control over the tasks. Bunfire queries your issues regarding to the currently logged in user. At each command Bunfire queries a large language model to determine some facts about the command. After analysis the program either disables the shell or lets the user access it further.

### 🧪 Further development

Bunfire was built for my diploma thesis, but not the whole theory is built into Bunfire. Bunfire lacks the automated asset management feature because Groq does not currently support logprobs which would be necessary for the correct implementation and OpenAI API is not free in my country and I did not get free API credits. LocalLLM would be possible but my machine can not handle large models and only CPU inference is available :(.
