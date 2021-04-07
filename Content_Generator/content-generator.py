import tkinter as tk
import wikipedia as wiki
import sys
import csv


def get_paragraph(pk, sk):
    """Uses python wikipedia library to return the first paragraph on the page
    matching the primary key that contains the secondary key.
    """

    # get wiki page and split into list of paragraphs
    paragraphs = wiki.WikipediaPage(pk).content.split("\n")

    # no secondary keyword
    if sk == '':
        return paragraphs[0]

    # avoid matching words containing sk
    sk = " " + sk + " "

    # search paragraph list for pk and sk and display paragraph if found
    i = 0
    while i < len(paragraphs):
        if sk in paragraphs[i]:
            return paragraphs[i]
        i += 1

    # not found
    return paragraphs[0]


def gui_input():
    """Calls get_paragraph and displays returned text. Calls export_csv with
    inputted keywords and generated text.
    """

    # get keywords
    pk = ent_PK.get()
    sk = ent_SK.get()

    # generate and display text
    txt = get_paragraph(pk, sk)
    txt_gen.delete(1.0, tk.END)
    txt_gen.insert(tk.END, txt)

    # write to output.csv
    export_csv(pk, sk, txt)


def cmd_input():
    """Reads input.csv and calls get_paragraph in a export_csv call
    to write the generated content to output.csv
    """

    # read input.csv
    with open(sys.argv[1], newline='') as input_file:
        input_reader = csv.reader(input_file)
        # split rows
        rows = list(input_reader)
        # get and split keywords
        pk, sk = rows[1][0].split(";")

        # create output.csv
        export_csv(pk, sk, get_paragraph(pk, sk))


def export_csv(pk, sk, txt, pop=""):
    """Exports generated text and keywords to output.csv
    """

    with open('output.csv', 'w', newline='') as output:
        output_writer = csv.writer(output)
        # header row
        output_writer.writerow(['input_keywords', 'output_content'])
        # content
        output_writer.writerow([pk + ";" + sk, txt, pop])


def gui_help():
    """Displays help text for inputting keywords in the gui"""

    text = ("Important: Make sure you have installed the python wikipedia "
            "module by running the command: pip install wikipedia. \n\n"
            "To display the first paragraph of a primary keyword's wiki "
            "page: Enter just the primary keyword and click the Generate! button \n\n"
            "To display a paragraph from the primary keyword's wikipedia page that also "
            "contains a secondary keyword: Enter both keywords and click "
            "the Generate! button.\nNote: if the secondary keyword is not found the "
            "first paragraph of the page will be displayed\n\n"
            "If the primary keyword is a US state then the state's population data will also be displayed "
            "The generated content will also be written to export.csv file in the same "
            "directory as this program")
    txt_gen.delete(1.0, tk.END)
    txt_gen.insert(
        tk.END, text)


def csv_help():
    """Displays help text for importing a csv"""

    text = ("To import a csv containing the primary and secondary keywords "
            "first make sure that your csv file is in the format: \n\n"
            "input_keywords, output_content\n"
            "primary_keyword;secondary_keyword \n\n"
            "Then run the command: python content-generator.py yourinputfilehere.csv"
            )
    txt_gen.delete(1.0, tk.END)
    txt_gen.insert(
        tk.END, text)


if __name__ == '__main__':

    # check for input.csv
    if len(sys.argv) > 1:
        cmd_input()

    else:

        window = tk.Tk()
        window.title("Content Generator")

        window.rowconfigure(0, minsize=100, weight=1)
        window.rowconfigure(1, minsize=600, weight=1)
        window.columnconfigure(0, minsize=700, weight=1)

        txt_gen = tk.Text(window, bg="#f0f8ff")
        fr_input = tk.Frame(window, bg="#80a3dd")

        lbl_PK = tk.Label(fr_input, text="Primary Keyword: ", bg="#80a3dd")
        lbl_SK = tk.Label(fr_input, text="Secondary Keyword: ", bg="#80a3dd")
        ent_PK = tk.Entry(fr_input, width=30)
        ent_SK = tk.Entry(fr_input, width=30)
        btn_submit = tk.Button(
            fr_input,
            text="Generate!",
            command=gui_input)

        btn_gui_help = tk.Button(
            fr_input,
            text="Help",
            command=gui_help)

        btn_csv_help = tk.Button(
            fr_input,
            text="How to Import a CSV",
            command=csv_help)

        lbl_PK.grid(row=0, column=0, sticky="w", pady=15, padx=5)
        ent_PK.grid(row=0, column=1, sticky="w")
        lbl_SK.grid(row=0, column=2, sticky="w", pady=15, padx=5)
        ent_SK.grid(row=0, column=3, sticky="w")
        btn_submit.grid(row=0, column=4, sticky="ew", padx=15)
        btn_gui_help.grid(row=1, column=4, sticky="ew", padx=15)
        btn_csv_help.grid(row=1, column=3, sticky="ew", padx=15)

        fr_input.grid(row=0, column=0, sticky="nsew")
        txt_gen.grid(row=1, column=0, sticky="nsew")

        window.mainloop()
