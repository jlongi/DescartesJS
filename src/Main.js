/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  /**
   * Arreglo donde se guardan los reemplazos de los applets construidos con javascript y html
   * type [DescartesApp]
   * @private
   */
  descartesJS.apps = [];

  /**
   * Crea los remplazos de los applets de Descartes
   */
  function createDescartesApps() {
    // se obtienen todos los applets de Descartes que se van interpretan con javascript
    var applets = getDescartesApplets();
    var applet_i;

    // se construyen los reemplazos de los applets de Descartes
    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      descartesJS.apps.push( new descartesJS.DescartesApp(applet_i) );
      changeClassDescartesJS(applet_i);
    }
  }

  /** 
   * Esconde los applets que se encuentran en el documento utilizando un estilo
   */
  function hideApplets() {
    // se busca un nodo de estilo cuyo identificador sea "StyleDescartesApps"
    var cssNode = document.getElementById("StyleDescartesApps");
    
    // si el nodo ya esta en el DOM se remueve
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    // se crea el estilo, que servira para ocultar los applets java de Descartes
    cssNode = document.createElement("style");
    cssNode.id = "StyleDescartesApps";
    cssNode.type = "text/css";
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.innerHTML = "applet.DescartesJS {display:none;} applet {display:none;}";
    
    // se agrega el estilo a la cabeza del documento de html
    document.head.appendChild(cssNode); 
  }
  
  /** 
   * Muestra los applets que se encuentran en el documento utilizando un estilo
   */
  function showApplets() {
    // se busca un nodo de estilo cuyo identificador sea "StyleDescartesApps"
    var cssNode = document.getElementById("StyleDescartesApps");

    cssNode.innerHTML = "applet {display:block;}";
  }
  
  /** 
   * Vuelve a mostrar los applets que no son descartesJS
   */
  function showNoDescartesJSApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS {display:none;}";
  }
  
  /**
   * Obtiene los applets en el documento
   * @return {[<applet>]} los applets de Descartes en el documento
   */
  function getDescartesApplets() {
    // se obtienen todos los elementos del DOM cuya etiqueta sea del tipo applet
    var applets = document.getElementsByTagName("applet");
    var applet_i;
    
    // se crea un arreglo donde guardar los applets encontrados
    var tmpArrayApplets = [];

    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      
      // 
      // si en el atributo del codigo se encuentra la cadena DescartesJS o Descartes.class, entonces ese applet se agrega a la lista de applets a reemplazar
//       if ( ((applet_i.getAttribute("code").match("DescartesJS")) || (applet_i.getAttribute("code").match("Descartes.class"))) && 
//            (applet_i.getAttribute("code").match("descinst.DescartesBasico")) //|| (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class"))
//          ) {
//       // si en el atributo del codigo se encuentra la cadena DescartesJS, entonces ese applet se agrega a la lista de applets a reemplazar
//       if (applet_i.getAttribute("code").match("DescartesJS")) {
      if ( (applet_i.getAttribute("code").match("DescartesJS")) || 
           (applet_i.getAttribute("code").match("Descartes.class")) || 
           (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class"))
         ) {
        tmpArrayApplets.push(applet_i);
      }
    }
    
    return tmpArrayApplets;
  }
  
  /**
   * Cambia la clase de CSS del applet a "DescartesJS"
   * @param {<applet>} applet el applet al que se le cambia la clase
   */
  function changeClassDescartesJS(applet) {
    applet.className = "DescartesJS";
  }

  /**
   * Remueve los restos de una interpretacion anterior, en el caso de que la pagina haya sido salvada desde el navegador
   * Sirve para garantizar que una pagina salvada pueda ser interpretada de nuevo
   */
  function removeDescartesAppContainers() {
    // se buscan todas las etiquetas del documento HTML
    var allHTMLTags = document.getElementsByTagName("*");
    
    // arreglo para guardar los elementos a remover
    var toBeRemove = [];
    
    for (var i=0, l=allHTMLTags.length; i<l; i++) {
      // si se encuentra un elemento del tipo "DescartesAppContainer", entonces se agrega a lista de elementos a remover
      if (allHTMLTags[i].className == "DescartesAppContainer") {
        toBeRemove.push(allHTMLTags[i]);
      }
    }

    // se remueven los elementos encontrados del documento
    for (var i=0, l=toBeRemove.length; i<l; i++) {
      (toBeRemove[i].parentNode).removeChild(toBeRemove[i]);
    }
  }
  
  /**
   * Regresa el arreglo de todas las lecciones de descartes interpretadas con javascript
   * @return {[DescartesApp]}
   */
  descartesJS.getDescartesApps = function() {
    return descartesJS.apps;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Lo que sigue se ejecuta inmediatamente
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // se ocultan los applets de java al inicio para evitar que se carge la maquina virtual

  // si la variable removeApplet existe y es verdadera, entonces se ocultan los applets
  if (!(window.hasOwnProperty('debugDescartesJS') && debugDescartesJS)) { 
    hideApplets();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  

  /**
   * Funcion que se ejecuta cada vez que el navegador cambia de tamano
   */
  function onResize(evt) {
    for (var i=0, l=descartesJS.apps.length; i<l; i++) {
      for (var j=0, k=descartesJS.apps[i].spaces.length; j<k; j++) {
        descartesJS.apps[i].spaces[j].findOffset()
      }
    }
  }
  
  /**
   * Funcion que se ejecuta despues de cargar la pagina, para la interpretacion y reemplazo de los applets de descartes
   */
  function onLoad(evt) {
    // se obtienen algunas caracteristicas necesarias para interpretar las lecciones, como el soporte de eventos touch
    descartesJS.getFeatures();
    
    // si tiene soporte para canvas, que es el elemento principal para la interpretacion, entonces procedemos a crear el reemplazo
    if (descartesJS.hasCanvasSupport) {
      removeDescartesAppContainers();
      createDescartesApps();
      showNoDescartesJSApplets();
      window.addEventListener("resize", onResize, false);
    } 
    // si no tiene soporte para el canvas, entonces los applets se muestran esperando ser interpretados con Java
    else {
      showApplets();
    }
  }
  
  /**
   * Comunicacion con espacios iframe
   */
  descartesJS.receiveMessage = function(event) {
    if (descartesJS.apps.length !== 0) {
      var data = event.data;
      
      // asigna el valor a una variable
      if (data && (data.type === "set")) {
        descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
      }
      
      // actualiza una escena
      else if (data && (data.type === "update")) {
        descartesJS.apps[0].update();
      }
      
// //       // obtiene el valor de una variable
// //       else if (data && (data.type === "get")) {
// //         event.source.postMessage({ type: "getResult", name: data.value, value: descartesJS.apps[0].evaluator.getVariable(data.name) }, '*');
// //       }
// //       
// //       // obtiene el valor de una variable
// //       else if (data && (data.type === "getResult")) {
// // //         descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
// // //         descartesJS.apps[0].update();
// //       }
      
      // ejecuta una funcion
      else if (data && (data.type === "exec")) {
        var fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        var params = [];
        if (data.value !== "") {
          params = (data.value.toString()).split(",");
        }
        
        if (fun) {
          fun.apply(descartesJS.evaluator, params);
        }
      }
      
    }
  }

  // si multiples apariciones de la biblioteca aparecen
  if (descartesJS.loadLib === undefined) {
    descartesJS.loadLib = true;
    // se registra la funcion de inico al evento de carga de la ventana
    window.addEventListener("load", onLoad, false);
    
    // se registra la funcion para paso de mensajes
    window.addEventListener("message", descartesJS.receiveMessage, false);
  }

  return descartesJS;
})(descartesJS || {});

