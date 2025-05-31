const btnMp3 = document.getElementById('MP3');
const videoButton = document.getElementById('MP4')
const btnDelete = document.getElementById('delete')
const btnSelectFolder = document.getElementById("btnFolder")
const guardar = document.getElementById('guardar')
const abrirMenu = document.getElementById('botonMenu')
const cerrarMenu = document.getElementById('cerrarMenu')
const menu = document.getElementById('menuDesplegable')
const resetBtn = document.getElementById('reset')
const newContainer = document.createElement('div')
const flexContainer = document.getElementById('container-flex')
const loaderContainer = document.getElementById('loader-container');
const separador = document.getElementById('hr')
const urlInput = document.getElementById('url-input')
const img = document.getElementById('imgBtnMenu')

let url = ''
let folderPath

flexContainer.append(newContainer)
// funciones
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

function mostrarNotificacion(mensaje, color, segundos) {
    const notificacion = document.getElementById("notificacion");
    notificacion.textContent = mensaje || "✅ Descarga completada";
    notificacion.style.display = "block";
    notificacion.style.backgroundColor = color || "green";
    notificacion.style.zIndex = '10000'
    let x= segundos || 3000
    setTimeout(() => {
        notificacion.style.display = "none";
    }, x); // Oculta después de 3 segundos
}

function recargarInfo(informacion){
    const mostrarRuta = document.getElementById('carpetaSeleccionada')
    const select = document.getElementById('playlist')
    mostrarRuta.style.visibility = 'visible';
    console.log(informacion);
    if (typeof informacion === 'object'){
            mostrarRuta.innerHTML = `<p class="textmenu">${informacion.ruta}</p>`;
            const optionSelected = select.querySelector(`option[value="${informacion.playlist}"]`)
            const option = select.querySelector (`option[value='${!informacion.playlist}']`)
            if (optionSelected){
                optionSelected.selected = true
                optionSelected.setAttribute('selected', "selected")
                option.removeAttribute('selected')
            }
    }else{
        mostrarRuta.innerHTML = `<p class="textmenu">${informacion}</p>`;
    }

    
}

//descarga

async function handleMp3Click() {
        limpiar()
    const configuracion = await eel.cargar_configuracion_exposed()()
    try{
        let bibrate = ['70k','120k', '160k', '190k', '320k']
        if(configuracion.playlist == true){
        
        const urlsYt= [
            'https://www.youtube.com/',
            'https://youtu',
            "https://music.yout",
        ]
        if(urlsYt.some(baseUrl => url.startsWith(baseUrl)) && !url.startsWith('https://youtube.com/playlist?list=')){
            crearbtones(bibrate, 'musica', true)
        }else if(url.startsWith('https://youtube.com/playlist?list=')){
            mostrarNotificacion('❌ Url error al encontrar calidades!', 'red')
            return
        }
        
        }else{

            crearbtones(bibrate, 'musica', false)
        }
    }catch(error){
        console.log(error);
    }finally{
        hideLoad()
    }
}

async function handleVideoClick() {
    const configuracion = await eel.cargar_configuracion_exposed()()
    limpiar()
    
    try{
        let resoluciones
        let x
        if(configuracion.playlist == true){
        
        if(url && !url.startsWith('https://youtube.com/playlist?list=')){
            showLoader('Buscando Resoluciones...')
            resoluciones = await eel.obtener_resoluciones_exposed(url)()
            x = true
            if(resoluciones.length === 0){
                mostrarNotificacion("❌ No se encontraron resoluciones", "red")
                return
            }
        }else{
            mostrarNotificacion("❌ Error al buscar resoluciones", "red")
            return
        }
        
        }else{
            x = false
            resoluciones = ['720p']
        }
        crearbtones(resoluciones, 'video', x)
        
    }
    catch(error){
        console.log(error);
    }finally{
        hideLoad()
    }
}

function crearbtones(calidades, tipo, x){
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
                    await eel.descargar_video_exposed(url, element, x)()
                    if(x){
                        mostrarNotificacion("✅ Descarga completada")
                    }
                    
                    
                }else if(tipo == "musica"){
                    await eel.descargar_musica_exposed(url, element, x)();
                    mostrarNotificacion("✅ Descarga completada")
                }
                
            }catch(error){
                mostrarNotificacion('❌ Ha habido un error!', 'red')
                console.log(error);
            }finally{
                hideLoad()
            }
        })
    });

}

// eventos

urlInput.addEventListener('input', ()=>{
    url =  urlInput.value
    console.log(url);
})

btnMp3.addEventListener('click', handleMp3Click);

videoButton.addEventListener('click', handleVideoClick)
btnDelete.addEventListener('click', () => {
    urlInput.value = '';
    url = '';
    limpiar();
})

abrirMenu.addEventListener('click', ()=>{
    img.classList.add('spinning')
    menu.classList.add('mostrar')
    setTimeout(()=>{
        img.classList.remove('spinning')
    }, 300)
    abrirMenu.disabled = true
})

btnSelectFolder.addEventListener('click', async () => {
    folderPath = await eel.obtener_ruta_carpeta()();
    
    if (folderPath){
        recargarInfo(folderPath)
    }
    
    if (folderPath) {
        mostrarNotificacion("✅ Carpeta seleccionada", "green")
        console.log('Carpeta seleccionada:', folderPath);
    } else {
        console.log('No se seleccionó ninguna carpeta.');
    }
})

resetBtn.addEventListener('click', async ()=>{
    await eel.guardar_configuracion_exposed("", 'true')();
    const informacion = await eel.cargar_configuracion_exposed()()
    mostrarNotificacion('Conguraciones reseteadas', 'green', 1000)
    recargarInfo(informacion)
})

guardar.addEventListener('click', async () => {
    const select = document.getElementById('playlist')
    const playlistValue = select.value; // <-- Aquí obtienes el valor seleccionado
    try{
        await eel.guardar_configuracion_exposed(folderPath, playlistValue)();
        mostrarNotificacion("✅ Configuración guardada", "green", 500);
    } catch (error) {
        mostrarNotificacion("❌ Error inesperado", "red", 500);
        console.log(error);
    }
})

cerrarMenu.addEventListener('click', ()=>{
    menu.classList.remove('mostrar')
    abrirMenu.disabled = false
})


window.addEventListener('DOMContentLoaded', async () => {
    try {
        const config = await eel.cargar_configuracion_exposed()();
        console.log('Config recibido:', config);
        recargarInfo(config)
    } catch (error) {
        console.log('No se pudo cargar la configuración:', error);
    }
});

window.addEventListener("beforeunload", function () {
    eel.cerrar_app();
});
