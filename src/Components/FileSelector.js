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
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'text/vtt': ['.vtt'],}})

    function loadDemo() {
        props.setFileName("test_transcript.vtt")
        props.setContents(JSON.parse('[{"text":"Hello!","time":"00:00.0","ID":""},{"text":"The project is generally focused on how different courses and tasks in physics, in a physics bachelor and computational physics master programme, leads to the development of programming skills, strategies and values.","time":"","ID":""},{"text":"This part of the project.","time":"00:17.0","ID":""},{"text":"Involves?","time":"","ID":""},{"text":"Interviewing...","time":"","ID":""},{"text":"You about your!","time":"","ID":""},{"text":"Experiences taking physics, mathematics and programming courses and writing your master\'s thesis.","time":"","ID":""},{"text":"I\'d like to audio and video record these interviews through Zoom.","time":"00:27.0","ID":""},{"text":"I\'d also like to do a separate audio recording as a backup.","time":"00:32.0","ID":""},{"text":"I\'d also like to collect your master\'s thesis and code, as well as reports and code from the relevant project-based courses.","time":"00:37.0","ID":""},{"text":"These data will be held strictly confidential.","time":"00:47.0","ID":""},{"text":"Only I, the research team and data processors, like transcribers, will have access to them.","time":"00:51.0","ID":""},{"text":"They\'ll then be stored on a secure server or encrypted computer during the study.","time":"00:59.0","ID":""},{"text":"We\'ll eventually transcribe them and replace your names with pseudonyms, so that you will not be identifiable in any results from the study.","time":"01:04.0","ID":""},{"text":"At the end of the study, in 2028, the latest, the recordings will be deleted.","time":"01:13.0","ID":""},{"text":"It\'s completely voluntary to participate and you can withdraw your consent at any time.","time":"01:23.0","ID":""},{"text":"Whether you choose to participate will have no effect on your grade for your thesis or any course you take here at UAL.","time":"01:30.0","ID":""},{"text":"Hello, my name is Carl Henrik.","time":"01:37.0","ID":""},{"text":"I\'m doing a PhD in physics education research here at UAL.","time":"01:41.0","ID":""},{"text":"Today I\'ll ask you some questions about your experiences with computation and programming during your studies.","time":"01:44.0","ID":""},{"text":"Some questions will be about the types of activities you have done or skills you have acquired.","time":"01:50.0","ID":""},{"text":"Others will be about your opinions and preferences when it comes to computation and programming.","time":"01:55.0","ID":""},{"text":"Please tell me as much as you can about the questions I\'m going to ask.","time":"02:01.0","ID":""},{"text":"Even if you don\'t care about programming or didn\'t do much computation during your studies, I want to know as much as possible about what you know and what you think about it.","time":"02:09.0","ID":""},{"text":"We\'ll start by talking a little bit about your background.","time":"02:19.0","ID":""},{"text":"After that, we\'ll go in depth on how you use programming during your thesis work.","time":"02:22.0","ID":""},{"text":"Finally, we\'ll talk about your experiences with computation during your bachelor\'s and master\'s courses.","time":"02:27.0","ID":""},{"text":"Do you have any questions before we start?","time":"02:35.0","ID":""}]'))
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
        if (new_sentences.length !== 0) {
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
        sentence_completed = contents[contents.length - 1].text.match( /\.|\?|!/g); // If the last sentence contains punctuation, it is completed
    }
    return contents
}

export default FileSelector;