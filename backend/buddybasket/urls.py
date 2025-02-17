from . import views as api_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", api_views.RegisterView.as_view()),
    path("user/password-reset/<email>/", api_views.PasswordResetEmailVerifyAPIView.as_view()),
    path("user/reset-password/", api_views.PasswordChangeAPIView.as_view(), name='password_change'),

    path("shopping_list/", api_views.ShoppingListAPIView.as_view()),
    path("draft/", api_views.DraftAPIView.as_view()),
    path("friends/", api_views.FriendsAPIView.as_view()),
    path("search/<email>/", api_views.UserSearchAPIView.as_view())
]