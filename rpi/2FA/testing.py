import pyotp
import pyqrcode
import time



def create_qr_from_url(QRstring, employee_name):
    # Deze functie kan QR-codes maken van een url
    url = pyqrcode.create(QRstring)
    filename = str(employee_name)+'.png'
    url.png(filename, scale=8)


def GenerateSecretKey():
    # Deze functie genereert een persoonlijke token van 32 karakters(base32), die moet worden opgeslagen in de database. Deze token verandert
    # niet meer. Aan de hand van deze token wordt op zowel de server als bij de cliënt een one-time password gecreëerd.
    secret_key = pyotp.random_base32()
    return secret_key

def GenerateURL(secret_key):
    #Deze functie maakt op basis van de base32 token een url, die kan worden omgezet naar een URL zodat een cliëntele app
    #zoals Google Authenticator deze kan scannen.
    return pyotp.totp.TOTP(secret_key, interval=30).provisioning_uri()

def GetTOTP(secret_key):
    #Deze functie genereert de huidige OTP, op basis van de base32 key
    totp = pyotp.TOTP(secret_key)
    return totp.now()


print(GenerateURL('FZKAKFARK23'))
#Notitie aan mezelf, de volgende stap is het creëren van een class 'Employee' waarin al deze functionaliteiten gecombineerd worden
#en die gestructureerd de data bijhoudt per werknemer.


#Example code

# In de werkmap komt een PNG met de QR die door de authenticator app gescand dient te worden.
