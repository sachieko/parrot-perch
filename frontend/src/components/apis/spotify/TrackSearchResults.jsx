import React from "react"

const TrackSearchResult = ({ track, chooseTrack }) => {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <article onClick={handlePlay}>
      <img alt='albulm art' src={track.albumUrl} />
      <div>
        <p>{track.title}</p>
        <p>{track.artist}</p>
      </div>
    </article>
  )
}

export default TrackSearchResult