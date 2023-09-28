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

## Deploying the site

To avoid pushing the `build` folder directly to GitHub, I use a script to deploy to `gh-pages` branch instead. This script is from https://github.com/X1011/git-directory-deploy.

In a bash-like shell, run:

```
GIT_DEPLOY_DIR=./build ./deploy-gh-pages.sh
```