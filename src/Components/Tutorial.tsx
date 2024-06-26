import React from 'react';

type TutorialProps = {
  isExpanded: boolean;
};

function Tutorial({ isExpanded }: TutorialProps) {
  // Component logic here

  return (
    <div   className='Tutorial'>
         <ul style={{ visibility: isExpanded ? "hidden" : undefined}}>
        <li>Click to the left of a text cell to select a speaker cell</li>
        <li>Move between speaker cells with ArrowUp/ArrowDown or W/S</li>
        <li>Assign speakers with number keys</li>
        <li>Unassign speakers with |(to the left of 1) or Backspace</li>
        
        <li>Edit text like with any editor (Crtl+Z/Y works!)</li>
        <li>Swap between selecting text and speaker cells with Tab</li>
        <li>Exit the text cell with Esc</li>
        <li>Assign speakers to selected text with number keys</li>

        <li>Add cell above with A</li>
        <li>Add cell below with B</li>
        <li>Cut cell with X</li>
        <li>Paste cell with V</li>
        <li>Swap two speakers by clicking <span>here</span></li>
      </ul>
    </div>
  );
}


export default Tutorial;

