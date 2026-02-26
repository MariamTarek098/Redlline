import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { authContext } from "../context/AuthContext";

export default function CommentCreation({ postId, querykey, postkey }) {
  const queryClientobj = useQueryClient();
  const { user } = useContext(authContext);

  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const profilePhoto = user?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
  const userName = user?.name || "User";

  //  API Functions
  const addComment = (commentData) => {
    const formData = new FormData();
    formData.append("content", commentData.content);
    
    if (commentData.image) {
      formData.append("image", commentData.image);
    }

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
      }
    );
  };

  //  Mutations 
  const { isPending, mutate } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      toast.success("Comment created successfully");

      queryClientobj.invalidateQueries({ queryKey: querykey });
      queryClientobj.invalidateQueries({ queryKey: postkey });

      // Reset Form State
      setCommentText("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      console.error("Failed to post comment:", error);
      toast.error("Failed to create Comment");
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleSubmit = () => {
    if (!commentText.trim() && !selectedImage) return;

    mutate({
      content: commentText,
      image: selectedImage,
    });
  };

  return (
    <div className="flex gap-3 pt-4 border-t border-zinc-800">
      <img
        src={profilePhoto}
        alt="Current user"
        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-800 shrink-0 mt-1"
      />

      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col focus-within:ring-1 focus-within:ring-zinc-700 transition-shadow overflow-hidden">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Comment as ${userName}...`}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm p-3 outline-none resize-none min-h-[60px]"
          rows={2}
          disabled={isPending}
        />

        {selectedImage && (
          <div className="px-3 pb-2">
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="h-20 rounded-lg border border-zinc-700 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-300 hover:text-red-500 p-1 rounded-full border border-zinc-700 transition-colors"
              >
                <FiX size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center p-2 pt-0">
          <div className="flex gap-2 ml-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isPending}
              className="text-zinc-500 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-zinc-900 disabled:opacity-50"
            >
              <FiImage size={24} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending || (!commentText.trim() && !selectedImage)}
            className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-red-900/20 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <FiSend size={16} className="animate-pulse" />
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              <>
                <FiSend size={18} className="-ml-0.5" />
                <span className="text-sm font-medium">Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}