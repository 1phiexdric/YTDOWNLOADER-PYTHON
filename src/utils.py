import os

def crear_carpeta():
    ruta_actual = os.path.dirname(__file__)
    ruta_destino = os.path.join(ruta_actual, 'Descargas')
    os.makedirs(ruta_destino, exist_ok=True)
    return ruta_destino