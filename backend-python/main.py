from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 1. Importamos el enrutador de IA
from app.routes.ai_routes import router as ai_router

app = FastAPI(
    title="Motor de IA y Automatización",
    description="Microservicio exclusivo para el procesamiento de IA y datos pesados",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Registramos el enrutador en la app global
app.include_router(ai_router)

@app.get("/")
def inicio():
    return {
        "status": "online",
        "message": "Servidor de Python corriendo correctamente",
        "modulo": "Automatización e IA"
    }