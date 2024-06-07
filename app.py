from flask import Flask, request, send_from_directory, render_template
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/receive_image', methods=['POST'])
def receive_image():
    if 'image' in request.files:
        file = request.files['image']
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'imagen.jpg')
        file.save(file_path)
        return 'Image received successfully!'
    return 'No image found', 400

@app.route('/get_image')
def get_image():
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'imagen.jpg')
    if os.path.exists(image_path):
        return send_from_directory(app.config['UPLOAD_FOLDER'], 'imagen.jpg')
    return 'No image found', 404

if __name__ == '__main__':
    app.run(debug=True)

