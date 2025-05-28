let url = ''
const btnMp3 = document.getElementById('MP3');
const videoButton = document.getElementById('MP4')
const btnDelete = document.getElementById('delete')
const newContainer = document.createElement('div')
const flexContainer = document.getElementById('container-flex')
const separador = document.getElementById('hr')
flexContainer.append(newContainer)
const urlInput = document.getElementById('url-input')
urlInput.addEventListener('input', ()=>{
    url =  urlInput.value
    console.log(url);
})

btnMp3.addEventListener('click', async () => {
    limpiar()
    
    try {
        showLoader('Descargando...')
        const descarga = await eel.descargar_musica_exposed(url)();
        if(!descarga){
            mostrarNotificacion("✅ Descargar Completada", "green")
        }
    } catch (error) {
        console.error('Error calling eel.descargar_musica:', error);
        
    }finally{
        hideLoad()
    }
    limpiar()
});



videoButton.addEventListener('click', async()=>{
    limpiar()
    
    const h3 = document.createElement('h3')
    h3.id = 'resolution-title'
    h3.textContent = 'Resoluciones Disponibles'
    const newdiv = document.createElement('div')
    newdiv.id = 'resolution-buttons'
    try{
        let resoluciones
        if(url){
            showLoader('Buscando Resoluciones...')
            resoluciones = await eel.obtener_resoluciones_exposed(url)()
            if(resoluciones.length === 0){
                mostrarNotificacion("❌ No se encontraron resoluciones", "red")
                return
            }
        }else{
            mostrarNotificacion("❌ Error al descargar", "red")
            return
        }
        newContainer.id = 'resolution-container'
        resoluciones.forEach(element => {
            const btn = document.createElement('button')
            btn.textContent = element
            btn.classList.add('btn')
            btn.classList.add('resoluciones')
            separador.classList.add('visible')
            newContainer.append(h3)
            newContainer.append(newdiv)
        
            newdiv.append(btn)
            btn.addEventListener('click', async()=>{
                showLoader('Descargando')
                try{
                    await eel.descargar_video_exposed(url, element)()
                    mostrarNotificacion("✅ Descarga completada")
                }catch(error){
                    console.log('error')
                }finally{
                    hideLoad()
                }
            })
        });
    }catch(error){
        console.log('ha habido un error' + error);
    }finally{
        hideLoad()
    }
})
btnDelete.addEventListener('click', () => {
    urlInput.value = ''
    url = ''
    limpiar()
});
const loaderContainer = document.getElementById('loader-container')

function showLoader(mensaje){
    const loaderText = document.getElementById('loader-text')
    loaderText.innerText = mensaje
    loaderContainer.classList.add('activated')
}

function hideLoad(){
    loaderContainer.classList.remove('activated')
}


function limpiar(){
    newContainer.innerHTML = ''
    separador.classList.remove('visible')
}

function mostrarNotificacion(mensaje, color, altura) {
    const notificacion = document.getElementById("notificacion");
    notificacion.textContent = mensaje || "✅ Descarga completada";
    notificacion.style.display = "block";
    notificacion.style.backgroundColor = color || "green";
    notificacion.style.zIndex = altura || '999'
    setTimeout(() => {
        notificacion.style.display = "none";
    }, 3000); // Oculta después de 3 segundos
}


// menu
const abrirMenu = document.getElementById('botonMenu')
const cerrarMenu = document.getElementById('cerrarMenu')
const menu = document.getElementById('menuDesplegable')
abrirMenu.addEventListener('click', ()=>{
    
    menu.classList.add('mostrar')
})

cerrarMenu.addEventListener('click', ()=>{
    menu.classList.remove('mostrar')
})

//seleccionar carpeta
const btnSelectFolder = document.getElementById("btnFolder")
const guardar = document.getElementById('guardar')
btnSelectFolder.addEventListener('click', async () => {
    const folderPath = await eel.obtener_ruta_carpeta()();
    const mostrarRuta = document.getElementById('carpetaSeleccionada')
    mostrarRuta.innerHTML = `<p style="color: black; font-size: 16px">carpeta Seleccionada ${folderPath}<p>`
    if (folderPath) {
        mostrarNotificacion("✅ Carpeta seleccionada", "green", 10000)
        console.log('Carpeta seleccionada:', folderPath);
    } else {
        console.log('No se seleccionó ninguna carpeta.');
    }
})

guardar.addEventListener('click', async () => {
    const mostrarRuta = document.getElementById('carpetaSeleccionada')
    const ruta = mostrarRuta.textContent.replace('carpeta Seleccionada', "").trim()
    if (ruta){
        const guardar = await eel.guardar_configuracion_exposed(ruta)
        if (!guardar){
            mostrarNotificacion("error con la ruta", "red")
    }
}})
