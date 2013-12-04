from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.utils import simplejson

from .models import Room, Message

@login_required
def show_room(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
    except Room.DoesNotExist:
        room = Room()
        room.name = room_name
        room.save()
    room.users.add(request.user)
    return render_to_response('room.html', {'room': room}, context_instance=RequestContext(request))

@login_required
def post_message(request, room_name):
    room = Room.objects.get(name=room_name)

    message = Message()
    message.room = room
    message.author = request.user
    message.text = request.POST['message']
    message.save()

    return redirect(show_room, room_name=room_name)

@login_required
def last_messages_json(request, room_name):
    limit = int(request.GET.get('limit', 0))
    room = Room.objects.get(name=room_name)

    json_data = {'room': room_name, 'messages':[m.to_json() for m in list(room.message_set.all())[-limit:]]}
    return HttpResponse(simplejson.dumps(json_data), mimetype='application/json')

@login_required
def list_users_json(request, room_name):
    room = Room.objects.get(name=room_name)

    json_data = {'room': room_name, 'users':[{'id':u.id, 'name':u.username} for u in room.users.all()]}
    return HttpResponse(simplejson.dumps(json_data), mimetype='application/json')
