"use client";
import React from "react";
import Header from "../header/Header";

const PostLoginLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {children}
    </div>
  );
};

export default PostLoginLayout;
