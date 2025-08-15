
import { useEffect, useRef, useState } from "react";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Tool } from "@/types/tool";

type ExtendedTool = Tool & { source: "arcade" | "langserve" | "lastmile" | "custom" };

function getArcadeUrlOrThrow(): URL {
  const url = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_BASE_API_URL is not defined");

  const fullUrl = new URL(url);
  fullUrl.pathname = fullUrl.pathname.replace(/\/+$/, "").replace(/\/oap_mcp$/, "");
  fullUrl.pathname += "/oap_mcp";

  return fullUrl;
}

function getLangserveUrlOrThrow(): URL {
  const url = process.env.NEXT_PUBLIC_LANGSERVE_TOOLS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_LANGSERVE_TOOLS_URL is not defined");
  return new URL(url);
}

function getLastmileUrlOrThrow(): URL {
  const url = process.env.NEXT_PUBLIC_LASTMILE_TOOLS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_LASTMILE_TOOLS_URL is not defined");
  return new URL(url);
}

export default function useMCP({
  name,
  version,
}: {
  name: string;
  version: string;
}) {
  const [tools, setTools] = useState<ExtendedTool[]>([]);
  const [cursor, setCursor] = useState("");
  const [mcpServerUrl, setMcpServerUrl] = useState<string | null>(null);

  const toolsLoadedRef = useRef(false);

  const createAndConnectMCPClient = async (url: URL) => {
    const connectionClient = new StreamableHTTPClientTransport(url);
    const mcp = new Client({ name, version });
    await mcp.connect(connectionClient);
    return mcp;
  };

  const getTools = async (
    nextCursor?: string,
    source: ExtendedTool["source"] = "arcade"
  ): Promise<ExtendedTool[]> => {
    if (source === "arcade") {
      const mcp = await createAndConnectMCPClient(getArcadeUrlOrThrow());
      const result = await mcp.listTools({ cursor: nextCursor });

      const tagged: ExtendedTool[] = result.tools.map(tool => ({
        ...tool,
        source,
      }));

      setCursor(result.nextCursor || "");
      return tagged;
    }

    if (source === "custom" && mcpServerUrl) {
      const mcp = await createAndConnectMCPClient(new URL(mcpServerUrl));
      const result = await mcp.listTools({ cursor: nextCursor });

      const tagged: ExtendedTool[] = result.tools.map(tool => ({
        ...tool,
        source,
      }));

      setCursor(result.nextCursor || "");
      return tagged;
    }

    if (source === "langserve" || source === "lastmile") {
      const baseUrl =
        source === "langserve" ? getLangserveUrlOrThrow() : getLastmileUrlOrThrow();

      const url = new URL(baseUrl);
      const res = await fetch(url.toString());

      if (!res.ok) {
        throw new Error(`Failed to fetch ${source} tools`);
      }

      const result = await res.json();
      const isArray = Array.isArray(result);

      const tools: ExtendedTool[] = (isArray ? result : Object.values(result)).map(
        (tool: any) => ({
          name: `${tool.name}`,
          description: tool.description || "",
          inputSchema: tool.inputSchema || tool.schema || {
            type: "object",
            properties: {},
          },
          source,
        })
      );

      return tools;
    }

    throw new Error(`Unsupported source: ${source}`);
  };

  const callTool = async ({
    name,
    args,
    version,
    source = "arcade",
  }: {
    name: string;
    args: Record<string, any>;
    version?: string;
    source?: ExtendedTool["source"];
  }) => {
    if (source === "arcade") {
      const mcp = await createAndConnectMCPClient(getArcadeUrlOrThrow());
      return await mcp.callTool({ name, version, arguments: args });
    }

    if (source === "custom" && mcpServerUrl) {
      const mcp = await createAndConnectMCPClient(new URL(mcpServerUrl));
      return await mcp.callTool({ name, version, arguments: args });
    }

    if (source === "langserve" || source === "lastmile") {
      const baseUrl =
        source === "langserve" ? getLangserveUrlOrThrow() : getLastmileUrlOrThrow();

      const url = new URL(`${baseUrl}/${name}/invoke`);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      if (!res.ok) {
        throw new Error(`${source} tool invocation failed`);
      }

      return await res.json();
    }

    throw new Error(`Unsupported source: ${source}`);
  };

  useEffect(() => {
    if (toolsLoadedRef.current) {
      console.log("[useMCP] Skipping fetch — already loaded");
      return;
    }

    toolsLoadedRef.current = true;
    console.log("[useMCP] Triggering fetchAllTools");

    const fetchAllTools = async () => {
      try {
        const sources: ExtendedTool["source"][] = ["lastmile", "arcade", "langserve"];
        const results = await Promise.allSettled(
          sources.map(source =>
            getTools(undefined, source).then(tools => ({ tools, source }))
          )
        );

        let combined: ExtendedTool[] = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            combined.push(...result.value.tools);
          }
        }

        const deduped = Array.from(
          new Map(combined.map(tool => [`${tool.source}__${tool.name}`, tool])).values()
        );

        setTools(deduped);
      } catch (err) {
        console.error("[useMCP] Tool fetching error:", err);
      }
    };

    fetchAllTools();
  }, []);

  return {
    getTools,
    callTool,
    tools,
    setTools,
    cursor,
    setMcpServerUrl,
    mcpServerUrl,
  };
}









// import { useEffect, useRef, useState } from "react";
// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { Tool } from "@/types/tool";

// type ExtendedTool = Tool & { source: "arcade" | "langserve" | "lastmile" | "custom" };

