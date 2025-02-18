from django.apps import AppConfig


class BuddybucketConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'buddybasket'

    def ready(self):
        import buddybasket.signals