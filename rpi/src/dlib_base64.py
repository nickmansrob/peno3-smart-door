import dlib
import numpy as np
import os
import sys

current_dir = os.path.dirname(__file__)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.join(current_dir, 'shape_predictor_68_face_landmarks_GTX.dat'))
model = dlib.face_recognition_model_v1(os.path.join(current_dir, 'dlib_face_recognition_resnet_model_v1.dat'))

def getLargestBoundingBox(boxes: dlib.rectangles):
    largestBb = None
    largestArea = 0
    for bb in boxes:
        area = bb.width() * bb.height()
        if area > largestArea:
            largestArea = area
            largestBb = bb
    return largestBb

def calculateEmbedding(rgbImg: np.ndarray, bb: dlib.rectangle):
    landmarks = predictor(rgbImg, bb)
    chip = dlib.get_face_chip(rgbImg, landmarks)
    embedding = model.compute_face_descriptor(chip)
    return np.asarray(embedding).tolist()

s = sys.stdin.read()
r = np.base64.decodebytes(s)
img = np.frombuffer(r, dtype=np.uint8)

largestBoundingBox = getLargestBoundingBox(detector(img, 1))
if largestBoundingBox is not None:
    faceDescriptor = calculateEmbedding(img, largestBoundingBox)
