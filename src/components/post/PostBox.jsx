import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { authContext } from "../context/AuthContext";

export default function PostBox() {
  const queryClient = useQueryClient();
  const { user, userPhoto } = useContext(authContext);


  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
  const displayPhoto = userPhoto || user?.photo || defaultAvatar;
  const userName = user?.name || "User";

  // API Functions 
  const createPostRequest = (postData) => {
    const formData = new FormData();
    formData.append("body", postData.body);
    if (postData.image) {
      formData.append("image", postData.image);
    }

    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  };

  //  Mutations 
  const { mutate, isPending } = useMutation({
    mutationFn: createPostRequest,
    onSuccess: () => {
      // Reset Form
      setPostText("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["MyPosts"] });
    },
    onError: (error) => {
      console.error("Post failed:", error);
      toast.error("Failed to create post");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleSubmit = () => {
    if (!postText.trim() && !selectedImage) return;

    mutate({
      body: postText,
      image: selectedImage,
    });
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto mb-6">
      
    
      <div className="flex items-center gap-3 mb-4">
        <img
          src={displayPhoto}
          alt="User"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-900"
        />
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-none">{userName}</span>
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1">Creating Post</span>
        </div>
      </div>

      <div className="relative border border-zinc-800/50 rounded-xl bg-zinc-950/30 p-3 mb-4 focus-within:border-zinc-700 transition-colors">
        <textarea
          ref={textInputRef}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={`What's on your mind, ${userName}?`}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none text-base min-h-[100px]"
          disabled={isPending}
        />

        {selectedImage && (
          <div className="relative mt-2 group">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="max-h-80 w-full object-cover rounded-lg border border-zinc-800"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 backdrop-blur-sm transition-all"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
        <div className="flex items-center gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-all"
            disabled={isPending}
          >
            <FiImage size={20} />
            <span className="text-xs font-semibold">Photo/Video</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || (!postText.trim() && !selectedImage)}
          className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-red-900/20 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-sm">Posting...</span>
            </>
          ) : (
            <>
              <span className="text-sm">Post</span>
              <FiSend size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
