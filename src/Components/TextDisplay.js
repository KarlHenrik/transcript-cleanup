import React from "react";
import TextBox from './TextBox.js';

function TextDisplay(props) {
    if (props.contents) {
        const contents = props.contents;

        return contents.map((c, idx) => 
                <TextBox key={idx} idx={idx} time={c.time} ID={c.ID} text={c.text} speakers={props.speakers} globalState={props.globalState}></TextBox>
            )
            
    } else {
        return null;
    }
}

export default TextDisplay;