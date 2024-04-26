import React, { useState, useEffect } from "react";
import "./TextBox.css"

function focusPrevSpeaker() {
    const prevTextBox = document.activeElement.parentElement.previousElementSibling
    if (prevTextBox !== null) {
        prevTextBox.childNodes[1].focus()
    }
}
function focusNextSpeaker() {
    const nextTextBox = document.activeElement.parentElement.nextElementSibling
    if (nextTextBox !== null) {
        nextTextBox.childNodes[1].focus()
    }
}
function focusQuote() {
    const parent = document.activeElement.parentElement
    if (parent !== null) {
        parent.childNodes[2].focus()
    }
}
function focusSpeaker() {
    const parent = document.activeElement.parentElement
    if (parent !== null) {
        parent.childNodes[1].focus()
    }
}

function TextBox(props) {
    const [ID, setID] = useState(props.ID);
    const [input, setInput] = useState(props.text);
    const [time, setTime] = useState(props.time);
    const [speaker, setSpeaker] = useState(props.speaker);

    useEffect(() => {
        setInput(props.text)
        setID(props.ID)
        setTime(props.time)
    }, [props.text, props.ID, props.idx, props.time]);


    useEffect(() => {
        setSpeaker(props.speakers[ID]) // If ID is changed from inside, use that
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ID]);

    useEffect(() => {
        setSpeaker(props.speakers[props.ID]) // If ID or avaliable speakers is changed from outside, use that
    }, [props.ID, props.speakers]);

    useEffect(() => {
        // For small changes, we need to update the stored data without re-rendering TextBox, to maintain responsiveness and UI-usability
        props.contents[props.idx] = {
            text: input,
            time: time,
            ID: ID,
        }
        localStorage.setItem("contents", JSON.stringify(props.contents))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, ID, time]);
    
    function speakerKeyDown(e) {
        const key = e.key;
        if (isFinite(key)) { // Not a number
            const new_ID = Number(key) - 1
            if (new_ID >= 0 && new_ID <= props.speakers.length - 1) {
                setID(new_ID);
                focusNextSpeaker();
                e.preventDefault();
                return
            }
        }
        if (key === "w" || key === "W" || key === "ArrowUp" ) {
            focusPrevSpeaker();
            e.preventDefault();
            return
        }
        if (key === "s" || key === "S"  || key === "ArrowDown" ) {
            focusNextSpeaker();
            e.preventDefault();
            return
        }
        if (key === "ArrowRight" ) {
            focusQuote();
            e.preventDefault();
            return
        }
        if (key === "|" || key === "Backspace" || key === "'") {
            setID("");
            e.preventDefault();
            return
        }
        if (key === "a" || key === "A") {
            if (props.cellActionReady) {
                props.setCellActionReady(false)
                const new_contents = [...props.contents]
                new_contents.splice(props.idx, 0, {
                    text: "",
                    time: "",
                    ID: "",
                });
                props.setContents(new_contents)
                focusNextSpeaker();
            }

            return
        }
        if (key === "b" || key === "B") {
            if (props.cellActionReady) {
                props.setCellActionReady(false)
                const new_contents = [...props.contents]
                new_contents.splice(props.idx+1, 0, {
                    text: "",
                    time: "",
                    ID: "",
                });
                props.setContents(new_contents)
                focusSpeaker();
            }
            
            return
        }
        if (key === "x" || key === "X") {
            if (props.cellActionReady) {
                props.setCellActionReady(false)
                props.setCopiedCell({
                    text: input,
                    time: time,
                    ID: ID,
                })
                const new_contents = [...props.contents]
                new_contents.splice(props.idx, 1);
                props.setContents(new_contents)
                focusSpeaker();
            }
            return
        }
        if (key === "v" || key === "V") {
            if (props.cellActionReady) {
                props.setCellActionReady(false)
                const new_contents = [...props.contents]
                new_contents.splice(props.idx+1, 0, props.copiedCell);
                props.setContents(new_contents)
                focusSpeaker();
            }
            
            return
        }
    }

    function quoteKeyDown(e) {
        const key = e.key;
        console.log(key)
        if (key === "Tab" || key === "Escape") { // Focus speaker
            focusSpeaker();
            e.preventDefault();
            return
        }
        // Now we check if there is selected text, and if we should assign a new speaker to the selected text
        if ((window.getSelection().toString() === "")) { // No text selected
            return
        }
        if (key === "|" || key === "'") {
            navigator.clipboard.writeText(window.getSelection().toString() + " (" + time.slice(0, -2) + ")")
            e.preventDefault();
        }
        if (!isFinite(key) || key === " ") { // Not a number
            return
        }
        const new_speaker_ID = Number(key) - 1 // Number from -1 to 8
        if (new_speaker_ID === ID || new_speaker_ID < 0 || new_speaker_ID >= props.speakers.length) { // Invalid ID
            e.preventDefault();
            return
        }
        let inds = window.getSelection()
        if (inds.anchorNode.className === "Quote") {
            setID(new_speaker_ID);
            focusSpeaker();
            e.preventDefault();
            return
        }

        let [start, end] = [inds.anchorOffset, inds.focusOffset].toSorted()
        let new_texts = [input.slice(0, start).trim(),  // Before selection
                        input.slice(start, end).trim(), // Selection
                        input.slice(end).trim()]        // After selection
                        .map((element, idx) => ({
                            text: element,
                            ID: ((idx === 1) ? new_speaker_ID : ID),   // Reassign middle ID
                        }))
                        .filter(element => (element.text !== ""))      // Remove empty parts
                        .map((element, idx) => ({
                            text: element.text,
                            time: ((idx === 0 && props.time) || ("")), // Remove time from parts not at start
                            ID: element.ID,
                        }))

        const new_contents = [...props.contents]
        new_contents.splice(props.idx, 1, ...new_texts);
        props.setContents(new_contents)

        e.preventDefault();
        focusSpeaker();
        return
    }
    
    return <div className="TextBox">
        <div className="Time">{props.time}</div>
        <div className="Speaker" tabIndex="0" style={{ color: speaker && speaker.color}} onKeyDown={(e) => {speakerKeyDown(e);}}>{time && <br />}<b>{speaker && speaker.name}{ID !== "" && ": "}{ID === "" && "-"}</b></div>
        <div className="Quote" tabIndex="0" onKeyDown={(e) => {quoteKeyDown(e)}} onInput={e => setInput(e.currentTarget.textContent)} contentEditable={true} suppressContentEditableWarning={true}>{props.text}</div>
    </div>
}

export default TextBox;