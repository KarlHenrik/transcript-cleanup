import './App.css';
import DownloadButton from './DownloadButton.js';
import FileSelector from './FileSelector';
import SpeakerSettings from './SpeakerSettings';
import TextDisplay from './TextDisplay.js';
import React, { useState, useEffect } from "react";

function App() {
  const [fileName, setFileName] = useState(null);
  const [contents, setContents] = useState(false);
  const [speakers, setSpeakers] = useState([["Researcher", "Interviewee"], []])
  const [globalState, setGlobalState] = useState([speakers, []])
  
  
  useEffect(() => {
    globalState[0] = speakers
  }, [globalState])

  return (
    <div className='App'>
      <h1 className='Title'>
        Transcript Cleanup
      </h1>
      
      <div className='Controls'>
        
        <SpeakerSettings speakers={speakers} setSpeakers={setSpeakers} />
        
        <div>Speaker Collapse</div>

        <DownloadButton contents={contents} globalState={globalState} setGlobalState={setGlobalState}/>
      </div>

      <div className='Display'>
        {!contents && <FileSelector fileName={fileName} setFileName={setFileName} setContents={setContents}/>}
        {contents && <TextDisplay contents={contents} setContents={setContents} speakers={speakers} globalState={globalState} />}
      </div>
    </div>
  );
};

export default App;
