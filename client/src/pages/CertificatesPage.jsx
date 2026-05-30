import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, Download, Loader2, AlertCircle, CheckCircle,
  ChevronRight, Share2, ExternalLink, Medal, Target,
  TrendingUp, Zap, BookOpen, FileText,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../lib/api'
import { getRank } from '../lib/utils'
import { SkeletonBlock } from '../components/ui/Skeletons'

const TRACK_CONFIG = {
  DSA: {
    icon: '💻',
    label: 'DSA Mastery Track',
    color: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/20',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    gradient: 'from-indigo-600 to-purple-600',
    description: 'Data Structures & Algorithms — Arrays, Trees, Graphs, DP, and more',
  },
  RealWorld: {
    icon: '🌐',
    label: 'Real World Engineering Track',
    color: 'from-cyan-500/10 to-teal-500/5 border-cyan-500/20',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    gradient: 'from-cyan-600 to-teal-600',
    description: 'System Design, API Design, Scalability & Architecture Patterns',
  },
}

function CertificateCard({ certificate, onDownload, downloading }) {
  const trackCfg = TRACK_CONFIG[certificate.track] || TRACK_CONFIG.DSA
  const rank = getRank(certificate.userLevel || 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-gradient-to-br rounded-2xl p-6 border shadow-lg backdrop-blur-sm',
        trackCfg.color
      )}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Certificate Icon */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className={clsx(
            'w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-lg',
            trackCfg.gradient
          )}>
            <Award className="w-10 h-10 text-white" />
          </div>
          <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', trackCfg.badgeColor)}>
            {certificate.track}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white">{trackCfg.label}</h3>
            <p className="text-sm text-slate-400">{certificate.userName} • Level {certificate.userLevel}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-700/50 rounded-lg px-3 py-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              {certificate.problemsSolved} problems
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-700/50 rounded-lg px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {certificate.totalXpEarned} XP
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-700/50 rounded-lg px-3 py-1.5">
              <Medal className="w-3.5 h-3.5 text-purple-400" />
              {rank.rank}
            </div>
          </div>

          {/* Certificate number & date */}
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-mono text-slate-500">
              {certificate.certificateNumber}
            </p>
            <p className="text-xs text-slate-500">
              Issued: {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-row md:flex-col items-center gap-2">
          {certificate.pdfGenerated ? (
            <button
              onClick={() => onDownload(certificate._id)}
              disabled={downloading === certificate._id}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 disabled:opacity-50 transition-colors"
            >
              {downloading === certificate._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-700 text-slate-400 text-xs">
              PDF pending
            </span>
          )}
          {certificate.shareToken && (
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/certificates/share/${certificate.shareToken}`
                navigator.clipboard.writeText(shareUrl)
                toast.success('Share link copied!')
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-700 border border-dark-600 text-slate-300 text-xs font-medium hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TrackEligibilityCard({ track, eligibility, onGenerate, generating }) {
  const cfg = TRACK_CONFIG[track] || TRACK_CONFIG.DSA
  const pct = eligibility?.pctComplete || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-dark-800/50 border rounded-2xl p-5 transition-all',
        eligibility?.eligible ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-dark-600'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-white">{cfg.label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{cfg.description}</p>

            {/* Progress */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progress</span>
                <span className={clsx(
                  'font-semibold',
                  eligibility?.eligible ? 'text-emerald-400' : 'text-slate-400'
                )}>
                  {eligibility?.solvedProblems || 0}/{eligibility?.totalProblems || 0} solved
                </span>
              </div>
              <div className="h-2 w-48 rounded-full bg-dark-600 overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-700',
                    eligibility?.eligible ? 'bg-emerald-500' : 'bg-primary-500'
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              {eligibility?.requirement && (
                <p className="text-[10px] text-slate-500">{eligibility.requirement}</p>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {eligibility?.alreadyGenerated ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" /> Earned
            </div>
          ) : eligibility?.eligible ? (
            <button
              onClick={() => onGenerate(track)}
              disabled={generating === track}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {generating === track ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Award className="w-4 h-4" /> Get Certificate</>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-dark-700 px-3 py-1.5 rounded-lg">
              <Target className="w-3.5 h-3.5" /> Solve more
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [eligibility, setEligibility] = useState({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)
  const [downloading, setDownloading] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [certRes, dsaRes, rwRes] = await Promise.all([
        api.get('/certificates'),
        api.get('/certificates/check/DSA'),
        api.get('/certificates/check/RealWorld'),
      ])
      setCertificates(certRes.data.certificates || [])
      setEligibility({
        DSA: dsaRes.data,
        RealWorld: rwRes.data,
      })
    } catch (err) {
      toast.error('Failed to load certificate data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGenerate = async (track) => {
    setGenerating(track)
    try {
      const { data } = await api.post(`/certificates/generate/${track}`)
      toast.success(data.message || `🎉 ${track} certificate generated!`)
      // Refresh data
      await fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to generate certificate')
    } finally {
      setGenerating(null)
    }
  }

  const handleDownload = async (certId) => {
    setDownloading(certId)
    try {
      const response = await api.get(`/certificates/${certId}/download`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `AlgoZen_Certificate.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to download certificate')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" /> Certificates
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Earn certificates by completing tracks. Prove your DSA and engineering mastery!
        </p>
      </div>

      {/* Track Eligibility Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-400" /> Available Tracks
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-dark-800 border border-dark-600 rounded-2xl p-5 animate-pulse">
                <SkeletonBlock className="h-6 w-48" />
                <SkeletonBlock className="h-3 w-64 mt-2" />
                <SkeletonBlock className="h-4 w-32 mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <TrackEligibilityCard
              track="DSA"
              eligibility={eligibility.DSA}
              onGenerate={handleGenerate}
              generating={generating}
            />
            <TrackEligibilityCard
              track="RealWorld"
              eligibility={eligibility.RealWorld}
              onGenerate={handleGenerate}
              generating={generating}
            />
          </>
        )}
      </div>

      {/* Earned Certificates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-amber-400" /> My Certificates
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1].map(i => (
              <div key={i} className="bg-dark-800 border border-dark-600 rounded-2xl p-6 animate-pulse">
                <SkeletonBlock className="h-6 w-64" />
                <SkeletonBlock className="h-4 w-48 mt-2" />
                <SkeletonBlock className="h-4 w-32 mt-2" />
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-dark-800/30 border border-dark-600/50 rounded-2xl border-dashed">
            <Award className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-slate-300 font-medium text-lg">No certificates yet</p>
            <p className="text-slate-500 text-sm mt-1 text-center max-w-md">
              Complete a track above to earn your first certificate. You need to solve enough problems in a track to qualify!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map(cert => (
              <CertificateCard
                key={cert._id}
                certificate={cert}
                onDownload={handleDownload}
                downloading={downloading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-primary-900/10 to-accent-900/10 border border-primary-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white">About Certificates</h3>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li>Each certificate is uniquely numbered and verifiable</li>
              <li>PDF certificates include your name, stats, and AlgoZen branding</li>
              <li>Share your achievement with a public link</li>
              <li>College co-branded certificates coming soon!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
