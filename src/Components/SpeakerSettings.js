import React, { useState } from "react";
import "./SpeakerSettings.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function SpeakerSettings(props) {
    const [input, setInput] = useState("");
    const [editing, setEditing] = useState("");
    const [removing, setRemoving] = useState(false);
    const [adding, setAdding] = useState(false);
    const [colorSelected, setColor] = useState('');  // You can set defaults if needed
    const speakers = props.speakers;
    
    function keyPress(e) {
        if (e.key === "Enter") {
            renameSpeaker()
        }
    }
    function renameSpeaker() {
        const new_speakers = [...speakers]
        new_speakers[editing].name = input
        new_speakers[editing].color = colorSelected;
        props.setSpeakers(new_speakers);
        setEditing("");
        setInput("");
        setRemoving(false)
    }
    function removeSpeaker() {
        const new_speakers = [...speakers]
        new_speakers.splice(editing, 1)
        props.setSpeakers(new_speakers)
        props.clearSpeaker(editing)
        setRemoving(false)
        setEditing("");
    }
    function keyPressAdd(e) {
        if (e.key === "Enter") {
            addSpeaker()
        }
    }
    function addSpeaker() {
        if (input !== "") {
            props.setSpeakers([...speakers, {name: input, color: "Black"}])
            setInput("")
            setAdding(false)
        }
    }

    return <div>
        {speakers.map((speaker, idx) => 
            <div className='SpeakersBox' key={idx}>
                {editing !== idx && (<>
                    <div>{idx + 1}: <b style={{color: speaker.color}}>{speaker.name}</b></div>
                    <span onClick={() => {setEditing(idx); setInput(speaker.name); setColor(speaker.color); setAdding(false)}} className="Edit"><FontAwesomeIcon icon={faPen} /></span>
                </>)}

                {editing === idx && (<>
                    <div>
                        {idx + 1}: <input value={input} onInput={e => setInput(e.target.value)} onKeyDown={keyPress} placeholder={speaker.name} className="SpeakerInput"/>
                    </div>
                    <div className="Editing">
                        <span onClick={() => {setEditing(""); renameSpeaker(); setRemoving(false)}} className='Confirm'>&#10004;</span>
                        {!removing && <div className='RemoveSpeaker' onClick={() => setRemoving(true)}>&#10006;</div>}
                        {removing && <div className='ReallyRemoveSpeaker' onClick={removeSpeaker}>&#10006;</div>}
                        <select className="ColorSelector" value={colorSelected} onChange={(e) => {setColor(e.target.value)}}>
                            <option value="#000000">Black</option>
                            <option value="#A83548">Red</option>
                            <option value="#9656A2">Purple</option>
                            <option value="#369ACC">Blue</option>
                            <option value="#2C29A2">Dark Blue</option>
                            <option value="#F4895F">Orange</option>
                            <option value="#FFC615">Gold</option>
                            <option value="#BB9BB1">Pink</option>
                            <option value="#12715D">Dark Green</option>
                        </select>
                    </div>
                </>)}
            </div>
        )}
        <div className='SpeakersBox'>
            {!adding && <div></div>}
            {!adding && <span onClick={() => {setAdding(true); setInput(""); setEditing("")}} className="Edit">&#10010;</span>}
            {adding && <input value={input} onInput={e => setInput(e.target.value)} onKeyDown={keyPressAdd} placeholder={""} className="SpeakerInput"/>}
            {adding && <div className="Editing">
                <span onClick={() => {addSpeaker()}} className='Confirm'>&#10004;</span>
                <div className='RemoveSpeaker' onClick={() => setAdding(false)}>&#10006;</div>
            </div>}
        </div>
    </div>
}

export default SpeakerSettings;