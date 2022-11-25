from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5 import Qt
import os
import numpy as np
from picamera import PiCamera
from picamera.array import PiRGBArray
import RPi.GPIO as GPIO
import dlib
import requests

current_dir = os.path.dirname(__file__)
URL = "http://localhost:3000"


class KeyPad(QtCore.QThread):

  class Key:
    
    def __init__(self, code: str) -> None:
      self.code = code
      self.pressed = False

  keyPressed = QtCore.pyqtSignal(str)

  def __init__(self) -> None:
    super().__init__()
    
    self.row_pins = [25, 8, 7, 12]
    self.col_pins = [16, 20, 21]
    
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    for pin in self.col_pins:
        GPIO.setup(pin, GPIO.OUT)

    for pin in self.row_pins:
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    
    self.keys = [[self.Key('1'), self.Key('4'), self.Key('7'), self.Key('*')],
                 [self.Key('2'), self.Key('5'), self.Key('8'), self.Key('0')],
                 [self.Key('3'), self.Key('6'), self.Key('9'), self.Key('#')]]

  def run(self):
    while True:
      for col in range(3):
        GPIO.output(self.col_pins[col], GPIO.HIGH)
        for row in range(4):
          key = self.keys[col][row]
          if GPIO.input(self.row_pins[row]) == 1:
            if not key.pressed:
              key.pressed = True
              self.keyPressed.emit(key.code)
          elif key.pressed:
            key.pressed = False
              
        GPIO.output(self.col_pins[col], GPIO.LOW)
      self.msleep(10)


class FragmentManager:

  def __init__(self) -> None:
    self.app = QtWidgets.QApplication([])
    self.indices = {}
    self.stackedWidget = QtWidgets.QStackedWidget()
    self.stackedWidget.currentChanged.connect(lambda i: self.stackedWidget.widget(i).onActivate(), QtCore.Qt.QueuedConnection)
  
  def register(self, id, fragment):
    self.indices[id] = self.stackedWidget.addWidget(fragment)
  
  def activate(self, id, **kwargs):
    self.stackedWidget.widget(self.indices[id]).kwargs = kwargs
    self.stackedWidget.setCurrentIndex(self.indices[id])
  
  def start(self, width, height):
    self.stackedWidget.resize(width, height)
    self.stackedWidget.showFullScreen()

    keyPad = KeyPad()
    keyPad.keyPressed.connect(lambda key: self.stackedWidget.currentWidget().onKeyPress(key))
    keyPad.start()

    self.app.exec()


class Fragment(QtWidgets.QWidget):

  manager: FragmentManager = FragmentManager()

  def __init__(self, id: str) -> None:
    super().__init__()
    self.kwargs = {}
    Fragment.manager.register(id, self)

  def onActivate(self): # virtual method
    pass
  
  def onKeyPress(self, key: str): # virtual method
    pass


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
    font = QtGui.QFont("Roboto", 24)
    self.label_1.setFont(font)
    self.label_1.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_1.setText("Press any key to start ...")
    self.label_1.setAlignment(QtCore.Qt.AlignCenter)

  def onActivate(self):
    self.movie.start()
    self.movie.setPaused(True)
  
  def onKeyPress(self, key: str):
    self.movie.setPaused(False)


class FaceEncoder(QtCore.QObject):

  def __init__(self, ) -> None:
    super().__init__()
    self.detector = dlib.get_frontal_face_detector()
    self.predictor = dlib.shape_predictor(os.path.join(current_dir, 'shape_predictor_68_face_landmarks_GTX.dat'))
    self.model = dlib.face_recognition_model_v1(os.path.join(current_dir, 'dlib_face_recognition_resnet_model_v1.dat'))
  
  def detectFace(self, rgbImg: np.ndarray) -> dlib.rectangle:
    largestBb = None
    largestArea = 0
    for bb in self.detector(rgbImg, 1):
        area = bb.width() * bb.height()
        if area > largestArea:
            largestArea = area
            largestBb = bb
    return largestBb
  
  def calculateEmbedding(self, rgbImg: np.ndarray, bb: dlib.rectangle) -> np.ndarray:
    landmarks = self.predictor(rgbImg, bb)
    chip = dlib.get_face_chip(rgbImg, landmarks)
    embedding = self.model.compute_face_descriptor(chip)
    return np.asarray(embedding)

