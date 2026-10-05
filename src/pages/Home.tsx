import { Hero } from '@/components/hero/Hero'
import { Positioning } from '@/components/sections/Positioning'
import { SuiteMap } from '@/components/sections/SuiteMap'
import { Capabilities } from '@/components/sections/Capabilities'
import { DigitalAnatomy } from '@/components/sections/DigitalAnatomy'
import { Clients } from '@/components/sections/Clients'
import { Partners } from '@/components/sections/Partners'
import { ContactCta } from '@/components/sections/ContactCta'

export function Home() {
  return (
    <>
      <title>Valentia Technologies | Engineering Better Healthcare</title>
      <meta
        name="description"
        content="Valentia Technologies engineers intelligent healthcare software that connects people, data and clinical workflows. Qatar."
      />
      {/* Proof before catalogue: a buyer sees where this already runs before
          being shown what to buy. */}
      <Hero />
      <Positioning />
      <Clients />
      <SuiteMap />
      <DigitalAnatomy />
      <Capabilities />
      <Partners />
      <ContactCta />
    </>
  )
}
