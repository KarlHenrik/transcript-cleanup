import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'
import "./FileSelector.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { Cell, Speaker, Action } from './types';

type FileSelector = {
  setFileName: (name: string) => void;
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
};

function FileSelector({setFileName, dispatch, speakers}: FileSelector) {
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
                        dispatch({
                            type: "setContents",
                            payload: {
                                contents: new_contents
                            }
                        })
                    });
            }
            reader.readAsArrayBuffer(file)
            return
        }
        )
    }
    const onDrop = useCallback(loadFile, [setFileName, speakers]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'text/vtt': ['.vtt']}})

    function loadDemo() {
        // TODO this will not work
        setFileName("test_transcript.vtt")
        const {speakers, contents} = JSON.parse('{"speakers":[{"name":"Luke","color":"#369ACC"},{"name":"Obi-Wan","color":"#A83548"},{"name":"C-3PO","color":"#FFC615"},{"name":"R2-D2","color":"#12715D"}],"contents":[{"text":"No, my father didn\'t fight in the wars.","time":"00:04.2","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was a navigator on a spice freighter.","time":"00:05.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"That\'s what your uncle told you.","time":"00:07.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He didn\'t hold with your father\'s ideals, thought he should have stayed here and not gotten involved.","time":"00:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"You fought in the Clone Wars?","time":"00:15.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"Yes.","time":"00:17.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I was once a Jedi Knight, the same as your father.","time":"00:18.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I wish I\'d known him.","time":"00:20.7","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was the best star pilot in the galaxy.","time":"00:25.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And a cunning warrior.","time":"00:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I understand you\'ve become quite a good pilot yourself.","time":"00:31.3","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And he was a good friend.","time":"00:36.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Which reminds me, I have something here for you.","time":"00:39.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Your father wanted you to have this when you were old enough, but your uncle wouldn\'t allow it.","time":"00:45.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He feared you might follow old Obi-Wan on some damn fool idealistic crusade like your father did.","time":"00:51.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Sir, if you\'ll not be needing me, I\'ll close down for a while.","time":"00:57.9","ID":2,"speaker":{"name":"C-3PO","color":"#FFC615"}},{"text":"Sure, go ahead.","time":"01:00.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"What is it?","time":"01:04.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The father\'s light saber.","time":"01:06.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"This is the weapon of a Jedi Knight.","time":"01:08.8","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Not as clumsy or random as a blaster.","time":"01:11.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"An elegant weapon for a more civilized age.","time":"01:15.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.","time":"01:22.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the dark times.","time":"01:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the Empire.","time":"01:32.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"How did my father die?","time":"01:36.9","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"A young Jedi named Darth Vader, who was a pupil of mine until he turned to evil, helped the Empire hunt down and destroy the Jedi Knights.","time":"01:41.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He betrayed and murdered your father.","time":"01:52.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Now the Jedi are all but extinct.","time":"01:56.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Vader was seduced by the dark side of the Force.","time":"01:59.9","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"The Force?","time":"02:04.5","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The Force is what gives the Jedi his power.","time":"02:06.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It\'s an energy field created by all living things.","time":"02:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It surrounds us and penetrates us.","time":"02:12.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It binds the galaxy together.","time":"02:15.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"*Beeps*","time":"","speaker":{"name":"R2-D2","color":"#12715D"},"ID":3}],"copiedCell":null,"prevfocus":27,"newfocus":0}')
        dispatch({
            type: "setState",
            payload: {
                contents: contents,
                speakers: speakers
            }
        })
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
                    speaker: null,
                }
            )
        }
        for (const sentence of new_sentences) {
            contents.push(
                {
                    text: sentence.trim(),
                    time: "",
                    ID: speakerID,
                    speaker: null
                }
            )
        }
        sentence_completed = (null !== contents[contents.length - 1].text.match( /\.|\?|!/g)) // If the last sentence contains punctuation, it is completed
    }
    return contents
}

export default FileSelector;