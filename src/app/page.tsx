import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { SubscribeForm } from "@/components/public/SubscribeForm";
import { ArticlesList } from "@/components/public/ArticlesList";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWMkgydjJoMzR6TTIgMmgzNHYySDJWMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Stay Connected with{" "}
                <span className="text-indigo-300">Holy Ghost House of God</span>
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Join our community and receive inspiring articles, spiritual
                content, and church updates delivered straight to your inbox.
              </p>
              <div id="subscribe" className="flex justify-center">
                <SubscribeForm />
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <ArticlesList />
      </main>
      <Footer />
    </div>
  );
}
