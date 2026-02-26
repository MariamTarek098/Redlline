
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Card from './Card'
import LoderSkeleton from '../LodaerSkeleton/LoderSkeleton'
import {
  FiUsers,
 
} from "react-icons/fi";
import { useQuery } from '@tanstack/react-query';
import { authContext } from '../context/AuthContext';

export default function MyPosts() {
  const { user } = useContext(authContext);
  const loggedId = user?._id ;

function getMyPosts(){
    return axios.get(`https://route-posts.routemisr.com/users/${loggedId}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`
      }
    })
}


const {data , isLoading , isError, error, isFetching, refetch } = useQuery({
 queryKey: ["MyPosts"],
  queryFn: getMyPosts,




})
// console.log(data);
// console.log(data?.posts);


if (isLoading ) return <LoderSkeleton />
if (isError) return <h1>Error...</h1>

const myPosts = data?.data.data.posts


  if (!myPosts || myPosts.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers />}
        title="No posts yet"
        text="Be the first one to post something!"
      />
    )
  }

  return (
    <>
      {myPosts?.map(post => (
        <Card key={post._id} postInfo={post} />
      ))}
    </>
  )
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-800/50 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-zinc-700 shadow-inner border border-zinc-800">
        <div className="text-3xl sm:text-4xl opacity-20">{icon}</div>
      </div>
      <h3 className="text-zinc-200 font-bold text-lg sm:text-xl mb-2">{title}</h3>
      <p className="text-zinc-500 text-xs sm:text-sm max-w-[250px] leading-relaxed">{text}</p>
    </div>
  );
}