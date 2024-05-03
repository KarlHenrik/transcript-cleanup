import React, { useState, useEffect } from "react";
import "./TextBox.css"
import { Cell, Speaker } from './types';
import { KeyboardEvent } from 'react';

type TextBoxProps = {
    ID: number | null;
    text: string;
    time: string;
    speaker: Speaker | null;
    idx: number;
    speakers: Speaker[];
    contents: Cell[];
    cellActionReady: boolean;
    setCellActionReady: (isReady: boolean) => void;
    setContents: (contents: Cell[]) => void;
    setCopiedCell: (cell: Cell) => void;
    copiedCell: Cell | null;
}

function TextBox({ID, text, time,speaker,idx,speakers,contents,cellActionReady,setCellActionReady,setContents,setCopiedCell,copiedCell}: TextBoxProps) {
    const [myID, setID] = useState(ID);
    const [input, setInput] = useState(text);
    const [mytime, setTime] = useState(time);
    const [myspeaker, setSpeaker] = useState<Speaker | null>(speaker);

    useEffect(() => {
        setInput(text)
        setID(ID)
        setTime(time)
    }, [text, ID, idx, time]);


    useEffect(() => {
        if (myID === null) {
            setSpeaker(null)
        } else {
            setSpeaker(speakers[myID]) // If ID is changed from inside, use that
        }
    }, [myID]);

    useEffect(() => {
        if (ID === null) {
            setSpeaker(null)
        } else {
            setSpeaker(speakers[ID]) // If ID or avaliable speakers is changed from outside, use that
        }
    }, [ID, speakers]);

    useEffect(() => {
        // For small changes, we need to update the stored data without re-rendering TextBox, to maintain responsiveness and UI-usability
        contents[idx] = {
            text: input,
            time: mytime,
            ID: myID,
        }
        localStorage.setItem("contents", JSON.stringify(contents))
    }, [input, myID, mytime]);
    
    function speakerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        const key = e.key;
        if (isFinite(Number(key))) { // Not a number TODO check if this still works
            const new_ID = Number(key) - 1
            if (new_ID >= 0 && new_ID <= speakers.length - 1) {
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
            setID(null);
            e.preventDefault();
            return
        }
        if (key === "a" || key === "A") {
            if (cellActionReady) {
                setCellActionReady(false)
                const new_contents = [...contents]
                new_contents.splice(idx, 0, {
                    text: "",
                    time: "",
                    ID: null,
                });
                setContents(new_contents)
                focusNextSpeaker();
            }

            return
        }
        if (key === "b" || key === "B") {
            if (cellActionReady) {
                setCellActionReady(false)
                const new_contents = [...contents]
                new_contents.splice(idx+1, 0, {
                    text: "",
                    time: "",
                    ID: null,
                });
                setContents(new_contents)
                focusSpeaker();
            }
            
            return
        }
        if (key === "x" || key === "X") {
            if (cellActionReady) {
                setCellActionReady(false)
                setCopiedCell({
                    text: input,
                    time: mytime,
                    ID: myID,
                })
                const new_contents = [...contents]
                new_contents.splice(idx, 1);
                setContents(new_contents)
                focusSpeaker();
            }
            return
        }
        if (key === "c" || key === "C") {
            if (cellActionReady) {
                setCellActionReady(false)
                setCopiedCell({
                    text: input,
                    time: mytime,
                    ID: myID,
                })
                focusSpeaker();
            }
            return
        }
        if (key === "v" || key === "V") {
            if (cellActionReady && copiedCell !== null) {
                setCellActionReady(false)
                const new_contents = [...contents]
                new_contents.splice(idx+1, 0, copiedCell);
                setContents(new_contents)
                focusSpeaker();
            }
            
            return
        }
    }

    function quoteKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        const key = e.key;
        if (key === "Tab" || key === "Escape") { // Focus speaker
            focusSpeaker();
            e.preventDefault();
            return
        }
        // Now we check if there is selected text, and if we should assign a new speaker to the selected text
        if ((window.getSelection()?.toString() === "")) { // No text selected
            return
        }
        if (key === "|" || key === "'") {
            navigator.clipboard.writeText(window.getSelection()?.toString() + " (" + mytime.slice(0, -2) + ")")
            e.preventDefault();
        }
        if (!isFinite(Number(key)) || key === " ") { // Not a number
            return
            // TODO does this still work with the Number call in between
        }
        const new_speaker_ID = Number(key) - 1 // Number from -1 to 8
        if (new_speaker_ID === myID || new_speaker_ID < 0 || new_speaker_ID >= speakers.length) { // Invalid ID
            e.preventDefault();
            return
        }
        const inds = window.getSelection()
        if (inds === null) return
        const quoteElement = inds.anchorNode as HTMLElement;
        if (quoteElement.className === "Quote") {
            setID(new_speaker_ID);
            focusSpeaker();
            e.preventDefault();
            return
        }

        const [start, end] = [inds.anchorOffset, inds.focusOffset].toSorted()
        const new_texts = [input.slice(0, start).trim(),  // Before selection
                        input.slice(start, end).trim(), // Selection
                        input.slice(end).trim()]        // After selection
                        .map((element, idx) => ({
                            text: element,
                            ID: ((idx === 1) ? new_speaker_ID : myID),   // Reassign middle ID
                        }))
                        .filter(element => (element.text !== ""))      // Remove empty parts
                        .map((element, idx) => ({
                            text: element.text,
                            time: ((idx === 0 && time) || ("")), // Remove time from parts not at start
                            ID: element.ID,
                        }))

        const new_contents = [...contents]
        new_contents.splice(idx, 1, ...new_texts);
        setContents(new_contents)

        e.preventDefault();
        focusSpeaker();
        return
    }
    
    return <div className="TextBox">
        <div className="Time">{time}</div>
        <div className="Speaker" tabIndex={0} style={{ color: myspeaker?.color || "black"}} onKeyDown={(e) => {speakerKeyDown(e);}}>{mytime && <br />}<b>{myspeaker && myspeaker.name}{myID !== null && ": "}{myID === null && "-"}</b></div>
        <div className="Quote" tabIndex={0} onKeyDown={(e) => {quoteKeyDown(e)}} onInput={e => setInput(e.currentTarget.textContent || "")} contentEditable={true} suppressContentEditableWarning={true}>{text}</div>
    </div>
}

function focusPrevSpeaker() {
  const prevTextBox = document?.activeElement?.parentElement?.previousElementSibling as HTMLElement | null;
  if (prevTextBox !== null) {
    const prevSpeaker = prevTextBox.childNodes[1] as HTMLElement;
    prevSpeaker.focus();
  }
}

function focusNextSpeaker() {
    const nextTextBox = document?.activeElement?.parentElement?.nextElementSibling as HTMLElement | null;
    if (nextTextBox !== null) {
        const nextSpeaker = nextTextBox.childNodes[1] as HTMLElement;
        nextSpeaker.focus();
    }
}
function focusQuote() {
    const parent = document?.activeElement?.parentElement as HTMLElement | null;
    if (parent !== null) {
        const thisQuote = parent.childNodes[2] as HTMLElement;
        thisQuote.focus();
    }
}
function focusSpeaker() {
    const parent = document?.activeElement?.parentElement as HTMLElement | null;
    if (parent !== null) {
        const thisSpeaker = parent.childNodes[1] as HTMLElement;
        thisSpeaker.focus();
    }
}

export default TextBox;