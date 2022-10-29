from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5 import Qt
import keyboard
import os

current_dir = os.path.dirname(__file__)
name = "Milo"
welcome_string = "Welcome, " + name + "!"
received_otp = "123456"

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
    self.stackedWidget.currentChanged.connect(lambda i: self.stackedWidget.widget(i).onActivate())
  
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


class Home(Fragment):

  def __init__(self) -> None:
    super().__init__("home")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background.png")))

    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(400, 30, 400, 51))
    font = QtGui.QFont()
    font.setPointSize(16)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(255, 255, 255);")
    self.label_2.setText("Press any key to start ...")
  
  def onKeyPress(self, key: str):
    Fragment.manager.activate("otp")


class OTP(Fragment):

  def __init__(self) -> None:
    super().__init__("otp")

    self.label_1 = QtWidgets.QLabel(self)
    self.label_1.setGeometry(QtCore.QRect(0, 0, 800, 480))
    self.label_1.setText("")
    self.label_1.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background.png")))
    
    self.label_2 = QtWidgets.QLabel(self)
    self.label_2.setGeometry(QtCore.QRect(400, 30, 400, 51))
    font = QtGui.QFont()
    font.setPointSize(16)
    self.label_2.setFont(font)
    self.label_2.setStyleSheet("color: rgb(255, 255, 255);")
    
    self.label_2.setText("Fill in your OTP please")
    self.label_2.setGeometry(QtCore.QRect(0, 0, 800, 150))
    self.label_2.setAlignment(QtCore.Qt.AlignCenter)

    labelPositions = [(40, 230), (160, 230), (280, 230), (420, 230), (540, 230), (660, 230)]

    self.labels = []
    for i in range(6):
      textlabel = QtWidgets.QLabel(self)
      textlabel.setGeometry(QtCore.QRect(labelPositions[i][0], labelPositions[i][1], 100, 100))
      textlabel.setAlignment(QtCore.Qt.AlignCenter)
      textlabel.setFont(font)

      self.labels.append(textlabel)
    
    self.otpCode = ""
  
  def resetLabel(self, label):
    label.setStyleSheet("color: rgb(85, 170, 127);"
                        "background-color: rgb(85, 170, 127);"
                        "border-top-left-radius :10px;"
                        "border-top-right-radius : 10px; "
                        "border-bottom-left-radius : 10px; "
                        "border-bottom-right-radius : 10px")
    label.setText("")
  
  def fillLabel(self, label, number):
    label.setStyleSheet("border: 5px solid rgb(85, 170, 127);"
                        "color: rgb(85, 170, 127);"
                        "border-top-left-radius :10px;"
                        "border-top-right-radius : 10px; "
                        "border-bottom-left-radius : 10px; "
                        "border-bottom-right-radius : 10px")
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
    self.textlabel.setGeometry(QtCore.QRect(0, 350, 800, 130))
    self.textlabel.setAlignment(QtCore.Qt.AlignCenter)
    font = QtGui.QFont()
    font.setPointSize(16)
    self.textlabel.setFont(font)
    self.textlabel.setStyleSheet("color: rgb(255, 255, 255);")
    self.textlabel.setText(welcome_string)
  
  def onActivate(self):
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

    home = Home() # must be defined first
    otp = OTP()
    verified = Verified()
    denied = Denied()

    Fragment.manager.start(800, 480)


if __name__ == "__main__":
    main()