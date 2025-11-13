import { AppSidebar } from "@/components/AppSidebar"


export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
     <AppSidebar />
    {children}
    </section>
}