import { state } from "../../state";
import { init as initElementTareaEl } from "../../components/element-tarea";

export function initMiLista() {
  //creo la base de la page, que se trata de un titulo y el form para agregar la nueva tarea
  const div = document.createElement("div");
  div.innerHTML = `
        <h2 class="titulo-pincipal">
          Welcome to the Task-list
        </h2>
        <form class="form">
            <label class="label">
                Nuevo pendiente
                <input class="input" name="text" type="text">
            </label>
            <button class="boton-form">Agregar</button>
        </form>
        <div class="container-lista">
        </div>
        `;

  //la page se suscribe al state para escuchar sus cambios
  state.subscribe(() => {
    const container = document.querySelector(".container-lista");

    //cada vez que inserto un elemento nuevo, primero borro todo
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    //data array de las tareas que no esten borradas es una data.list
    const data = state.getTareasNoBorradas();

    //ahora recorro la lista de las tareas que no fueron eliminadas
    for (const tarea of data) {
      //guardo en una variable las caracteristicas de cada tarea
      const text = tarea.texto;
      const completada = tarea.completada;
      const borrada = tarea.borrada;
      const cod = tarea.cod;

      //por cada tarea voy a agregar un customElement  <element-tarea-el>
      //con las siguientes propiedades, que son las caracteristicas de la tarea
      //el codigo es muy importante para saber con cual customElent voy a estar interactuando
      const newTareaEl = document.createElement("div");
      newTareaEl.innerHTML = `
        <element-tarea-el textoMostrar="${text}" estaChecked="${completada}" estaBorrado="${borrada}" codigo="${cod}">
        </element-tarea-el>
        `;

      container.appendChild(newTareaEl);
    }
  });

  //cuando hago un submit en el form de la nueva tarea, voy a modificar el state
  //haciendo un addItem de una nueva tarea, con completada y borrrada iniciada con false
  //y el texto va a ser lo que ingrese en el imput
  const inputFormEl = div.querySelector(".input") as any;
  const form = div.querySelector(".form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const textInput = e.target as any;

    const tarea = {
      texto: textInput.text.value,
      completada: false,
      borrada: false,
    };

    //reseteo el contenido del input para que el usuario no tenga que borrarlo
    inputFormEl.value = "";

    state.addItem(tarea);
  });

  return div;
}
