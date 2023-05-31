from docx.shared import Inches
from enum import Enum
from src.create_docx import create_docx, create_docx_text

class Format(Enum):
    MAXQDA_Rows = 1 # Time | (idx) | ID | Content
    Timed_Rows = 2 # (idx) | ID | [Time]Content
    NoTime_Rows = 3 # (idx) | ID | Content
    Timed_Text = 4

    def description(self):
        match self:
            case Format.MAXQDA_Rows:
                return "Rows with MAXQDA time"
            case Format.Timed_Rows:
                return "Rows with time column"
            case Format.NoTime_Rows:
                return "Rows with no time"
            case Format.Timed_Text:
                return "Text with time"
            
    def suffix(self):
        match self:
            case Format.MAXQDA_Rows:
                return "MR"
            case Format.Timed_Rows:
                return "TR"
            case Format.NoTime_Rows:
                return "NR"
            case Format.Timed_Text:
                return "TT"

    def reformat(self, new_filename, IDs, contents, times):
        match self:
            case Format.MAXQDA_Rows:
                assert times is not None
                return self.MAXQDA_reformat(new_filename, times, contents, IDs)
            case Format.Timed_Rows:
                assert times is not None
                return self.TimeCol_reformat(new_filename, times, contents, IDs)
            case Format.NoTime_Rows:
                return self.NoTime_reformat(new_filename, contents, IDs)
            case Format.Timed_Text:
                assert times is not None
                return self.TimeText_reformat(new_filename, times, contents, IDs)
            
    def MAXQDA_reformat(self, new_filename, times, contents, IDs):
        headers = ("", "ID", "Content")
        timed_contents = [t + " " + c for t, c in zip(times, contents)]
        rows = [range(1, len(times)+1), IDs, timed_contents]
        widths = (Inches(0.5), Inches(0.5), Inches(6))

        create_docx(new_filename, headers, rows, widths)

    def TimeCol_reformat(self, new_filename, times, contents, IDs):
        headers = ("Time", "", "ID", "Content")
        rows = [times, range(1, len(times)+1), IDs, contents]
        widths = (Inches(0.9), Inches(0.5), Inches(0.5), Inches(5))

        create_docx(new_filename, headers, rows, widths)

    def NoTime_reformat(self, new_filename, contents, IDs):
        headers = ("", "ID", "Content")
        rows = [range(1, len(contents)+1), IDs, contents]
        widths = (Inches(0.5), Inches(0.5), Inches(6))

        create_docx(new_filename, headers, rows, widths)
    
    def TimeText_reformat(self, new_filename, times, contents, IDs):
        for i, id in enumerate(IDs):
            if id == "I":
                IDs[i] = "Interviewee"
            elif id == "R":
                IDs[i] = "Researcher"
        create_docx_text(new_filename, times, contents, IDs)