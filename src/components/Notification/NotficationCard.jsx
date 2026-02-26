import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function NotificationCard({ notificationInfo }) {

  const { actor, type, isRead, createdAt, entity } = notificationInfo;
  const { name: actorName, photo: actorPhoto } = actor || {};
  const navigate = useNavigate();


  const handleNotificationClick = () => {
    if (type === 'follow_user') {
      navigate(`/profile`); 
    } else if (entity?._id) {
      navigate(`/postDetails/${entity._id}`);
    }
  };

  let actionText = '';
  if (type === 'follow_user') {
    actionText = 'started following you';
  } else if (type === 'comment_post') {
    actionText = 'commented on your post';
  } else if (type === 'like_post') {
    actionText = 'liked your post';
  } else {
    actionText = 'interacted with you';
  }

  const timeFormatted = formatTimeAgo(createdAt);
  const contentSnippet = entity?.body;

  return (
    <div 
      onClick={handleNotificationClick} 
      className="group bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 rounded-xl p-4 flex items-start gap-4 relative transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10 hover:-translate-y-0.5 cursor-pointer"
    >
      <img 
        src={actorPhoto || 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png'} 
        alt={actorName}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-zinc-700 shadow-inner"
      />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300 truncate">
          <span className="font-bold text-white mr-1 hover:text-red-400 transition-colors capitalize">
            {actorName}
          </span>
          {actionText}
        </p>
        {contentSnippet && type !== 'follow_user' && (
          <p className="text-sm text-zinc-500 mt-1 line-clamp-1 italic">
            "{contentSnippet.trim()}"
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-xs text-zinc-500 font-medium">{timeFormatted}</span>
        {isRead === false && (
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] mt-1"></div>
        )}
      </div>
    </div>
  );
}