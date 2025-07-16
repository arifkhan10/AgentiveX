
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tool } from "@/types/tool";
import { ReactNode } from "react";
import { SchemaRenderer } from "./schema-renderer";
import _ from "lodash";

interface ToolDetailsDialogProps {
  tool: Tool;
  children: ReactNode;
  source?: "arcade" | "langserve" | "lastmile";
}

export function ToolDetailsDialog({
  tool,
  children,
  source,
}: ToolDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                Tool Details —
              </span>
              <span>{_.startCase(tool.name)}</span>

              {source === "arcade" && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                  Arcade
                </span>
              )}
              {source === "langserve" && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  LangServe
                </span>
              )}
              {source === "lastmile" && (
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                  Lastmile
                </span>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {tool.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <SchemaRenderer schema={tool.inputSchema} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
