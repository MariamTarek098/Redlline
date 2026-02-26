import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import LoderSkeleton from "../LodaerSkeleton/LoderSkeleton";
import { FiArrowLeft } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["getPostsDetails",id],
    queryFn: getPost,
  });

  if (isLoading) return <div className="pt-30"><LoderSkeleton /></div> 
  if (isError) return <h1>Error...</h1>;

  const SinglePost = data?.data.data.post;
//   console.log(SinglePost);

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-zinc-200 pt-25 pb-15 px-4 sm:px-6">

        <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-red-900/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full md:w-3/4 max-w-3xl mx-auto relative z-10">

          <div className="mb-6">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-500 rounded-xl transition-all group backdrop-blur-md w-fit"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold text-sm">Back to Home</span>
            </Link>
          </div>

            <Card postInfo={SinglePost} />
         
        </div>
      </div>
    </>
  );
}