// function getArcadeUrlOrThrow(): URL {
//   const url = process.env.NEXT_PUBLIC_MCP_SERVER_URL;
//   if (!url) throw new Error("NEXT_PUBLIC_MCP_SERVER_URL is not defined");
//   return new URL(url);
// }

// function getLangserveUrlOrThrow(): URL {
//   const url = process.env.NEXT_PUBLIC_LANGSERVE_TOOLS_URL;
//   if (!url) throw new Error("NEXT_PUBLIC_LANGSERVE_TOOLS_URL is not defined");
//   return new URL(url);
// }

// function getLastmileUrlOrThrow(): URL {
//   const url = process.env.NEXT_PUBLIC_LASTMILE_TOOLS_URL;
//   if (!url) throw new Error("NEXT_PUBLIC_LASTMILE_TOOLS_URL is not defined");
//   return new URL(url);
// }

// export default function useMCP({
//   name,
//   version,
// }: {
//   name: string;
//   version: string;
// }) {
//   const [tools, setTools] = useState<ExtendedTool[]>([]);
//   const [cursor, setCursor] = useState("");
//   const [mcpServerUrl, setMcpServerUrl] = useState<string | null>(null);

//   const toolsLoadedRef = useRef(false);

//   const createAndConnectMCPClient = async (url: URL) => {
//     const connectionClient = new StreamableHTTPClientTransport(url);
//     const mcp = new Client({ name, version });
//     await mcp.connect(connectionClient);
//     return mcp;
//   };

//   const getTools = async (
//     nextCursor?: string,
//     source: ExtendedTool["source"] = "arcade"
//   ): Promise<ExtendedTool[]> => {
//     if (source === "arcade") {
//       const mcp = await createAndConnectMCPClient(getArcadeUrlOrThrow());
//       const result = await mcp.listTools({ cursor: nextCursor });

//       const tagged: ExtendedTool[] = result.tools.map(tool => ({
//         ...tool,
//         source,
//       }));

//       setCursor(result.nextCursor || "");
//       return tagged;
//     }

//     if (source === "custom" && mcpServerUrl) {
//       const mcp = await createAndConnectMCPClient(new URL(mcpServerUrl));
//       const result = await mcp.listTools({ cursor: nextCursor });

//       const tagged: ExtendedTool[] = result.tools.map(tool => ({
//         ...tool,
//         source,
//       }));

//       setCursor(result.nextCursor || "");
//       return tagged;
//     }

//     if (source === "langserve" || source === "lastmile") {
//       const baseUrl =
//         source === "langserve" ? getLangserveUrlOrThrow() : getLastmileUrlOrThrow();

//       const url = new URL(baseUrl);
//       const res = await fetch(url.toString());

//       if (!res.ok) {
//         throw new Error(`Failed to fetch ${source} tools`);
//       }

//       const result = await res.json();
//       const isArray = Array.isArray(result);

//       const tools: ExtendedTool[] = (isArray ? result : Object.values(result)).map(
//         (tool: any) => ({
//           name: `${tool.name}`,
//           description: tool.description || "",
//           inputSchema: tool.inputSchema || tool.schema || {
//             type: "object",
//             properties: {},
//           },
//           source,
//         })
//       );

//       return tools;
//     }

//     throw new Error(`Unsupported source: ${source}`);
//   };

//   const callTool = async ({
//     name,
//     args,
//     version,
//     source = "arcade",
//   }: {
//     name: string;
//     args: Record<string, any>;
//     version?: string;
//     source?: ExtendedTool["source"];
//   }) => {
//     if (source === "arcade") {
//       const mcp = await createAndConnectMCPClient(getArcadeUrlOrThrow());
//       return await mcp.callTool({ name, version, arguments: args });
//     }

//     if (source === "custom" && mcpServerUrl) {
//       const mcp = await createAndConnectMCPClient(new URL(mcpServerUrl));
//       return await mcp.callTool({ name, version, arguments: args });
//     }

//     if (source === "langserve" || source === "lastmile") {
//       const baseUrl =
//         source === "langserve" ? getLangserveUrlOrThrow() : getLastmileUrlOrThrow();

//       const url = new URL(`${baseUrl}/${name}/invoke`);

//       const res = await fetch(url.toString(), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(args),
//       });

//       if (!res.ok) {
//         throw new Error(`${source} tool invocation failed`);
//       }

//       return await res.json();
//     }

//     throw new Error(`Unsupported source: ${source}`);
//   };

//   useEffect(() => {
//     if (toolsLoadedRef.current) {
//       console.log("[useMCP] Skipping fetch — already loaded");
//       return;
//     }

//     toolsLoadedRef.current = true;
//     console.log("[useMCP] Triggering fetchAllTools");

//     const fetchAllTools = async () => {
//       try {
//         const sources: ExtendedTool["source"][] = ["lastmile", "arcade", "langserve"];
//         const results = await Promise.allSettled(
//           sources.map(source =>
//             getTools(undefined, source).then(tools => ({ tools, source }))
//           )
//         );

//         let combined: ExtendedTool[] = [];
//         for (const result of results) {
//           if (result.status === "fulfilled") {
//             combined.push(...result.value.tools);
//           }
//         }

//         const deduped = Array.from(
//           new Map(combined.map(tool => [`${tool.source}__${tool.name}`, tool])).values()
//         );

//         setTools(deduped);
//       } catch (err) {
//         console.error("[useMCP] Tool fetching error:", err);
//       }
//     };

//     fetchAllTools();
//   }, []);

//   return {
//     getTools,
//     callTool,
//     tools,
//     setTools,
//     cursor,
//     setMcpServerUrl,
//     mcpServerUrl,
//   };
// }
