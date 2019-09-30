commentSymbols = ("#","/*","//")

import sys
import os, os.path

acceptableFileExtensions = ('.py', '.js', '.html')
exclusions = []

currentDir = os.getcwd().replace('\\_dev', '')

filesToCheck = []
for root, _, files in os.walk(currentDir):
    for f in files:
        fullpath = os.path.join(root, f)
        if '.git' in fullpath or '.idea' in fullpath or '_dev' in fullpath:
            continue
        for extension in acceptableFileExtensions:
            if fullpath.endswith(extension) :
                filesToCheck.append(fullpath)

if not filesToCheck:
    print ('No files found.')
    quit()

lineCount = 0
totalBlankLineCount = 0
totalCommentLineCount = 0

print ('')
print ('Filename    lines\tblank lines\tcomment lines\tcode lines')

for fileToCheck in filesToCheck:
    with open(fileToCheck) as f:

        fileLineCount = 0
        fileBlankLineCount = 0
        fileCommentLineCount = 0

        try:
            bname = os.path.basename(fileToCheck)
            if bname in exclusions:
                continue

            if '\\vendor\\' in fileToCheck or '\\engine\\' in fileToCheck:
               continue

            for line in f:
                lineCount += 1
                fileLineCount += 1

                lineWithoutWhitespace = line.strip()
                if not lineWithoutWhitespace:
                    totalBlankLineCount += 1
                    fileBlankLineCount += 1
                elif any(lineWithoutWhitespace.startswith(cs) for cs in commentSymbols):
                    totalCommentLineCount += 1
                    fileCommentLineCount += 1
            

            print ("{0: <30}{1: <4}{2: <4}{3: <4}".format(bname,fileLineCount,fileBlankLineCount,fileCommentLineCount,fileLineCount - fileBlankLineCount - fileCommentLineCount))
        except:
            pass

print ('')
print ('Totals')
print ('--------------------')
print ('Lines:         ' + str(lineCount))
print ('Blank lines:   ' + str(totalBlankLineCount))
print ('Comment lines: ' + str(totalCommentLineCount))
print ('Code lines:    ' + str(lineCount - totalBlankLineCount - totalCommentLineCount))