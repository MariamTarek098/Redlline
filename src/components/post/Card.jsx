import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiMoreHorizontal,
  FiMessageSquare,
  FiShare2,
  FiThumbsUp,
  FiBookmark,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { BiSolidLike } from "react-icons/bi";

import AllComments from "../comment/AllComments";
import { authContext } from "../context/AuthContext";

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

export default function Card({ postInfo, queryKey }) {
  const navigate = useNavigate();
  const queryClientobj = useQueryClient();
  const { user } = useContext(authContext);
  const loggedId = user?._id;

  // Destructure Post Info
  const {
    body,
    createdAt,
    image,
    sharesCount,
    commentsCount,
    likesCount,
    topComment,
    _id,
  } = postInfo;
  const { name, photo, username, _id: userId } = postInfo.user;
  const { content, commentCreator } = topComment || {};
  const { name: commentname, photo: commentphoto } = commentCreator || {};

  //  State
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(body);
  const [isLiked, setIsLiked] = useState(
    postInfo.likes ? postInfo.likes.includes(loggedId) : false,
  );
  const [isSaved, setIsSaved] = useState(postInfo.bookmarked || false);
console.log("log", postInfo.bookmarked);

  const timeDisplay = formatTimeAgo(createdAt);

  //  API Functions
  const deletePostRequest = () =>
    axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
    });

  const updatePostRequest = () => {
    const formData = new FormData();
    formData.append("body", editContent);
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
      },
    );
  };

  const likePostRequest = () =>
    axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
      },
    );
  const handlesavePost = () =>
    axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/bookmark`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
      },
    );

  //  Mutations
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: deletePostRequest,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClientobj.invalidateQueries({ queryKey: ["getPosts"] });
      queryClientobj.invalidateQueries({ queryKey: ["MyPosts"] });
      navigate("/home");
    },
    onError: () => toast.error("Failed to delete Post"),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updatePostRequest,
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Post updated successfully");
      queryClientobj.invalidateQueries({ queryKey: ["getPosts"] });
      queryClientobj.invalidateQueries({ queryKey: ["MyPosts"] });
    },
    onError: () => toast.error("Failed to update Post"),
  });

const { mutate: savePost } = useMutation({
  mutationFn: handlesavePost,
  onMutate: () => {
    const wasAlreadySaved = isSaved;

    setIsSaved((prev) => !prev);

    return { wasAlreadySaved };
  },
  onSuccess: (data, variables, context) => {

    if (!context.wasAlreadySaved) {
      toast.success("Post Saved Successfully");
    } else {
      toast.success("Post Removed from Saved");
    }

    queryClientobj.invalidateQueries({ queryKey: ["getPosts"] });
    queryClientobj.invalidateQueries({ queryKey: ["SavedPosts"] });
  },
  onError: (err, variables, context) => {
    setIsSaved(context.wasAlreadySaved);
    toast.error("Action failed. Please try again.");
  },
});

  const { mutate: updateLike } = useMutation({
    mutationFn: likePostRequest,
    onSuccess: () => {
      queryClientobj.invalidateQueries({ queryKey: ["getPosts"] });
      queryClientobj.invalidateQueries({ queryKey: ["getPostsDetails", _id] });
    },
    onError: () => {
      setIsLiked(!isLiked);
      toast.error("Action failed. Please try again.");
    },
  });

  const handleToggleLike = () => {
    const newlyLiked = !isLiked;
    setIsLiked(newlyLiked);
    newlyLiked ? toast.success("Post liked") : toast.success("Post unliked");
    updateLike();
  };

  const handleCancelEdit = () => {
    setEditContent(body);
    setIsEditing(false);
  };

  return (
    <div className="w-full mx-auto bg-black border border-zinc-800 rounded-2xl p-4 shadow-2xl relative mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <img
            src={photo}
            alt="avatar"
            onError={(e) =>
              (e.target.src =
                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png")
            }
            className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800"
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-white font-bold text-base leading-none mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                @{username || "member"}
              </span>
              <span>·</span>
              <span>{timeDisplay}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            disabled={isPending}
            onClick={() => setShowOptionMenu(!showOptionMenu)}
            className="text-zinc-500 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-all"
          >
            <FiMoreHorizontal size={20} />
          </button>

          {showOptionMenu && (
            <div className="absolute top-8 right-0 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1">
              <button
                onClick={() => {
                  savePost();
                  setShowOptionMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-sm ${
                  isSaved
                    ? "text-red-500"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <FiBookmark
                  size={14}
                  className={
                    isSaved ? "text-red-500 fill-current" : "text-zinc-400"
                  }
                />
                {isSaved ? "Unsave post" : "Save post"}
              </button>

              {userId === loggedId && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptionMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
                  >
                    <FiEdit2 size={14} className="text-zinc-400" /> Edit post
                  </button>
                  <div className="h-px bg-zinc-800 my-1"></div>
                  <button
                    onClick={() => deleteMutate()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                  >
                    <FiTrash2 size={14} /> Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl p-3 min-h-[120px] outline-none focus:border-red-600 transition-all"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 text-zinc-400 text-sm hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutate()}
                className="px-5 py-1.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                {isUpdating ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-zinc-100 text-base mb-3 whitespace-pre-wrap">
              {body}
            </p>
            {image && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 mt-2">
                <img
                  src={image}
                  alt="Content"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-center py-2 text-zinc-500 text-sm border-b border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="bg-red-600 p-1 rounded-full flex items-center justify-center">
            <BiSolidLike size={10} className="text-white" />
          </div>
          <span className="hover:underline cursor-pointer">
            {likesCount} likes
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{sharesCount} shares</span>
          <span>{commentsCount} comments</span>
          <Link
            to={`/postDetails/${_id}`}
            className="text-red-600 hover:text-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
          >
            View details
          </Link>
        </div>
      </div>

      <div className="flex items-center mt-1 pt-1">
        <ActionButton
          onClick={handleToggleLike}
          isActive={isLiked}
          icon={isLiked ? <BiSolidLike size={18} /> : <FiThumbsUp size={18} />}
          label={isLiked ? "Unlike" : "Like"}
        />
        <ActionButton
          onClick={() => setShowAllComments((prev) => !prev)}
          icon={<FiMessageSquare size={18} />}
          label="Comment"
        />
        <ActionButton icon={<FiShare2 size={18} />} label="Share" />
      </div>

      {showAllComments ? (
        <AllComments postId={_id} postInfo={postInfo} queryKey={queryKey} />
      ) : (
        topComment && (
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 shadow-xl mt-4">
            <h4 className="text-zinc-500 text-[10px] font-bold mb-4 uppercase tracking-widest">
              Top Comment
            </h4>
            <div className="flex gap-3 mb-4">
              <img
                src={
                  commentphoto ||
                  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                }
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                alt="avatar"
              />
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl rounded-tl-sm p-3 w-full">
                <h5 className="text-white font-bold text-sm mb-1">
                  {commentname}
                </h5>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
            <button
              className="text-red-600 hover:text-red-500 text-xs font-bold transition-colors"
              onClick={() => setShowAllComments(true)}
            >
              View all comments
            </button>
          </div>
        )
      )}
    </div>
  );
}

function ActionButton({ icon, label, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium rounded-lg transition-colors group ${
        isActive
          ? "text-red-500 bg-red-500/10"
          : "text-zinc-400 hover:bg-zinc-900/80"
      }`}
    >
      <span
        className={
          isActive
            ? "text-red-500"
            : "group-hover:text-red-500 transition-colors"
        }
      >
        {icon}
      </span>
      <span
        className={
          isActive
            ? "text-red-500"
            : "group-hover:text-red-500 transition-colors"
        }
      >
        {label}
      </span>
    </button>
  );
}
