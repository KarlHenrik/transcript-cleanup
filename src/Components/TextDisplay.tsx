import React, { useState, useEffect } from "react";
import TextBox from './TextBox';
import { Cell, Speaker } from './types';

type TextBoxProps = {
    speakers: Speaker[];
    contents: Cell[];
    setContents: (contents: Cell[]) => void;
}

function TextDisplay({speakers,contents,setContents}: TextBoxProps) {
    const [cellActionReady, setCellActionReady] = useState(true)
    const [copiedCell, setCopiedCell] = useState<Cell | null>(null)

    useEffect(() => {
        setCellActionReady(true);
    }, [contents, copiedCell])

    if (contents) {
        return contents.map((c, idx) => 
                <TextBox key={idx} idx={idx} time={c.time} ID={c.ID} text={c.text} speaker={c.ID ? speakers[c.ID] : null}
                  contents={contents} setContents={setContents} speakers={speakers}
                  cellActionReady={cellActionReady} setCellActionReady={setCellActionReady} copiedCell={copiedCell} setCopiedCell={setCopiedCell}></TextBox>
            )
    } else {
        return null;
    }
}

export default TextDisplay;