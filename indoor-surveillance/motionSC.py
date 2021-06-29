# -*- coding: utf-8 -*-
"""
Created on Sat Jun 19 11:53:55 2021

@author: DHRUVENDRA SINGH
"""

# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import cv2
#import numpy as np
import time 
#print(time.time())
start_time = int(input("Please enter after how much time would you be back home"))
t_end = time.time() + 60*start_time

cap: object = cv2.VideoCapture(0)


import smtplib
import imghdr
from email.message import EmailMessage
mail_content = '''Intruder Alert!!!'''
message = EmailMessage()

sender = '***'
receiver = '***'
message['From'] = sender
message['To'] = receiver
message['Subject'] = 'INTRUDER ALERT!!! CHECK THE IMAGES AND CALL THE POLICE'

img_counter = 0


while time.time() < t_end:
    ret,frame1 = cap.read()
    ret,frame2 = cap.read()
   # cap.isOpened()
    diff =cv2.absdiff(frame1,frame2)
    gray =cv2.cvtColor(diff,cv2.COLOR_BGR2GRAY)
    blur =cv2.GaussianBlur(gray,(5,5),0)
    _,thresh = cv2.threshold(blur,20,255,cv2.THRESH_BINARY)
    dilated=cv2.dilate(thresh,None,iterations=3)
    _, contours,_ =cv2.findContours(dilated,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    for contours in contours :
        (x,y,w,h) =cv2.boundingRect(contours)

        if cv2.contourArea(contours)<900:
            continue
        cv2.rectangle(frame1,(x,y),(x+w,y+h),(0,255,0),2)
        img_name = "Capture_{}.png".format(img_counter)
        cv2.imwrite(img_name, frame1)
        print("{}".format(img_name))
        img_counter += 1
        cv2.putText(frame1,"Status:{}".format('Movement'),(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),3 )
      # img_name = "Capture_{}.png".format(img_counter)
      #  cv2.imwrite(img_name, frame1)
       # print("{}".format(img_name))
       # img_counter += 1

        with open(img_name, 'rb') as f:
            image_data = f.read()
            image_type = imghdr.what(f.name)
            image_name = f.name
            message.add_attachment(image_data, maintype='image', subtype=image_type, filename=image_name)

        mail_server = smtplib.SMTP_SSL('smtp.gmail.com')
        mail_server.login("emailofsender", 'password')
        mail_server.send_message(message)
        mail_server.quit()
        print('Mail Sent') 
    #cv2.drawContours(frame1,contours,-1,(0,255,0),2)

    cv2.imshow("Detector",frame1)
    frame1=frame2
    ret,frame2=cap.read()
    if cv2.waitKey(40) == 27:
        break

cv2.destroyAllWindows()
cap.release()
