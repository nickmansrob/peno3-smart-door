import sys
from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5 import Qt
from PyQt5.QtCore import *
import keyboard
import os

current_dir = os.path.dirname(__file__)

authorize = False
ui_window = "main"
name = "Milo"
welcome_string = "Welcome, " + name + "!"
received_otp = "123456"
users_otp = None

class Worker(QObject):

    finished = pyqtSignal()
    finished_code = pyqtSignal(str)

    def __init__(self, parent=None):
        QObject.__init__(self, parent=parent)
        self.continue_run = True  # provide a bool run condition for the class

    def do_work(self):
        global ui_window
        if ui_window == "main":
            pressed = False
            while not pressed:
                if keyboard.is_pressed("a"):
                    print("a pressed")
                    pressed = True
                    ui_window = "OTP"
        elif ui_window == "OTP":
            i = 0
            global number
            for i in range(6):
                """self.code = input("OTP {}: ".format(i))
                self.finished_code.emit(self.code)"""
                number = input("OTP {}: ".format(i))
                self.finished_code.emit(number)
        self.finished.emit()  # emit the finished signal when the loop is done

    def stop(self):
        self.continue_run = False  # set the run condition to false on stop

class Home(object):

    def __init__(self):
        super().__init__()
        self.Dialog = QtWidgets.QDialog()
        self.setupUi(self.Dialog)
        self.Dialog.show()

    def setupUi(self, Dialog):
        # GUI design:
        Dialog.setObjectName("Dialog")
        Dialog.resize(800, 480)
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(0, 0, 800, 480))
        self.label.setText("")
        self.label.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background.png")))
        self.label.setObjectName("label")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(400, 30, 400, 51))
        font = QtGui.QFont()
        font.setPointSize(16)
        self.label_2.setFont(font)
        self.label_2.setStyleSheet("color: rgb(255, 255, 255);")
        self.label_2.setObjectName("label_2")
        self.label_2.setText("Press any key to start ...")
        
        QtCore.QMetaObject.connectSlotsByName(Dialog)
        
        # Thread:
        self.thread = QThread()
        self.worker = Worker()
        self.worker.moveToThread(self.thread)

        self.worker.finished.connect(self.thread.quit)  # connect the workers finished signal to stop thread
        self.worker.finished.connect(self.worker.deleteLater)  # connect the workers finished signal to clean up worker
        self.thread.finished.connect(self.thread.deleteLater)  # connect threads finished signal to clean up thread

        self.thread.started.connect(self.worker.do_work)
        #self.thread.finished.connect(self.worker.stop)
        self.thread.finished.connect(self.otp)
        self.thread.finished.connect(Dialog.close)
        self.thread.start()


    def otp(self):
        self.window = OTP()
        self.thread = QThread()
        self.worker = Worker()
        self.worker.moveToThread(self.thread)

        self.worker.finished.connect(self.thread.quit)  # connect the workers finished signal to stop thread
        self.worker.finished.connect(self.worker.deleteLater)  # connect the workers finished signal to clean up worker
        self.thread.finished.connect(self.thread.deleteLater)  # connect threads finished signal to clean up thread

        self.thread.started.connect(self.worker.do_work)
        self.thread.finished.connect(self.worker.stop)
        self.worker.finished_code.connect(self.window.otp_fill_in)
        #self.thread.finished.connect(self.window.close)
        self.thread.start()

    def otp_check(self, code):
        #self.code = self.code_input()
        global received_otp
        self.code = code
        if self.code == "123456":
            self.window = Verified()
        else:
            self.window = Denied()

