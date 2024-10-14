from flask import request, jsonify, Response, Blueprint
from flask_wtf.csrf import generate_csrf
import cv2

main_bp = Blueprint('main', __name__)

def gen_frames(url, user, password):
    cap = cv2.VideoCapture(f'rtsp://{user}:{password}@{url}')
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@main_bp.route('/')
def index():
    return "Hello, World!"

@main_bp.route('/get_csrf_token', methods=['GET'])
def get_csrf_token():
    token = generate_csrf()
    return jsonify({'csrf_token': token})

@main_bp.route('/data', methods=['POST'])
def data():
    data = request.get_json()
    return jsonify(data), 200

@main_bp.route('/video_feed')
def video_feed():
    url = request.args.get('url')
    user = request.args.get('user')
    password = request.args.get('password')
    return Response(gen_frames(url, user, password),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

