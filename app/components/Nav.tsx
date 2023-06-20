"use client";

import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

export default function Nav({ user }: Session) {
  return (
    <nav>
      <h1>style</h1>
      <ul>
        <li>Products</li>
        {/* If the user is not signed in */}
        {!user && (
          <li>
            <button onClick={() => signIn()}>Sing in</button>
          </li>
        )}

        {/* If the user is  signed in */}
        {user && (
          <li>
            <Image
              src={user?.image as string}
              alt={user?.name as string}
              width={48}
              height={48}
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
