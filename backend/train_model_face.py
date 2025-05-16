import sys
import json
import base64
import cv2
import numpy as np
from deepface import DeepFace

# Load DNN face detector
prototxt = './deploy.prototxt'
model = './res10_300x300_ssd_iter_140000_fp16.caffemodel'
dnn_net = cv2.dnn.readNetFromCaffe(prototxt, model)

# Face detection via DNN
def detect_faces_dnn(img):
    h, w = img.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))
    dnn_net.setInput(blob)
    detections = dnn_net.forward()
    boxes = []
    for i in range(detections.shape[2]):
        conf = detections[0, 0, i, 2]
        if conf > 0.6:
            box = (detections[0, 0, i, 3:7] * np.array([w, h, w, h])).astype(int)
            x1, y1, x2, y2 = box
            boxes.append((x1, y1, x2-x1, y2-y1))
    return boxes

# Read JSON payload from stdin
raw = sys.stdin.read()
data = json.loads(raw)

embeddings = []
labels = []

for entry in data:
    uid = entry['userID']
    for img_info in entry['images']:
        b64 = img_info.get('base64')
        if not b64:
            continue
        arr = np.frombuffer(base64.b64decode(b64), dtype=np.uint8)
        mat = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if mat is None:
            print(f"[WARN] Cannot decode image for user {uid}", file=sys.stderr)
            continue

        faces = detect_faces_dnn(mat)
        if not faces:
            print(f"[DEBUG] No face detected for user {uid}", file=sys.stderr)
            continue

        x, y, w, h = faces[0]
        face_bgr = mat[y:y+h, x:x+w]
        face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)

        try:
            reps = DeepFace.represent(
                img_path=face_rgb,
                model_name='ArcFace',
                detector_backend='opencv',
                enforce_detection=False
            )
        except Exception as e:
            print(f"[ERROR] DeepFace error for user {uid}: {e}", file=sys.stderr)
            continue

        if reps and 'embedding' in reps[0]:
            embeddings.append(reps[0]['embedding'])
            labels.append(uid)
        else:
            print(f"[DEBUG] Empty embedding for user {uid}", file=sys.stderr)

# Validate embeddings
if not embeddings:
    print("Error: No embeddings extracted!", file=sys.stderr)
    sys.exit(1)

# Save embeddings and labels
embeddings = np.vstack(embeddings)
np.save('db_embeddings.npy', embeddings)
with open('db_labels.json', 'w') as f:
    json.dump(labels, f)

print('Training complete. Embeddings and labels saved.')
