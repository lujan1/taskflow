from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Motor de IA - TaskFlow"
    OPENAI_API_KEY: str = "FALTA_CONFIGURAR_LA_LLAVE"
    ENVIRONMENT: str = "development"

    # Le decimos a Pydantic que lea el archivo .env automáticamente
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Instanciamos la configuración para usarla en todo el proyecto
settings = Settings()