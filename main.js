const API = "https://www.thecocktaildb.com/api/json/v1/1/";
let datos = [];

// Elementos
const q = document.getElementById("q");
const category = document.getElementById("category");
const sort = document.getElementById("sort");
const grid = document.getElementById("grid");
const status = document.getElementById("status");

// 1. Cargar bebidas (inicialmente margarita para mostrar algo)
async function cargar() {
  try {
    let res = await fetch(API + "search.php?s=margarita");
    let data = await res.json();
    datos = data.drinks || [];

    // Llenar categorías
    let cats = [...new Set(datos.map(r => r.strCategory))];
    cats.forEach(c => {
      if (c) category.innerHTML += `<option>${c}</option>`;
    });

    mostrar();
  } catch (e) {
    status.textContent = "Error al cargar API";
  } finally {
    status.style.display = "none";
  }
}

// 2. Mostrar cards
function mostrar() {
  let texto = q.value.toLowerCase();
  let cat = category.value;

  let lista = datos.filter(r =>
    (!cat || r.strCategory === cat) &&
    (!texto || r.strDrink.toLowerCase().includes(texto))
  );

  // Ordenamiento
  // Ordenamiento
if (sort.value === "name") {
  lista.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
} else if (sort.value === "glass") {
  lista.sort((a, b) => (a.strGlass || "").localeCompare(b.strGlass || ""));
} else if (sort.value === "alcoholic") {
  lista.sort((a, b) => (a.strAlcoholic || "").localeCompare(b.strAlcoholic || ""));
}

  // Pintar resultados
  grid.innerHTML = lista.map(r => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100">
        <img src="${r.strDrinkThumb}" class="card-img-top">
        <div class="card-body">
          <h6>${r.strDrink}</h6>
          <span class="badge bg-secondary">${r.strCategory||""}</span><br>
          <button class="btn btn-sm btn-primary mt-2" onclick="abrir('${r.idDrink}')">Ver receta</button>
        </div>
      </div>
    </div>
  `).join("") || "<p>No se encontraron resultados</p>";
}

// 3. Abrir modal con detalle
async function abrir(id) {
  let res = await fetch(API + "lookup.php?i=" + id);
  let data = await res.json();
  let r = data.drinks[0];

  document.getElementById("modalTitle").textContent = r.strDrink;
  document.getElementById("meta").textContent = r.strCategory;

  // Construimos la lista de ingredientes
  let ingredientes = "";
  for (let i = 1; i <= 15; i++) {
    let ing = r[`strIngredient${i}`];
    let medida = r[`strMeasure${i}`];
    if (ing) {
      ingredientes += `<li>${medida || ""} ${ing}</li>`;
    }
  }

  // Receta completa
  let receta = `
    <h6>Ingredientes:</h6>
    <ul>${ingredientes}</ul>
    <h6>Instrucciones:</h6>
    <p>${r.strInstructions || "No hay instrucciones disponibles."}</p>
  `;

  document.getElementById("video").innerHTML = receta;

  new bootstrap.Modal(document.getElementById("detailModal")).show();
}

// Eventos
q.oninput = mostrar;
category.onchange = mostrar;
sort.onchange = mostrar;

// Arrancar
cargar();
