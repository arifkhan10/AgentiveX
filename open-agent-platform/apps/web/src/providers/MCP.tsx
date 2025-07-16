
import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useState,
} from "react";
import useMCP from "../hooks/use-mcp";

type MCPContextType = ReturnType<typeof useMCP> & { loading: boolean };

const MCPContext = createContext<MCPContextType | null>(null);

export const MCPProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const mcpState = useMCP({
    name: "Tools Interface",
    version: "1.0.0",
  });

  // ❌ REMOVE redundant fetchTools() here
  const [loading] = useState(false);

  return (
    <MCPContext.Provider value={{ ...mcpState, loading }}>
      {children}
    </MCPContext.Provider>
  );
};

export const useMCPContext = () => {
  const context = useContext(MCPContext);
  if (context === null) {
    throw new Error("useMCPContext must be used within a MCPProvider");
  }
  return context;
};
