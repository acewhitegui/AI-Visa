# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : smtp.py
@Author: White Gui
@Date  : 2025/4/13
@Desc :
"""
import smtplib
from email import utils
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from common.const import CONST
from common.logger import log


def send_email(from_addr: str, to_addrs: list, subject: str, body: str):
    # Create the message
    smtp_server = CONST.SMTP_SERVER
    smtp_port = CONST.SMTP_PORT
    username = CONST.SMTP_USER
    password = CONST.SMTP_PASSWORD
    # Connect to the server
    server = smtplib.SMTP(smtp_server, smtp_port)
    try:
        msg = MIMEMultipart()
        msg['message-id'] = utils.make_msgid(domain=CONST.SMTP_MSG_DOMAIN)
        msg['From'] = from_addr
        msg['To'] = ', '.join(to_addrs)
        msg['Subject'] = Header(subject, 'utf-8')
        msg.attach(MIMEText(body, 'html', 'utf-8'))
        # If authentication is required
        if username and password:
            server.starttls()  # Secure the connection
            server.login(username, password)

        # Send the email
        result = server.sendmail(from_addr, to_addrs, msg.as_string())
        log.info(f"SUCCESS to send email from: {from_addr},to addrs: {to_addrs},result: {result}")
    except Exception as e:
        log.exception(f"ERROR to send email,error info: {str(e)}")
        raise e
    finally:
        server.quit()
