import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoderSkeleton from "../LodaerSkeleton/LoderSkeleton";
import axios from "axios";
import NotificationCard from "./NotficationCard";

export default function AllNotifications() {
  function getNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const {data , isLoading , isError, error, isFetching, refetch } = useQuery({
    queryKey: ["Notifications"],
    queryFn: getNotifications,
    
 


})
console.log(error);
// console.log(data?.posts);



  if (isLoading ) return <LoderSkeleton />
  if (isError) return <h1>Error...</h1>

const notifications = data?.data.data.notifications


  if (!notifications || notifications.length === 0) {
    return (
     <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg py-12 px-4 flex items-center justify-center w-full shadow-inner">
      <p className="text-zinc-500 text-sm font-medium tracking-wide">
        No unread notifications yet.
      </p>
    </div>
    )
  }

  return (
    <>
     {notifications?.map(notif => (
             <NotificationCard key={notifications._id} notificationInfo={notif} />
           ))}
    </>
  );
}
