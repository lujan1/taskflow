APLICACION EN DESARROLLO 
 
 
 TaskFlow - Motor de Automatización e Inteligencia Artificial

TaskFlow es una plataforma robusta diseñada bajo una arquitectura de **microservicios**, dividiendo la gestión lógica, el control de usuarios y la persistencia de datos del procesamiento pesado de IA y algoritmos avanzados.

Este repositorio unifica el ecosistema de la aplicación mediante dos núcleos independientes que se comunican de forma síncrona a través de un puente HTTP.


Arquitectura del Sistema

El sistema se divide en dos componentes principales:

1. Gatway & API Manager (Node.js + Express): Se encarga de la autenticación de usuarios, la seguridad global, el manejo de peticiones rápidas, bases de datos ordinarias y la delegación de tareas complejas. Corriendo en el puerto `5000`.
2. Motor de IA y Cómputo (Python + FastAPI): Un microservicio aislado y ultra veloz diseñado exclusivamente para interactuar con modelos de lenguaje (OpenAI), procesamiento de datos masivos y automatizaciones en segundo plano. Corriendo en el puerto `8000`.

---

 Estructura del Proyecto

El espacio de trabajo está organizado de manera modular para garantizar escalabilidad sin acoplamiento de código:

```text
taskflow/
│
├── backend-node/                # 🟢 API GATEWAY (JavaScript)
│   ├── routes/                  # Enrutadores modulares de Express
│   │   ├── authRoutes.js        # Autenticación y JWT
│   │   ├── taskRoutes.js        # Lógica de tareas y flujos
│   │   └── aiRoutes.js          # Punto de enlace con el microservicio de Python
│   ├── services/                # Servicios de infraestructura
│   │   └── pythonService.js     # Cliente Axios exclusivo para hablar con Python
│   ├── server.js                # Servidor maestro de Node.js
│   └── package.json             # Dependencias del ecosistema Node
│
├── backend-python/              # 🐍 MOTOR DE IA (Python)
│   ├── venv/                    # Entorno virtual aislado del sistema
│   ├── main.py                  # Punto de entrada de FastAPI y configuración CORS
│   ├── requirements.txt         # Librerías y dependencias de Python
│   └── app/                     # Módulos internos de lógica
│       ├── core/                # Configuraciones globales y validación de entornos (.env)
│       ├── routes/              # Endpoints asíncronos expuestos
│       │   └── ai_routes.py     # Receptor de peticiones del gateway
│       └── services/            # Servicios encargados de la lógica pesada
│           └── openai_service.py# Integración nativa con OpenAI (con Modo Simulación)
│
└── .gitignore                   # 🛡️ Filtro global de seguridad para Git
