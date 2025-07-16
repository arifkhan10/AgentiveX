
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useMCPContext } from "@/providers/MCP";
import { Tool } from "@/types/tool";
import _ from "lodash";
import { useMemo, useState } from "react";

interface ToolListCommandProps {
  value: Tool;
  setValue: (tool: Tool) => void;
  className?: string;
}

export function ToolListCommand({
  value,
  setValue,
  className,
}: ToolListCommandProps) {
  const [open, setOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { tools, loading, getTools, setTools, cursor } = useMCPContext();

  const displayName = (tool?: Tool | null) =>
    tool?.name ? _.startCase(tool.name) : "Unknown Tool";

  const uniqueTools = useMemo(() => {
    const seen = new Set<string>();
    return tools.filter((t) => {
      if (!t.name || seen.has(t.name)) return false;
      seen.add(t.name);
      return true;
    });
  }, [tools]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value ? displayName(value) : "Select a tool..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-[400px] p-0">
        <Command
          filter={(val, search) => {
            if (!val) return 0;
            const match = val.toLowerCase().includes(search.toLowerCase()) ||
              _.startCase(val).toLowerCase().includes(search.toLowerCase());
            return match ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search tools..." />
          <CommandList>
            <CommandEmpty>No tools found.</CommandEmpty>

            {loading && !tools.length && (
              <CommandEmpty className="flex items-center gap-1 p-2">
                <Loader2 className="size-4 animate-spin" />
                Loading tools...
              </CommandEmpty>
            )}

            {uniqueTools.map((tool, index) => (
              <CommandItem
                key={`${tool.name || "tool"}:${index}`}
                value={tool.name || ""}
                onSelect={() => {
                  setValue(tool);
                  setOpen(false);
                }}
              >
                {displayName(tool)}
              </CommandItem>
            ))}

            {cursor && (
              <div className="border-t p-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  disabled={loadingMore}
                  onClick={async () => {
                    setLoadingMore(true);
                    try {
                      const moreTools = await getTools(cursor);
                      setTools((prev) => [...prev, ...moreTools]);
                    } catch (error) {
                      console.error("[ToolListCommand] Failed to load more tools:", error);
                    } finally {
                      setLoadingMore(false);
                    }
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
