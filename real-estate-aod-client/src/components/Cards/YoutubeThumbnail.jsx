import React, { useState } from 'react'
// import Image from 'next/image'
import { PlayCircle } from 'lucide-react'


function extractVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : ''
}

export function VideoThumbnail({ youtubeLink, title }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractVideoId(youtubeLink)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (!videoId) {
    return <div className="text-red-500">Invalid YouTube URL</div>
  }

  return (
    <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
      {!isPlaying ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={`Thumbnail for ${title}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 hover:bg-opacity-20"
            aria-label={`Play video: ${title}`}
          >
            <PlayCircle className="w-16 h-16 text-blue-500" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
        </>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}
