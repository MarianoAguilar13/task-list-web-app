import { state } from "../state";

export function init() {
  class ElementTareaEl extends HTMLElement {
    // Specify observed attributes so that
    // attributeChangedCallback will work
    //estos son los atributos que voy a estar obsevando su cambios
    static get observedAttributes() {
      return ["textoMostrar", "estaChecked", "estaBorrado", "codigo"];
    }

    shadow = this.attachShadow({ mode: "open" });

    constructor() {
      // Always call super first in constructor
      super();
      this.render();
    }

    //creo el style del customElement
    render() {
      let style = document.createElement("style");
      style.textContent = `
      .tarea {
        font-family: "Poppins", sans-serif;
        font-size: 18px;
        display: flex;
        min-width: 311px;
        min-height: 122px;
        max-width: 400px;
        background-color: greenyellow;
        flex-direction: column;
        padding: 22px 13px;
        justify-content: space-between;
        border: solid black 2px;
        margin: 20px auto;
      }
      
      .tarea-container-labelinput {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
      }
      
      .tarea-label {
        align-items: center;
      }
      
      .tarea-input {
        min-width: 20px;
        min-height: 20px;
        max-width: 30px;
        max-height: 30px;
        align-items: center;
      }
      
      .tarea-boton {
        font-family: "Poppins", sans-serif;
        width: 80px;
        height: 40px;
        align-self: flex-end;
        border-radius: 5px;
        background-color: #5ae3fc;
        color: black;
        visibility: hidden;
      }
      
      .tarea-label.true {
        text-decoration: line-through;
      }
      
      .tarea-label.false {
        text-decoration: none;
      }
                `;
      // tarea:{
      //    codigo: number,
      //    nombre: string,
      //    completada: boolean,  true--> completada , false-->pendiente
      //    borrada: boolean
      //}

      //creo la estructura del customElement
      this.shadow.innerHTML = `
      <div class="tarea">
          <div class="tarea-container-labelinput">
              <label class="tarea-label"> </label>
              <input class="tarea-input" type="checkbox" />
          </div>
          <button class="tarea-boton">Eliminar</button>
      </div>
  `;

      const tarea = this.shadow.querySelector(".tarea") as any;

      tarea.addEventListener("click", (e) => {
        const boton = tarea.querySelector(".tarea-boton") as any;
        const label = tarea.querySelector(".tarea-label") as any;
        boton.style.visibility = "visible";
        tarea.style.backgroundColor = "blueviolet";
        label.style.color = "whitesmoke";
      });
      //Si quiero escuchar el evento de algunos de los elementos que
      //componen este custom element, tengo que agregar los eventos
      //antes que se renderice el custom element, asi cuando interactue
      //con los elementos que estan dentro del custom element, van a poder
      //ser escuchados y si estos eventos modifican el state y guardan
      //el nuevo state, no abra problemas funcionara todo correctamente.
      //la clave para que sepa con cual customElement estoy interactuando
      //es con el atributo codigo que es unico para cada tarea/elemento

      //antes de que se ejecute el render voy a crear un evento
      //este evento es cuando realizo un click en el input checkbox
      //voy a modificar el state segun el valor que obtuve del input
      //cuando le realice click
      const checkEl = this.shadow.querySelector(".tarea-input");
      checkEl.addEventListener("click", (e) => {
        const target = e.target as any;

        //si el input checkbox esta
        if (target.checked == true) {
          const cod = this.getAttribute("codigo");
          //primero chequeo si el valor de checked del input es true.
          //guardo el valor del atributo codigo, como este valor es unico
          //voy a recorrer el array de la data.list actualizada y donde
          //coincida los codigos, cambio la tarea a completada,
          // ya que estaba tildada y su valor era true
          //si la destilde con el click etonces voy por el else y hago lo mismo
          //pero con false

          const ultimaData = state.getState();

          for (const tarea of ultimaData.list) {
            if (tarea.cod == cod) {
              tarea.completada = true;
            }
          }

          state.setState(ultimaData);
        } else {
          const cod = this.getAttribute("codigo");

          const ultimaData = state.getState();

          for (const tarea of ultimaData.list) {
            if (tarea.cod == cod) {
              tarea.completada = false;
            }
          }
          state.setState(ultimaData);
        }
      });

      //En este evento voy a modificar el state cuando haga click en el boton eliminar
      //voy a setear como eliminado a la tarea en donde se realizo el click en eliminar
      const botonEliminar = this.shadow.querySelector(".tarea-boton");
      botonEliminar.addEventListener("click", (e) => {
        e.preventDefault();
        //sigo la misma logica del evento anterior con respecto al codigo
        const cod = this.getAttribute("codigo");

        const ultimaData = state.getState();

        for (const tarea of ultimaData.list) {
          if (tarea.cod == cod) {
            tarea.borrada = true;
          }
        }
        //seteo el nuevo state
        state.setState(ultimaData);
      });

      this.shadow.appendChild(style);
    }

    //cuando se agrega el custom element al DOM, el connectedCallback
    //ejecuta la funcion modificaarTarea, con
    connectedCallback() {
      // console.log("Custom square element added to page.");
      modificarTarea(this);
    }

    disconnectedCallback() {
      //  console.log("Custom square element removed from page.");
    }

    adoptedCallback() {
      // console.log("Custom square element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      modificarTarea(this);
    }
  }

  function modificarTarea(el: any) {
    const shadow = el.shadowRoot;
    shadow.querySelector(".tarea-label").textContent =
      el.getAttribute("textoMostrar");

    let checkedBool: boolean;

    //verifico que valor tiene el atributo estaChecked, si es false,
    //a la variable checedBool la seteo en false, sino en true
    if (el.getAttribute("estaChecked") == "false") {
      checkedBool = false;
    } else {
      checkedBool = true;
    }

    //luego en el atributo checked del input lo pongo en true o false
    //dependiendo lo que diga la tarea del state
    shadow.querySelector(".tarea-input").checked = checkedBool;

    //le agrago una nueva clase al label, que va a ser si esta checked
    //si esta checked se agragara la clase true, entonces si tiene la clase true
    //en css le tacho el label con line-through, si es false el text-decoration=none
    shadow
      .querySelector(".tarea-label")
      .classList.add(el.getAttribute("estaChecked"));
  }

  customElements.define("element-tarea-el", ElementTareaEl);
}
