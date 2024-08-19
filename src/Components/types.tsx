export interface Cell {
  text: string;
  time: string;
  speaker: Speaker | null;
  ID: number | null;
}

export interface Speaker {
  name: string;
  color: string;
}

export interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export interface State {
  contents: Cell[];
  speakers: Speaker[];
  copiedCell: Cell | null;
  prevfocus: number | null;
  newfocus: number | null;
}