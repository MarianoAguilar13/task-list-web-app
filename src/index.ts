import { initMiLista } from "./pages/mi-lista/index";
import { init as initElementTareaEl } from "./components/element-tarea";
import { state } from "./state";

function main() {
  state.subscribe(() => {
    const actualState = state.getState();
    const tareasStingifeado = JSON.stringify(actualState.list);
    localStorage.setItem("listaTareas", tareasStingifeado);

    console.log(localStorage.getItem("listaTareas"));
  });

  initElementTareaEl();
  const container = document.querySelector(".container-page");
  container.appendChild(initMiLista());

  console.log(localStorage.getItem("listaTareas"));

  if (localStorage.getItem("listaTareas") == undefined) {
  } else {
    const listaTareasLocal = { list: [] };
    listaTareasLocal.list = JSON.parse(localStorage.getItem("listaTareas"));
    state.setState(listaTareasLocal);
  }
}
main();
