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

function TextBox(props) {
    const [ID, setID] = useState(props.ID);
    const [input, setInput] = useState(props.text);

    useEffect(() => {
        if (props.speakers[1].length) {
            if (ID == props.speakers[1]) {
                setID("");
            } else if (ID > props.speakers[1]) {
                setID(ID => ID - 1);
            }
        }
    }, [props.speakers]);

    useEffect(() => {
        props.globalState[1][props.idx] = input
    }, [props.globalState]);

    useEffect(() => {
        console.log(props.idx)
    }, [props.idx]);
    
    
    function setSpeaker(key) {
        props.speakers[0].forEach((c, idx) => {
            if (key == idx+1) {
                setID(idx);
                focusNextSpeaker();
                return
            }
        })
        if (key == "w") {
            focusPrevSpeaker();
        }
        if (key == "s") {
            focusNextSpeaker();
        }
        if (key == "|" || key == "Backspace") {
            setID("");
        }
    }

    return <div className="TextBox">
        <div className="Time">{props.time}</div>
        <div className="Speaker" tabIndex="0" onKeyDown={(e) => {setSpeaker(e.key)}}>{props.time && <br />}<b>{props.speakers[0][ID]}{ID!=="" && ": "}{ID==="" && "-"}</b></div>
        <div className="Quote" tabIndex="0" onInput={e => setInput(e.currentTarget.textContent)} contentEditable={true} suppressContentEditableWarning={true}>{props.text}</div>
    </div>
    // <div className="Quote">{props.text}</div>
}

export default TextBox;