Patrick Daniels - Content Generator

Python wikipedia library must be installed please run the command:
pip install wikipedia

This program 'generates' content by searching the wikipedia page corresponding with a given
primary keyword and returning the first paragraph on that page that contains the given secondary
keyword. If no secondary keyword is given, the program will return the first paragraph of the page.
The program then writes the generated content to output.csv in the same directory as the program and
if the gui is open will display the content.

The program can be run without the gui from the command line by passing an input csv file as an argument.

The input file must be formatted like so:
input_keywords, output_content
primary_keyword;secondary_keyword

A sample input.csv has been provided

