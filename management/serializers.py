from rest_framework import serializers

from member.models import Category, DoctorProfile
from account.models import UserAccount
from .models import Appointment, Diagnosis, Notification


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id', 
            'name'
        ]


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            'first_name', 
            'last_name'
        ]


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 
            'user'
        ]
    
    def get_user(self, obj):
        return DoctorSerializer(obj.user).data
    

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 
            'start_time'
        ]


class BookAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'user',
            'identifying_number',
            'disease_category',
            'doctor',
            'symptom',
            'comment',
            'date',
            'start_time',
            'end_time',
        ]
        depth = 1


class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = [
            'id',
            'name',
            'disease_category'
        ]
        depth = 1


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            'identifying_number', 
            'email',
            'first_name',
            'last_name',
            'birth_date',
            'gender'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    disease_category = serializers.SerializerMethodField()
    doctor = serializers.SerializerMethodField()
    diagnosis = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'user',
            'identifying_number',
            'disease_category',
            'doctor',
            'symptom',
            'comment',
            'diagnosis',
            'date',
            'start_time',
            'end_time'
        ]
    
    def get_user(self, obj):
        return PatientSerializer(obj.user).data
    
    def get_disease_category(self, obj):
        return CategorySerializer(obj.disease_category).data
    
    def get_doctor(self, obj):
        return DoctorProfileSerializer(obj.doctor).data
    
    def get_diagnosis(self, obj):
        return DiagnosisSerializer(obj.diagnosis).data
    

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 
            'content'
        ]