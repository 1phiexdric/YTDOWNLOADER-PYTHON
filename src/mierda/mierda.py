@eel.expose
def obtener_ruta_carpeta():
    """Abre un diálogo para que el usuario seleccione una carpeta y devuelve la ruta."""
    root = tk.Tk()
    root.withdraw()  # Oculta la ventana principal de tkinter
    root.attributes('-topmost', True)
    carpeta_seleccionada = filedialog.askdirectory()
    return carpeta_seleccionada
