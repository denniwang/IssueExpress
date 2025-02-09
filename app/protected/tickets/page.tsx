"use client";

import React from "react";
import DesertDrive from "./components/DesertDrive";
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function Home() {
  return (
    <>
      <DesertDrive />
      <div className="absolute top-4 left-4 z-50">
        <IoReturnUpBackOutline
          className="text-white text-4xl cursor-pointer"
          onClick={() => history.back()}
        />
      </div>
    </>
  );
}
