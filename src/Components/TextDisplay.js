import React, { useState, useEffect } from "react";
import TextBox from './TextBox.js';

function TextDisplay(props) {
    const [num, setnum] = useState(true)
    const [copiedCell, setCopiedCell] = useState({})

    useEffect(() => {
        setnum(true);
    }, [props.contents])

    if (props.contents) {
        return props.contents.map((c, idx) => 
                <TextBox key={idx} idx={idx} time={c.time} ID={c.ID} text={c.text}
                 contents={props.contents} setContents={props.setContents} speakers={props.speakers}
                  num={num} setnum={setnum} copiedCell={copiedCell} setCopiedCell={setCopiedCell}></TextBox>
            )
    } else {
        return null;
    }
}

export default TextDisplay;