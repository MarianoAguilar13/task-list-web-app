const state = {
  data: {
    list: [],
  },
  //lista va a ser un array de tareas
  // tarea va a ser una objeto del siguiente tipo
  // tarea = {
  //  codigo: number,
  //  texto: String,
  //  completada: boolean,
  //  borrada: boolean,
  //};

  //el listener es un array de funciones, que van a hacer algo cuando
  //cambie el state
  listeners: [], // los callbacks

  getState() {
    return this.data;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    //cb de callback
    //cada vez que se modifica el state se ejecutan los cb suscriptos
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },

  //siempre que modifico el state, primero debo traerme el ultimo state
  //luego modifico el state y por ultimo hago el setState, para decir
  //los cambios que hubo
  addItem(item) {
    // suma la nueva tarea a la lista
    // este item va a ser un objeto con las caracteristicas nombradas
    const cs = this.getState(); //me trago el ultimo state
    let posicion = cs.list.length;
    item.cod = posicion; //el cod que sera nuestro codigo unico
    //esta establecido por la posicion de la tarea en el array list

    cs.list.push(item); //modifico list agregando la nueva tarea

    this.setState(cs); //cargo el nuevo state
  },

  //verifica cuales tareas estan borradas y devuelve las no borradas
  //asi posteriormente solo renderizar las que no fueron borradas
  getTareasNoBorradas() {
    const ultimoState = this.getState();
    return ultimoState.list.filter((t) => t.borrada == false);
  },
};

export { state };
