import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CERT_DIR = path.join(__dirname, '..', '..', 'certificates')

// Ensure certificates directory exists
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true })
}

const TRACK_COLORS = {
  DSA: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa', label: 'DSA Mastery' },
  RealWorld: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#22d3ee', label: 'Real World Engineering' },
}

export async function generateCertificate(certificate, user) {
  const trackColor = TRACK_COLORS[certificate.track] || TRACK_COLORS.DSA
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
  })

  const fileName = `certificate_${certificate.certificateNumber.replace(/-/g, '_')}.pdf`
  const filePath = path.join(CERT_DIR, fileName)
  const writeStream = fs.createWriteStream(filePath)
  doc.pipe(writeStream)

  const pageWidth = doc.page.width
  const pageHeight = doc.page.height

  // ─── Background ──────────────────────────────────────────
  // Dark background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#0f0f1a')

  // Border glow effect
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
    .lineWidth(2)
    .strokeColor(trackColor.primary)
    .stroke()

  doc.save()
    .rect(25, 25, pageWidth - 50, pageHeight - 50)
    .lineWidth(1)
    .opacity(0.25)
    .strokeColor(trackColor.secondary)
    .stroke()
    .restore()

  // Top decorative bar
  doc.rect(0, 0, pageWidth, 8).fill(trackColor.primary)

  // Bottom decorative bar
  doc.rect(0, pageHeight - 8, pageWidth, 8).fill(trackColor.secondary)

  // Corner decorations
  const cornerSize = 60
  const cornerOffset = 30
  doc.lineWidth(2).strokeColor(trackColor.accent)

  // Top-left
  doc.moveTo(cornerOffset, cornerOffset).lineTo(cornerOffset + cornerSize, cornerOffset)
    .moveTo(cornerOffset, cornerOffset).lineTo(cornerOffset, cornerOffset + cornerSize).stroke()
  // Top-right
  doc.moveTo(pageWidth - cornerOffset, cornerOffset).lineTo(pageWidth - cornerOffset - cornerSize, cornerOffset)
    .moveTo(pageWidth - cornerOffset, cornerOffset).lineTo(pageWidth - cornerOffset, cornerOffset + cornerSize).stroke()
  // Bottom-left
  doc.moveTo(cornerOffset, pageHeight - cornerOffset).lineTo(cornerOffset + cornerSize, pageHeight - cornerOffset)
    .moveTo(cornerOffset, pageHeight - cornerOffset).lineTo(cornerOffset, pageHeight - cornerOffset - cornerSize).stroke()
  // Bottom-right
  doc.moveTo(pageWidth - cornerOffset, pageHeight - cornerOffset)
     .lineTo(pageWidth - cornerOffset - cornerSize, pageHeight - cornerOffset)
    .moveTo(pageWidth - cornerOffset, pageHeight - cornerOffset)
     .lineTo(pageWidth - cornerOffset, pageHeight - cornerOffset - cornerSize).stroke()

  // ─── Header Section ──────────────────────────────────────
  // AlgoZen logo text
  doc.fontSize(32)
    .font('Helvetica-Bold')
    .fillColor('#ffffff')
    .text('ALGOZEN', pageWidth / 2, 70, { align: 'center' })

  doc.fontSize(11)
    .font('Helvetica')
    .fillColor(trackColor.accent)
    .text('🏆  Certificate of Achievement  🏆', pageWidth / 2, 110, { align: 'center' })

  // ─── Title ───────────────────────────────────────────────
  doc.fontSize(22)
    .font('Helvetica-Bold')
    .fillColor('#ffffff')
    .text(certificate.title || `${trackColor.label} Completion`, pageWidth / 2, 155, { align: 'center' })

  // ─── Awarded To ──────────────────────────────────────────
  doc.fontSize(14)
    .font('Helvetica')
    .fillColor('#94a3b8')
    .text('This certificate is proudly awarded to', pageWidth / 2, 200, { align: 'center' })

  // User name - large and prominent
  doc.fontSize(36)
    .font('Helvetica-Bold')
    .fillColor(trackColor.primary)
    .text(certificate.userName, pageWidth / 2, 225, { align: 'center' })

  // ─── Achievement Description ─────────────────────────────
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#94a3b8')
    .text(
      `For successfully completing the ${trackColor.label} track on AlgoZen, demonstrating exceptional problem-solving skills and algorithmic thinking.`,
      pageWidth / 2, 285,
      { align: 'center', width: 500 }
    )

  // ─── Stats Divider ──────────────────────────────────────
  doc.moveTo(pageWidth / 2 - 200, 345)
    .lineTo(pageWidth / 2 + 200, 345)
    .strokeColor(trackColor.primary + '60')
    .lineWidth(0.5)
    .stroke()

  // ─── Stats Section ──────────────────────────────────────
  const statsY = 365
  const statItems = [
    { label: 'Problems Solved', value: `${certificate.problemsSolved}` },
    { label: 'Total XP Earned', value: `${certificate.totalXpEarned}` },
    { label: 'Level', value: `${certificate.userLevel}` },
    { label: 'Rank', value: certificate.userRank || 'Rookie' },
  ]

  const statStartX = pageWidth / 2 - 220
  const statSpacing = 110

  statItems.forEach((item, i) => {
    const x = statStartX + i * statSpacing + 20
    doc.fontSize(9)
      .font('Helvetica')
      .fillColor('#64748b')
      .text(item.label, x, statsY, { align: 'center', width: 90 })

    doc.fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text(item.value, x, statsY + 14, { align: 'center', width: 90 })
  })

  // ─── Certificate Number & Date ──────────────────────────
  doc.fontSize(9)
    .font('Helvetica')
    .fillColor('#64748b')
    .text(`Certificate No: ${certificate.certificateNumber}`, pageWidth / 2, 435, { align: 'center' })

  doc.fontSize(9)
    .font('Helvetica')
    .fillColor('#64748b')
    .text(`Issued on: ${new Date(certificate.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 450, { align: 'center' })

  // ─── Verification Note ──────────────────────────────────
  doc.fontSize(8)
    .font('Helvetica-Oblique')
    .fillColor(trackColor.accent + '80')
    .text('Verify at algozen.dev/certificates', pageWidth / 2, 475, { align: 'center' })

  // ─── Footer ─────────────────────────────────────────────
  doc.fontSize(8)
    .font('Helvetica')
    .fillColor('#374151')
    .text('© AlgoZen — Master Data Structures & Algorithms', pageWidth / 2, pageHeight - 30, { align: 'center' })

  // Finalize
  doc.end()

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve({
        filePath,
        fileName,
        pdfGenerated: true,
      })
    })
    writeStream.on('error', reject)
  })
}

// Helper to read certificate PDF for download
export function getCertificatePath(fileName) {
  return path.join(CERT_DIR, fileName)
}
