import eel
import configparser
import os
import tkinter as tk
from tkinter import filedialog
from music import descargar_musica
from video import obtener_resoluciones_disponibles, descargar_video
from utils import *
eel.init('web')

carpeta = crear_carpeta()

@eel.expose
def obtener_ruta_carpeta():
    """Abre un diálogo para que el usuario seleccione una carpeta y devuelve la ruta."""
    root = tk.Tk()
    root.withdraw()  # Oculta la ventana principal de tkinter
    root.attributes('-topmost', True)
    carpeta_seleccionada = filedialog.askdirectory()
    return carpeta_seleccionada

@eel.expose
def descargar_musica_exposed(url):
    descargar_musica(url, carpeta)

@eel.expose
def obtener_resoluciones_exposed(url):
    return list(obtener_resoluciones_disponibles(url))

@eel.expose
def descargar_video_exposed(url, resolution):
    descargar_video(url, resolution, carpeta)


eel.start('index.html', size=(600, 380))



"""
print("\n¡Videos descargados correctamente! 🎬")
print("NOTA: Para la mejor experiencia, usa VLC, PotPlayer o MPV.")
print("(El Reproductor de Windows puede no soportar algunos formatos modernos)")
"""
