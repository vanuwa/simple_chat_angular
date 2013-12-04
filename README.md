simple_chat_angular
===================

To get it to run, follow these steps:

0. Install python 2.7+
1. Run "sudo pip install django"
2. Extract the zip
3. Enter the ‘chat’ directory
4. Run "python manage.py syncdb" (choose whatever user and password you wish)
	4.1. Would you like to create one now? Yes
	4.2. Username: chat
	4.3. email address: whatever@whatever.com
	4.4. Password: chat
5. Run "python manage.py runserver"
6. Go to "http://localhost:8000/admin" and log in using chat/chat
7. Go to "http://localhost:8000/room/room1"
