import { FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-20">
        <div className="flex flex-col">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex w-fit text-white transition hover:opacity-80"
            aria-label="Facebook"
          >
            <FaFacebook className="h-8 w-8" />
          </a>
          <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
            Pioneering the future of in-car entertainment. We provide
            high-end, reliable electronics that transform your daily commute into
            a premium driving experience.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">Top Products</h2>
          <div className="mt-3 border-b border-gray-600" aria-hidden />
          <ul className="mt-5 space-y-4 text-sm text-gray-400 sm:text-base">
            <li>Speaker</li>
            <li>Headphone</li>
            <li>Dash Cams</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Top Categories
          </h2>
          <div className="mt-3 border-b border-gray-600" aria-hidden />
          <ul className="mt-5 space-y-4 text-sm text-gray-400 sm:text-base">
            <li>Car electronics</li>
            <li>Accessories</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
