import './App.css';
import DownloadButton from './DownloadButton.js';
import FileSelector from './FileSelector';
import SpeakerSettings from './SpeakerSettings';
import TextDisplay from './TextDisplay.js';
import Tutorial from './Tutorial.js';
import React, { useState, useEffect } from "react";

function loadLocalStorage(id, initial) {
    const saved = localStorage.getItem(id);
    const initialValue = JSON.parse(saved);
    return initialValue || initial;
}

function App() {
  const [fileName, setFileName] = useState(loadLocalStorage("fileName", null));
  const [contents, setContents] = useState(loadLocalStorage("contents", []));
  const [speakers, setSpeakers] = useState(loadLocalStorage("speakers", [["Researcher", "Interviewee"], []]))

  useEffect(() => {
      localStorage.setItem("fileName", JSON.stringify(fileName))
      localStorage.setItem("speakers", JSON.stringify(speakers))
      localStorage.setItem("contents", JSON.stringify(contents))
  }, [fileName, contents, speakers])

  function clearAll() {
      localStorage.clear();
      setFileName(null)
      setContents([])
      setSpeakers([["Researcher", "Interviewee"], []])
  }

  function speakerCollapse() {
    const new_contents = []
    contents.forEach((element, idx) => {
      if (idx === 0) {
        new_contents.push(
          {
              text: contents[0].text,
              time: contents[0].time,
              ID: contents[0].ID,
          }
        )
      } else if (element.ID !== "" && element.ID === new_contents[new_contents.length - 1].ID) {
        let old_text = new_contents[new_contents.length - 1].text;
        let last_paragraph = old_text.split("\n\n").slice(-1)[0]
        if ((last_paragraph + " " + element.text).length > 300) {
          new_contents[new_contents.length - 1].text += "\n\n" + element.text
        } else {
          new_contents[new_contents.length - 1].text += " " + element.text;
        }
      } else {
        new_contents.push(
          {
              text: element.text,
              time: element.time,
              ID: element.ID,
          }
        )
      }
    });
    setContents(new_contents)
  }

  return (
    <div className='App'>
      <h1 className='Title'>
        Transcript Cleanup
      </h1>
      
      <div className='Controls'>
        <div>
          <div >Active file: {fileName}</div>
          <div className='buttonAction' onClick={clearAll}>Clear File</div>
        </div>
        
        <SpeakerSettings speakers={speakers} setSpeakers={setSpeakers} />
        
        <div>
          <div className='buttonAction' onClick={speakerCollapse}>Speaker Collapse</div>
          <DownloadButton contents={contents} speakers={speakers} />
        </div>
        <Tutorial />
      </div>

      <div className='Display'>
        {contents.length===0 && <FileSelector fileName={fileName} setFileName={setFileName} setContents={setContents} />}
        {contents && <TextDisplay contents={contents} setContents={setContents} speakers={speakers} />}
      </div>
    </div>
  );
};

export default App;
