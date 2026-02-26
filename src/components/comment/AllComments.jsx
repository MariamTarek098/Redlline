import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi'; 
import { authContext } from "../context/AuthContext";
import CommentCreation from "./CommentCreation";


function formatTimeAgo(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m";

  return "now";
}

export default function AllComments({ postId, queryKey: postkey }) {
  const queryClientobj = useQueryClient();
  const { user } = useContext(authContext);
  const loggedId = user?._id;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [editContent, setEditContent] = useState("");
  const [likingId, setLikingId] = useState(null);

  //  API Functions 
  const getComments = () => 
    axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });

  const handleDeleteComm = ({ postId, commentId }) =>
    axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });

  const handleUpdateComm = ({ postId, commentId }) => {
    const formData = new FormData();
    formData.append("content", editContent);
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });
  };

  const handleLike = ({ postId, commentId }) =>
    axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });

  //  Queries and Mutations 
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getComments", postId],
    queryFn: getComments,
  });

  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: handleDeleteComm,
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClientobj.invalidateQueries({ queryKey: ["getComments", postId] });
      queryClientobj.invalidateQueries({ queryKey: postkey });
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateComm,
    onSuccess: () => {
      setEditingId(null);
      toast.success("Comment updated successfully");
      queryClientobj.invalidateQueries({ queryKey: ["getComments", postId] }); 
    },
    onError: () => toast.error("Failed to update comment"),
  });

  const { mutate: likekMutate, isPending: isliking } = useMutation({
    mutationFn: handleLike,
    onMutate: (variables) => setLikingId(variables.commentId),
    onSuccess: (response) => {
      const wasLiked = response.data.data.liked; 
      wasLiked ? toast.success("Comment liked") : toast.success("Comment unliked");
      queryClientobj.invalidateQueries({ queryKey: ["getComments", postId] });
    },
    onSettled: () => setLikingId(null),
    onError: () => toast.error("Something went wrong"),
  });

  const handleStartEdit = (commentId, currentContent) => {
    setEditingId(commentId); 
    setEditContent(currentContent);
    setOpenMenuId(null); 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };


  if (isLoading) return (
    <div className="flex justify-center py-6">
      <div className="w-6 h-6 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  if (isError) return <h1 className="text-center text-red-500 py-4">Error fetching comments</h1>;

  const postcomments = data?.data?.data?.comments || [];

  if (postcomments.length === 0) return (
    <>
      <div className="text-zinc-500 text-center py-6 text-sm">No comments yet.</div>
      <CommentCreation postId={postId} queryKey={["getComments", postId]} />
    </>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-lg">Comments</h2>
          <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2 py-0.5 rounded-full">
            {postcomments.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-6">
        {postcomments.map((comment, index) => {
          const { content, commentCreator, likes, createdAt, _id, image, post: cPostId } = comment || {};
          const { name, username, photo, _id: creatorId } = commentCreator || {};
          const timeDisplay = formatTimeAgo(createdAt);
          const profilePhoto = photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
          const userHasLiked = likes?.includes(loggedId);
          const isEditing = editingId === _id;

          return (
            <div key={_id || index} className="flex gap-3 w-full">
              <img src={profilePhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-800 shrink-0" />

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start w-full group">
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[95%]">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 bg-black text-zinc-100 border border-zinc-800 rounded-full px-4 py-2 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                        autoFocus
                      />
                      <div className="flex shrink-0 gap-2">
                        <button disabled={isUpdating} onClick={() => updateMutate({ postId, commentId: _id })} className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors shadow-lg shadow-red-600/20">
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button disabled={isUpdating} onClick={handleCancelEdit} className="bg-transparent hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[90%]">
                      <span className="text-white font-bold text-sm">{name}</span>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-zinc-500 text-xs">@{username || "member"} · {timeDisplay}</span>
                      </div>
                      <p className="text-zinc-200 text-sm mt-1 break-words">{content}</p>
                      {image && <img src={image} alt="comment" className="rounded-2xl py-2 mt-1 max-w-full h-auto" />}
                    </div>
                  )}

                  {!isEditing && creatorId === loggedId && (
                    <div className="relative shrink-0">
                      <button onClick={() => setOpenMenuId(openMenuId === _id ? null : _id)} className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-all">
                        <FiMoreHorizontal size={20} />
                      </button>
                      {openMenuId === _id && (
                        <div className="absolute top-10 right-0 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                          <button onClick={() => handleStartEdit(_id, content)} className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left text-sm">
                            <FiEdit2 size={14} className="text-zinc-400" /> Edit
                          </button>
                          <div className="h-px bg-zinc-800 my-1"></div>
                          <button disabled={isPending} onClick={() => deleteMutate({ postId, commentId: _id })} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors text-left text-sm font-medium">
                            <FiTrash2 size={14} /> {isPending ? "Deleting...": "Delete"} 
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-zinc-500 font-medium">
                    {timeDisplay}
                    <span onClick={() => likekMutate({ postId, commentId: _id })} className={`cursor-pointer transition-colors ${userHasLiked ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}>
                      {isliking && likingId === _id ? "Liking..." : `Like ${likes?.length || 0}`}
                    </span>
                    <button className="hover:text-zinc-300 transition-colors">Reply</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <CommentCreation postId={postId} queryKey={["getComments", postId]} postkey={postkey} />
    </>
  );
}