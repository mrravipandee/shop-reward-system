import About from "@/components/About";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Winners from "@/components/Winner";

export default function Home() {
  return (
    <div className="custom-scrollbar">
      <Hero />
      <Features />
      <About />
      <Winners />
      <Contact />
    </div>
  )
}
