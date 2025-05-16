import sys
import json
import cv2
import numpy as np
import time
from deepface import DeepFace

# Config
PROTOTXT = './deploy.prototxt'
MODEL = './res10_300x300_ssd_iter_140000_fp16.caffemodel'
DB_EMBED_PATH = './db_embeddings.npy'
DB_LABELS_PATH = './db_labels.json'
THRESHOLD = 10       # Euclidean threshold for recognition
SKIP_FRAMES = 10      # process one of every SKIP_FRAMES
DELAY_AFTER_MATCH = 5  # seconds to wait after match before exit

# Read target user ID passed from Node.js
target_user_id = sys.argv[1] if len(sys.argv) > 1 else None

# Load database embeddings and labels
try:
    db_emb = np.load(DB_EMBED_PATH)
    with open(DB_LABELS_PATH, 'r') as f:
        db_labels = json.load(f)
except Exception as e:
    print(json.dumps({"error": f"Cannot load database: {e}"}))
    sys.exit(1)

# Load DNN face detector
net = cv2.dnn.readNetFromCaffe(PROTOTXT, MODEL)

# Recognition from camera with frame skipping
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print(json.dumps({"error": "Cannot open camera"}))
    sys.exit(1)

frame_count = 0
last_user_id = 'Unknown'
last_dist = None
box = None
# Track when recognition match first occurred
t_match_start = None
check = False

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % SKIP_FRAMES == 0:
        # Face detection
        h, w = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                     (300, 300), (104.0, 177.0, 123.0),
                                     swapRB=False, crop=False)
        net.setInput(blob)
        detections = net.forward()

        if detections.shape[2] > 0:
            # Assume first detection
            x1, y1, x2, y2 = (detections[0, 0, 0, 3:7] * np.array([w, h, w, h])).astype(int)
            face = frame[max(0,y1):min(h,y2), max(0,x1):min(w,x2)]
            try:
                reps = DeepFace.represent(
                    img_path=face,
                    model_name='ArcFace',
                    detector_backend='opencv',
                    enforce_detection=False
                )
                if reps:
                    emb = np.array(reps[0]['embedding'])
                    dists = np.linalg.norm(db_emb - emb, axis=1)
                    idx = int(np.argmin(dists))
                    best = float(dists[idx])
                    if best < THRESHOLD:
                        last_user_id = db_labels[idx]
                        last_dist = best
                    else:
                        last_user_id = 'Unknown'
                        last_dist = best
            except Exception:
                last_user_id = 'Unknown'
                last_dist = None

            # On first match, record the time
            if target_user_id and last_user_id == target_user_id:
                if t_match_start is None:
                    t_match_start = time.time()
                    check = True

        # After detection, if match occurred and delay passed, exit loop
        if t_match_start is not None and (time.time() - t_match_start) >= DELAY_AFTER_MATCH:
            break

    # Draw bounding box if available
    if box:
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

    cv2.imshow('DeepFace Recognition', frame)
    key = cv2.waitKey(1) & 0xFF
    # Exit on 'q' or window close
    if key == ord('q') or cv2.getWindowProperty('DeepFace Recognition', cv2.WND_PROP_VISIBLE) < 1:
        # user closed window
        last_user_id = None
        break

# Cleanup and output
cap.release()
cv2.destroyAllWindows()
last_user_id = target_user_id if check else None
output = {"userID": last_user_id}
if last_dist is not None:
    output["dist"] = last_dist
print(json.dumps(output), flush=True)
