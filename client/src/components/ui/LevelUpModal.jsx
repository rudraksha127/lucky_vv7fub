import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function LevelUpModal({ isOpen, onClose, prevLevel = 1, newLevel = 2, xpGained = 0, evolved = false, creatureName = '', rank = null }) {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card relative border border-primary-500/40 rounded-3xl p-10 max-w-lg w-full mx-4 text-center overflow-hidden shadow-2xl shadow-primary-500/20"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />

            <motion.div 
              className="relative z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm font-bold tracking-[0.2em] text-primary-400 uppercase mb-2">
                Level Up
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-8">
                You reached a new height!
              </h2>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-5xl font-black text-slate-500/50">{prevLevel}</div>
                <motion.div
                  className="text-3xl text-primary-500/50"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >→</motion.div>
                <motion.div
                  className="text-7xl font-black bg-gradient-to-b from-primary-400 to-accent-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.4 }}
                >
                  {newLevel}
                </motion.div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <span className="text-lg">✨</span> +{xpGained} XP
                </motion.div>

                {rank && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <span className="text-lg">🏅</span> {rank}
                  </motion.div>
                )}
              </div>

              {evolved && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-dark-800/80 border border-indigo-500/30 rounded-2xl p-5 mb-8 backdrop-blur-sm"
                >
                  <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">Evolution Unlocked!</div>
                  <div className="flex items-center justify-center gap-4 text-2xl">
                    <span className="opacity-50 grayscale">🐣</span>
                    <span className="text-indigo-500">→</span>
                    <span className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">🐉</span>
                  </div>
                  <div className="text-slate-200 font-medium mt-3">{creatureName}</div>
                </motion.div>
              )}

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
              >
                Continue Coding 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
