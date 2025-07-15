
# from pydantic import BaseModel
# import requests

# class DefinitionInput(BaseModel):
#     word: str

# def get_definition(input: DefinitionInput) -> str:
#     """Look up the definition of a word using Free Dictionary API."""
#     url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{input.word}"
#     response = requests.get(url)
#     if response.status_code == 200:
#         data = response.json()
#         meaning = data[0]["meanings"][0]["definitions"][0]["definition"]
#         return f"Definition of {input.word}: {meaning}"
#     else:
#         return f"Sorry, couldn't find the definition for '{input.word}'."



from pydantic import BaseModel, Field
import requests

class DefinitionInput(BaseModel):
    word: str = Field(..., description="Word to look up in the dictionary")

def get_definition(input: DefinitionInput) -> str:
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{input.word}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        meaning = data[0]["meanings"][0]["definitions"][0]["definition"]
        return f"Definition of {input.word}: {meaning}"
    else:
        return f"Sorry, couldn't find the definition for '{input.word}'."
