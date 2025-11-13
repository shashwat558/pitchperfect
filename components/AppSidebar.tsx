"use client"

import { useState } from "react"
import { Home, Plus, X, LayoutTemplate, Calendar, FileText, Share2, Clock, Settings } from "lucide-react"
import { Inconsolata } from "next/font/google"

const font = Inconsolata({
    weight: "400",
    subsets: ['latin']
})

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("home")

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "files", label: "Files", icon: FileText },
    { id: "shared", label: "Shared with me", icon: Share2 },
    { id: "history", label: "History", icon: Clock },
    { id: "integrations", label: "Integrations", icon: Settings },
  ]

  const collections = [
    { name: "Commercial", color: "bg-red-500" },
    { name: "Operations", color: "bg-blue-500" },
    { name: "Product", color: "bg-green-500" },
  ]

  return (
    <aside className={`${font.className} w-72 bg-white border-r border-border flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Christina&apos;s</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 border-b border-border">
        <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground font-medium">
          <span>New chat</span>
          <Plus size={20} />
        </button>
      </div>

      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/50"
              }`}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <Icon size={18} className="text-muted-foreground" />
            </button>
          )
        })}
      </nav>

     
      <div className="px-4 py-4 border-t border-border space-y-3">
        <div className="space-y-2">
          {collections.map((collection) => (
            <div key={collection.name} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded ${collection.color}`} />
              <span className="text-sm text-foreground">{collection.name}</span>
            </div>
          ))}
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          + Add collection
        </button>
      </div>

      
      <div className="px-4 py-4 border-t border-border space-y-4">
        <button className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors">
          <span className="text-sm text-foreground font-medium">Settings</span>
          <span className="text-muted-foreground text-lg">⋮</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">100 credits left today</p>
            <p className="text-xs text-muted-foreground">Invite peers to refill</p>
          </div>
          
        </div>
      </div>
    </aside>
  )
}
