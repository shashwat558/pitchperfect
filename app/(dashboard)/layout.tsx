import { AppSidebar } from "@/components/AppSidebar"


export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="relative">
     <AppSidebar className="absolute z-10 top-0 left-0" />
    {children}
    </section>
    )
}