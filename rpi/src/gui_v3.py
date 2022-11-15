from PyQt5 import QtCore, QtGui, QtWidgets, Qt
import keyboard
import os
import cv2
import dlib
import numpy as np
import requests
import uuid
import pyotp
import datetime
import pytz

current_dir = os.path.dirname(__file__)
name = ""
welcome_string = ""
received_id = "000000"
received_otp = "123456"
recognised = False # temporary face recognition check

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.join(current_dir, 'shape_predictor_68_face_landmarks_GTX.dat'))
model = dlib.face_recognition_model_v1(os.path.join(current_dir, 'dlib_face_recognition_resnet_model_v1.dat'))

camera = cv2.VideoCapture(0)

URL = "http://localhost:3000"

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

class KeyPad(QtCore.QThread):

  class Key:
    
    def __init__(self, code: str) -> None:
      self.code = code
      self.pressed = False

  keyPressed = QtCore.pyqtSignal(str)

  def __init__(self) -> None:
    super().__init__()
    self.keys = [self.Key('0'), self.Key('1'), self.Key('2'), 
                 self.Key('3'), self.Key('4'), self.Key('5'), 
                 self.Key('6'), self.Key('7'), self.Key('8'),
                 self.Key('9'), self.Key('+'), self.Key('-')]

  def run(self):
    while True:
      for key in self.keys:
        if keyboard.is_pressed(key.code): # replace with keypad specific check
          if not key.pressed:
            key.pressed = True
            self.keyPressed.emit(key.code)
        elif key.pressed:
          key.pressed = False
      self.msleep(5)


class FragmentManager:

  def __init__(self) -> None:
    self.app = QtWidgets.QApplication([])
    self.indices = {}
    self.stackedWidget = QtWidgets.QStackedWidget()
    self.stackedWidget.currentChanged.connect(lambda i: self.stackedWidget.widget(i).onActivate(), QtCore.Qt.QueuedConnection)
  
  def register(self, id, fragment):
    self.indices[id] = self.stackedWidget.addWidget(fragment)
  
  def activate(self, id):
    self.stackedWidget.setCurrentIndex(self.indices[id])
  
  def start(self, width, height):
    self.stackedWidget.resize(width, height)
    self.stackedWidget.show()

    keyPad = KeyPad()
    keyPad.keyPressed.connect(lambda key: self.stackedWidget.currentWidget().onKeyPress(key))
    keyPad.start()

    self.app.exec()


class Fragment(QtWidgets.QWidget):

  manager: FragmentManager = FragmentManager()

  def __init__(self, id: str) -> None:
    super().__init__()
    Fragment.manager.register(id, self)

  def onActivate(self): # virtual method
    pass
  
  def onKeyPress(self, key: str): # virtual method
    pass

"""
class Splash(Fragment):

  def __init__(self) -> None:
    super().__init__("splash")

    self.giflabel = QtWidgets.QLabel(self)
    self.giflabel.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.giflabel.setMinimumSize(QtCore.QSize(800, 480))
    self.giflabel.setMaximumSize(QtCore.QSize(800, 480))
    self.movie = QtGui.QMovie(os.path.join(current_dir, "logo-splash-small-noloop.gif"))
    self.movie.finished.connect(lambda: Fragment.manager.activate("home"))
    self.giflabel.setMovie(self.movie)
  
  def onActivate(self):
    self.movie.start()
"""


class Home(Fragment):

  def __init__(self) -> None:
    super().__init__("home")

    self.giflabel = QtWidgets.QLabel(self)
    self.giflabel.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.giflabel.setAlignment(QtCore.Qt.AlignCenter)
    self.movie = QtGui.QMovie(os.path.join(current_dir, "logo-outro-small-noloop.gif"))
    self.giflabel.setMovie(self.movie)
    self.movie.finished.connect(lambda: Fragment.manager.activate("face_recognition"))

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 30, 800, 51))
    font = QtGui.QFont("Roboto", 16)
    self.label_1.setFont(font)
    self.label_1.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_1.setText("Press any key to start ...")
    self.label_1.setAlignment(QtCore.Qt.AlignCenter)

  def onActivate(self):
    self.movie.start()
    self.movie.setPaused(True)
  
  def onKeyPress(self, key: str):
    self.movie.setPaused(False)


class Signals(QtCore.QObject):
  image_ready = QtCore.pyqtSignal(QtGui.QImage)
  exit_loop = QtCore.pyqtSignal()
  access_response = QtCore.pyqtSignal(bool, str)

