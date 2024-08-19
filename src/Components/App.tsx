import './App.css';
import DownloadButton from './DownloadButton';
import FileSelector from './FileSelector';
import SpeakerSettings from './SpeakerSettings';
import TextDisplay from './TextDisplay';
import Tutorial from './Tutorial';
import AudioPlayer from './AudioPlayer';
import { useLocalStorage } from "./useLocalStorage";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUsersBetweenLines, faArrowRight, faUsersSlash } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
//import { Cell, Speaker } from './types';
import { useContents } from './contents';

function App() {
  const [fileName, setFileName] = useLocalStorage<string | null>("fileName", null);
  const {speakers, contents, newfocus, dispatch} = useContents();
  const [isExpanded, setIsExpanded] = useState(true);

  function clearAll() {
      dispatch({type: 'clearAll'})
      setFileName(null)
  }

  return (
    <div className='App'>
      <h1 className='Title'>
        Transcript Cleanup!
      </h1>
      
      <div className='Controls'>
        <div className='section'>
          <h3>Transcript</h3>
          <div className='FileName'>
            {fileName || "Select one"}
            {!(fileName) && <FontAwesomeIcon className='arrow' icon={faArrowRight}/>}
            {fileName && <FontAwesomeIcon className='buttonAction' onClick={clearAll} icon={faTrash} />}
          </div>
        </div>
    
        <div className='section'>
          <h3>Recording</h3>
          <AudioPlayer></AudioPlayer>
        </div>
        
        <div className='section'>
          <h3>Speakers</h3>
          <SpeakerSettings speakers={speakers} dispatch={dispatch} />
        </div>
        
        <div className='section'>
          <div className='buttonAction' onClick={() => {
            dispatch({type: 'mergeCells'})
          }}
            >
            <FontAwesomeIcon className="symbol" icon={faUsersBetweenLines} /> Merge Cells
          </div>
          <div className='buttonAction' onClick={() => dispatch({type: 'collapseSpeakers'})}>
            <FontAwesomeIcon className="symbol" icon={faUsersSlash} /> Collapse Speakers
          </div>
          <DownloadButton contents={contents} speakers={speakers} fileName={fileName} />
          <div className='buttonAction' onClick={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon className="symbol" icon={faCircleQuestion} /> Help
          </div>
          <Tutorial isExpanded={isExpanded} />
        </div>
        
      </div>

      <div className='Display'>
        {contents?.length===0 && <FileSelector setFileName={setFileName}  speakers={speakers} dispatch={dispatch} />}
        {contents && <TextDisplay contents={contents} newfocus={newfocus} dispatch={dispatch} speakers={speakers} />}
      </div>
    </div>
  );
}

export default App;
