from abc import ABC, abstractmethod
from enum import Enum
from itertools import repeat
from math import floor
from docx.shared import Inches, Pt
from pathlib import Path
from src.create_docx import create_docx

class Format(Enum):
    MAXQDA = 1 # Time | (idx) | ID | Content
    Timed = 2 # (idx) | ID | [Time]Content
    NoTime = 3 # (idx) | ID | Content

def suffix(format):
    match format:
        case Format.MAXQDA:
            return "MQ"
        case Format.Timed:
            return "TC"
        case Format.NoTime:
            return "NT"

class TranscriptTable(ABC):
    def __init__(self, path, contents, IDs = None):
        self._path = path
        self._contents = contents
        if IDs == None:
            self._IDs = repeat("", len(contents))
        else:
            self._IDs = IDs

    @abstractmethod
    def write(self, format):
        if format == Format.NoTime:
            headers, rows, widths = no_time(self._contents, self._IDs)
        elif format == Format.MAXQDA:
            headers, rows, widths = MAXQDA_time(self._times, self._contents, self._IDs)
        elif format == Format.Timed:
            headers, rows, widths = ownCol_time(self._times, self._contents, self._IDs)

        p = Path(self._path)
        new_path = p.with_name(f"{p.stem}_{suffix(format)}.docx")
        new_filename = new_path.absolute()
        print(f"Writing file {new_filename}...")
        create_docx(new_filename, headers, rows, widths)

class Timed_Table(TranscriptTable):
    def __init__(self, path, times, contents, IDs = None):
        self._times = times
        super().__init__(path, contents, IDs)
        
    def write(self, format):
        super().write(format)

class NoTime_Table(TranscriptTable):
    def __init__(self, path, contents, IDs = None):
        super().__init__(path, contents, IDs)

    def write(self, format):
        if format == Format.NoTime:
            super().write(format)
        else:
            raise TypeError("NoTime_Table can only write in the NoTime format")

def ownCol_time(times, contents, IDs):
    headers = ("Time", "", "ID", "Content")
    rows = [times, range(1, len(times)+1), IDs, contents]
    widths = (Inches(1.1), Inches(0.5), Inches(0.5), Inches(5))

    return headers, rows, widths

def maxqda_time(time):
    if len(time) == 9:
        return f"[00:{time}]"
    else:
        return f"[{time}]"

def MAXQDA_time(times, contents, IDs):
    headers = ("", "ID", "Content")
    code_contents = [maxqda_time(t) + c for t, c in zip(times, contents)]
    rows = [range(1, len(times)+1), IDs, code_contents]
    widths = (Inches(0.5), Inches(0.5), Inches(6))

    return headers, rows, widths

def no_time(contents, IDs):
    headers = ("", "ID", "Content")
    rows = [range(1, len(contents)+1), IDs, contents]
    widths = (Inches(0.5), Inches(0.5), Inches(6))

    return headers, rows, widths