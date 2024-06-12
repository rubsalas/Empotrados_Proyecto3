import http.server
import socketserver
import json
import os
import subprocess
import time

PORT = 8888
IP_ADDRESS = "192.168.50.180"
FILENAME = "current_time.txt"
IMAGE_DIR = "images"
IMAGE_FILE = os.path.join(IMAGE_DIR, "capture.jpg")
IMAGE_URL_FILE = "image_url.txt"
CAMERA_DEVICE = "/dev/video2"
IMGUR_UPLOAD_COMMAND = "curl -s -H 'Authorization: Client-ID b50f7ce78eda865' -F 'image=@%s' https://api.imgur.com/3/image"

last_image_url = ""

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/time":
            self.handle_time_request()
        elif self.path == "/sensor":
            self.handle_sensor_request()
        elif self.path == "/picture":
            self.handle_picture_request()
        else:
            self.send_response(405)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Only GET to /time, /sensor, /picture and POST to /sensor, /picture is supported.")

    def do_POST(self):
        if self.path == "/sensor":
            self.handle_sensor_post_request()
        elif self.path == "/picture":
            self.handle_picture_post_request()
        else:
            self.send_response(405)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Only GET to /time, /sensor, /picture and POST to /sensor, /picture is supported.")

    def handle_time_request(self):
        now = time.time()
        time_str = time.ctime(now)
        time_str = time_str.rstrip("\n")

        print(f"Current time: {time_str}")

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(time_str.encode())

    def handle_sensor_request(self):
        try:
            with open(FILENAME, "r") as file:
                file_content = file.read().strip()
        except FileNotFoundError:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Failed to open file.")
            return

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(file_content.encode())

    def handle_picture_request(self):
        global last_image_url
        try:
            with open(IMAGE_URL_FILE, "r") as file:
                last_image_url = file.read().strip()
        except FileNotFoundError:
            pass

        json_response = json.dumps({"link": last_image_url})

        print(f"Returning last uploaded image URL: {last_image_url}")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json_response.encode())

    def handle_sensor_post_request(self):
        now = time.time()
        time_str = time.ctime(now)
        time_str = time_str.rstrip("\n")

        try:
            with open(FILENAME, "w") as file:
                file.write(time_str)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Failed to open file.")
            return

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Time written to file successfully.")

    def handle_picture_post_request(self):
        global last_image_url
        if not os.path.exists(IMAGE_DIR):
            try:
                os.makedirs(IMAGE_DIR)
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(b"Failed to create image directory.")
                return

        print("Capturing image")
        capture_command = f"fswebcam -d {CAMERA_DEVICE} -r 640x480 --jpeg 85 -D 1 {IMAGE_FILE}"
        system_ret = subprocess.call(capture_command, shell=True)
        if system_ret != 0:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Failed to capture image.")
            return
        print("Image captured")

        upload_command = IMGUR_UPLOAD_COMMAND % IMAGE_FILE
        try:
            upload_response = subprocess.check_output(upload_command, shell=True)
        except subprocess.CalledProcessError as e:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Failed to upload image to Imgur.")
            return

        try:
            upload_response = upload_response.decode()
            image_url_start = upload_response.find("\"link\":\"") + len("\"link\":\"")
            image_url_end = upload_response.find("\"", image_url_start)
            last_image_url = upload_response[image_url_start:image_url_end]
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Failed to parse Imgur response.")
            return

        with open(IMAGE_URL_FILE, "w") as url_file:
            url_file.write(last_image_url)

        json_response = json.dumps({"link": last_image_url})

        print(f"Image uploaded to Imgur: {last_image_url}")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json_response.encode())

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Server is running on {IP_ADDRESS}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

