# Bridger Herman Personal Site

## Prerequisites

To build the site, first install requirements:

Install Python 3 (>= 3.8 preferred)

Install Python packages:
- websockets
- Pillow
- Jinja2
- watchdog


[Download Tailwind CSS standalone CLI](https://tailwindcss.com/blog/standalone-cli) and ensure it's somewhere on PATH.


## Building the site


```
python3 build_site.py
```

and optionally, serve locally on <http://localhost:8000> to preview changes (with auto-reload server):

```
python3 build_site.py serve
```