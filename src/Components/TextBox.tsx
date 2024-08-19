import React, { useEffect, useRef, useState } from "react";
import "./TextBox.css"
import { Cell, Speaker, Action } from './types';
import { KeyboardEvent } from 'react';

type TextBoxProps = {
    cell: Cell;
    idx: number;
    dispatch: React.Dispatch<Action>;
    speakers: Speaker[];
    newfocus: number | null;
}

function TextBox({cell, idx, dispatch, speakers, newfocus}: TextBoxProps) {
    const [input, setInput] = useState(cell.text);
    const cellRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        setInput(cell.text)
    }, [cell.text])

    useEffect(() => {
        if (newfocus === idx) {
            cellRef?.current?.focus()
        }
    }, [newfocus])

    function speakerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        const key = e.key;
        if (isFinite(Number(key))) { // Not a number TODO check if this still works
            const new_ID = Number(key) - 1
            if (new_ID >= 0 && new_ID <= speakers.length - 1) {
                dispatch({
                    type: 'assignSpeaker',
                    payload: {
                        ID: new_ID,
                        idx: idx
                    }})
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
            dispatch({
                type: 'assignSpeaker',
                payload: {
                    ID: null,
                    idx: idx
                }
            })
            e.preventDefault();
            return
        }
        if (key === "a" || key === "A") {
            dispatch({
                type: 'addCell',
                payload: {
                    idx: idx
                }
            })
            focusNextSpeaker();
            return
        }
        if (key === "b" || key === "B") {
            dispatch({
                type: 'addCell',
                payload: {
                    idx: idx + 1
                }
            })
            focusSpeaker();        
            return
        }
        if (key === "x" || key === "X") {
            dispatch({
                type: 'cutCell',
                payload: {
                    idx: idx
                }
            })
            focusSpeaker();
            return
        }
        if (key === "c" || key === "C") {
            dispatch({
                type: 'cutCell',
                payload: {
                    idx: idx
                }
            })
            focusSpeaker();
            return
        }
        if (key === "v" || key === "V") {
            dispatch({
                type: 'pasteCell',
                payload: {
                    idx: idx
                }
            })
            focusSpeaker();
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
            navigator.clipboard.writeText(window.getSelection()?.toString() + " (" + cell.time.slice(0, -2) + ")")
            e.preventDefault();
        }
        if (!isFinite(Number(key)) || key === " ") { // Not a number
            return
            // TODO does this still work with the Number call in between
        }
        const new_speaker_ID = Number(key) - 1 // Number from -1 to 8
        if (new_speaker_ID === cell.ID || new_speaker_ID < 0 || new_speaker_ID >= speakers.length) { // Invalid ID
            e.preventDefault();
            return
        }
        const inds = window.getSelection()
        if (inds === null) return
        const quoteElement = inds.anchorNode as HTMLElement;
        if (quoteElement.className === "Quote") {
            dispatch({
                type: 'assignSpeaker',
                payload: {
                    ID: new_speaker_ID,
                    idx: idx
                }
            })
            focusSpeaker();
            e.preventDefault();
            return
        }

        const [start, end] = new Int32Array([inds.anchorOffset, inds.focusOffset]).toSorted()
        const newCells: Cell[] = [
                        input.slice(0, start).trim(),   // Before selection
                        input.slice(start, end).trim(), // Selection
                        input.slice(end).trim()]        // After selection
                        .map((element, idx) => ({
                            text: element,
                            ID: ((idx === 1) ? new_speaker_ID : cell.ID),   // Reassign middle ID
                            time: null,
                            speaker: ((idx === 1) ? speakers[new_speaker_ID] : cell.speaker)
                        }))
                        .filter(element => (element.text !== ""))      // Remove empty parts
                        .map((element, idx) => ({
                            ...element,
                            time: ((idx === 0 && cell.time) || ("")), // Remove time from parts not at start
                        }))

        dispatch({
            type: 'replaceCell',
            payload: {
                idx: idx,
                newCells: newCells
            }
        })

        e.preventDefault();
        focusSpeaker();
        return
    }

    function handleOnFocus() {
        dispatch({
            type: 'selectCell',
            payload: {
                idx: idx,
            }
        })
    }

    return <div className="TextBox">
        <div className="Time">{cell.time}</div>
        <div className="Speaker" ref={cellRef} tabIndex={0} onFocus={handleOnFocus} style={{ color: cell.speaker?.color || "black"}} onKeyDown={(e) => {speakerKeyDown(e);}}>{cell.time && <br />}<b>{cell.speaker && cell.speaker.name}{cell.ID !== null && ": "}{cell.ID === null && "-"}</b></div>
        <div className="Quote" tabIndex={0} onKeyDown={(e) => {quoteKeyDown(e)}} onInput={e => setInput(e.currentTarget.textContent || "")} contentEditable={true} suppressContentEditableWarning={true}>{cell.text}</div>
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