import tkinter as tk
from tkinter import filedialog
import ctypes

from src.transcript_table import TranscriptTable
from src.format import Format

def UI():
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
    root = tk.Tk()
    root.withdraw()

    filenames = filedialog.askopenfilenames(initialdir = ".", title = "Select files",filetypes = (("Transcript files","*.vtt*"),("Transcript files","*.docx*")))

    return filenames

if __name__ == "__main__":
    filenames = UI()
    #filenames = [r"C:\Users\karlhf\OneDrive - Universitetet i Oslo\Desktop\PhD\Data\Transcript-Transformations\transcripts\øyvind.vtt"]

    tables = [TranscriptTable(file) for file in filenames]
    
    format = Format.MAXQDA_Rows
    for table in tables:
        table.split_cells()
        #table.speaker_collapse()
        table.write(format)


 
