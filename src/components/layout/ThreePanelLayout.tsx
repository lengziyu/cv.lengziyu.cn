import type { ReactNode } from 'react'

interface ThreePanelLayoutProps {
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

export const ThreePanelLayout = ({
  left,
  center,
  right,
}: ThreePanelLayoutProps) => (
  <main className="mx-auto grid w-full max-w-[1960px] grid-cols-1 gap-2 p-1.5 sm:p-2 lg:h-full lg:min-h-0 lg:grid-cols-[230px_minmax(340px,480px)_minmax(700px,1fr)] lg:gap-3 lg:p-2 xl:grid-cols-[250px_minmax(380px,520px)_minmax(760px,1fr)] 2xl:grid-cols-[250px_minmax(440px,580px)_minmax(700px,1fr)]">
    <section className="lg:min-h-0 lg:overflow-y-auto">{left}</section>
    <section className="lg:min-h-0 lg:overflow-y-auto lg:pr-1">{center}</section>
    <section className="lg:min-h-0 lg:overflow-y-auto lg:pl-1">{right}</section>
  </main>
)
