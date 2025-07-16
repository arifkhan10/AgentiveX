
import * as React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tool } from "@/types/tool";
import { ToolDetailsDialog } from "../tool-details-dialog";
import { Eye, FlaskConical } from "lucide-react";
import { TooltipIconButton } from "@/components/ui/tooltip-icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import _ from "lodash";

interface ToolCardProps {
  tool: Tool;
  source: "arcade" | "langserve" | "lastmile"; // added lastmile support
}

export function ToolCard({ tool, source }: ToolCardProps) {
  return (
    <Card className="border border-gray-200 shadow-xs">
      <CardHeader>
        <CardTitle className="truncate pb-2 text-lg font-medium">
          {_.startCase(tool.name)}
        </CardTitle>
        <CardDescription className="line-clamp-3 flex items-center gap-2">
          {source === "langserve" && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              LangServe
            </span>
          )}
          {source === "arcade" && (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
              Arcade
            </span>
          )}
          {source === "lastmile" && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
              Lastmile
            </span>
          )}
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex items-center justify-between">
        <NextLink href={`/tools/playground?tool=${tool.name}&source=${source}`}>
          <Button variant="outline">
            <FlaskConical className="size-4" />
            <p>Playground</p>
          </Button>
        </NextLink>
        <ToolDetailsDialog tool={tool}>
          <TooltipIconButton
            tooltip="View tool details"
            variant="outline"
            className="size-9"
          >
            <Eye className="size-5" />
          </TooltipIconButton>
        </ToolDetailsDialog>
      </CardFooter>
    </Card>
  );
}

export function ToolCardLoading() {
  return (
    <Card className="border border-gray-200 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-8 w-full" />
        </CardTitle>
        <CardDescription className="mt-2 flex flex-col gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between gap-2">
        <Skeleton className="size-6" />
      </CardFooter>
    </Card>
  );
}

