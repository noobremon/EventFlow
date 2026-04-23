import inspect
try:
    from mcp.server.fastmcp import FastMCP
    print(inspect.signature(FastMCP.run))
except Exception as e:
    print(e)
