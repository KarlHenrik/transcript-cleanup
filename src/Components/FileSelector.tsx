import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'
import "./FileSelector.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { Cell, Speaker } from './types';

type DownloadButtonProps = {
  setFileName: (name: string) => void;
  setSpeakers: (speakers: Speaker[]) => void;
  setContents: (cells: Cell[]) => void;
  speakers: Speaker[];
};

function FileSelector({setFileName, setSpeakers, setContents, speakers}: DownloadButtonProps) {
    function loadFile(acceptedFiles: File[]): void {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                setFileName(file.name);
                file
                    .text()
                    .then((t) => {
                        const new_contents = read_vtt(t);
                        setContents(new_contents);
                        pad_speakers(new_contents, speakers, setSpeakers)
                    });
            }
            reader.readAsArrayBuffer(file)
            return
        }
        )
    }
    const onDrop = useCallback(loadFile, [setFileName, setContents, setSpeakers, speakers]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'text/vtt': ['.vtt']}})

    function loadDemo() {
        setFileName("test_transcript.vtt")
        setContents(JSON.parse('[{"text":"No, my father didn\'t fight in the wars.","time":"00:00.0","ID":""},{"text":"He was a navigator on a spice freighter.","time":"","ID":""},{"text":"That\'s what your uncle told you.","time":"00:07.0","ID":""},{"text":"He didn\'t hold with your father\'s ideals, thought he should have stayed here and not gotten involved.","time":"","ID":""},{"text":"You fought in the Clone Wars?","time":"00:12.0","ID":""},{"text":"Yes.","time":"00:17.0","ID":""},{"text":"I was once a Jedi Knight, the same as your father.","time":"","ID":""},{"text":"I wish I\'d known that.","time":"00:24.0","ID":""},{"text":"He was the best star pilot in the galaxy.","time":"","ID":""},{"text":"And a cunning warrior.","time":"00:29.0","ID":""},{"text":"I understand you\'ve become quite a good pilot yourself.","time":"","ID":""},{"text":"And he was a good friend.","time":"00:36.0","ID":""},{"text":"Which reminds me, I have something here for you.","time":"00:39.0","ID":""},{"text":"Your father wanted you to have this when you were old enough, but your uncle wouldn\'t allow it.","time":"00:45.0","ID":""},{"text":"He feared you might follow old Obi-Wan on some damn fool idealistic crusade like your father did.","time":"00:51.0","ID":""},{"text":"Sir, if you\'ll not be needing me, I\'ll close down for a while.","time":"00:57.0","ID":""},{"text":"Sure, go ahead.","time":"01:00.0","ID":""},{"text":"What is it?","time":"01:04.0","ID":""},{"text":"Your father\'s lightsaber.","time":"01:06.0","ID":""},{"text":"This is the weapon of a Jedi Knight.","time":"","ID":""},{"text":"Not as clumsy or random as a blaster.","time":"01:11.0","ID":""},{"text":"An elegant weapon for a more civilized age.","time":"01:15.0","ID":""},{"text":"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.","time":"01:21.0","ID":""},{"text":"Before the Dark Times.","time":"01:28.0","ID":""},{"text":"Before the Empire.","time":"","ID":""},{"text":"How did my father die?","time":"01:35.0","ID":""},{"text":"A young Jedi named Darth Vader, who was a pupil of mine until he turned to evil, helped the Empire hunt down and destroy the Jedi Knights.","time":"01:39.0","ID":""},{"text":"He betrayed and murdered your father.","time":"01:50.0","ID":""},{"text":"Now the Jedi are all but extinct.","time":"01:54.0","ID":""},{"text":"Vader was seduced by the dark side of the Force.","time":"01:58.0","ID":""},{"text":"The Force?","time":"02:03.0","ID":""},{"text":"The Force is what gives a Jedi his power.","time":"02:05.0","ID":""},{"text":"It\'s an energy field created by all living things.","time":"02:08.0","ID":""},{"text":"It surrounds us, penetrates us, it binds the galaxy together.","time":"02:11.0","ID":""}]'))
        
        return
    }

    return <div>
        <div {...getRootProps()} className="FileSelector">
            <FontAwesomeIcon className="fa" icon={faFileLines} />
            <input {...getInputProps()} />
            {
            isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag and drop a file here, or click to select file</p>
            }
        </div>
        <div onClick={loadDemo} className="DemoFile">
            Or, click here to try a demo file!
        </div>
        </div>
}

function time_from_vtt(line_with_time: string) {
    return line_with_time.trim()
                         .split(/ --> /g)[0]
                         .slice(0, -2) // hh:mm:ss:x
}

function parseSpeaker(line: string) {
    const regex = /^\[SPEAKER_0?(\d+)\]: (.*)$/;
    const match = line.match(regex);
    // If the line matches the pattern, return the speaker ID and the rest of the string
    if (match) {
        const speakerID = Number(match[1]);
        const message = match[2];
        return { speakerID, message };
    } else {
        // If the pattern is not matched, return some indication such as null or an error
        const speakerID = null;
        const message = line;
        return { speakerID, message }; // or throw an Error, or return an object with an error property
    }
}

function pad_speakers(contents: Cell[], speakers: Speaker[], setSpeakers: (speakers: Speaker[]) => void) {
    const new_speakers = [...speakers];
    const maxId = contents
        .filter(obj => obj.ID !== null) // Exclude objects with empty ID
        .map(obj => Number(obj.ID)) // Convert ID values to numbers
        .reduce((max, ID) => Math.max(max, ID), -1);
    let padding = maxId - speakers.length + 1
    while (padding > 0) {
        new_speakers.push({
            name: "Speaker " + new_speakers.length,
            color: "black"
        })
        padding = padding - 1;
    }
    setSpeakers(new_speakers)
}

function read_vtt(raw_text: string): Cell[] {
    const lines = raw_text.split(/\r?\n|\r|\n/g); // Split by newline
    
    if ( lines[3].includes("[A") ) { // Check for newer format where lines 4 is split over two lines, with info about tech used.
        const startIndex = lines[3].indexOf("[A");
        const endIndex = lines[3].indexOf("]", startIndex);
        if (endIndex !== -1) {
          lines[3] = lines[3].substring(0, startIndex) + lines[4];
          lines.splice(4, 1);
        }
    }
    
    const contents: Cell[] = []
    let sentence_completed = true;
    for (let i = 2; i < lines.length - 1; i+=3) {
        const { speakerID, message } = parseSpeaker(lines[i+1]) || {};
        const new_sentences = message.replace(/((?<!\bMr|\bMs|\bMrs)[.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        if (!sentence_completed) {
            contents[contents.length - 1].text += " " + new_sentences.shift()?.trim()
        }
        if (new_sentences.length !== 0) {
            contents.push(
                {
                    text: new_sentences.shift()?.trim() || "",
                    time: time_from_vtt(lines[i]),
                    ID: speakerID,
                }
            )
        }
        for (const sentence of new_sentences) {
            contents.push(
                {
                    text: sentence.trim(),
                    time: "",
                    ID: speakerID,
                }
            )
        }
        sentence_completed = (null !== contents[contents.length - 1].text.match( /\.|\?|!/g)) // If the last sentence contains punctuation, it is completed
    }
    return contents
}

export default FileSelector;