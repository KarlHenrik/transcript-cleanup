import React from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord } from '@fortawesome/free-regular-svg-icons';
import './App.css';

function padded_time(time) {
  if (time.length === 7) {
    time = "00:" + time
  }
  return time
}

function DownloadButton(props) {
  
  function handleDownload() {
    if (!(props.fileName)) {
      return
    }
    let pars = [];
    props.contents.forEach((c) => {
      let split_text = c.text.split("\n\n").map(
        (line, idx) =>
          new TextRun({
            break: idx === 0 ? 0 : 2,
            text: line,
            font: "Calibri",
            size: 24,
          })
      );
      pars.push(
        new Paragraph({
          children: [
            new TextRun({
              text: c.time === "" ? "" : padded_time(c.time),
              break: c.time === "" ? 0 : 1,
              font: "Calibri",
              size: 24,
            }),
            new TextRun({
              text: (c.ID !== "" ? props.speakers[c.ID].name : "-") + ": ",
              bold: true,
              break: 1,
              font: "Calibri",
              size: 24,
            }),
            ...split_text,
          ],
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          children: pars,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      let new_filename = props.fileName.split(".")[0];
      saveAs(blob, new_filename + ".docx");
    });
  }
  if (props.contents) {
    return (
      <div onClick={handleDownload} className="buttonAction">
        <FontAwesomeIcon className="symbol" icon={faFileWord} /> Download as Word
      </div>
    );
  } else {
    return null;
  }
}

export default DownloadButton;
