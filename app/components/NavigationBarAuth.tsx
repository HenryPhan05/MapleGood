"use client"
import Image from "next/image";
import logoIcon from "../public/images/logo icon.png";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function NavigationBarApp() {

  return (
    <div style={{ backgroundColor: "#E8A800" }} className="px-5 pt-3 pb-4 font-sans flex flex-col gap-5">

      <div className="flex items-center gap-4">

        <Link href="/user" className="bg-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0 mr-5 ml-15">
          <Image src={logoIcon} alt="Maple Goods Logo" width={60} height={60} />
        </Link>


        <div className="flex-shrink-0 leading-tight mr-20">
          <p className="text-black font-extrabold text-3xl">Maple</p>
          <p className="text-white font-bold  text-3xl pl-3">Goods</p>
        </div>


      </div>


    </div>
  );
}