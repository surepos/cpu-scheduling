'use client';
import { motion } from 'framer-motion';
import { FiClock, FiZap, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="grid grid-cols-2 gap-5 w-[70%] max-w-2xl">
        
        {/* First Come First Serve - Royal Purple */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          data-tooltip-id="fcfs-tooltip"
          className="aspect-square bg-gradient-to-br from-[#6E45E2] to-[#88D3CE] text-white flex flex-col items-center justify-center rounded-2xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_-8px_rgba(110,69,226,0.3)] hover:shadow-[0_8px_32px_-8px_rgba(110,69,226,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
          onClick={() => router.push('/first-come-first-served')}
        >
          <FiClock className="text-4xl mb-3 text-white/90 group-hover:text-white group-hover:rotate-12 transition-all" />
          <span className="text-lg font-semibold text-white/90 group-hover:text-white">First Come First Serve</span>
          <span className="text-sm mt-1 text-white/60 group-hover:text-white/80">Queue-based</span>
        </motion.button>

        {/* Shortest Job First - Emerald Green */}
        <motion.button
          onClick={() => router.push('/shortest-job-first')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          data-tooltip-id="sjf-tooltip"
          className="aspect-square bg-gradient-to-br from-[#00B09B] to-[#96C93D] text-white flex flex-col items-center justify-center rounded-2xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_-8px_rgba(0,176,155,0.3)] hover:shadow-[0_8px_32px_-8px_rgba(0,176,155,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
        >
          <FiZap className="text-4xl mb-3 text-white/90 group-hover:text-white group-hover:scale-110 transition-all" />
          <span className="text-lg font-semibold text-white/90 group-hover:text-white">Shortest Job First</span>
          <span className="text-sm mt-1 text-white/60 group-hover:text-white/80">Efficiency-focused</span>
        </motion.button>

        {/* Priority Scheduling - Sunset Orange */}
        <motion.button
          onClick={() => router.push('/priority')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          data-tooltip-id="priority-tooltip"
          className="aspect-square bg-gradient-to-br from-[#FF5E62] to-[#FF9966] text-white flex flex-col items-center justify-center rounded-2xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_-8px_rgba(255,94,98,0.3)] hover:shadow-[0_8px_32px_-8px_rgba(255,94,98,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
        >
          <FiBarChart2 className="text-4xl mb-3 text-white/90 group-hover:text-white group-hover:-translate-y-1 transition-all" />
          <span className="text-lg font-semibold text-white/90 group-hover:text-white">Priority Scheduling</span>
          <span className="text-sm mt-1 text-white/60 group-hover:text-white/80">Importance-based</span>
        </motion.button>

        {/* Round Robin - Cyber Blue */}
        <motion.button
          onClick={() => router.push('/round-robin')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          data-tooltip-id="rr-tooltip"
          className="aspect-square bg-gradient-to-br from-[#4776E6] to-[#8E54E9] text-white flex flex-col items-center justify-center rounded-2xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_-8px_rgba(71,118,230,0.3)] hover:shadow-[0_8px_32px_-8px_rgba(71,118,230,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
        >
          <FiRefreshCw className="text-4xl mb-3 text-white/90 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
          <span className="text-lg font-semibold text-white/90 group-hover:text-white">Round Robin</span>
          <span className="text-sm mt-1 text-white/60 group-hover:text-white/80">Time-sliced</span>
        </motion.button>
      </div>
    </main>
  );
}