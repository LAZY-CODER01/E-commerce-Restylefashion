import React from "react";
import Image from "next/image";
import Link from "next/link";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function InfluencerCard({
  id = "1",
  name = "Sarah Style",
  handle = "@sarahstyle",
  followers = "120k",
  itemsListed = 45,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  coverUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
}) {
  return (
    <Link
      href={`/influencer/${id}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-drawer"
    >
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-brand-light">
        <Image
          src={coverUrl}
          alt={`${name}'s cover`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Profile Info */}
      <div className="relative flex flex-col items-center px-4 pb-5">
        {/* Avatar */}
        <div className="absolute -top-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="mt-14 flex flex-col items-center text-center">
          <div className="flex items-center gap-1">
            <h3 className="text-[18px] font-bold text-brand-dark">{name}</h3>
            <CheckCircleOutlineIcon className="text-brand-pink" sx={{ fontSize: 18 }} />
          </div>
          <p className="text-[14px] font-medium text-gray-500">{handle}</p>
          
          <div className="mt-4 flex items-center gap-4 text-[13px] font-semibold text-brand-dark">
            <div className="flex flex-col items-center rounded-lg bg-brand-light px-3 py-1.5">
              <span>{followers}</span>
              <span className="text-[11px] text-gray-500">Followers</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-brand-light px-3 py-1.5">
              <span>{itemsListed}</span>
              <span className="text-[11px] text-gray-500">Items</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
