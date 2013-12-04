from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from . import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'chat.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^room/(?P<room_name>[\w\d_]+)/$', views.show_room),
    url(r'^room/(?P<room_name>[\w\d_]+)/post_message$', views.post_message),
    url(r'^room/(?P<room_name>[\w\d_]+)/last_messages_json$', views.last_messages_json),
    url(r'^room/(?P<room_name>[\w\d_]+)/list_users_json$', views.list_users_json),

    url(r'^admin/', include(admin.site.urls)),
)
