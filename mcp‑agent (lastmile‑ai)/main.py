



# from fastapi import FastAPI, Request, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List

# app = FastAPI()

# # CORS middleware for frontend connection
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change to ["http://localhost:3000"] in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 🔧 Hardcoded tool list (for now)
# mock_tools = [
#     {
#         "name": "lastmile__echo",
#         "description": "Echoes back the input message",
#         "inputSchema": {
#             "type": "object",
#             "properties": {
#                 "message": {
#                     "type": "string",
#                     "description": "Text to echo"
#                 }
#             },
#             "required": ["message"]
#         }
#     },
#     {
#         "name": "lastmile__reverse",
#         "description": "Reverses the input string",
#         "inputSchema": {
#             "type": "object",
#             "properties": {
#                 "text": {
#                     "type": "string",
#                     "description": "Text to reverse"
#                 }
#             },
#             "required": ["text"]
#         }
#     }
# ]

# # 🚀 List tools endpoint
# @app.get("/tools")
# async def list_tools():
#     print("[INFO] Returning mock tools")
#     return mock_tools

# # 🛠️ Invoke tool by name
# @app.post("/tools/{tool_name}/invoke")
# async def invoke_tool(tool_name: str, request: Request):
#     payload = await request.json()

#     print(f"[INFO] Invoking tool: {tool_name} with payload: {payload}")

#     if tool_name == "lastmile__echo":
#         return {"message": payload.get("message", "")}

#     elif tool_name == "lastmile__reverse":
#         text = payload.get("text", "")
#         return {"reversed": text[::-1]}

#     else:
#         raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")




from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev use, replace with actual origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Updated tool list with correct inputSchema format
mock_tools = [
    {
        "name": "lastmile__echo",
        "description": "Echoes back the input message",
        "inputSchema": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "Text to echo"
                }
            },
            "required": ["message"]
        }
    },
    {
        "name": "lastmile__reverse",
        "description": "Reverses the input string",
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Text to reverse"
                }
            },
            "required": ["text"]
        }
    }
]

# ✅ Endpoint to list tools
@app.get("/tools")
async def list_tools():
    print("[INFO] Returning lastmile tools")
    return mock_tools

# ✅ Endpoint to invoke tool
@app.post("/tools/{tool_name}/invoke")
async def invoke_tool(tool_name: str, request: Request):
    payload = await request.json()
    print(f"[INFO] Invoking {tool_name} with payload {payload}")

    if tool_name == "lastmile__echo":
        return {"message": payload.get("message", "")}

    elif tool_name == "lastmile__reverse":
        text = payload.get("text", "")
        return {"reversed": text[::-1]}

    else:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
