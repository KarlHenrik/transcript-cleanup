import './App.css';
import DownloadButton from './DownloadButton';
import FileSelector from './FileSelector';
import SpeakerSettings from './SpeakerSettings';
import TextDisplay from './TextDisplay';
import Tutorial from './Tutorial';
import AudioPlayer from './AudioPlayer';
import { useLocalStorage } from "./useLocalStorage";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUsersBetweenLines, faArrowRight, faUsersSlash } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

function App() {
  const [fileName, setFileName] = useLocalStorage("fileName", null);
  const [contents, setContents] = useLocalStorage("contents", []);
  const [speakers, setSpeakers] = useLocalStorage("speakers", [
      { name: "Researcher", color: "#A83548" },
      { name: "Interviewee", color: "#369ACC" },
    ])
  const [isExpanded, setIsExpanded] = useState(true);

  function clearAll() {
      localStorage.clear();
      setFileName(null)
      setContents([])
  }

  function mergeCells() {
    const new_contents = []
    let stop = false;
    contents.forEach((element, idx) => {
      if (stop) {
        new_contents.push(
          {
              ...element
          }
        )
        return
      }
      if (element.ID === "") {
        stop = true;
        new_contents.push(
          {
              ...element
          }
        )
        return
      }
      if (idx === 0) { // We only collapse upwards, so first cell is safe
        new_contents.push(
          {
              ...element
          }
        )
        return
      }
      if (element.ID === "" || element.ID !== new_contents[new_contents.length - 1].ID) { // No ID match
        new_contents.push(
          {
              ...element
          }
        )
        return
      }

      let old_text = new_contents[new_contents.length - 1].text;
      let last_paragraph = old_text.split("\n\n").slice(-1)[0]
      if ((last_paragraph + " " + element.text).length > 300) { // Add newlines if the last paragraph is long
        new_contents[new_contents.length - 1].text += "\n\n" + element.text
      } else {
        new_contents[new_contents.length - 1].text += " " + element.text;
      }
    });
    setContents(new_contents)
  }

  function speakerSwap() {
    if (speakers.length !== 2) {
      return;
    }
  
    const newContents = contents.map(element => {
      if (element.ID === "") {
        return element;  // Return element unchanged if ID is empty
      }
  
      // Swap IDs 1 and 0
      return {
        ...element,
        ID: element.ID === 1 ? 0 : 1,
      };
    });
  
    setContents(newContents);
  }

  function clearSpeaker(ID) {
    const new_contents = contents.map(element => {
      if (element.ID === ID) {
        // If the ID matches, clear it.
        return { ...element, ID: "" };
      } else if (element.ID > ID) {
        // If the ID is greater, decrement it.
        return { ...element, ID: element.ID - 1 };
      }
      // Otherwise, keep the element unchanged.
      return element;
    });
  
    setContents(new_contents);
  }

  function updateSpeaker(new_contents, ID, newID="") {
    new_contents = new_contents.map(element => {
      if (element.ID === ID) {
        // If the ID matches, clear it.
        return { ...element, ID: newID };
      } else if (element.ID > ID) {
        // If the ID is greater, decrement it.
        return { ...element, ID: element.ID - 1 };
      }
      // Otherwise, keep the element unchanged.
      return element;
    });
  
    return new_contents;
  }

  function collapseSpeakers() {
    let new_speakers = [...speakers];
    let new_contents = [...contents];
    // Looping through speakers in reverse, so that when speaker i is removed, all cells with higher IDs can be updated with no unintented effects
    speakers.toReversed().forEach((speaker, index) => {
      let originalIndex = speakers.length - index - 1;
      const firstOccurence = speakers.findIndex(s => s.name === speaker.name)
      if (firstOccurence === originalIndex) {
        return
      } else {
        new_contents = updateSpeaker(new_contents, originalIndex, firstOccurence)
        new_speakers.splice(originalIndex, 1)
      }
    })
    setSpeakers(new_speakers)
    setContents(new_contents)
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
          <SpeakerSettings speakers={speakers} setSpeakers={setSpeakers} clearSpeaker={clearSpeaker}/>
        </div>
        
        <div className='section'>
          <div className='buttonAction' onClick={mergeCells}>
            <FontAwesomeIcon className="symbol" icon={faUsersBetweenLines} /> Merge Cells
          </div>
          <div className='buttonAction' onClick={collapseSpeakers}>
            <FontAwesomeIcon className="symbol" icon={faUsersSlash} /> Collapse Speakers
          </div>
          <DownloadButton contents={contents} speakers={speakers} fileName={fileName} />
          <div className='buttonAction' onClick={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon className="symbol" icon={faCircleQuestion} /> Help
          </div>
          <Tutorial speakerSwap={speakerSwap} isExpanded={isExpanded} />
        </div>
        
      </div>

      <div className='Display'>
        {contents.length===0 && <FileSelector fileName={fileName} setFileName={setFileName} setContents={setContents} speakers={speakers} setSpeakers={setSpeakers} />}
        {contents && <TextDisplay contents={contents} setContents={setContents} speakers={speakers} />}
      </div>
    </div>
  );
}

export default App;