class CameraReader(QtCore.QRunnable):

  def __init__(self) -> None:
    super().__init__()
    self.signals = Signals()
    self.running = True
    self.signals.exit_loop.connect(self._exit)

  def _exit(self):
    self.running = False

  def run(self):
    while self.running:
      return_value, image = camera.read()
      assert return_value == True

      image = cv2.resize(image, (256, 192), interpolation=cv2.INTER_LINEAR)
      image = cv2.flip(image, 1)
      rgbImg = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

      height, width, channel = rgbImg.shape
      bytesPerLine = 3 * width
      qImg = QtGui.QImage(rgbImg.data, width, height, bytesPerLine, QtGui.QImage.Format_RGB888)
      
      self.signals.image_ready.emit(qImg)

      largestBoundingBox = getLargestBoundingBox(detector(rgbImg, 1))
    
      if largestBoundingBox is not None:
        faceDescriptor = embedding = calculateEmbedding(rgbImg, largestBoundingBox)
        timestamp = str(datetime.datetime.now(pytz.timezone('Europe/Brussels')))

        body = {"faceDescriptor": faceDescriptor,
                "timestamp": timestamp}
        
        r = requests.post(url=URL+'/access_face', json=body)
        msg = r.json()
        self.signals.access_response.emit(msg['access'] == 'GRANTED', msg['firstName'])
        break


class FaceRecognition(Fragment):

  def __init__(self) -> None:
    super().__init__("face_recognition")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background2-small.png")))

    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 30, 800, 51))
    font = QtGui.QFont("Roboto", 16)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setText("Please stand in front of the camera")
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    self.label_3 = QtWidgets.QLabel(self)
    self.label_3.setGeometry(QtCore.QRect(200, 120, 400, 300))
    self.label_3.setScaledContents(True)

  def handleAccessRepsonse(self, canEnter, firstName):
    self.cameraRunnable.signals.exit_loop.emit()
    if canEnter:
      global welcome_string
      welcome_string = "Welcome " + firstName
      Fragment.manager.activate("verified")
    else:
      Fragment.manager.activate("id")

  def onActivate(self):
    self.cameraRunnable = CameraReader()
    self.cameraRunnable.signals.image_ready.connect(lambda img: self.label_3.setPixmap(QtGui.QPixmap(img)))
    self.cameraRunnable.signals.access_response.connect(self.handleAccessRepsonse)
    QtCore.QThreadPool.globalInstance().start(self.cameraRunnable)


class ID(Fragment):

  def __init__(self) -> None:
    super().__init__("id")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background2-small.png")))
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 100, 800, 51))
    font = QtGui.QFont("Roboto", 16)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setText("Fill in your employee-ID please")
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    font2 = QtGui.QFont("Roboto", 24)

    labelPositions = [(44, 250), (163, 250), (282, 250), (422, 250), (541, 250), (660, 250)]

    self.labels = []
    for i in range(6):
      textlabel = QtWidgets.QLabel(self)
      textlabel.setGeometry(QtCore.QRect(labelPositions[i][0], labelPositions[i][1], 96, 96))
      textlabel.setAlignment(QtCore.Qt.AlignCenter)
      textlabel.setFont(font2)

      self.labels.append(textlabel)
    
    self.idCode = ""
  
  def resetLabel(self, label):
    label.setStyleSheet("background-color: rgb(84, 165, 124);"
                        "border-top-left-radius :9px;"
                        "border-top-right-radius : 9px; "
                        "border-bottom-left-radius : 9px; "
                        "border-bottom-right-radius : 9px")
    label.setText("")
  
  def fillLabel(self, label, number):
    label.setStyleSheet("border: 4px solid rgb(84, 165, 124);"
                        "color: rgb(157, 206, 191);"
                        "border-top-left-radius :9px;"
                        "border-top-right-radius : 9px; "
                        "border-bottom-left-radius : 9px; "
                        "border-bottom-right-radius : 9px")
    label.setText(number)

  def onActivate(self):
    for label in self.labels:
      self.resetLabel(label)
    
    self.idCode = ""
  
  def onKeyPress(self, key: str):
    if key == '+':
      if len(self.idCode) == 6:
        if self.idCode == received_id: # replace with backend check
          Fragment.manager.activate("otp")
        else:
          Fragment.manager.activate("denied")
      else:
        print("Fill in your employee-ID")
    elif key == '-':
      if len(self.idCode) > 0:
        self.idCode = self.idCode[:-1]
        self.resetLabel(self.labels[len(self.idCode)])
    else:
      if len(self.idCode) == 6:
        print("Press \'+\' to continue")
      else:
        self.fillLabel(self.labels[len(self.idCode)], key)
        self.idCode += key


