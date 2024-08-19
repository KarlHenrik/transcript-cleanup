import { useEffect, useReducer } from "react";
import { Cell, Speaker, State, Action } from "./types";

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'deleteSpeaker': {
            const ID: number = action.payload.ID

            const {new_contents, new_speakers} = deleteSpeaker(state.contents, state.speakers, ID, null)
            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers
            }
        }
        case 'addSpeaker': {
            const speaker: Speaker = action.payload.speaker
            return {
                ...state,
                speakers: [...state.speakers, speaker]
            }
        }
        case 'updateSpeaker': {
            const {ID, speaker}: { ID: number, speaker: Speaker} = action.payload
            
            const new_speakers = state.speakers.with(ID, speaker)
            const new_contents = state.contents.map(cell => {
                if (cell.ID === ID) {
                    return { ...cell, speaker: speaker };
                }
                // Otherwise, keep the cell unchanged.
                return cell;
            });
            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers
            }
        }
        case 'addCell': {
            const idx = action.payload.idx
            const newCell = {
                text: "",
                time: "",
                speaker: null,
                ID: null,
            }
            const new_contents = [...state.contents]
            new_contents.splice(idx, 0, newCell);
            return {
                ...state,
                contents: new_contents
            }
        }
        case 'replaceCell': {
            const {idx, newCells}: { idx: number, newCells: Cell[]} = action.payload

            const new_contents = [...state.contents]
            new_contents.splice(idx, 1, ...newCells);

            return {
                ...state,
                contents: new_contents
            }
        }
        case 'cutCell': {
            const {idx}: {idx: number} = action.payload

            const new_contents = [...state.contents]
            const cut_cell = new_contents[idx]
            new_contents.splice(idx, 1);
            return {
                ...state,
                contents: new_contents,
                copiedCell: cut_cell
            }
        }
        case 'copyCell': {
            const {idx}: {idx: number} = action.payload

            const copied_cell = state.contents[idx]
            return {
                ...state,
                copiedCell: copied_cell
            }
        }
        case 'pasteCell': {
            const {idx}: {idx: number} = action.payload
            if (state.copiedCell === null) return state

            const new_contents = [...state.contents]
            new_contents.splice(idx, 0, state.copiedCell);
            return {
                ...state,
                contents: new_contents
            }
        }
        case 'assignSpeaker': {
            const {ID, idx}: {ID: number | null, idx: number} = action.payload

            const oldCell = state.contents[idx]
            const new_contents = state.contents.with(idx, {
                ...oldCell,
                ID: ID,
                speaker: (ID !== null) ? state.speakers[ID] : null
            })
            return {
                ...state,
                contents: new_contents
            }
        }
        case 'updateCellText': {
            // IMPORTANT: This dispatch mutates in-place. This might lead to bugs later. 
            const {text, idx}: {text: string, idx: number} = action.payload

            const oldCell = state.contents[idx]
            const new_contents = state.contents.with(idx, {
                ...oldCell,
                text: text,
            })
            state.contents = new_contents
            localStorage.setItem("state", JSON.stringify(state));
            return state
        }
        case 'setState': {
            const {new_contents, new_speakers} = makeStateConsistent(action.payload.contents, action.payload.speakers);
            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers
            }
        }
        case 'setContents': {
            const {new_contents, new_speakers} = makeStateConsistent(action.payload.contents, state.speakers);

            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers,
                prevfocus: 0,
                newfocus: 0
            }
        }
        case 'setSpeakers': {
            const {new_contents, new_speakers} = makeStateConsistent(state.contents, action.payload.speakers);
            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers
            }
        }
        case 'collapseSpeakers': {
            let new_speakers: Speaker[] = [...state.speakers];
            let new_contents: Cell[] = [...state.contents];
            // Looping through speakers in reverse, so that when speaker i is removed, all cells with higher IDs can be updated with no unintented effects
            state.speakers.toReversed().forEach((speaker, index) => {
                const ID = state.speakers.length - index - 1;
                const lowest_ID_with_name = state.speakers.findIndex(s => s.name === speaker.name)
                if (lowest_ID_with_name === ID) {
                    return
                } else {
                    ({new_contents, new_speakers} = deleteSpeaker(new_contents, new_speakers, ID, lowest_ID_with_name))
                }
            })
            return {
                ...state,
                contents: new_contents,
                speakers: new_speakers
            }
        }
        case 'mergeCells': {
            const new_contents: Cell[] = []
            let newfocus = state.prevfocus;
            state.contents.forEach((cell, idx) => {
                if (idx > ((state.prevfocus !== null) ? state.prevfocus : 0)) {
                    new_contents.push(cell)
                    return
                } else if (cell.ID === null) {
                    new_contents.push(cell)
                    return
                } else if (idx === 0) { // We only collapse upwards, so first cell is safe
                    new_contents.push(cell)
                    return
                } else if (cell.ID === null || cell.ID !== new_contents[new_contents.length - 1].ID) { // No ID match
                    new_contents.push(cell)
                    return
                }
                if (newfocus !== null) {newfocus -= 1}
                const old_text = new_contents[new_contents.length - 1].text;
                const last_paragraph = old_text.split("\n\n").slice(-1)[0]
                if ((last_paragraph + " " + cell.text).length > 300) { // Add newlines if the last paragraph is long
                    new_contents[new_contents.length - 1].text += "\n\n" + cell.text
                } else {
                    new_contents[new_contents.length - 1].text += " " + cell.text;
                }
            });
            return {
                ...state,
                contents: new_contents,
                newfocus: newfocus
            }
        }
        case 'clearAll': {
            return {
                ...state,
                contents: [],
                speakers: [
                    { name: "Researcher", color: "#A83548" },
                    { name: "Interviewee", color: "#369ACC" },
                  ],
                copiedCell: null,
            };
        }
        case 'selectCell': {
            return {
                ...state,
                prevfocus: action.payload.idx
            };
        }
    }
    throw Error('Unknown action.');
}

