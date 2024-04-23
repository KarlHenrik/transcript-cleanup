import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAudio } from '@fortawesome/free-regular-svg-icons';

function AudioPlayerComponent() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState(null);
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
    setAudioFileName(file.name)
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
  

  function clearPlayer() {
    setAudioFile(null)
    setAudioFileName(null)
  }

  return (
    <div>
        {audioFileName && <div className='FileName'>
            {audioFileName}
            <FontAwesomeIcon className='buttonAction' onClick={clearPlayer} icon={faTrash} />
        </div>}
        {!(audioFileName) && <>
            <input type="file" id="audioFileInput" accept=".mp3" style={{ display: 'none' }} onChange={handleFileChange} onKeyDown={(e) => e.preventDefault()}/>
            <label className='buttonAction' htmlFor="audioFileInput" >
                <FontAwesomeIcon className='symbol' icon={faFileAudio}/> Select Audio
            </label>
        </>}

        {audioFile && (
        <div className='AudioPlayer'>
          <audio ref={audioPlayerRef} src={audioFile} controls />
        </div>
      )}
    </div>
  );
}

export default AudioPlayerComponent;