class OTP(Fragment):

  def __init__(self) -> None:
    super().__init__("otp")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background2-small.png")))
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 50, 800, 51))
    font = QtGui.QFont("Roboto", 24)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setText("Hello {}".format(name))
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    self.label_3 = QtWidgets.QLabel(self)
    self.label_3.setGeometry(QtCore.QRect(0, 100, 800, 51))
    font2 = QtGui.QFont("Roboto", 16)
    self.label_3.setFont(font2)
    self.label_3.setStyleSheet("color: rgb(162, 198, 234);")
    self.label_3.setText("Enter the 6-digit code from your authenticator app")
    self.label_3.setAlignment(QtCore.Qt.AlignCenter)

    labelPositions = [(44, 250), (163, 250), (282, 250), (422, 250), (541, 250), (660, 250)]

    self.labels = []
    for i in range(6):
      textlabel = QtWidgets.QLabel(self)
      textlabel.setGeometry(QtCore.QRect(labelPositions[i][0], labelPositions[i][1], 96, 96))
      textlabel.setAlignment(QtCore.Qt.AlignCenter)
      textlabel.setFont(font)

      self.labels.append(textlabel)
    
    self.otpCode = ""
  
  def resetLabel(self, label):
    label.setStyleSheet("background-color: rgb(84, 165, 124);"
                        "border-top-left-radius :9px;"
                        "border-top-right-radius : 9px; "
                        "border-bottom-left-radius : 9px; "
                        "border-bottom-right-radius : 9px")
    label.setText("")
  
  def fillLabel(self, label, number):
    label.setStyleSheet("border: 4px solid rgb(84, 165, 124);"
                        "color: rgb(157, 206, 191);"
                        "border-top-left-radius :9px;"
                        "border-top-right-radius : 9px; "
                        "border-bottom-left-radius : 9px; "
                        "border-bottom-right-radius : 9px")
    label.setText(number)

  def onActivate(self):
    for label in self.labels:
      self.resetLabel(label)
    
    self.otpCode = ""
  
  def onKeyPress(self, key: str):
    if key == '+':
      if len(self.otpCode) == 6:
        if self.otpCode == received_otp: # replace with backend check
          Fragment.manager.activate("verified")
        else:
          Fragment.manager.activate("denied")
      else:
        print("Fill in your otp")
    elif key == '-':
      if len(self.otpCode) > 0:
        self.otpCode = self.otpCode[:-1]
        self.resetLabel(self.labels[len(self.otpCode)])
    else:
      if len(self.otpCode) == 6:
        print("Press \'+\' to continue")
      else:
        self.fillLabel(self.labels[len(self.otpCode)], key)
        self.otpCode += key
      

class Verified(Fragment):

  def __init__(self) -> None:
    super().__init__("verified")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setAutoFillBackground(False)
    self.label_1.setStyleSheet("background-color: rgb(0, 170, 0);")
    self.label_1.setText("")
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 50, 800, 300))
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)
    self.label_2.setText("")
    self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "verified.png")))
    
    self.textlabel = QtWidgets.QLabel(self)
    self.textlabel.setGeometry(QtCore.QRect(0, 330, 800, 130))
    self.textlabel.setAlignment(QtCore.Qt.AlignCenter)
    font = QtGui.QFont("Roboto", 20)
    self.textlabel.setFont(font)
    self.textlabel.setStyleSheet("color: rgb(255, 255, 255);")
  
  def onActivate(self):
    self.textlabel.setText(welcome_string)
    QtCore.QTimer.singleShot(2000, lambda: Fragment.manager.activate("home"))


class Denied(Fragment):

  def __init__(self) -> None:
    super().__init__("denied")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setStyleSheet("background-color: rgb(208, 0, 0);")
    self.label_1.setText("")
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)
    self.label_2.setText("")
    self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "no_access.webp")))
  
  def onActivate(self):
    QtCore.QTimer.singleShot(2000, lambda: Fragment.manager.activate("home"))


def main():

    QtGui.QFontDatabase.addApplicationFont(os.path.join(current_dir, "Roboto-Regular.ttf")) # fontname: ' oboto'

    # splash = Splash() # must be defined first
    home = Home()
    face_recognition = FaceRecognition()
    id = ID()
    otp = OTP()
    verified = Verified()
    denied = Denied()

    Fragment.manager.start(800, 480)


if __name__ == "__main__":
    main()