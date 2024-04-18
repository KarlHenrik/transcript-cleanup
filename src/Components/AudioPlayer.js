import React, { useState, useRef, useEffect } from 'react';

function AudioPlayerComponent() {
  const [audioFile, setAudioFile] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default speed
  const audioPlayerRef = useRef(null);

  const handleFileChange = (event) => {
    if (!(event.target.files && event.target.files[0])) {
        return // No file
    }

    const file = event.target.files[0];
    if (file.type !== "audio/mp3" && file.type !== "audio/mpeg") {
        alert("Please select an MP3 file.");
        return
    }

    setAudioFile(URL.createObjectURL(file));
  };

  function timeStringToSeconds(timeStr) {
    const regex = /((\d):)?(\d?\d):(\d?\d).(\d)/;
    const match = timeStr.match(regex);

    const hrs = match[2] ? match[2] : 0
    const min = match[3]
    const seconds = match[4]
    const tensOfSeconds = match[5]
    return hrs * 3600 + min * 60 + seconds * 1 + tensOfSeconds * 0.1
  }

  const handleKeyPress = (event) => {
    if (!audioPlayerRef.current || document.activeElement.classList.contains('SpeakerInput') || document.activeElement.classList.contains('Quote')) return;

    switch (event.key) {
      case ' ': // Spacebar: toggle play/pause
        event.preventDefault(); // Prevent default spacebar action (page down)
        if (audioPlayerRef.current.paused) {
          audioPlayerRef.current.play();
        } else {
          audioPlayerRef.current.pause();
        }
        break;
      case 'r': // 'R' key: rewind 10 seconds
        audioPlayerRef.current.currentTime = Math.max(0, audioPlayerRef.current.currentTime - 10);
        break;
      case 'f':
        audioPlayerRef.current.currentTime = Math.min(audioPlayerRef.current.duration, audioPlayerRef.current.currentTime + 10);
        break;
      case 't':
        if (!document.activeElement.classList.contains('Speaker')) break; // Has to be focusing speaker
        if (!document.activeElement.previousSibling.firstChild) break; // Has to be next to timestamp
        
        const newPositionInSeconds = timeStringToSeconds(document.activeElement.previousSibling.firstChild.data);
        audioPlayerRef.current.currentTime = newPositionInSeconds;
        audioPlayerRef.current.play();
      // Add more key controls as needed
    }
  };

  useEffect(() => {
    // Attach keypress listener
    document.addEventListener('keydown', handleKeyPress);
  
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array so it only runs on mount and unmount
  
  useEffect(() => {
    // This effect will run once when the component unmounts
    return () => {
      if (audioFile) {
        URL.revokeObjectURL(audioFile);
        setAudioFile(null);
      }
    };
  }, []); // Still empty because we only want it to run on unmount
  

  const handlePlaybackRateChange = (event) => {
    const newPlaybackRate = parseFloat(event.target.value);
    setPlaybackRate(newPlaybackRate);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = newPlaybackRate;
    }
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} onKeyDown={(e) => e.preventDefault()}/>
      {audioFile && (
        <>
          <audio ref={audioPlayerRef} src={audioFile} controls />
          <select id="playbackRate" value={playbackRate} onChange={handlePlaybackRateChange}>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
            {/* Add more options as required */}
          </select>
        </>
      )}
    </div>
  );
}

export default AudioPlayerComponent;
