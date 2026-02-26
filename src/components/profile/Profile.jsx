import React, { useContext, useState, useRef } from "react";
import {
  FiCamera,
  FiUsers,
  FiMail,
  FiActivity,
  FiFileText,
  FiBookmark,
} from "react-icons/fi";

import MyPosts from "./../post/MyPosts";
import SavedPosts from "./../post/SavedPosts";
import { useQuery } from "@tanstack/react-query";
import LoderSkeleton from "./../LodaerSkeleton/LoderSkeleton";
import axios from "axios";
import { authContext } from "./../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("myPosts");
  const { setUserPhoto, user } = useContext(authContext);
  const loggedId = user?._id;

  // --- PHOTO UPLOAD STATE ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const queryClientobj = useQueryClient();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle closing the modal and resetting state
  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  function handleUpdatePhoto(file) {
    const formData = new FormData();
    formData.append("photo", file); // attach the actual file here

    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  //  USE MUTATION
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdatePhoto,
    onSuccess: (data) => {
      const newPhoto = data?.data?.data?.photo;
      setUserPhoto(newPhoto);
      handleCloseModal();
      toast.success("Profile picture updated successfully");
      queryClientobj.invalidateQueries({ queryKey: ["getProfile"] });
    },
    onError: (error) => {
      console.error("Failed to update Picture:", error);
      toast.error("Failed to update Picture");
    },
  });

  //  Handle saving
  const handleSavePhoto = () => {
    if (!selectedFile) return;

    console.log("Saving photo:", selectedFile);

    updateMutate(selectedFile);
  };

  //  QUERIES
  function getMyPostsCount() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${loggedId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { data: postsData } = useQuery({
    queryKey: ["MyPostsCount", loggedId],
    queryFn: getMyPostsCount,
    enabled: !!loggedId,
  });

  const postsCount = postsData?.data?.data?.posts?.length || 0;

  function getSaved() {
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data: savedData } = useQuery({
    queryKey: ["SavedPosts"],
    queryFn: getSaved,
  });

  const SavedCount = savedData?.data?.data?.bookmarks?.length || 0;

  function getprofileInfo() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getprofileInfo,
  });

  if (isLoading)
    return (
      <div className="pt-30">
        <LoderSkeleton />
      </div>
    );
  if (isError)
    return <h1 className="p-40 text-red-500">Error loading profile data</h1>;

  const profileInfo = data?.data?.data?.user || {};
  const {
    name,
    username,
    email,
    photo,
    followersCount,
    followingCount,
    bookmarksCount,
  } = profileInfo;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 pt-25 sm:pt-25 pb-10 px-2 sm:px-4 md:px-6 lg:px-8 selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden relative">
          <div className="h-48 bg-gradient-to-br from-red-900/40 via-black to-zinc-900 relative group flex justify-end p-4"></div>

          <div className="px-6 pb-8 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 z-10">
                <div className="relative group">
                  <img
                    src={
                      photo ||
                      "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-zinc-900 object-cover bg-black"
                  />
                  <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded-full border-2 border-zinc-900 transition-colors shadow-lg shadow-red-600/20"
                    >
                      <FiCamera size={14} />
                    </button>
                  </div>
                </div>

                <div className="pb-2">
                  <h1 className="text-3xl font-extrabold text-white leading-tight">
                    {name || "User"}
                  </h1>
                  <p className="text-zinc-400 font-medium mb-2">
                    @{username || "username"}
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                    <FiUsers size={12} />
                    Route Posts member
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <StatBox label="FOLLOWERS" value={followersCount || 0} />
                <StatBox label="FOLLOWING" value={followingCount || 0} />
                <StatBox label="BOOKMARKS" value={bookmarksCount || 0} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 col-span-1">
                <h3 className="text-zinc-100 font-bold text-sm mb-4">About</h3>
                <div className="flex flex-col gap-3 text-sm text-zinc-400">
                  <div className="flex items-center gap-3">
                    <FiMail size={16} />
                    <span className="truncate">
                      {email || "No email provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiActivity size={16} />
                    <span>Active on Route Posts</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                <div
                  onClick={() => setActiveTab("myPosts")}
                  className="bg-black border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-center cursor-pointer transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                    My Posts
                  </span>
                  <span className="text-white text-2xl font-bold">
                    {postsCount}
                  </span>
                </div>
                <div
                  onClick={() => setActiveTab("saved")}
                  className="bg-black border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-center cursor-pointer transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                    Saved Posts
                  </span>
                  <span className="text-white text-2xl font-bold">
                    {SavedCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
              <h3 className="text-white text-lg font-bold mb-6">
                Update Profile Picture
              </h3>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current.click()}
                className="w-40 h-40 rounded-full border-2 border-dashed border-zinc-700 hover:border-red-500 bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors group mb-6 relative"
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-bold">
                        Change
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-500 flex flex-col items-center group-hover:text-red-500 transition-colors">
                    <FiCamera size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase text-center mt-2 px-2">
                      Click to browse
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-transparent hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoto}
                  disabled={!selectedFile || isUpdating}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-red-600/20 flex justify-center items-center"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex justify-between items-center shadow-xl">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("myPosts")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === "myPosts"
                  ? "bg-black text-white border border-zinc-800 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <FiFileText
                className={activeTab === "myPosts" ? "text-red-500" : ""}
                size={16}
              />
              My Posts
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === "saved"
                  ? "bg-black text-white border border-zinc-800 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <FiBookmark
                className={activeTab === "saved" ? "text-red-500" : ""}
                size={16}
              />
              Saved
            </button>
          </div>

          <div className="bg-black border border-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full text-sm font-bold mr-2">
            {activeTab === "myPosts" ? postsCount : SavedCount}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-7 max-w-full">
          {activeTab === "myPosts" ? <MyPosts /> : <SavedPosts />}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="flex-1 md:flex-none bg-black border border-zinc-800 rounded-2xl px-6 py-3 flex flex-col items-center justify-center min-w-[100px]">
      <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-white text-xl font-bold">{value}</span>
    </div>
  );
}
