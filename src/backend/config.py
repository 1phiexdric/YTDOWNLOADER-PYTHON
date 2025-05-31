import os, json

ARCHIVO_BASE = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ARCHIVO_CONFIGURACION = os.path.join(ARCHIVO_BASE, 'config.json')

descargas = os.path.join(ARCHIVO_BASE, "Descargas")


def guardar_configuracion(ruta, playlist):
    if not ruta:
        ruta = os.path.join(descargas, 'Ytdownloader')
    playlist = True if playlist == "true" else False
    configuracion = {
        "ruta": ruta,
        "playlist": playlist
    }
    with open(ARCHIVO_CONFIGURACION, 'w', encoding='utf-8') as config:
        json.dump(configuracion, config)
        

def cargar_congiguracion():
    with open(ARCHIVO_CONFIGURACION, 'r', encoding='utf-8') as config:
        configuracion = json.load(config)
        return configuracion
cargar_congiguracion()