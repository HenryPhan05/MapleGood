

import logoIcon from "../public/images/logo icon.png";
import Image from "next/image";
export default function NavigationBarAuth() {
  return (
    <div className="h-161.67 flex flex-1 flex-row p-5 gap-10" style={{ backgroundColor: "#E0A800" }}>
      <Image src={logoIcon} alt="logoIcon" width={60} height={60} />
      <div>
        <p className="text-black font-bold text-2xl">Maple</p>
        <p className="text-white font-medium text-2xl ml-5">Goods</p>
      </div>
    </div>
  )
}