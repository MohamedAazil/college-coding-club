import type { Blog } from '@/types'
import { Separator } from '@radix-ui/react-separator'
import { AppSidebar } from './app-sidebar'
import BlogList from './BlogList'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar'


const HomeComponent = () => {
    const blogs: Blog[] = [
        {
            id: "1",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        {
            id: "2",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        {
            id: "2",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        {
            id: "2",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        {
            id: "2",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        {
            id: "2",
            title: "The future of AI in 2025",
            excerpt: "AI continues to reshape industries...",
            coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            author: { name: "Aazil", avatar: "" },
            publishedAt: "2025-01-01",
        },
        // Add more blogs here
    ];


  return (
    <div className="w-100">
        <SidebarProvider
        style={
            {
            "--sidebar-width": "19rem",
            } as React.CSSProperties
        }
        >
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            </header>
        <div className="flex-1">
            <BlogList blogs={blogs} />
        </div>
        </SidebarInset>
        </SidebarProvider>
      </div>
  )
}

export default HomeComponent