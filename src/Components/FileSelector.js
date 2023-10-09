import React from "react";
import "./FileSelector.css"

function FileSelector(props) {
    const handleFileChange = (e) => {
        if (e.target.files) {
            props.setFileName(e.target.files[0].name);
            e.target.files[0]
                .text()
                .then((t) => {
                    props.setContents(read_vtt(t));
                });
        }
    };

    return <div>
        <label htmlFor="file" id="file_label">Choose .vtt file</label>
        <input type="file" id="file" accept=".vtt" onChange={handleFileChange} />
    </div>
}

function time_from_vtt(line_with_time) {
    return line_with_time.trim().split(/ --> /g)[0].slice(0, -2) // hh:mm:ss:x
}

function read_vtt(raw_text) {
    const lines = raw_text.split(/\r?\n|\r|\n/g); // Split by newline
    const contents = []
    let sentence_completed = true;
    for (let i = 2; i < lines.length - 1; i+=3) {
        let new_sentences = lines[i+1].replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        if (!sentence_completed) {
            contents[contents.length - 1].text += " " + new_sentences.shift().trim()
        }
        if (new_sentences.length != 0) {
            contents.push(
                {
                    text: new_sentences.shift().trim(),
                    time: time_from_vtt(lines[i]),
                    ID: "",
                }
            )
        }
        for (let sentence of new_sentences) {
            contents.push(
                {
                    text: sentence.trim(),
                    time: "",
                    ID: "",
                }
            )
        }
        sentence_completed = contents[contents.length - 1].text.match( /\.|\?|\!/g); // If the last sentence contains punctuation, it is completed
    }
    return contents
}

export default FileSelector;