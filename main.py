import eel, os
import tkinter as tk
from tkinter import filedialog
from src.backend.download_audio import *
from src.backend.download_video import *
from src.backend.config import *
import threading
eel.init('src/web')


def descargar_musica_thread(*args, **kwargs):
    """
    *args, **kwargs, es util cuando tienes una funcion y no sabes que cantidad de elementos
    vas a recibir como parametro
    """
    descargar_musica(*args, **kwargs)

def descargar_video_thread(*args, **kwargs):
    descargar_video(*args, **kwargs)

@eel.expose
def cargar_configuracion_exposed():
    configuracion = cargar_congiguracion()
    return configuracion

@eel.expose
def guardar_configuracion_exposed(ruta, playlist):
    guardar_configuracion(ruta, playlist)

@eel.expose
def cerrar_app():
    print('cerrando aplicacion...')
    os._exit(0)

@eel.expose
def obtener_ruta_carpeta():
    """Abre un diálogo para que el usuario seleccione una carpeta y devuelve la ruta."""
    root = tk.Tk()
    root.withdraw()  # Oculta la ventana principal de tkinter
    root.attributes('-topmost', True)
    carpeta_seleccionada = filedialog.askdirectory()
    return carpeta_seleccionada

@eel.expose
def descargar_musica_exposed(url, bibrate, x):
    configuracion = cargar_congiguracion()
    carpeta = configuracion['ruta']
    playlist = configuracion['playlist']
    if x:
        descargar_musica(url, bibrate, carpeta, playlist)
        return
    hilo = threading.Thread(target=descargar_musica_thread, args=(url, bibrate, carpeta, playlist))
    hilo.daemon = True
    hilo.start()

@eel.expose
def obtener_resoluciones_exposed(url):
    return list(obtener_resoluciones_disponibles(url))

@eel.expose
def descargar_video_exposed(url, resolution, x):
    configuracion = cargar_congiguracion()
    carpeta = configuracion['ruta']
    playlist = configuracion['playlist']
    if x:
        descargar_video(url, resolution, carpeta, playlist)
        return
    hilo = threading.Thread(target=descargar_video_thread,
                        args=(url, resolution, carpeta, playlist))
    hilo.daemon = True
    hilo.start()


eel.start('index.html', size=(600, 550))
