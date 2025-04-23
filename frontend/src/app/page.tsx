import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";
import HeroSection from "@/components/hero_section/HeroSection";
import AboutSection from "@/components/about_section/AboutSection";


export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  );
}