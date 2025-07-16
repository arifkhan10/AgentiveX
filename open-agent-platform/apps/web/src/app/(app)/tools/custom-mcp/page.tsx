// "use client";

// import ToolsPlaygroundInterface from "@/features/tools/playground";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Toaster } from "@/components/ui/sonner";
// import React from "react";

// export default function CustomMcpToolsPage(): React.ReactNode {
//   return (
//     <React.Suspense fallback={<div>Loading (layout)...</div>}>
//       <Toaster />
//       <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//         <div className="flex items-center gap-2 px-4">
//           <SidebarTrigger className="-ml-1" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Custom MCP</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </header>

//       {/* ✅ Custom MCP tool server URL (e.g., local mcp-agent or deployed) */}
//       <ToolsPlaygroundInterface customMcpUrl="http://3.141.5.201:4000/:8000" />
//     </React.Suspense>
//   );
// }
