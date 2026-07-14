from django.apps import AppConfig

class AccountsConfig(AppConfig):

    default_auto_field = "django.db.models.BigAutoField"

    name = "accounts"

    def ready(self):

        from .ai_matching import initialize_embeddings

        initialize_embeddings()