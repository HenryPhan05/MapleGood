import logoIcon from "../public/images/logo icon.png";
import Image from "next/image";
import { Search, CircleUser } from "lucide-react";
export default function NavigationBarApp() {
  return (
    <div className="h-40" style={{ backgroundColor: "#E0A800" }}>
      <div className=" flex  flex-row p-5 gap-10  ">
        <Image src={logoIcon} alt="logoIcon" width={100} height={100} />
        <div>
          <p className="text-black font-bold text-2xl">Maple</p>
          <p className="text-white font-medium text-2xl ml-5">Goods</p>
        </div>
        <div className="flex items-center bg-[#FFFFFF] rounded-xl px-4 py-2 w-[300px] h-[50px]">
          <Search className="text-gray-600" size={25} />

          <input
            type="text"
            placeholder="Search for gadgets..."
            className="bg-transparent outline-none ml-2 w-full text-sm text-black"
          />
        </div>
        <CircleUser size={60} color="black" />
        <p>username</p>
        <button>
          Wishlist
        </button>
      </div>
    </div>
  )
}