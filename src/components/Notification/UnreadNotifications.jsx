import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoderSkeleton from "../LodaerSkeleton/LoderSkeleton";
import axios from "axios";
import NotificationCard from "./NotficationCard";


export default function UnreadNotification() {
  function getunread() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications", 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getunread"],
    queryFn: getunread,
  });

  if (isLoading) return <LoderSkeleton />;
  if (isError) return <h1>Error...</h1>;

  const allNotifications = data?.data.data.notifications || [];

  const unreadNotifications = allNotifications.filter(notif => notif.isRead === false);

  if (unreadNotifications.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg py-12 px-4 flex items-center justify-center w-full shadow-inner">
        <p className="text-zinc-500 text-sm font-medium tracking-wide">
          No unread notifications yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {unreadNotifications.map(notif => (
        <NotificationCard key={notif._id} notificationInfo={notif} />
      ))}
    </>
  );
}