function crearBotones(cantidad, titulo){
    const h3 = document.createElement('h3')
    h3.id = 'resolution-title'
    h3.textContent = titulo
    const newdiv = document.createElement('div')
    newdiv.id = 'resolution-buttons'
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
}

crearBotones()