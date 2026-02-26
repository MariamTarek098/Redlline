import React from 'react'

export default function LoderSkeleton() {
  return (
     <div className="w-full max-w-2xl mx-auto bg-black border border-zinc-800 rounded-2xl p-4 shadow-2xl animate-pulse">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
          <div className="space-y-2">
            <div className="w-32 h-3 bg-zinc-800 rounded" />
            <div className="w-20 h-2 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="w-6 h-6 bg-zinc-800 rounded-full" />
      </div>

      {/* CONTENT TEXT */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
      </div>



      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-3">
        <div className="flex-1 h-10 bg-zinc-800 rounded-lg" />
        <div className="flex-1 h-10 bg-zinc-800 rounded-lg" />
        <div className="flex-1 h-10 bg-zinc-800 rounded-lg" />
      </div>
    </div>
  )
}
