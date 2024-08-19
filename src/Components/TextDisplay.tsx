import React from "react";
import TextBox from './TextBox';
import { Cell, Speaker, Action } from './types';
//import { v4 as uuidv4 } from 'uuid';

type TextBoxProps = {
    speakers: Speaker[];
    contents: Cell[];
    dispatch: React.Dispatch<Action>;
    newfocus: number | null
}

function TextDisplay({speakers,contents, dispatch, newfocus}: TextBoxProps) {
    if (contents) {
        return contents.map((cell, idx) => 
            <TextBox key={idx+cell.text} idx={idx} cell={cell} speakers={speakers}
                     dispatch={dispatch} newfocus={(newfocus === idx) ? newfocus : null} ></TextBox>
        )
    } else {
        return null;
    }
}

export default TextDisplay;