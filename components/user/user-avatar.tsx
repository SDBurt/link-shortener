import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/shared/icons"
import { User } from "@clerk/nextjs/dist/types/server"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "imageUrl" | "username">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {

  return (
    <Avatar {...props}>
      {user.imageUrl ? (
        <AvatarImage alt="Picture" src={user.imageUrl} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.username}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
