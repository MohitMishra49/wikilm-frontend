import { Nav } from './components/ui/Nav'
import { Hero } from './components/sections/Hero'
import { ModelSection } from './components/sections/ModelSection'
import { Playground } from './components/sections/Playground'
import { PerformanceSection } from './components/sections/PerformanceSection'
import { AboutSection } from './components/sections/AboutSection'
import { Footer } from './components/ui/Footer'

export default function App() {
  return (
    // noise-bg adds a very subtle paper-grain texture via a fixed pseudo-element
    <div className="noise-bg relative min-h-screen">
      <Nav />
      <main>
        <Hero />
        <ModelSection />
        <Playground />
        <PerformanceSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
