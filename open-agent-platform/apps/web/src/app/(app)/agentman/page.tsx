"use client";

import React from "react";
import AgentmanWidget from "@/features/agents/components/agentman-widget";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function AgentmanPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Toaster />
      <div className="flex min-h-full w-full flex-row">
        <div className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Agentman</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-4">
            <AgentmanWidget />
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}
