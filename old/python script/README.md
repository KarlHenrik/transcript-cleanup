# transcript-transforms

This python script lets you quickly and beatufully reformat and clean up your transcripts to greatly speed up your qualitative research workflow!

How to install required libraries to run the script:
```sh
pip install -r requirements.txt
```

How to run the script:
```sh
python reformat_transctipt.py
```
A file selection window will open, select all the files you want to reformat. The input files will not be changed or overwritten. Reformatted files will be written to the same folders as the original input files, but with an extra suffix to specify the new format.

## Choosing an output format

You can specify an output format by running the script with an addittional command line argument

```sh
python reformat_transctipt.py X
```
where X can be either of the numbers 1, 2, 3 or 4, each corresponding to the formats below. If no output format is specified, format 1 is used.

### Table with time column - 1
This format is recommended when adding speakers to a transcript and cleaning up errors. It is the standard format. After this clean-up step, format 2 is recommended. The reformatted files will have the suffix ´_TR´.

The rows will contain: Time | (idx) | ID | Content

### Pretty paragraphs with time-stamps - 2
This format is recommended for easy reading and coding of transcripts. The transcript should be cleaned in format 1 first. Speakers with labels "I" and "R" are relabeled to "Interviewee" and "Researcher" respectively. The reformatted files will have the suffix ´_TT´.

### Table with no time column - 3
This format is an option if you like tables but not time. The reformatted files will have the suffix ´_NR´.

The rows will contain: (idx) | ID | Content

### Table with time placed in text - 4
This format is an option if you want to use a table in MAXQDA (not recommended, might lead to performance issues). The reformatted files will have the suffix ´_MR´.

The rows will contain: (idx) | ID | [Time]Content

## Cleanup tools

The cleanup tools are enabled by default, but can be disabled by adding any of the following optional command line arguments like this:

```sh
python reformat_transctipt.py nocollapse noremove nosplit
```
If you entered the arguments correctly, you should be notified of the disabled tools when running the script.

### Speaker collapse
When the same speaker is specified more than once in a row, the relevant rows of text are merged into one. If the merged text exceeds 300 characters, a line break is added to make the text nicer to read.

### Removing rows
If the speaker specified is called X, the relevant row is removed.

### Splitting rows
If you add "SPLIT[R]" in a row of text, the row is split into two with the second part having the speaker labeled as "R" (R can be anything). You can add multiple splits in a single piece of text.

## Supported input formats
´.vtt´ files can be read by this script.

Every output format from this script can also be read by this script.

Transcripts exported from MAXQDA can also be ready by this script, so long as the original transcript was one of the output formats from this script. Exporting with time stamps can take a few seconds. Exporting a transcript from MAXQDA with timestamps, when the transcript is in a table format can take many, many minutes, or just crash the program. You can instead export without timestamps and then recover the timestamps (see below) from the original transcript file instead, as long as the number of rows are the same. 

Transcripts in a table format exported from MAXQDA must first be opened and saved in Word. When the a transcript with format 4 is loaded into MAXQDA and then exported with timestamps, the first timestamp is moved outside the table for some reason. This script automatically detects and fixes this error.

## Recovering timestamps
If you reformat a file ´A´ into a new file ´B´ that no longer has timestamps, and then make changes to ´B´, you can add the time stamps back as long as ´A´ and ´B´ still have the same number of rows. Simply run the file ´transfer_time.py´ and select the two files. The output format and cleanup tools used when running ´transfer_time.py´ is specified in the same way as for the main script.