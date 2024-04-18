import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'
import "./FileSelector.css"

function FileSelector(props) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                props.setFileName(file.name);
                file
                    .text()
                    .then((t) => {
                        props.setContents(read_vtt(t));
                    });
            }
            reader.readAsArrayBuffer(file)
            return
        }
    )
    
    }, [props])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'text/vtt': ['.vtt']}})

    function loadDemo() {
        props.setFileName("test_transcript.vtt")
        props.setContents(JSON.parse('[{"text":"No, my father didn\'t fight in the wars.","time":"00:00.0","ID":""},{"text":"He was a navigator on a spice freighter.","time":"","ID":""},{"text":"That\'s what your uncle told you.","time":"00:07.0","ID":""},{"text":"He didn\'t hold with your father\'s ideals, thought he should have stayed here and not gotten involved.","time":"","ID":""},{"text":"You fought in the Clone Wars?","time":"00:12.0","ID":""},{"text":"Yes.","time":"00:17.0","ID":""},{"text":"I was once a Jedi Knight, the same as your father.","time":"","ID":""},{"text":"I wish I\'d known that.","time":"00:24.0","ID":""},{"text":"He was the best star pilot in the galaxy.","time":"","ID":""},{"text":"And a cunning warrior.","time":"00:29.0","ID":""},{"text":"I understand you\'ve become quite a good pilot yourself.","time":"","ID":""},{"text":"And he was a good friend.","time":"00:36.0","ID":""},{"text":"Which reminds me, I have something here for you.","time":"00:39.0","ID":""},{"text":"Your father wanted you to have this when you were old enough, but your uncle wouldn\'t allow it.","time":"00:45.0","ID":""},{"text":"He feared you might follow old Obi-Wan on some damn fool idealistic crusade like your father did.","time":"00:51.0","ID":""},{"text":"Sir, if you\'ll not be needing me, I\'ll close down for a while.","time":"00:57.0","ID":""},{"text":"Sure, go ahead.","time":"01:00.0","ID":""},{"text":"What is it?","time":"01:04.0","ID":""},{"text":"Your father\'s lightsaber.","time":"01:06.0","ID":""},{"text":"This is the weapon of a Jedi Knight.","time":"","ID":""},{"text":"Not as clumsy or random as a blaster.","time":"01:11.0","ID":""},{"text":"An elegant weapon for a more civilized age.","time":"01:15.0","ID":""},{"text":"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.","time":"01:21.0","ID":""},{"text":"Before the Dark Times.","time":"01:28.0","ID":""},{"text":"Before the Empire.","time":"","ID":""},{"text":"How did my father die?","time":"01:35.0","ID":""},{"text":"A young Jedi named Darth Vader, who was a pupil of mine until he turned to evil, helped the Empire hunt down and destroy the Jedi Knights.","time":"01:39.0","ID":""},{"text":"He betrayed and murdered your father.","time":"01:50.0","ID":""},{"text":"Now the Jedi are all but extinct.","time":"01:54.0","ID":""},{"text":"Vader was seduced by the dark side of the Force.","time":"01:58.0","ID":""},{"text":"The Force?","time":"02:03.0","ID":""},{"text":"The Force is what gives a Jedi his power.","time":"02:05.0","ID":""},{"text":"It\'s an energy field created by all living things.","time":"02:08.0","ID":""},{"text":"It surrounds us, penetrates us, it binds the galaxy together.","time":"02:11.0","ID":""}]'))
        
        return
    }

    return <div>
        <div {...getRootProps()} className="FileSelector">
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

function time_from_vtt(line_with_time) {
    let trimmed_time = line_with_time.trim()
                                     .split(/ --> /g)[0]
                                     .slice(0, -2) // hh:mm:ss:x
    return trimmed_time
}

function parseSpeaker(line) {
    const regex = /^\[SPEAKER_0?(\d+)\]: (.*)$/;
    const match = line.match(regex);
  
    // If the line matches the pattern, return the speaker ID and the rest of the string
    if (match) {
        const speakerID = match[1];
        const message = match[2];
        return { speakerID, message };
    } else {
        // If the pattern is not matched, return some indication such as null or an error
        const speakerID = "";
        const message = line;
        return { speakerID, message }; // or throw an Error, or return an object with an error property
    }
}

function read_vtt(raw_text) {
    const lines = raw_text.split(/\r?\n|\r|\n/g); // Split by newline
    const contents = []
    let sentence_completed = true;
    for (let i = 2; i < lines.length - 1; i+=3) {
        const { speakerID, message } = parseSpeaker(lines[i+1]) || {};
        let new_sentences = message.replace(/((?<!\bMr|\bMs|\bMrs)[.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        if (!sentence_completed) {
            contents[contents.length - 1].text += " " + new_sentences.shift().trim()
        }
        if (new_sentences.length !== 0) {
            contents.push(
                {
                    text: new_sentences.shift().trim(),
                    time: time_from_vtt(lines[i]),
                    ID: speakerID,
                }
            )
        }
        for (let sentence of new_sentences) {
            contents.push(
                {
                    text: sentence.trim(),
                    time: "",
                    ID: speakerID,
                }
            )
        }
        sentence_completed = contents[contents.length - 1].text.match( /\.|\?|!/g); // If the last sentence contains punctuation, it is completed
    }
    return contents
}

export default FileSelector;