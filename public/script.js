
const grid=document.querySelector("#grid-videojuegos"); //selecciona el contenedor del grid del html
const estadoCarga=document.querySelector("#estado-carga"); //selecciona el elemento de estado de carga
const estadoError=document.querySelector("#estado-error"); //selecciona el elemento de estado de error

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
                <h3 class="font-semibold text-slate-900 leading-tight">${titulo}</h3>
                <p class="text-xs text-slate-500">
                        Precio: ${normal && normal !== "—" ? `<s>$${normal}</s>` : "—"}
                        ${oferta && oferta !== "—" ? ` · <span class="font-semibold text-slate-900">$${oferta}</span>` : ""}
                        ${ahorro ? ` · Ahorro ${ahorro}%` : ""}
                </p>
                <button class="mt-2 w-full bg-slate-900 text-white py-2 rounded-lg text-sm hover:bg-slate-800">
                        Ver detalle
                </button>
                </div>
            `;
//Agregar la card al grid
        grid.appendChild (card);

        
    });
}


async function cargarVideojuegosInicial(){ 
     //Async significa que la función maneja operaciones asincrónicas y puede usar await
    try {
     const url="https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=20";
    const resp= await fetch (url); //espera la respuesta de la API
    const datos= await resp.json(); //convierte la resp a JSON

    window._juegosCache= datos; //cache para reutilizar los datos si es necesario util para el input de busqueda
    
    renderizarvideojuegos(datos); //Renderiza los videojuegos en el grid
    } catch (e) {
        //En caso de error, muestra los videojuegos locales
        console.error("Error al cargar los videojuegos desde la API:", e);
        renderizarvideojuegos(videojuegosLocales);
    }
}

cargarVideojuegosInicial();

