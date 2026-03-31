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
  <main className="mx-auto grid w-full max-w-[1880px] grid-cols-1 items-start gap-2 p-1.5 sm:p-2 lg:grid-cols-[230px_minmax(340px,0.72fr)_minmax(700px,1.5fr)] lg:gap-3 lg:p-2 xl:grid-cols-[250px_minmax(360px,0.72fr)_minmax(780px,1.58fr)]">
    <div className="lg:sticky lg:top-2 lg:max-h-[calc(100vh-16px)] lg:overflow-y-auto">
      {left}
    </div>
    <div className="lg:sticky lg:top-2 lg:max-h-[calc(100vh-16px)] lg:overflow-y-auto">
      {center}
    </div>
    <div className="lg:sticky lg:top-2 lg:max-h-[calc(100vh-16px)] lg:overflow-y-auto">
      {right}
    </div>
  </main>
)
