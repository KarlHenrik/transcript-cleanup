import React from "react";

function TextDisplay(props) {
    if (props.contents) {
        const contents = props.contents;
        return contents
            .map(c => 
            <div>
                <div>{c.time}</div>
                <div>{c.text}</div>
                <br/>
            </div>)
    } else {
        return null;
    }
}

export default TextDisplay;