import Header           from './components/Header'
import MenuSection       from './components/MenuSection'
import HistorySection    from './components/HistorySection'
import NewsletterSection from './components/NewsletterSection'
import DailyShowcase from './components/DailyShowcase'

export const dynamic = 'force-dynamic'
export default function Home() {
  return (
    <main>
      <Header />
      <HistorySection />
      <DailyShowcase />
      <MenuSection />
      <NewsletterSection />
    </main>
  )
}
