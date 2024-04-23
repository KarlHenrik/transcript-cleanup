import React, { useState, useEffect } from "react";
import TextBox from './TextBox.js';

function TextDisplay(props) {
    const [cellActionReady, setCellActionReady] = useState(true)
    const [copiedCell, setCopiedCell] = useState({})

    useEffect(() => {
        setCellActionReady(true);
    }, [props.contents])

    if (props.contents) {
        return props.contents.map((c, idx) => 
                <TextBox key={idx} idx={idx} time={c.time} ID={c.ID} text={c.text} speaker={c.ID && props.speakers[c.ID]}
                  contents={props.contents} setContents={props.setContents} speakers={props.speakers}
                  cellActionReady={cellActionReady} setCellActionReady={setCellActionReady} copiedCell={copiedCell} setCopiedCell={setCopiedCell}></TextBox>
            )
    } else {
        return null;
    }
}

export default TextDisplay;