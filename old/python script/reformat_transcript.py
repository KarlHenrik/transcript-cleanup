from tkinter import filedialog
import os
import sys

from src.transcript_table import TranscriptTable
from src.format import Format

def choose_files():
    if os.name == 'nt':
        from ctypes import windll, wintypes
        windll.user32.SetThreadDpiAwarenessContext(wintypes.HANDLE(-2))  # Toggle ON
        filenames = filedialog.askopenfilenames(initialdir = ".", 
                                                title = "Select transcript files",
                                                filetypes = (("Transcript files","*.vtt*"), ("Transcript files","*.docx*")))
        windll.user32.SetThreadDpiAwarenessContext(wintypes.HANDLE(-1))  # Toggle OFF
    else:
        filenames = filedialog.askopenfilenames(initialdir = ".", title = "Select transcript files")

    return filenames

def choose_format():
    a = sys.argv

    if len(sys.argv) > 1 and sys.argv[1].isnumeric():
        try:
            format = Format(int(sys.argv[1]))
        except ValueError:
            raise ValueError(f"Invalid format selection: {sys.argv[1]}, only valid numbers are {[e.value for e in Format]}")
    else:
        format = Format.Timed_Rows

    split = "nosplit" not in a
    remove = "noremove" not in a
    spkrcoll = "nocollapse" not in a

    if not (split and remove and spkrcoll):
        print(f"Formatting without{' splitting' if not split else ''}" + 
              f"{' removing' if not remove else ''}{' speaker-collapse' if not spkrcoll else ''}")

    return format, split, remove, spkrcoll


if __name__ == "__main__":
    filenames = choose_files()
    #filenames = [r"C:\Users\karlhf\OneDrive - Universitetet i Oslo\Desktop\PhD\Data\transcript-transforms\transcripts\øyvind.vtt"]

    tables = [TranscriptTable(file) for file in filenames]
    format, split, remove, spkrcoll = choose_format()

    for table in tables:
        if split:
            table.split_cells()
        if remove:
            table.remove_cells()
        if spkrcoll:
            table.speaker_collapse()
        table.write(format)

