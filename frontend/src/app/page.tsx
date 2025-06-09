import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";
import HeroSection from "@/components/hero_section/HeroSection";
import AboutSection from "@/components/about_section/AboutSection";
import Advantages from "@/components/advantages/Advantages";

export default function Home() {
  return (
    <div className="container">
      <HeroSection />
      <AboutSection />
      <Advantages />
    </div>
  );
}