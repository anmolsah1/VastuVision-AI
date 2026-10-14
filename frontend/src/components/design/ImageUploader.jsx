import { useCallback, useState } from 'react'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_MB = 10

export const ImageUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const processFiles = (incoming) => {
    setError('')
    const valid = []
    for (const f of incoming) {
      if (!ACCEPTED.includes(f.type)) {
        setError(`"${f.name}" is not a supported image type.`)
        continue
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`"${f.name}" exceeds ${MAX_MB}MB limit.`)
        continue
      }
      valid.push(f)
    }
    const updated = [...files, ...valid].slice(0, 6)
    setFiles(updated)
    onFilesChange(updated)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(Array.from(e.dataTransfer.files))
  }, [files])

  const handleChange = (e) => {
    processFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx)
    setFiles(updated)
    onFilesChange(updated)
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <label
        id="photo-upload-zone"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`flex flex-col items-center justify-center gap-3 w-full min-h-[120px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${dragOver
            ? 'border-saffron-400 bg-saffron-500/10'
            : 'border-white/15 hover:border-white/30 hover:bg-white/3'
          }`}
      >
        <input
          id="photo-file-input"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
        />
        <div className="text-center p-5">
          <div className="text-3xl mb-2">📸</div>
          <p className="text-sm text-white/60">
            <span className="text-saffron-400 font-medium">Upload photos</span> of your existing space
          </p>
          <p className="text-xs text-white/30 mt-1">JPG, PNG, WEBP · max {MAX_MB}MB · up to 6 photos</p>
        </div>
      </label>

      {error && (
        <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-charcoal-800">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
