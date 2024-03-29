import tkinter as tk
from tkinter import filedialog
from tkinter import ttk

from src.transcript_table import TranscriptTable
from src.format import Format

def choose_files():
    from ctypes import windll, wintypes
    windll.user32.SetThreadDpiAwarenessContext(wintypes.HANDLE(-2))  # Toggle ON
    filenames = filedialog.askopenfilenames(initialdir = ".",
                                            title = "Select files",
                                            filetypes = (("Transcript files","*.vtt*"), ("Transcript files","*.docx*")))
    windll.user32.SetThreadDpiAwarenessContext(wintypes.HANDLE(-1))  # Toggle OFF

    return filenames

def choose_format():
    def clickButton(_=None):
        root.quit()
        root.destroy()

    def onEnter(_=None):
        widget = root.focus_get()
        if widget != root:
            widget.invoke()

    def _quit():
        root.quit()
        root.destroy()
        exit()

    root = tk.Tk()
    root.protocol("WM_DELETE_WINDOW", _quit)
    root.title("Reformat")
    
    v = tk.IntVar()
    v.set(1)

    frm = ttk.Frame(root, padding=10)
    frm.grid()
    ttk.Label(frm, text="Choose your output format:").grid(column=0, row=0, sticky="W")
    for i, format in enumerate(Format):
        tk.Radiobutton(frm, 
                    text=format.description(),
                    pady = 5, 
                    variable=v,
                    value=format.value).grid(column=0, sticky="W")
        
    def key_press(a):
        a = int(a.char)
        if a in [i.value for i in Format]:
            v.set(a)

    for i in range(10):
        root.bind(str(i), key_press)

    split = tk.BooleanVar()
    split.set(True)
    remove = tk.BooleanVar()
    remove.set(True)
    spkrcoll = tk.BooleanVar()
    spkrcoll.set(True)
    tk.Checkbutton(frm, text='SPLIT[?]', variable=split, onvalue=True, offvalue=False).grid(column=1, row = 1, sticky="W")
    tk.Checkbutton(frm, text='Remove (X)', variable=remove, onvalue=True, offvalue=False).grid(column=1, row = 2, sticky="W")
    tk.Checkbutton(frm, text='Speaker Collapse', variable=spkrcoll, onvalue=True, offvalue=False).grid(column=1, row = 3, sticky="W")

    btn = ttk.Button(frm, text="Format!", command=clickButton)
    root.bind("<Return>", onEnter)
    btn.grid(column=1)

    btn.focus_force()
    root.mainloop()
    
    return Format(v.get()), split.get(), remove.get(), spkrcoll.get()

if __name__ == "__main__":
    filenames = choose_files()
    #filenames = [r"C:\Users\karlhf\OneDrive - Universitetet i Oslo\Desktop\PhD\Data\transcript-transforms\transcripts\øyvind.vtt"]

    tables = [TranscriptTable(file) for file in filenames]
    assert len(tables) == 2
    assert len(tables[0]._contents) == len(tables[1]._contents)
    if (tables[0]._times is None) & (tables[1]._times is not None):
        tables[0]._times = tables[1]._times
        out_table = tables[0]
    elif (tables[1]._times is None) & (tables[0]._times is not None):
        tables[1]._times = tables[0]._times
        out_table = tables[1]
    else:
        raise ValueError("Not valid pair of files. One must have times, one must be missing times.")
    
    format, split, remove, spkrcoll = choose_format()

    if split:
        out_table.split_cells()
    if remove:
        out_table.remove_cells()
    if spkrcoll:
        out_table.speaker_collapse()
    out_table.write(format)