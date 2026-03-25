"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";

type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export default function UserArea({ user }: { user: User | null }) {
  const router = useRouter();

  if (!user) return null;

  const nameIcon = user.email?.substring(0, 2)?.toUpperCase();
  const displayName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{nameIcon}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
          // setUser({
          //   id: "",
          //   email: "",
          //   first_name: "",
          //   last_name: "",
          //   token: "",
          //   expires_at: 0,
          //   refresh_token: "",
          //   known_status: "known",
          // })
          router.push("/login")
        }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
