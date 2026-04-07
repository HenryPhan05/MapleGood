import Image from "next/image";
import logoIcon from "../public/images/logo icon.png";
import { Search, ShoppingCart, User } from "lucide-react";

export default function NavigationBarApp() {
  return (
    <div style={{ backgroundColor: "#E8A800" }} className="px-5 pt-3 pb-0 font-sans flex flex-col gap-5">

      <div className="flex items-center gap-4">

        <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0 mr-5 ml-15">
          <Image src={logoIcon} alt="Maple Goods Logo" width={60} height={60} />
        </div>


        <div className="flex-shrink-0 leading-tight mr-20">
          <p className="text-black font-extrabold text-3xl">Maple</p>
          <p className="text-white font-bold  text-3xl pl-3">Goods</p>
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 py-2 w-120 h-13 flex-shrink-0 mr-90">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search for gadgets..."
            className="bg-transparent outline-none ml-2 w-full text-sm text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mr-15">
          <div className="bg-white rounded-full w-15 h-15 flex items-center justify-center">
            <User size={35} className="text-gray-700" />
          </div>
          <span className="ml-2 text-black font-semibold text-2xl underline whitespace-nowrap">
            JohnDoe123
          </span>
        </div>


        <button className="bg-black text-white rounded-xl px-10 py-3.5 text-xl font-semibold hover:opacity-80 hover:cursor-pointer whitespace-nowrap">
          Wishlist
        </button>
        <button className="bg-black text-white rounded-xl px-10 py-3.5 text-xl font-semibold hover:opacity-80 hover:cursor-pointer whitespace-nowrap mr-10">
          Contact
        </button>

        <div className="relative flex flex-col items-center cursor-pointer  mt-3  hover:opacity-70  hover:cursor-pointer">
          <span className="absolute -top-6   text-3xl font-extrabold flex items-center justify-center">
            0
          </span>
          <ShoppingCart size={60} className="text-black" />
          <p className="absolute -right-13 mt-3 text-2xl font-bold text-black">Cart</p>
        </div>

      </div>

      {/* Bottom nav */}
      <div className="flex gap-7 pt-2.5 pb-3 ">
        {["Car devices", "Phone accessories", "Home security", "Audio equipment"].map((item) => (
          <button
            key={item}
            className="flex items-center gap-1 text-black font-semibold text-2xl cursor-pointer"
          >
            {item}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}