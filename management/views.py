from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime as dt
import random
import string

from account.models import UserAccount
from member.models import DoctorProfile, Category
from .models import Appointment, Diagnosis, Notification
from account.serializers import CurrentUserAccountSerializer
from .serializers import (
    CategorySerializer, DoctorProfileSerializer, TimeSlotSerializer,
    BookAppointmentSerializer, AppointmentSerializer, DiagnosisSerializer,
    NotificationSerializer
)
from .helpers import send_notifying_email


class ShowCategoriesView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        category_serializer = CategorySerializer(categories, many=True)
        return Response(category_serializer.data)
    

class ShowDoctorsView(APIView):
    def post(self, request):
        category = request.data.get('category', None)
        if category is None:
            return Response({"message": "Category is required.", "status": "fail"})

        doctor_profiles = DoctorProfile.objects.filter(category_of_service=category)
        doctor_profile_serializer = DoctorProfileSerializer(doctor_profiles, many=True)
        return Response(doctor_profile_serializer.data)
    

class CheckTimeSlotView(APIView):
    def post(self, request):
        doctor = request.data.get('doctor', None)
        date = request.data.get('date', None)

        if doctor is None:
            return Response({"message": "Doctor is required.", "status": "fail"})
        if date is None:
            return Response({"message": "Date is required.", "status": "fail"})

        appointments = Appointment.objects.filter(doctor=doctor, date=date, visited=False)
        appointment_serializer = TimeSlotSerializer(appointments, many=True)
        return Response(appointment_serializer.data)
    

def generate_id():
    return ''.join(random.choices(string.digits, k=8))

class BookAppointmentView(APIView):
    def post(self, request):
        identifying_number = generate_id()
        email = request.data.get('email', None)
        category = request.data.get('category', None)
        doctor = request.data.get('doctor', None)
        symptom = request.data.get('symptom', None)
        comment = request.data.get('comment', None)
        date = request.data.get('date', None)
        start_time = request.data.get('start_time', None)
        end_time = request.data.get('end_time', None)

        if email is None:
            return Response({"message": "No email is required.", "status": "fail"})
        
        try:
            user_obj = UserAccount.objects.get(email=email)
            disease_category = Category.objects.get(id=category)
            doctor_obj = DoctorProfile.objects.get(id=doctor)

            booking_info = {
                "user": user_obj,
                "identifying_number": identifying_number,
                "disease_category": disease_category,
                "doctor": doctor_obj,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
            }
            
            booking_serializer = BookAppointmentSerializer(data=booking_info)
            if booking_serializer.is_valid():
                appointment = Appointment(
                    user = user_obj,
                    identifying_number = identifying_number,
                    disease_category = disease_category,
                    doctor = doctor_obj,
                    date = date,
                    start_time = start_time,
                    end_time = end_time,
                )
                if symptom:
                    appointment.symptom = symptom
                if comment:
                    appointment.comment = comment
                appointment.save()

                return Response({"message": "Appointment has been booked successfully.", "status": "success"})
            return Response({"message": "Something is wrong! Try again.", "status": "fail"})
        except ObjectDoesNotExist:
            return Response({"message": "Appointment was not booked! Try again.", "status": "fail"})
        

class OutdatedAppointmentsView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        appointments = Appointment.objects.filter(user__email=email, visited=True)
        appointment_serializer = AppointmentSerializer(appointments, many=True)
        return Response(appointment_serializer.data)
    

class PatientAppointmentsView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        appointments = Appointment.objects.filter(user__email=email, visited=False)
        appointment_serializer = AppointmentSerializer(appointments, many=True)
        return Response(appointment_serializer.data)


class DoctorAppointmentsView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        appointments = Appointment.objects.filter(doctor__user__email=email, date=timezone.now().date(), visited=False)
        appointment_serializer = AppointmentSerializer(appointments, many=True)
        return Response(appointment_serializer.data)


class AdminAppointmentsView(APIView):
    def get(self, request):
        appointments = Appointment.objects.filter(date=timezone.now().date(), visited=False)
        appointment_serializer = AppointmentSerializer(appointments, many=True)
        return Response(appointment_serializer.data)
    

