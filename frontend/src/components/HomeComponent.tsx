import { useAppContext } from "@/context/Context";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const HomeComponent = () => {
  const { getUserDetails } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // getUserDetails()
    console.log("getting user data");
  }, []);

  return (
    <div className="w-full">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center px-4 border-b">
            {/* LEFT SIDE: Sidebar Trigger */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-6"
              />
            </div>

            {/* CENTER: Search bar (flex-grow pushes it to center) */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md">
                <Input placeholder="Search…" className="w-full" />
              </div>
            </div>

            {/* RIGHT SIDE: Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("blogs/new")}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Post
              </Button>

              <Button variant="secondary">Dummy</Button>
            </div>
          </header>
          <div className="flex-1 m-8">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default HomeComponent;
