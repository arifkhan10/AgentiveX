
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from langserve import add_routes
# from langchain_core.runnables import RunnableMap
# from langchain.tools import Tool

# # Your tool functions
# from joke_generator import tell_me_a_joke
# from weather_tool import get_weather
# from dictionary_lookup import get_definition
# from currency_converter import convert_usd_to_inr

# # Create FastAPI app
# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # or specify frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Define tools
# tools = {
#     "tell_me_a_joke": Tool.from_function(
#         func=tell_me_a_joke,
#         name="tell_me_a_joke",
#         description="Tells a short, funny joke about a given topic."
#     ),
#     "get_weather": Tool.from_function(
#         func=get_weather,
#         name="get_weather",
#         description="Returns current weather for a given city using Open-Meteo API."
#     ),
#     "get_definition": Tool.from_function(
#         func=get_definition,
#         name="get_definition",
#         description="Returns dictionary definition of a word using Free Dictionary API."
#     ),
#     "convert_usd_to_inr": Tool.from_function(
#         func=convert_usd_to_inr,
#         name="convert_usd_to_inr",
#         description="Converts a USD amount to INR using a fixed rate."
#     ),
# }

# # LangServe tool router
# tool_router = RunnableMap(tools)

# # Mount LangServe tool playground and invoke endpoints
# add_routes(app, tool_router, path="/tools")

# # ✅ Custom GET /tools endpoint to list tool metadata
# @app.get("/tools")
# def list_tools():
#     return {
#         name: {
#             "name": tool.name,
#             "description": tool.description,
#             "args_schema": tool.args_schema.schema() if tool.args_schema else {},
#         }
#         for name, tool in tools.items()
#     }




# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from langserve import add_routes
# from langchain_core.runnables import RunnableMap
# from langchain.tools import Tool

# # Import tool functions and schemas
# from joke_generator import tell_me_a_joke, JokeInput
# from weather_tool import get_weather, WeatherInput
# from dictionary_lookup import get_definition, DefinitionInput
# from currency_converter import convert_usd_to_inr, CurrencyInput

# # Create FastAPI app
# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Define tools with input schema
# tools = {
#     "tell_me_a_joke": Tool(
#         name="tell_me_a_joke",
#         description="Tells a short, funny joke about a given topic.",
#         func=tell_me_a_joke,
#         args_schema=JokeInput
#     ),
#     "get_weather": Tool(
#         name="get_weather",
#         description="Returns current weather for a given city using Open-Meteo API.",
#         func=get_weather,
#         args_schema=WeatherInput
#     ),
#     "get_definition": Tool(
#         name="get_definition",
#         description="Returns dictionary definition of a word using Free Dictionary API.",
#         func=get_definition,
#         args_schema=DefinitionInput
#     ),
#     "convert_usd_to_inr": Tool(
#         name="convert_usd_to_inr",
#         description="Converts a USD amount to INR using a fixed rate.",
#         func=convert_usd_to_inr,
#         args_schema=CurrencyInput
#     ),
# }

# tool_router = RunnableMap(tools)

# # Mount LangServe tool playground and endpoint
# add_routes(app, tool_router, path="/tools")

# @app.get("/tools")
# def list_tools():
#     return {
#         name: {
#             "name": tool.name,
#             "description": tool.description,
#             "args_schema": tool.args_schema.schema() if tool.args_schema else {},
#         }
#         for name, tool in tools.items()
#     }



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain_core.runnables import RunnableMap
from langchain.tools import Tool

# Import tool functions and input schemas
from joke_generator import tell_me_a_joke, JokeInput
from weather_tool import get_weather, WeatherInput
from dictionary_lookup import get_definition, DefinitionInput
from currency_converter import convert_usd_to_inr, CurrencyInput

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tool definitions with input schemas
tools = {
    "tell_me_a_joke": Tool.from_function(
        func=tell_me_a_joke,
        name="tell_me_a_joke",
        description="Tells a short, funny joke about a given topic.",
        args_schema=JokeInput,
    ),
    "get_weather": Tool.from_function(
        func=get_weather,
        name="get_weather",
        description="Returns current weather for a given city using Open-Meteo API.",
        args_schema=WeatherInput,
    ),
    "get_definition": Tool.from_function(
        func=get_definition,
        name="get_definition",
        description="Returns dictionary definition of a word using Free Dictionary API.",
        args_schema=DefinitionInput,
    ),
    "convert_usd_to_inr": Tool.from_function(
        func=convert_usd_to_inr,
        name="convert_usd_to_inr",
        description="Converts a USD amount to INR using a fixed rate.",
        args_schema=CurrencyInput,
    ),
}

# Register routes
tool_router = RunnableMap(tools)
add_routes(app, tool_router, path="/tools")

# Custom endpoint to expose tool metadata
@app.get("/tools")
def list_tools():
    return {
        name: {
            "name": tool.name,
            "description": tool.description,
            "args_schema": tool.args_schema.schema() if tool.args_schema else {},
        }
        for name, tool in tools.items()
    }
