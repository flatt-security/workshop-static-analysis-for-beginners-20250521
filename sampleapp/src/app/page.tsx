import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard");
  }

  // This part will never be rendered
  return null;
}
