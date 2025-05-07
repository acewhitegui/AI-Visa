import React from "react";
import {SessionProvider} from "next-auth/react";

export default function layout({children}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  )
}
