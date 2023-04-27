from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAccountSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'identifying_number', 'email', 'first_name', 'last_name', 'birth_date', 'gender', 'is_patient', 'is_staff', 'password')


class CurrentUserAccountSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'identifying_number', 'email', 'first_name', 'last_name', 'birth_date', 'gender', 'is_patient', 'is_staff', 'is_superuser')