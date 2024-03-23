"use client";
import Footer from "@/components/Footer/page";
import Image from "next/image";
import InnerBanner from "../../../public/images/inrbnr.jpg";
import React from "react";
import AbtUs from "../../../public/images/About us.jpg";
import Mission from "../../../public/images/mission.jpg";

export default function AboutUs() {
  return (
    <div>
      <title>DigitalSathi | About Us</title>
      <div className="h-[88px]"></div>
      <div className="w-auto h-auto">
        <Image
          alt="innerBanner"
          src={InnerBanner}
          width={1540}
          height={400}
        ></Image>
      </div>
      <div className="flex flex-col px-9">
        <h1 className="text-center font-bold text-3xl my-6">ABOUT US</h1>
        <div className="p-9 border-2 border-amber-500 rounded-lg">
          At <strong className="font-bold">DigitalSathi</strong>, we don’t just
          build websites; we weave digital dreams. Our journey began in a cozy
          garage, fueled by passion and a shared vision: to create online
          experiences that resonate with users, businesses, and brands alike.
          Your success is our compass. We listen, collaborate, and tailor
          solutions to fit your unique needs. Our clients aren’t just projects;
          they’re partners on this exhilarating ride.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-amber-500 rounded-lg mt-6 p-6">
          <div className="w-auto ">
            <Image alt="AboutUs" src={AbtUs} width={600} height={300} />
          </div>
          <div>
            <h1 className="text-center font-bold p-3 bg-gray-200 text-3xl ">
              OUR VISION
            </h1>
            <p className="p-6 text-justify">
              We envision a digital landscape where innovation knows no bounds.
              Our mission is to be the largest global mobile and web development
              company, leaving an indelible mark on the digital canvas.
              <br />
              <br />
              🚀 Constant Innovation: We thrive on pushing boundaries. Our
              relentless pursuit of cutting-edge solutions fuels our journey
              toward excellence. We aspire to transcend borders, collaborating
              with clients worldwide. Our code will resonate across continents,
              transforming businesses and lives.
              <br />
              <br />
              🔍 Uncompromising Standards: We don’t settle for mediocrity. Our
              commitment to quality ensures that every line of code, every
              pixel, reflects excellence. Our vision extends beyond technology.
              We envision seamless user experiences that delight and empower.
              <br />
              <br />
              🌈 Inclusive Creativity: We believe the best ideas emerge from
              collaboration. Our inclusive environment nurtures creativity,
              sparking innovation at every turn.
              <br />
              <br />
              🌟 Digital Transformation: We see a world where businesses
              seamlessly embrace digital transformation. Our role? To be the
              architects of this metamorphosis.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-2 border-amber-500 rounded-lg mt-6 p-6">
          <div className="flex flex-col">
            <h1 className="text-center font-bold p-3 bg-gray-200 text-3xl ">OUR MISSION</h1>
            <p className="p-6 text-justify">
              We envision a digital landscape where innovation knows no bounds.
              Our mission is to be the largest global mobile and web development
              company, leaving an indelible mark on the digital canvas.
              <br />
              <br />
              🚀 Constant Innovation: We thrive on pushing boundaries. Our
              relentless pursuit of cutting-edge solutions fuels our journey
              toward excellence. We aspire to transcend borders, collaborating
              with clients worldwide. Our code will resonate across continents,
              transforming businesses and lives.
              <br />
              <br />
              🔍 Uncompromising Standards: We don’t settle for mediocrity. Our
              commitment to quality ensures that every line of code, every
              pixel, reflects excellence. Our vision extends beyond technology.
              We envision seamless user experiences that delight and empower.
              <br />
              <br />
              🌈 Inclusive Creativity: We believe the best ideas emerge from
              collaboration. Our inclusive environment nurtures creativity,
              sparking innovation at every turn.
              <br />
              <br />
              🌟 Digital Transformation: We see a world where businesses
              seamlessly embrace digital transformation. Our role? To be the
              architects of this metamorphosis.
            </p>
          </div>
          <div className="w-full ">
            <Image alt="Mission" src={Mission} width={800} height={300} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
