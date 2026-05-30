import mongoose from 'mongoose'

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },

  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  assignments: [{
    problemId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    title:      { type: String },
    dueDate:    { type: Date },
    assignedAt: { type: Date, default: Date.now },
  }],

  announcements: [{
    text:      { type: String },
    createdAt: { type: Date, default: Date.now },
  }],

  college:  { type: String, default: '' },
  semester: { type: String, default: '' },
  subject:  { type: String, default: '' },
  isActive: { type: Boolean, default: true },

}, { timestamps: true })

// Generate a unique 6-char join code
classroomSchema.statics.generateCode = async function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    const exists = await this.findOne({ code })
    if (!exists) return code
  }
  throw new Error('Could not generate unique classroom code')
}

export default mongoose.model('Classroom', classroomSchema)
