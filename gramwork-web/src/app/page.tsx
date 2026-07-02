import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Tractor, Sprout, ShieldCheck, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-green-200 selection:text-green-900">
      {/* Navigation Bar */}
      <header className="flex h-16 items-center justify-between px-6 lg:px-12 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">GramWork</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Log in
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 shadow-sm transition-all hover:shadow hover:-translate-y-0.5">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-6 pt-24 pb-16 lg:pt-36">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-green-700 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
            <Tractor className="mr-2 h-4 w-4" /> Revolutionizing Agricultural Labor
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl leading-tight">
            Connect with <span className="text-green-600 dark:text-green-500">Reliable</span> Farm Workforces
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            GramWork bridges the gap between farm owners and skilled agricultural laborers. Easily post jobs, manage assignments, track attendance, and process payouts all in one seamless platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-14 text-lg shadow-md transition-transform hover:-translate-y-1">
                I want to Hire Workers
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-transform hover:-translate-y-1">
                I am looking for Work
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="group flex flex-col p-8 bg-white dark:bg-zinc-900/50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-200 dark:hover:border-green-900">
            <div className="h-14 w-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-7 w-7 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Verified Laborers</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">All workers undergo strict verification, ensuring you hire experienced and reliable personnel for your farm operations.</p>
          </div>
          <div className="group flex flex-col p-8 bg-white dark:bg-zinc-900/50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Tractor className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Easy Job Posting</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Post daily, seasonal, or contract jobs in minutes and instantly alert eligible agricultural workers in your region.</p>
          </div>
          <div className="group flex flex-col p-8 bg-white dark:bg-zinc-900/50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-200 dark:hover:border-yellow-900">
            <div className="h-14 w-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Banknote className="h-7 w-7 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Instant Payouts</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Track daily attendance efficiently and process secure, instant payments directly to workers&apos; bank accounts.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-500 border-t mt-12 bg-white dark:bg-zinc-950">
        <p>© 2026 GramWork. All rights reserved.</p>
      </footer>
    </div>
  );
}
