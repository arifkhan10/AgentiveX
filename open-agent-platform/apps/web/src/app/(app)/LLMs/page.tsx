"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import LlmChat from "@/features/agents/components/llm-chat";

export default function LlmsPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Toaster />
      <div className="flex min-h-full w-full flex-row">
        {/* Main column */}
        <div className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>LLMs</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Page body: the LLM provider dropdown + API key + chat */}
          <div className="flex h-full w-full flex-col p-4">
            <LlmChat />
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}
