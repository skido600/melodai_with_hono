"use client";

import { useMe } from "@/hooks/useme";
import Image from "next/image";

export default function Profile() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="space-y-1">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <Image
        src={user.avatarUrl || "/default-avatar.png"}
        alt={user.name || "User"}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="min-w-0">
        <h1 className="truncate text-xs font-semibold">{user.name}</h1>

        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
