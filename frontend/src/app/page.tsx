import type { Metadata } from "next";

import style from "./page.module.css";

import HeroSection from "@/components/hero_section/HeroSection";
import AboutSection from "@/components/about_section/AboutSection";
import Advantages from "@/components/advantages/Advantages";

import { getPageMeta } from "@/api";

export const generateMetadata = async(): Promise<Metadata> => {
  console.log('gen meta')
  const response = await getPageMeta('home')
  if (!response) return {}
  return {
    title: response.title,
    description: response.description
  }
}




export default function Home() {
  return (
    <div className="container">
      <HeroSection />
      <AboutSection />
      <Advantages />
    </div>
  );
}