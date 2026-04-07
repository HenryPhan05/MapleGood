import { ArrowRight, ArrowLeft } from "lucide-react";
import StarRating from "../components/StarRating";
import LogoutButton from "../components/LogoutButton";
import NavigationBarApp from "../components/NavigationBarApp";
import Image from "next/image";
import carAccessoriesImage from "../public/images/categories/carAccessories.png";
import carElectronicsImage from "../public/images/categories/carElectronic.png";
import othersImage from "../public/images/categories/others.png";
import phoneAccessoriesImage from "../public/images/categories/phoneAccessories.png";
import headphoneImage from "../public/images/products/headphone.png";
import phoneImage from "../public/images/products/phone.png";
import speakerImage from "../public/images/products/speaker.png";
import { int } from "zod";
import Footer from "../components/Footer";
export default function homepageUser() {
  const sampleCategoriesData = [
    {
      id: "1",
      name: "Car Accessories",
      image: carAccessoriesImage
    },
    {
      id: "2",
      name: "Phone Accessories",
      image: phoneAccessoriesImage,
    },
    {
      id: "3",
      name: "Car Electronics",
      image: carElectronicsImage,
    },
    {
      id: "4",
      name: "Audio Equipment",
      image: othersImage,
    }
    , {
      id: "5",
      name: "Others",
      image: speakerImage,
    }
  ];
  const sampleProductsData = [
    {
      id: "1",
      name: "Mapple Guard 4K",
      category: "Car Screens",
      price: 249.99,
      description: "Dual-channel dash cam",
      quantity: 3,
      image: carElectronicsImage,
      rate: 4
    },
    {
      id: "2",
      name: "Precision X1 Radar",
      category: "Audio Equipment",
      price: 299.00,
      description: "Long-range 360 radar detection",
      quantity: 10,
      image: headphoneImage,
      rate: 4.5,
    },
    {
      id: "3",
      name: "Connect Pro 10",
      category: "Phone Accessories",
      price: 299.99,
      description: "wireless smartphone integration",
      quantity: 3,
      image: phoneImage,
      rate: 4
    },
    {
      id: "4",
      name: "Phone Charger",
      category: "Phone Accessories",
      price: 29.99,
      description: "High-fidelity 3-way speaker system",
      quantity: 3,
      image: phoneAccessoriesImage,
      rate: 4
    },
    {
      id: "5",
      name: "Aura Component Set",
      category: "Others",
      price: 299.99,
      description: "High-fidelity 3-way speaker system",
      quantity: 3,
      image: speakerImage,
      rate: 4
    }
  ]
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="sticky top-0 bg-white" style={{ zIndex: 1000 }}>
        <NavigationBarApp />
      </div>
      {/**main */}
      <div>
        <div>
          <h1 className="mt-20 ml-5 text-4xl font-extrabold" style={{ color: "#E8A800" }}>Categories</h1>
          <div className="flex flex-row justify-evenly mt-10" >
            {sampleCategoriesData.map((category) => (
              <div key={category.id} className="bg-white w-100 h-100 flex-col items-center rounded-2xl hover:opacity-70 hover:cursor-pointer">
                <Image src={category.image} alt={category.name} width={300} height={300} className="mt-10 mr-10 ml-10" />
                <p className="text-center text-black text-2xl font-bold mt-2 ">{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="m-10">
          <h1 className="mt-20 ml-5 text-4xl font-extrabold" style={{ color: "#E8A800" }}>Popular</h1>
          <p className="text-gray-500 ml-5 mt-2 italic text-xm">The most popular upgrades for modern vehicles</p>
          <div className="mt-5 flex flex-row justify-center gap-8">
            <ArrowLeft size={50} color={'black'} className="p-3 rounded-full mt-50" style={{ backgroundColor: "#E8A800" }} />
            <div className="flex flex-row justify-between gap-10 ">
              {sampleProductsData.map((product) => (
                <div key={product.id} className="bg-white w-[350px]  flex-col items-center rounded-2xl hover:opacity-70 hover:cursor-pointer">
                  <Image src={product.image} alt={product.name} width={250} height={250} className="mt-10 mr-10 ml-10" />
                  <h1 className="mt-5 ml-1 text-black text-xl font-bold">{product.name}</h1>
                  <p className="mt-1 ml-1 text-gray-500">{product.description}</p>
                  <div className="flex flex-row justify-between">
                    <p className="mt-5 ml-1 text-2xl text-black font-bold">${product.price.toFixed(2)}</p>
                    <div className="flex flex-row gap-1 mr-3 mt-3">
                      <p className="text-black text-xm mt-3">{product.rate}</p>
                      <StarRating rate={product.rate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ArrowRight size={50} color={'black'} className="p-3 rounded-full mt-50" style={{ backgroundColor: "#E8A800" }} />
          </div>
          <div>

          </div>
        </div>
        {/**Footer */}
        <div>
          <Footer />
        </div>
      </div>
      {/* <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Hello</h1>
        <LogoutButton />
      </div> */}
    </div >
  );
}