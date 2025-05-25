from django.apps import AppConfig


class KupMlekoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'kupmleko'

    def ready(self):
        import kupmleko.signals