
const grid=document.querySelector("#grid-videojuegos"); //selecciona el contenedor del grid del html
const estadoCarga=document.querySelector("#estado-carga"); //selecciona el elemento de estado de carga
const estadoError=document.querySelector("#estado-error"); //selecciona el elemento de estado de error

// Variables de paginación
let paginaActual = 1;
const resultadosPorPagina = 20;
let busquedaActual = "";
let todosLosJuegos = [];

//Videojuegos de ejemplo si falla API
const videojuegosLocales=[
 {
        title: "Elden Ring",
        thumb: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.png",
        normalPrice: "-",
        salePrice: "-",
        savings: null,
    },

    {
        title: "God of War",
        thumb: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6a5r.png",
        normalPrice: "-",
        salePrice: "-",
        savings: null,
    }, 
]


function renderizarvideojuegos (ista){
    grid.innerHTML=""; //limpia el contenido previo

    ista.forEach((juego) => { 

        const titulo=juego.title || juego.external || "Titulo Desconocido"; //manejo de datos faltantes
        const imagen=juego.thumb || juego.image || " "; //imagen por defecto si falta
        const  normal=juego.normalPrice ?? "-"; //operador nulish verifica si es nulo o indefinido y en ese caso asigna ese valor
        const  oferta=juego.salePrice ?? juego.cheapest ?? "-"; //manejo de datos faltantes
        const  ahorro=juego.savings ? Math.round (Number(juego.savings)) : null; //convierte a numero yredondea el ahorro si existe

        //itera sobre cada juego en la lista
        //crear el html de cada card
        const card= document.createElement("element");
        card.className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col"; //clases de tailwindcss
        //Agregamos el contenido de la card
        card.innerHTML = `
            <img src="${imagen}" alt="${titulo}" class="h-40 w-full object-cover" />
                <div class="p-4 flex flex-col gap-2 flex-1">
                <h3 class="font-semibold text-black leading-tight">${titulo}</h3>
                <p class="text-xs text-slate-500">
                        Precio: ${normal && normal !== "—" ? `<s>$${normal}</s>` : "—"}
                        ${oferta && oferta !== "—" ? ` · <span class="font-semibold text-slate-900">$${oferta}</span>` : ""}
                        ${ahorro ? ` · Ahorro ${ahorro}%` : ""}
                </p>
                <button class="mt-2 w-full bg-slate-700 text-white py-2 rounded-lg text-sm hover:bg-slate-800 ver-detalle-btn">
                        Ver detalle
                </button>
                </div>
            `;
//Agregar la card al grid
        grid.appendChild (card);

                // Agregar evento al botón "Ver detalle"
        const btnVerDetalle = card.querySelector(".ver-detalle-btn");
        btnVerDetalle.addEventListener("click", async function() {
            this.innerHTML = `<span class="inline-block animate-spin">⏳</span> Cargando...`;
            this.disabled = true;
            
            // Simular carga de 2 segundos
            setTimeout(() => {
                // Llenar el modal con la información del juego
                document.querySelector("#modal-imagen").src = imagen;
                document.querySelector("#modal-titulo").textContent = titulo;
                document.querySelector("#modal-precio-normal").textContent = normal !== "-" ? `$${normal}` : "-";
                document.querySelector("#modal-precio-oferta").textContent = oferta !== "-" ? `$${oferta}` : "-";
                
                // Mostrar ahorro si existe
                const ahorroElement = document.querySelector("#modal-ahorro");
                if (ahorro) {
                    ahorroElement.textContent = `Ahorras: ${ahorro}%`;
                } else {
                    ahorroElement.textContent = "";
                }
                
                // Agregar enlace a la tienda (URL de CheapShark)
                const enlaceElement = document.querySelector("#modal-enlace-tienda");
                enlaceElement.href = `https://www.cheapshark.com/search?q=${encodeURIComponent(titulo)}`;
                
                // Mostrar el modal
                document.querySelector("#modal-juego").classList.remove("hidden");
                
                this.innerHTML = "Ver detalle";
                this.disabled = false;
            }, 2000);
        });
    });
}   
// Cerrar modal
document.querySelector("#cerrar-modal").addEventListener("click", function() {
    document.querySelector("#modal-juego").classList.add("hidden");
});

