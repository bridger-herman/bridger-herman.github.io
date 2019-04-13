import os
from pathlib import Path
from fnmatch import fnmatch
from jinja2 import Environment, FileSystemLoader, select_autoescape

OUT_DIR = Path('build')
TEMPLATE_DIR = Path('templates')
TEMPLATE_EXTENSION = '.jinja'

EXCLUDE_NAMES = ['base.jinja']

jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

template_list = map(lambda name: TEMPLATE_DIR.joinpath(name), filter(lambda
    name: fnmatch(name, '*' + TEMPLATE_EXTENSION), os.listdir(TEMPLATE_DIR)))

for filepath in template_list:
    template = jinja_env.get_template(filepath.name)
    out_html = template.render()
    with open(OUT_DIR.joinpath(filepath.stem + '.html'), 'w') as fout:
        fout.write(out_html)

