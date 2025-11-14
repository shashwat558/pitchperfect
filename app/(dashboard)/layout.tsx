"use client"
import { AppSidebar } from "@/components/AppSidebar"
import PitchModalForm from "@/components/PitchModalForm";
import { useModalStore } from "@/store/modalStore";
import { Inconsolata } from "next/font/google";

const font = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {isRecordModalOpen, closeRecordModal} = useModalStore();
  return (
    <section className={`relative ${font.className}`}>
     <AppSidebar className="absolute z-10 top-0 left-0" />
    {children}

    {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <PitchModalForm onClose={closeRecordModal} />
        </div>
      )}
    </section>
    )
}