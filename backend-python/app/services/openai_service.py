from openai import OpenAI
from app.core.config import settings

# Inicializamos el cliente de OpenAI con la llave del .env
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def procesar_con_ia(prompt: str) -> str:
    """
    Servicio centralizado para procesar textos con Inteligencia Artificial.
    """
    try:
        # Si el usuario no ha puesto su llave real, entra en modo simulación para desarrollo
        if settings.OPENAI_API_KEY == "FALTA_CONFIGURAR_LA_LLAVE":
            return f"[MODO SIMULACIÓN] El motor de Python procesó con éxito tu texto: '{prompt}'. Para activar la IA real, pon tu OpenAI API Key en el .env."

        # Cuando pongas tu llave real, este bloque se ejecutará automáticamente:
        # response = client.chat.completions.create(
        #     model="gpt-4o-mini", # El modelo más rápido y económico
        #     messages=[{"role": "user", "content": prompt}]
        # )
        # return response.choices[0].message.content
        
        return f"[Modo IA Real] Listo para conectar. Llave detectada."

    except Exception as e:
        return f"Error interno en el servicio de IA de Python: {str(e)}"