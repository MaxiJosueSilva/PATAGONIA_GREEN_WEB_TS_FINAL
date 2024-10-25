from flask import request, jsonify, Response, Blueprint
from flask_wtf.csrf import generate_csrf
import cv2
import time

main_bp = Blueprint('main', __name__)

def gen_frames(url, user, password, resolution=(640, 360), quality=50):
    cap = cv2.VideoCapture(f'rtsp://{user}:{password}@{url}')
    start_time = time.time()
    try:
        while True:
            success, frame = cap.read()
            if not success:
                break

            # Reducir la resolución del frame
            frame = cv2.resize(frame, resolution)

            # Codificar el frame en JPEG con la calidad ajustada
            ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
            frame = buffer.tobytes()

            # Enviar frame al cliente
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # Limitar la duración del stream a 30 segundos
            if time.time() - start_time > 30:
                break

            # Liberar recursos de los frames antiguos
            del frame
            del buffer
    finally:
        # Asegurarse de liberar la captura de video al final
        cap.release()

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
