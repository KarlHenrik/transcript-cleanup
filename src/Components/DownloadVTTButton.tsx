import React from "react";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord } from '@fortawesome/free-regular-svg-icons';
import './App.css';
import { Cell } from './types';

type DownloadVTTButtonProps = {
  fileName: string | null;
  contents: Cell[] | null;
};

// TODO - Add saving and parsing of actual speaker names. Add saving and parsing of cells with no time.

function DownloadVTTButton({fileName, contents}: DownloadVTTButtonProps) {
  
  function handleDownload() {
    if (!(fileName)) {
      return
    }

    let latestTime = "00:00:00.000"

    let finalText = "WEBVTT\n\n";
    contents?.forEach((c) => {
      if (c.time !== "") {
        latestTime = padded_time(c.time) + "00"
      }
      finalText += latestTime + " --> " + latestTime + "\n"
      finalText += c.ID !== null ? "[SPEAKER_0" + c.ID + "]: ": ""
      finalText += c.text + "\n\n"
      console.log(c.text)
    });

    const file = new Blob([finalText], {type: 'text/plain'});
    const new_filename = fileName.split(".")[0];
    saveAs(file, new_filename + ".vtt");
  }

  if (contents) {
    return (
      <div onClick={handleDownload} className="buttonAction">
        <FontAwesomeIcon className="symbol" icon={faFileWord} /> Download as VTT
      </div>
    );
  } else {
    return null;
  }
}

function padded_time(time: string) {
  if (time.length === 7) {
    time = "00:" + time
  }
  return time
}

export default DownloadVTTButton;
