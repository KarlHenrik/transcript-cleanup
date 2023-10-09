import './App.css';
import DownloadButton from './DownloadButton.js';
import FileSelector from './FileSelector';
import TextDisplay from './TextDisplay.js';
import React, { useState, useEffect } from "react";



function App() {
  const [fileName, setFileName] = useState(null);
  const [contents, setContents] = useState([]);

  return (
    <div className='App'>
      <h1 className='Title'>
        Transcript Processing
      </h1>

      <div className='Controls'>
        <FileSelector fileName={fileName} setFileName={setFileName} setContents={setContents}/>

        <div>Speaker 1</div>
        <div>Speaker 2</div>
        <div>Add Speaker</div>
        <div>Speaker Collapse</div>
        

        <DownloadButton contents={contents}/>
      </div>

      <div className='Display'>
        <TextDisplay contents={contents} />
      </div>
      

      
    </div>
  );
};

export default App;
