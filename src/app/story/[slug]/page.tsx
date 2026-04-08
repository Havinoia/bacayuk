import Link from "next/link";
import { ArrowLeft, Lock, Unlock, Speaker } from "lucide-react";

// Mock story data (in real app, this would be from DB)
const STORIES: Record<string, any> = {
  "kancil-dan-buaya": {
    title: "Kancil dan Buaya yang Cerdik",
    category: "Fabel",
    preview: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Pada suatu hari, Kancil ingin menyeberangi sungai untuk memakan mentimun di seberang sana.",
    fullContent: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Pada suatu hari, Kancil ingin menyeberangi sungai untuk memakan mentimun di seberang sana. Namun, sungai itu penuh dengan buaya yang lapar. Kancil pun berpikir keras. Ia berteriak memanggil buaya, 'Hai Buaya! Raja Hutan ingin menghitung jumlah kalian untuk memberi hadiah!' Buaya pun berkumpul dan berbaris. Kancil melompat dari satu punggung buaya ke punggung lainnya sambil menghitung, hingga akhirnya sampai di seberang sungai. Sambil tertawa, Kancil berteriak, 'Terima kasih Buaya-buaya bodoh! Aku sudah sampai!' Buaya pun merasa kesal namun Kancil sudah lari menjauh.",
    color: "bg-blue-500",
  },
  "danau-toba": {
    title: "Asal usul Danau Toba",
    category: "Legenda",
    preview: "Dahulu kala, ada seorang pemuda bernama Toba yang hobi memancing. Suatu hari ia menangkap ikan emas besar yang berubah menjadi wanita cantik.",
    fullContent: "Dahulu kala, ada seorang pemuda bernama Toba yang hobi memancing. Suatu hari ia menangkap ikan emas besar yang berubah menjadi wanita cantik. Wanita itu adalah putri yang dikutuk. Toba menikahinya dengan janji tidak akan pernah menyebut asal-usulnya. Mereka memiliki anak bernama Samosir. Suatu hari Samosir menghabiskan bekal ayahnya, Toba marah dan berteriak 'Dasar anak ikan!'. Langit mendung, hujan turun tiada henti, dan desa tenggelam menjadi Danau Toba, sementara tengahnya menjadi Pulau Samosir.",
    color: "bg-emerald-500",
  }
};

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const story = STORIES[slug];
  
  // Mock session check (In real app: const session = await auth.api.getSession({ headers: await headers() }))
  const isLoggedIn = false; // Toggle to test logic

  if (!story) {
    return <div className="p-20 text-center font-black">Cerita tidak ditemukan!</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Navigation */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary mb-12 transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
      </Link>

      <article className="space-y-10">
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest leading-none">
              {story.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1]">
            {story.title}
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium text-foreground/30">
            <span className="flex items-center gap-2 italic">Diceritakan kembali oleh Bacayuk</span>
          </div>
        </header>

        {/* Content Area */}
        <div className={`p-8 md:p-12 rounded-[2.5rem] bg-white shadow-2xl shadow-black/5 border border-black/5 relative overflow-hidden`}>
          <div className="prose prose-slate max-w-none">
            <p className="text-2xl md:text-3xl font-serif leading-relaxed text-foreground/80 selection:bg-primary/20">
              {isLoggedIn ? story.fullContent : story.preview}
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mt-12 pt-12 border-t border-dashed border-black/10 relative">
              {/* Blur overlay for the "sneak peek" effect */}
              <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-white to-transparent" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Lock size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground">Ingin baca selengkapnya?</h3>
                  <p className="text-foreground/40 text-sm max-w-xs mx-auto">
                    Kisah seru ini masih berlanjut lho! Masuk atau daftar sekarang untuk membaca cerita ini sampai selesai.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/auth/register" className="btn-primary">Daftar Gratis</Link>
                  <Link href="/auth/login" className="px-6 py-3 rounded-2xl bg-slate-100 font-bold hover:bg-slate-200 transition-colors">Masuk</Link>
                </div>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
               <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                  <Unlock size={18} /> Kamu sedang membaca versi lengkap
               </div>
               <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                  <Speaker size={18} /> Dengarkan Cerita
               </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
