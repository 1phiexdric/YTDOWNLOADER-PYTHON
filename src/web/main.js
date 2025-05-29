let url = ''
// botones
const btnMp3 = document.getElementById('MP3');
const videoButton = document.getElementById('MP4')
const btnDelete = document.getElementById('delete')

//containers
const newContainer = document.createElement('div')
const flexContainer = document.getElementById('container-flex')
flexContainer.append(newContainer)

//others
const separador = document.getElementById('hr')
const urlInput = document.getElementById('url-input')
urlInput.addEventListener('input', ()=>{
    url =  urlInput.value
    console.log(url);
})

btnMp3.addEventListener('click', async () => {
    limpiar()

    try{
        let bibrate = ['70k','128k', '160k', '190k', '320k']
        if (url){
            showLoader('Buscando Bibrates...')
        }else{
            mostrarNotificacion('❌ Url vacia', 'red')
        }
        crearbtones(bibrate, 'musica')
    }catch(error){
        console.log(error);
    }finally{
        hideLoad()
    }
    limpiar()
});



videoButton.addEventListener('click', async()=>{
    limpiar()
    
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
        hideLoad()
        crearbtones(resoluciones, 'video')
    }
    catch(error){
        console.log(error);
    }
})

btnDelete.addEventListener('click', () => {
    urlInput.value = '';
    url = '';
    limpiar();
})

const loaderContainer = document.getElementById('loader-container');

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

function crearbtones(calidades, tipo){
    newContainer.innerHTML=""
    newContainer.id = 'resolution-container'
    const h2 = document.createElement('h2')
    h2.id = 'resolution-title'
    h2.textContent = "calidades disponibles"
    const newdiv = document.createElement('div')
    newdiv.id= 'resolution-buttons'
    newContainer.append(h2, newdiv)
    //separador.classList.add('visible')
    calidades.forEach(element => {
        const btn = document.createElement('button')
        btn.textContent = element
        btn.classList.add('btn')
        btn.classList.add('resoluciones')
        separador.classList.add('visible')
        newdiv.append(btn)
        btn.addEventListener('click', async ()=>{
            showLoader('Descargando...')
            try{

                if(tipo == "video"){
                    await eel.descargar_video_exposed(url, element)()
                }else if(tipo == "musica"){
                    await eel.descargar_musica_exposed(url, element)();
                }
                mostrarNotificacion("✅ Descarga completada")
            }catch(error){
                console.log(error);
            }finally{
                hideLoad()
            }
        })
    });

}