from fastapi import APIRouter
from pydantic import BaseModel
# Importamos el servicio que acabamos de crear
from app.services.openai_service import procesar_con_ia

router = APIRouter(prefix="/ai", tags=["Automatización e IA"])

class PromptSchema(BaseModel):
    prompt: str
    user_id: str

@router.post("/test-bridge")
def probar_puente(data: PromptSchema):
    # Pasamos el prompt por nuestro nuevo motor de IA
    respuesta_motor = procesar_con_ia(data.prompt)

    return {
        "status": "success",
        "message": "Petición procesada por el módulo de IA",
        "resultado_ia": respuesta_motor,
        "usuario_id": data.user_id
    }