// Cerrar modal al hacer clic fuera
document.querySelector("#modal-juego").addEventListener("click", function(e) {
    if (e.target === this) {
        this.classList.add("hidden");
    }
});



async function cargarVideojuegosInicial(){ 
     //Async significa que la función maneja operaciones asincrónicas y puede usar await
    try {
        const url="https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=60";
        const resp= await fetch (url);
        const datos= await resp.json();

        todosLosJuegos = datos;
        paginaActual = 1;
        renderizarPagina();
    } catch (e) {
        console.error("Error al cargar los videojuegos desde la API:", e);
        todosLosJuegos = videojuegosLocales;
        renderizarPagina();
    }
}

// Función para renderizar una página específica
function renderizarPagina() {
    const inicio = (paginaActual - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const juegosPagina = todosLosJuegos.slice(inicio, fin);
    
    renderizarvideojuegos(juegosPagina);
    actualizarBotonesPaginacion();
}

// Función para actualizar botones de paginación
function actualizarBotonesPaginacion() {
    const totalPaginas = Math.ceil(todosLosJuegos.length / resultadosPorPagina);
    
    document.querySelector("#numero-pagina").textContent = `Página ${paginaActual} de ${totalPaginas}`;
    document.querySelector("#btn-anterior").disabled = paginaActual === 1;
    document.querySelector("#btn-siguiente").disabled = paginaActual === totalPaginas;
}

// Evento botón Anterior
document.querySelector("#btn-anterior").addEventListener("click", function() {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarPagina();
        window.scrollTo(0, 0); // Scroll hacia arriba
    }
});

// Evento botón Siguiente
document.querySelector("#btn-siguiente").addEventListener("click", function() {
    const totalPaginas = Math.ceil(todosLosJuegos.length / resultadosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarPagina();
        window.scrollTo(0, 0); // Scroll hacia arriba
    }
});

cargarVideojuegosInicial();

// Eventos de búsqueda
setTimeout(() => {
    const btnBuscar = document.querySelector("#btn-buscar");
    const inputBusqueda = document.querySelector("#input-busqueda");
    
    if (btnBuscar) {
        btnBuscar.addEventListener("click", function() {
            const titulo = inputBusqueda.value;
            buscarVideojuegos(titulo);
        });
    }
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                buscarVideojuegos(this.value);
            }
        });
    }
}, 100);

// Función para buscar videojuegos por nombre
async function buscarVideojuegos(titulo) {
    if (!titulo.trim()) {
        alert("Por favor ingresa un nombre de juego");
        return;
    }
    
    try {
        estadoCarga.classList.remove("hidden");
        estadoError.classList.add("hidden");
        
        // Usar IGDB API a través de RapidAPI (alternativa gratuita)
        const respuesta = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(titulo)}&limit=20`);
        const datos = await respuesta.json();
        
        console.log("Respuesta de CheapShark:", datos); // Debug
        
        if (!datos || datos.length === 0) {
            estadoError.classList.remove("hidden");
            estadoError.textContent = "No se encontraron juegos con ese nombre";
            grid.innerHTML = "";
        } else {
            // Mapear datos de CheapShark al formato esperado
            const juegosFormateados = datos.map(juego => ({
                title: juego.external,
                thumb: juego.thumb,
                normalPrice: "-",
                salePrice: juego.cheapest || "-",
                savings: null
            }));
            
            renderizarvideojuegos(juegosFormateados);
            estadoError.classList.add("hidden");
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        estadoError.classList.remove("hidden");
        estadoError.textContent = "Error al buscar. Intenta de nuevo.";
    } finally {
        estadoCarga.classList.add("hidden");
    }
}

// Evento al botón Buscar - DESPUÉS de definir la función
setTimeout(() => {
    const btnBuscar = document.querySelector("#btn-buscar");
    const inputBusqueda = document.querySelector("#input-busqueda");
    
    if (btnBuscar) {
        btnBuscar.addEventListener("click", function() {
            const titulo = inputBusqueda.value;
            buscarVideojuegos(titulo);
        });
    }
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                buscarVideojuegos(this.value);
            }
        });
    }
}, 100);