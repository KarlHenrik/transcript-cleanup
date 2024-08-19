import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAudio } from '@fortawesome/free-regular-svg-icons';

function AudioPlayerComponent() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  function timeStringToSeconds(timeStr: string): number {
    const regex = /((\d?\d):)?(\d?\d):(\d?\d).(\d)/;
    const match = timeStr.match(regex);
    if (match === null) return 0

    const hrs = match[2] ? Number(match[2]) : 0
    const min = Number(match[3])
    const seconds = Number(match[4])
    const tensOfSeconds = Number(match[5])
    return hrs * 3600 + min * 60 + seconds * 1 + tensOfSeconds * 0.1
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    const audioPlayerRefCurrent = audioPlayerRef.current;
    const activeElement = document.activeElement;

    if (!audioPlayerRefCurrent || activeElement?.classList.contains('SpeakerInput') || activeElement?.classList.contains('Quote')) {
      return;
    }

    switch (event.key) {
      case ' ': // Spacebar: toggle play/pause
        event.preventDefault(); // Prevent default spacebar action (page down)
        if (audioPlayerRefCurrent.paused) {
          audioPlayerRefCurrent.play();
        } else {
          audioPlayerRefCurrent.pause();
        }
        break;
      case 'r': // 'R' key: rewind 10 seconds
        audioPlayerRefCurrent.currentTime = Math.max(0, audioPlayerRefCurrent.currentTime - 10);
        break;
      case 'f':
        audioPlayerRefCurrent.currentTime = Math.min(audioPlayerRefCurrent.duration, audioPlayerRefCurrent.currentTime + 10);
        break;
      case 't':
        if (!activeElement?.classList.contains('Speaker')) break; // Has to be focusing speaker
        if (!activeElement?.previousSibling?.firstChild) break; // Has to be next to timestamp
        if (!(activeElement.previousSibling.firstChild instanceof Text)) break;

        audioPlayerRefCurrent.currentTime = timeStringToSeconds(activeElement.previousSibling.firstChild.data)
        audioPlayerRefCurrent.play();
        break;
      default:
        break;
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
