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
    const [time, setTime] = useState(props.time)

    useEffect(() => {
        if (props.speakers[1].length) {
            if (ID === props.speakers[1]) {
                setID("");
            } else if (ID > props.speakers[1]) {
                setID(ID => ID - 1);
            }
        }
    }, [props.speakers, ID]);

    useEffect(() => {
        setInput(props.text)
        setID(props.ID)
        setTime(props.time)
    }, [props.text, props.ID, props.idx, props.time]);

    useEffect(() => {
        props.contents[props.idx] = {
            text: input,
            time: time,
            ID: ID,
        }
        localStorage.setItem("contents", JSON.stringify(props.contents))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, ID, time]);
    
    function setSpeaker(e) {
        const key = e.key;
        props.speakers[0].forEach((c, idx) => {
            if (key === String(idx+1)) {
                setID(idx);
                focusNextSpeaker();
                e.preventDefault();
                return
            }
        })
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
        if (key === "|" || key === "Backspace") {
            setID("");
            e.preventDefault();
            return
        }
        if (key === "a" || key === "A") {
            if (props.num) {
                props.setnum(false)
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
            if (props.num) {
                props.setnum(false)
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
            console.log(key)
            if (props.num) {
                props.setnum(false)
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
            if (props.num) {
                props.setnum(false)
                const new_contents = [...props.contents]
                new_contents.splice(props.idx+1, 0, props.copiedCell);
                props.setContents(new_contents)
                focusSpeaker();
            }
            
            return
        }
    }
    function escapeQuote(e) {
        const key = e.key;
        if (key === "Tab" || key === "Escape") {
            focusSpeaker();
            e.preventDefault();
            return
        }
        if ((window.getSelection().toString() !== "")) {
            if (key === (ID+1).toString()) {
                e.preventDefault();
                return
            }
            props.speakers[0].forEach((c, spkr_idx) => {
                if (key === String(spkr_idx+1)) {
                    let inds = window.getSelection()

                    let new_texts = [input.slice(0, inds.anchorOffset).trim(),
                                     input.slice(inds.anchorOffset, inds.focusOffset).trim(),
                                     input.slice(inds.focusOffset).trim()]
                                     .map((element, idx) => ({
                                        text: element,
                                        ID: ((idx === 1 && spkr_idx) || (ID)),
                                        }))
                                     .filter(element => (element.text !== ""))
                                     .map((element, idx) => ({
                                        text: element.text,
                                        time: ((idx === 0 && props.time) || ("")),
                                        ID: element.ID,
                                    }))

                    const new_contents = [...props.contents]
                    new_contents.splice(props.idx, 1, ...new_texts);
                    props.setContents(new_contents)

                    e.preventDefault();
                    focusSpeaker();
                    return
                }
            })
        }
    }

    return <div className="TextBox">
        <div className="Time">{props.time}</div>
        <div className="Speaker" tabIndex="0" onKeyDown={(e) => {setSpeaker(e);}}>{time && <br />}<b>{props.speakers[0][ID]}{ID!=="" && ": "}{ID==="" && "-"}</b></div>
        <div className="Quote" tabIndex="0" onKeyDown={(e) => {escapeQuote(e)}} onInput={e => setInput(e.currentTarget.textContent)} contentEditable={true} suppressContentEditableWarning={true}>{props.text}</div>
    </div>
}

export default TextBox;