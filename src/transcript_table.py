from pathlib import Path
from src.read_transcript import read_transcript

class TranscriptTable:
    def __init__(self, filename):
        contents, IDs, times = read_transcript(filename)
        self._filename = filename
        self._IDs = IDs
        self._contents = contents
        self._times = times
        
    def write(self, outformat):
        p = Path(self._filename)
        new_path = p.with_name(f"{p.stem}_{outformat.suffix()}.docx")
        new_filename = new_path.absolute()
        print(f"Writing file {new_filename}...")
        outformat.reformat(new_filename, self._IDs, self._contents, self._times)

    def speaker_collapse(self):
        IDs, contents, times = [self._IDs[0]], [self._contents[0]], [self._times[0]]
        
        current_speaker = self._IDs[0]
        last_paragraph_len = len(self._contents[0])
        for i in range(1, len(self._contents)):
            if (self._IDs[i] == current_speaker) & (self._IDs[i] != ""):
                if last_paragraph_len + len(self._contents[i]) > 300:
                    contents[-1] = f"{contents[-1]}\n\n{self._contents[i]}"
                    last_paragraph_len = len(self._contents[i])
                else:
                    contents[-1] = f"{contents[-1]} {self._contents[i]}"
                    last_paragraph_len += len(self._contents[i])
            else:
                current_speaker = self._IDs[i]
                last_paragraph_len = len(self._contents[i])
                contents.append(self._contents[i])
                IDs.append(self._IDs[i])
                times.append(self._times[i])

        self._IDs = IDs
        self._contents = contents
        self._times = times

    def remove_cells(self):
        for i, id in reversed(list(enumerate(self._IDs))):
            if id.strip() == "X":
                self._IDs.pop(i)
                self._contents.pop(i)
                self._times.pop(i)

    def split_cells(self):
        contents = []
        times = []
        IDs = []

        for i, content in enumerate(self._contents):
            IDs.append(self._IDs[i])
            times.append(self._times[i])
            splitted = content.split("SPLIT")
            contents.append(splitted[0].strip())
            for split_content in splitted[1:]:
                new_id = split_content[1]
                IDs.append(new_id)
                times.append(self._times[i])
                contents.append(split_content[4:].strip())
        self._IDs = IDs
        self._contents = contents
        self._times = times