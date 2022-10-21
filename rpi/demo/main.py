import cv2
import time
import dlib
import numpy as np
import os
import requests
import uuid
import pyotp
import datetime
import pytz
import json

current_dir = os.path.dirname(__file__)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.join(current_dir, 'shape_predictor_68_face_landmarks_GTX.dat'))
model = dlib.face_recognition_model_v1(os.path.join(current_dir, 'dlib_face_recognition_resnet_model_v1.dat'))

camera = cv2.VideoCapture(0)

windowName = "Test"
cv2.namedWindow(windowName)

DLIB_ESC = 27
DLIB_ZERO = 48
DLIB_PLUS = 43

URL = "http://localhost:3000"

names = [('Rob', 'Nickmans'), ('Milo', 'Roggen'), ('Martijn', 'Spaepen'), ('Robin', 'Vandenhoeck'), ('Kevin', 'Maes'), ('Wouter', 'Strobbe')]

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

while True:
    return_value, image = camera.read()
    assert return_value == True

    image = cv2.flip(image, 1)
    rgbImg = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    largestBoundingBox = getLargestBoundingBox(detector(rgbImg, 1))
    
    if largestBoundingBox is not None:
        cv2.rectangle(image, (largestBoundingBox.left(), largestBoundingBox.top()), (largestBoundingBox.right(), largestBoundingBox.bottom()), (255,0,0), 2)

    keyCode = cv2.waitKey(1)
    if keyCode == DLIB_ESC:
        break
    elif keyCode == DLIB_PLUS:
        if largestBoundingBox is None:
            print('Could not find a face, please try again')
        else:
            faceToken = embedding = calculateEmbedding(rgbImg, largestBoundingBox)
            timestamp = str(datetime.datetime.now(pytz.timezone('Europe/Brussels')))

            body = {"faceToken": faceToken,
                    "timestamp": timestamp}
            
            r = requests.post(url=URL+'/access_face', json=body)
            print(r)
            print(r.json())

    elif keyCode >= DLIB_ZERO and keyCode < (DLIB_ZERO + 6):
        if largestBoundingBox is None:
            print('Could not find a face, please try again')
        else:
            id = str(uuid.uuid1())
            name = names[keyCode - DLIB_ZERO]
            faceToken = calculateEmbedding(rgbImg, largestBoundingBox)
            tfaToken = pyotp.random_base32()
            roles = ["DUMMY"]
            dateCreated = str(datetime.datetime.now(pytz.timezone('Europe/Brussels')))

            body = {'id': id,
                        'firstName': name[0],
                        'lastName': name[1],
                        'faceToken': faceToken,
                        'tfaToken': tfaToken,
                        'roles': roles,
                        'dateCreated': dateCreated}

            r = requests.post(url=URL+'/users', json=body)
            print(r)


    cv2.imshow(windowName, image)

cv2.destroyAllWindows()

exit()