class OTP(object):

    def __init__(self):
        super().__init__()
        global dia
        self.Dialog = QtWidgets.QDialog()
        dia = self.Dialog
        self.setupUi(self.Dialog)
        self.Dialog.show()

    def setupUi(self, Dialog):

        global textlabel1

        # GUI design:
        Dialog.setObjectName("Dialog")
        Dialog.resize(800, 480)
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(0, 0, 800, 480))
        self.label.setText("")
        self.label.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "background.png")))
        self.label.setObjectName("label")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(400, 30, 400, 51))
        font = QtGui.QFont()
        font.setPointSize(16)
        self.label_2.setFont(font)
        self.label_2.setStyleSheet("color: rgb(255, 255, 255);")
        self.label_2.setObjectName("label_2")
        self.label_2.setText("Fill in your OTP please")
        self.label_2.setGeometry(QtCore.QRect(0, 0, 800, 150))
        self.label_2.setAlignment(QtCore.Qt.AlignCenter)

        labelPositions = [(40, 230), (160, 230), (280, 230), (420, 230), (540, 230), (660, 230)]

        self.labels = []
        for i in range(6):
            textlabel = QtWidgets.QLabel(Dialog)
            textlabel.setGeometry(QtCore.QRect(labelPositions[i][0], labelPositions[i][1], 100, 100))
            textlabel.setStyleSheet("color: rgb(85, 170, 127);"
            "background-color: rgb(85, 170, 127);"
            "border-top-left-radius :10px;"
            "border-top-right-radius : 10px; "
            "border-bottom-left-radius : 10px; "
            "border-bottom-right-radius : 10px")
            textlabel.setAlignment(QtCore.Qt.AlignCenter)
            textlabel.setFont(font)
            #textlabel.setObjectName("textlabel{}".format(i))
            textlabel.setText("")

            self.labels.append(textlabel)

        QtCore.QMetaObject.connectSlotsByName(Dialog)


    def otp_fill_in(self):
        global users_otp
        global number
        global dia
        global textlabel1
        if users_otp == None:
            users_otp = number
            self.labels[0].setStyleSheet("border: 5px solid rgb(85, 170, 127);"
            "color: rgb(85, 170, 127);"
            "border-top-left-radius :10px;"
            "border-top-right-radius : 10px; "
            "border-bottom-left-radius : 10px; "
            "border-bottom-right-radius : 10px")
            self.labels[0].setText(number)
        else:
            users_otp += number
            self.labels[len(users_otp)-1].setStyleSheet("border: 5px solid rgb(85, 170, 127);"
            "color: rgb(85, 170, 127);"
            "border-top-left-radius :10px;"
            "border-top-right-radius : 10px; "
            "border-bottom-left-radius : 10px; "
            "border-bottom-right-radius : 10px")
            self.labels[len(users_otp)-1].setText(number)
        if len(users_otp) == 6:
            global ui
            ui.otp_check(users_otp)

class Verified(object):

    def __init__(self):
        super().__init__()
        self.Dialog = QtWidgets.QDialog()
        self.setupUi(self.Dialog)
        self.Dialog.show()

    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(800, 480)
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(0, 0, 800, 480))
        self.label.setAutoFillBackground(False)
        self.label.setStyleSheet("background-color: rgb(0, 170, 0);")
        self.label.setText("")
        self.label.setObjectName("label")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(0, 50, 800, 300))
        self.label_2.setAlignment(QtCore.Qt.AlignCenter)
        self.label_2.setText("")
        self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "verified.png")))
        self.label_2.setObjectName("label_2")
        self.textlabel = QtWidgets.QLabel(Dialog)
        self.textlabel.setGeometry(QtCore.QRect(0, 350, 800, 130))
        self.textlabel.setAlignment(QtCore.Qt.AlignCenter)
        font = QtGui.QFont()
        font.setPointSize(16)
        self.textlabel.setFont(font)
        self.textlabel.setStyleSheet("color: rgb(255, 255, 255);")
        self.textlabel.setText(welcome_string)
        self.textlabel.setObjectName("textlabel")

        QtCore.QMetaObject.connectSlotsByName(Dialog)
        Dialog.show()


class Denied(object):

    def __init__(self):
        super().__init__()
        self.Dialog = QtWidgets.QDialog()
        self.setupUi(self.Dialog)
        self.Dialog.show()

    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(800, 480)
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(0, 0, 800, 480))
        self.label.setStyleSheet("background-color: rgb(208, 0, 0);")
        self.label.setText("")
        self.label.setObjectName("label")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(0, 0, 800, 480))
        self.label_2.setAlignment(QtCore.Qt.AlignCenter)
        self.label_2.setText("")
        self.label_2.setPixmap(QtGui.QPixmap(os.path.join(current_dir, "no_access.webp")))
        self.label_2.setObjectName("label_2")
        self.retranslateUi(Dialog)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Dialog"))


def main():
    app = QtWidgets.QApplication(sys.argv)
    global ui
    ui = Home()    
    app.exec_()


if __name__ == "__main__":
    main()
