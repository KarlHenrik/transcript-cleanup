import React from "react";
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from "docx";

function DownloadButton(props) {
    function handleDownload() {
        let pars = []
        props.contents.forEach((c) => {
            let split_text = c.text.split("\n\n").map((line, idx) => new TextRun({break: ((idx === 0) ? 0 : 2), text:line, font: "Calibri", size: 24}))
            pars.push(new Paragraph({
                children: [
                    new TextRun({
                        text: c.time,
                        break: ((c.time === "") ? 0 : 1),
                        font: "Calibri",
                        size: 24,
                    }),
                    new TextRun({
                        text: ((c.ID !== "") ? props.speakers[0][c.ID] : "-") + ": ",
                        bold: true,
                        break: 1,
                        font: "Calibri",
                        size: 24,
                    }),
                    ...split_text,
                ],
            }),)
        })

        const doc = new Document({
            sections: [{
                children: pars,
            }]
        });
        

        Packer.toBlob(doc).then((blob) => {
            // saveAs from FileSaver will download the file
            saveAs(blob, "example.docx");
        });
    }
    if (props.contents) {
        return <div onClick={handleDownload} className="buttonAction">Download as Word</div>
    } else {
        return null
    }
}

export default DownloadButton;