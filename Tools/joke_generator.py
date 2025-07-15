
# from pydantic import BaseModel
# import openai

# class JokeInput(BaseModel):
#     topic: str

# def tell_me_a_joke(input: JokeInput) -> str:
#     """Returns a joke using OpenAI's GPT-3"""
#     openai.api_key = "sk-..."  # Replace with your actual key
#     res = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "user", "content": f"Tell me a short funny joke about {input.topic}"}]
#     )
#     return res.choices[0].message.content.strip()


from pydantic import BaseModel, Field

class JokeInput(BaseModel):
    topic: str = Field(..., description="Topic to generate a joke about")

def tell_me_a_joke(input: JokeInput) -> str:
    return f"Why did the {input.topic} cross the road? To get to the other side!"


