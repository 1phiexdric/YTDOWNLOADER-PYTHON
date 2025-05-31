import os

import yt_dlp

ffmpeg = os.path.join(os.path.dirname(__file__), '..', 'ffmpeg')


def obtener_resoluciones_disponibles(url):
    """
    Obtiene las resoluciones disponibles para un video de YouTube.

    Args:
        url (str): La URL del video de YouTube.

    Returns:
        set: Un conjunto de resoluciones disponibles.
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        formats = info_dict.get('formats', [])
        resoluciones_disponibles = set()
        for f in formats:
            vcodec = f.get('vcodec', 'none')
            if vcodec != 'none':  # Asegurarse de que es un formato de video
                height = f.get('height', 0)
                if height >= 2160:
                    resoluciones_disponibles.add('4k')
                elif height >= 1440:
                    resoluciones_disponibles.add('1440p')
                elif height >= 1080:
                    resoluciones_disponibles.add('1080p')
                elif height >= 720:
                    resoluciones_disponibles.add('720p')
                elif height >= 480:
                    resoluciones_disponibles.add('480p')
                elif height >= 360:
                    resoluciones_disponibles.add('360p')
    print(resoluciones_disponibles)
    return sorted(resoluciones_disponibles, key=lambda x: ['360p', '480p', '720p', '1080p', '1440p', '4k'].index(x))


def descargar_video(url, resolucion, carpeta, playlist):
    """
    Descarga un video de YouTube en la resolución especificada.

    Args:
        url (str): La URL del video de YouTube.
        resolucion (str): La resolución deseada para la descarga.
        carpeta (str): La carpeta donde se guardará el video descargado.
    """
    try:
        #mapear resoluciones
        resoluciones = {
            "4k": "bestvideo[height>=2160]+bestaudio/best",
            "1440p": "bestvideo[height<=1440]+bestaudio/best",
            "1080p": "bestvideo[height<=1080]+bestaudio/best",
            "720p": "bestvideo[height<=720]+bestaudio/best",
            "480p": "bestvideo[height<=480]+bestaudio/best",
            "360p": "bestvideo[height<=360]+bestaudio/best",
        }  

        if resolucion not in resoluciones:
            print(f"Resolución no válida. Elija una de estas: {', '.join(resoluciones.keys())}.")
            return

        opciones = {
            'format': resoluciones[resolucion],  # Usar la resolución seleccionada
             'outtmpl': f'{carpeta}/%(title)s_{resolucion}.%(ext)s', # Agrega un número único al nombre del archivo
            'noplaylist': playlist,
            'merge_output_format': 'mp4',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
                }],
            "ffmpeg_location": ffmpeg
        }

        with yt_dlp.YoutubeDL(opciones) as ydl:
            ydl.download([url])
            print("descarga completa")
    except yt_dlp.utils.DownloadError as e:
        print(f"Ocurrió un error durante la descarga del video: {e}")

