from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class VideoHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path.endswith('.mp4'):
                file_path = os.path.join(os.getcwd(), self.path.lstrip('/'))
                if not os.path.exists(file_path):
                    self.send_error(404, "Video file not found")
                    return
                
                self.send_response(200)
                self.send_header('Content-type', 'video/mp4')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                
                with open(file_path, 'rb') as file:
                    self.wfile.write(file.read())
                return
            return SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            print(f"Error serving video: {e}")
            self.send_error(500, str(e))

httpd = HTTPServer(('localhost', 8000), VideoHandler)
print("Server started at http://localhost:8000")
httpd.serve_forever()
