from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "MedicalBooking101"
admin.site.site_title = "MedicalBooking101"
admin.site.index_title = "Administration area"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("management.urls")),
    path('member/', include("member.urls")),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
] 

if settings.DEBUG: 
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        re_path(r'^.*', TemplateView.as_view(template_name='index.html'))
    ]

if not settings.DEBUG: 
    urlpatterns += [
        re_path(r'^.*', TemplateView.as_view(template_name='index.html'))
    ]