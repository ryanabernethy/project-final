from django.urls import path
from .views import (
    ShowCategoriesView,
    ShowDoctorsView,
    CheckTimeSlotView,
    BookAppointmentView,
    OutdatedAppointmentsView,
    PatientAppointmentsView,
    DoctorAppointmentsView,
    AdminAppointmentsView,
    ShowDiagnosisView,
    StoreDiagnosisView,
    AddDiagnosisView,
    NotificationView,
    RemoveNotificationView,
    DeleteAppointmentView,
    PatientDetailView
)

urlpatterns = [
    path('notifications/', NotificationView.as_view()),
    path('remove-notification/', RemoveNotificationView.as_view()),
    path('show-categories/', ShowCategoriesView.as_view()),
    path('show-doctors/', ShowDoctorsView.as_view()),
    path('book-appointment/', BookAppointmentView.as_view()),
    path('outdated-appointment/', OutdatedAppointmentsView.as_view()),
    path('patient-appointment/', PatientAppointmentsView.as_view()),
    path('doctor-appointment/', DoctorAppointmentsView.as_view()),
    path('admin-appointment/', AdminAppointmentsView.as_view()),
    path('patient-detail/', PatientDetailView.as_view()),
    path('show-diagnosis/', ShowDiagnosisView.as_view()),
    path('store-diagnosis/', StoreDiagnosisView.as_view()),
    path('add-diagnosis/', AddDiagnosisView.as_view()),
    path('delete-booking/', DeleteAppointmentView.as_view()),
    path('check-time-slot/', CheckTimeSlotView.as_view()),
]