# from langchain.tools import tool

# @tool
# def convert_usd_to_inr(amount: float) -> str:
#     '''Converts USD to INR using a fixed rate'''
#     rate = 83.2
#     return f"{amount} USD = {amount * rate:.2f} INR"


from pydantic import BaseModel, Field

class CurrencyInput(BaseModel):
    usd_amount: float = Field(..., description="Amount in USD")

def convert_usd_to_inr(input: CurrencyInput) -> str:
    inr_rate = 83.2
    inr_amount = input.usd_amount * inr_rate
    return f"{input.usd_amount} USD is approximately {inr_amount:.2f} INR."

