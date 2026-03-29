import json
import sys

nb_path = r'c:\Users\hrgir\OneDrive\Desktop\model\Hackathon\demo\NLP_Fake_News_Classification\fake-news.ipynb'
out_path = r'c:\Users\hrgir\OneDrive\Desktop\model\Hackathon\my-app\notebook_code.txt'

with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

code_cells = [c for c in nb['cells'] if c['cell_type'] == 'code']

with open(out_path, 'w', encoding='utf-8') as out:
    out.write(f"Total code cells: {len(code_cells)}\n\n")
    for i, cell in enumerate(code_cells):
        source = ''.join(cell['source'])
        out.write(f"{'='*60}\n")
        out.write(f"CELL {i}\n")
        out.write(f"{'='*60}\n")
        out.write(source)
        out.write("\n\n")

print(f"Done! Written to {out_path}")
