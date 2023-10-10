import React, { useState } from "react";
import "./SpeakerSettings.css"

function SpeakerSettings(props) {
    const [input, setInput] = useState("");
    const [editing, setEditing] = useState("");
    const [removing, setRemoving] = useState(false);
    const [inputAdding, setInputAdding] = useState("");
    const [adding, setAdding] = useState(false);
    const speakers = props.speakers;
    
    function keyPress(e) {
        if (e.key === "Enter") {
            renameSpeaker()
        }
    }
    function renameSpeaker() {
        const new_speakers = [...speakers[0]]
        new_speakers[editing] = input
        props.setSpeakers([new_speakers, []]);
        setEditing("");
        setInput("");
        setRemoving(false)
    }
    function removeSpeaker() {
        const new_speakers = [...speakers[0]]
        new_speakers.splice(editing, 1)
        props.setSpeakers([new_speakers, [editing]])
        setRemoving(false)
        setEditing("");
    }
    function keyPressAdd(e) {
        if (e.key === "Enter") {
            addSpeaker()
        }
    }
    function addSpeaker() {
        if (inputAdding !== "") {
            props.setSpeakers([[...speakers[0], inputAdding], []])
            setInputAdding("")
            setAdding(false)
        }
    }

    return <div>
        {speakers[0].map((s, idx) => 
        <div className='SpeakersBox'>
        
        {editing !== idx && <div key={idx}>{idx + 1}: <b>{s}</b></div>}
        {editing === idx && <div key={idx}>{idx + 1}: <input value={input} onInput={e => setInput(e.target.value)} onKeyDown={keyPress} placeholder={s} className="SpeakerInput"/></div>}

        {editing !== idx && <span onClick={() => {setEditing(idx); setInput(speakers[0][idx])}} className="Edit">&#9998;</span>}
        {editing === idx && <div className="Editing">
        <span onClick={() => {setEditing(""); renameSpeaker()}} className='Confirm'>&#10004;</span>
        {!removing && <div className='RemoveSpeaker' onClick={() => setRemoving(true)}>&#10006;</div>}
        {removing && <div className='ReallyRemoveSpeaker' onClick={removeSpeaker}>&#10006;</div>}
        </div>}
        </div>
    )}
    <div className='SpeakersBox'>
    <div></div>
    {adding && <input value={inputAdding} onInput={e => setInputAdding(e.target.value)} onKeyDown={keyPressAdd} placeholder={""} className="SpeakerInput"/>}
    {!adding && <span onClick={() => {setAdding(true)}} className="Edit">&#10010;</span>}
    {adding && <div className="Editing">
    <span onClick={() => {addSpeaker()}} className='Confirm'>&#10004;</span>
    <div className='RemoveSpeaker' onClick={() => setAdding(false)}>&#10006;</div>
    </div>}
    </div>
    </div>
}

export default SpeakerSettings;