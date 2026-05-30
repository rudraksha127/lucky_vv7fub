import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, Loader2, ExternalLink, CheckCircle, Medal, Zap, Target } from 'lucide-react'
import api from '../lib/api'

export default function CertificateSharePage() {
  const { shareToken } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCert() {
      try {
        const { data } = await api.get(`/certificates/share/${shareToken}`)
        setCertificate(data.certificate)
      } catch (err) {
        setError(err?.response?.data?.error || 'Certificate not found')
      } finally {
        setLoading(false)
      }
    }
    fetchCert()
  }, [shareToken])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
          <Award className="w-16 h-16 text-slate-600" />
          <h1 className="text-xl font-bold text-white">Certificate Not Found</h1>
          <p className="text-slate-400 text-sm">{error || 'This certificate may have been removed or the link is invalid.'}</p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
          >
            Go to AlgoZen
          </Link>
        </div>
      </div>
    )
  }

  const trackColor = certificate.track === 'DSA'
    ? { primary: '#6366f1', label: 'DSA Mastery Track', icon: '💻' }
    : { primary: '#0ea5e9', label: 'Real World Engineering Track', icon: '🌐' }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Certificate Card */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-primary-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary-500/5 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/5 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative z-10">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              ALGOZEN
            </p>
            <p className="text-sm text-slate-500 mt-1">Certificate of Achievement</p>
          </div>

          {/* Award Icon */}
          <div className="my-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          {/* Awarded To */}
          <p className="text-sm text-slate-400 mb-2">This certificate is awarded to</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {certificate.userName}
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">
            For successfully completing the{' '}
            <span className="font-semibold text-white">{trackColor.label}</span>
            {' '}track on AlgoZen, demonstrating exceptional problem-solving skills.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 min-w-[100px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Problems</p>
              <p className="text-xl font-bold text-white mt-1">{certificate.problemsSolved}</p>
            </div>
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 min-w-[100px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">XP Earned</p>
              <p className="text-xl font-bold text-white mt-1">{certificate.totalXpEarned}</p>
            </div>
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 min-w-[100px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Level</p>
              <p className="text-xl font-bold text-white mt-1">{certificate.userLevel}</p>
            </div>
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 min-w-[100px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rank</p>
              <p className="text-xl font-bold text-white mt-1">{certificate.userRank || 'Rookie'}</p>
            </div>
          </div>

          {/* Certificate Number & Date */}
          <div className="border-t border-dark-600 pt-4 mt-4">
            <p className="text-xs font-mono text-slate-500">
              {certificate.certificateNumber}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Issued: {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          {/* Verify Badge */}
          <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Verified on AlgoZen</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            <Link to="/" className="text-primary-400 hover:text-primary-300 transition-colors">
              AlgoZen
            </Link>
            {' '}— Master Data Structures & Algorithms
          </p>
        </div>
      </motion.div>
    </div>
  )
}
