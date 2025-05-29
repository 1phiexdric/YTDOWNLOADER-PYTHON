import os

import yt_dlp

def descargar_musica(url, bibrate, carpeta):

    """
    Descarga la música de un video de YouTube en formato MP3.

    Args:
        url (str): La URL del video de YouTube.
        carpeta (str): La carpeta donde se guardará la música descargada. Por defecto es "musica".

    Returns:
        None
    """
    os.makedirs(carpeta, exist_ok=True)
    try:
        if not url:
            return False
        opciones = {
            'format': 'bestaudio/best',
            'outtmpl': f'{carpeta}/%(title)s.%(ext)s', 
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': bibrate.replace('k', ""),
        }],
            'ffmpeg_location': 'ffmpeg/',
            'cookiefile': './cookies.txt',  # Ruta al archivo de cookies
        }
        with yt_dlp.YoutubeDL(opciones) as ydl:
            ydl.download([url])
    except yt_dlp.utils.DownloadError as e:
        print(f"ocurrio un error: {e}")

if __name__ == "__main__":
    music_url = input("Ingresa la url del video: ")
    descargar_musica(music_url, 'Descargas')