class Camera(QtCore.QObject):

  pixmap_available = QtCore.pyqtSignal(QtGui.QPixmap)
  start_loop = QtCore.pyqtSignal()
  exit_loop = QtCore.pyqtSignal()
  descriptor_available = QtCore.pyqtSignal(np.ndarray)

  def __init__(self, resolution=(320, 320)) -> None:
    super().__init__()
    
    self.running = False
    self.camera = PiCamera(resolution=resolution)
    self.faceEncoder = FaceEncoder()

    self.start_loop.connect(self.loop)
    self.exit_loop.connect(self.stop)
  
  def loop(self):
    self.running = True
    with PiRGBArray(self.camera) as output:
      while self.running:
        self.camera.capture(output, 'rgb')
        img = output.array
        height, width, channel = img.shape

        qImg = QtGui.QImage(img.data, width, height, QtGui.QImage.Format_RGB888)
        qPixmap = QtGui.QPixmap.fromImage(qImg)
        self.pixmap_available.emit(qPixmap)

        boundingBox = self.faceEncoder.detectFace(img)
        if boundingBox is not None:
          faceDescriptor = self.faceEncoder.calculateEmbedding(img, boundingBox)
          self.descriptor_available.emit(faceDescriptor)
          self.stop()

        output.truncate()
  
  def stop(self):
    self.running = False


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
    self.label_3.setGeometry(QtCore.QRect(240, 160, 320, 320))
    self.label_3.setScaledContents(True)

    self.camera = Camera()
    self.camera.pixmap_available.connect(self.label_3.setPixmap)
    self.camera.descriptor_available.connect(self.sendAccessRequest)

    self.thread = QtCore.QThread()
    self.camera.moveToThread(self.thread)
    self.thread.start()
  
  def sendAccessRequest(self, faceDescriptor):
    self.camera.exit_loop.emit()
    body = {"faceDescriptor": faceDescriptor.tolist(),
            "timestamp": "2022-11-09T10:09:26+01:00"} # TODO fix time
    r = requests.post(url=URL+"/access_face", json=body)
    msg = r.json()

    if msg["access"] == "GRANTED":
      Fragment.manager.activate("verified", name=msg["firstName"])
    elif msg["access"] == "ERROR":
      Fragment.manager.activate("error")
    else:
      Fragment.manager.activate("id")

  def onActivate(self):
    self.camera.start_loop.emit()


class ID(Fragment):

  def __init__(self) -> None:
    super().__init__("id")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background2-small.png")))
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 100, 800, 51))
    font = QtGui.QFont("Roboto", 24)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setText("Fill in your employee-ID please")
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    font2 = QtGui.QFont("Roboto", 36)

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
    if key == '#':
      if len(self.idCode) == 6:
        Fragment.manager.activate("otp", idCode=int(self.idCode))
      else:
        print("Fill in your employee-ID")
    elif key == '*':
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
    font = QtGui.QFont("Roboto", 36)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    self.label_3 = QtWidgets.QLabel(self)
    self.label_3.setGeometry(QtCore.QRect(0, 100, 800, 51))
    font2 = QtGui.QFont("Roboto", 24)
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

  def sendAccessRequest(self, id, otp):
    body = {"id": id,
            "otp": otp,
            "timestamp": "2022-11-09T10:09:26+01:00"} # TODO fix time
    r = requests.post(url=URL+"/access_otp", json=body)
    msg = r.json()

    if msg["access"] == "GRANTED":
      Fragment.manager.activate("verified", name=msg["firstName"])
    elif msg["access"] == "ERROR":
      Fragment.manager.activate("error")
    else:
      Fragment.manager.activate("denied")

  def onActivate(self):
    self.label_2.setText("Hello {}".format(self.kwargs["idCode"]))

    for label in self.labels:
      self.resetLabel(label)
    
    self.otpCode = ""
  
  def onKeyPress(self, key: str):
    if key == '#':
      if len(self.otpCode) == 6:
        self.sendAccessRequest(self.kwargs["idCode"], self.otpCode)
      else:
        print("Fill in your otp")
    elif key == '*':
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
    font = QtGui.QFont("Roboto", 30)
    self.textlabel.setFont(font)
    self.textlabel.setStyleSheet("color: rgb(255, 255, 255);")
  
  def onActivate(self):
    self.textlabel.setText("Welcome {}!".format(self.kwargs["name"]))
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
    self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "no_access.png")))
  
  def onActivate(self):
    QtCore.QTimer.singleShot(2000, lambda: Fragment.manager.activate("home"))


class Error(Fragment):

  def __init__(self) -> None:
    super().__init__("error")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setStyleSheet("background-color: rgb(208, 0, 0);")
    self.label_1.setText("")
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(250, 150, 300, 300))
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)
    self.label_2.setText("")
    self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "no_access.png")))
    self.label_2.setScaledContents(True)

    self.textlabel = QtWidgets.QLabel(self)
    self.textlabel.setGeometry(QtCore.QRect(0, 0, 800, 150))
    self.textlabel.setAlignment(QtCore.Qt.AlignCenter)
    font = QtGui.QFont("Roboto", 24)
    self.textlabel.setFont(font)
    self.textlabel.setStyleSheet("color: rgb(255, 255, 255);")
    self.textlabel.setText("Something went wrong, please contact the helpdesk.")  

  def onActivate(self):
    QtCore.QTimer.singleShot(5000, lambda: Fragment.manager.activate("home"))  


def main():

    QtGui.QFontDatabase.addApplicationFont(os.path.join(current_dir, "Roboto-Regular.ttf"))

    # splash = Splash() # must be defined first
    home = Home()
    face_recognition = FaceRecognition()
    id = ID()
    otp = OTP()
    verified = Verified()
    denied = Denied()
    error = Error()

    Fragment.manager.start(800, 480)


if __name__ == "__main__":
    main()