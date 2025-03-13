"use client";
import Sidebar from "@/app/Components/Sidebar/Sidebar";
import { useUserContext } from "@/context/userContext";
import React from "react";

function SidebarProvider() {
  const { user } = useUserContext();
  const userId = user ? user._id : null;

  return <>{userId && <Sidebar />}</>;
}

export default SidebarProvider;