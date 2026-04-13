"use client"
import { ArrowRight, ArrowLeft } from "lucide-react";
import StarRating from "../components/StarRating";
import NavigationBarApp from "../components/NavigationBarApp";
import Image from "next/image";
import carAccessoriesImage from "../public/images/categories/carAccessories.png";
import carElectronicsImage from "../public/images/categories/carElectronic.png";
import othersImage from "../public/images/categories/others.png";
import phoneAccessoriesImage from "../public/images/categories/phoneAccessories.png";
import headphoneImage from "../public/images/products/headphone.png";
import phoneImage from "../public/images/products/phone.png";
import speakerImage from "../public/images/products/speaker.png";
import Footer from "../components/Footer";


// add to cart
import { addToCart, type CartItem } from "./cart/cartService";
import { useState, useEffect } from "react";
import { auth } from '@/lib/firebase'
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function HomepageUser() {
  
    const [user, setUser] = useState<User | null>(null);

    const handleAdd = async (product: CartItem) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    await addToCart(user.uid, product);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);
  const sampleCategoriesData = [
    {
      id: "1",
      name: "Car Accessories",
      image: carAccessoriesImage,
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
    },
    {
      id: "5",
      name: "Others",
      image: speakerImage,
    },
  ];
  const sampleProductsData = [
    {
      id: "1",
      name: "Maple Guard 4K",
      category: "Car Screens",
      price: 249.99,
      description: "Dual-channel dash cam",
      quantity: 3,
      image: carElectronicsImage,
      rate: 4,
    },
    {
      id: "2",
      name: "Precision X1 Radar",
      category: "Audio Equipment",
      price: 299.0,
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
      rate: 4,
    },
    {
      id: "4",
      name: "Phone Charger",
      category: "Phone Accessories",
      price: 29.99,
      description: "High-fidelity 3-way speaker system",
      quantity: 3,
      image: phoneAccessoriesImage,
      rate: 4,
    },
    {
      id: "5",
      name: "Aura Component Set",
      category: "Others",
      price: 299.99,
      description: "High-fidelity 3-way speaker system",
      quantity: 3,
      image: speakerImage,
      rate: 4,
    },
  ];
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="sticky top-0 bg-white" style={{ zIndex: 1000 }}>
        <NavigationBarApp />
      </div>
      {/**main */}
      <div>
        <div>
          <h1
            className="ml-5 mt-20 text-4xl font-extrabold"
            style={{ color: "#E8A800" }}
          >
            Categories
          </h1>
          <div className="m-5 flex flex-row justify-center gap-8">
            <div className="m-5 flex flex-row justify-evenly gap-4">
              {sampleCategoriesData.map((category) => (
                <div
                  key={category.id}
                  className="flex h-100 w-75 flex-col items-center rounded-2xl bg-white hover:cursor-pointer hover:opacity-70"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={250}
                    height={250}
                    className="m-10"
                  />
                  <div className="text-center">
                    <p className=" text-center text-2xl font-bold text-black">
                      {category.name}
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1
            className="ml-5 mt-20 text-4xl font-extrabold"
            style={{ color: "#E8A800" }}
          >
            Popular
          </h1>
          <p className="ml-5 mt-2 text-xm italic text-gray-500">
            The most popular upgrades for modern vehicles
          </p>
          <div className="m-5 flex flex-row justify-center gap-8">
            <ArrowLeft
              size={50}
              color={"black"}
              className="mt-50 rounded-full p-3 hover:cursor-pointer hover:opacity-90"
              style={{ backgroundColor: "#E8A800" }}
            />
            <div className="mr-5 ml-5 flex flex-row justify-between gap-4">
              {sampleProductsData.map((product) => (
                <div
                  key={product.id}
                  className="flex w-75 flex-col items-center rounded-2xl bg-white pb-3"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="ml-10 mr-10 mt-10"
                  />
                  <h1 className="ml-1 mt-5 cursor-pointer text-xl font-bold text-black hover:underline">
                    {product.name}
                  </h1>
                  <p className="ml-1 mt-1 text-gray-500">{product.description}</p>
                  <div className="flex flex-row justify-between">
                    <p className="ml-1 mt-5 text-2xl font-bold text-black">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="mr-3 mt-3 flex flex-row gap-1">
                      <p className="ml-3 mt-3 text-xm text-black">{product.rate}</p>
                      <StarRating rate={product.rate} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    className="ml-1 mt-1 rounded-2xl p-3 font-bold text-black hover:cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: "#E8A800" }}
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
            <ArrowRight
              size={50}
              color={"black"}
              className="mt-50 rounded-full p-3 hover:cursor-pointer hover:opacity-80"
              style={{ backgroundColor: "#E8A800" }}
            />
          </div>
          <div></div>
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
    </div>
  );
}
