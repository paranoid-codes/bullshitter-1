import React from 'react'
import ThemeToggle from './theme-toggle'

export default function UploadHeader() {
  return (
          <div className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">Bullshitter</h1>
                <ThemeToggle />
              </div>
            </div>
          </div>
  )
}