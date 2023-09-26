import time
import os
import sys
import asyncio
import signal
import websockets
import threading
import subprocess
from pathlib import Path
from PIL import Image
from fnmatch import fnmatch
from http.server import HTTPServer, SimpleHTTPRequestHandler
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from jinja2 import Environment, FileSystemLoader, select_autoescape

ASSETS_DIR = Path('assets')
OUT_DIR = Path('build')
TEMPLATE_DIR = Path('templates')
TEMPLATE_EXTENSION = '.jinja'

# Image resizing constants
IMG_FOLDER = ASSETS_DIR.joinpath('img')
OUT_IMG_FOLDER = OUT_DIR.joinpath('img')
IMG_RESOLUTION_WIDTHS = [2048]

# TailwindCSS constants
TAILWIND_INPUT = ASSETS_DIR.joinpath('css', 'tailwind-input.css')
TAILWIND_OUTPUT = ASSETS_DIR.joinpath('css', 'tailwind-output.css')
TAILWIND_CONFIG = Path('tailwind.config.js')

EXCLUDE_NAMES = ['base.jinja']

SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8000
AUTORELOAD_PORT = 8001

COPYRIGHT_BLOCK = '''
<p>
    Last updated: {}
</p>
<p>
    Copyright (c) {} Bridger Herman
</p>
'''.format(time.strftime('%b %d %Y'), time.strftime('%Y'))

CONNECTIONS = set()

class Watcher(FileSystemEventHandler):
    '''
    Rebuild the site when there are any changes to the file system
    '''
    last_timestamp = time.time()
    def on_any_event(self, event):
        if time.time() - Watcher.last_timestamp > 1:
            print('Rebuilding site...')
            build_tailwind()
            # resize_images()
            build_templates(True)
            print('Finished building')
            autoreload()
            Watcher.last_timestamp = time.time()

class FileWatchers:
    '''
    Define which folders to watch in the filesystem to rebuild the website
    '''
    def start(self):
        paths_to_watch = [TEMPLATE_DIR, ASSETS_DIR]
        observers = []
        for p in paths_to_watch:
            observer = Observer()
            observer.schedule(Watcher(), str(p), recursive=True)
            observers.append(observer)
            observer.start()
        self.observers = observers
    
    def stop(self):
        for observer in self.observers:
            observer.stop()
    
    def join(self):
        for observer in self.observers:
            observer.join()
        self.observers = None

def resize_images():
    '''
    Resize all images to ensure that they are not too big
    '''
    if not OUT_IMG_FOLDER.is_dir():
        OUT_IMG_FOLDER.mkdir()

    all_images = os.listdir(IMG_FOLDER)

    print('Resizing images...')
    for img in all_images:
        # load img
        img_path = IMG_FOLDER.joinpath(img)
        if not img_path.is_file():
            continue
        img_data = Image.open(img_path)

        # calculate aspect ratios
        for new_width in IMG_RESOLUTION_WIDTHS:
            # don't generate if we would be upsampling the image
            # just copy the original
            if new_width > img_data.width:
                img_data.save(OUT_IMG_FOLDER.joinpath(img_path.stem + '_{}.jpg'.format(img_data.width)))
                continue

            ratio = new_width / img_data.width
            new_height = int(ratio * img_data.height)
            new_img = img_data.resize((new_width, new_height))
            new_img.save(OUT_IMG_FOLDER.joinpath(img_path.stem + '_{}.jpg'.format(new_width)))

    print('... done')


def build_tailwind():
    '''
    Build the TailwindCSS (this step requires downloading the tailwind
    standalone executable: https://tailwindcss.com/blog/standalone-cli)
    '''
    # this step requires tailwindcss-* to be on PATH
    print('Building tailwind CSS... from ' + os.getcwd())
    tailwind_cli = 'tailwindcss-windows-x64.exe'
    result = subprocess.check_call([tailwind_cli, '-c', TAILWIND_CONFIG, '-i', TAILWIND_INPUT, '-o', TAILWIND_OUTPUT])
    print('  ...done')


def build_templates(serve: bool):
    '''
    Build the templates for the actual pages
    '''
    jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

    template_list = list(map(lambda name: TEMPLATE_DIR.joinpath(name), filter(lambda
        name: fnmatch(name, '*' + TEMPLATE_EXTENSION), os.listdir(TEMPLATE_DIR))))

    print('Building {} templates...'.format(len(template_list)))
    for filepath in template_list:
        print(filepath)
        template = jinja_env.get_template(filepath.name)
        out_path = OUT_DIR.joinpath(filepath.stem + '.html')
        print('   ', template, '->', out_path)
        out_html = template.render({'copyright_block': COPYRIGHT_BLOCK, 'serve': serve})
        with open(out_path, 'w') as fout:
            fout.write(out_html)

    print('  ...done')

async def register_browser(websocket):
    CONNECTIONS.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        CONNECTIONS.remove(websocket)

def autoreload():
    print('Refreshing browsers')
    websockets.broadcast(CONNECTIONS, 'Reload')

async def run_autoreload_server():
    async with websockets.serve(register_browser, SERVER_HOST, AUTORELOAD_PORT):
        print('Starting autoreload server on ws://{}:{}'.format(SERVER_HOST, AUTORELOAD_PORT))
        await asyncio.Future()  # run forever

def main():
    if 'help' in sys.argv:
        print('usage: python3 build_site.py <serve>')
        print('   ', 'serve: start a server for previewing changes and auto-reload')

    if not OUT_DIR.exists():
        OUT_DIR.mkdir()

    serve = 'serve' in sys.argv

    build_tailwind()
    resize_images()
    build_templates(serve)

    if serve:
        # simple server
        httpd = HTTPServer((SERVER_HOST, SERVER_PORT), SimpleHTTPRequestHandler)
        server_thread = threading.Thread(target = httpd.serve_forever, daemon=True)

        # watch the file system
        watchers = FileWatchers()
        watchers.start()


        print('Starting HTTP server at http://{}:{}, will rebuild whenever there\'s a change'.format(SERVER_HOST, SERVER_PORT))

        try:
            server_thread.start()
            asyncio.run(run_autoreload_server())
        except KeyboardInterrupt:
            print('Shutdown called')
            httpd.shutdown()
            print('Server shutdown')
            watchers.stop()
            watchers.join()
            print('Watchers stopped')

if __name__ == '__main__':
    main()