import functools
import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "honlap")


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        if not path.split("?")[0].endswith("/") and os.path.isfile(local + ".html"):
            return local + ".html"
        return local


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
handler = functools.partial(Handler, directory=ROOT)
print(f"http://localhost:{port}/")
http.server.ThreadingHTTPServer(("", port), handler).serve_forever()
