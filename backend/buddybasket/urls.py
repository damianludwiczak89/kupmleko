from . import views as api_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("user/token/", api_views.MyTokenObtainPairView.as_view(), name="login"),
    path("user/token/refresh/", TokenRefreshView.as_view(), name='refresh'),
    path("user/register/", api_views.RegisterView.as_view(), name="register"),
    path("user/password-reset/<email>/", api_views.PasswordResetEmailVerifyAPIView.as_view(), name="reset_password"),
    path("user/reset-password/", api_views.PasswordChangeAPIView.as_view(), name='password_change'),

    path("shopping_list/", api_views.ShoppingListAPIView.as_view(), name="shopping_list"),
    path("shopping_list/<int:id>/", api_views.ShoppingListAPIView.as_view(), name="shopping_list_detail"),
    path("draft/", api_views.DraftAPIView.as_view(), name="draft"),
    path("draft/<int:id>/", api_views.DraftAPIView.as_view(), name="draft_detail"),
    path("draft/activate/", api_views.DraftActivateAPIView.as_view(), name="draft_activate"),
    path("item/<int:id>/", api_views.ItemAPIView.as_view(), name="item"),
    path("friends/", api_views.FriendsAPIView.as_view(), name="friends"),
    path("friends/<int:id>/", api_views.FriendsAPIView.as_view(), name="friends_delete"),
    path("search/<email>/", api_views.UserSearchAPIView.as_view(), name="search"),
    path("invite/", api_views.IntiveAPIView.as_view(), name="invite"),
    path("invite/accept/", api_views.AcceptInviteAPIView.as_view(), name="accept_invite"),
    path("invite/<int:id>/", api_views.IntiveAPIView.as_view(), name="invite"),
    path("history/", api_views.HistoryAPIView.as_view(), name="history"),
]