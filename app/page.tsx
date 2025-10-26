'use client'

import { useState, useEffect } from 'react'

interface Video {
  id: string
  prompt: string
  url: string
  timestamp: number
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('sora-videos')
    if (saved) {
      setVideos(JSON.parse(saved))
    }
  }, [])

  const generateVideo = async () => {
    if (!prompt.trim() || generating) return

    setGenerating(true)
    setProgress(0)

    // Simulate video generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate generation time (3-5 seconds)
    const generationTime = 3000 + Math.random() * 2000
    await new Promise(resolve => setTimeout(resolve, generationTime))

    clearInterval(interval)
    setProgress(100)

    // Create a sample video (gradient animation)
    const video: Video = {
      id: Date.now().toString(),
      prompt: prompt,
      url: generateVideoDataUrl(prompt),
      timestamp: Date.now(),
    }

    const newVideos = [video, ...videos]
    setVideos(newVideos)
    localStorage.setItem('sora-videos', JSON.stringify(newVideos))

    setTimeout(() => {
      setGenerating(false)
      setProgress(0)
      setPrompt('')
    }, 500)
  }

  const generateVideoDataUrl = (text: string): string => {
    // Create a canvas video-like animation
    const colors = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
    ]
    const colorSet = colors[Math.floor(Math.random() * colors.length)]
    
    return `data:video/mp4;base64,${btoa(JSON.stringify({ 
      type: 'gradient',
      colors: colorSet,
      text: text.substring(0, 50)
    }))}`
  }

  const downloadVideo = (video: Video) => {
    // Create a more realistic mock video download
    const element = document.createElement('a')
    element.href = video.url
    element.download = `sora-${video.id}.mp4`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const deleteVideo = (id: string) => {
    const newVideos = videos.filter(v => v.id !== id)
    setVideos(newVideos)
    localStorage.setItem('sora-videos', JSON.stringify(newVideos))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Sora Free</h1>
                <p className="text-xs text-gray-400">Unlimited AI Video Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-green-400">✓ No Watermark</div>
                <div className="text-xs text-gray-400">100% Free Forever</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Create <span className="gradient-text">Stunning Videos</span>
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            No limits. No watermarks. No restrictions.
          </p>
          <p className="text-sm text-gray-500">
            {videos.length} videos generated • Unlimited generations available
          </p>
        </div>

        {/* Generation Input */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  generateVideo()
                }
              }}
              placeholder="Describe your video... (e.g., 'A serene sunset over mountains with birds flying')"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              rows={4}
              disabled={generating}
            />
            
            {generating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Generating your video...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Press Enter or click Generate
              </div>
              <button
                onClick={generateVideo}
                disabled={!prompt.trim() || generating}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {generating ? 'Generating...' : 'Generate Video'}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">No Watermark</div>
                  <div className="text-xs text-gray-400">Clean exports</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Instant Generation</div>
                  <div className="text-xs text-gray-400">3-5 seconds</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Unlimited</div>
                  <div className="text-xs text-gray-400">Free forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Gallery */}
        {videos.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Your Generated Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onDownload={downloadVideo}
                  onDelete={deleteVideo}
                />
              ))}
            </div>
          </div>
        )}

        {videos.length === 0 && !generating && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No videos yet. Start creating!</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/30 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">Sora Free - Unlimited AI Video Generation</p>
            <p className="text-xs text-gray-500">No watermarks • No restrictions • 100% Free</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function VideoCard({ 
  video, 
  onDownload, 
  onDelete 
}: { 
  video: Video
  onDownload: (video: Video) => void
  onDelete: (id: string) => void
}) {
  let videoData
  try {
    videoData = JSON.parse(atob(video.url.split(',')[1]))
  } catch {
    videoData = { colors: ['#667eea', '#764ba2'], text: video.prompt }
  }

  return (
    <div className="video-card bg-gray-800/50 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
      <div 
        className="aspect-video relative overflow-hidden cursor-pointer group"
        style={{
          background: `linear-gradient(135deg, ${videoData.colors[0]} 0%, ${videoData.colors[1]} 100%)`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-white text-sm font-medium line-clamp-2">{videoData.text}</p>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          No Watermark
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{video.prompt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{new Date(video.timestamp).toLocaleDateString()}</span>
          <span>{new Date(video.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(video)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
