"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import Footer from "../components/Footer";
import NavigationBarApp from "../components/NavigationBarApp";

const ACCENT = "#E0A800";

/** 静态联系方式（写死在前端，不从接口读取） */
const CONTACT = {
  address: "2640 52 St NE Unit 110A, Calgary, AB T1Y 3R6",
  phoneDisplay: "+1 (403) 402-3813",
  /** tel: 链接用纯数字 E.164 */
  phoneTel: "+14034023813",
  email: "maplegoods110@gmail.com",
  intro:
    "Need help with installation or picking the right screen? Our tech experts are ready to assist you.",
} as const;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <NavigationBarApp />
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:pt-14">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">
          Is there something you need from us but we aren&apos;t available? Send
          us a message below!
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-bold text-black">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-black outline-none focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-bold text-black">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-black outline-none focus:border-gray-500"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-black outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-bold text-black">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="How can we help you?"
              className="resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-black outline-none focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg py-3 text-base font-bold text-black transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Send Message
          </button>

          {sent && (
            <p className="mt-4 text-center text-sm text-green-700" role="status">
              Thanks — this is a demo; your message was not sent to a server.
            </p>
          )}
        </form>
      </main>

      <section
        className="px-4 py-14 sm:py-16"
        style={{ backgroundColor: ACCENT }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-black px-8 py-10 text-white shadow-xl sm:px-12 sm:py-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Get in{" "}
              <span style={{ color: ACCENT }}>Touch</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              {CONTACT.intro}
            </p>
            <ul className="mt-10 space-y-6 text-sm sm:text-base">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="h-5 w-5 shrink-0"
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="text-white underline underline-offset-[3px] hover:opacity-90"
                  style={{ textDecorationColor: ACCENT }}
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="h-5 w-5 shrink-0"
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-white underline underline-offset-[3px] hover:opacity-90"
                  style={{ textDecorationColor: ACCENT }}
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
