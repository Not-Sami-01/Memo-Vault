import Footer from "@/components/Footer";
import Carousel from "@/components/Carousel";
import Signin from "@/components/Signin";
import Head from "next/head"
import Header from "@/components/Header";
import Services from "@/components/Services";
import Link from "next/link";
export default function Home() {
  const GetStartedButton = () => {
    return <Link href={'/'}><div
      className=" overflow-hidden relative w-24 p-2 h-10 bg-blue-700 justify-center flex items-center text-white border-none rounded-md text-xs font-bold cursor-pointer z-10 group"
    >
      Get Started
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"
      ></span>
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-green-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"
      ></span>
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-green-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"
      ></span>
      <span
        className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-3 left-6 z-10"
      >Let's go!</span>
    </div></Link>
  }
  return (
    <>
    <Header key={'same'} pos={false}/>
      <span className="z-10 animate-bounce md:hidden fixed bottom-10 right-10">
        <GetStartedButton />
      </span>
      <Carousel GetStartedButton={GetStartedButton} />
      <Services />
    </>
  );
}