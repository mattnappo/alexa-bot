import json
key = ""
encrypted_key = []
for char in key:
    encrypted_key.append(char)
with open("auth.json", "w") as json_file:
    json.dump(encrypted_key, json_file)

print(encrypted_key)
