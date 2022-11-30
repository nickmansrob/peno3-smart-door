from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5 import Qt
import os
import numpy as np
import cv2
import keyboard
import dlib
import requests

current_dir = os.path.dirname(__file__)
"""name = "Milo"
welcome_string = "Welcome " + name + "!"
received_id = "000000"
received_otp = "123456"
recognised = False # temporary face recognition check"""

# URL = "https://styx.rndevelopment.be/api"
URL = "http://localhost:3000"


class KeyPad(QtCore.QThread):

  KEY_FORWARD = '+'
  KEY_BACKWARD = '-'

  class Key:
    
    def __init__(self, code) -> None:
      self.code = code
      self.pressed = False
  
  class KeyCombination:

    def __init__(self, keys) -> None:
      self.keys = keys
      self.code = ''.join([key.code for key in self.keys])
      self.pressed = False

  keyPressed = QtCore.pyqtSignal(str)

  def __init__(self) -> None:
    super().__init__()
    self.keys = [self.Key('0'), self.Key('1'), self.Key('2'), self.Key('3'), self.Key('4'), 
                 self.Key('5'), self.Key('6'), self.Key('7'), self.Key('8'), self.Key('9'), 
                 self.Key(self.KEY_BACKWARD), self.Key(self.KEY_FORWARD)]
    self.combinations = [self.KeyCombination([self.keys[10], self.keys[11]])]

  def run(self):
    self.double = False
    while True:
      for key in self.keys:
        if keyboard.is_pressed(key.code):
          if not key.pressed:
            key.pressed = True
            self.keyPressed.emit(key.code)
        elif key.pressed:
          key.pressed = False
      
      for combo in self.combinations:
        if all(key.pressed for key in combo.keys):
          if not combo.pressed:
            combo.pressed = True
            self.keyPressed.emit(combo.code)
        elif combo.pressed:
          combo.pressed = False
      
      self.msleep(5)


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
    self.stackedWidget.show()

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

    self.adminModeCombination = ''.join([KeyPad.KEY_BACKWARD, KeyPad.KEY_FORWARD])
    self.gotAdminModeCombination = False
    self.movie.finished.connect(lambda: Fragment.manager.activate("id", status="add_user") if self.gotAdminModeCombination else Fragment.manager.activate("face_recognition"))

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 30, 800, 51))
    font = QtGui.QFont("Roboto", 24)
    self.label_1.setFont(font)
    self.label_1.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_1.setText("Press any key to start ...")
    self.label_1.setAlignment(QtCore.Qt.AlignCenter)

  def onActivate(self):
    self.gotAdminModeCombination = False
    self.movie.start()
    self.movie.setPaused(True)
  
  def onKeyPress(self, key: str):
    self.movie.setPaused(False)
    if key == self.adminModeCombination:
      self.gotAdminModeCombination = True
      

class FaceEncoder(QtCore.QObject):

  def __init__(self, ) -> None:
    super().__init__()
    self.detector = dlib.get_frontal_face_detector()
    self.predictor = dlib.shape_predictor(os.path.join(current_dir, 'shape_predictor_68_face_landmarks_GTX.dat'))
    self.model = dlib.face_recognition_model_v1(os.path.join(current_dir, 'dlib_face_recognition_resnet_model_v1.dat'))
  
  def detectFace(self, rgbImg: np.ndarray) -> dlib.rectangle:
    boxes = self.detector(rgbImg, 1)
    largestBb = None
    largestArea = 0
    for bb in boxes:
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


class CameraSignals(QtCore.QObject):
  pixmap_available = QtCore.pyqtSignal(QtGui.QPixmap)
  descriptor_available = QtCore.pyqtSignal(np.ndarray)
  exit_loop = QtCore.pyqtSignal()