class ShowDiagnosisView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        try:
            doctor_obj = UserAccount.objects.get(email=email)
            doctor_profile = DoctorProfile.objects.get(user=doctor_obj)
            
            diagnosis_list = Diagnosis.objects.filter(disease_category=doctor_profile.category_of_service)
            diagnosis_serializer = DiagnosisSerializer(diagnosis_list, many=True)
            return Response(diagnosis_serializer.data)
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong! Try again later.", "status": "fail"})
        

class StoreDiagnosisView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        diagnosis = request.data.get('diagnosis', None)

        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})
        if diagnosis is None:
            return Response({"message": "Diagnosis is required.", "status": "fail"})

        try:
            doctor_obj = UserAccount.objects.get(email=email)
            doctor_profile = DoctorProfile.objects.get(user=doctor_obj)

            diagnosis_info = {
                "name": diagnosis,
                "disease_category": doctor_profile.category_of_service
            }

            diagnosis_serializer = DiagnosisSerializer(data=diagnosis_info)
            if diagnosis_serializer.is_valid():
                diagnosis = Diagnosis(
                    name = diagnosis,
                    disease_category = doctor_profile.category_of_service
                )
                diagnosis.save()
                return Response({"message": "Diagnosis has been saved successfully.", "status": "success"})
            return Response({"message": "Invalid input!.", "status": "fail"})
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong! Try again later.", "status": "fail"})


class AddDiagnosisView(APIView):
    def post(self, request):
        identifying_number = request.data.get('identifying_number', None)
        diagnosis = request.data.get('diagnosis', None)

        if identifying_number is None:
            return Response({"message": "Appointment is required.", "status": "fail"})
        if diagnosis is None:
            return Response({"message": "Diagnosis is required.", "status": "fail"})

        try:
            appointment = Appointment.objects.get(identifying_number=identifying_number)
            diagnosis_obj = Diagnosis.objects.get(id=diagnosis)
            
            appointment.diagnosis = diagnosis_obj
            appointment.save()
            return Response({"message": "Diagnosis has been added to the appointment.", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong! Try again later.", "status": "fail"})


class NotificationView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        try:
            user_obj = UserAccount.objects.get(email=email)

            notifications = Notification.objects.filter(user=user_obj)
            notification_serializer = NotificationSerializer(notifications, many=True)
            return Response(notification_serializer.data)
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong!", "status": "fail"})


class RemoveNotificationView(APIView):
    def post(self, request):
        notification = request.data.get('notification', None)
        if notification is None:
            return Response({"message": "Notification id is required!", "status": "fail"})
                    
        try:
            notify_obj = Notification.objects.get(id=notification)
            notify_obj.delete()
            return Response({"message": "Notification has been removed.", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong!", "status": "fail"})


class DeleteAppointmentView(APIView):
    def post(self, request):
        booking_number = request.data.get('booking_number', None)
        if booking_number is None:
            return Response({"message": "Booking ID is required!", "status": "fail"})
                    
        try:
            booking_obj = Appointment.objects.get(identifying_number=booking_number)
            booking_obj.delete()
            return Response({"message": "Your booking has been canceled.", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Something went wrong!", "status": "fail"})


class PatientDetailView(APIView):
    def post(self, request):
        identifying_number = request.data.get('identifying_number', None)
        if identifying_number is None:
            return Response({"message": "ID is required.", "status": "fail"})

        try:
            patient_obj = UserAccount.objects.get(identifying_number=identifying_number)
            patient_serializer = CurrentUserAccountSerializer(patient_obj)
            return Response(patient_serializer.data)
        except ObjectDoesNotExist:
            return Response({"message": "Invalid patient ID!", "status": "fail"})


def notify_user():
    appointments = Appointment.objects.filter(visited=False).order_by('created_at')

    for appointment in appointments:
        if appointment.notified == False:
            send_notifying_email(appointment)

            Notification.objects.create(
                user = appointment.user,
                content = "Please visit " + appointment.doctor.user.first_name + " " + appointment.doctor.user.last_name + " on " + str(appointment.start_time) + " at " + str(appointment.date) + "."
            )
            
            appointment.notified = True
            appointment.save()
            break 