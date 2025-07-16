

// "use client";

// import ToolsInterface from "@/features/tools";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Toaster } from "@/components/ui/sonner";
// import React, { useState } from "react";

// export default function ToolsPage(): React.ReactNode {
//   const [source, setSource] = useState<"arcade" | "langserve" | "lastmile" |null>(null);

//   return (
//     <React.Suspense fallback={<div>Loading (layout)...</div>}>
//       <Toaster />
//       <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//         <div className="flex items-center gap-2 px-4">
//           <SidebarTrigger className="-ml-1" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Tools</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </header>

//       <div className="p-6 space-y-4">
//         {!source && (
//           <>
//             <div
//               className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
//               onClick={() => setSource("arcade")}
//             >
//               <h3 className="text-lg font-semibold">Go to Tool Playground</h3>
//               <p className="text-sm text-muted-foreground">
//                 Try and run Arcade tools in an interactive playground.
//               </p>
//             </div>

//             <div
//               className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
//               onClick={() => setSource("langserve")}
//             >
//               <h3 className="text-lg font-semibold">LangServe</h3>
//               <p className="text-sm text-muted-foreground">
//                 Try and run LangServe tools in an interactive playground.
//               </p>
//             </div>


//             <div
//               className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
//               onClick={() => setSource("lastmile")}
//             >
//               <h3 className="text-lg font-semibold">Lastmile</h3>
//               <p className="text-sm text-muted-foreground">
//                 Try and run Lastmile tools in an interactive playground.
//               </p>
//             </div>
            
//           </>
//         )}

//         {source && <ToolsInterface source={source} />}
//       </div>
//     </React.Suspense>
//   );
// }




"use client";

import ToolsInterface from "@/features/tools";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";

export default function ToolsPage(): React.ReactNode {
  const [source, setSource] = useState<"arcade" | "langserve" | "lastmile" | "notellama" | null>(null);

  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <Toaster />
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Tools</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {!source && (
          <>
            <div
              className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setSource("arcade")}
            >
              <h3 className="text-lg font-semibold">Go to Tool Playground</h3>
              <p className="text-sm text-muted-foreground">
                Try and run Arcade tools in an interactive playground.
              </p>
            </div>

            <div
              className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setSource("langserve")}
            >
              <h3 className="text-lg font-semibold">LangServe</h3>
              <p className="text-sm text-muted-foreground">
                Try and run LangServe tools in an interactive playground.
              </p>
            </div>

            <div
              className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setSource("lastmile")}
            >
              <h3 className="text-lg font-semibold">Lastmile</h3>
              <p className="text-sm text-muted-foreground">
                Try and run Lastmile tools in an interactive playground.
              </p>
            </div>

            <div
              className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setSource("notellama")}
            >
              <h3 className="text-lg font-semibold">NotebookLlama</h3>
              <p className="text-sm text-muted-foreground">
                Explore and chat with documents using NotebookLlama.
              </p>
            </div>
          </>
        )}

        {source && source !== "notellama" && <ToolsInterface source={source} />}

        {source === "notellama" && (
          <div className="w-full h-[90vh] border rounded">
            <iframe
              src="http://3.141.5.201:8501"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="NotebookLlama"
            />
          </div>
        )}
      </div>
    </React.Suspense>
  );
}
