import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiUserPlus, FiBookmark, FiUsers, FiLayout } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

import AllPosts from "../post/AllPosts";
import FeedPosts from "../post/FeedPosts";
import MyPosts from "../post/MyPosts";
import SavedPosts from "../post/SavedPosts";
import PostBox from "../post/PostBox";

export default function Home() {
  const queryClientobj = useQueryClient();
  const [activeSection, setActiveSection] = useState("community");

  //  API Functions 
  const getsuggestions = () => 
    axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=10`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` }
    });

  const handleFollow = ({ suggId }) =>
    axios.put(`https://route-posts.routemisr.com/users/${suggId}/follow`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });

  //  Queries and Mutations 
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getsuggestions,
  });

  const { mutate: followMutate } = useMutation({
    mutationFn: handleFollow,
    onSuccess: (data, variables) => {
      toast.success(`You followed ${variables.suggName}`);
      queryClientobj.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onError: () => toast.error("Failed to follow"),
  });

  const suggestions = data?.data?.data?.suggestions || [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 pt-25 pb-10 px-2 sm:px-4 md:px-6 lg:px-8 selection:bg-red-500/30">
      
      <div className="fixed top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[260px_1fr_300px] gap-4 sm:gap-6 relative z-10">
        
        {/* Navigation Sidebar */}
        <aside className="h-fit relative md:sticky md:top-25 lg:top-24 z-20">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-2 sm:p-3 flex flex-row md:flex-col gap-2 shadow-xl overflow-x-auto hide-scrollbar">
            <SidebarItem icon={<FiLayout />} label="Feed" active={activeSection === "feed"} onClick={() => setActiveSection("feed")} />
            <SidebarItem icon={<LuSparkles className="rotate-90" />} label="My Posts" active={activeSection === "myposts"} onClick={() => setActiveSection("myposts")} />
            <SidebarItem icon={<FiUsers />} label="Community" active={activeSection === "community"} onClick={() => setActiveSection("community")} />
            <SidebarItem icon={<FiBookmark />} label="Saved" active={activeSection === "saved"} onClick={() => setActiveSection("saved")} />
          </div>
        </aside>

        <main className="space-y-6 min-w-0">
          <PostBox />
          <div className="dynamic-content">
            {activeSection === "feed" && <FeedPosts />}
            {activeSection === "community" && <AllPosts />}
            {activeSection === "myposts" && <MyPosts />}
            {activeSection === "saved" && <SavedPosts />}
          </div>
        </main>

        {/* Right Sidebar, Suggestions */}
        <aside className="hidden lg:block h-fit sticky top-24">
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6 shadow-xl flex flex-col gap-6 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold tracking-tight">Suggested for you</h3>
              <button className="text-red-500 text-xs font-semibold hover:underline">View all</button>
            </div>
            
            <div className="space-y-5">
              {isLoading ? (
                <div className="text-zinc-500 text-sm">Loading suggestions...</div>
              ) : suggestions.length === 0 ? (
                <div className="text-zinc-500 text-sm">No suggestions found.</div>
              ) : (
                suggestions.map((suggestion) => {
                  const { _id, name, username, photo, followersCount } = suggestion;
                  return (
                    <div key={_id} className="flex items-center justify-between group">
                      <div className="flex gap-3 min-w-0">
                        <img 
                          src={photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"} 
                          className="w-10 h-10 rounded-xl shrink-0 object-cover" 
                          alt={name} 
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-red-500 transition-colors truncate">{name}</p>
                          <p className="text-[11px] text-zinc-500 font-mono uppercase truncate">@{username || "user"}</p>
                          <p className="text-[11px] text-zinc-500">{followersCount} followers</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => followMutate({ suggId: _id, suggName: name })} 
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                      >
                        <FiUserPlus size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start gap-4 p-3 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 group flex-1 md:flex-none
        ${active
          ? "bg-red-600 text-white shadow-lg shadow-red-600/20 font-semibold"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40"
        }`}
    >
      <span className={`text-xl sm:text-lg ${active ? "text-white" : "text-red-500/80 group-hover:text-red-500"} transition-colors`}>
        {icon}
      </span>
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}