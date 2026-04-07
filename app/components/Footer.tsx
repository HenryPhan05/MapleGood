export default function Footer() {
  return (
    <div className="bg-black flex flex-row p-10 justify-around"  >
      <div className="flex flex-col">
        <button className="p-2 bg-blue-600 w-10 h-10 text-center text-2xl font-extrabold rounded-full mb-5">f</button>
        <p className="text-gray-500 mb-1">Pioneering the future of in-car</p>
        <p className="text-gray-500 mb-1" >entertainment. We provide high-end,</p>
        <p className="text-gray-500 mb-1">reliable electronics that transform your</p>
        <p className="text-gray-500 mb-1">daily commute into a premium driving</p>
        <p className="text-gray-500 mb-1" >experience</p>
      </div>
      <div>
        <h1 className="text-white font-bold text-xl mb-5">Top Products</h1>
        <p className="text-gray-500 mb-5">Speakers</p>
        <p className="text-gray-500 mb-5">Headphones</p>
        <p className="text-gray-500 mb-5">DashCams</p>
      </div>
      <div>
        <h1 className="text-white font-bold text-xl mb-5">Top Categories</h1>
        <p className="text-gray-500 mb-10">Car Electronics</p>
        <p className="text-gray-500 mb-10">Accessories</p>
      </div>
    </div >
  )
}