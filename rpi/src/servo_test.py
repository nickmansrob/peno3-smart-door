import pigpio

import time

pwm = pigpio.pi()
pwm.set_mode(24, pigpio.OUTPUT)
pwm.set_PWM_frequency(24, 50);

def servo_min():
    pwm.set_servo_pulsewidth(24, 820)

def servo_max():
    pwm.set_servo_pulsewidth(24, 2500)

servo_min()
time.sleep(2)
# servo_max()
# time.sleep(2)
# servo_min()
# time.sleep(2)