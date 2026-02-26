import React, { useState } from 'react';
import AllNotifications from './AllNotifications';
import UnreadNotifications from './UnreadNotifications';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; 

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');

    function GetUnreadCount() {
      return axios.get(
        "https://route-posts.routemisr.com/notifications/unread-count", 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tkn")}`,
          },
        },
      );
    }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: GetUnreadCount,
  });


  const unreadCount = data?.data.data.unreadCount;
 


  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-6 sm:p-8">
        
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Notifications</h1>
              <p className="text-zinc-400 text-sm mt-1.5">
                Realtime updates for likes, comments, shares, and follows.
              </p>
            </div>
          </div>

          <div className=" flex items-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
                  : 'bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'unread'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
                  : 'bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              Unread
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                activeTab === 'unread' ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}>
               {isLoading ? "..." : unreadCount} 
              </span>
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50"></div>

        <div className="space-y-5 p-6 sm:p-8 bg-black/20">
          {activeTab === 'all' ? <AllNotifications /> : <UnreadNotifications />}
        </div>
        
      </div>
    </div>
  );
}