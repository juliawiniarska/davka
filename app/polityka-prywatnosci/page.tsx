export const metadata = {
  title: 'Polityka prywatności | davka.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-coffeeBeige flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full p-8 rounded-2xl border border-coffeeDark/40 shadow-md">
        <h1 className="text-3xl font-bold text-coffeeDark mb-6">
          Polityka prywatności
        </h1>

        <p>
          <strong>Administrator:</strong> davka. (właściciel kawiarni). Kontakt:{' '}
          <a href="mailto:davka.nysa@gmail.com" className="underline">
            davka.nysa@gmail.com
          </a>.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Zakres i podstawa</h2>
        <p>
          Dane przetwarzane są wyłącznie w celu działania strony, komunikacji
          oraz analityki (Google Analytics) na podstawie zgody (art. 6 ust. 1 lit. a
          RODO) lub uzasadnionego interesu (lit. f).
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Pliki cookie</h2>
        <p>
          Strona używa plików cookie niezbędnych (nie wymagają zgody) oraz
          analitycznych (Google Analytics – tylko po akceptacji w banerze).
        </p>

        <h2 className="text-xl font-semibold mt-6">3. Google Analytics</h2>
        <p>
          Jeśli wyrazisz zgodę, używamy Google Analytics (Google Ireland Ltd.)
          do zbierania anonimowych danych statystycznych. Możesz cofnąć zgodę w
          każdej chwili, klikając „Ustawienia cookies” w stopce lub czyszcząc
          dane przeglądarki.
        </p>

        <h2 className="text-xl font-semibold mt-6">4. Twoje prawa</h2>
        <p>
          Przysługuje Ci prawo dostępu, sprostowania, usunięcia, ograniczenia
          przetwarzania, sprzeciwu, przenoszenia danych oraz skargi do UODO.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. Kontakt</h2>
        <p>
          W sprawach związanych z prywatnością:{" "}
          <a href="mailto:davka.nysa@gmail.com" className="underline">
            davka.nysa@gmail.com
          </a>.
        </p>

        <p className="text-sm text-coffeeDark/70 mt-6">
          Niniejsza polityka może być aktualizowana wraz ze zmianami w serwisie.
        </p>
      </div>
    </main>
  )
}
