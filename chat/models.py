from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    users = models.ManyToManyField(User)

class Message(models.Model):
    room = models.ForeignKey(Room)
    author = models.ForeignKey(User)
    text = models.TextField(blank=True, null=False)
    sent = models.DateTimeField(auto_now_add=True)

    def to_json(self):
        return {
            'room': self.room.name,
            'author': self.author.id,
            'text': self.text,
            'sent': str(self.sent),
        }