class Camera(QtCore.QRunnable):

  def __init__(self) -> None:
    super().__init__()
    
    self.running = False
    self.camera = cv2.VideoCapture(0)

    self.signals = CameraSignals()
    self.signals.exit_loop.connect(self.stop)

    self.faceEncoder = FaceEncoder()
  
  def run(self):
    self.running = True
    while self.running:
      return_value, img = self.camera.read()
      assert return_value == True

      img = cv2.flip(img, 1)
      img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
      height, width, channel = img.shape

      qImg = QtGui.QImage(img.data, width, height, QtGui.QImage.Format_RGB888)
      qPixmap = QtGui.QPixmap.fromImage(qImg)
      self.signals.pixmap_available.emit(qPixmap)

      boundingBox = self.faceEncoder.detectFace(img)
      if boundingBox is not None:
        faceDescriptor = self.faceEncoder.calculateEmbedding(img, boundingBox)
        self.signals.descriptor_available.emit(faceDescriptor)
        self.stop()
  
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
    self.label_3.setGeometry(QtCore.QRect(200, 120, 400, 300))
    self.label_3.setScaledContents(True)

    self.camera = Camera()
    self.camera.setAutoDelete(False)
    self.camera.signals.pixmap_available.connect(self.label_3.setPixmap)
    self.camera.signals.descriptor_available.connect(self.sendAccessRequest)
  
  def sendAccessRequest(self, faceDescriptor):
    self.camera.signals.exit_loop.emit()
    body = {"faceDescriptor": faceDescriptor.tolist()}
    r = requests.post(url=URL+"/access_face", json=body)

    print(r.status_code)
    if r.status_code in [200, 401]: 
      msg = r.json()
      print(msg)

      if msg["access"] == "GRANTED":
        Fragment.manager.activate("verified", name=msg["firstName"])
      elif msg["access"] == "ERROR":
        Fragment.manager.activate("error", message="Something went wrong, please contact the helpdesk.")
      elif msg["access"] == "RESTRICTED":
        Fragment.manager.activate("error", message="Access denied at the moment.")
      else:
        Fragment.manager.activate("id", status="normal")
    else:
      Fragment.manager.activate("error", message="Something went wrong, please contact the helpdesk.")

  def onActivate(self):
    QtCore.QThreadPool.globalInstance().tryStart(self.camera)


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
    if key == KeyPad.KEY_FORWARD:
      if len(self.idCode) == 6:
        Fragment.manager.activate("otp", idCode=int(self.idCode), status=self.kwargs["status"])
      else:
        print("Fill in your employee-ID")
    elif key == KeyPad.KEY_BACKWARD:
      if len(self.idCode) > 0:
        self.idCode = self.idCode[:-1]
        self.resetLabel(self.labels[len(self.idCode)])
    else:
      if len(self.idCode) == 6:
        print("Press \'+\' to continue")
      elif len(key) == 1:
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
            "otp": otp}
    r = requests.post(url=URL+"/access_otp", json=body)
    
    print(r.status_code)
    if r.status_code in [200, 401]:
      msg = r.json()
      print(msg)

      if msg["access"] == "GRANTED":
        Fragment.manager.activate("verified", name=msg["firstName"])
      elif msg["access"] == "ERROR":
        Fragment.manager.activate("error", message="Something went wrong, please contact the helpdesk.")
      elif msg["access"] == "RESTRICTED":
        Fragment.manager.activate("error", message="Access denied at the moment.")
      else:
        Fragment.manager.activate("error", message="Access denied.")
    else:
      Fragment.manager.activate("error", message="Something went wrong, please contact the helpdesk.")

  def onActivate(self):
    self.label_2.setText("Hello {}".format(self.kwargs["idCode"]))

    for label in self.labels:
      self.resetLabel(label)
    
    self.otpCode = ""
  
  def onKeyPress(self, key: str):
    if key == KeyPad.KEY_FORWARD:
      if len(self.otpCode) == 6:
        if self.kwargs["status"] == "normal":
          self.sendAccessRequest(self.kwargs["idCode"], self.otpCode)
        elif self.kwargs["status"] == "add_user":
          print("Not yet implemented")
          pass
      else:
        print("Fill in your otp")
    elif key == KeyPad.KEY_BACKWARD:
      if len(self.otpCode) > 0:
        self.otpCode = self.otpCode[:-1]
        self.resetLabel(self.labels[len(self.otpCode)])
    else:
      if len(self.otpCode) == 6:
        print("Press \'+\' to continue")
      elif len(key) == 1:
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

  def onActivate(self):
    self.textlabel.setText(self.kwargs["message"])
    QtCore.QTimer.singleShot(5000, lambda: Fragment.manager.activate("home"))  


class AddUser(Fragment):

  def __init__(self) -> None:
    super().__init__("add_user")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background2-small.png")))

    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(0, 100, 800, 51))
    font = QtGui.QFont("Roboto", 24)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(231, 242, 255);")
    self.label_2.setText("Stand in front of the camera and press # to register.")
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

  def onActivate(self):
    QtCore.QTimer.singleShot(2000, lambda: Fragment.manager.activate("home")) # temporary


def main():

    QtGui.QFontDatabase.addApplicationFont(os.path.join(current_dir, "Roboto-Regular.ttf"))

    # splash = Splash() # must be defined first
    home = Home()
    face_recognition = FaceRecognition()
    id = ID()
    otp = OTP()
    verified = Verified()
    error = Error()
    add_user = AddUser()

    Fragment.manager.start(800, 480)


if __name__ == "__main__":
    main()