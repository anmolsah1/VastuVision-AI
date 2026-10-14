import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesignForm } from '../components/design/DesignForm'
import { ImageUploader } from '../components/design/ImageUploader'
import { DesignProgress } from '../components/design/DesignProgress'
import { useDesign } from '../hooks/useDesign'
import { useDesignContext } from '../context/DesignContext'

export const NewDesign = () => {
  const [photos, setPhotos] = useState([])
  const { handleGenerateDesign } = useDesign()
  const { isGenerating, error, clearError } = useDesignContext()

  const onSubmit = (formData) => {
    handleGenerateDesign(formData, photos)
  }

  // Show progress while generating
  if (isGenerating) {
    return <DesignProgress />
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 page-enter">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Design Studio</h1>
        <p className="text-white/45 text-sm">
          Fill in your room details and the AI will generate a complete Vastu-aware design with 6 visualized perspectives.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-red-300 text-sm font-semibold">Generation failed</p>
            <p className="text-red-200/60 text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400/60 hover:text-red-400 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-8">
        {/* Design Form */}
        <div className="glass-card p-6 overflow-visible">
          <DesignForm onSubmit={onSubmit} isLoading={isGenerating} />
        </div>

        {/* Photo Upload Section */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h2 className="font-heading font-semibold text-white text-sm mb-1">📸 Site Photographs (Optional)</h2>
            <p className="text-white/40 text-xs leading-relaxed">
              Upload photos of your existing space. The AI will use them for context but will clearly label any inferences as "estimated" since photos alone cannot determine exact dimensions or compass direction.
            </p>
          </div>
          <ImageUploader onFilesChange={setPhotos} />
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-saffron-500/8 border border-saffron-500/15">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div className="space-y-1">
              <p className="text-saffron-300 text-sm font-medium">What you'll get:</p>
              <ul className="text-white/50 text-xs space-y-0.5">
                <li>• 1 composite image with 6 architectural views</li>
                <li>• Complete Vastu Shastra analysis (labeled as cultural guidance)</li>
                <li>• Practical interior design recommendations</li>
                <li>• Space planning, furniture, colors, materials</li>
                <li>• Chat interface to refine the design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