function makeStateConsistent(contents: Cell[], speakers: Speaker[], pad_speakers=true) {
    // Makes sure all assigned speakers exist and have their names stored in contents,
    // either by removing too big ones, or padding on more
    let max_speaker_ID = speakers.length - 1;
    let new_max_speaker_ID = max_speaker_ID

    const new_speakers = [...speakers]
    const new_contents = contents.map(cell => {
        if (cell.ID === null) {
            return cell;
        } else if (cell.ID <= max_speaker_ID) {
            return {
                ...cell,
                speaker: speakers[cell.ID]
            }
        } else {
            if (pad_speakers) {
                new_max_speaker_ID = Math.max(new_max_speaker_ID, cell.ID)
                return {
                    ...cell,
                    speaker: {
                        name: "Speaker " + cell.ID + 1,
                        color: "black"
                    }
                }
            } else {
                return {
                    ...cell,
                    ID: null,
                    speaker: null
                }
            }
        }
    });
    while (new_max_speaker_ID > max_speaker_ID) {
        new_speakers.push({
            name: "Speaker " + new_speakers.length,
            color: "black"
        })
        max_speaker_ID = new_speakers.length - 1;
    }

    return {new_contents, new_speakers}
}

function deleteSpeaker(contents: Cell[], speakers: Speaker[], ID: number, replacementID: number | null = null) {
    const new_speakers = [...speakers]
    new_speakers.splice(ID, 1)
    const new_contents = contents.map(cell => {
        if (cell.ID === null) return cell
        if (cell.ID === ID) {
            return {
                ...cell,
                ID: replacementID,
                speaker: (replacementID !== null) ? speakers[replacementID] : null };
        } else if (cell.ID > ID) {
            // If the ID is greater, decrement it.
            return { ...cell, ID: cell.ID - 1 };
        }
        // Otherwise, keep the cell unchanged.
        return cell;
    });
    return {new_contents, new_speakers}
}

function getStorageValue(): State {
    // getting stored value
    const saved = localStorage.getItem("state");
    if (saved) {
        return JSON.parse(saved)
    } else {
        return {
            speakers: [
                { name: "Researcher", color: "#A83548" },
                { name: "Interviewee", color: "#369ACC" },
              ],
            contents: [],
            copiedCell: null,
            prevfocus: null,
            newfocus: null
        };
    }
  }

export function useContents() {
    const [state, dispatch] = useReducer(reducer, getStorageValue());

    useEffect(() => {
        // storing input name
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

    const { speakers, contents, newfocus } = state;
      
    return {
        speakers,
        contents,
        newfocus,
        dispatch
    };
}