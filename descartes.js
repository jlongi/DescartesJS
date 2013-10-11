/**
 * @preserve Joel Espinosa Longi
 * j.longi@gmail.com
 * https://github.com/jlongi/DescartesJS
 * LGPL - http://www.gnu.org/licenses/lgpl.html
 * 2013-10-10
 */

/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  if (babel.loadLib) { return babel; }
 
//  babel["espa\u00F1ol"] = babel["english"] = babel["catal\u00E0"] = babel["euskera"] = babel["fran\u00E7ais"] = babel["galego"] = babel["portugu\u00EAs"] = babel["valenci\u00E0"] = "";
  babel["falso"] = babel["false"] = babel["fals"] = babel["gezurra"] = babel["faux"] = babel["fals"] = "false";
  babel["verdadero"] = babel["true"] = babel["veritable"] = babel["egia"] = babel["vrai"] = babel["verdadeiro"] = babel["veritable"] = "true";
  babel["no"] = babel["ez"] = babel["non"] = babel["n\u00E3o"] = "false";
  babel["s\u00ED"] = babel["yes"] = babel["bai"] = babel["oui"] = babel["si"] = babel["sim "] = "true";
  babel["negro"] = babel["black"] = babel["negre"] = babel["beltza"] = babel["noir"] = babel["preto"] = "#000000";
  babel["maxenta"] = babel["magenta"] = "#ff00ff";
  babel["azul"] = babel["blue"] = babel["blau"] = babel["urdina"] = babel["bleu"] = "#0000ff";
  babel["turquesa"] = babel["cyan"] = babel["turkesa"] = babel["turquoise"] = "#00ffff";
  babel["verde"] = babel["green"] = babel["verd"] = babel["berdea"] = babel["vert"] = "#00ff00";
  babel["amarillo"] = babel["yellow"] = babel["groc"] = babel["horia"] = babel["jaune"] = babel["amarelo"] = "#ffff00";
  babel["naranja"] = babel["orange"] = babel["taronja"] = babel["laranja"] = babel["laranxa"] = "#ffc800";
  babel["rojo"] = babel["red"] = babel["vermell"] = babel["gorria"] = babel["rouge"] = babel["vermello"] = babel["vermelho"] = "#ff0000";
  babel["pink"] = babel["rosa"] = babel["arrosa"] = babel["rose"] = "#ffafaf";
  babel["grisObscuro"] = babel["darkGray"] = babel["grisFosc"] = babel["gris iluna"] = babel["grisObscur"] = babel["grisEscuro"] = babel["cinzaEscuro"] = "#404040";
  babel["gris"] = babel["gray"] = babel["grisa"] = babel["cinza"] = "#808080";
  babel["grisClaro"] = babel["lightGray"] = babel["grisClar"] = babel["gris argia"] = babel["grisClair"] = babel["cinzaClaro"] = "#c0c0c0";
  babel["blanco"] = babel["white"] = babel["blanc"] = babel["zuria"] = babel["branco"] = "#ffffff";
  babel["escala"] = babel["scale"] = babel["eskala"] = babel["\u00E9chelle"] = "scale";
//  babel["Se puede copiar este texto y pegarlo en una p\u00E1gina Web."] = babel["You may copy this text and paste it on a Web page."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = babel["Testu hau kopia dezakezu eta web orri batean itsasi."] = babel["Vous pouvez copier ce texte et l'accrocher en une page web."] = babel["Pode copiar este texto e pegalo nunha p\u00E1xina Web."] = babel["Voc\u00EA pode copiar este texto e col\u00E1-lo em uma p\u00E1gina WEB."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = "";
  babel["nombre"] = babel["name"] = babel["nom"] = babel["izena"] = babel["nome"] = "name";
//  babel["editable"] = babel["editable"] = babel["editable"] = babel["editagarria"] = babel["editable"] = babel["editable"] = babel["modific\u00E1vel"] = babel["editable"] = "";
  babel["ikusgai"] = babel["vis\u00EDvel"] = babel["visible"] = "visible";
  babel["rastro"] = babel["trace"] = babel["rastre"] = babel["arrastoa"] = "trace";
//   babel["control"] = babel["control"] = babel["control"] = babel["kontrola"] = babel["contr\u00F4le"] = babel["control"] = babel["controle"] = babel["control"] = "";
  babel["fondo"] = babel["background"] = babel["fons"] = babel["hondoa"] = babel["fond"] = babel["fundo"] = "background";
  babel["colour"] = babel["color"] = babel["kolorea"] = babel["couleur"] = babel["cor"] = "color";
  babel["par\u00E1metro"] = babel["parameter"] = babel["parametroa"] = babel["par\u00E2metro"] = babel["par\u00E0metre"] = "parameter";
  babel["sucesi\u00F3n"] = babel["sequence"] = babel["successi\u00F3"] = babel["segida"] = babel["succession"] = babel["seq\u00FC\u00EAncia"] = "sequence";
  babel["tama\u00F1o"] = babel["size"] = babel["neurria"] = babel["taille"] = babel["tamanho"] = babel["grand\u00E0ria"] = "size";
  babel["decimales"] = babel["decimals"] = babel["hamartarra"] = babel["d\u00E9cimales"] = babel["decimais"] = "decimals";
  babel["red"] = babel["net"] = babel["xarxa"] = babel["sarea"] = babel["r\u00E9seau"] = babel["rede"] = babel["malha"] = "net";
  babel["red10"] = babel["net10"] = babel["xarxa10"] = babel["sarea10"] = babel["r\u00E9seau10"] = babel["rede10"] = babel["malha10"] = "net10";
  babel["ejes"] = babel["axes"] = babel["eixos"] = babel["ardatzak"] = babel["eixes"] = "axes";
  babel["texto"] = babel["text"] = babel["testua"] = babel["texte"] = "text";
  //////////////////////////////
  // configuration buttons
  //////////////////////////////
  babel["cr\u00E9ditos"] = babel["about"] = babel["cr\u00E8dits"] = babel["kreditoak"] = babel["cr\u00E9dits"] = babel["sobre"] = "about";
  babel["config"] = babel["konfig"] = babel["configura\u00E7\u00E3o"] = "config";
  babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
  babel["limpiar"] = babel["clear"] = babel["neteja"] = babel["ezabatu"] = babel["nettoye"] = babel["limpar"] = "clear";
  //////////////////////////////
  babel["incr"] = babel["gehi"] = babel["incremento"] = "incr";
  babel["min"] = babel["inf"] = "min";
  babel["max"] = babel["sup"] = babel["m\u00E1x"] = "max";
  babel["relleno"] = babel["fill"] = babel["ple"] = babel["betea"] = babel["plein"] = babel["recheo"] = babel["preencher"] = "fill";
  babel["relleno+"] = babel["fill+"] = babel["ple+"] = babel["betea+"] = babel["plein+"] = babel["recheo+"] = babel["preencher+"] = "fillP";
  babel["relleno-"] = babel["fill-"] = babel["ple-"] = babel["betea-"] = babel["plein-"] = babel["recheo-"] = babel["preencher-"] = "fillM";
  babel["flecha"] = babel["arrow"] = babel["fletxa"] = babel["gezia"] = babel["fl\u00E8che"] = babel["frecha"] = babel["seta"] = "arrow";
  babel["ancho"] = babel["width"] = babel["ample"] = babel["zabalera"] = babel["large"] = babel["largura"] = "width";
  babel["punta"] = babel["spear"] = babel["muturra"] = babel["pointe"] = babel["ponta"] = "spear";
  babel["regi\u00F3n"] = babel["region"] = babel["regi\u00F3"] = babel["eskualde"] = babel["r\u00E9gion"] = babel["rexi\u00F3n"] = babel["regi\u00E3o"] = "region";
  babel["norte"] = babel["north"] = babel["nord"] = babel["ipar"] = "north";
  babel["sur"] = babel["south"] = babel["sud"] = babel["hego"] = babel["sul"] = "south";
  babel["este"] = babel["east"] = babel["est"] = babel["ekialde"] = babel["leste"] = "east";
  babel["oeste"] = babel["west"] = babel["oest"] = babel["hegoalde"] = babel["ouest"] = "west";
  babel["exterior"] = babel["external"] = babel["kanpoalde"] = babel["externo"] = "external";
  babel["expresi\u00F3n"] = babel["expresion"] = babel["expresi\u00F3"] = babel["adierazpen"] = babel["express\u00E3o"] = "expresion";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["posici\u00F3n"] = babel["position"] = babel["posici\u00F3"] = babel["posizio"] = babel["posi\u00E7\u00E3o"] = "position";
  babel["constricci\u00F3n"] = babel["constraint"] = babel["constricci\u00F3"] = babel["beharte"] = babel["constriction"] = babel["constrici\u00F3n"] = babel["restri\u00E7\u00E3o"] = "constraint";
//  babel["infinito"] = babel["infinity"] = babel["infinit"] = babel["infinitu"] = babel["infini"] = babel["infinito"] = babel["infinito"] = babel["infinit"] = "";
  babel["valor"] = babel["value"] = babel["balio"] = babel["valeur"] = "value";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
  babel["curva"] = babel["curve"] = babel["corba"] = babel["kurba"] = babel["courbe"] = "curve";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
  babel["punto"] = babel["point"] = babel["punt"] = babel["puntu"] = babel["ponto"] = "point";
  babel["segmento"] = babel["segment"] = babel["zuzenki"] = "segment";
  babel["arco"] = babel["arc"] = babel["arku"] = "arc";
  babel["pol\u00EDgono"] = babel["polygon"] = babel["pol\u00EDgon"] = babel["poligono"] = babel["polygone"] = "polygon";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irudi"] = babel["imaxe"] = babel["imagem"] = "image";
  babel["Versi\u00F3n"] = babel["Version"] = babel["Versi\u00F3"] = babel["Vers\u00E3o"] = "version";
  babel["Idioma"] = babel["Language"] = babel["Hizkuntza"] = babel["Langue"] = "language";
//  babel["Espacio"] = babel["Space"] = babel["Espai"] = babel["Espazioa"] = babel["Espace"] = babel["Espazo"] = babel["Espa\u00E7o"] = babel["Espai"] = "";
  babel["O.x"] = "O.x";
  babel["O.y"] = "O.y";
//  babel["Controles"] = babel["Controls"] = babel["Controls"] = babel["Kontrolak"] = babel["Contr\u00F4les"] = babel["Controis"] = babel["Controles"] = babel["Controls"] = "";
//  babel["Auxiliares"] = babel["Auxiliaries"] = babel["Auxiliars"] = babel["Laguntzaile"] = babel["Auxiliaires"] = babel["Auxiliares"] = babel["Auxiliares"] = babel["Auxiliars"] = "";
//  babel["Gr\u00E1ficos"] = babel["Graphics"] = babel["Gr\u00E0fics"] = babel["Grafikoak"] = babel["Graphiques"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E0fics"] = "";
  babel["Botones"] = babel["Buttons"] = babel["Botons"] = babel["Botoiak"] = babel["Boutons"] = babel["Bot\u00F3ns"] = babel["Bot\u00F5es"] = babel["Botons"] = "Buttons";
  babel["Animaci\u00F3n"] = babel["Animation"] = babel["Animaci\u00F3"] = babel["Animazio"] = babel["Anima\u00E7\u00E3o"] = "Animation";
  babel["constante"] = babel["constant"] = babel["Konstante"] = "constant";
//  babel["original"] = babel["original"] = babel["original"] = babel["jatorrizkoa"] = babel["original"] = babel["orixinal"] = babel["original"] = babel["original"] = "";
//  babel["nueva"] = babel["new"] = babel["nova"] = babel["berria"] = babel["nouvelle"] = babel["novo"] = babel["novo"] = babel["nova"] = "";
//  babel["aplicar"] = babel["apply"] = babel["aplica"] = babel["ezarri"] = babel["appliquer"] = babel["aplicar"] = babel["aplicar"] = babel["aplica"] = "";
//  babel["cerrar"] = babel["close"] = babel["tanca"] = babel["itxi"] = babel["fermer"] = babel["pechar"] = babel["fechar"] = babel["tanca"] = "";
//  babel["cancelar"] = babel["cancel"] = babel["anul·la"] = babel["baliogabetu"] = babel["annuler"] = babel["cancelar"] = babel["cancelar"] = babel["anul·la"] = "";
//  babel["aceptar"] = babel["ok"] = babel["accepta"] = babel["onartu"] = babel["accepter"] = babel["aceptar"] = babel["ok"] = babel["accepta"] = "";
//  babel["agregar"] = babel["add"] = babel["afegeix"] = babel["erantsi"] = babel["ajouter"] = babel["engadir"] = babel["acrescentar"] = babel["afegeix"] = "";
//  babel["insertar"] = babel["insert"] = babel["insereix"] = babel["tartekatu"] = babel["ins\u00E9rer"] = babel["inserir"] = babel["inserir"] = babel["insereix"] = "";
//  babel["eliminar"] = babel["delete"] = babel["elimina"] = babel["kendu"] = babel["\u00E9liminer"] = babel["eliminar"] = babel["apagar"] = babel["elimina"] = "";
//  babel["arriba"] = babel["up"] = babel["amunt"] = babel["gora"] = babel["en haut"] = babel["arriba"] = babel["acima"] = babel["amunt"] = "";
//  babel["abajo"] = babel["down"] = babel["avall"] = babel["behera"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
//  babel["renombrar"] = babel["rename"] = babel["reanomenar"] = babel["berrizendatu"] = babel["r\u00E9appeler"] = babel["renomear"] = babel["renomear"] = babel["reanomenar"] = "";
//  babel["auxiliar"] = babel["auxiliary"] = babel["auxiliar"] = babel["laguntzaile"] = babel["auxiliaire"] = babel["auxiliar"] = babel["auxiliar"] = babel["auxiliar"] = "";
  babel["fuente"] = babel["font"] = babel["iturri"] = babel["source"] = babel["fonte"] = "font";
//  babel["deshacer"] = babel["undo"] = babel["desf\u00E9s"] = babel["desegin"] = babel["d\u00E9faire"] = babel["desfacer"] = babel["desfazer"] = babel["desf\u00E9s"] = "";
//  babel["rehacer"] = babel["redo"] = babel["ref\u00E9s"] = babel["berregin"] = babel["refaire"] = babel["refacer"] = babel["refazer"] = babel["ref\u00E9s"] = "";
  babel["num\u00E9rico"] = babel["numeric"] = babel["num\u00E8ric"] = babel["zenbakizko"] = babel["num\u00E9rique"] = "numeric";
  babel["gr\u00E1fico"] = babel["graphic"] = babel["gr\u00E0fic"] = babel["grafiko"] = babel["graphique"] = "graphic";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
//  babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = "";
  babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
  babel["hacer"] = babel["do"] = babel["fer"] = babel["egin"] = babel["faire"] = babel["facer"] = babel["fazer"] = "doExpr";
  babel["mientras"] = babel["while"] = babel["mentre"] = babel["bitartean"] = babel["tandis que"] = babel["mentres"] = babel["enquanto"] = "whileExpr";
  babel["evaluar"] = babel["evaluate"] = babel["avalua"] = babel["ebaluatu"] = babel["\u00E9valuer"] = babel["avaliar"] = "evaluate";
  babel["variable"] = babel["aldagaia"] = babel["vari\u00E1vel"] = "variable";
  babel["funci\u00F3n"] = babel["function"] = babel["funci\u00F3"] = babel["funtzio"] = babel["fonction"] = babel["fun\u00E7\u00E3o"] = "function";
  babel["algoritmo"] = babel["algorithm"] = babel["algorisme"] = babel["algorithme"] = "algorithm";
  babel["vector"] = babel["array"] = babel["bektore"] = babel["vecteur"] = babel["matriz"] = "array";
//  babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = "";
  babel["dibujar-si"] = babel["draw-if"] = babel["marraztu-baldin"] = babel["dessiner-si"] = babel["debuxar-se"] = babel["desenhar-se"] = babel["dibuixa-si"] = "drawif";
  babel["dominio"] = babel["range"] = babel["domini"] = babel["izate-eremua"] = babel["domain"] = babel["dom\u00EDnio"] = "range";
  babel["pausa"] = babel["delay"] = babel["eten"] = "delay";
//  babel["detener"] = babel["stop"] = babel["atura"] = babel["geldiarazi"] = babel["arr\u00EAter"] = babel["deter"] = babel["parar"] = babel["atura"] = "";
  babel["eje-x"] = babel["x-axis"] = babel["eix-x"] = babel["x-ardatza"] = babel["axe-x"] = babel["eixe-x"] = babel["eixo-x"] = "x_axis";
  babel["eje-y"] = babel["y-axis"] = babel["eix-y"] = babel["y-ardatza"] = babel["axe-y"] = babel["eixe-y"] = babel["eixo-y"] = "y_axis";
  babel["n\u00FAmeros"] = babel["numbers"] = babel["nombres"] = babel["zenbakiak"] = "numbers";
  babel["exponencial-si"] = babel["exponential-if"] = babel["esponentzial-baldin"] = babel["exponentiel-si"] = babel["exponencial-se"] = "exponentialif";
  babel["familia"] = babel["family"] = babel["fam\u00EDlia"] = babel["famille"] = "family";
  babel["intervalo"] = babel["interval"] = babel["tarte"] = babel["intervalle"] = "interval";
  babel["pasos"] = babel["steps"] = babel["passos"] = babel["pausoak"] = babel["pas"] = "steps";
  babel["centro"] = babel["center"] = babel["centre"] = babel["zentro"] = "center";
  babel["radio"] = babel["radius"] = babel["radi"] = babel["erradio"] = babel["rayon"] = babel["raio"] = "radius";
  babel["fin"] = babel["end"] = babel["fi"] = babel["bukaera"] = babel["fim"] = "end";
  babel["una-sola-vez"] = babel["only-once"] = babel["una-sola-vegada"] = babel["behin-bakarrik"] = babel["une-seule-fois"] = babel["unha-soa-vez"] = babel["apenas-uma-vez"] = "onlyOnce";
  babel["siempre"] = babel["always"] = babel["sempre"] = babel["beti"] = babel["toujours"] = "always";
//  babel["copiar"] = babel["copy"] = babel["copia"] = babel["kopiatu"] = babel["copier"] = babel["copiar"] = babel["copiar"] = babel["copia"] = "";
//  babel["pegar"] = babel["paste"] = babel["enganxa"] = babel["itsatsi"] = babel["accrocher"] = babel["pegar"] = babel["colar"] = babel["enganxa"] = "";
  babel["color-int"] = babel["int-colour"] = babel["barruko-kolore"] = babel["couleur-int"] = babel["cor-int"] = "colorInt";
  babel["repetir"] = babel["loop"] = babel["repeteix"] = babel["errepikatu"] = babel["r\u00E9p\u00E9ter"] = "loop";
  babel["controles"] = babel["controls"] = babel["kontrolak"] = babel["contr\u00F4les"] = babel["controis"] = "controls";
//  babel["c\u00F3digo"] = babel["<applet>"] = babel["</*applet*/>"] = babel["<applet>"] = babel["<applet>"] = babel["c\u00F3digo"] = babel["<applet>"] = babel["<applet>"] = "";
//  babel["Esta versi\u00F3n no permite editar."] = babel["Runtime only. No editing allowed."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = babel["Bertsio honek ez du editatzen uzten."] = babel["Seulement ex\u00E9cution. Cette version ne permet pas l'\u00E9dition."] = babel["Esta versi\u00F3n non permite editar."] = babel["Somente para execu\u00E7\u00E3o. N\u00E3o \u00E9 poss\u00EDvel editar o c\u00F3digo."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = "" ;
  babel["animar"] = babel["animate"] = babel["anima"] = babel["animatu"] = babel["animer"] = "animate";
//  babel["pausa"] = babel["pause"] = babel["pausa"] = babel["eten"] = babel["pause"] = babel["pausa"] = babel["pausa"] = babel["pausa"] = "";
  babel["auto"] = "auto";
  babel["alto"] = babel["height"] = babel["alt"] = babel["altu"] = babel["haut"] = babel["altura"] = "height";
  babel["x"] = babel["left"] = "x";
  babel["y"] = babel["top"] = "y";
  babel["espacio"] = babel["space"] = babel["espai"] = babel["espazio"] = babel["espace"] = babel["espazo"] = babel["espa\u00E7o"] = "space";
  babel["Nu"] = "Nu";
  babel["Nv"] = "Nv";
  babel["ancho"] = babel["depth"] = babel["amplada"] = babel["zabalera"] = babel["largeur"] = babel["ancho"] = babel["profundidade"] = babel["amplada"] = "width";
  babel["largo"] = babel["length"] = babel["llargada"] = babel["luzera"] = babel["longueur"] = babel["longo"] = babel["comprimento"] = babel["llargada"] = "length";
  babel["alto"] = babel["height"] = babel["al\u00E7ada"] = babel["altu"] = babel["hauteur"] = babel["alto"] = babel["altura"] = babel["al\u00E7ada"] = "height";
  babel["color_reverso"] = babel["backcolor"] = babel["color_revers"] = babel["atzealde kolorea"] = babel["couleur_revers"] = babel["cor_reverso"] = babel["cor_de_fundo"] = "backcolor";
  babel["aristas"] = babel["edges"] = babel["arestes"] = babel["ertzak"] = babel["ar\u00EAtes"] = babel["arestas"] = "edges";
  babel["rotini"] = babel["inirot"] = "inirot";
  babel["posini"] = babel["inipos"] = "inipos";
  babel["tri\u00E1ngulo"] = babel["triangle"] = babel["hirukia"] = babel["tri\u00E2ngulo"] = "triangle";
  babel["cara"] = babel["face"] = babel["aurpegi"] = "face";
  babel["polireg"] = babel["regpoly"] = babel["pol\u00EDgonoRegular"] = "polireg";
  babel["superficie"] = babel["surface"] = babel["superf\u00EDcie"] = babel["azalera"] = "surface";
  babel["cubo"] = babel["cube"] = babel["cub"] = babel["kubo"] = "cube";
  babel["paralelep\u00edpedo"] = babel["box"] = babel["paral·lelep\u00edpede"] = babel["paralelepipedo"] = babel["parall\u00e9l\u00e9pip\u00e8de"] = "box";
  babel["cono"] = babel["cone"] = babel["con"] = babel["kono"] = babel["c\u00f4ne"] = "cone";
  babel["cilindro"] = babel["cylinder"] = babel["cilindre"] = babel["zilindro"] = babel["cylindre"] = "cylinder";
  babel["esfera"] = babel["sphere"] = babel["sph\u00e8re"] = "sphere";
  babel["tetraedro"] = babel["tetrahedron"] = babel["tetraedre"] = babel["t\u00e9tra\u00e8dre"] = "tetrahedron";
  babel["octaedro"] = babel["octahedron="] = babel["octaedre"] = babel["oktaedro"] = babel["octa\u00e8dre"] = "octahedron";
  babel["dodecaedro"] = babel["dodecahedron"] = babel["dodecaedre"] = babel["dodekaedro"] = babel["dod\u00e9ca\u00e8dre"] = "dodecahedron";
  babel["icosaedro"] = babel["icosahedron"] = babel["icosaedre"] = babel["ikosaedro"] = babel["icosa\u00e8dre"] = "icosahedron";
  babel["elipsoide"] = babel["ellipsoid"] = babel["el·lipsoide"] = babel["ellipso\u00efde"] = babel["elips\u00f3ide"] = "ellipsoid";
  babel["macro"] = babel["makro"] = "macro";
  babel["id"] = "id";
  babel["modelo"] = babel["model"] = babel["eredu"] = babel["mod\u00E8le"] = "model";
  babel["color"] = babel["kolore"] = babel["couleur"] = babel["cor"] = "color";

  babel["luz"] = babel["light"] = babel["llum"] = babel["argia"] = babel["lumi\u00E8re"] = "light";
  babel["metal"] = babel["metall"] = babel["m\u00E9tal"] = "metal";
  babel["alambre"] = babel["wire"] = babel["filferro"] = babel["alanbre"] = babel["fil de fer"] = babel["arame"] = "wire";

  babel["cortar"] = babel["split"] = babel["talla"] = babel["moztu"] = babel["couper"] = babel["dividir"] = "split";
  babel["despliegue"] = babel["render"] = babel["desplegament"] = babel["zabaltze"] = babel["d\u00E8ploiement"] = babel["despregamento"] = babel["processar"] = "render";
  babel["orden"] = babel["sort"] = babel["ordre"] = babel["ordena"] = babel["orde"] = babel["ordenar"] = "sort";
  babel["pintor"] = babel["painter"] = babel["margolari"] = babel["peintre"] = "painter";
  babel["trazado de rayos"] = babel["ray trace"] = babel["tra\u00E7at de raigs"] = babel["izpi trazadura"] = babel["trace de rayons"] = babel["trazado de raios"] = babel["tra\u00E7ado de raios"] = "raytrace";
  babel["imagen"] = babel["bg_image"] = babel["imatge"] = babel["irudia"] = babel["imaxe"] = babel["imagem_de_fundo"] = "image";
  babel["despl_imagen"] = babel["bg_display"] = babel["despl_imatge"] = babel["irudi desplazamendu"] = babel["despl_image"] = babel["despr_imaxe"] = babel["apresenta\u00E7\u00E3o_de_imagem"] = "bg_display";
  babel["arr-izq"] = babel["topleft"] = babel["dalt-esq"] = babel["goi-ezk"] = babel["au-dessus-gau"] = babel["arr-esq"] = babel["acima-esquerda"] = "topleft";
  babel["expand."] = babel["stretch"] = babel["hedatu"] = babel["expandir "] = "stretch";
  babel["mosaico"] = babel["patch"] = babel["mosaic"] = babel["mosaiko"] = babel["mosa\u00EFque"] = "patch";
  babel["centrada"] = babel["center"] = babel["zentratu"] = babel["centr\u00E9e"] = babel["centrado"] = "center";
  babel["archivo"] = babel["file"] = babel["fitxer"] = babel["artxibo"] = babel["fichier"] = babel["arquivo"] = "file";
//   babel["loc"] = babel["loc"] = babel["lloc"] = babel["lok"] = babel["lieu"] = babel["loc"] = babel["loc"] = babel["lloc"] = "";
//   babel["rot"] = babel["rot"] = babel["gir"] = babel["rot"] = babel["tour"] = babel["rot"] = babel["rot"] = babel["gir"] = "";
//   babel["macro"] = babel["macro"] = babel["macro"] = babel["makro"] = babel["macro"] = babel["macro"] = babel["macro"] = babel["macro"] = "";
  babel["tipo_de_macro"] = babel["macro_type"] = babel["tipus_de_macro"] = babel["makro_mota"] = babel["type_de_macro"] = babel["tipo_de_macro"] = babel["tipo_de_macro"] = babel["tipus_de_macro"] = "macro_type";
//   babel["Poniendo este texto en un archivo <nombre> en el subdirectorio macros/g2d/ se crea la macro <nombre>"] = babel["Puting this text in a file <name> in subdirectory macros/g2d/ creates the macro <name>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = babel["Artxibo batean testu hau jarriz <izena> macros/g2d/ izeneko azpidirektorioan"] = babel["En mettant ce texte dans un fichier <nom> dans le sous-r\u00E9pertoire macros/g2d/ la macro <nom> est cr\u00E9e "] = babel["Po\u00F1endo este texto nun arquivo <nombre> no subdirectorio macros/g2d/ cr\u00E9ase a macro <nombre>"] = babel["Colocando este texto num arquivo <nome> no subdiret\u00F3rio macros/g2d/ voc\u00EA criar\u00E1 a macro <nome>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = "";
//   babel["codigo HTML"] = babel["HTML encoding"] = babel["codi HTML"] = babel[" <izena>duen makroa sortzen da"] = babel["code HTML"] = babel["c\u00F3digo HTML"] = babel["codigo HTML"] = babel["codi HTML"] = "";
  babel["filas_norte"] = babel["rows_north"] = babel["files_nord"] = babel["HTML kodea"] = babel["files_nord"] = babel["filas_norte"] = babel["linhas_norte"] = babel["files_nord"] = "rowsNorth";
  babel["filas_sur"] = babel["rows_south"] = babel["files_sud"] = babel["ipar_lerro"] = babel["files_sud"] = babel["filas_sur"] = babel["linhas_sul"] = babel["files_sud"] = "rowsSouth";
  babel["ancho_este"] = babel["width_east"] = babel["ample_est"] = babel["hego_lerro"] = babel["ample_est"] = babel["ancho_leste"] = babel["largura_leste"] = babel["ample_est"] = "widthEast";
  babel["ancho_oeste"] = babel["width_west"] = babel["ample_oest"] = babel["ekialde_zabalera"] = babel["ample_ouest"] = babel["ancho_oeste"] = babel["largura_oeste"] = babel["ample_oest"] = "widthWest";
  babel["fijo"] = babel["fixed"] = babel["fix"] = babel["hegoalde_zabalera"] = babel["fixe"] = babel["fixo"] = "fixed";
  babel["Reiniciar Animaci\u00F3n"] = babel["Init Animation"] = babel["Reinicia Animaci\u00F3"] = babel["finko"] = babel["Recommencer l'Animation"] = babel["Reiniciar Anima\u00E7\u00E3o"] = "initAnimation";
//   babel["emergente"] = babel["pop"] = babel["emergent"] = babel["Animazioa bberrabiatu"] = babel["\u00E9mergent"] = babel["emerxente"] = babel["pop"] = babel["emergent"] = "";
//   babel[" "] = babel[" "] = babel[" "] = babel["azaleratzaile"] = babel[" "] = babel["00:"] = babel["  "] = babel[" "] = "";
//   babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = "";
  babel["Explicaci\u00F3n"] = babel["Explanation"] = babel["Azalpena"] = babel["Explication"] = babel["Explica\u00E7\u00E3o"] = babel["Explicaci\u00F3"] = "Explanation";
//   babel["gr\u00E1ficos 3D"] = babel["graphics 3D"] = babel["gr\u00E0fics 3D"] = babel["3d grafikoak"] = babel["graphiques 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E0fics 3D"] = "";
//   babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = "";
  babel["tooltip"] = babel["dica"] = "tooltip";
//   babel["clic derecho"] = babel["right click"] = babel["clic dret"] = babel["lik eskuina"] = babel["clic droit"] = babel["clic dereito"] = babel["clique com o bot\u00E3o direito"] = babel["clic dret"] = "";
  babel["discreto"] = babel["discrete"] = babel["discret"] = babel["diskretu"] = "discrete";
  babel["interfaz"] = babel["gui"] = babel["interf\u00EDcie"] = babel["interfaze"] = babel["interface"] = "gui";
  babel["pulsador"] = babel["spinner"] = babel["polsador"] = babel["pultsadore"] = babel["bouton"] = "spinner";
  babel["campo de texto"] = babel["textfield"] = babel["camp de text"] = babel["testu esarrua"] = babel["champ de texte"] = "textfield";
  babel["men\u00FA"] = babel["choice"] = babel["menu"] = babel["escolha"] = "menu";
  babel["barra"] = babel["scrollbar"] = babel["barre"] = "scrollbar";
  babel["opciones"] = babel["options"] = babel["opcions"] = babel["aukerak"] = babel["opci\u00F3ns"] = babel["op\u00E7\u00F5es"] = "options";
  babel["interior"] = babel["barruko"] = babel["int\u00E9rieur"] = "interior";
  babel["condici\u00F3n"] = babel["condition"] = babel["condici\u00F3"] = babel["baldintza"] = babel["condi\u00E7\u00E3o"] = "condition";
  babel["acci\u00F3n"] = babel["action"] = babel["acci\u00F3"] = babel["ekintza"] = babel["a\u00E7\u00E3o"] = "action";
  babel["evento"] = babel["event"] = babel["esdeveniment"] = babel["gertaera"] = babel["\u00E9v\u00E9nement"] = "event";
  babel["abrir URL"] = babel["open URL"] = babel["obre URL"] = babel["URL zabaldu"] = babel["ouvrir URL"] = "openURL";
  babel["abrir Escena"] = babel["open Scene"] = babel["obre Escena"] = babel["eszena zabaldu"] = babel["ouvrir Escena"] = babel["abrir Cena"] = "openScene";
  babel["bot\u00F3n"] = babel["button"] = babel["bot\u00F3"] = babel["botoi"] = babel["bouton"] = babel["bot\u00E3o"] = "button";
  babel["mensaje"] = babel["message"] = babel["mezua"] = babel["mensaxe"] = babel["mensagem"] = babel["missatge"] = "message";
  babel["alternar"] = babel["alternate"] = babel["alterna"] = babel["txandakatu"] = babel["alterner"] = "alternate";
  babel["ejecuci\u00F3n"] = babel["execution"] = babel["execuci\u00F3"] = babel["gauzatze"] = babel["ex\u00E9cution"] = babel["execuci\u00F3n"] = babel["execu\u00E7\u00E3o"] = "execution";
  babel["calcular"] = babel["calculate"] = babel["calcula"] = babel["kalkulatu"] = babel["calculer"] = "calculate";
//   babel["s\u00EDmbolo"] = babel["symbol"] = babel["s\u00EDmbol"] = babel["sinbolo"] = babel["symbole"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbol"] = "";
//   babel["UNIDAD"] = babel["UNIT"] = babel["UNITAT"] = babel["UNITATE"] = babel["UNIT\u00C9"] = babel["UNIDADE"] = babel["UNIDADE"] = babel["UNITAT"] = "";
//   babel["CURSO"] = babel["COURSE"] = babel["CURS"] = babel["IKASTAROA"] = babel["COURS"] = babel["CURSO"] = babel["CURSO"] = babel["CURS"] = "";
//   babel["animado"] = babel["animated"] = babel["animat"] = babel["animatu"] = babel["anim\u00E9"] = babel["animado"] = babel["animado"] = babel["animat"] = "";
//   babel["frecuencia"] = babel["frequency"] = babel["freq\u00FC\u00E8ncia"] = babel["maiztasun"] = babel["fr\u00E9quence"] = babel["frecuencia"] = babel["freq\u00FC\u00EAncia"] = babel["freq\u00FC\u00E8ncia"] = "";
  babel["coord_abs"] = babel["abs_coord"] = babel["koor_abs"] = "abs_coord";
//   babel["Editor de F\u00F3rmulas"] = babel["Formula Editor"] = babel["Editor de F\u00F2rmules"] = babel["Formula-editore"] = babel["\u00C9diteur de Formules"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F2rmules"] = "";
//   babel["Editor de Textos"] = babel["Text Editor"] = babel["Editor de Textos"] = babel["Testu-editore"] = babel["\u00C9diteur de Textes"] = babel["Editor de Textos"] = babel["Editor de Textos"] = babel["Editor de Textos"] = "";
//   babel["s\u00EDmbolos"] = babel["symbols"] = babel["s\u00EDmbols"] = babel["sinboloak"] = babel["symboles"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbols"] = "";
//   babel["fracci\u00F3n"] = babel["fraction"] = babel["fracci\u00F3"] = babel["zatiki"] = babel["fraction"] = babel["fracci\u00F3n"] = babel["fra\u00E7\u00E3o"] = babel["fracci\u00F3"] = "";
//   babel["ra\u00EDz cuadrada"] = babel["square Root"] = babel["arrel quadrada"] = babel["erro karratu"] = babel["racine carr\u00E9e"] = babel["ra\u00EDz cadrada"] = babel["raiz quadrada"] = babel["arrel quadrada"] = "";
//   babel["sub\u00EDndice"] = babel["subindex"] = babel["sub\u00EDndex"] = babel["azpi-indize"] = babel["subindice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndex"] = "";
//   babel["super\u00EDndice"] = babel["superindex"] = babel["super\u00EDndex"] = babel["goi-indize"] = babel["superindice"] = babel["super\u00EDndice"] = babel["super\u00EDndice"] = babel["super\u00EDndex"] = "";
//   babel["editar"] = babel["edit"] = babel["edita"] = babel["editatu"] = babel["\u00E9diter"] = babel["editar"] = babel["editar"] = babel["edita"] = "";
//   babel["mostrar"] = babel["show"] = babel["mostra"] = babel["erakutsi"] = babel["montrer"] = babel["mostrar"] = babel["exibir"] = babel["mostra"] = "";
  babel["negrita"] = babel["bold"] = babel["negreta"] = babel["lodi"] = babel["caract\u00E8re gras"] = babel["negra"] = babel["negrito"] = "bold";
  babel["cursiva"] = babel["italics"] = babel["etzana"] = babel["italique"] = babel["it\u00E1lico"] = "italics";
  babel["subrayada"] = babel["underlined"] = babel["subratllat"] = babel["azpimarratua"] = babel["soulignement"] = babel["subli\u00F1ada"] = babel["sublinhado"] = "underlined";
//   babel["super-rayada"] = babel["overlined"] = babel["sobreratllat"] = babel["goimarratua"] = babel["surrayure"] = babel["super-raiada"] = babel["linha-superior"] = babel["sobreratllat"] = "";
//   babel["f\u00F3rmula"] = babel["formula"] = babel["f\u00F3rmula"] = babel["formula"] = babel["formule"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = "";
//   babel["Lat\u00EDno b\u00E1sico"] = babel["Basic Latin"] = babel["Llat\u00ED b\u00E0sic"] = babel["Oinarrizko Latindarra"] = babel["Latin basique"] = babel["Lat\u00EDn b\u00E1sico"] = babel["Latim B\u00E1sico"] = babel["Llat\u00ED b\u00E0sic"] = "";
//   babel["Latino "] = babel["Latin "] = babel["Llat\u00ED 1"] = babel["Latindar "] = babel["Latin 1"] = babel["Latin "] = babel["Latim 1"] = babel["Llat\u00ED "] = "";
//   babel["Latino extendido A"] = babel["Latin Extended A"] = babel["Llat\u00ED est\u00E8s A"] = babel["Latindar zabaldua A"] = babel["Latin r\u00E9pandu A"] = babel["Latin extendido A"] = babel["Latim estendido A"] = babel["Llat\u00ED est\u00E8s A"] = "";
//   babel["Latino extendido B"] = babel["Latin Extended B"] = babel["Llat\u00ED est\u00E8s B"] = babel["Latindar zabaldua B"] = babel["Llat\u00ED r\u00E9pandu B"] = babel["Latin extendido B"] = babel["Latim estendido B"] = babel["Llat\u00ED est\u00E8s B"] = "";
//   babel["Griego b\u00E1sico"] = babel["Basic Greek"] = babel["Grec b\u00E0sic"] = babel["Oinarrizko Grekera"] = babel["Grec basique"] = babel["Grego b\u00E1sico"] = babel["Grego B\u00E1sico"] = babel["Grec b\u00E0sic"] = "";
//   babel["Cir\u00EDlico"] = babel["Cyrillic"] = babel["Cir\u00EDl·lic"] = babel["Ziriliko"] = babel["Cyrillique"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDl·lic"] = "";
//   babel["Hebreo b\u00E1sico"] = babel["Basic Hebrew"] = babel["Hebreu b\u00E0sic"] = babel["Oinarrizko Hebrear"] = babel["H\u00E9breu basique"] = babel["Hebreo b\u00E1sico"] = babel["Hebreu B\u00E1sico"] = babel["Hebreu b\u00E0sic"] = "";
//   babel["\u00C1rabe b\u00E1sico"] = babel["Basic Arab"] = babel["\u00C0rab b\u00E0sic"] = babel["Oinarrizko Arabiarra"] = babel["Arabe basique"] = babel["\u00C1rabe b\u00E1sico"] = babel["\u00C1rabe B\u00E1sico"] = babel["\u00C0rab b\u00E0sic"] = "";
//   babel["Puntuaci\u00F3n general"] = babel["General Punctuation"] = babel["Puntuaci\u00F3 general"] = babel["Puntuazio orokorra"] = babel["Ponctuation g\u00E9n\u00E9rale"] = babel["Puntuaci\u00F3n xeral"] = babel["Pontua\u00E7\u00E3o Geral"] = babel["Puntuaci\u00F3 general"] = "";
//   babel["S\u00EDmbolos de moneda"] = babel["Currency Symbols"] = babel["S\u00EDmbols de moneda"] = babel["Txanpon sinboloak"] = babel["Symboles de monnaie"] = babel["S\u00EDmbolos de moeda"] = babel["S\u00EDmbolos Monet\u00E1rios"] = babel["S\u00EDmbols de moneda"] = "";
//   babel["S\u00EDmbolos tipo carta"] = babel["Letterlike Symbols"] = babel["S\u00EDmbols tipus carta"] = babel["karta motako sinboloak"] = babel["Symboles types lettre"] = babel["S\u00EDmbolos tipo carta"] = babel["S\u00EDmbolos Tipo Carta"] = babel["S\u00EDmbols tipus carta"] = "";
//   babel["Formatos de n\u00FAmeros"] = babel["Number Forms"] = babel["Formats de n\u00FAmeros"] = babel["Zenbaki formatua"] = babel["Form\u00E9s de num\u00E9ros"] = babel["Formatos de n\u00FAmeros"] = babel["Formatos de N\u00FAmeros"] = babel["Formats de n\u00FAmeros"] = "";
//   babel["Operadores matem\u00E1ticos"] = babel["Mathematical Operators"] = babel["Operadors matem\u00E0tics"] = babel["Eragile matematikoak"] = babel["Op\u00E9rateurs math\u00E9matiques"] = babel["Operadores matem\u00E1ticos"] = babel["Operadores Matem\u00E1ticos"] = babel["Operadors matem\u00E0tics"] = "";
//   babel["Bordes de cuadros"] = babel["Box Drawing"] = babel["Vores de quadres"] = babel["Koadro ertzak"] = babel["Bord de carr\u00E9s"] = babel["Bordes de cadros"] = babel["Bordas"] = babel["Vores de quadres"] = "";
//   babel["Elementos de bloque"] = babel["Block Elements"] = babel["Elements de bloc"] = babel["Blokearen elementuak"] = babel["\u00C9l\u00E9ments de bloc"] = babel["Elementos de bloque"] = babel["Elementos de Blocos"] = babel["Elements de bloc"] = "";
//   babel["S\u00EDmbolos variados"] = babel["Miscelaneous Symbols"] = babel["S\u00EDmbols variats"] = babel["Askotariko sinboloak"] = babel["Symboles vari\u00E9s"] = babel["S\u00EDmbolos variados"] = babel["S\u00EDmbolos Diversos"] = babel["S\u00EDmbols variats"] = "";
//   babel["Alfabetos Unicode"] = babel["Unicode Alphabets"] = babel["Alfabets Unicode"] = babel["Unicode alfabetoa"] = babel["Alphabets Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabets Unicode"] = "";
//   babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = babel["Unicode oina"] = babel["Base Unicode"] = babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = "";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irundia"] = babel["imaxe"] = babel["imagem"] = "image";
//   babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Dok"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = "";
//   babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["lagunt"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = "";
//   babel["clic"] = babel["click"] = babel["clic"] = babel["klik"] = babel["clic"] = babel["clic"] = babel["clique"] = babel["clic"] = "";
  babel["pos_mensajes"] = babel["msg_pos"] = babel["pos_missatges"] = babel["mezuen_pos"] = babel["pos_messages"] = babel["pos_mensaxes"] = "msg_pos";
//   babel["arr_izq"] = babel["top_left"] = babel["dalt_esq"] = babel["goi_ezk"] = babel["au-dessus_gauche"] = babel["arr_esq"] = babel["acima_esquerda"] = babel["dalt_esq"] = "";
//   babel["arriba"] = babel["top_center"] = babel["dalt"] = babel["goian"] = babel["au-dessus"] = babel["arriba"] = babel["acima_centro"] = babel["dalt"] = "";
//   babel["arr_der"] = babel["top_right"] = babel["dalt_dreta"] = babel["goi_eskuin"] = babel["au-dessus_droite"] = babel["arr_der"] = babel["acima_direita"] = babel["dalt_dreta"] = "";
  babel["izquierda"] = babel["left"] = babel["esquerra"] = babel["eskerrean"] = babel["gauche"] = babel["esquerda"] = babel["esquerda"] = babel["esquerra"] = "x";
  babel["derecha"] = babel["right"] = babel["dreta"] = babel["eskuinan"] = babel["droite"] = babel["dereita"] = babel["direita"] = babel["dreta"] = "right";
//   babel["ab_izq"] = babel["bottom_left"] = babel["avall_esq"] = babel["Behe_ezk"] = babel["en bas_gauche"] = babel["ab_esq"] = babel["abaixo_esquerda"] = babel["avall_esq"] = "";
//   babel["abajo"] = babel["bottom"] = babel["avall"] = babel["behean"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
//   babel["ab_der"] = babel["bottom_right"] = babel["avall_dreta"] = babel["behe_eskuin"] = babel["en bas_droite"] = babel["ab_der"] = babel["abaixo_direita"] = babel["avall_dreta"] = "";
//   babel["img"] = babel["img"] = babel["img"] = babel["irud"] = babel["img"] = babel["img"] = babel["img"] = babel["img"] = "";
  babel["sensible_a_los_movimientos_del_rat\u00F3n"] = babel["sensitive_to_mouse_movements"] = babel["sensible_als_moviments_del_ratol\u00ED"] = babel["xagu mugimenduarekiko sentikorra"] = babel["sensible_aux_mouvements_du_souris"] = babel["sensible_aos_movementos_do_rato"] = babel["sens\u00EDvel_aos_movimentos_do_mouse"] = "sensitive_to_mouse_movements";
  babel["reproducir"] = babel["play"] = babel["reprodueix"] = babel["erreproduzitu"] = babel["reproduire"] = babel["reproduzir"] = "playAudio";
//   babel["infoind"] = babel["indinfo"] = babel["infoind"] = babel["baninf"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = "";
//   babel["infoest"] = babel["statinfo"] = babel["infoest"] = babel["estinf"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = "";
  babel["activo-si"] = babel["active-if"] = babel["actiu-si"] = babel["altiboa-baldin"] = babel["actif-si"] = babel["activo-se"] = babel["ativo-se"] = "activeif";
  babel["rotfin"] = babel["finrot"] = babel["bukrot"] = "endrot";
  babel["posfin"] = babel["finpos"] = babel["bukpos"] = "endpos";
  babel["editable"] = babel["editagarria"] = babel["edit\u00E1vel"] = "editable";
//   babel["camposMixtos"] = babel["mixedTF"] = babel["CampsMixtes"] = babel["esparruMistoa"] = babel["ChampsMixtes"] = babel["camposMixtos"] = babel["camposMixtos"] = babel["CampsMixtes"] = "";
//   babel["sonido"] = babel["sound"] = babel["so"] = babel["soinu"] = babel["son"] = babel["son"] = babel["som"] = babel["so"] = "";
//   babel["\u00E1lgebra"] = babel["algebra"] = babel["\u00E0lgebra"] = babel["aljebra"] = babel["alg\u00E8bre"] = babel["\u00E1lxebra"] = babel["\u00E1lgebra"] = babel["\u00E0lgebra"] = "";
//   babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = "";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["R2"] = "R2";
  babel["R3"] = "R3";
//   babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = "";
//   babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = "";
//   babel["D"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = "";
  babel["vectores"] = babel["bektoreak"] = babel["vecteurs"] = babel["vetores"] = babel["vectors"] = "vectors";
//   babel["fuente tipo"] = babel["font type"] = babel["font tipus"] = babel["iturri mota"] = babel["source type"] = babel["fonte tipo"] = babel["tipo de fonte"] = babel["font tipus"] = "";
  babel["fuente puntos"] = babel["font size"] = babel["font punts"] = babel["puntu iturria"] = babel["source points"] = babel["fonte puntos"] = babel["fonte pontos"] = "font_size";
//   babel["SansSerif"] = "SansSerif";
//   babel["Serif"] = "Serif";
//   babel["Monoespaciada"] = babel["Monospaced"] = babel["Monoespazada"] = "Monospaced";
//   babel["\u00E1rbol"] = babel["tree"] = babel["arbre"] = babel["zuhitz"] = babel["arbre"] = babel["\u00E1rbore"] = babel["\u00E1rvore"] = babel["arbre"] = "";
//   babel["sensible"] = babel["sensible"] = babel["sensible"] = babel["sentikor"] = babel["sensible"] = babel["sensible"] = babel["sens\u00EDvel"] = babel["sensible"] = "";
//   babel["paso de l\u00EDnea"] = babel["step size"] = babel["pas de l\u00EDnia"] = babel["lerro igarotze"] = babel["pas de ligne"] = babel["paso de li\u00F1a"] = babel["passo de linha"] = babel["pas de l\u00EDnia"] = "";
//   babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["multiplication symbol"] = babel["s\u00EDmbol del producte"] = babel["biderketa sinboloa"] = babel["symbole du produit"] = babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["s\u00EDmbolo de multiplica\u00E7\u00E3o"] = babel["s\u00EDmbol del producte"] = "";
//   babel["par\u00E9ntesis siempre"] = babel["parenthesis always"] = babel["par\u00E8ntesis sempre"] = babel["beti parentesia"] = babel["par\u00E8nth\u00E8ses toujours"] = babel["par\u00E9ntese sempre"] = babel["par\u00E9ntesis sempre"] = babel["par\u00E8ntesis sempre"] = "";
//   babel["modo"] = babel["mode"] = babel["model"] = babel["modu"] = babel["mod\u00E8le"] = babel["modo"] = babel["modo"] = babel["model"] = "";
//   babel["autom\u00E1tico"] = babel["automatic"] = babel["autom\u00E0tic"] = babel["autom\u00E1tiko"] = babel["automatique"] = babel["autom\u00E1tico"] = babel["autom\u00E1tico"] = babel["autom\u00E0tic"] = "";
//   babel["clic y arrastre"] = babel["click and drag"] = babel["clica i arrossega"] = babel["klik eta arrastatu"] = babel["cliquer et tr\u00E2iner"] = babel["clic e arrastre"] = babel["clique e arraste"] = babel["clica i arrossega"] = "";
//   babel["clic y escribir"] = babel["click and write"] = babel["clica i y escriu"] = babel["klik eta idatzi"] = babel["cliquer et \u00E9crire"] = babel["clic e escribir"] = babel["clique e escrever"] = babel["clica i y escriu"] = "";
//   babel["escribir"] = babel["write"] = babel["escriu"] = babel["idatzi"] = babel["\u00E9crire"] = babel["escribir"] = babel["escrever"] = babel["escriu"] = "";
//   babel["guiado"] = babel["guided"] = babel["guiat"] = babel["gidatua"] = babel["guid\u00E9"] = babel["guiado"] = babel["guiado"] = babel["guiat"] = "";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
//   babel["ejercicios"] = babel["exercises"] = babel["exercicis"] = babel["ariketak"] = babel["exercices"] = babel["exercicios"] = babel["exerc\u00EDcios"] = babel["exercicis"] = "";
  babel["punto"] = babel["dot"] = babel["punt"] = babel["puntu"] = babel["point"] = babel["ponto"] = "point";
//   babel["aspas"] = babel["cross"] = babel["aspes"] = babel["gurutzeak"] = babel["ailes"] = babel["aspas"] = babel["aspas"] = babel["aspes"] = "";
  babel["escenario"] = babel["scenario"] = babel["escenari"] = babel["agertoki"] = babel["sc\u00E8ne"] = babel["cen\u00E1rio"] = "scenario";
  babel["cID"] = "cID";
  babel["matriz"] = babel["matrix"] = babel["matriu"] = babel["matrice"] = "matrix";
  babel["filas"] = babel["rows"] = babel["files"] = "rows";
  babel["columnas"] = babel["columns"] = babel["colonnes"] = "columns";
  babel["solo_texto"] = babel["only_text"] = babel["seulement_texte"] = babel["s\u00F3_texto"] = babel["tan_sols_texte"] = "onlyText";
  babel["evaluar"] = babel["evaluate"] = "evaluate";
  babel["respuesta"] = babel["answer"] = "answer";
//   babel["peso"] = babel["weight"] = babel["pes"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["pes"] = "";
  babel["decimal_symbol"] = babel["signo decimal"] = babel["decimal symbol"] = "decimal_symbol";
  babel["info"] = "info";
//   babel["No se encuentra"] = babel["Not Found"] = babel["No es troba"] = babel["Ez da aurkitzen"] = babel["Il ne se trouve pas"] = babel["Non se atopa"] = babel["N\u00E3o Encontrado"] = babel["No es troba"] = "";
  
  ////////////////////////
  //  new options added
//   babel["borde"] = babel["border"] = babel["contour"] = "border";
  babel["color_contorn_text"] = babel["color_text_border"] = babel["color_borde_texto"] = babel["muga_testuaren_kolorea"] = babel["couleur_contour_texte"] = babel["cor_borde_texto"] = babel["colore_bordo_testo"] = babel["cor_borda_texto"] = babel["color_contorn_text"] = "border";
  babel["video"] = babel["vid\u00e9o"] = "video";
  babel["audio"] = babel["\u00e0udio"] = "audio"; 
  babel["autoplay"] = "autoplay";
  babel["loop"] = "loop";
  babel["poster"] = "poster";
  babel["opacidad"] = babel["opacity"] = babel["opacit\u00E9"] = babel["opacitat"] = babel["opacidade"] = "opacity";
  babel["alinear"] = babel["align"] = babel["ali\u00F1ar"] = babel["aligner"] = "align";
  babel["malla"] = babel["mesh"] = "mesh";
  babel["local"] = babel["Local"] = "local";
  ////////////////////////
  
  babel.loadLib = true;

  return babel;
})(babel || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  var PI2 = Math.PI*2;
  var trecientosSesentaEntreDosPi = 360/PI2;
  var dosPiEntreTrecientosSesenta = PI2/360;
  var MathFloor = Math.floor;

  var fontTokens;
  var fontCanvas;
  var fontName;

  var colorExpr;
  var red;
  var green;
  var blue;
  var alpha;

  var mouseX;
  var mouseY;

  descartesJS.rangeOK = 1;
  
  /**
   * Extends an object with inheritance
   * @param {Object} child is the object that extends
   * @param {Object} parent is the objecto to extends
   */
  descartesJS.extend = function(child, parent) {
    // all browsers except IE
    if (child.prototype.__proto__) {
      child.prototype.__proto__ = parent.prototype;
    }
    // IE
    else { 
      // copy all the functions of the parent
      for( var i in parent.prototype ) { 
        if (parent.prototype.hasOwnProperty(i)) {
          child.prototype[i] = parent.prototype[i];
        }
      }
    }
    // add the uber (super) property to execute functions of the parent
    child.prototype.uber = parent.prototype;
  }

  /**
   * Converts radians to degrees
   * @param {Number} r the radian to convert
   * @return {Number} return the convertion to degrees of the number r
   */
  descartesJS.radToDeg = function(r) {
    return r*trecientosSesentaEntreDosPi;
  }
  
  /**
   * Converts degrees to radians
   * @param {Number} d the degree to convert
   * @return {Number} return the convertion to radians of the number d
   */
  descartesJS.degToRad = function(d) {
    return d*dosPiEntreTrecientosSesenta;
  }
  
  /**
   * Converts a Descartes font string, to a canvas font string
   * @param {String} fontStr the Descartes font string
   * @return {String} the canvas font string
   */
  descartesJS.convertFont = function(fontStr) {
    if (fontStr == "") {
      return fontStr;
    }

    fontTokens = fontStr.split(",");
    fontCanvas = "";

    // bold text
    if (fontTokens[1].toLowerCase() == "bold") {
      fontCanvas += "Bold ";
    } 
    // italic text
    else if ( (fontTokens[1].toLowerCase() == "italic") || (fontTokens[1].toLowerCase() == "italics")) {
      fontCanvas += "Italic ";
    }
    // bold and italic text
    else if (fontTokens[1].toLowerCase() == "bold+italic") {
      fontCanvas += "Italic Bold ";
    }
    
    // the font size
    fontCanvas += fontTokens[2] + "px ";

    fontName = ((fontTokens[0].split(" "))[0]).toLowerCase();

    // serif font
    if ((fontName === "serif") || (fontName === "times new roman") || (fontName === "timesroman") || (fontName === "times")) {
      fontCanvas += "'Times New Roman', Times, 'Droid Serif', serif";
    }
    // sans serif font
    else if ((fontName === "sansserif") || (fontName === "arial") || (fontName === "helvetica")) {
      fontCanvas += "Arial, Helvetica, 'Droid Sans', Sans-serif";
    }
    // monospace font
    else {
      fontCanvas += "'Courier New', Courier, 'Droid Sans Mono', Monospace";
    }

    return fontCanvas;
  }

  /**
   * Function for draw the spinner control, that draws a line
   * @param {2DContext} ctx the canvas context to draw
   * @param {Number} x1 the x position of the initial point
   * @param {Number} y1 the y position of the initial point
   * @param {Number} x2 the x position of the final point
   * @param {Number} y2 the y position of the final point
   * @param {String} strokeStyle the style of the stroke used to draw the line
   * @param {Number} lineWidth the width of the line to draw
   */
  descartesJS.drawLine = function(ctx, x1, y1, x2, y2, strokeStyle, lineWidth) {
    ctx.lineWidth = lineWidth || 1;
    ctx.strokeStyle = strokeStyle || "black";
    var desp = (ctx.lineWidth%2) ? .5 : 0;
    
    ctx.beginPath();
    ctx.moveTo(MathFloor(x1)+desp, MathFloor(y1)+desp);
    ctx.lineTo(MathFloor(x2)+desp, MathFloor(y2)+desp);
    ctx.stroke();
  }
  
  /**
   * Get a color string from a Descartes color
   * @param {DescartesJS.Evaluator} evaluator the evaluator needed for evaluate the posible expressions
   * @param {String|Object} color Descartes color especification
   * @return {String} return a string corresponding to the color
   */
  descartesJS.getColor = function(evaluator, color) {
    // if the color is a string then return that string color
    if ( typeof(color) == "string" ) {
      return color;
    }
    // if the color has an expression, then evaluate the string and return the corresponding color
    else {
      colorExpr = evaluator.evalExpression(color);
      red   = MathFloor(colorExpr[0][0]*255);
      green = MathFloor(colorExpr[0][1]*255);
      blue  = MathFloor(colorExpr[0][2]*255);
      alpha = (1-colorExpr[0][3]);

      return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }    
  }
  
  /**
   * Get some feature needed for the properly interpretation of the Descartes lesson
   */
  descartesJS.getFeatures = function() {
    // detects if the browser has java enable
    descartesJS.hasJavaSupport = navigator.javaEnabled();

    // detects if the browser supports touch events
    var system = navigator.appVersion.toLowerCase();
    descartesJS.hasTouchSupport = ((window.hasOwnProperty) && (window.hasOwnProperty("ontouchstart"))) || (system.match("android")&&true);
    descartesJS.hasTouchSupport = ((navigator.userAgent).toLowerCase()).match("qt") ? false : descartesJS.hasTouchSupport;

    descartesJS.isIOS = !!(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i));

    // detects if the browser has canvas support
    var elem = document.createElement('canvas');
    descartesJS.hasCanvasSupport = (elem.getContext && elem.getContext('2d'));
    if (descartesJS.hasCanvasSupport) {
      // render context used to measuere text
      descartesJS.ctx = document.createElement("canvas").getContext("2d");
    }

    setNewToFixed();
  }

  /**
   * Function that changes the definition of the function toFixed of the Number object
   */
  function setNewToFixed() {
    var strNum;
    var indexOfDot;
    var extraZero;
    var diff;
    
    var indexOfE;
    var exponentialNotaionSplit;
    var exponentialNumber;
    var exponentialSign;
    var moveDotTo;

    function getStringExtraZeros(n) {
      return new Array(n+1).join("0");
    }

    // maintain the original toFixed function
    Number.prototype.originalToFixed = Number.prototype.toFixed;

    Number.prototype.toFixed = function(decimals) {
      // if (decimals <= 20) {
      //   return this.originalToFixed(decimals);
      // }
      decimals = (decimals) ? decimals : 0;
      decimals = (decimals<0) ? 0 : parseInt(decimals);

      strNum = this.toString();

      indexOfE = strNum.indexOf("e");
      indexOfDot = strNum.indexOf(".");

      if (indexOfE !== -1) {
        exponentialNotaionSplit = strNum.split("e");
        exponentialSign = (exponentialNotaionSplit[0][0] === "-") ? "-" : "";
        exponentialNumber = (exponentialSign === "-") ? exponentialNotaionSplit[0].substring(1) : exponentialNotaionSplit[0];

        moveDotTo = parseInt(exponentialNotaionSplit[1]);

        if (indexOfDot+moveDotTo < 0) {
          strNum = exponentialSign + "0." + getStringExtraZeros(Math.abs(indexOfDot+moveDotTo)) + exponentialNumber.replace(".", "");
          indexOfDot = 1;
        }
        else {
          exponentialNumber = exponentialNumber.replace(".", "");
          strNum = exponentialSign + exponentialNumber + getStringExtraZeros(moveDotTo-exponentialNumber.length+1);
          indexOfDot = -1;
        }
      }

      extraZero = "";

      if (indexOfDot === -1) {
        if (decimals > 0) {
          extraZero = ".";
        }

        extraZero += (new Array(decimals+1)).join("0");

        return strNum + extraZero;
      }
      else {
        diff = strNum.length - indexOfDot - 1;

        if (diff >= decimals) {
          if (decimals <= 11) {
            strNum = parseFloat(strNum).originalToFixed(decimals);
          }
          
          return (decimals>0) ? strNum.substring(0, indexOfDot +1 +decimals) : strNum.substring(0, indexOfDot);
        }
        else {
          for (var i=0, l=decimals-diff; i<l; i++) {
            extraZero += "0";
          }
          return strNum + extraZero;
        }
      }
    }
  }
  
  /**
   *
   */
  descartesJS.removeNeedlessDecimals = function(num) {
    var indexOfDot;
    var decimalNumbers;

    if (typeof(num) == "string") {
      indexOfDot = num.indexOf(".");
      if (indexOfDot != -1) {
        decimalNumbers = num.substring(indexOfDot)

        if (parseFloat(decimalNumbers) == 0) {
          return num.substring(0, indexOfDot);
        }
        else {
          for (var i=decimalNumbers.length; i>0; i--) {
            if (decimalNumbers.charAt(i) != 0) {
              return num.substring(0, indexOfDot+i+1);
            }
          }
        }
        
        return num;        
      }
    }

    return num;
  }

  /**
   *
   */
  descartesJS.returnValue = function(v) {
    if (descartesJS.fullDecimals) {
      return v;
    }

    if (typeof(v) === "number") {
      return parseFloat(v.toFixed(11));
    }
    return v;
  }

  /**
   * Get which mouse button is pressed
   */
  descartesJS.whichButton = function(evt) {
    // all browsers
    if (evt.which !== null) {
      return (evt.which < 2) ? "L" : ((evt.which === 2) ? "M" : "R");
    }
    // IE
    return (evt.button < 2) ? "L" : ((evt.button === 4) ? "M" : "R");
  }

  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor postion
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.getCursorPosition = function(evt) {
    // if has touch events
    if (evt.touches) {
      var touch = evt.touches[0];
    
      mouseX = touch.pageX; 
      mouseY = touch.pageY;
    } 
    // if has mouse events
    else {
      // all browsers
      if (evt.pageX != undefined && evt.pageY != undefined) { 
        mouseX = evt.pageX; 
        mouseY = evt.pageY;
      } 
      // IE
      else { 
        mouseX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
      }
    }

    return { x:mouseX, y:mouseY };
  }
  
  /**
   * Get the width in pixels of a text 
   * @param {String} text the text to measured
   * @param {String} font the font of the text
   * @return {Number} return the width of the text in pixels
   */
  descartesJS.getTextWidth = function(text, font) {
    descartesJS.ctx.font = font;
    return Math.round( descartesJS.ctx.measureText(text).width );
  }

  // auxiliary values to calculate the metrics
  var text = document.createElement("span");
  text.appendChild( document.createTextNode("Áp") );
  var block = document.createElement("div");
  block.setAttribute("style", "display: inline-block; w: 1px; h: 0px;");
  var div = document.createElement("div");
  div.setAttribute("style", "margin: 0; padding: 0;");
  div.appendChild(text);
  div.appendChild(block);
  var metricCache = {};

  /**
   * Get the metrics of a font
   * @param {String} font the Descartes font to obtain the metric
   * @return {Object} return an object containing the metric of the font (ascent, descent, h)
   */
  descartesJS.getFontMetrics = function(font) {
    if (metricCache[font]) {
      return metricCache[font];
    }

    text.setAttribute("style", "font: " + font + "; margin: 0px; padding: 0px;");

    document.body.appendChild(div);

    var result = { ascent: 0,
                   descent: 0,
                   h: 0,
                   baseline: 0
                 };

    if (div.getBoundingClientRect) {
      block.style.verticalAlign = "baseline";
      result.ascent = block.offsetTop - text.offsetTop;
      result.h = div.getBoundingClientRect().height || 0;
      result.descent = result.h - result.ascent;
      result.baseline = result.ascent;
    }
    else {
      block.style.verticalAlign = "baseline";
      result.ascent = block.offsetTop - text.offsetTop;
      
      block.style.verticalAlign = "bottom";
      result.h = block.offsetTop - text.offsetTop;
      
      result.descent = result.h - result.ascent;
      
      result.baseline = result.ascent;
    }

    document.body.removeChild(div);

    metricCache[font] = result;
    
    return result;
  }

  /**
   * Get the font size give the height of an element
   * @param {Number} the height of an element
   * @return {Number} return the best font size of the text that fits in the element
   */
  descartesJS.getFieldFontSize = function(height) {
    height = Math.min(50, height);

    if (height >= 24) {
      height = Math.floor(height/2+2-height/16);
    } 
    else if (height >= 20) {
      height = 12;
    } 
    else if (height >= 17) {
      height = 11;
    } 
    else if (height >= 15) {
      height = 10;
    } 
    else {
      height = 9;
    }
    return height;

    // if (height <= 14) {
    //   return 8; 
    // }

    // if ((height > 14) && (height <= 16)) {
    //   return 9;
    // }

    // if ((height > 16) && (height <= 19)) {
    //   return 10;
    // }

    // if ((height > 19) && (height <= 22)) {
    //   return 11;
    // }

    // if (height > 22) {
    //   return parseInt(height - 11);
    // }

    // return MathFloor(height - (height*.25));
  }

  /**
   * Get a screenshot of the lesson
   * @return {Image} return a screenshot image of the lesson
   */
  descartesJS.getScreenshot = function() {
    var app = descartesJS.apps[0];
    var space_i;
    var canvas = document.createElement("canvas");
    var image = new Image();

    if (app) {
      canvas.setAttribute("width", app.width);
      canvas.setAttribute("height", app.height);
      var ctx = canvas.getContext("2d");

      for (var i=0, l=app.spaces.length; i<l; i++) {
        space_i = app.spaces[i];

        // draw the content of a 2D space
        if (space_i.type === "R2") {
          ctx.drawImage(space_i.backgroundCanvas, space_i.x, space_i.y);
          ctx.drawImage(space_i.canvas, space_i.x, space_i.y);

          getScreenshotControls(ctx, space_i.container, space_i.ctrs);
        }
      }

      // draw the north space region
      if (app.northSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.northSpace.container, app.northSpace);
      }
      // draw the south space region
      if (app.southSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.southSpace.container, app.southSpace);
      }
      // draw the east space region
      if (app.eastSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.eastSpace.container, app.eastSpace);
      }
      // draw the west space region
      if (app.westSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.westSpace.container, app.westSpace);
      }

      image.src = canvas.toDataURL("image/png");
    }

    return image;
  }

  /**
   * Auxiliary function to draw the north, south, east and west regions
   * @param {2DContext} ctx the rendering context to draw
   * @param {HTMLnode} container the html container of the region
   * @param {Space} space the space to draw
   */
  function getScreenshotRegion(ctx, container, space) {
    ctx.fillStyle = "#c0c0c0";

    ctx.fillRect(container.offsetLeft, 
                 container.offsetTop, 
                 container.offsetWidth, 
                 container.offsetHeight);

    getScreenshotControls(ctx, container, space.controls);
  }

  /**
   * Auxiliary function to draw the controls of a space
   * @param {2DContext} ctx the rendering context to draw
   * @param {HMTLnode} container the html container of the space
   * @param {Array<Control>} controls the controls of the space to draw
   */
  function getScreenshotControls(ctx, container, controls) {
    var ctr_i;

    for (var i=controls.length-1; i>=0; i--) {
      ctr_i = controls[i];

      ctx.drawImage(ctr_i.getScreenshot(), container.offsetLeft + ctr_i.x, container.offsetTop + ctr_i.y);
    }
  }

  var htmlAbout = 
  "<html>\n" +
  "<head>\n" +
  "<style>\n" +
  "body{ text-align:center; }\n" +
  "iframe{ width:650px; height:73px; overflow:hidden; border:1px solid black; }\n" +
  "dt{ font-weight:bold; margin-top:10px; }\n" +
  "</style>\n" +
  "</head>\n" +
  "<body>\n" +
  "<iframe src='http://arquimedes.matem.unam.mx/Descartes5/creditos/bannerPatrocinadores.html'></iframe>\n" +
  "<h2> <a href='http://proyectodescartes.org/' target='_blank'>ProyectoDescartes.org</a> <br> <a href='http://descartesjs.org' target='_blank'>DescartesJS.org</a> </h2>\n" +
  "<dl>\n" +
  "<dt> Dise&ntilde;o funcional:</dt>\n" +
  "<dd>\n" +
  "<nobr>Jos&eacute; Luis Abreu Leon,</nobr>\n" +
  "<nobr>Jos&eacute; R. Galo Sanchez,</nobr>\n" +
  "<nobr>Juan Madrigal Muga</nobr>\n" +
  "</dd>\n" +
  "<dt>Autores del software:</dt>\n" +
  "<dd>\n" +
  "<nobr>Jos&eacute; Luis Abreu Leon,</nobr>\n" +
  "<nobr>Marta Oliver&oacute; Serrat,</nobr>\n" +
  "<nobr>Oscar Escamilla Gonz&aacute;lez,</nobr>\n" +
  "<nobr>Joel Espinosa Longi</nobr>\n" +
  "</dd>\n" +
  "</dl>\n" +
  "<p>\n" +
  "El software en Java est&aacute; bajo la licencia\n" +
  "<a href='https://joinup.ec.europa.eu/software/page/eupl/licence-eupl'>EUPL v.1.1 </a>\n" +
  "<br>\n" +
  "El software en JavaScript est&aacute; bajo licencia\n" +
  "<a href='http://www.gnu.org/licenses/lgpl.html'>LGPL</a>\n" +
  "</p>\n" +
  "<p>\n" +
  "La documentaci&oacute;n y el c&oacute;digo fuente se encuentran en :\n" +
  "<br>\n" +
  "<a href='http://arquimedes.matem.unam.mx/Descartes5/'>http://arquimedes.matem.unam.mx/Descartes5/</a>\n" +
  "</p>";

  var htmlCreative = "<p>\n" +
  "Este objeto, creado con Descartes, est&aacute; licenciado\n" +
  "por sus autores como\n" +
  "<a href='http://creativecommons.org/licenses/by-nc-sa/2.5/es/'><nobr>Creative Commons</nobr></a>\n" +
  "<br>\n" +
  "<a href='http://creativecommons.org/licenses/by-nc-sa/2.5/es/'><img src='http://i.creativecommons.org/l/by-nc-sa/3.0/es/88x31.png'></a>\n" +
  "</p>";

  var htmlFinal = "</body> </html>";

  /**
   *
   */
  descartesJS.showAbout = function() {
    var content = "data:text/html;charset=utf-8,";
    if (descartesJS.creativeCommonsLicense) {
      content += encodeURI(htmlAbout + htmlCreative + htmlFinal);
    }
    else {
      content += encodeURI(htmlAbout + htmlFinal);
    }

    window.open(content, "creditos", "width=700,height=500,titlebar=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0");
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Simplify ajax requests
   * @return return an ajax object ready for requests
   */
  function newXMLHttpRequest() {
    var xhr = false;
    
    // all browsers
    if (window.XMLHttpRequest) {
      try { 
        xhr = new XMLHttpRequest();
      }
      catch (e) { 
        xhr = false;
      }
    }
    // IE do not have an XMLHttpRequest native object, so try an activeX object
    else if (window.ActiveXObject) {
      try { 
        xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
      }
      catch(e) {
        try { 
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e) {
          xhr = false;
        }
      }
    }
    
    return xhr;
  }
  
  var response;
  var xhr;
  descartesJS._externalFilesContent = {};
  /**
   * Open an external file using an ajax request
   * Abre un archivo externo
   * @param {String} filename el nombre del archivo que se quiere abrir
   * @return the content of the file if readed or null if not
   */
  descartesJS.openExternalFile = function(filename) {
    ////////////////////////////////////////////////////////// 
    if (descartesJS._externalFilesContent[filename]) {
      return descartesJS._externalFilesContent[filename];
    }
    //////////////////////////////////////////////////////////

    response = null;
    xhr = newXMLHttpRequest();
    xhr.open("GET", filename, false);
    try {
      xhr.send(null);
      response = xhr.responseText;
        
      ////////////////////////////////////////////////////////////////////////
      // patch to read ISO-8859-1 text files
      if (response.match(String.fromCharCode(65533))) {
	      xhr.open("GET", filename, false);
	      xhr.overrideMimeType("text/plain; charset=ISO-8859-1");
	      xhr.send(null);
	      response = xhr.responseText;
      }
      ////////////////////////////////////////////////////////////////////////
    }
    catch (e) {
      console.log("Error to load the file :", filename);
      response = null;
    }
    
    return response;
  }

  /**
   *
   */
  descartesJS.addExternalFileContent = function(filename, data) {
    descartesJS._externalFilesContent[filename] = data;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var tmpAnswer;
  var tempAnswers;
  var answerArray;
  var regExpPattern;
  var answerValue;

  var answer_0;
  var answer_1;
  var limInf;
  var limSup;
  var cond1;
  var cond2;
  var cond3;
  var cond4;

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildTextRegularExpressionPattern(answer) {
    tmpAnswer = answer.trim();
    answer = { ignoreAcents: false, ignoreCaps: false, regExp: null };

    // ignore uppercase
    if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
      answer.ignoreCaps = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // ignore accents
      if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
        answer.ignoreAcents = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }
        
    // ignore accents
    if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
      answer.ignoreAcents = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // ignore uppercase
      if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
        answer.ignoreCaps = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }

    if ((tmpAnswer.charAt(0) === "*") && (tmpAnswer.charAt(tmpAnswer.length-1) !== "*")) {
      tmpAnswer = (tmpAnswer.substring(1)) + "$";
    }

    else if ((tmpAnswer.charAt(0) !== "*") && (tmpAnswer.charAt(tmpAnswer.length-1) === "*")) {
      tmpAnswer = "^" + (tmpAnswer.substring(0, tmpAnswer.length-1));
    }

    else if ((tmpAnswer.charAt(0) !== "*") && (tmpAnswer.charAt(tmpAnswer.length-1) !== "*")) {
      tmpAnswer = "^" + tmpAnswer + "$";
    }

    else if ((tmpAnswer.charAt(0) === "*") && (tmpAnswer.charAt(tmpAnswer.length-1) === "*")) {
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
    }
        
    tmpAnswer = tmpAnswer.replace(/\?/g, "[\\S\\s]{1}");

    answer.regExp = tmpAnswer;
    
    return answer;
  }

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildNumericRegularExpressionPattern(answer, evaluator) {
    tmpAnswer = answer.trim();
    answer = { ignoreAcents: false, ignoreCaps: false, regExp: null };

    answer.expr = tmpAnswer.split(",");

    answer.expr[0] = answer.expr[0].trim();
    answer.expr[0] = { type: answer.expr[0].charAt(0),
                       expr: evaluator.parser.parse(answer.expr[0].substring(1))
                     };

    answer.expr[1] = answer.expr[1].trim();
    answer.expr[1] = { type: answer.expr[1].charAt(answer.expr[1].length-1),
                       expr: evaluator.parser.parse(answer.expr[1].substring(0, answer.expr[1].length-1))
                     };

    return answer;
  }

  function inRange(regExp, value, evaluator) {
    value = parseFloat(value);

    answer_0 = regExp.expr[0];
    answer_1 = regExp.expr[1];
    
    limInf = evaluator.evalExpression(answer_0.expr);
    limSup = evaluator.evalExpression(answer_1.expr);
    
    cond1 = (answer_0.type == "(");
    cond2 = (answer_0.type == "[");
    cond3 = (answer_1.type == ")");
    cond4 = (answer_1.type == "]");
    
    if (((cond1 && (value > limInf)) || (cond2 && (value >= limInf))) &&
        ((cond3 && (value < limSup)) || (cond4 && (value <= limSup)))
       ) {
      return 1;
    }
    
    return 0;
  }

  /**
   * Remove the accents in a string and change the ñ for n
   * @param {String} value the string to remove the accents
   * @return {String} return ths string with the accents remove
   */
  function removeAccents(value) {
    return value.toString().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/Á/g, "A").replace(/É/g, "E").replace(/Í/g, "I").replace(/Ó/g, "O").replace(/Ú/g, "U").replace(/ñ/g, "n").replace(/Ñ/g, "N");
  }
  
  /**
   * Build a regular expression pattern from a Descartes answer pattern
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a regular expression pattern
   */
  descartesJS.buildRegularExpresionsPatterns = function(answer, evaluator) {
    // remove parentheses in a text expression
    if ((answer.charAt(0) === "(" ) && (answer.charAt(answer.length-1) === ")") && (answer.indexOf(",") === -1)) {
      answer = answer.substring(1, answer.length-1);
    }

    answer = ((answer.replace(/&squot;/g, "'")).replace(/&amp;/g, "&")).split("|");

    for (var i=0, l=answer.length; i<l; i++) {
      tempAnswers = answer[i].split("&");
      answerArray = [];

      for (var j=0, k=tempAnswers.length; j<k; j++) {
        tmpAnswer = tempAnswers[j];

        // numeric pattern
        if ( (tmpAnswer.indexOf(",") !== -1) && 
             ( ((tmpAnswer.charAt(0) === "(" ) || (tmpAnswer.charAt(0) === "[")) && 
               ((tmpAnswer.charAt(tmpAnswer.length-1) === ")") || (tmpAnswer.charAt(tmpAnswer.length-1) === "]")) 
             )
           ) {
          answerArray.push( buildNumericRegularExpressionPattern(tmpAnswer, evaluator) );          
        }
        // text pattern
        else {
          answerArray.push( buildTextRegularExpressionPattern(tmpAnswer) );
        }
      }
      
      answer[i] = answerArray;
    }

    return answer;
  }
  
  /**
   * Decide whether the answer meets the Descartes answer pattern ignoring accents and uppercase
   * @param {String} respPattern the Descartes answer pattern
   * @param {String} resp the answer to check
   * @return {Number} return 1 if the answer meets the Descartes answer pattern and 0 if not
   */
  descartesJS.escorrecto = function(respPattern, resp, evaluator, regExpPattern) {
    evaluator = evaluator || descartesJS.externalEvaluator;
    regExpPattern = regExpPattern || descartesJS.buildRegularExpresionsPatterns(respPattern, evaluator);

    // remove the accents
    resp = removeAccents(resp);

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswers = regExpPattern[i];
      answerValue = true;

      for (var j=0, k=tempAnswers.length; j<k; j++) {
        // a text pattern
        if (tempAnswers[j].regExp) {
          answerValue = answerValue && !!(resp.match( removeAccents(tempAnswers[j].regExp), "i" ));
        }
        // a numeric pattern
        else {
          answerValue = answerValue && inRange(tempAnswers[j], resp, evaluator);
        }
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  /**
   * Decide whether the answer meets the Descartes answer pattern strictly
   * @param {String} respPattern the Descartes answer pattern
   * @param {String} resp the answer to check
   * @return {Number} return 1 if the answer meets the Descartes answer pattern and 0 if not
   */
  descartesJS.esCorrecto = function(respPattern, resp, evaluator, regExpPattern) {
    evaluator = evaluator || descartesJS.externalEvaluator;
    regExpPattern = regExpPattern || descartesJS.buildRegularExpresionsPatterns(respPattern, evaluator);

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswers = regExpPattern[i];
      answerValue = true;
      
      for (var j=0, k=tempAnswers.length; j<k; j++) {
        tmpAnswer = tempAnswers[j].regExp;
        
        // a text pattern
        if (tmpAnswer) {
          if (tempAnswers[j].ignoreAcents) {
            resp = removeAccents(resp);
            tmpAnswer = removeAccents(tmpAnswer);
          }
          
          if (tempAnswers[j].ignoreCaps) {
            resp = resp.toLowerCase();
            tmpAnswer = removeAccents(tmpAnswer).toLowerCase();
          }

          answerValue = answerValue && !!(resp.match(tmpAnswer));
        }
        // a numeric pattern
        else {
          answerValue = answerValue = answerValue && inRange(tempAnswers[j], resp, evaluator);
        }
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  // var w;
  // var h;
  // var canvas;
  // var ctx;
  // var black;
  // var white;
  // var gray;

  /**
   * Get the embedded image of the license used in Arquimedes
   * @return {Image} return the image of the license used in Arquimedes
   */
  descartesJS.getCreativeCommonsLicenseImage = function() {
    var img = new Image();

    // w = 88;
    // h = 31;
    // black = "#000";
    // white = "#fff";
    // gray = "#bebebe";

    // canvas = document.createElement("canvas");
    // canvas.setAttribute("width", w);
    // canvas.setAttribute("height", h);
    // ctx = canvas.getContext("2d");

    // ctx.lineWidth = 1;
    // ctx.fillStyle = gray;
    // ctx.fillRect(0, 0, w, h);

    // ctx.strokeStyle = black;
    // ctx.strokeRect(.5, .5, w-1, h-1);

    // ctx.fillStyle = black;
    // ctx.fillRect(0, 21, w, h)

    // ctx.fillStyle = gray;
    // ctx.beginPath();
    // ctx.arc(14, 14.5, 13.5, 0, Math.PI);
    // ctx.fill();

    // ctx.lineWidth = 2;
    // ctx.fillStyle = white;

    // // cc
    // ctx.beginPath();
    // ctx.arc(14, 14.5, 10.5, 0, 2*Math.PI);
    // ctx.fill();
    // ctx.stroke();
    // ctx.font = "bold 12px Arial";
    // ctx.fillStyle = black;
    // ctx.fillText("cc", 7.5, 18);
    // ctx.fillStyle = white;

    // // by
    // ctx.beginPath();
    // ctx.arc(40, 11, 7.5, 0, 2*Math.PI);
    // ctx.fill();
    // ctx.stroke();
    // ctx.fillStyle = black;
    // ctx.fillRect(39, 6, 2, 2);
    // ctx.fillRect(38.5, 9, 3.5, 3.5);
    // ctx.fillRect(39, 9, 2, 7);
    // ctx.fillStyle = white;

    // // nc
    // ctx.beginPath();
    // ctx.arc(58, 11, 7.5, 0, 2*Math.PI);
    // ctx.fill();
    // ctx.stroke();
    // // inside nc
    // ctx.font = "bold 11px Arial";
    // ctx.fillStyle = black;
    // ctx.fillText("$", 55.5, 15);
    // ctx.fillStyle = white;
    // ctx.beginPath();
    // ctx.moveTo(51, 9);
    // ctx.lineTo(64, 13);
    // ctx.stroke();

    // // sa
    // ctx.beginPath();
    // ctx.arc(76, 11, 7.5, 0, 2*Math.PI);
    // ctx.fill();
    // ctx.stroke();
    // // inside sa
    // ctx.beginPath();
    // ctx.arc(76, 11, 3.5, 4*Math.PI/5, Math.PI, true);
    // ctx.stroke();

    // // text
    // ctx.font = "8px Arial";
    // ctx.fillText("BY", 35, 29);
    // ctx.fillText("NC", 53, 29);
    // ctx.fillText("SA", 71, 29);

    // img.src = canvas.toDataURL();

    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAfCAYAAABjyArgAAAABHNCSVQICAgIfAhkiAAACpVJREFUaIHtWm1sU9cZfu61iUYnPP/bJgdhhDbFkVYcCrR0tLHXrVNL01wvgUJDh820tivrkpQQtpEvA4HGhDoe/dCmNfbaVa1WKszX2oUO3xC0OHESm9Hi/FhloyQq1aY5OGgq8ce7H9f3xI7txKFsdKyPdHSPz8dzz33Oe77eY46IVBzHXcUXuOkgIo4DQABwuucUeJ4Hz/NQKBTgeQUUPA9ekXryPDiOB89x4DgO4DiZBQQCJQlJSiKZlEIikZCeyQQSiSSSyQTLS1KSlSciuTEsfjtgY+UmAAAHgGRxFQqFFHjFTFyhkPJ4RUpkDhzHp+ubEiclbFISM5FIhfR4IlPkZDLJhE0X+nbBxspNUALIFFehhDLjKYWTx0/B4/FgcHAQU9GpDKIlqiVYu3YtjN8xouLRR5BIKsDzcalDEjw4cJD6cgaUJGkkANIY4iRxR3x+uN9xIxgMZpTX6XQQqgSsWlNW0Md9Xng4APSns+9BqVQyUZVKpRQUSvSK52B73oaJiYmCGqTRaND4i0aUl9+PeCKBRCKOeDwVEnHE4wlm4emW/PHExzjS9SJGg6MAAIPBAL1eDwAIBAIQRREAUKIrwY7aHfja17+a8/1XPv4ELzle+lzwbKzcJAn8fu8ZKBXKGWGVi7BIqURrcxvcx9ysglqthiAI0Gq1KC8vBwD09vYiHA7D7XZjcnKSlRVMAhoad2LxHYsRj8cRi8cRj8cQj8czpwxK4mrkKn769LOIRqMQBAF2ux1arTajseFwGPX19XC73VCpVGi3tWd91LXoNdTuqPvc8MjzMJ3tO0t9/eeo39dPQwEfXfggQIJJIEiDl9RqNbW1tVEkEqG54HQ6Sa1Ws3oluhI6399HQ4Eh8g71U1//OfL0naUzYg+99+d36XTPKTrx7nHS6XQEgMxmcwafzDP7HTL328f/kBFKdCU5eRx2Oz3+2ObPxDM2Nkbe/n7y9vfT2NhYQTwAiAcARWoOVioUUCoyLVev18Pv96O1tRVqtTprGKTDbDYjFAqxoTQaHEWn7XDGXM6zHYm0G/F5fQgGgxAEAY27ds3JL79DEASMBkcx4vOz9BGfH6PBUawqK8O996xj6b/q6sLzNhtOnj6N3Q27MD4+XhBPent+/9prMKy/DzWbt6Bm8xYY1t+HMz09c/Kkg/q8feQd8tLIhWFyHHEwy9Hr9fNabS5EIhHS6/WMx/Gig0b+OkIDw1467+0jz3nJit99/4+kK5WsNxQKFcwfCoUIAOl0OmYt8igo+cY3acUyLZV/ez09/eMnCQC1tbXRwQMHCQAdffvtgnjk9nj7+yW+u9fRj7ZZqHFnA61YpqUVy7TksNvz8uSwYMmKbc/bAEjzrdPpnNdqc0GtVsPj8bC6toO21F46ZcFcak/N8wheCsJgMGTNcRaLhVm5xWLJyNNqtTAYDBkrezAo8VRUVGDjpk0YHx/HmZ4erFimxb+mrmHrE1tx6cMPUVVdXRCPVqtFNBpF0H8RAFAp/AC/dXWjo/MQ9rQ0AwBc3c68PDJ4AKlhK23F5N1CXV0dG+o3ArVaDbvdDgCYmJjAyROn2IFFEplj27Rc73G5XDnjMnLV0ev1sB3uxEFbB954601UVVfjo8th2A53YunSpXB1OxG8dKkgHhntL0gG95vfvcrSvvfggwCAaDSKT65cycsDpASWrcnj8QCQxKmtrWWFRFGEyWSC0WiE0WiE1WrNm9fV1cXyzGYzs2LPWU+a9XLg+BmB/xO4+5570NF5CGNjY2jc2YCyb92Jd44eRcXDG1CzeQubQ+eCSqWCw+HAHaoleOWVV3KW+fTT63NySAcNjgPPcRgcHAQACILAhBFFEUajMaOSKIoQRRG1tbUwmUxZeRcuXIDT6WRcLpcLg4OD0gkwJawkriRwIBDIapjZbGaWazabs/Jz1ZmdFo1GcaanBx2dh2C+ZEHFwxsAAANeLwa8XhQXF4NbpJyTZ5FSicaGBtyxeDFLG/B6WXyZdlne9gDMgqUPlk9oK1euZAXq6+sBSPNMKBSCx+OBVqvFtm3bmCXr9XqEQiEcO3YsY48MgMWnolPSe8ClPYHS0lKIoohwOJzRMLmDZscBaQ8qiiJ0Oh1L0+l0WTw/efIptO/dh1V3rkTN5i346HIYVdXV6Og8hJqtWwviGR8fR1tLKx5/bDPa9+5D+959aGlqAgDs2r07b3syBAaHjOGaPp/IPWM2m9lkHgqFYDabWZ58+BAEgeXJSF+8JKPNPDZvfExadOSOLARyWaFKYGlyPJ2no/MQLNu348o//o6/hUJw2O3Y09KMqupqWPfvQ9ma1fPyWLZvh2X7dgCAs7sbzu5uXP/0OjZUPIItNY/nbY+M7PHxX8a69eugK9XB7XbDYrFkWetsyKenEl1Jhh9g1ZoylOhKMniKi4uxp6UZX1q8GCPDw/hZXd0N8expacb3H3oIly+HAUijTldaOiePDMmCKdOLlT6fyNbscrkwOTmJQCCA5cuXw2q1sjz5mJyeJyN9yEpnM3l7PIPmtmaoVCq4XC6YTCZWh9K8bOFwGCaTCV1dXVCpVNhRuyPrY3b/sjEnz85dDXjjrTc/E8/qNatRVV2Nqupq6EpLC+IBUs4e38ggioqKsP7e+zAVnYLZbGaW5Ha7sxYyQJoyKisr8+bJ9evr69HV1YUlqiU4/5c+TE9PYzo2jVg8hlgsLjmDEnFE/jmJA9YDbC+p1+uh1+uhVqshiiLr9PmcNNei19BxwMacNLeShzl7BoYHUFRUBGuLFe5jbqjVakQiEVZQFEU4HA7mzDEYDGhtbWUd4HA4WNn0PABYvnw5wuEwHvjuAzhs78T16WnEZgks+42TiSR8Az4cO3rr3Yw3g4cJ7B3qx6JFRTh/7jxqn5X2v3a7HXVpc9aNwOVysVPY/gP78fCGhzAdm8Z0LIZ4LIZYfJbAORzw/8vYWLlJmoPlKx2DsRwajQYAYLVas7ZOC8Hk5CRbXTUaTcoRn7rFSCaRTM3FlLpyul3BA0CSkkgkpHu0fe17AUgCmUymDB9voZicnITRaGR1G3/emHKwJ2ZETrsyYovsrMX2dgEBoKbWJvKNDFLgop+e+OETGR41v9+/IE9XuidNMAkUuOgn38gg7W3fy9L/j8LMj7rnamnI76PADTjcI5EItbW1ZTjc16xdQxc+CNBQwEdNrU23+kNvSWDX9jKaW5tQaRKgVCpx2HYYr7/2Ostb6JWRdV8b4vE4BgYG8cxTz2A+pE8P8smSiDJOmbN/5+PJV0d+R6GOpnxtWhDH7NDc2iRZ8kU/dbteJY1GU3CPaTQachxxUOCin4YCPnr51y8XXJeI5oynp83HM1/9QrhylVkoR5YFy6h7rhY1W2vYVY/o6cWJ4yfmvLZ/VHgUBkM5u9A8fvwE9lv3F9DHEnJZS3reQqyO47i8z4VgtrXOXoTn48srMACsuqsMza0tKF6qSbuNSHc3ImPfKv/xZGJ8HC902nGu99yCP+azTA35eABkCbxQsXN1UiEccwos4/7y+7GhYgPuWn0XvqJSpf46Jb9ZetHVaBTDQ8M4ffL0goVN/wjWsJtgwbl+L2T+nG9NuGkCf4EbB09EX77VjbhdQUTcvwFtwhQyXNo3TwAAAABJRU5ErkJggg==";

    return img;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var evaluator;
  var tmpColor;
  var splitColor;
  var hexColor;
  var splitString;
  var numParentheses;
  var numSquareParenteses;
  var lastSplitIndex;
  var charAt;
  var r;
  var g;
  var b;
  var a;

  /**
   *
   */
  descartesJS.Color = function(color, evaluator) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;

    this.evaluator = evaluator;

    // construct a simple color
    if (!color) {
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorString;
      return;
    }

    // the color is a color name
    if (babel[color]) {
      if (babel[color] === "net") {
        color = "rojo";
      }

      color = babel[color];

      this.r = parseInt("0x"+color.substring(1,3), 16);
      this.g = parseInt("0x"+color.substring(3,5), 16);
      this.b = parseInt("0x"+color.substring(5,7), 16);
      this.colorStr = color;

      this.getColor = this.getColorString;
    }

    // the color is six hexadecimals digits #RRGGBB
    if (color.length === 6) {
      this.r = parseInt("0x"+color.substring(0,2), 16);
      this.g = parseInt("0x"+color.substring(2,4), 16);
      this.b = parseInt("0x"+color.substring(4,6), 16);
      this.colorStr = "#" + color;

      this.getColor = this.getColorString;
    }

    // the color is eight hexadecimals digits #RRGGBBAA
    if (color.length === 8) {
      this.r = parseInt("0x"+color.substring(2,4), 16);
      this.g = parseInt("0x"+color.substring(4,6), 16);
      this.b = parseInt("0x"+color.substring(6,8), 16);
      this.a = (1-parseInt("0x"+color.substring(0,2), 16)/255);
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorString;
    }

    // the color is a Descartes expression (exprR, exprG, exprB, exprA)
    if (color[0] === "(") {
      tmpColor = [];
      splitColor = this.splitComa(color.substring(1, color.length-1));

      for (var i=0, l=splitColor.length; i<l; i++) {
        hexColor = parseInt(splitColor[i], 16);

        if ( (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16)) ) {
          if ((splitColor[i].charAt(0) === "[") && (splitColor[i].charAt(splitColor[i].length-1) === "]")) {
            splitColor[i] = splitColor[i].substring(1, splitColor[i].length-1);
          }

          tmpColor.push(this.evaluator.parser.parse( splitColor[i] ));
        }
        else {
          tmpColor.push(this.evaluator.parser.parse( (hexColor/255).toString() ));
        }
      }

      this.rExpr = tmpColor[0];
      this.gExpr = tmpColor[1];
      this.bExpr = tmpColor[2];
      this.aExpr = tmpColor[3];

      this.getColor = this.getColorExpression;
    }
    
  }

  /**
   * Split a string using a coma delimiter
   * @param {String} string the string to split
   * @return {Array<String>} return an array of the spliting string using a coma delimiter
   */
  descartesJS.Color.prototype.splitComa = function(string) {
    splitString = [];
    
    numParentheses = 0;
    numSquareParenteses = 0;

    lastSplitIndex = 0;

    for (var i=0, l=string.length; i<l; i++) {
      charAt = string.charAt(i);
    
      if (charAt === "(") {
        numParentheses++;
      }
      else if (charAt === ")") {
        numParentheses--;
      }
      else if (charAt === "[") {
        numSquareParenteses++;
      }
      else if (charAt === "]") {
        numSquareParenteses--;
      }
      else if ((charAt === ",") && (numParentheses === 0) && (numSquareParenteses === 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }


  /**
   *
   */
  descartesJS.Color.prototype.getColorString = function() {
    return this.colorStr;
  }

  /**
   *
   */
  descartesJS.Color.prototype.getColorExpression = function() {
    evaluator = this.evaluator;
    this.r = MathFloor(evaluator.evalExpression(this.rExpr) * 255);
    this.g = MathFloor(evaluator.evalExpression(this.gExpr) * 255);
    this.b = MathFloor(evaluator.evalExpression(this.bExpr) * 255);
    this.a = (1 - evaluator.evalExpression(this.aExpr));

    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  }

  /**
   *
   */
  descartesJS.Color.prototype.borderColor = function() {
    if (this.r + this.g + this.b < 380) {
      return "white";
    }
    return "black";
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib){ return descartesJS; }

  /**
   * Add meta tags needed for tablets
   */
  function addMetaTag() {
    var head = document.head;

    // try chrome frame // <meta http-equiv="X-UA-Compatible" content="chrome=1">
    var meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "X-UA-Compatible");
    meta.setAttribute("content", "chrome=1");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");    
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, user-scalable=yes");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-capable");
    meta.setAttribute("content", "yes");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    meta.setAttribute("content", "black-translucent");
    // add the metadata to the head of the document
    head.appendChild(meta);

    // meta = document.createElement("meta");
    // meta.setAttribute("http-equiv", "X-UA-Compatible");
    // meta.setAttribute("content", "IE=edge");
    // // add the metadata to the head of the document
    // head.appendChild(meta);

    // var link = document.createElement("link");
    // link.setAttribute("rel", "apple-touch-icon-precomposed");
    // link.setAttribute("href", "images/descartesLogo.png");
    // // add the link to the head of the document
    // document.head.appendChild(link);
  }
  
  /** 
   * Add CSS rules for the interpreted lesson
   */
  function addCSSrules() {
    // add metadata for tablets
    addMetaTag();
    
    // try to get the style
    var cssNode = document.getElementById("StyleDescartesApps2");
    
    // if the style exists, then the lesson was saved before, then remove the style
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    cssNode = document.createElement("style");
    cssNode.type = "text/css";
    cssNode.id = "StyleDescartesApps2";
    // cssNode.media = "screen";
    cssNode.setAttribute("rel", "stylesheet");
    
    // add the style to the head of the document
    document.head.appendChild(cssNode); 

    cssNode.innerHTML = 
                        "body{ text-rendering:geometricPrecision; }\n" +
                        "canvas{ image-rendering:optimizeSpeed; image-rendering:-moz-crisp-edges; image-rendering:-webkit-optimize-contrast; image-rendering:optimize-contrast; -ms-interpolation-mode:nearest-neighbor; }\n" + 
                        "div.DescartesCatcher{ background-color:rgba(255, 255, 255, 0); cursor:pointer; position:absolute; }\n" +
                        "div.DescartesAppContainer{ border:0px solid black; position:relative; overflow:hidden; top:0px; left:0px; }\n" +
                        "div.DescartesLoader{ background-color :#efefef; position:absolute; overflow:hidden; -box-shadow:0px 0px 0px #888; background-image:linear-gradient(bottom, #bbb 0%, #efefef 50%, #bbb 100%); background-image:-o-linear-gradient(bottom, #bbb 0%, #efefef 50%, #bbb 100%); background-image:-moz-linear-gradient(bottom, #bbb 0%, #efefef 50%, #bbb 100%); background-image:-webkit-linear-gradient(bottom, #bbb 0%, #efefef 50%, #bbb 100%); background-image:-ms-linear-gradient(bottom, #bbb 0%, #efefef 50%, #bbb 100%); top:0px; left:0px; }\n" +
                        "div.DescartesLoaderImage{ background-repeat:no-repeat; background-position:center; position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesLoaderBar{ position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesSpace2DCanvas, canvas.DescartesSpace3DCanvas, div.blocker{ position:absolute; overflow:hidden; left:0px; top:0px; }\n" +
                        "div.DescartesSpace2DContainer, div.DescartesSpace3DContainer{ position:absolute; overflow:hidden; line-height:0px; }\n" + 
                        "canvas.DescartesButton{ position:absolute; cursor:pointer; }\n" +
                        "div.DescartesButtonContainer{ position:absolute; }\n" +
                        "div.DescartesSpinnerContainer, div.DescartesTextFieldContainer, div.DescartesMenuContainer{ background:lightgray; position:absolute; overflow:hidden; }\n" +
                        "input.DescartesSpinnerField, input.DescartesTextFieldField, input.DescartesMenuField, input.DescartesScrollbarField{ -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; padding:0px; border:solid #666 1px; position:absolute; top:0px; }\n" +
                        "label.DescartesSpinnerLabel, label.DescartesMenuLabel, label.DescartesScrollbarLabel, label.DescartesTextFieldLabel{ font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; font-weight:normal; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:#e0e4e8; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesGraphicControl{ border-style:none; position:absolute; }\n" +
                        "div.DescartesTextAreaContainer{ position:absolute; overflow:hidden; background:#c0d0d8; }\n" +
                        "select.DescartesMenuSelect{ font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; padding-top:0%; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:white; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesScrollbarContainer{ background:#eee; overflow:hidden; position:absolute; }\n";
  }

  // immediately add the style to the document
  addCSSrules();

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSin = Math.sin;
  var MathFloor = Math.floor;
  var MathRandom = Math.random;
  var MathRound = Math.round;
  var MathAbs = Math.abs;
  var stringfromCharCode = String.fromCharCode;
  
  var a1 = 1.0;
  var a2 = 1.4;
  var a3 = 0.6;
  var a4 = 2.2;

  var ll;

  var n;
  var k;
  var a;
  var b;
  var c;

  var encripMeu;
  var desencripMeu;
  var nx;
  var x;
  var y;

  /**
   * Descartes krypto
   * @constructor 
   * @param {String} key the key of encryptation
   */
  descartesJS.Krypto = function(key){
    key = key || 0;
    this.key = key.toString();
  }

  /**
   * @param {Number} n
   * @return {String}
   */
  descartesJS.Krypto.prototype.getKey = function(n) {
    ll = [];
    for (var i=0; i<256; i++) {
      ll[i] = stringfromCharCode(this.alfanum( MathFloor( MathAbs(7.5*(MathSin(a1*i-n) + MathSin(a2*i+n) + MathSin(a3*i-n) + MathSin(a4*i+n))) ) ));
    }
    
    return ll.join("");
  }
  
  /**
   * @param {String} s the string to encode
   * @return {String}
   */
  descartesJS.Krypto.prototype.encode = function(s) {
    n = MathFloor(31*MathRandom());
    
    this.key = this.getKey(n);

    b = stringfromCharCode(this.alfanum(n));
    
    return b + this.encripta(s);
  }
  
  /**
   * @param {String} s the string to decode
   * @return {String}
   */
  descartesJS.Krypto.prototype.decode = function(s) {
    n = this.numalfa( s.charCodeAt(0) );

    this.key = this.getKey(n);

    return this.desencripta(s.substring(1));
  }

  /**
   * @param {String} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.encripta = function(OrigMeu) {
    return this.bytesToString( this.encriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param {Array<Bytes>} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.encriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    
    if (this.key == null) {
      return null;
    }
    
    encripMeu = new Array(3*OrigMeu.length);
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      x = MathFloor(OrigMeu[i]+128)*256 + MathRound(MathRandom()*255) + MathRound(MathRandom()*255)*256*256;
      y = MathFloor((x<<this.shift(i))/256);

      encripMeu[3*i] =   this.alfanum(y%32); 
      encripMeu[3*i+1] = this.alfanum((y/32)%32);
      encripMeu[3*i+2] = this.alfanum((y/1024)%32);
    }

    return encripMeu;
  }
    
  /**
   * @param {String} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.desencripta = function(OrigMeu) {
    return this.bytesToString( this.desencriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param {Array<Bytes>} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.desencriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    if (this.key == null) {
      return null;
    }

    desencripMeu = new Array(OrigMeu.length/3);

    for (var i=0, l=desencripMeu.length; i<l; i++) {
      y = this.numalfa(OrigMeu[3*i]) + this.numalfa(OrigMeu[3*i+1])*32 + this.numalfa(OrigMeu[3*i+2])*1024;
      x = MathFloor((y*256)>>this.shift(i));
      
      nx = (MathFloor(x/256)%256)-128;
      if (nx < 0) {
        nx = nx +256;
      }
      
      desencripMeu[i] = nx;
    }
    
    return desencripMeu;   
  }
  
  /**
   * @param Number {Array<Number>} k
   * @return Number {Array<Number>}
   */
  descartesJS.Krypto.prototype.alfanum = function(k) {
    k = MathFloor(k);
    if (k<10) {
      return 48 + k;
    } else {
      return 87 + k;
    }
  }
  
  /**
   * @param Number {Array<Number>} b
   * @return Number {Array<Number>}
   */
  descartesJS.Krypto.prototype.numalfa = function(b) {
    if (b<58) {
      return b-48;
    } else {
      return b-87;
    }
  }
  
  /**
   * @param {String} 
   * @return {Array<Number>}
   */
  descartesJS.Krypto.prototype.stringToBytes = function(OrigMeu) {
    b = new Array(OrigMeu.length);
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      b[i] = OrigMeu.charCodeAt(i);
    }
    
    return b;
  }

  /**
   * @param {Array<Number>}
   * @return {String} 
   */
  descartesJS.Krypto.prototype.bytesToString = function(b) {
    for (var i=0, l=b.length; i<l; i++) {
      b[i] = stringfromCharCode(b[i]);
    }

    return b.join("");
  }
  
  /**
   * @param {Number}
   * @return {Number} 
   */
  descartesJS.Krypto.prototype.shift = function(i) {
    a = (this.key).charCodeAt(i%(this.key.length));
    b = this.numalfa(a);
    c = MathFloor((b/2)%8);
    if (c == 0) {
      c = 4;
    }
    return c;
  }

  /**
   * @param {String} n
   * @return {Array<Number>}
   */
  descartesJS.Krypto.prototype.parseByte = function(n) {
    n = parseInt(n);
    n = (n < 0) ? 0 : n;
    n = (n > 255) ? 255 : n;
    
    return n;
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes animation
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
  */
  descartesJS.Animation = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    var tmp;
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);

    this.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    this.loop = (values.loop) ? values.loop : false;
    // this.auto = ((values.auto == undefined) && (this.parent.version === 2)) ? true : values.auto;
    this.auto = (values.auto == undefined) ? true : values.auto;
    this.controls = values.controls;

    // parse the init expression
    this.init = algorithmAuxiliary.splitInstructions(parser, values.init);

    // parse the do expression
    this.doExpr = algorithmAuxiliary.splitInstructions(parser, values.doExpr);

    // parse the while expression
    if (values.whileExpr) {
      this.whileExpr = parser.parse(values.whileExpr);
    }
    
    var self = this;
    var delay;
    var i;
    var l = self.doExpr.length;

    this.animationExec = function() {
      for (i=0; i<l; i++) {
        evaluator.evalExpression(self.doExpr[i]);
      }

      self.parent.update();

      if ( (self.playing) && ((evaluator.evalExpression(self.whileExpr) > 0) || (self.loop)) ) {
        delay = evaluator.evalExpression(self.delay);
        self.timer = setTimeout(self.animationExec, ((delay < 10) ? 10 : delay));
      } else {
        self.stop();
        self.parent.update();
      }
    }

    this.playing = false;

    // init the animation automatically
    if (this.auto) {
      this.play();
    }
  }  
  
  /**
   * Play the animation
   */
  descartesJS.Animation.prototype.play = function() {
    if (!this.playing) {
      this.reinit();
    
      this.playing = true;
      this.timer = setTimeout(this.animationExec, this.parent.evaluator.evalExpression(this.delay));
    } 
    
    else {
      this.stop();
    }
  }

  /**
   * Stop the animation
   */
  descartesJS.Animation.prototype.stop = function() {
    this.playing = false;
    clearInterval(this.timer);
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.Animation.prototype.reinit = function() {
    for (var i=0, l=this.init.length; i<l; i++) {
      this.parent.evaluator.evalExpression(this.init[i]);
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Descartes action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Action = function(parent, parameter) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    this.evaluator = this.parent.evaluator;
  }  
  
  /**
   * Execute the action
   */
  descartesJS.Action.prototype.execute = function() { }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes message action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Message = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = (parameter || "").replace(/\\n/g, "\n").replace(/&squot;/g, "'");
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Message, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Message.prototype.execute = function() {
    alert(this.parameter);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes calculate action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Calculate = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    // replace the semicolon with a newline, since both notations can appear in the expression
    parameter = parameter || "";
    parameter = parameter.replace(/&squot;/g, "'");
    parameter = parameter.replace(/;/g, "\\n");
    parameter = parameter.split("\\n") || [""];

    // add only the instructions tha execute something, i.e. instructions with parsing different of null
    var tmpParameter = [];
    var tmp;
    for (var i=0, l=parameter.length; i<l; i++) {
      tmp = parser.parse(parameter[i], true);
      if (tmp) {
        tmpParameter.push(tmp);
      }
    }

    var i;
    var l = tmpParameter.length;
    /**
     * Execute the action
     */
    this.execute = function() {
      for (i=0; i<l; i++) {
        evaluator.evalExpression(tmpParameter[i]);
      }
    }

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Calculate, descartesJS.Action);
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes open URL action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.OpenURL = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }
    
    // if the parameter is JavaScript code
    if (this.parameter.substring(0,10) == "javascript") {
      // this.javascript = true;

      // replace the &squot; with '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      this.actionExec = function() {
        eval(this.parameter);
      }
    }
    // if the paramater is a file name
    else {
      // if the parameter is a file name relative to the current page
      if (this.parameter.substring(0,7) != "http://") {
        this.parameter = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + this.parameter;
      }
      
      // build an action to open a new page relative to the actual page
      this.actionExec = function() {
        window.open(this.parameter, this.target);
      }
    }

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenURL, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.OpenURL.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes openscene action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.OpenScene = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }

    // ### PROMETEO ###
    if ( (this.target !== "_blank") && (this.target !== "_parent") && (this.target !== "_self") && (this.target !== "_top") ) {
      this.actionExec = function() {
        window.parent.postMessage({ type: "changeTarget", name: this.target, value: this.parameter }, '*');
      }
      return;
    }
    // ### PROMETEO ###

    // if the parameter is JavaScript code
    if (this.parameter.substring(0,10) == "javascript") {
      // this.javascript = true;

      // replace the &squot; with '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      this.actionExec = function() {
        eval(this.parameter);
      }
    } 
    // if the paramater is a file name
    else {
      // if the parameter is a file name relative to the current page
      if (this.parameter.substring(0,7) != "http://") {
        this.parameter = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + this.parameter;
      }
 
      // build an action to open a new page relative to the actual page
      this.actionExec = function() {
        window.open(this.parameter, this.target, "width=" + this.parent.width + ",height=" + this.parent.height + ",left=" + (window.screen.width - this.parent.width)/2 + ", top=" + (window.screen.height - this.parent.height)/2 + "location=0,menubar=0,scrollbars=0,status=0,titlebar=0,toolbar=0");
      }
    }

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenScene, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.OpenScene.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes about action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.About = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);

    if (!parameter) {
      this.urlAbout = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + parameter;
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.About, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.About.prototype.execute = function() {
    if (this.urlAbout) {
      var codeWindow = window.open(this.urlAbout, "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
    }
    else {
      var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
      codeWindow.document.write("<hmtl><head><title>Créditos</title></head><body><h1>Aquí van los créditos</h1></body></html>");
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes config action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Config = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Config, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Config.prototype.execute = function() {
    var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
    codeWindow.document.write("<xmp style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</xmp>");
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes init action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Init = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Init, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Init.prototype.execute = function() {
    this.parent.init();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes clear action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Clear = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Clear, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Clear.prototype.execute = function() {
    this.parent.clear();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes animate action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Animate = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Animate, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Animate.prototype.execute = function() {
    this.parent.play();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes init animation action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.InitAnimation = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.InitAnimation, descartesJS.Action);
  
  /**
   * Execute the action
   */
  descartesJS.InitAnimation.prototype.execute = function() {
    this.parent.reinitAnimation();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav|\.OGG|\.OGA\.MP3|\.WAV)/g;

  /**
   * Descartes play audio action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.PlayAudio = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    if ((parameter) && (parameter.match(regExpAudio))) {
      this.filenameExpr = this.evaluator.parser.parse("'" + parameter.match(regExpAudio) + "'");
    }
    else {
      this.filenameExpr = this.evaluator.parser.parse(parameter);
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.PlayAudio, descartesJS.Action);
  
  /**
   * Execute the action
   */
  descartesJS.PlayAudio.prototype.execute = function() {
    this.theAudio = this.parent.getAudio( this.evaluator.evalExpression(this.filenameExpr) );

    var theAudio = this.theAudio;

    // if the audio is paused then play it
    if (theAudio.paused) {
      theAudio.play();
    }
    // if the audio is playing then stop it
    else {
      theAudio.pause();
      theAudio.currentTime = 0.0;
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Descartes auxiliary
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Auxiliary = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * identifier of the auxiliary
     * type {String}
     * @private
     */
    this.id = "";
    
    /**
     * the expression of the auxiliary
     * type {String}
     * @private
     */
    this.expresion = "";

    /**
     * type of evaluation of the auxiliary
     * type {String}
     * @private
     */
    this.evaluate = "onlyOnce";

    this.local = "";

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
  }  
  
  /**
   * Set the first run of an algotithm
   */
  descartesJS.Auxiliary.prototype.firstRun = function() { };

  /**
   * Update the auxiliary
   */
  descartesJS.Auxiliary.prototype.update = function() { };

  var tmp;
  var tmpExpression;
  
  /**
   * Split the expression using the semicolon as separator, ignoring the empty expressions
   * @param {Parser} parser a Descartes parser object
   * @param {String} expression the expression to split
   * @return {Array<Node>} return an array of nodes correspoding to the expression split
   */
  descartesJS.Auxiliary.prototype.splitInstructions = function(parser, expression) {
    tmpExpression = [];

    if (expression) {
      expression = expression.split(";");
    } else {
      expression = [""];
    }
    
    // add only the instructions tha execute something, i.e. instructions whit parsing different of null
    for (var i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }
    
    return tmpExpression;
  }

  /**
   *
   */
  descartesJS.Auxiliary.prototype.getPrivateVariables = function(parser, expression) {
    tmpExpression = [];

    if (expression) {
      expression = expression.split(/;|,/);
    } else {
      expression = [""];
    }

    // add only the instructions tha execute something, i.e. instructions whit parsing different of null
    for (var i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }    

    // add the identifier nodes to local variables
    for (var i=0, l=tmpExpression.length; i<l; i++) {
      if (tmpExpression[i].type === "asign") {
        tmpExpression[i] = tmpExpression[i].childs[0].value;
      }
      else if (tmpExpression[i].type === "identifier") {
        tmpExpression[i] = tmpExpression[i].value;
      }
      else {
        tmpExpression[i] = "";
      }
    }

    return tmpExpression;
  }

  /**
   *
   */
  descartesJS.Auxiliary.prototype.parseExpressions = function(parser) {
    // parse the init expression
    this.init = this.splitInstructions(parser, this.init);

    // parse the local expression
    this.privateVars = this.getPrivateVariables(parser, this.local);

    // parse the do expression
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // parse the while expression
    this.whileExpr = parser.parse(this.whileExpr);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes variable
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Variable = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var parser = this.evaluator.parser;
 
    this.expresionString = this.expresion;
    this.expresion = parser.parse(this.expresionString);

    if (this.expresion) {
      parser.setVariable(this.id, this.expresion);
    }
    
    if (this.editable) {
      this.registerTextField();
      this.parent.editableRegionVisible = true;
    }    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Variable, descartesJS.Auxiliary);
  
  /**
   * 
   */
  descartesJS.Variable.prototype.registerTextField = function() {
    var container = document.createElement("div");

    var label = document.createElement("label");
    // underscores are added at the beginning and end to determine the initial size of the label
    label.appendChild( document.createTextNode("___" + this.id + "=___") );
    
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    container.appendChild(label);
    container.appendChild(textField);

    var self = this;
    var parser = self.evaluator.parser;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = parser.parse(this.value);
        
        parser.setVariable(self.id, self.expresion);
        self.parent.update();
      }
    }
    
    var containerTextField = { container: container,  type: "div" };
    this.parent.editableRegion.textFields.push(containerTextField);
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes constant
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Constant = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.evaluator.parser.parse(this.expresion);
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Constant, descartesJS.Auxiliary);
  
  /**
   * Update constant
   */
  descartesJS.Constant.prototype.update = function() {
    this.evaluator.setVariable(this.id, this.evaluator.evalExpression(this.expresion));
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var parser;
  var newFile;
  var response;

  /**
   * Descartes vector
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Vector = function(parent, values) {
    evaluator = parent.evaluator;
    parser = evaluator.parser;

    /**
     * number of elements of the vector
     * type {Node}
     * @private
     */
    this.size = parser.parse("3");

    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.expresion.split(";");

    this.parseFile = parser.parse(this.file);
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Vector, descartesJS.Auxiliary);

  /**
   * Update the vector
   */
  descartesJS.Vector.prototype.update = function() {
    var expresion = this.expresion;

    evaluator = this.evaluator;
    parser = evaluator.parser;

    // if the filename is a variable
    this.oldFile = this.file;
    newFile = evaluator.evalExpression(this.parseFile);
    if (newFile) {
      this.file = newFile;
    }

    var response;
    // if has an asociate file then read it
    if (this.file) {
      // if the vector is embedded in the page
      vectorElement = document.getElementById(this.file);
      if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
        response = vectorElement.text;
        
        // if (response[0] == '\n') {
        //   response = response.substring(1);
        // }
      }
      // read the vector data from a file
      else {
        response = descartesJS.openExternalFile(this.file);
      }

      // if the read information has content, split the content
      if (response != null) {
        response = response.replace(/\r/g, "").split("\n");

        var tmpResponse = [];
        for (var i=0,l=response.length; i<l; i++) {

          if (response[i] != "") {
            tmpResponse.push( response[i] );
          }
        }
        response = tmpResponse;
      }

      // if the file has no content or could not be read
      if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
        response = [];
        this.size = 0;
      }
      // if the file has content and could be read
      else {
        expresion = response;
        this.size = null;
      }
      
      if (this.size === null) {
        this.size = parser.parse( expresion.length + "" );
      }
    }

    var tmpExp;
    var newExpression = [];
    // parse the elements of the expression
    for(var i=0, l=expresion.length; i<l; i++) {
      tmpExp = parser.parse(expresion[i], true);

      // if the expression is not an assignment
      if ((tmpExp) && (tmpExp.type != "asign")) {
        tmpExp = parser.parse( this.id + "[" + i + "]=" + expresion[i], true );
      }

      newExpression.push( tmpExp );
    }

    var vectInit = [];
    for (var i=0, l=evaluator.evalExpression(this.size); i<l; i++) {
      vectInit.push(0);
    }
    evaluator.vectors[this.id] = vectInit;

    evaluator.setVariable(this.id + ".long", evaluator.evalExpression(this.size));

    for(var i=0, l=newExpression.length; i<l; i++) {
      evaluator.evalExpression(newExpression[i]);
    }    
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes matrix
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Matrix = function(parent, values){
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;

    /**
     * number of rows of a matrix
     * type {Node}
     * @private
     */
    this.rows = parser.parse("3");

    /**
     * number of columns of a matrix
     * type {Node}
     * @private
     */
    this.columns = parser.parse("3");

    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    // parse the expression
    this.expresion = this.splitInstructions(parser, this.expresion);

    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    var mat = [];
    mat.type = "matrix";
    
    var vectInit;
    for (var j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (var i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      mat[j] = vectInit;
    }
    evaluator.matrices[this.id] = mat;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Matrix, descartesJS.Auxiliary);

  /**
   * Update the matrix
   */
  descartesJS.Matrix.prototype.update = function() {
    var evaluator = this.evaluator;
    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    evaluator.setVariable(this.id + ".filas", rows);
    evaluator.setVariable(this.id + ".columnas", cols);

    var mat = evaluator.matrices[this.id];
    mat.rows = rows;
    mat.cols = cols;

    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes function
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Function = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    var parPos = this.id.indexOf("(");
    this.name = this.id.substring(0, parPos);
    this.params = this.id.substring(parPos+1, this.id.length-1);
    this.domain = (this.range) ? parser.parse(this.range) : parser.parse("1");
    
    if (this.params == "") {
      this.params = [];
    } else {
      this.params = this.params.split(",");
    }
    
    this.numberOfParams = this.params.length;

    // if do not have an algorithm ignore the init, doExpr and whileExpr values
    if (!this.algorithm) {
      this.init = "";
      this.doExpr = "";
      this.whileExpr = "";
    }

    this.parseExpressions(parser);
      
    this.expresion = parser.parse(this.expresion);

    var self = this;

    this.functionExec = function() {
      this.iterations = 0;

      if (self.numberOfParams <= arguments.length) {

        // saves the private variables
        var localVars = [];
        for (var i=0, l=self.privateVars.length; i<l; i++) {
          localVars.push( evaluator.getVariable(self.privateVars[i]) );

          // set the local variables to 0
          evaluator.setVariable(self.privateVars[i], 0);
        }

        // saves the variable values ​​that have the same names as function parameters
        var paramsTemp = [];
        for (var i=0, l=self.params.length; i<l; i++) {
          paramsTemp[i] = evaluator.getVariable(self.params[i]);
          
        // associated input parameters of the function with parameter names
          evaluator.setVariable(self.params[i], arguments[i]);
        }
        
        for (var i=0, l=self.init.length; i<l; i++) {
          evaluator.evalExpression(self.init[i]);
        }
        
        do {
          for (var i=0, l=self.doExpr.length; i<l; i++) {
            evaluator.evalExpression(self.doExpr[i]);
          }

          if (++this.iterations > 100000) {
            console.log("se ha excedido el límite de 100000 repeticiones en la función", this.id);
            return 0;
          }
        }
        while (evaluator.evalExpression(self.whileExpr) > 0);
                 
        // evaluates to the return value
        var result = evaluator.evalExpression(self.expresion);
        descartesJS.rangeOK = evaluator.evalExpression(self.domain);

        // restore the variable values that have the same names as function parameters
        for (var i=0, l=self.params.length; i<l; i++) {
          evaluator.setVariable(self.params[i], paramsTemp[i]);
        }

        // restore the local variable values
        for (var i=0, l=self.privateVars.length; i<l; i++) {
          evaluator.setVariable(self.privateVars[i], localVars[i]);
        }          
      
        return result;
      }
      
      return 0;
    }

    
    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Function, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes algorithm
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Algorithm = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    this.parseExpressions(evaluator.parser);
    
    // create the function to exec when the algorithm evaluates
    this.algorithmExec = function() {
      this.iterations = 0;

      for (var i=0, l=this.init.length; i<l; i++) {
        evaluator.evalExpression(this.init[i]);
      }
      
      do {
        for (var i=0, l=this.doExpr.length; i<l; i++) {
          evaluator.evalExpression(this.doExpr[i]);
        }

        if (++this.iterations > 100000) {
          console.log("se ha excedido el límite de 100000 repeticiones en el algoritmo", this.id);
          return 0;
        }
      }
      while (evaluator.evalExpression(this.whileExpr) > 0);
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Algorithm, descartesJS.Auxiliary);

  /**
   * Update the algorithm
   */
  descartesJS.Algorithm.prototype.update = function() {
    this.algorithmExec();
    
    if (this.evaluate === "onlyOnce") {
      this.update = function() {};
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes event
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Event = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    var evaluator = this.evaluator;
    
    this.condition = evaluator.parser.parse(this.condition);
    this.lastEvaluation = false;

    this.action = this.parent.lessonParser.parseAction(this);
    
    // if the type of evaluation is onlyOnce
    if (this.execution == "onlyOnce") {
      this.eventExec = function() {
        if ((evaluator.evalExpression(this.condition) > 0) && (!this.lastEvaluation)) {
          this.lastEvaluation = true;
          this.action.execute();
        }
      }
    }
    
    // if the type of evaluation is alternate
    if (this.execution == "alternate") {
      this.eventExec = function() {
        var cond = (evaluator.evalExpression(this.condition) > 0);
        //////////////////////////////////////////////////////////////////
        // DESCARTES 3
        if (this.parent.version == 3) {
          if (cond != this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = (cond) ? true : false;
          }
        }
        // DESCARTES 3
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // other versions
        else {
          // if the condition was true and the last time was not executed, then the event is executed
          if ((cond) && (!this.lastEvaluation)) {
            this.action.execute();
            this.lastEvaluation = true;
          }
          // if already run once and the condition is evaluated to false, then rerun the event
          else if ((!cond) && (this.lastEvaluation)) {
            this.lastEvaluation = false;
          }
        }
        //////////////////////////////////////////////////////////////////
        
      }
    }

    // if the type of evaluation is always
    if (this.execution == "always") {
      this.eventExec = function() {
        if (evaluator.evalExpression(this.condition) > 0) {
          this.action.execute();
        }
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Event, descartesJS.Auxiliary);

  /**
   * Update the event
   */
  descartesJS.Event.prototype.update = function() {
    this.eventExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var tempParam;
  var theText;
  var verticalDisplace;

  /**
   * Descartes graphics
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Graphic = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;

    var parser = this.evaluator.parser;    
    
    /**
     * identifier of the space that belongs to the graphic
     * type {String}
     * @private
     */
    this.spaceID = "";

    /**
     * the condition for determining whether the graph is drawn in the background
     * type {Boolean}
     * @private
     */
    this.background = false;

    /**
     * type of the graphic
     * type {String}
     * @private
     */
    this.type = "";

    /**
     * the condition to draw the graphic
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");

    /**
     * the condition for determine whether the graphic is in absolute coordinates
     * type {Boolean}
     * @private
     */
    this.abs_coord = false;

    /**
     * the primary color of the graphic
     * type {String}
     * @private
     */
    this.color = new descartesJS.Color("blue");
    if (this.parent.version !== 2) {
    // if (this.parent.code == "descinst.com.mja.descartes.DescartesJS.class") {
      this.color = new descartesJS.Color("20303a");
    // } else {
    //   this.color = "#000000";
    // }
      // ##ARQUIMEDES## //
      if (this.parent.arquimedes) {
        this.color = new descartesJS.Color("black");
      }
      // ##ARQUIMEDES## //
    }
    // if (this.parent.code === "descinst.Descartes.class") {
    //   this.color = "blue";
    // }

    /**
     * the color for the trace of the graphic
     * type {String}
     * @private
     */
    this.trace = "";

    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    this.expresion = parser.parse("(0,0)");

    /**
     * the condition and parameter name for family of the graphic
     * type {String}
     * @private
     */
    this.family = "";

    /**
     * the interval of the family
     * type {Node}
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * the number of steps of the family
     * type {Node}
     * @private
     */
    this.family_steps = parser.parse("8");
    
    // /**
    //  * type {Boolean}
    //  * @private
    //  */
    // this.visible = false;

    /**
     * the condition for determining whether the graph is editable
     * type {Boolean}
     * @private
     */
    this.editable = false;

    /**
     * font of the text
     * type {String}
     * @private
     */
    this.font = (this.parent.version >=5) ? "Monospaced,PLAIN,15" : "Monospaced,PLAIN,12";
    
    /**
     * the condition for determining whether the text of the graph is fixed or not
     * type {Boolean}
     * @private
     */
    this.fixed = true;

    /**
     * text of the graphic
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * the number of decimal of the text
     * type {Node}
     * @private
     */
    this.decimals = parser.parse("2");

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    // get the space of the graphic
    this.space = this.getSpace();

    // get the space
    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
    
    // if the object has trace, then get the background canvas render context
    if (this.trace) {
      this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    }
    
    // get a Descartes font
    this.font = descartesJS.convertFont(this.font);

    // get the font size
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = parseInt(this.fontSize[1]);
    } else {
      this.fontSize = 10;
    }
  }  
  
  /**
   * Get the space to which the graphic belongs
   * return {Space} return the space to which the graphic belongs
   */
  descartesJS.Graphic.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;

    // find in the spaces
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        return space_i;
      }
    }
    
    // if do not find the identifier, return the first space
    return spaces[0];
  }

  /**
   * Get the family values of the graphic
   */
  descartesJS.Graphic.prototype.getFamilyValues = function() {
    evaluator = this.evaluator;
    expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   * Auxiliar function for draw a family graphic
   * @param {CanvasRenderingContext2D} ctx the render context to draw
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the las value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // draw all the family mebers of the graphic
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));
                
        // if the condition to draw if true then update and draw the graphic
        if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
          // draw the graphic
          this.drawAux(ctx, fill, stroke);
        }
      }
    }

    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Draw the graphic
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.draw = function(fill, stroke) {
    // if the graphic has a family
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    // if the graphic has not a family
    else  {
      // if the condition to draw is true
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // update the values of the graphic
        this.update();
        // draw the graphic
        this.drawAux(this.ctx, fill, stroke);
      }
    }
  }
  
  /**
   * Draw the trace of the graphic
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.drawTrace = function(fill, stroke) {
    // if the graphic has a family
    if (this.family != "") {
      this.drawFamilyAux(this.traceCtx, fill, stroke);
    }
    // if the graphic has not a family
    else {      
      // if the condition to draw is true
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // update the values of the graphic
        this.update();
        // draw the graphic
        this.drawAux(this.traceCtx, fill, stroke);
      }
    }
  }

  /**
   * Draw the text of the graphic
   * @param {CanvasRenderingContext2D} ctx the context render to draw
   * @param {String} text the text to draw
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {String} fill the fill color of the graphic
   * @param {String} font the font of the text
   * @param {String} align the alignment of the text
   * @param {String} baseline the baseline of the text
   * @param {Number} decimals the number of decimals of the text
   * @param {Boolean} fixed the number of significant digits of the number in the text
   * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
   */
  descartesJS.Graphic.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
    // rtf text
    if (text.type === "rtfNode") {
      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = fill.getColor();
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align, displaceY, fill.getColor());
      
      return;
    }

    // simple text (none rtf text)
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    
    evaluator = this.evaluator;
    ctx.fillStyle = fill.getColor();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
        
    if (this.border) {
      ctx.strokeStyle = this.border.getColor();
      ctx.lineWidth = 3;
    }
    
    verticalDisplace = this.fontSize*1.2 || 0;

    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];

      if (this.border) {
        ctx.lineJoin = "round";
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * A Descartes plain text (not RTF)
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} text the content text 
   */
  descartesJS.SimpleText = function(parent, text) {
    text = text.replace("&#x2013", "–").replace(/\&squot;/g, "'");
    this.text = text;

    this.textElements = [];
    this.textElementsMacros = [];
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.type = "simpleText"

    var txt = "'";
    var pos = 0;
    var lastPos = 0;
    var ignoreSquareBracket = -1;
    var charAt;
    var charAtAnt;

    while (pos < text.length) {
      charAt = text.charAt(pos);
      charAtAnt = text.charAt(pos-1);

      // open square bracket scaped
      if ((charAt === "[") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "[");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "['");
        lastPos = pos+1;
      }
      
      // close square bracket scaped
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "]");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "]'");
        lastPos = pos+1;
      }
      
      // if find an open square bracket
      else if ((charAt === "[") && (ignoreSquareBracket === -1)) {
        this.textElements.push(text.substring(lastPos, pos));
        this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
        lastPos = pos;
        ignoreSquareBracket++;
      } 

      else if (charAt === "[") {
        ignoreSquareBracket++;
      } 

      // if find a close square bracket add the strin +'
      else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
        this.textElements.push( this.evaluator.parser.parse(text.substring(lastPos, pos+1)) );
        this.textElementsMacros.push( "[" + text.substring(lastPos, pos+1) + "]");
        lastPos = pos+1;
        ignoreSquareBracket--;
      }
      
      else if (text.charAt(pos) == "]") {
        ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
        txt = txt + text.charAt(pos);
      } 

      else {
        txt = txt + text.charAt(pos);
      }      

      pos++; 
    }
    this.textElements.push(text.substring(lastPos, pos));
    this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
  }

  var txt;
  var evalString;

  /**
   * Get the string representation of the text, substituting the number taking into acount the number of decimals and the fixed value
   * @param {Number} decimal the number of decimal of the number in the text
   * @param {Boolean} fixed a condition to indicate if the number has a fixed representation
   * @return {String} return the string representation of te text
   */
  descartesJS.SimpleText.prototype.toString = function(decimals, fixed) {
    txt = "";

    for(var i=0, l=this.textElements.length; i<l; i++) {
      if (typeof(this.textElements[i]) === "string") {
        txt += this.textElements[i];
      }
      else {
        evalString = this.evaluator.evalExpression(this.textElements[i])[0][0];

        if (evalString !== "") {
          // the evaluation is a string
          if (typeof(evalString) === "string") {
            txt += evalString;
          }
          // the evaluation is a number
          else {
            evalString = parseFloat(evalString);

            evalString = (fixed) ? evalString.toFixed(decimals) : descartesJS.removeNeedlessDecimals(evalString.toFixed(decimals));
            txt += evalString.toString().replace(".", this.parent.decimal_symbol);                        
          }
        }
      }
    }

    return txt;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var PI2 = Math.PI*2;
  var netsz = 8;

  var b;

  var evaluator;
  var parser;
  var space;
  var color;
  var width;
  var savex;
  var savey;
  var w;
  var h;
  var dx;
  var dy;
  var q0;
  var qb;
  var t;
  var Q;
  var q;
  var q_ij;
  var Qx;
  var Qy;
  var t0;
  var zeroVisited;
  var side;
  var changeSide;
  var Px;
  var Py;
  var i;
  var j;

  var theZeroX;
  var theZeroY;
  var initX;
  var initY;
  var tmpX;
  var tmpY;
  var actualTmpAbsoluteX;
  var actualTmpAbsoluteY;
  var previousTmpAbsoluteX;
  var previousTmpAbsoluteY;
  var min;
  var max;
  var minmax;
  var va;
  var colorFillM;
  var colorFillP;
  var disc;
  var saveX;
  var Xr;
  var auxv;
  
  /**
   * A Descartes equation
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the equation
   */
  descartesJS.Equation = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill+
     * type {String}
     * @private
     */
    this.fillP = "";//new descartesJS.Color("00ff80");

    /**
     * the condition and the color of the fill-
     * type {String}
     * @private
     */
    this.fillM = "";//new descartesJS.Color("ffc800");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // generate a stroke pattern
    this.generateStroke();

    // parse the expression and build a newton evaluator
    this.parseExpression();

    // Descartes 2 visible
    this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
    if (this.visible) {
      this.registerTextField();
    }

    q0 = new descartesJS.R2();
    qb = new descartesJS.R2();
    t = new descartesJS.R2();
    q_ij = new descartesJS.R2();
    Q = new descartesJS.R2();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Equation, descartesJS.Graphic);

  /**
   * Parse the expression and build a newton evaluator
   */
  descartesJS.Equation.prototype.parseExpression = function() {
    if (this.expresion.type === "compOperator") {
      var left = this.expresion.childs[0];
      var right = this.expresion.childs[1];

      if ( (left.type == "identifier") && (left.value == "y") && (!right.contains("y")) ) {
        this.funExpr = right;
        this.of_y = false;
        this.drawAux = this.drawAuxFun;
      }
      
      else if ( (right.type == "identifier") && (right.value == "y") && (!left.contains("y")) ) {
        this.funExpr = left;
        this.of_y = false;
        this.drawAux = this.drawAuxFun;        
      }
      
      else if ( (left.type == "identifier") && (left.value == "x") && (!right.contains("x")) ) {
        this.funExpr = right;
        this.of_y = true;
        this.drawAux = this.drawAuxFun;
      }
      
      else if ( (right.type == "identifier") && (right.value == "x") && (!left.contains("x")) ) {
        this.of_y = true;
        this.funExpr = right;
        this.drawAux = this.drawAuxFun;
      }
    }

    this.newt = new descartesJS.R2Newton(this.evaluator, this.expresion);
  }
  
  /**
   * Generate an image corresponding to the stroke of the equation
   */
  descartesJS.Equation.prototype.generateStroke = function() {
    this.auxCanvas = document.createElement("canvas");
    this.oldWwidth = parseInt(this.evaluator.evalExpression(this.width));
    this.width_2 = parseInt(this.oldWwidth/2) || 1;
    this.auxCanvas.setAttribute("width", this.oldWwidth);
    this.auxCanvas.setAttribute("height", this.oldWwidth);
    this.auxCtx = this.auxCanvas.getContext("2d");

    this.auxCtx.fillStyle = this.color.getColor();

    // this.auxCtx.beginPath();
    // this.auxCtx.arc(this.width_2, this.width_2, this.width_2, 0, Math.PI*2, false);
    // this.auxCtx.fill();
    this.auxCtx.fillRect(0, 0, this.oldWwidth, this.oldWwidth);
  }
  
  var tmpOldWidth;
  /**
   * Update the equation
   */
  descartesJS.Equation.prototype.update = function() {
    tmpOldWidth = parseInt(this.evaluator.evalExpression(this.width));

    if (tmpOldWidth !== this.oldWwidth) {
      this.generateStroke();
    }
  }
  
  /**
   * Draw the equation (special case of the draw defined in Graphic)
   */
  descartesJS.Equation.prototype.draw = function() {
    // if the equation has a family
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, this.fill, this.color);
    }
    // if the equation has not a family
    else  {
      // update the values of the equation
      this.update();
      // draw the equation
      this.drawAux(this.ctx, this.fill, this.color);
    }
  }

  /**
   * Auxiliar function for draw a family graphic
   * @param {CanvasRenderingContext2D} ctx the render context to draw
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Equation.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the las value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // draw all the family mebers of the graphic
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

        // // if the condition to draw if true then update and draw the graphic
        // if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
          // draw the graphic
          this.drawAux(ctx, fill, stroke);
        // }
      }
    }

    evaluator.setVariable(this.family, tempParam);
  }
  
  /**
   * Draw the trace of the equation
   */
  descartesJS.Equation.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
    
  /**
   * Auxiliary function for draw an non explicit equation 
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAux = function(ctx, fill, stroke) {
    ctx.lineWidth = 1;
    evaluator = this.evaluator;
    parser = evaluator.parser;
    space = this.space;
    
    width = evaluator.evalExpression(this.width);
    ctx.fillStyle = stroke.getColor();
    ctx.translate(-parseInt(width/2), -parseInt(width/2));
    // width = MathFloor(width)/2;

    savex = parser.getVariable("x");
    savey = parser.getVariable("y");
    
    w = space.w;
    h = space.h;
    
    dx = parseInt(w/netsz);
    if (dx<3) {
      dx=3;
    }
    dy = parseInt(h/netsz);
    if (dy<3) {
      dy=3;
    }

    b = [];

    q0.set(0, 0);
    qb.set(0, 0);
    t.set(0, 0);

    for (j=parseInt(dy/2); j<h; j+=dy) {
      for (i=parseInt(dx/2); i<w; i+=dx) {
        if (this.abs_coord) {
          q_ij.set(i, j);
          q = this.newt.findZero(q_ij);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(q.x, q.y);
        } else {
          q_ij.set(space.getRelativeX(i), space.getRelativeY(j));
          q = this.newt.findZero(q_ij);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
        }
        
        Qx = Q.ix();
        Qy = Q.iy();

        if (Qx<0 || Qx>=w || Qy<0 || Qy>=h || b[Qx + Qy*space.w]) {
          continue; // zero detected
        }

        b[Qx + Qy*space.w] = true;

        if ((descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif))) {
          ctx.drawImage(this.auxCanvas, Qx, Qy);
        }

        q0.x = q.x;
        q0.y = q.y;
        qb.x = q.x;
        qb.y = q.y;
        
        // t=t0= Unit Tangent Vector
        t0 = this.newt.getUnitNormal();
        if (t0.x==0 && t0.y==0) {
          continue; /* Zero normal vector */
        }
        
        t0.rotL90();
        t.x = t0.x;
        t.y = t0.y;
        
        zeroVisited = 0;
        side = 0;
        changeSide = false;

        while (side < 2)  {
          if (changeSide) {
            t.x = -t0.x;
            t.y = -t0.y; // Invert Unit Tangent Vector
            
            q.x = q0.x;
            q.y = q0.y;
            
            qb.x = q.x;
            qb.y = q.y;
            
            if (this.abs_coord) {
              Q.set(q.x, q.y);
            }
            else {
              Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
            }

            Qx = Q.ix();
            Qy = Q.iy();
            changeSide = false;
            zeroVisited = 0;
          }
          
          if (this.abs_coord) {
            q.x+=t.x; 
            q.y+=t.y; // advance along t aprox one pixel
          } else {
            q.x+=t.x/space.scale;
            q.y+=t.y/space.scale; // advance along t aprox one pixel
          }
          
          q = this.newt.findZero(q);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          
          t.x = q.x-qb.x;
          t.y = q.y-qb.y;
          t.normalize(); // update Unit Tangent Vector
          
          if (t.x==0 && t.y==0) {
            break; /* Zero tangent vector */
          }
          
          qb.x = q.x;
          qb.y = q.y;
          
          if (this.abs_coord) {
            Q.set(q.x, q.y);
          } else {
            Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
          }
          
          Px = MathFloor(Q.ix());
          Py = MathFloor(Q.iy());
          
          if (Px!=Qx || Py!=Qy) {
            Qx = Px;
            Qy = Py;
            
            if (0<=Qx && Qx<w && 0<=Qy && Qy<h) {
              zeroVisited = 0;
              
              if (b[Qx + Qy*space.w]) {
                break;
              } 
              else {
                b[Qx + Qy*space.w] = true;
                if ((descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif))) {
                  ctx.drawImage(this.auxCanvas, Qx, Qy);
                }
              }
            } else {
              changeSide = true; 
              side++; /* Zero out of bounds */
            }
          } else if ( ++zeroVisited > 4 ) {
            changeSide = true; 
            side++; /* Stationary Zero */
          }
        }
      }
    }

    // reset the translation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

/**
 *
 */
descartesJS.Equation.prototype.X = function(size, x, abs_coord) {
  if (!abs_coord) {
    x = (this.space.w/2+this.space.Ox) + this.space.scale*x;
  }
  if (x < -size) {
    x = -size;
  }
  if (x > this.space.w+size) {
    x = this.space.w+size;
  }

  return x;
}

/**
 *
 */
descartesJS.Equation.prototype.Y = function(size, y, abs_coord) {
  if (!abs_coord) {
    y = (this.space.h/2+this.space.Oy) - this.space.scale*y;
  }
  if (y < -size) {
    y = -size;
  }
  if (y > this.space.h+size) {
    y = this.space.h+size;
  }

  return y;
}

/**
 *
 */
descartesJS.Equation.prototype.XX = function(size, v, abs_coord) {
  return Math.round(this.X(size, v, abs_coord));
}

/**
 *
 */
descartesJS.Equation.prototype.YY = function(size, v, abs_coord) {
  return Math.round(this.Y(size, v, abs_coord));
}

/**
 * 
 */
descartesJS.Equation.prototype.extrapolate = function(cond, X, Y, F, v, dx) {
  var saveX = this.evaluator.getVariable(X);
  var dxx = dx/2;
  var Dx = 0;
  var vv = v;

  while (Math.abs(dxx)>1E-12) {
    var xa = this.evaluator.getVariable(X);
    var x = this.evaluator.getVariable(X) + dxx;

    this.evaluator.setVariable(X, x);

    var ok = true;

    // try {
      var vva = vv;
      vv = this.evaluator.evalExpression(this.funExpr);
      this.evaluator.setVariable(Y, vv);

      if (this.evaluator.evalExpression(cond) > 0) {
        var minmax = new descartesJS.R2(Math.min(vva, vv), Math.max(vva, vv));
        var sing = 0;

        if (dx>0) {
          sing = this.Singularity(Math.abs(dxx), X, F, xa, vva, x, vv, minmax);
        } 
        else {
          sing = this.Singularity(Math.abs(dxx), X, F, x, vv, xa, vva, minmax);
        }
        if (sing > 0) {
          ok = false;
        }
      } 
      else {
        ok = false;
      }
    // } 
    // catch (e) {
    //   ok = false;
    // }

    if (ok) {
      Dx += dxx;
    } 
    else {
      this.evaluator.setVariable(X, xa);
    }
    dxx/=2;
  }

  this.evaluator.setVariable(X, saveX);

  return new descartesJS.R2(Dx/Math.abs(dx),vv);
}

/**
 * 
 */
descartesJS.Equation.prototype.extrapolateOnSingularity = function(cond, X, Y, F, v, dx) {
  var saveX = this.evaluator.getVariable(X);
  var dxx = dx/2;
  var Dx = 0;
  var vv = v;

  while (Math.abs(dxx)>1E-12) {
    this.evaluator.setVariable(this.evaluator.getVariable(X) +dxx);
    var ok = true;

    if (this.evaluator.evalExpression(cond) > 0) {
      // try {
        var vva = vv;
        vv = this.evaluator.evalExpression(this.funExpr);
        
        this.evaluator.setVariable(Y, vv);

        if (this.evaluator.evalExpression(cond) <= 0) {
          ok = false;
        }
      // }
      // catch (e) {
      //   ok = false;
      // }
    }
    else {
      ok = false;
    }

    if (ok) {
      Dx += dxx;
    }
    else {
      this.evaluator.setVariable(this.evaluator.getVariable(X)-dxx);
    }
    dxx/=2;
  }
  
  if (Dx == 0) {
    dxx = dx/2;
    Dx = dx;
    vv = v;

    while (Math.abs(dxx)>1E-12) {
      this.evaluator.setVariable(this.evaluator.getVariable(X)-dxx);

      var ok = true;

      if (this.evaluator.evalExpression(cond) > 0) {
        // try {
          vv = this.evaluator.evalExpression(this.funExpr);
        // }
        // catch (e) {
        //   ok = false;
        // }
      }
      else {
        ok = false;
      }

      if (ok) {
        Dx += -dxx;
      } 
      else {
        this.evaluator.setVariable(this.evaluator.getVariable(X)+dxx);
      }
      dxx/=2;
    }
  }

  this.evaluator.setVariable(saveX);

  return new descartesJS.R2(Dx/Math.abs(dx), vv);
}

/**
 * 
 */
descartesJS.Equation.prototype.Singularity = function(e, X, F, a, va, b, vb, minmax) {
    if (a >= b) {
      return 2;
    }
    var saveX = this.evaluator.getVariable(X);
    var disc=0;

    // try {
      if ( (Math.abs(b-a) < 1E-12) || 
           ( (Math.abs(b-a) < 1E-8) && (Math.abs(vb-va) > Math.abs(e)) ) 
         ) {
        this.evaluator.setVariable(X, saveX);
        return 1;
      }

      var ab2=(a+b)/2;
      this.evaluator.setVariable(X, ab2);

      var auxv = this.evaluator.evalExpression(this.funExpr);

      if (Math.abs(vb-va)>e) {  // detectar saltos
        var epsilon = 0.000001;
        this.evaluator.setVariable(X, a-epsilon);
        var _v = this.evaluator.evalExpression(this.funExpr);
        var _D = (va-_v)/epsilon;

        this.evaluator.setVariable(X, b+epsilon);
        var v_ = this.evaluator.evalExpression(this.funExpr);
        var D_ = (v_-vb)/epsilon;

        var Dj = (vb-va)/(b-a);

        if ( (Math.abs(D_) < 10) || 
             (Math.abs(_D) < 10)
           ) { 
          if ((D_ >= 0 && _D >= 0) || (D_ <= 0 && _D <= 0) ) {
            if (8*Math.abs(D_) < Math.abs(Dj)) {
              this.evaluator.setVariable(X, saveX);
              return 2;
            }
          }
        }
      }
      if (!((minmax.x <= auxv) && (auxv <= minmax.y))) {
        this.evaluator.setVariable(X, ab2);
        minmax.x = Math.min(va, auxv);
        minmax.y = Math.max(va, auxv);
        var s1 = this.Singularity(e/2, X, F, a, va, ab2, auxv, minmax);

        this.evaluator.setVariable(X, b);
        minmax.x = Math.min(vb, auxv);
        minmax.y = Math.max(vb, auxv);
        var s2 = this.Singularity(e/2, X, F, ab2, auxv, b, vb, minmax);

        disc = Math.max(s1, s2);
      }
    // } 
    // catch (exc) {
    //   disc = 1;
    // }

    this.evaluator.setVariable(X, saveX)

    return disc;
  }

  /**
   * Auxiliary function for draw an equation of y
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAuxFun = function(ctx, fill, stroke) {
    savex = this.evaluator.parser.getVariable("x");
    savey = this.evaluator.parser.getVariable("y");

    var X = "x";
    var Y = "y";

    if (this.of_y) {
      X = "y";
      Y = "x";
    }

    var F = 000000;
    var cond = (this.drawif) ;
    var width = this.evaluator.evalExpression(this.width);

    var defa = false;
    var singa = 0;
    var Or = new descartesJS.R2((this.space.w/2+this.space.Ox), (this.space.h/2+this.space.Oy));
    var y0 = (this.of_y) ? Or.ix() : Or.iy();

    var y = 0;
    var ya = 0;
    var x = 0;
    var xa = 0;

    var dx = 1/this.space.scale;
    var Xr = dx*((this.of_y)?-this.space.h+(this.space.h/2+this.space.Oy):-(this.space.w/2+this.space.Ox));
    var va = 0;

    if (this.abs_coord) {
      Xr = this.space.h;
      dx = -1;
    }

    var condWhile = (this.of_y) ? this.space.h : this.space.w;
    while (x < condWhile) {
      var def = true;
      var sing = 0;
      this.evaluator.setVariable(X, Xr);

      // try {
        var v = this.evaluator.evalExpression(this.funExpr);

        if (!isNaN(v)) {
          this.evaluator.setVariable(Y, v);

          if ((this.evaluator.evalExpression(this.drawif) > 0) && (descartesJS.rangeOK)) {
            if (defa) {
              var min = Math.min(va, v);
              var max = Math.max(va, v);
              var minmax = new descartesJS.R2(min, max);

              sing = this.Singularity(dx, X, F, Xr-dx, va, Xr, v, minmax);

              if (sing === 0) {
                if (va <= v) {
                  va = minmax.x;
                  v =  minmax.y;
                }
                else {
                  v = minmax.x;
                  va = minmax.y;
                }

                var nya = (this.of_y) ? this.XX(width, va, this.abs_coord) : this.YY(width, va, this.abs_coord);
                if (this.abs_coord) {
                  y = Math.round(v);
                } 
                else {
                  y = (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord);
                }

                if ((this.fillM) && (y>y0)) {
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = this.fillM.getColor();
                  ctx.beginPath();
                  if (this.of_y) {
                    ctx.moveTo(y0+1, this.space.h-x+.5);
                    ctx.lineTo(y, this.space.h-x+.5);
                  }
                  else {
                    ctx.moveTo(x+.5, y0+1);
                    ctx.lineTo(x+.5, y);
                  }
                  ctx.stroke();
                }
                if ((this.fillP) && (y<y0)) {
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = this.fillP.getColor();
                  ctx.beginPath();
                  if (this.of_y) {
                    ctx.moveTo(y0-1, this.space.h-x+.5);
                    ctx.lineTo(y, this.space.h-x+.5);
                  }
                  else {
                    ctx.moveTo(x+.5, y0-1);
                    ctx.lineTo(x+.5, y);
                  }
                  ctx.stroke();
                }
                // g[i].setColor(mjac[i].getAdaptedColor());
                // if (ya!=nya) {
                //   Line(g[i],width,xa,ya,xa,nya,of_y);
                // }

                ctx.lineWidth = width;
                ctx.strokeStyle = this.color.getColor();

                ctx.beginPath();
                if (this.of_y) {
                  ctx.moveTo(nya+.5, this.space.h-xa);
                  ctx.lineTo(y+.5, this.space.h-x);
                }
                else {
                  ctx.moveTo(xa+.5, nya);
                  ctx.lineTo(x+.5, y);
                }
                ctx.stroke();
              }
              // sing === 1
              else if (sing === 1) {
                this.evaluator.setVariable(X, Xr-dx);
                var pn = this.extrapolate(cond, X, Y, F, va, dx);
                y = this.YY(width, pn.y, this.abs_coord);
                
                // g[i].setColor(mjac[i].getAdaptedColor());
                // Line(g[i],width,xa,ya,xa+(int)Math.round(pn.x),y,of_y);

                this.evaluator.setVariable(X, Xr);
                var pa = this.extrapolate(cond, X, Y, F, v, -dx);
                ya = this.YY(width, pa.y, this.abs_coord);
                y = this.YY(width, v, this.abs_coord);

                // g[i].setColor(mjac[i].getAdaptedColor());
                // Line(g[i],width,x+(int)Math.round(pa.x),ya,x,y,of_y);
              }
              // sing === 2
              else {
                y = this.YY(width, v, this.abs_coord);

                // g[i].setColor(mjac[i].getAdaptedColor());
                // Line(g[i],width,x,y,x,y,of_y);
              }
            }
            // defa === false; extrapolate forward
            else {
              var pa = this.extrapolateOnSingularity(cond, X, Y, F, v, -dx);

              ya = this.YY(width, pa.y, this.abs_coord);
              y = this.YY(width, v, this.abs_coord);

              // g[i].setColor(mjac[i].getAdaptedColor());
              // Line(g[i],width,x+(int)Math.round(pa.x),ya,x,y,of_y);
            }

            va = v;
          }

          else {
            def = false;
          }

          if (defa && !def) {
            this.evaluator.setVariable(X, Xr-dx);
            this.evaluator.setVariable(Y, va);

            var pn = this.extrapolate(cond, X, Y, F, va, dx);
            y = this.YY(width, pn.y, this.abs_coord);

            // g[i].setColor(mjac[i].getAdaptedColor());
            // Line(g[i],width,xa,ya,xa+(int)Math.round(pn.x),y,of_y);

            this.evaluator.setVariable(X, Xr);
          }
        }
        else {
          def = false;
        }

      // }
      // catch(e) {
      //   def = false;
      // }

      defa = def;
      singa = sing;
      Xr += dx;
      ya = y;
      xa = x++;
    }


    this.evaluator.parser.setVariable("x", savex);
    this.evaluator.parser.setVariable("y", savey);
}  

  /**
   * Register a text field in case the equation expression is editable
   */
  descartesJS.Equation.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);
    
    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.parseExpression();
        self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  /**
   * A Descartes curve
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the curve
   */
  descartesJS.Curve = function(parent, values) {
    /**
     * parameter for drawing a curve
     * type {String}
     * @private
     */
    this.parameter = "t";
    
    /**
     * the interval of the curve
     * type {Node}
     * @private
     */
    this.parameter_interval = parent.evaluator.parser.parse("[0,1]");

    /**
     * the number of steps of the curve
     * type {Node}
     * @private
     */
    this.parameter_steps = parent.evaluator.parser.parse("8");

    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    this.fill = "";

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // Descartes 2 visible
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;
    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve, descartesJS.Graphic);
  
  var evaluator;
  var para;
  var space;
  var tmpLineWidth;
  var lineDesp;
  var tempParam;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;

  /**
   * Update the curve
   */
  descartesJS.Curve.prototype.update = function() {
    evaluator = this.evaluator;

    para = evaluator.evalExpression(this.parameter_interval);

    this.paraInf = para[0][0]; // the first value of the first expression
    this.paraSup = para[0][1]; // the second value of the first expression

    this.pSteps = evaluator.evalExpression(this.parameter_steps);
    this.paraSep = (this.pSteps > 0) ? Math.abs(this.paraSup - this.paraInf)/this.pSteps : 0;
  }

  /**
   * Draw the curve
   */
  descartesJS.Curve.prototype.draw = function(){
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the curve
   */
  descartesJS.Curve.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Auxiliary function for draw a curve
   * @param {CanvasRenderingContext2D} ctx rendering context on which the curve is drawn
   * @param {String} fill the fill color of the curve
   * @param {String} stroke the stroke color of the curve
   */
  descartesJS.Curve.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke.getColor();
    
    tempParam = evaluator.getVariable(this.parameter);
    
    ctx.beginPath();
    
    evaluator.setVariable(this.parameter, this.paraInf);
    
    expr = evaluator.evalExpression(this.expresion);
    this.exprX = (this.abs_coord) ? mathRound(expr[0][0]) : mathRound(space.getAbsoluteX(expr[0][0]));
    this.exprY = (this.abs_coord) ? mathRound(expr[0][1]) : mathRound(space.getAbsoluteY(expr[0][1]));

    // MACRO //
    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    // MACRO //
    
    lineDesp = .5;

    ctx.moveTo(this.exprX+lineDesp, this.exprY+lineDesp);
    for(var i=1; i<=this.pSteps; i++) {
      evaluator.setVariable( this.parameter, (this.paraInf+(i*this.paraSep)) );
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = (this.abs_coord) ? mathRound(expr[0][0]) : mathRound(space.getAbsoluteX(expr[0][0]));
      this.exprY = (this.abs_coord) ? mathRound(expr[0][1]) : mathRound(space.getAbsoluteY(expr[0][1]));

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
        tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
        this.exprX = tmpRotX;
        this.exprY = tmpRotY;
      }
      // MACRO //
      
      ctx.lineTo(this.exprX+lineDesp, this.exprY+lineDesp);
    }
        
    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.fill();
    }
    ctx.stroke();
    
    evaluator.setVariable(this.parameter, tempParam);        
  }
    
  /**
   * Register a text field in case the curve expression is editable
   */
  descartesJS.Curve.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
      self.expresion = self.evaluator.parser.parse(this.value);
      self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;

  var evaluator;
  var space;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var coordX;
  var coordY;
  var range;
  var size;
  var desp;
  var tmp;

  /**
   * A Descartes sequence
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the sequence
   */
  descartesJS.Sequence = function(parent, values) {
    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    this.range = parent.evaluator.parser.parse("[1, 100]");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Sequence, descartesJS.Graphic);

  /**
   * Update the sequence
   */
  descartesJS.Sequence.prototype.update = function() { 
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    range = evaluator.evalExpression(this.range);
    this.rangeInf = range[0][0];
    this.rangeMax = range[0][1];
  }

  /**
   * Draw the sequence
   */
  descartesJS.Sequence.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the sequence
   */
  descartesJS.Sequence.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a sequence
   * @param {CanvasRenderingContext2D} ctx rendering context on which the sequence is drawn
   * @param {String} fill the fill color of the sequence
   */
  descartesJS.Sequence.prototype.drawAux = function(ctx, fill) {
    evaluator = this.evaluator;
    space = this.space;

    size = Math.ceil(evaluator.evalExpression(this.size)-.4);
    desp = size;

    ctx.fillStyle = fill.getColor();

    ctx.beginPath();

    if (this.rangeInf > this.rangeMax) {
      tmp = this.rangeInf;
      this.rangeInf = this.rangeMax;
      this.rangeMax = tmp;
    }
      
    var tmpValue = evaluator.getVariable("n");
    for (var i=this.rangeInf, l=this.rangeMax; i<=l; i++) {
      evaluator.setVariable("n", i);
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = expr[0][0];
      this.exprY = expr[0][1];
   
      coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
      coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));

      ctx.beginPath();
      ctx.arc(coordX, coordY, size, 0, PI2, true);
      ctx.fill()
    }
    
    ctx.fill();

    // draw the text of the sequence
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }

    evaluator.setVariable("n", tmpValue);

  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;
  
  var evaluator;
  var space;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var coordX;
  var coordY;
  var size;
  var desp;
  
  /**
   * A Descartes point
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Point = function(parent, values) {
    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point, descartesJS.Graphic);

  /**
   * Update the point
   */
  descartesJS.Point.prototype.update = function() { 
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);

    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Draw the point
   */
  descartesJS.Point.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the point
   */
  descartesJS.Point.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a point
   * @param {CanvasRenderingContext2D} ctx rendering context on which the point is drawn
   * @param {String} fill the fill color of the point
   */
  descartesJS.Point.prototype.drawAux = function(ctx, fill){
    evaluator = this.evaluator;
    space = this.space;

    size = mathRound(evaluator.evalExpression(this.size));
    desp = size+1;

    ctx.fillStyle = fill.getColor();

    coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
    coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));

    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.fill()

    // draw the text of the text
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp+1, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }

  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;
  var PI2 = Math.PI*2;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var desp;
  var midpX;
  var midpY;
  var size;
  var lineDesp;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;

  /**
   * A Descartes segment
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the segment
   */
  descartesJS.Segment = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment, descartesJS.Graphic);

  /**
   * Update the segment
   */
  descartesJS.Segment.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
  }

  /**
   * Draw the segment
   */
  descartesJS.Segment.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Draw the trace of the segment
   */
  descartesJS.Segment.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a segment
   * @param {CanvasRenderingContext2D} ctx rendering context on which the segment is drawn
   * @param {String} fill the fill color of the segment
   * @param {String} stroke the stroke color of the segment
   */
  descartesJS.Segment.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    size = evaluator.evalExpression(this.size);
    if (size < 0) {
      size = 0;
    }
    
    ctx.fillStyle = fill.getColor();
    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = "round";
    
    desp = 10+ctx.lineWidth;
    
    lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;
    
    if (this.abs_coord) {
      coordX =  mathRound(this.endPoints[0].x);
      coordY =  mathRound(this.endPoints[0].y);
      coordX1 = mathRound(this.endPoints[1].x);
      coordY1 = mathRound(this.endPoints[1].y);
    } else {
      coordX =  mathRound(space.getAbsoluteX(this.endPoints[0].x));
      coordY =  mathRound(space.getAbsoluteY(this.endPoints[0].y));
      coordX1 = mathRound(space.getAbsoluteX(this.endPoints[1].x));
      coordY1 = mathRound(space.getAbsoluteY(this.endPoints[1].y));        
    }
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    ctx.lineTo(coordX1+lineDesp, coordY1+lineDesp);
        
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.arc(coordX1, coordY1, size, 0, PI2, true);
    ctx.fill();
    
    // draw the text of the segment
    if (this.text != [""]) {
      midpX = parseInt((coordX + coordX1)/2) -3;
      midpY = parseInt((coordY + coordY1)/2) +3;
      
      this.uber.drawText.call(this, ctx, this.text, midpX+desp, midpY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var mathRound = Math.round;
  
  var evaluator;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var space;    
  var midpX;
  var midpY;
  var desp;
  var width1;
  var width2;
  var scale;
  var vlength;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;
  var spear;

  /**
   * A Descartes arrow
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the arrow
  */
  descartesJS.Arrow = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("5");

    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    /**
     * the size of the spear (arrow)
     * type {Node}
     * @private
     */
    this.spear = parent.evaluator.parser.parse("8");

    /**
     * the color of the arrow
     * type {String}
     * @private
     */
    this.arrow = new descartesJS.Color("ee0022");
    
    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arrow, descartesJS.Graphic);
  
  /**
   * Update the arrow
   */
  descartesJS.Arrow.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }
    
    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
    
  }

  /**
   * Draw the arrow
   */
  descartesJS.Arrow.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.arrow, this.color);
  }

  /**
   * Draw the trace of the arrow
   */
  descartesJS.Arrow.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.arrow, this.trace);
  }

  /**
   * Auxiliary function for draw an arrow
   * @param {CanvasRenderingContext2D} ctx rendering context on which the arrow is drawn
   * @param {String} fill the fill color of the arrow
   * @param {String} stroke the stroke color of the arrow
   */
  descartesJS.Arrow.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;
    
    desp = 10 + evaluator.evalExpression(this.size);
    width1 = evaluator.evalExpression(this.width);
    if (width1 < 0) {
      width1 = 0;
    }

    width2 = Math.ceil(width1/2);
    scale = space.scale;
    
    this.vect = new descartesJS.Vector2D(this.endPoints[1].x-this.endPoints[0].x, this.endPoints[1].y-this.endPoints[0].y);
    vlength = this.vect.vectorLength();
    this.angle = this.vect.angleBetweenVectors(descartesJS.Vector2D.AXIS_X);

    ctx.fillStyle = fill.getColor();
    ctx.strokeStyle = stroke.getColor();
    ctx.lineWidth = 2.0;
    
    if (this.abs_coord) {
      coordX =  mathRound(this.endPoints[0].x);
      coordY =  mathRound(this.endPoints[0].y);
      
      coordX1 = mathRound(this.endPoints[1].x);
      coordY1 = mathRound(this.endPoints[1].y);
    } else {
      coordX =  mathRound(space.getAbsoluteX(this.endPoints[0].x));
      coordY =  mathRound(space.getAbsoluteY(this.endPoints[0].y));
    
      coordX1 = mathRound(space.getAbsoluteX(this.endPoints[1].x));
      coordY1 = mathRound(space.getAbsoluteY(this.endPoints[1].y));        
    }
    
    var spear = evaluator.evalExpression(this.spear);
    if (spear < 0) {
      spear = 0
    }
    
    ctx.save();
    ctx.translate(coordX, coordY, vlength);
    
    if (this.abs_coord) {
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(this.angle)
      } else {
        ctx.rotate(-this.angle)
      }
    } else {
      vlength = vlength*scale;
      
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(-this.angle)
      } else {
        ctx.rotate(this.angle)
      }
    }
    
    ctx.beginPath();
    // ctx.moveTo(-width2 +.5,                         MathFloor(-width2) +.5);
    // ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(-width2) +.5);
    // ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(-spear-width2) +.5);
    // ctx.lineTo(MathFloor(vlength) +.5,              0);
    // ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(spear+width2) -.5);
    // ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(width2) -.5);
    // ctx.lineTo(-width2 +.5,                         MathFloor(width2) -.5);
    ctx.moveTo(-width2,                         MathFloor(-width2));
    ctx.lineTo(MathFloor(vlength-spear-width1), MathFloor(-width2));
    ctx.lineTo(MathFloor(vlength-2*spear),      MathFloor(-spear-width2));
    ctx.lineTo(MathFloor(vlength),              0);
    ctx.lineTo(MathFloor(vlength-2*spear),      MathFloor(spear+width2));
    ctx.lineTo(MathFloor(vlength-spear-width1), MathFloor(width2));
    ctx.lineTo(-width2,                         MathFloor(width2));
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    
    // draw the text of the arrow
    if (this.text != [""]) {
      midpX = parseInt((coordX + coordX1)/2) -3;
      midpY = parseInt((coordY + coordY1)/2) +3;
      
      this.uber.drawText.call(this, ctx, this.text, midpX, midpY, stroke, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var lineDesp;
  var coordX;
  var coordY;

  /**
   * A Descartes polygon
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the polygon
   */
  descartesJS.Polygon = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    this.fill = "";
    
    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.endPoints = [];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon, descartesJS.Graphic);
  
  /**
   * Update polygon
   */
  descartesJS.Polygon.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.evalExpression(this.expresion);
    
    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = { x: points[i][0], y: points[i][1] };
    }
    
    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
  }
  
  /**
   * Draw the polygon
   */
  descartesJS.Polygon.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }
  
  /**
   * Draw the trace of the polygon
   */
  descartesJS.Polygon.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a polygon
   * @param {CanvasRenderingContext2D} ctx rendering context on which the polygon is drawn
   * @param {String} fill the fill color of the polygon
   * @param {String} stroke the stroke color of the polygon
   */
  descartesJS.Polygon.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;
    
    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    lineDesp = (tmpLineWidth > 0) ? .5 : 0;

    coordX = (this.abs_coord) ? mathRound(this.endPoints[0].x) : mathRound(space.getAbsoluteX(this.endPoints[0].x));
    coordY = (this.abs_coord) ? mathRound(this.endPoints[0].y) : mathRound(space.getAbsoluteY(this.endPoints[0].y));
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    
    for(var i=1, l=this.endPoints.length; i<l; i++) {
      coordX = (this.abs_coord) ? mathRound(this.endPoints[i].x) : mathRound(space.getAbsoluteX(this.endPoints[i].x));
      coordY = (this.abs_coord) ? mathRound(this.endPoints[i].y) : mathRound(space.getAbsoluteY(this.endPoints[i].y));
      
      ctx.lineTo(coordX+lineDesp, coordY+lineDesp);
    }
    
    // draw the fill
    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.fill();
    }
    
    // draw the stroke
    ctx.stroke();
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var iniAng;
  var endAng;
  var u1;
  var u2;
  var v1;
  var v2;
  var w1;
  var w2;
  var angulo1;
  var angulo2;
  var tmpAngulo1;
  var tmpAngulo2;
  var space;
  var coordX;
  var coordY;
  var radius;
  var tempAng;
  var clockwise;
  var tmpLineWidth;

  /**
   * A Descartes arc
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the arc
   */
  descartesJS.Arc = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    this.fill = "";

    /**
     * center of an arc
     * type {Node}
     * @private
     */
    this.center = parent.evaluator.parser.parse("(0,0)");

    /**
     * radius of an arc
     * type {Node}
     * @private
     */
    this.radius = parent.evaluator.parser.parse("1");

    /**
     * initial angle or vector of an arc
     * type {Node}
     * @private
     */
    this.init = parent.evaluator.parser.parse("0");

    /**
     * final angle or vector of an arc
     * type {Node}
     * @private
     */
    this.end = parent.evaluator.parser.parse("90");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arc, descartesJS.Graphic);

  /**
   * Update the arc
   */
  descartesJS.Arc.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.center);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
    
    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    var initVal = evaluator.evalExpression(this.init);
    var endVal  = evaluator.evalExpression(this.end);

    // if the expression of the initial and final angle are parenthesized expressions
    if ( ((this.init.type == "(expr)") && (this.end.type == "(expr)")) || 
         ((this.init.type == "[expr]") && (this.end.type == "[expr]")) || 
         ((this.init.type == "(expr)") && (this.end.type == "[expr]")) || 
         ((this.init.type == "[expr]") && (this.end.type == "(expr)")) 
       ) {

      u1 = initVal[0][0];
      u2 = initVal[0][1];
      v1 = endVal[0][0];
      v2 = endVal[0][1];


      // arc expressed with points in the space
      if (!this.vectors) {
        if (this.abs_coord) {
          u1 =  u1 - this.exprX;
          u2 = -u2 + this.exprY;
          v1 =  v1 - this.exprX;
          v2 = -v2 + this.exprY;
        }
        else {
          u1 = u1 - this.exprX;
          u2 = u2 - this.exprY;
          v1 = v1 - this.exprX;
          v2 = v2 - this.exprY;
        }
      }
      // arc expressed with vectors
      else {
        if (this.abs_coord) {
          u2 = -u2;
          v2 = -v2;
        }
      }

      w1 = 1;
      w2 = 0;
      
      // find the angles
      angulo1 = Math.acos( (u1*w1+u2*w2)/Math.sqrt(u1*u1+u2*u2) );
      angulo2 = Math.acos( (v1*w1+v2*w2)/Math.sqrt(v1*v1+v2*v2) );

      // change considering the quadrant for the first angle
      if ((u1 > 0) && (u2 > 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 > 0) && (u2 < 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 < 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 > 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      
      // change considering the quadrant for the second angle
      if ((v1 > 0) && (v2 > 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 > 0) && (v2 < 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 < 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 > 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }

      // always choose the angles in order from lowest to highest
      tmpAngulo1 = Math.min(angulo1, angulo2);
      tmpAngulo2 = Math.max(angulo1, angulo2);
      angulo1 = tmpAngulo1;
      angulo2 = tmpAngulo2;

      // if the internal angle if greater than PI and the angle is in absolute coordinates
      if (((angulo2 - angulo1) > Math.PI) && this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }
      // if the internal angle if less than PI and the angle is in relative coordinates
      if (((angulo2 - angulo1) <= Math.PI) && !this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }

      this.iniAng = angulo1;
      this.endAng = angulo2;

      this.drawPoints = true;
    }
    // arc expressed with angles
    else {
      this.iniAng = descartesJS.degToRad(initVal);
      this.endAng = descartesJS.degToRad(endVal);
      this.drawAngle = true;
    }

  }

  /**
   * Draw the arc
   */
  descartesJS.Arc.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the arc
   */
  descartesJS.Arc.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Auxiliary function for draw an arc
   * @param {CanvasRenderingContext2D} ctx rendering context on which the arc is drawn
   * @param {String} fill the fill color of the arc
   * @param {String} stroke the stroke color of the arc
   */
  descartesJS.Arc.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    radius = evaluator.evalExpression(this.radius);
    if (radius < 0) {
      radius = 0;
    }

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.lineCap = "round";
    ctx.strokeStyle = stroke.getColor();

    // draw the arc when especified in angles
    if (this.drawAngle) {
      if (this.abs_coord) {
        coordX = mathRound(this.exprX);
        coordY = mathRound(this.exprY);
      }
      else {
        coordX = mathRound(space.getAbsoluteX(this.exprX));
        coordY = mathRound(space.getAbsoluteY(this.exprY));
        radius = radius*space.scale;
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
      }

      if (this.iniAng > this.endAng) {
        tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }       
    }
    // draw the arc when especified with points
    else if (this.drawPoints) {
      if (this.abs_coord) {
        coordX = mathRound(this.exprX);
        coordY = mathRound(this.exprY);
      }
      else {
        coordX = mathRound(space.getAbsoluteX(this.exprX));
        coordY = mathRound(space.getAbsoluteY(this.exprY));
        radius = radius*space.scale;
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
      }      
    }

    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.beginPath();
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
    ctx.stroke();
    
    // draw the text of the arc
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+4, coordY-2, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }      
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;

  var width;
  var textLine;
  var w;
  var newText;
  var height;

  var restText;
  var resultText;
  var tempText;
  var charAt;
  var lastIndex;
  var decimals;

  /**
   * A Descartes text
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the text
   */
  descartesJS.Text = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("0");
    
    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // alignment
    if (!this.align) {
      this.align = "start";
    }
    
    this.ascent = this.fontSize -Math.ceil(this.fontSize/7) -((this.font.match("Courier")) ? 3 : 0);;
    
    this.abs_coord = true;
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text, descartesJS.Graphic);

  /**
   * Update the text
   */
  descartesJS.Text.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Draw the text
   */
  descartesJS.Text.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color);
  }

  /**
   * Draw the trace of the text
   */
  descartesJS.Text.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.color);
  }
  
  /**
   * Auxiliary function for draw a text
   * @param {CanvasRenderingContext2D} ctx rendering context on which the text is drawn
   * @param {String} fill the fill color of the text
   * @param {String} stroke the stroke color of the text
   */
  descartesJS.Text.prototype.drawAux = function(ctx, fill) {
    decimals = this.evaluator.evalExpression(this.decimals);

    if (this.text.type === "rtfNode") {
      newText = this.text;
      this.ascent = 0;
    }
    else {
      newText = this.splitText(this.text.toString(decimals, this.fixed).split("\\n"))
    }

    // draw the text
    if (this.text != [""]) {
      //this.uber.drawText.call(this, ctx, newText, parseFloat(this.exprX)+5, parseFloat(this.exprY), fill, this.font, this.align, "hanging");
      this.uber.drawText.call(this, ctx, newText, parseInt(this.exprX)+5, parseInt(this.exprY)+this.ascent, fill, this.font, this.align, "alphabetic", decimals, this.fixed);
    }
  }
  
  /**
   * Split a text
   * @param {SimpleText} text the simple text to split
   * @return {Array<String>} return the divided text
   */
  descartesJS.Text.prototype.splitText = function(text) {
    evaluator = this.evaluator;
    width = evaluator.evalExpression(this.width);
    newText = [];
    
    this.ctx.font = this.font;

    // if the width is greater than 20 then split the text
    // besides the text should not be a rtf text (text.type! = "undefined")
    if ( (width >=20) && (text.type != "undefined") ) {
      for (var i=0, l=text.length; i<l; i++) {
        textLine = text[i];
        w = (this.ctx.measureText(textLine)).width;

        if (w > width) {
          newText = newText.concat( this.splitWords(textLine, width) );
        }
        else {
          newText.push(textLine);
        }    
      }
      
      height = Math.floor(this.fontSize*1.2)*(newText.length);
      evaluator.setVariable("_Text_H_", height);
      return newText;
    }
    
    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable("_Text_W_", 1000);

    return text;
  }

  /**
   * Split a text form a width
   * @param {String} text the text to split
   * @param {Number} widthLimit the width to split the text
   * @return {Array<String>} return the divided text
   */
  descartesJS.Text.prototype.splitWords = function(text, widthLimit) {
    restText = text;
    resultText = [];
    tempText = "";
    lastIndex = 0;
    var tmpString;

    for (var i=0, l=text.length; i<l; i++) {
      charAt = restText.charAt(i);
      
      if (charAt === " ") {
        lastIndexOfWhite = i;
      }

      tempText += charAt;

      if (Math.round(this.ctx.measureText(tempText).width) > widthLimit) {
        tmpString = text.substring(lastIndex, i+1);

        if (charAt !== " ") {
          if (tmpString.indexOf(" ") === -1) {
            lastIndexOfWhite = i;
            i--;
          }
          else {
            i = lastIndexOfWhite;
          }
        }

        resultText.push( text.substring(lastIndex, lastIndexOfWhite) );

        tempText = "";
        lastIndex = i+1;
      }
      
    }
    resultText.push( text.substring(lastIndex));

    return resultText
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var imgFile;
  var space;
  var despX;
  var despY;
  var coordX;
  var coordY;
  var rotation;

  /**
   * A Descartes image
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the image
   */
  descartesJS.Image = function(parent, values) {
    /**
     * the file name of the graphic
     * type {String}
     * @private
     */
    this.file = "";

    /**
     * the rotation of an image
     * type {Node}
     * @private
     */
    this.inirot = parent.evaluator.parser.parse("0");    

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
    
    this.img = new Image();

    this.scaleX = 1;
    this.scaleY = 1;

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Image, descartesJS.Graphic);

  /**
   * Update the image
   */
  descartesJS.Image.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    
    if (expr[0].length == 4) {
      this.centered = true;
      this.scaleX = expr[0][2];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[0][3];
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }      
      
    if ((expr[1]) && (expr[1].length == 2)) {
      this.centered = true;
      this.scaleX = expr[1][0];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[1][1];      
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }
    
    imgFile = evaluator.evalExpression(this.file);
    if ((imgFile) || (imgFile == "")) {
      this.img = this.parent.getImage(imgFile);
    }
  }
  
  /**
   * Draw the image
   */
  descartesJS.Image.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this);
  }

  /**
   * Draw the trace of the image
   */
  descartesJS.Image.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this);
  }
  
  /**
   * Auxiliary function for draw an image
   * @param {CanvasRenderingContext2D} ctx rendering context on which the image is drawn
   */
  descartesJS.Image.prototype.drawAux = function(ctx) {
    evaluator = this.evaluator;
    space = this.space;

    if ( (this.img) && (this.img.ready) && (this.img.complete) ) {
      despX = (this.centered) ? 0 : this.img.width/2;
      despY = (this.centered) ? 0 : this.img.height/2;
      coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
      coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));
      rotation = descartesJS.degToRad(-evaluator.evalExpression(this.inirot));

      ctx.translate(coordX+despX, coordY+despY);
      ctx.rotate(rotation);
      ctx.scale(this.scaleX, this.scaleY);

      if (this.opacity) {
        ctx.globalAlpha = evaluator.evalExpression(this.opacity);
      }

      ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);

      // reset the transformations
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = 1;
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var expr;
  var x;
  var y;
  var pixelStack;
  var currentPixel;
  var startColor;
  var index;

  /**
   * A Descartes fill
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the fill
   */
  descartesJS.Fill = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Fill, descartesJS.Graphic);

  /**
   * Update the fill
   */
  descartesJS.Fill.prototype.update = function() {
    expr = this.evaluator.evalExpression(this.expresion);

    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
  }

  /**
   * Draw the fill
   */
  descartesJS.Fill.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the fill
   */
  descartesJS.Fill.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    // this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a fill
   * @param {CanvasRenderingContext2D} ctx rendering context on which the fill is drawn
   * @param {String} fill the fill color of the fill
   */
  descartesJS.Fill.prototype.drawAux = function(ctx, fill) {
    // update the color components of the fill color
    fill.getColor();

    // this.imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h).data;
    imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h);

    if (this.abs_coord) {
      x = parseInt(this.exprX);
      y = parseInt(this.exprY);
    }
    else {
      x = parseInt( this.space.getAbsoluteX(this.exprX) );
      y = parseInt( this.space.getAbsoluteY(this.exprY) );
    }

    if ((x < 0) || (y < 0) || (x >= this.space.w) || (y >= this.space.h)) {
      return;
    }

    pixelStack = [{x: x, y: y}];

    startColor = getPixel(imageData, x, y);

    while(pixelStack.length > 0) {
      currentPixel = pixelStack.pop();
      x = currentPixel.x;
      y = currentPixel.y;

      if (equalColor(startColor, getPixel(imageData, x, y))) {
        // asign the color
        setPixel(imageData, x, y, fill);

        // add the next pixel to the stack
        if (x > 0) {
          pixelStack.push({x: x-1, y: y});
        }
        if (x <imageData.width-1) {
          pixelStack.push({x: x+1, y: y});
        }
        pixelStack.push({x: x, y: y-1});
        pixelStack.push({x: x, y: y+1});
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   *
   */
  function getPixel(imageData, x, y) {
    index = (x + y*imageData.width) *4;

    return { r: imageData.data[index],
             g: imageData.data[index+1],
             b: imageData.data[index+2],
             a: imageData.data[index+3]
           }
  }

  /**
   *
   */
  function setPixel(imageData, x, y, color) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = color.r;
    imageData.data[index+1] = color.g;
    imageData.data[index+2] = color.b;
    imageData.data[index+3] = 255 - color.a;
  }

  /**
   *
   */
  function equalColor(c1, c2) {
    return (c1.r === c2.r) && (c1.g === c2.g) && (c1.b === c2.b) && (c1.a === c2.a);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var reservedIdentifiers = "-rnd-pi-e-sqr-raíz-sqrt-exp-log-log10-abs-ent-sgn-ind-sen-sin-cos-tan-cot-sec-csc-senh-sinh-cosh-tanh-coth-sech-csch-asen-asin-acos-atan-min-max-_Num_-_Trace_-_Stop_Audios_-esCorrecto-escorrecto-_GetValues_-_GetMatrix_-_Save_-_Open_-_SaveState_-_OpenState_-";
  var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg)/gi;
  var expr;

  /**
   * A Descartes macro
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the macro
   */
  descartesJS.Macro = function(parent, values) {
    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    this.expresion = undefined;

    /**
     * the macro rotation
     * type {Node}
     * @private
     */
    this.inirot = parent.evaluator.parser.parse("0");

    /**
     * the macro position
     * type {Node}
     * @private
     */
    this.inipos = parent.evaluator.parser.parse("(0,0)");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    // if (reservedIdentifiers == null) {
    //   reservedIdentifiers = "-rnd-pi-e-";

    //   for (var funName in this.evaluator.functions) {
    //     // verify the own properties of the object
    //     if (this.evaluator.functions.hasOwnProperty(funName)) {
    //       reservedIdentifiers += funName + "-";
    //     }
    //   }
    // }

    this.graphics = [];
    
    var lessonParser = parent.lessonParser;
    var tokenizer = new descartesJS.Tokenizer();
    
    // if the expression is empty
    if (this.expresion == undefined) {
      return;
    }

    
    // if the macro name was not specified as a string, then adds single quotes to turn it into string
    if ( !(this.expresion.charAt(0) === "'")) {
      this.expresion = "'" + this.expresion + "'";
    }
    this.expresion = this.evaluator.parser.parse(this.expresion);

    var filename = this.evaluator.evalExpression(this.expresion);
    var response;
    
    if (filename) {
      // the macro is embeded in the webpage
      var macroElement = document.getElementById(filename);

      if ((macroElement) && (macroElement.type == "descartes/macro")) {
        response = macroElement.text;
      }

      // the macro is in an external file
      else {
        response = descartesJS.openExternalFile(filename);
        
        // verify the content is a Descartes macro
        if ( (response) && (!response.match(/tipo_de_macro/g)) ) {
          response = null;
        }
      }
    }

    var indexOfEqual;
    var tmpIniti;
    var tmpResponse;

    // if it was posible to read the macro
    if (response) {
      tmpResponse = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

      // maintain only the lines that have information for the macro
      response = [];

      for(var i=0, l=tmpResponse.length; i<l; i++) {
        indexOfEqual = tmpResponse[i].indexOf("=");

        if(indexOfEqual !== -1) {
          tmpIniti = tmpResponse[i].substring(0, indexOfEqual);
        
          if (babel[tmpIniti] === "id" || babel[tmpIniti] === "type") {
            response.push( lessonParser.split( tmpResponse[i] ) );
          }
        }
      }
      
      var respText;
      var babelResp;
      var dotIndex;
      var tmpTokens;
      var tmpTokensRespText;
      
      var isID;

      // add the macro name as a prefix, only in some expressions
      for (var i=0, l=response.length; i<l; i++) {
        respText = response[i] || [];

        isID = ((respText) && (respText[0]) && (respText[0][0] === "id"));

        for (var j=0, k=respText.length; j<k; j++) {
          // if the parameters that have a dot
          dotIndex = respText[j][0].indexOf(".");
          if ((dotIndex !== -1) && (!isID)) {
            babelResp = babel[respText[j][0].substring(dotIndex+1)];
            respText[j][0] = this.name + "." + respText[j][0];
          }
          else {
            babelResp = babel[respText[j][0]];
          }

          // if the expressions are different from this, then the cycle continues and is not replaced nothing          
          if ( (babelResp === "font") ||
               (((babelResp === "fill") || (babelResp === "color") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
               ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
               ((babelResp !== "id") && (babel[respText[j][1]] !== undefined)) 
             ) {
            continue;
          }
          
          // is a text
          if (babelResp == "text") {
            // if the text is rtf must processing it diferent
            if (respText[j][1].match(/\{\\rtf1/)) {
              var textTemp = respText[j][1];
 
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var self = this;

              // function to replace expresions
              var funReplace = function(str, m1) {
                var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
                
                for (var t=0, lt=tokens.length; t<lt; t++) {
                  if ((tokens[t].type == "identifier")  && (!reservedIdentifiers.match("-" + tokens[t].value + "-"))) {
                    tokens[t].value = self.name + "." + tokens[t].value;
                  }
                }
                
                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
              textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              
              respText[j][1] = textTemp;
            }
            // simple text
            else {
              tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

              for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                  if ((tmpTokens[tt].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[tt].value + "-"))) {
                    tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                  }
                }
                tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");

                tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
              }

              respText[j][1] = tmpTokensRespText.join("");
            }
          }
          // the token is not a text
          else {
            tmpTokens = tokenizer.tokenize(respText[j][1]);

            for (var t=0, lt=tmpTokens.length; t<lt; t++) {

              if ((tmpTokens[t].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[t].value + "-"))) {
                tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
              }

            }

            respText[j][1] = tokenizer.flatTokens(tmpTokens);
          }
        
        }

      }


      var tempResp;
      var isGraphic;

      // flat the expresions to obtain a string
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i][0]) {
          tempResp = "";
          isGraphic = false;

          for (var j=0, k=response[i].length; j<k; j++) {

            // if is a graphic object, add the corresponding space
            if (babel[response[i][j][0]] === "type") {
              tempResp = "espacio='" + this.spaceID + "' ";
              isGraphic = true;
            }

            tempResp = tempResp + response[i][j][0] + "='" + response[i][j][1] + "' ";
          }

          response[i] = tempResp;

          // build and add the graphic elements to the space
          if (isGraphic) {
            this.graphics.push( lessonParser.parseGraphic(response[i], this.abs_coord, this.background, this.inirot) );
          } 
          // build and add the axiliaries to the scene
          else {
            lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Macro, descartesJS.Graphic);
    
  /**
   * Update the macro
   */
  descartesJS.Macro.prototype.update = function() {
    expr = this.evaluator.evalExpression(this.inipos);
    this.iniPosX = expr[0][0];
    this.iniPosY = expr[0][1];
  }
  
  /**
   * Auxiliary function for draw a macro
   * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
   */
  descartesJS.Macro.prototype.drawAux = function(ctx) {
    for (var i=0, l=this.graphics.length; i<l; i++) {

      if (this.graphics[i].abs_coord) {
        ctx.translate(this.iniPosX, this.iniPosY);
      } 
      else {
        ctx.translate(this.iniPosX*this.space.scale, -this.iniPosY*this.space.scale);
      }
      
      this.graphics[i].draw();

      // reset the transformations
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }      
  }

  return descartesJS;
})(descartesJS || {}, babel);/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSqrt = Math.sqrt;
  var MathSin = Math.sin;
  var MathCos = Math.cos;

  var len;
  var s;
  var c;
  var a00;
  var a01;
  var a02;
  var a03;
  var a10;
  var a11;
  var a12;
  var a13;
  var a20;
  var a21;
  var a22;
  var a23;
  var a30;
  var a31;
  var a32;
  var a33;
  var b00;
  var b01;

  descartesJS.norm3D = function(v) {
    return MathSqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  descartesJS.normalize3D = function(v) {
    len = descartesJS.norm3D(v);

    if (len === 0) {
      return { x: 0, 
               y: 0, 
               z: 0 
             };
    }
    else if (len === 1) {
      return { x: v.x, 
               y: v.y, 
               z: v.z 
             };
    }
    
    len = 1/len;

    return { x: v.x*len, 
             y: v.y*len, 
             z: v.z*len 
           };   
  }

  descartesJS.dotProduct3D = function(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;    
  }

  descartesJS.crossProduct3D = function(v1, v2) {
    return { x: v1.y*v2.z - v1.z*v2.y,
             y: v1.z*v2.x - v1.x*v2.z,
             z: v1.x*v2.y - v1.y*v2.x
           };
  }

  descartesJS.scalarProduct3D = function(v, s) {
    return { x: v.x*s, 
             y: v.y*s,
             z: v.z*s
           };
  }

  descartesJS.subtract3D = function(v1, v2) {
    return { x: v1.x - v2.x,
             y: v1.y - v2.y,
             z: v1.z - v2.z
           };
  }

  descartesJS.add3D = function(v1, v2) {
    return { x: v1.x + v2.x,
             y: v1.y + v2.y,
             z: v1.z + v2.z
           };
  }

  descartesJS.equals3DEpsilon = function(p1, p2, epsilon) {
    return (Math.abs(p1.x-p2.x) <= epsilon) && 
           (Math.abs(p1.y-p2.y) <= epsilon) && 
           (Math.abs(p1.z-p2.z) <= epsilon);
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  descartesJS.Vector4D = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }

  descartesJS.Matrix4x4 = function( a00, a01, a02, a03,
                                    a10, a11, a12, a13,
                                    a20, a21, a22, a23,
                                    a30, a31, a32, a33
                                   ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a02 = a02 || 0;
    this.a03 = a03 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
    this.a12 = a12 || 0;
    this.a13 = a13 || 0;
    this.a20 = a20 || 0;
    this.a21 = a21 || 0;
    this.a22 = a22 || 0;
    this.a23 = a23 || 0;
    this.a30 = a30 || 0;
    this.a31 = a31 || 0;
    this.a32 = a32 || 0;
    this.a33 = a33 || 0;
  }

  descartesJS.Matrix4x4.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a02 = 0;
    this.a03 = 0;
    
    this.a10 = 0;
    this.a11 = 1;
    this.a12 = 0;
    this.a13 = 0;
    
    this.a20 = 0;
    this.a21 = 0;
    this.a22 = 1;
    this.a23 = 0;

    this.a30 = 0;
    this.a31 = 0;
    this.a32 = 0;
    this.a33 = 1;
    
    return this;
  }

  descartesJS.Matrix4x4.prototype.multiplyVector4 = function(v) {
    return new descartesJS.Vector4D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + v.w * this.a30,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + v.w * this.a31,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + v.w * this.a32,
                                    v.x * this.a03 + v.y * this.a13 + v.z * this.a23 + v.w * this.a33
                                   );
  }

  descartesJS.Matrix4x4.prototype.translate = function(v) {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a00 * v.x + this.a10 * v.y + this.a20 * v.z + this.a30, this.a01 * v.x + this.a11 * v.y + this.a21 * v.z + this.a31, this.a02 * v.x + this.a12 * v.y + this.a22 * v.z + this.a32, this.a03 * v.x + this.a13 * v.y + this.a23 * v.z + this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateX = function(angle) {
    s = MathSin(angle);
    c = MathCos(angle);
    
    a10 = this.a10;
    a11 = this.a11;
    a12 = this.a12;
    a13 = this.a13;
    a20 = this.a20;
    a21 = this.a21;
    a22 = this.a22;
    a23 = this.a23;
    
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     a10 *  c + a20 * s, a11 *  c + a21 * s, a12 *  c + a22 * s, a13 *  c + a23 * s,
                                     a10 * -s + a20 * c, a11 * -s + a21 * c, a12 * -s + a22 * c, a13 * -s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.rotateY = function(angle) {
    s = MathSin(angle);
    c = MathCos(angle);
    
    a00 = this.a00;
    a01 = this.a01;
    a02 = this.a02;
    a03 = this.a03;
    a20 = this.a20;
    a21 = this.a21;
    a22 = this.a22;
    a23 = this.a23;
    
    return new descartesJS.Matrix4x4(a00 * c + a20 * -s, a01 * c + a21 * -s, a02 * c + a22 * -s, a03 * c + a23 * -s,
                                     this.a10, this.a11, this.a12, this.a13, 
                                     a00 * s + a20 * c, a01 * s + a21 * c, a02 * s + a22 * c, a03 * s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateZ = function(angle) {  
    s = MathSin(angle);
    c = MathCos(angle);
    
    a00 = this.a00;
    a01 = this.a01;
    a02 = this.a02;
    a03 = this.a03;
    a10 = this.a10;
    a11 = this.a11;
    a12 = this.a12;
    a13 = this.a13;
    
    return new descartesJS.Matrix4x4(a00 *  c + a10 * s, a01 *  c + a11 * s, a02 *  c + a12 * s, a03 *  c + a13 * s,
                                     a00 * -s + a10 * c, a01 * -s + a11 * c, a02 * -s + a12 * c, a03 * -s + a13 * c,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author i Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var Math2PI = 2*Math.PI;
  var lineCap = "round";
  var lineJoin = "round";

  var v1;
  var v2;
  var evaluator;
  var verticalDisplace;
  var theText;

  var tempParam;

  var epsilon = 0.00000001;

  /**
   * 3D primitive (vertex, face, text, edge)
   * @constructor 
   */
  descartesJS.Primitive3D = function (values) {
    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    this.newV = [];
    this.spaceVertices = [];

    // asign the corresponding drawing function
    if (this.type === "vertex") {
      this.draw = drawVertex;
    }
    else if (this.type === "face") {
      this.normal = getNormal(this.vertices[0], this.vertices[1], this.vertices[2]);
      this.draw = drawFace;
    }
    else if (this.type === "text") {
      // get the font size
      this.fontSize = this.font.match(/(\d+)px/);
      if (this.fontSize) {
        this.fontSize = parseInt(this.fontSize[1]);
      } else {
        this.fontSize = 10;
      }

      this.draw = drawPrimitiveText;
    }
    else if (this.type === "edge") {
      this.draw = drawEdge;
    }

    // overwrite the computeDepth function if the primitive is a text
    if (this.isText) {
      this.computeDepth = function() {
        this.newV = this.vertices;
        this.depth = this.vertices[0].z;
      }
    }

  }

  /**
   * Compute a transformation to the vertices
   * @param
   */
  descartesJS.Primitive3D.prototype.computeDepth = function(space) {
    this.average = { x: 0, y: 0, z: 0 };

    this.removeDoubles();

    // apply the camera rotation
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.newV[i] = space.rotateVertex(this.vertices[i]);
      this.spaceVertices[i] = space.rotateVertex(this.vertices[i]);
      this.average.x += this.newV[i].x;
      this.average.y += this.newV[i].y;
      this.average.z += this.newV[i].z;
    }
    this.average = descartesJS.scalarProduct3D(this.average, 1/l);

    // triangles and faces
    if (this.vertices.length > 2) {
      this.normal = getNormal(this.newV[0], this.newV[1], this.newV[2]);
      this.direction = descartesJS.dotProduct3D( this.normal, descartesJS.normalize3D(space.eye) );
    }
    else {
      this.normal = { x: 0, y: 1, z: 0 };
      this.direction = { x: 1, y: 0, z: 0 };
    }

    this.depth = 0;
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.newV[i] = space.project(this.newV[i]);
      this.depth += this.newV[i].z;
    }

    this.depth/= l;
  }

  var tmpVertices;

  /**
   *
   */
  descartesJS.Primitive3D.prototype.removeDoubles = function() {
    tmpVertices = [];
    for (var i=0, l=this.vertices.length; i<l; i++) {
      if ( (this.vertices[i].x !== this.vertices[(i+1)%l].x) ||
           (this.vertices[i].y !== this.vertices[(i+1)%l].y) ||
           (this.vertices[i].z !== this.vertices[(i+1)%l].z) ||
           (this.vertices[i].w !== this.vertices[(i+1)%l].w) 
         ) {
        tmpVertices.push(this.vertices[i]);
      }
    }
    this.vertices = tmpVertices;
  }

  /**
   *
   */
  function drawVertex(ctx) {
    ctx.lineWidth = 1;
    ctx.fillStyle = this.backColor.getColor();
    ctx.strokeStyle = this.frontColor.getColor();

    ctx.beginPath();
    ctx.arc(this.newV[0].x, this.newV[0].y, this.size+.5, 0, Math2PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   *
   */
  function drawFace(ctx, space) {
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    // compute the color if is an expression
    this.frontColor.getColor();
    this.backColor.getColor();

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.newV[0].x, this.newV[0].y);
    for (var i=1, l=this.newV.length; i<l; i++) {
      ctx.lineTo(this.newV[i].x, this.newV[i].y);
    }
    ctx.closePath();

    // color render
    if (this.model === "color") {
      if (this.direction >= 0) {
        ctx.fillStyle = this.backColor.getColor();
      }
      else {
        ctx.fillStyle = this.frontColor.getColor();
      }

      ctx.fill();
    }
    // light and metal render
    else if ( (this.model === "light") || (this.model === "metal") ){
      if (this.direction >= 0) {
        ctx.fillStyle = space.computeColor(this.backColor, this, (this.model === "metal"));
      }
      else {
        ctx.fillStyle = space.computeColor(this.frontColor, this, (this.model === "metal"));
      }
      ctx.fill();
    }
    // wireframe render
    else if (this.model === "wire") {
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = this.frontColor.getColor();
      ctx.stroke();
    }

    // draw the edges
    if ((this.edges) && (this.model !== "wire")) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#808080"
      ctx.stroke();
    }
  }

  /**
   *
   */
  function drawPrimitiveText(ctx) {
    tempParam = this.evaluator.getVariable(this.family);
    this.evaluator.setVariable(this.family, this.familyValue);
    
    this.drawText(ctx, this.text, this.newV[0].x, this.newV[0].y +this.displace, this.frontColor.getColor(), this.font, "left", "alphabetic", this.decimals, this.fixed, true);

    this.evaluator.setVariable(this.family, tempParam);
  }

  /**
   *
   */
  function drawEdge(ctx) {
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.frontColor.getColor();

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.newV[0].x, this.newV[0].y);
    ctx.lineTo(this.newV[1].x, this.newV[1].y);

    ctx.stroke();
  }

  /**
   * Draw the text of the graphic
   * @param {CanvasRenderingContext2D} ctx the context render to draw
   * @param {String} text the text to draw
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {String} fill the fill color of the graphic
   * @param {String} font the font of the text
   * @param {String} align the alignment of the text
   * @param {String} baseline the baseline of the text
   * @param {Number} decimals the number of decimals of the text
   * @param {Boolean} fixed the number of significant digits of the number in the text
   * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
   */
  descartesJS.Primitive3D.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
    // rtf text
    if (text.type == "rtfNode") {
      ctx.fillStyle = fill;
      ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align, displaceY);
      
      return;
    }

    // simple text (none rtf text)
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    
    evaluator = this.evaluator;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    verticalDisplace = this.fontSize*1.2 || 0;

    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];

      if (this.border) {
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.splitFace = function(p) {
    if (this.intersects(p)) {
      var i1 = null;
      var i2 = null;
      var ix1 = 0;
      var ix2 = 0;

      for (var i=0, l=p.vertices.length; i<l; i++) {
        var inter = this.intersection( p.vertices[i], p.vertices[(i+1)%l] );

        if (inter !== null) {
          if (i1 === null) {
            i1 = inter;
            ix1 = i;
            if (p.vertices.length === 2) {
              i2 = i1;
              break;
            }
          }
          else if (!descartesJS.equals3DEpsilon(inter, i1, epsilon)) {
            i2 = inter;
            ix2 = i;
            break;
          }
        }
      }

      if ((i1 !== null) && (i2 !== null)) {
        var oneIsInterior = this.isInterior(i1) || this.isInterior(i2);
        var j1 = null;
        var j2 = null;

        if ((!oneIsInterior) && (p.vertices.length >= 3)) {
          for (var j=0, k=this.vertices.length; j<k; j++) {
            var inter = p.intersection( this.vertices[j], this.vertices[(j+1)%k] );
            if (inter !== null) {
              if (j1 === null) {
                j1 = inter;
              }
              else if (!descartesJS.equals3DEpsilon(inter, j1, epsilon)) {
                j2 = inter;
                break;
              }
            }
          }
        }

        if ( (oneIsInterior) || ((j1 !== null) && (j2 !== null) && (p.isInterior(j1)) && (p.isInterior(j2))) ) {
          var splitted = true;
          var P0 = p.vertices;
          var V = null;
          var v = null;

          if (P0.length === 2) {
            if (descartesJS.equals(i1, P0[0], epsilon) || descartesJS.equals(i1, P0[1], epsilon)) {
              splitted = false;
            }
            else {
              V = [];
              V[0] = P0[0];
              V[1] = i1;
              v = [];
              v[0] = i1;
              v[1] = P0[1]
            }
          }
          else {
            V = [];
            v = [];
            var J=0;
            var j=0;
            var k=0;

            for (var i=0; i<P0.length; i++) {
              if (i < ix1) {
                V[J++] = P0[i];
              }
              else if (i == ix1) {
                V[J++] = P0[i];
                V[J++] = i1;
                v[j++] = i1;
              } 
              else if (i < ix2) {
                v[j++] = P0[i];
              } 
              else if (i == ix2) {
                v[j++] = P0[i];
                v[j++] = i2;
                V[J++] = i2;
              } 
              else {
                V[J++] = P0[i];
              }
            }
          }

          if (splitted) {
            var fa = [];

            fa[0] = new descartesJS.Primitive3D( { vertices: V,
                                                   type: "face",
                                                   frontColor: p.frontColor,
                                                   backColor: p.backColor,
                                                   edges: p.edges,
                                                   model: p.model
                                                  } );
            fa[0].normal = p.normal;

            fa[1] = new descartesJS.Primitive3D( { vertices: v,
                                                   type: "face",
                                                   frontColor: p.frontColor,
                                                   backColor: p.backColor,
                                                   edges: p.edges,
                                                   model: p.model
                                                  } );
            fa[1].normal = p.normal;

            return fa;
          }
        }
      }
    }

    return [p];
  }

  /**
   * check if two faces has an intersection
   */
  descartesJS.Primitive3D.prototype.intersects = function(p) {
    return this.intersectsPlane(p) && p.intersectsPlane(this);
  }

  /**
   * check if two planes intersects
   */
  descartesJS.Primitive3D.prototype.intersectsPlane = function(p) {
    var d = descartesJS.dotProduct3D(p.vertices[0], p.normal);
    var d0 = descartesJS.dotProduct3D(this.vertices[0], p.normal);

    if (Math.abs(d-d0) < epsilon) {
      return true;
    }
    for (var i=1, l=this.vertices.length; i<l; i++) {
      var di = descartesJS.dotProduct3D( this.vertices[i], p.normal);

      if ( (Math.abs(d-di) < epsilon) || (di>d && d0<d) || (di<d && d0>d) ) {
        return true;
      }
    }

    return false;
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.intersection = function(p1, p2) {
    if (this.vertices.length > 0) {
      var p12 = descartesJS.subtract3D(p2, p1);
      var den = descartesJS.dotProduct3D(p12, this.normal);
      if (den !== 0) {
        var t = descartesJS.dotProduct3D( descartesJS.subtract3D(this.vertices[0], p1), this.normal ) / den;

        if ((-epsilon < t) && (t < 1+epsilon)) {
          return descartesJS.add3D(p1, descartesJS.scalarProduct3D(p12, t));
        }
      }
    }

    return null;
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.isInterior = function(r) {
    if (this.vertices.length > 0) {
      var D = 0;
      var u = descartesJS.subtract3D(this.vertices[0], r);

      for (var i=0, l=this.vertices.length; i<l; i++) {
        var v = descartesJS.subtract3D(this.vertices[(i+1)%l], r);
        var D1 = descartesJS.dotProduct3D( descartesJS.crossProduct3D(u, v), this.normal );

        if (Math.abs(D1) < epsilon) {
          if (descartesJS.dotProduct3D(u, v) < 0) {
            return true;
          }
        }
        else {
          if (((D < 0) && (D1 > 0)) || ((D > 0) && (D1 < 0))) {
            return false;
          }
          u = v;
          D = D1;
        }
      }
    }

    return true;
  }

  function getNormal(u1, u2, u3) {
    v1 = descartesJS.subtract3D( u1, u2 );
    v2 = descartesJS.subtract3D( u1, u3 );
    return descartesJS.normalize3D( descartesJS.crossProduct3D(v1, v2) );
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var translate = {x:0, y:0, z:0};

  var evaluator;
  var expr;
  var tempParam;
  var theText;
  var verticalDisplace;

  var tmpVertex;
  var tmpExpr;
  var tmpExpr2;
  var tmpExpr3;
  var lastIndexOfSpace;

  /**
   * Descartes 3D graphics
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Graphic3D = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    
    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * identifier of the space that belongs to the graphic
     * type {String}
     * @private
     */
    this.spaceID = "E0";

    /**
     * the condition for determining whether the graph is drawn in the background
     * type {Boolean}
     * @private
     */
    this.background = false;

    /**
     * type of the graphic
     * type {String}
     * @private
     */
    this.type = "";

    /**
     * the primary color of the graphic
     * type {String}
     * @private
     */
    this.color = new descartesJS.Color("eeffaa");

    /**
     * the back face color of the graphic
     * type {Node}
     * @private
     */
    this.backcolor = new descartesJS.Color("6090a0");

    this.Nu = this.evaluator.parser.parse("7");
    this.Nv = this.evaluator.parser.parse("7");
    
    /**
     * the condition to draw the graphic
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * the condition for determine whether the graphic is in absolute coordinates
     * type {Boolean}
     * @private
     */
    this.abs_coord = false;
    
    /**
     * the condition and parameter name for family of the graphic
     * type {String}
     * @private
     */
    this.family = "";

    /**
     * the interval of the family
     * type {Node}
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * the number of steps of the family
     * type {Node}
     * @private
     */
    this.family_steps = parser.parse("8");
    
    /**
     * info font
     * type {String}
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * the condition for determining whether the text of the graph is fixed or not
     * type {Boolean}
     * @private
     */
    this.fixed = true;

    /**
     * text of the graphic
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * the number of decimal of the text
     * type {Node}
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.inirot = "(0,0,0)";
    this.inirotEuler = false;
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.inipos = parser.parse("(0,0,0)");

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.endrot = "(0,0,0)";
    this.endrotEuler = false;
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.endpos = parser.parse("(0,0,0)");

    /**
     * the ilumination model
     * type {String}
     * @private
     */
    this.model = "color";
    
    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    if ((this.expresion == undefined) && (this.type != "macro")) {
      this.expresion = parser.parse("(0,0)");
    }

    // get the space of the graphic
    this.space = this.getSpace();

    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
        
    this.font = descartesJS.convertFont(this.font)

    // get the font size
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = parseInt(this.fontSize[1]);
    } else {
      this.fontSize = 10;
    }

    // euler rotations
    if (this.inirot.match("Euler")) {
      this.inirot = this.inirot.replace("Euler", "");
      this.inirotEuler = true;
    }
    if (this.endrot.match("Euler")) {
      this.endrot = this.endrot.replace("Euler", "");
      this.endrotEuler = true;
    }

    this.inirot = parser.parse(this.inirot);
    this.endrot = parser.parse(this.endrot);

    // auxiliary matrices
    this.inirotM   = new descartesJS.Matrix4x4();
    this.inirotM_X = new descartesJS.Matrix4x4();
    this.inirotM_Y = new descartesJS.Matrix4x4();
    this.inirotM_Z = new descartesJS.Matrix4x4();
    this.iniposM   = new descartesJS.Matrix4x4();

    this.endrotM   = new descartesJS.Matrix4x4();
    this.endrotM_X = new descartesJS.Matrix4x4();
    this.endrotM_Y = new descartesJS.Matrix4x4();
    this.endrotM_Z = new descartesJS.Matrix4x4();
    this.endposM   = new descartesJS.Matrix4x4();
  }
  
  /**
   * Get the space to which the graphic belongs
   * return {Space} return the space to which the graphic belongs
   */
  descartesJS.Graphic3D.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;

    // find in the spaces
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        return space_i;
      }
    }
    
    // if do not find the identifier, return the first space
    return spaces[0];
  }
  
  /**
   * Get the family values of the graphic
   */
  descartesJS.Graphic3D.prototype.getFamilyValues = function() {
    evaluator = this.evaluator;
    expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   *
   */
  descartesJS.Graphic3D.prototype.buildFamilyPrimitives = function() {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the last value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // build the primitives of the family
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

        this.familyValue = this.familyInf+(i*this.family_sep);

        // if the condition to draw is true then update and draw the graphic
        if ( evaluator.evalExpression(this.drawif) ) {
          this.buildPrimitives();
        }
      }
    }

    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Update the 3D graphic
   */
  descartesJS.Graphic3D.prototype.update = function() {
    this.primitives = [];

    if (this.evaluator.evalExpression(this.drawif)) {
      // build the primitives of the family
      if (this.family) {
        this.buildFamilyPrimitives();
      }
      // build the primitives of a single object
      else {
        this.buildPrimitives();
      }
    }
  }  

  /**
   *
   */
  descartesJS.Graphic3D.prototype.updateMVMatrix = function() {
    tmpExpr = this.evaluator.evalExpression(this.inirot);
    if (this.inirotEuler) {
      this.inirotM = this.inirotM.setIdentity();
      this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
      this.inirotM = this.inirotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
      this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }
    else {
      this.inirotM_X = this.inirotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
      this.inirotM_Y = this.inirotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
      this.inirotM_Z = this.inirotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.inipos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.iniposM = this.iniposM.setIdentity().translate(translate);

    tmpExpr = this.evaluator.evalExpression(this.endrot);
    if (this.endrotEuler) {
      this.endrotM = this.endrotM.setIdentity();
      this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
      this.endrotM = this.endrotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
      this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }
    else {
      this.endrotM_X = this.endrotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
      this.endrotM_Y = this.endrotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
      this.endrotM_Z = this.endrotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.endpos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.endposM = this.endposM.setIdentity().translate(translate);
  }

  /** 
   *
   */
   descartesJS.Graphic3D.prototype.transformVertex = function(v) {
    if (this.macroChildren) {
      v = this.applyMacroTransform(v)
    }

    if (this.inirotEuler) {
      tmpVertex = this.inirotM.multiplyVector4(v);
    }
    else {
      tmpVertex = this.inirotM_X.multiplyVector4(v);
      tmpVertex = this.inirotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.inirotM_Z.multiplyVector4(tmpVertex);      
    }

    tmpVertex = this.iniposM.multiplyVector4(tmpVertex);

    if (this.endrotEuler) {
      tmpVertex = this.endrotM.multiplyVector4(tmpVertex);
    }
    else {
      tmpVertex = this.endrotM_X.multiplyVector4(tmpVertex);
      tmpVertex = this.endrotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.endrotM_Z.multiplyVector4(tmpVertex);
    }

    tmpVertex = this.endposM.multiplyVector4(tmpVertex);

    return tmpVertex;
   }

  /** 
   *
   */
   descartesJS.Graphic3D.prototype.applyMacroTransform = function(v) {
    if (this.macro_inirotEuler) {
      tmpVertex = this.macro_inirotM.multiplyVector4(v);
    }
    else {
      tmpVertex = this.macro_inirotM_X.multiplyVector4(v);
      tmpVertex = this.macro_inirotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.macro_inirotM_Z.multiplyVector4(tmpVertex);      
    }

    tmpVertex = this.macro_iniposM.multiplyVector4(tmpVertex);

    if (this.macro_endrotEuler) {
      tmpVertex = this.macro_endrotM.multiplyVector4(tmpVertex);
    }
    else {
      tmpVertex = this.macro_endrotM_X.multiplyVector4(tmpVertex);
      tmpVertex = this.macro_endrotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.macro_endrotM_Z.multiplyVector4(tmpVertex);
    }

    tmpVertex = this.macro_endposM.multiplyVector4(tmpVertex);

    return tmpVertex;
   }

  /**
   *
   */
  descartesJS.Graphic3D.prototype.parseExpression = function() {
    tmpExpr = this.expresion.split("=");
    tmpExpr2 = tmpExpr[0];
    tmpExpr3 = [];

    for (var i=1; i<tmpExpr.length; i++) {
      tmpExpr2 += "=";

      lastIndexOfSpace = tmpExpr[i].lastIndexOf(" ");

      tmpExpr2 += (lastIndexOfSpace !== -1) ? tmpExpr[i].substring(0, lastIndexOfSpace) : tmpExpr[i];
     
      tmpExpr3.push( this.evaluator.parser.parse(tmpExpr2, true) );

      tmpExpr2 = tmpExpr[i].substring(lastIndexOfSpace+1);
    }

    return tmpExpr3;
  }

  var tmpPrimitives;

  /**
   *
   */
  descartesJS.Graphic3D.prototype.splitFace = function(g) {
    for (var i=0, l=this.primitives.length; i<l; i++) {
      tmpPrimitives = [];

      // if the primitive is a face then try to cut the other primitives faces
      if (this.primitives[i].type === "face") {

        for (var j=0, k=g.primitives.length; j<k; j++) {
          // the primitives of g are splited and added to an array
          if (g.primitives[j].type === "face") {
            tmpPrimitives = tmpPrimitives.concat( this.primitives[i].splitFace(g.primitives[j]) );
          }
          // if the primitive is not a face, then do not split it
          else {
            tmpPrimitives.push( g.primitives[j] );
          }
        }

        g.primitives = tmpPrimitives;
      }
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var evaluator;
  var expr;
  var exprX;
  var exprY;
  var exprZ;
  
  /**
   * A Descartes 3D point
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Point3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point3D, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the point
   */
  descartesJS.Point3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    // do not apply the rotations in the model view matrix transformation
    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);
    exprX = expr[0][0];
    exprY = expr[0][1];
    exprZ = expr[0][2];

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
                               type: "vertex",
                               backColor: this.backcolor, 
                               frontColor: this.color, 
                               size: evaluator.evalExpression(this.width)
                             } ) );

    // add a text primitive only if the text has content
    if (this.text !== "") {
      this.primitives.push( new descartesJS.Primitive3D( { vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
                                 type: "text",
                                 frontColor: this.color, 
                                 font: this.font,
                                 decimals: evaluator.evalExpression(this.decimals),
                                 fixed: this.fixed,
                                 displace: this.fontSize,
                                 evaluator: evaluator,
                                 text: this.text,
                                 family: this.family,
                                 familyValue: this.familyValue
                               } ) );
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;

  /**
   * A Descartes 3D segment
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Segment3D = function(parent, values) {

    this.width = parent.evaluator.parser.parse("1");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment3D, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the segment
   */
  descartesJS.Segment3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    // do not apply the rotations in the model view matrix transformation
    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);
    v1_x = expr[0][0];
    v1_y = expr[0][1];
    v1_z = expr[0][2];

    v2_x = expr[1][0];
    v2_y = expr[1][1];
    v2_z = expr[1][2];

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [ this.transformVertex( new descartesJS.Vector4D(v1_x, v1_y, v1_z, 1) ),
                                           this.transformVertex( new descartesJS.Vector4D(v2_x, v2_y, v2_z, 1) )
                                         ],
                               type: "edge",
                               frontColor: this.color, 
                               lineWidth: evaluator.evalExpression(this.width)
                             } ) );

  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tempParamU;
  var tempParamV;
  var tempParamX;
  var tempParamY;
  var tempParamZ;
  var Nu;
  var Nv;
  var vertices;
  var v;

  /**
   * A Descartes 3D surface
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the surface
   */
  descartesJS.Surface3D = function(parent, values) {
    /**
     * the parameter name for a curve
     * type {String}
     * @private
     */
    this.parameter = "t";

    /**
     * the interval of the curve parameter
     * type {Node}
     * @private
     */
    this.parameter_interval = parent.evaluator.parser.parse("[0,1]");

    /**
     * the number of steps of the curve parameter
     * type {Node}
     * @private
     */
    this.parameter_steps = parent.evaluator.parser.parse("8");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    this.expresion = this.parseExpression();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Surface3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the surface
   */
  descartesJS.Surface3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    // store the u and v parameter values
    tempParamV = evaluator.getVariable("x");
    tempParamV = evaluator.getVariable("y");
    tempParamV = evaluator.getVariable("z");
    tempParamU = evaluator.getVariable("u");
    tempParamV = evaluator.getVariable("v");

    evaluator.setVariable("u", 0);
    evaluator.setVariable("v", 0);
    Nu = evaluator.evalExpression(this.Nu);
    Nv = evaluator.evalExpression(this.Nv);

    // array to store the computed vertices 
    vertices = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      for (var vi=0; vi<=Nv; vi++) {
        evaluator.setVariable("v", vi/Nv);

        // eval all the subterms in the expression
        for (var ii=0, ll=this.expresion.length; ii<ll; ii++) {
          evaluator.evalExpression(this.expresion[ii]);
        }

        vertices.push( this.transformVertex(new descartesJS.Vector4D(evaluator.getVariable("x"), evaluator.getVariable("y"), evaluator.getVariable("z"), 1)) );
      }
    }

    for (var ui=0; ui<Nu; ui++) {
      for (var vi=0; vi<Nv; vi++) {
        v = [];
        v.push(vertices[vi + ui*Nv + ui]);
        v.push(vertices[vi+1 + ui*Nv + ui]);
        v.push(vertices[vi+2 + (ui+1)*Nv  + ui]);
        v.push(vertices[vi+1 + (ui+1)*Nv  + ui]);

        this.primitives.push( new descartesJS.Primitive3D( { vertices: v,
                                   type: "face",
                                   frontColor: this.color, 
                                   backColor: this.backcolor,
                                   edges: this.edges, 
                                   model: this.model
                                 } ) );

      }
    }

    evaluator.setVariable("x", tempParamX);
    evaluator.setVariable("y", tempParamY);
    evaluator.setVariable("z", tempParamZ);
    evaluator.setVariable("u", tempParamU);
    evaluator.setVariable("v", tempParamV);
  }  

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;  

  /**
   * A Descartes 3D polyline
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the polygon
   */
  descartesJS.Polygon3D = function(parent, values) {

    this.width = parent.evaluator.parser.parse("1");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the polygon
   */
  descartesJS.Polygon3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    // do not apply the rotations in the model view matrix transformation
    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);

    for (var i=0, l=expr.length-1; i<l; i++) {
      v1_x = expr[i][0];
      v1_y = expr[i][1];
      v1_z = expr[i][2];

      v2_x = expr[i+1][0];
      v2_y = expr[i+1][1];
      v2_z = expr[i+1][2];

      this.primitives.push( new descartesJS.Primitive3D( { vertices: [ this.transformVertex( new descartesJS.Vector4D(v1_x, v1_y, v1_z, 1) ),
                                             this.transformVertex( new descartesJS.Vector4D(v2_x, v2_y, v2_z, 1) )
                                           ],
                                 type: "edge",
                                 frontColor: this.color, 
                                 lineWidth: evaluator.evalExpression(this.width)
                               } ) );

    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var vertices;
  var Nu;
  var tempParamU;
  var tempParamX;
  var tempParamY;
  var tempParamZ;  

  /**
   * A Descartes 3D curve
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the curve
   */
  descartesJS.Curve3D = function(parent, values) {
    this.width = parent.evaluator.parser.parse("1");

    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);
    
    this.expresion = this.parseExpression();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the curve
   */
  descartesJS.Curve3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    // store the u and v parameter values
    tempParamX = evaluator.getVariable("x");
    tempParamY = evaluator.getVariable("y");
    tempParamZ = evaluator.getVariable("z");
    tempParamU = evaluator.getVariable("u");

    evaluator.setVariable("u", 0);
    Nu = evaluator.evalExpression(this.Nu);

    vertices = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      // eval all the subterms in the expression
      for (var ii=0, ll=this.expresion.length; ii<ll; ii++) {
        evaluator.evalExpression(this.expresion[ii]);
      }

      vertices.push( this.transformVertex(new descartesJS.Vector4D(evaluator.getVariable("x"), evaluator.getVariable("y"), evaluator.getVariable("z"), 1)) );
    }

    for (var i=0, l=vertices.length-1; i<l; i++) {
      this.primitives.push( new descartesJS.Primitive3D( { vertices: [ vertices[i], vertices[i+1] ],
                                 type: "edge",
                                 frontColor: this.color, 
                                 lineWidth: evaluator.evalExpression(this.width)
                               } ) );
    }

    evaluator.setVariable("x", tempParamX);
    evaluator.setVariable("y", tempParamZ);
    evaluator.setVariable("z", tempParamY);
    evaluator.setVariable("u", tempParamU);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;
  var v3_x;
  var v3_y;
  var v3_z;

  /**
   * A Descartes 3D triangle
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Triangle3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Triangle3D, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the triangle
   */
  descartesJS.Triangle3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);
    v1_x = expr[0][0];
    v1_y = expr[0][1];
    v1_z = expr[0][2];

    v2_x = expr[1][0];
    v2_y = expr[1][1];
    v2_z = expr[1][2];

    v3_x = expr[2][0];
    v3_y = expr[2][1];
    v3_z = expr[2][2];

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [ this.transformVertex( new descartesJS.Vector4D(v1_x, v1_y, v1_z, 1) ),
                                                                     this.transformVertex( new descartesJS.Vector4D(v3_x, v3_y, v3_z, 1) ),
                                                                     this.transformVertex( new descartesJS.Vector4D(v2_x, v2_y, v2_z, 1) )
                                                                   ],
                                                         type: "face",
                                                         frontColor: this.color,
                                                         backColor: this.backcolor, 
                                                         edges: this.edges, 
                                                         model: this.model
                                                       } ) );

  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;
  var vertices;

  /**
   * A Descartes 3D face
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Face3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Face3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the face
   */
  descartesJS.Face3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);

    vertices = [];

    for (var i=expr.length-1; i>=0; i--) {
      vertices.push( this.transformVertex(new descartesJS.Vector4D(expr[i][0], expr[i][1], expr[i][2], 1)) );
    }

    this.primitives.push( new descartesJS.Primitive3D( { vertices: vertices,
                               type: "face",
                               frontColor: this.color, 
                               backColor: this.backcolor, 
                               edges: this.edges, 
                               model: this.model
                             } ) );

  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var Nu;
  var vertices;
  var w;
  var l;
  var theta;

  /**
   * A Descartes 3D regular polygon
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Polireg3D = function(parent, values) {
    this.width = parent.evaluator.parser.parse("2");
    this.length = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polireg3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the regular polygon
   */
  descartesJS.Polireg3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    Nu = evaluator.evalExpression(this.Nu);

    vertices = [this.transformVertex( new descartesJS.Vector4D(0, 0, 0, 1) )];
    w = evaluator.evalExpression(this.width)/2;
    l = evaluator.evalExpression(this.length)/2;
    theta = (2*Math.PI) / Nu;

    for (var i=0; i<Nu; i++) {
      vertices.push ( this.transformVertex( new descartesJS.Vector4D(w*Math.cos(theta*i), l*Math.sin(theta*i), 0, 1) ) );
    }

    for (var i=0; i<Nu; i++) {
      this.primitives.push( new descartesJS.Primitive3D( { vertices: [ vertices[0],
                                             (i+2 <= Nu) ? vertices[i+2] : vertices[1],
                                             vertices[i+1]
                                           ],
                                 type: "face",
                                 frontColor: this.color, 
                                 backColor: this.backcolor, 
                                 edges: this.edges, 
                                 model: this.model
                               } ) );
    }

  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var exprX;
  var exprY;
  var exprZ;

  /**
   * A Descartes 3D text
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Text3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the point
   */
  descartesJS.Text3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    exprX = expr[0][0];
    exprY = expr[0][1];
    exprZ = 0;

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [new descartesJS.Vector4D(exprX, exprY, exprZ, 1)],
                               type:"text",
                               frontColor: this.color,
                               font: this.font,
                               decimals: evaluator.evalExpression(this.decimals),
                               fixed: this.fixed,
                               displace: 0,
                               isText: true,
                               evaluator: evaluator,
                               text: this.text,
                               family: this.family,
                               familyValue: this.familyValue
                             } ) );

  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var reservedIdentifiers = "-rnd-pi-e-sqr-sqrt-raíz-exp-log-log10-abs-ent-sgn-ind-sin-sen-cos-tan-cot-sec-csc-sinh-senh-cosh-tanh-coth-sech-csch-asin-asen-acos-atan-min-max-";
  var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg)/gi;
  var thisGraphics_i;
  var thisGraphicsNext;

  /**
   * A Descartes macro
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the macro
   */
  descartesJS.Macro3D = function(parent, values) {
    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    this.expresion = undefined;

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.inirot = "(0,0,0)";
    this.inirotEuler = false;
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.inipos = parent.evaluator.parser.parse("(0,0,0)");

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.endrot = "(0,0,0)";
    this.endrotEuler = false;

    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.endpos = parent.evaluator.parser.parse("(0,0,0)");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    // euler rotations
    if (this.inirot.match("Euler")) {
      this.inirot = this.inirot.replace("Euler", "");
      this.inirotEuler = true;
    }
    if (this.endrot.match("Euler")) {
      this.endrot = this.endrot.replace("Euler", "");
      this.endrotEuler = true;
    }

    this.inirot = this.evaluator.parser.parse(this.inirot);
    this.endrot = this.evaluator.parser.parse(this.endrot);

    // auxiliary matrices
    this.inirotM   = new descartesJS.Matrix4x4();
    this.inirotM_X = new descartesJS.Matrix4x4();
    this.inirotM_Y = new descartesJS.Matrix4x4();
    this.inirotM_Z = new descartesJS.Matrix4x4();
    this.iniposM   = new descartesJS.Matrix4x4();

    this.endrotM   = new descartesJS.Matrix4x4();
    this.endrotM_X = new descartesJS.Matrix4x4();
    this.endrotM_Y = new descartesJS.Matrix4x4();
    this.endrotM_Z = new descartesJS.Matrix4x4();
    this.endposM   = new descartesJS.Matrix4x4();


    this.graphics = [];
    
    var lessonParser = parent.lessonParser;
    var tokenizer = new descartesJS.Tokenizer();
    
    // if the expression is empty
    if (this.expresion == undefined) {
      return;
    }

    // if the macro name was not specified as a string, then adds single quotes to turn it into string
    if ( !(this.expresion.charAt(0) === "'")) {
      this.expresion = "'" + this.expresion + "'";
    }
    this.expresion = this.evaluator.parser.parse(this.expresion);

    var filename = this.evaluator.evalExpression(this.expresion);
    var response;
    
    if (filename) {
      // the macro is embeded in the webpage
      var macroElement = document.getElementById(filename);

      if ((macroElement) && (macroElement.type == "descartes/macro")) {
        response = macroElement.text;
      }

      // the macro is in an external file
      else {
        response = descartesJS.openExternalFile(filename);
        
        // verify the content is a Descartes macro
        if ( (response) && (!response.match(/tipo_de_macro/g)) ) {
          response = null;
        }
      }
    }

    var indexOfEqual;
    var tmpIniti;
    var tmpResponse;

    // if it was posible to read the macro
    if (response) {
      tmpResponse = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

      // maintain only the lines that have information for the macro
      response = [];

      for(var i=0, l=tmpResponse.length; i<l; i++) {
        indexOfEqual = tmpResponse[i].indexOf("=");

        if(indexOfEqual !== -1) {
          tmpIniti = tmpResponse[i].substring(0, indexOfEqual);
        
          if (babel[tmpIniti] === "id" || babel[tmpIniti] === "type") {
            response.push( lessonParser.split( tmpResponse[i] ) );
          }
        }
      }
      
      var respText;
      var babelResp;
      var dotIndex;
      var tmpTokens;
      var tmpTokensRespText;
      var isID;

      // add the macro name as a prefix, only in some expressions
      for (var i=0, l=response.length; i<l; i++) {
        respText = response[i] || [];

        isID = ((respText) && (respText[0]) && (respText[0][0] === "id"));

        for (var j=0, k=respText.length; j<k; j++) {
          // if the parameters that have a dot
          dotIndex = respText[j][0].indexOf(".");
          if ((dotIndex !== -1) && (!isID)) {
            babelResp = babel[respText[j][0].substring(dotIndex+1)];
            respText[j][0] = this.name + "." + respText[j][0];
          }
          else {
            babelResp = babel[respText[j][0]];
          }

          // if the expressions are different from this, then the cycle continues and is not replaced nothing          
          if ( (babelResp === "font") ||
               (((babelResp === "fill") || (babelResp === "color") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
               ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
               ((babelResp !== "id") && (babel[respText[j][1]] !== undefined)) 
             ) {
            continue;
          }
          
          // is a text
          if (babelResp == "text") {
            // if the text is rtf must processing it diferent
            if (respText[j][1].match(/\{\\rtf1/)) {
              var textTemp = respText[j][1];
 
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var self = this;

              // function to replace expresions
              var funReplace = function(str, m1) {
                var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
                
                for (var t=0, lt=tokens.length; t<lt; t++) {
                  if ((tokens[t].type == "identifier")  && (!reservedIdentifiers.match("-" + tokens[t].value + "-"))) {
                    tokens[t].value = self.name + "." + tokens[t].value;
                  }
                }
                
                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
              textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              
              respText[j][1] = textTemp;
            }
            // simple text
            else {
              tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacro3Ds;

              for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                  if ((tmpTokens[tt].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[tt].value + "-"))) {
                    tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                  }
                }
                tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");

                tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
              }

              respText[j][1] = tmpTokensRespText.join("");
            }
          }
          // the token is not a text
          else {
            tmpTokens = tokenizer.tokenize(respText[j][1]);

            for (var t=0, lt=tmpTokens.length; t<lt; t++) {
              if ((tmpTokens[t].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[t].value + "-"))) {
                tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
              }
            }

            respText[j][1] = tokenizer.flatTokens(tmpTokens);
          }
        }
      }

      var tempResp;
      var isGraphic;

      // flat the expresions to obtain a string
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i][0]) {
          tempResp = "";
          isGraphic = false;

          for (var j=0, k=response[i].length; j<k; j++) {

            // if is a graphic object, add the corresponding space
            if (babel[response[i][j][0]] === "type") {
              tempResp = "espacio='" + this.spaceID + "' ";
              isGraphic = true;
            }

            tempResp = tempResp + response[i][j][0] + "='" + response[i][j][1] + "' ";
          }

          response[i] = tempResp;

          // build and add the graphic elements to the space
          if (isGraphic) {
            this.graphics.push( lessonParser.parse3DGraphic(response[i], this.abs_coord, this.background, this.inirot) );
          } 
          // build and add the axiliaries to the scene
          else {
            lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }

    for (var i=0, l=this.graphics.length; i<l; i++) {
      this.graphics[i].macroChildren = true;
    }

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Macro3D, descartesJS.Graphic);
    
  /**
   * Update the macro
   */
  descartesJS.Macro3D.prototype.update = function() {
    this.updateTransformation();

    if (this.inipos) {
      var expr = this.evaluator.evalExpression(this.inipos);
      this.iniPosX = expr[0][0];
      this.iniPosY = expr[0][1];
    }

    this.primitives = [];

    for (var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      thisGraphics_i.macro_inirotEuler = this.inirotEuler;
      thisGraphics_i.macro_inirotM = this.inirotM;
      thisGraphics_i.macro_inirotM_X = this.inirotM_X;
      thisGraphics_i.macro_inirotM_Y = this.inirotM_Y;
      thisGraphics_i.macro_inirotM_Z = this.inirotM_Z;

      thisGraphics_i.macro_iniposM = this.iniposM;

      thisGraphics_i.macro_endrotEuler = this.endrotEuler;
      thisGraphics_i.macro_endrotM = this.endrotM;
      thisGraphics_i.macro_endrotM_X = this.endrotM_X;
      thisGraphics_i.macro_endrotM_Y = this.endrotM_Y;
      thisGraphics_i.macro_endrotM_Z = this.endrotM_Z;

      thisGraphics_i.macro_endposM = this.endposM;

      thisGraphics_i.update();      
    }

    // split the primitives if needed
    for (var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if ((thisGraphics_i.split) || (this.split)) {
        for (var j=i+1; j<l; j++) {
          thisGraphicsNext = this.graphics[j];

          if ((thisGraphicsNext.split) || (this.split)) {
            thisGraphics_i.splitFace(thisGraphicsNext);
          }
        }
      }

      this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
    }
  }

  /**
   *
   */
  descartesJS.Macro3D.prototype.updateTransformation = function() {
    tmpExpr = this.evaluator.evalExpression(this.inirot);
    if (this.inirotEuler) {
      this.inirotM = this.inirotM.setIdentity();
      this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
      this.inirotM = this.inirotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
      this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }
    else {
      this.inirotM_X = this.inirotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
      this.inirotM_Y = this.inirotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
      this.inirotM_Z = this.inirotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.inipos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.iniposM = this.iniposM.setIdentity().translate(translate);

    tmpExpr = this.evaluator.evalExpression(this.endrot);
    if (this.endrotEuler) {
      this.endrotM = this.endrotM.setIdentity();
      this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
      this.endrotM = this.endrotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
      this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }
    else {
      this.endrotM_X = this.endrotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
      this.endrotM_Y = this.endrotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
      this.endrotM_Z = this.endrotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.endpos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.endposM = this.endposM.setIdentity().translate(translate);
  }
  
  /**
   * Auxiliary function for draw a macro
   * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
   */
  descartesJS.Macro3D.prototype.drawAux = function(ctx) { }

  return descartesJS;
})(descartesJS || {}, babel);/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSin = Math.sin;
  var MathCos = Math.cos;
  var MathPI  = Math.PI;
  var Math2PI = 2*MathPI;

  var vec4D;

  var evaluator;
  var width;
  var height;
  var length;
  var Nu;
  var Nv;
  var v;
  var x;
  var y;
  var z;
  var theta;
  var phi;

  var goldenRatio = 1.6180339887;
  var width_d_goldenRatio;
  var width_m_goldenRatio;

  var tmpMatrix;

  var currentLine;
  var tempValue;
  var tempFace;

  /**
   * A Descartes 3D face
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.OtherGeometry = function(parent, values) {
    this.width = parent.evaluator.parser.parse("2");
    this.height = parent.evaluator.parser.parse("2");
    this.length = parent.evaluator.parser.parse("2");

    vec4D = descartesJS.Vector4D;

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    switch (this.type) {
      case("cube"):
        this.buildGeometry = buildCube;
        break;

      case("box"):
        this.buildGeometry = buildBox;
        break;

      case("tetrahedron"):
        this.buildGeometry = buildTetrahedron;
        break;

      case("octahedron"):
        this.buildGeometry = buildOctahedron;
        break;

      case("sphere"):
        this.isSphere = true;
      case("ellipsoid"):      
        this.buildGeometry = buildSphere;
        break;

      case("dodecahedron"):
        this.buildGeometry = buildDodecahedron;
        break;

      case("icosahedron"):
        this.buildGeometry = buildIcosahedron;
        break;

      case("cone"):
        this.buildGeometry = buildCone;
        break;

      case("cylinder"):
        this.buildGeometry = buildCylinder;
        break;

      case("mesh"):
        this.fileData = descartesJS.openExternalFile(this.evaluator.evalExpression(this.file)).split(/\r/);
        this.buildGeometry = buildMesh;
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OtherGeometry, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the face
   */
  descartesJS.OtherGeometry.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    this.buildGeometry(evaluator.evalExpression(this.width), evaluator.evalExpression(this.height), evaluator.evalExpression(this.length), evaluator.evalExpression(this.Nu), evaluator.evalExpression(this.Nv));

    for (var i=0, l=this.faces.length; i<l; i++) {
      v = [];
      for (var j=0, k=this.faces[i].length; j<k; j++) {
        v.push( this.transformVertex(this.vertices[this.faces[i][j]]) );
      }

      this.primitives.push( new descartesJS.Primitive3D( { vertices: v,
                                type: "face",
                                frontColor: this.color,
                                backColor: this.backcolor, 
                                edges: this.edges, 
                                model: this.model
                              } ) );
    }

  }

  /**
   * Define the vertex and faces of the cube
   */
  function buildCube(width, height, length, Nu, Nv) {
    buildBox.call(this, width/1.8, width/1.8, width/1.8, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the box
   */
  function buildBox(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D( width,  length,  height, 1), //0
                      new vec4D( width, -length,  height, 1), //1
                      new vec4D( width,  length, -height, 1), //2
                      new vec4D( width, -length, -height, 1), //3
                      new vec4D(-width,  length,  height, 1), //4
                      new vec4D(-width, -length,  height, 1), //5
                      new vec4D(-width,  length, -height, 1), //6
                      new vec4D(-width, -length, -height, 1)  //7
               ];
    // this.vertices = [ { x:  width, y:  length, z: height, 1 },
    //                   { x:  width, y: -length, z: height, 1 },
    // ]

    this.faces = [[2, 3, 1, 0], [1, 5, 4, 0], [5, 7, 6, 4], [6, 7, 3, 2], [4, 6, 2, 0], [3, 7, 5, 1]];

    this.updateValues(width, height, length, Nu, Nv);

  }

  /**
   * Define the vertex and faces of the tetrahedron
   */
  function buildTetrahedron(width, height, length, Nu, Nv) {
    width = width/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D(          0,           0,       width, 1), //0
                      new vec4D(-0.49*width, -0.86*width, -0.32*width, 1), //1
                      new vec4D(-0.49*width,  0.86*width, -0.32*width, 1), //2
                      new vec4D(    1*width,           0, -0.32*width, 1)  //3
               ];

    this.faces = [[3, 2, 1], [1, 2, 0], [2, 3, 0], [3, 1, 0]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the octahedron
   */
  function buildOctahedron(width, height, length, Nu, Nv) {
    width = width/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D( 0,          0,  width, 1), //0
                      new vec4D( width,      0,      0, 1), //1
                      new vec4D(-width,      0,      0, 1), //2
                      new vec4D( 0,      width,      0, 1), //3
                      new vec4D( 0,     -width,      0, 1), //4
                      new vec4D( 0,          0, -width, 1)  //5
               ];

    this.faces = [[3, 1, 0], [2, 3, 0], [1, 4, 0], [4, 2, 0], [1, 3, 5], [3, 2, 5], [4, 1, 5], [2, 4, 5]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the dodecahedron
   */
  function buildDodecahedron(width, height, length, Nu, Nv) {
    width = width/3.4;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    width_d_goldenRatio = width/goldenRatio;
    width_m_goldenRatio = width*goldenRatio;

    this.vertices = [ new vec4D( width,  width,  width, 1), //0
                      new vec4D( width,  width, -width, 1), //1
                      new vec4D( width, -width,  width, 1), //2
                      new vec4D( width, -width, -width, 1), //3
                      new vec4D(-width,  width,  width, 1), //4
                      new vec4D(-width,  width, -width, 1), //5
                      new vec4D(-width, -width,  width, 1), //6
                      new vec4D(-width, -width, -width, 1), //7

                      new vec4D(0,  width_d_goldenRatio,  width_m_goldenRatio, 1), //8
                      new vec4D(0,  width_d_goldenRatio, -width_m_goldenRatio, 1), //9
                      new vec4D(0, -width_d_goldenRatio,  width_m_goldenRatio, 1), //10
                      new vec4D(0, -width_d_goldenRatio, -width_m_goldenRatio, 1), //11

                      new vec4D( width_d_goldenRatio,  width_m_goldenRatio, 0, 1), //12
                      new vec4D( width_d_goldenRatio, -width_m_goldenRatio, 0, 1), //13
                      new vec4D(-width_d_goldenRatio,  width_m_goldenRatio, 0, 1), //14
                      new vec4D(-width_d_goldenRatio, -width_m_goldenRatio, 0, 1), //15

                      new vec4D( width_m_goldenRatio, 0,  width_d_goldenRatio, 1), //16
                      new vec4D( width_m_goldenRatio, 0, -width_d_goldenRatio, 1), //17
                      new vec4D(-width_m_goldenRatio, 0,  width_d_goldenRatio, 1), //18
                      new vec4D(-width_m_goldenRatio, 0, -width_d_goldenRatio, 1)  //19
               ];

    // tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotate(-MathPI/6, new descartesJS.Vector3D(0, 1, 0));
    tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotateY(-MathPI/6);
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.vertices[i] = tmpMatrix.multiplyVector4(this.vertices[i]);
    }

    this.faces = [[0, 16, 2, 10, 8], [12, 1, 17, 16, 0], [8, 4, 14, 12, 0], [2, 16, 17, 3, 13], [13, 15, 6, 10, 2], [6, 18, 4, 8, 10], [3, 17, 1, 9, 11], [13, 3, 11, 7, 15], [1, 12, 14, 5, 9], [11, 9, 5, 19, 7], [5, 14, 4, 18, 19], [6, 15, 7, 19, 18]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the icosahedron
   */
  function buildIcosahedron(width, height, length, Nu, Nv) {
    width = width/4;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    width_m_goldenRatio = width*goldenRatio;

    this.vertices = [ new vec4D(0,  width,  width_m_goldenRatio, 1), //0
                      new vec4D(0,  width, -width_m_goldenRatio, 1), //1
                      new vec4D(0, -width,  width_m_goldenRatio, 1), //2
                      new vec4D(0, -width, -width_m_goldenRatio, 1), //3

                      new vec4D( width,  width_m_goldenRatio, 0, 1), //4
                      new vec4D( width, -width_m_goldenRatio, 0, 1), //5
                      new vec4D(-width,  width_m_goldenRatio, 0, 1), //6
                      new vec4D(-width, -width_m_goldenRatio, 0, 1), //7

                      new vec4D( width_m_goldenRatio, 0,  width, 1), //8
                      new vec4D( width_m_goldenRatio, 0, -width, 1), //9
                      new vec4D(-width_m_goldenRatio, 0,  width, 1), //10
                      new vec4D(-width_m_goldenRatio, 0, -width, 1)  //11
                    ];

    this.faces = [[10, 0, 2], [0, 8, 2], [8, 5, 2], [5, 7, 2], [7, 10, 2], 
                  [6, 0, 10], [11, 6, 10], [7, 11, 10], [7, 3, 11], [5, 3, 7], [9, 3, 5], [8, 9, 5], [4, 9, 8], [0, 4, 8], [6, 4, 0],
                  [11, 3, 1], [6, 11, 1], [4, 6, 1], [9, 4, 1], [3, 9, 1]];

    // tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotate(-1.029, new descartesJS.Vector3D(0, 1, 0));
    tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotateY(-1.029);
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.vertices[i] = tmpMatrix.multiplyVector4(this.vertices[i]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }  

  /**
   * Define the vertex and faces of the sphere
   */
  function buildSphere(width, height, length, Nu, Nv) {
    width = width/2;

    if (this.isSphere) {
      height = width;
      length = width;
    }
    else {
      height = height/2;
      length = length/2;
    }

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }
    
    this.vertices = [new vec4D(0, 0, height, 1)];

    for (var i=1; i<Nu; i++) {
      phi = (i*MathPI)/Nu;
      for (var j=0; j<Nv; j++) {
        theta = (j*Math2PI)/Nv;

        x = width  * MathSin(phi) * MathCos(theta);
        y = length * MathSin(phi) * MathSin(theta);
        z = height * MathCos(phi);

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }
    this.vertices.push(new vec4D(0, 0, -height, 1));

    this.faces = [];
    // upper part
    for (var i=0; i<Nv; i++) {
      this.faces.push([0, ((i+1)%Nv)+1, (i%Nv)+1]);
    }

    // center part
    for (var i=1; i<Nu-1; i++) {
      for (var j=0; j<Nv; j++) {
        this.faces.push([ j+1 +(i-1)*Nv, 
                         (j+1)%Nv +1 +(i-1)*Nv, 
                         (j+1)%Nv +1 +i*Nv,
                         j+1 +i*Nv
                        ]);
      }
    }

    // lower part
    for (var i=0; i<Nv; i++) {
      this.faces.push([this.vertices.length-1, this.vertices.length-1-Nv +i, this.vertices.length-1-Nv +((i+1)%Nv)]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the cone
   */
  function buildCone(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [];

    for (var i=0; i<Nv; i++) {
      for (var j=0; j<Nu; j++) {
        x = width  * (Nv-i)/Nv * MathCos(j*Math2PI/Nu);
        y = length * (Nv-i)/Nv * MathSin(j*Math2PI/Nu);
        z = height -i*2*height/Nv;

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }
    this.vertices.push(new vec4D(0, 0, -height, 1))

    this.faces = [];

    for (var i=0; i<Nv-1; i++) {
      for (var j=0; j<Nu; j++) {
        this.faces.push( [j +i*Nu, 
                          (j+1)%Nu +i*Nu,
                          (j+1)%Nu +(i+1)*Nu,
                          j +(i+1)*Nu
                         ]
                       );
      }
    }

    // punta
    for (var i=0; i<Nu; i++) {
      this.faces.push([this.vertices.length-1, this.vertices.length-1 -Nu +i, this.vertices.length-1 -Nu +(i+1)%Nu]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the cone
   */
  function buildCylinder(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [];

    for (var i=0; i<Nv+1; i++) {
      for (var j=0; j<Nu; j++) {
        x = width  * MathCos(j*Math2PI/Nu);
        y = length * MathSin(j*Math2PI/Nu);
        z = height -i*2*height/Nv;

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }

    this.faces = [];

    for (var i=0; i<Nv; i++) {
      for (var j=0; j<Nu; j++) {
        this.faces.push( [j +i*Nu, 
                          (j+1)%Nu +i*Nu, 
                          (j+1)%Nu +(i+1)*Nu,
                          j +(i+1)*Nu
                         ]
                       );
      }
    }

    this.updateValues(width, height, length, Nu, Nv);
  }
  
  /**
   * Define the vertex and faces of a mesh
   */
  function buildMesh() {
    this.vertices = [];
    this.faces = [];

    function toInt(x) { return parseInt(x); };
    function toFloat(x) { return parseFloat(x); };

    for (var i=0, l=this.fileData.length; i<l; i++) {
      currentLine = this.fileData[i];
      
      if (currentLine.match(/^V\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toFloat);
        this.vertices.push( new vec4D(tempValue[0] || 0, tempValue[1] || 0, tempValue[2] || 0, 1) );
      }

      else if (currentLine.match(/^F\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toInt);
        this.faces.push(tempValue.reverse());
      }
    }
  }

  /**
   *
   */
  descartesJS.OtherGeometry.prototype.changeGeometry = function(width, height, length, Nu, Nv) {
    return (this.oldWidth  === width) && (this.oldHeight === height) && (this.oldLength === length) && (this.oldNu === Nu) && (this.oldNv === Nv);
  }

  /**
   *
   */
  descartesJS.OtherGeometry.prototype.updateValues = function(width, height, length, Nu, Nv) {
    this.oldWidth = width;
    this.oldHeight = height;
    this.oldLength = length;
    this.oldNv = Nv;
    this.oldNu = Nu;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathMax = Math.max;
  var MathMin = Math.min;
  var MathPI = Math.PI;
  var MathCos = Math.cos;
  var MathSin = Math.sin;
  var MathAbs = Math.abs;
  var aux;
  var q;
  var p;
  var s;
  var t;
  var cost;
  var sint;

  var A11;
  var A12;
  var B1;
  var A21;
  var A22;
  var B2;
    
  var mp;
  var Mp;
  var mq;
  var Mq;
  var Det;

  /**
   * Descartes R2
   * @constructor 
   * @param {Number} x the x position
   * @param {Number} y the y position
   */
  descartesJS.R2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  descartesJS.R2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  descartesJS.R2.prototype.copy = function() {
    return new descartesJS.R2(this.x, this.y);
  }
  
  descartesJS.R2.prototype.ix = function() {
    return Math.round(MathMax(MathMin(this.x, 32000), -32000));
  }

  descartesJS.R2.prototype.iy = function() {
    return Math.round(MathMax(MathMin(this.y, 32000), -32000));
  }

  descartesJS.R2.prototype.equals = function(p) {
    return ((this.x == p.x) && (this.y == p.y)); 
  }

  descartesJS.R2.prototype.norm2 = function() {
    return this.x*this.x + this.y*this.y; 
  }

  descartesJS.R2.prototype.norm = function() {
    return Math.sqrt( this.norm2() ); 
  }

  descartesJS.R2.prototype.distance = function(p) {
    q = this.copy(); 
    q.sub(p); 
    
    return q.norm(); 
  }

  descartesJS.R2.prototype.dot = function(p) {
    return this.x*p.x + this.y*p.y; 
  }

  descartesJS.R2.prototype.det = function(p) {
    return this.x*p.y - this.y*p.x; 
  }

  descartesJS.R2.prototype.mul = function(m) {
    this.x*=m;
    this.y*=m; 
  }

  descartesJS.R2.prototype.div = function(d) {
    this.x/=d;
    this.y/=d; 
  }

  descartesJS.R2.prototype.add = function(p) {
    this.x+=p.x;
    this.y+=p.y; 
  }

  descartesJS.R2.prototype.sub = function(p) {
    this.x-=p.x;
    this.y-=p.y; 
  }

  descartesJS.R2.prototype.normalize = function() {
    aux = this.norm(); 
    if (aux != 0.0) { 
      this.div(aux); 
    }
  }

  descartesJS.R2.prototype.rotR90 = function() {
    aux = this.x;
    this.x = this.y;
    this.y = -aux; 
  }

  descartesJS.R2.prototype.rotL90 = function() {
    aux = this.x;
    this.x = -this.y;
    this.y = aux;
  }

  descartesJS.R2.prototype.rot = function(t) {
    p = this.copy();
    cost = MathCos(t);
    sint = MathSin(t);
    this.x = p.x*cost - p.y*sint;
    this.y = p.x*sint + p.y*cost;
  }

  descartesJS.R2.prototype.rot = function(g) {
    this.rot(g*MathPI/180); 
  }

  descartesJS.R2.prototype.intersection = function(p1, p2, q1, q2) {
    A11 = (p2.x-p1.x);
    A12 = (q1.x-q2.x);
    B1 = q1.x-p1.x;
    
    A21 = (p2.y-p1.y);
    A22 = (q1.y-q2.y);
    B2 = q1.y-p1.y;

    Det = A11*A22-A12*A21;
    if (MathAbs(Det) > 0.000001) {
      s = ( B1*A22-B2*A12)/Det;
      t = (-B1*A21+B2*A11)/Det;
      
      if (0<=s && s<=1 && 0<=t && t<=1) {
        return new descartesJS.R2(p1.x+A11*s, p1.y+A21*s);
      } else {
        return null;
      }
    } 
    
    else if ((p2.x-q1.x)*B2 != (p2.y-q1.y)*B1) {
      return null; // no están alineados
    } else { // están alineados
      if (p1.x != p2.x) {
        mp = MathMin(p1.x, p2.x);
        Mp = MathMax(p1.x, p2.x);
        
        if (mp<=q1.x && q1.x<=Mp) {
          return q1;
        } 
        else if (mp<=q2.x && q2.x<=Mp) {
          return q2;
        }
        return null;
      } 
      else if (q1.x != q2.x) {
        mq = MathMin(q1.x, q2.x);
        Mq = MathMax(q1.x, q2.x);
        
        if (mq<=p1.x && p1.x<=Mq) {
          return p1;
        } 
        else if (mq<=p2.x && p2.x<=Mq) {
          return p2;
        }
        return null;
      } 
      else if (p1.y != p2.y) {
        mp = MathMin(p1.y, p2.y);
        Mp = MathMax(p1.y, p2.y);
        
        if (mp<=q1.y && q1.y<=Mp) {
          return q1;
        } 
        else if (mp<=q2.y && q2.y<=Mp) {
          return q2;
        }
        return null;
      } 
      else if (q1.y != q2.y) {
        mq=MathMin(q1.y, q2.y);
        Mq=MathMax(q1.y, q2.y);
        
        if (mq<=p1.y && p1.y<=Mq) {
          return p1;
        } 
        else if (mq<=p2.y && p2.y<=Mq) {
          return p2;
        }
        return null;
      } 
      else if (p1.x==q1.x && p1.y==q1.y) {
        return p1;
      } else {
        return null;
      }
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var delta = 0.000000000001;
  var epsilon = 0.000001;

  var evaluator;
  var FV;
  var xa;
  var ya;
  var q;
  var newQ;
  var savex;
  var savey;


  /**
   * Descartes R2Newton
   * @constructor 
   * @param {Evaluator} evaluator the Descartes evaluator
   * @param {String} constraint the constraint of the R2Newton
   */
  descartesJS.R2Newton = function(evaluator, constraint) {
    this.evaluator = evaluator;
    this.constraint = constraint;
    
    if ((this.constraint.value == "==") || (this.constraint.value == "<") || (this.constraint.value == "<=") || (this.constraint.value == ">") || (this.constraint.value == ">=")) {
      
      if ((this.constraint.value == "<") || (this.constraint.value == "<=")) {
        this.sign = "menor";
      }
      
      else if ((this.constraint.value == ">") || (this.constraint.value == ">=")) {
        this.sign = "mayor";
      }
      
      else {
        this.sign = "igual"; 
      }
      
      // a restriction of the form "something = somethingElse" is converted to "someting - somethingElse = 0"
      this.constraint = this.constraint.equalToMinus();
      // evaluates onlye the left size, because the right size is 0
      this.constraint = this.constraint.childs[0];
    }

    newQ = new descartesJS.R2(0, 0);    
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.getUnitNormal = function() {
    this.normal.normalize();
    return this.normal.copy();
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.gradient = function(q0) {
    evaluator = this.evaluator;
    
    savex = evaluator.getVariable("x");
    savey = evaluator.getVariable("y");

    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);

    this.f0 = evaluator.evalExpression(this.constraint);
    
    evaluator.setVariable("x", evaluator.getVariable("x") + delta);

    FV = evaluator.evalExpression(this.constraint);
   
    newQ.x = (FV-this.f0)/delta;
    newQ.x = (!isNaN(newQ.x)) ? newQ.x : Infinity;
    
    evaluator.setVariable("x", evaluator.getVariable("x") - delta);
    evaluator.setVariable("y", evaluator.getVariable("y") + delta);

    FV = evaluator.evalExpression(this.constraint);

    newQ.y = (FV-this.f0)/delta;
    newQ.y = (!isNaN(newQ.y)) ? newQ.y : Infinity;

    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);
    
    return newQ;    
  }

  /**
   * 
   */
  descartesJS.R2Newton.prototype.findZero = function(q0) {
    evaluator = this.evaluator;
    
    q = q0.copy();
    
    savex = evaluator.getVariable("x");
    savey = evaluator.getVariable("y");
    
    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);
    
    descartesJS.fullDecimals = true;
    this.f0 = evaluator.evalExpression(this.constraint);
    
    if ((this.sign === "menor") && (this.f0 <= 0)) {
      return q;
    } 
    else if ((this.sign === "mayor") && (this.f0 >= 0)) {
      return q;
    }
    
    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);

    for (var i=0; i<256; i++) {
      xa = q.x;
      ya = q.y;

      this.normal = this.gradient(q);

      if (this.normal.norm2() != 0) {
        this.normal.mul(-this.f0/this.normal.norm2());
      }

      q.x = xa+this.normal.x; 
      q.y = ya+this.normal.y;
      
      if (this.normal.norm() < epsilon) {
        if ((this.normal.x === 0) && (this.normal.y === 0)) {
          this.normal.x = q.x-q0.x;
          this.normal.y = q.y-q0.y;
        }
        descartesJS.fullDecimals = false;
        return q;
      }
    }
    
    descartesJS.fullDecimals = false;
    return q;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes R2 vector
   * @constructor 
   * @param {Number} x the x component of the vector
   * @param {Number} y the y component of the vector
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Axis X vector
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_X = new descartesJS.Vector2D(1, 0);;

  /**
   * Axis Y vector
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_Y = new descartesJS.Vector2D(0, 1);

  /**
   * Get the lenght of a 2D vector
   * @return {Number} return the lenght of a 2D vector
   */
  descartesJS.Vector2D.prototype.vectorLength = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  /**
   * Calculate the dot product of two vectors
   * @param {Vector2D} v the second vector for the calculation of the dot product
   * @return {Number} return the dot product
   */
  descartesJS.Vector2D.prototype.dotProduct = function(v) {
    return this.x*v.x + this.y*v.y;
  }
  
  /**
   * Calculate the angle between two vectors
   * @param {Vector2D} v the second vector for the calculation of the angle between two vectors
   * @return {Number} return the angle between two vectors
   */
  descartesJS.Vector2D.prototype.angleBetweenVectors = function(v) {
    return Math.acos(this.dotProduct(v)/(this.vectorLength()*v.vectorLength()));
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var hh;
  var di;
  var changeX;
  var changeY;
  var changeW;
  var changeH;
  var expr;

  var temporalCompare;
  var resultValue;
  var decimals;
  var indexDot;
  var subS;
  var parent;

  var canvas;
  var ctx;
  var self;
  var _left;
  var _top;
  var _width;
  var _height;
  
  /**
   * Descartes control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the control
   */
  descartesJS.Control = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.parser = parent.evaluator.parser;
    var parser = this.parser;

    /**
     * identifier
     * type {String}
     * @private
     */
    this.id = (values.type !== "graphic") ? "C" : "G";

    /**
     * type (numeric or graphic)
     * type {String}
     * @private
     */
    this.type = "";

    /**
     * interface
     * type {String}
     * @private
     */
    this.gui = "";
    
    /**
     * region to draw
     * type {String}
     * @private
     */
    this.region = "south";

    /**
     * space name
     * type {String}
     * @private
     */
//     this.space = "E0";

    /**
     * name
     * type {String}
     * @private
     */
//     this.name = "";
    
    /**
     * x position
     * type {Number}
     * @private
     */
    this.x = 0;

    /**
     * y position
     * type {Number}
     * @private
     */
    this.y = 0;

    /**
     * width
     * type {Number}
     * @private
     */
    this.w = (values.type !== "video") ? 100 : 350;

    /**
     * height
     * type {Number}
     * @private
     */
    this.h = (values.type !== "video") ? 23 : 120;

    /**
     * position and size expression
     * type {String}
     * @private
     */
    if ((values.type !== "graphic") && (values.type !== "audio") && (values.type !== "video")) {
      if (values.type !== "text") {
        this.expresion = parser.parse("(0,0,100,23)");
      } else {
        this.expresion = parser.parse("(0,0,300,200)");
        this.w = 300;
        this.h = 200;
      }
    }
    else {
      this.expresion = parser.parse("(0,0)");
    }

    /**
     * condition to use fixed notation in the number values
     * type {Boolean}
     * @private
     */
    this.fixed = (this.parent.version != 2) ? false : true;

    /**
     * condition visibility
     * type {Boolean}
     * @private
     */     
    this.visible = true;

    /**
     * text color
     * type {String}
     * @private
     */
    this.color = (this.parent.version < 4) ? new descartesJS.Color("000000") : new descartesJS.Color("222222");

    /**
     * control color
     * type {String}
     * @private
     */
    // this.colorInt = (values.type !== "graphic") ? new descartesJS.Color("f0f8ff") : new descartesJS.Color("ff0000");
    this.colorInt = (values.type !== "graphic") ? new descartesJS.Color("f0f8ff") : new descartesJS.Color("cc0022");

    /**
     * bold text condition
     * type {String}
     * @private
     */
    this.bold = "";

    /**
     * italic text condition
     * type {String}
     * @private
     */
    this.italics = "";

    /**
     * underline text condition
     * type {String}
     * @private
     */
    this.underlined = "";

    /**
     * font size of the control
     * type {Object}
     * @private
     */
    this.font_size = (this.parent.version < 4) ? -1 : parser.parse("12");
    
    /**
     * action type
     * type {String}
     * @private
     */
    this.action = "";

    /**
     * parameter
     * type {String}
     * @private
     */
    this.parameter = "";

    /**
     * parameter font
     * type {String}
     * @private
     */
    this.parameterFont = "Monospace 12px";
    
    /**
     * draw condition
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * active condition
     * type {Node}
     * @private
     */
    this.activeif = parser.parse("1");

    /**
     * tooltip text
     * type {String}
     * @private
     */
    this.tooltip = "";

    /**
     * tooltip font
     * type {String}
     * @private
     */
    this.tooltipFont = "Monospace 12px";

    /**
     * control explanation
     * type {String}
     * @private
     */
    this.Explanation = "";

    /**
     * explanation font
     * type {String}
     * @private
     */
    this.ExplanationFont = "Monospace 12px";

    /**
     * mensage position
     * type {String}
     * @private
     */
    this.msg_pos = "";

    /**
     * conponent identifier
     * type {String}
     * @private
     */    
    this.cID = "";
    
    /**
     * initial value (spinner)
     * type {Node}
     * @private
     */    
    this.valueExpr = parser.parse("0");

    /**
     * decimal number of the text
     * type {Node}
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * lower limit
     * type {Node}
     * @private
     */
    this.min = parser.parse("-Infinity");

    /**
     * upper limit
     * type {Node}
     * @private
     */
    this.max = parser.parse("Infinity");

    /**
     * increment
     * type {Node}
     * @private
     */
    this.incr = parser.parse("0.1");

    /**
     * discrete numbers condition
     * type {Boolean}
     * @private
     */
    this.discrete = false;

    /**
     * condition to use exponential notation
     * type {Boolean}
     * @private
     */
    this.exponentialif = false;
    
    /**
     * z index
     * @type {Number}
     * @private 
     */
    this.zIndex = -1;
    
    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    // move the video and audio controls to the interior region
    if (((this.type === "video") || (this.type === "audio")) && (this.region !== "interior")) {
      this.region = "interior";
    }

    // ## Descartes 2 patch ## //
    if (this.name == undefined) {
      if (this.parent.version == 2) {
        this.name = this.id;
      }
      else {
        this.name = "_nada_"
      }
    }
    this.name = ((this.name == "_._") || (this.name == "_nada_") || (this.name == "_void_")) ? "" : this.name;

    var expr = this.evaluator.evalExpression(this.expresion);
    this.x = MathRound(expr[0][0]);
    this.y = MathRound(expr[0][1]);
    if (expr[0].length == 4) {
      this.w = MathRound(expr[0][2]);
      this.h = MathRound(expr[0][3]);
    }
        
    this.actionExec = parent.lessonParser.parseAction(this);
  }
  
  /**
   * Init the control parameters
   */
  descartesJS.Control.prototype.init = function() { }

  /**
   * Update the control
   */
  descartesJS.Control.prototype.update = function() { }

  /**
   * Draw the control
   */
  descartesJS.Control.prototype.draw = function() { }

  /**
   * Get the space container and add the cotrol to it
   * @return {HTMLnode} return the space container asociated with the control
   */
  descartesJS.Control.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // if the control is in the interior region
    if (this.region === "interior") {
      for(var i=0, l=spaces.length; i<l; i++) {
        space_i = spaces[i];
        if (space_i.id === this.spaceID) {
          space_i.addCtr(this);
          this.zIndex = space_i.zIndex;
          // this.space = space_i;
          return space_i.numericalControlContainer;
        }
      }
    }
    // if the control is in the external region
    else if (this.region === "external") {
      // this.space = this.parent.externalSpace;
      this.parent.externalSpace.addCtr(this);      
      return this.parent.externalSpace.container;
    }
    // if the control is in the scenario
    else if (this.region === "scenario") {
      // has a cID
      if (this.cID) {
        this.expresion = this.evaluator.parser.parse("(0,-1000," + this.w + "," + this.h + ")");
        this.parent.scenarioRegion.scenarioSpace.addCtr(this);
        this.zIndex = this.parent.scenarioRegion.scenarioSpace.zIndex;
        return this.parent.scenarioRegion.scenarioSpace.numericalControlContainer;
      }
      else {
        return this.parent.externalSpace.container;
      }

    }
    // if the cotrol is in the north region
    else if (this.region === "north") {
      this.parent.northSpace.controls.push(this);
      return this.parent.northSpace.container;
    }
    // if the cotrol is in the south region
    else if (this.region === "south") {
      this.parent.southSpace.controls.push(this);
      return this.parent.southSpace.container;
    }
    // if the cotrol is in the east region
    else if (this.region === "east") {
      this.parent.eastSpace.controls.push(this);
      return this.parent.eastSpace.container;
    }
    // if the cotrol is in the west region
    else if (this.region === "west") {
      this.parent.westSpace.controls.push(this);
      return this.parent.westSpace.container;
    }
    // if the cotrol is in a spacial region (credits, config, init or clear)
    else if (this.region === "special") {
      this.parent.specialSpace.controls.push(this);
      return this.parent.specialSpace.container;
    }

    // if do not find a space with the identifier the return the firs space
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    return spaces[0].numericalControlContainer;
  }

  /**
   * 
   * @return {HTMLnode} return the space container asociated with the control
   */
  descartesJS.Control.prototype.addControlContainer = function(controlContainer) {
    // get the control container
    var container = this.getContainer();

    // add the container in inverse order to the space container
    if (!container.childNodes[0]) {
      container.appendChild(controlContainer);
    } 
    else {
      container.insertBefore(controlContainer, container.childNodes[0]);
    }

    // add the container in inverse order to the space container
    if (!container.childNodes[0]) {
      container.appendChild(controlContainer);
    } 
    else {
      container.insertBefore(controlContainer, container.childNodes[0]);
    }
  }

  /**
   * Update the position and size of the control
   */
  descartesJS.Control.prototype.updatePositionAndSize = function() {
    changeX = changeY = changeW = changeH = false;
    expr = this.evaluator.evalExpression(this.expresion);

    temporalCompare = MathRound(expr[0][0]);
    changeX = MathRound(this.x) !== temporalCompare;
    this.x = temporalCompare;

    temporalCompare = MathRound(expr[0][1]);
    changeY = MathRound(this.y) !== temporalCompare;
    this.y = temporalCompare;
    
    if (expr[0].length === 4) {
      temporalCompare = MathRound(expr[0][2]);
      changeW = MathRound(this.w) !== temporalCompare;
      this.w = temporalCompare

      temporalCompare = MathRound(expr[0][3]);
      changeH = MathRound(this.h) !== temporalCompare;
      this.h = temporalCompare;
    }

    // if has some change, then init the control and redraw it
    if ((changeW) || (changeH) || (changeX) || (changeY)) {
      this.init();
      this.draw();
    }
  }

  /**
   * Format the value with the number of decimals, the exponential representation and the decimal symbol
   * @param {String} value tha value to format
   * @return {String} return the value with the format applyed
   */
  descartesJS.Control.prototype.formatOutputValue = function(value) {
    parent = this.parent;

    resultValue = value+"";
    decimals = this.evaluator.evalExpression(this.decimals);

    indexDot = resultValue.indexOf(".");
    if ( indexDot != -1 ) {
      subS = resultValue.substring(indexDot+1);

      if (subS.length > decimals) {
        resultValue = parseFloat(resultValue).toFixed(decimals);
      }
    }

    if (this.fixed) {
      // ## patch for Descartes 2 ## 
      // in a version diferente to 2, then fixed stays as it should
      // if the version is 2 but do not use exponential notation
      if ( (parent.version !== 2) || ((parent.version === 2) && (!this.exponentialif)) ) {
        resultValue = parseFloat(value).toFixed(decimals);
      }
    }

    // if the value is zero then do not show the E in the exponential notation
    if ((this.exponentialif) && (parseFloat(resultValue) != 0)) {
      // ## patch for Descartes 2 ## 
      // in the version 2 do not show the decimals
      if ((this.fixed) && (parent.version !== 2)) {
        resultValue = parseFloat(resultValue).toExponential(decimals);
      }
      else {
        resultValue = parseFloat(resultValue).toExponential();
      }
      resultValue = resultValue.toUpperCase();
      resultValue = resultValue.replace("+", "");
    }

    resultValue = resultValue.replace(".", parent.decimal_symbol);
    return resultValue;
  }

  /**
   *
   */
  descartesJS.Control.prototype.updateAndExecAction = function() {
    // update the controls
    this.parent.updateControls();

    // if the action is init, release the click
    if (this.action === "init") {
      this.click = false;
    }
    // execute the acction
    this.actionExec.execute();

    // update again the controls
    // this.parent.updateControls();

    // if the action is animate then do not update the scene
    if (this.action !== "animate") {
      // update the scene
      this.parent.update();
    }
  }

  /**
   * Create a linear gradient for the background
   * @param {Number} w es el ancho del canvas sobre el cual se quiere crear el gradiente lineal
   * @param {Number} h es el alto del canvas sobre el cual se quiere crear el gradiente lineal
   */
  descartesJS.Control.prototype.createGradient = function(w, h) {
    this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    hh = h*h;
    
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(35*h)/100);
      // di = Math.floor(i-(40*h)/100);
      this.linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
  }

  /**
   *
   */
  descartesJS.Control.prototype.getScreenshot = function() {
    self = this;
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", self.w);
    canvas.setAttribute("height", self.h);
    ctx = canvas.getContext("2d");

    ctx.font = self.fieldFontSize + "px Arial, Helvetica, 'Droid Sans', Sans-serif";

    // draw the buttons
    if (self.canvas) {
      _left = self.canvas.offsetLeft;
      _top = self.canvas.offsetTop;

      ctx.drawImage(self.canvas, _left, _top);
    }

    // draw the label
    if (self.label) {
      _left = self.label.offsetLeft;
      _top = self.label.offsetTop;
      _width = self.label.offsetWidth;
      _height = self.label.offsetHeight;

      ctx.fillStyle = "#e0e4e8";
      ctx.fillRect(_left, _top, _width, _height);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(self.name, _left+_width/2, _top+_height/2);
    }

    // draw the text field
    if (self.field) {
      _left = self.field.offsetLeft;
      _top = self.field.offsetTop;
      _width = self.field.offsetWidth;
      _height = self.field.offsetHeight;

      ctx.fillStyle = "white";
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1;    
      ctx.fillRect(_left, 0, _width, _height);
      ctx.strokeRect(_left+.5, .5, _width-1, _height-1);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textAlign = "left";
      ctx.fillText(self.field.value, _left+2, _height/2);
    }

    // draw the menu
    if (self.select) {
      _left = self.select.offsetLeft;
      _top = self.select.offsetTop;
      _width = self.select.offsetWidth;
      _height = self.select.offsetHeight;

      ctx.fillStyle = "#e0e4e8";
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1;    
      ctx.fillRect(_left, 0, _width, _height);
      ctx.strokeRect(_left+.5, .5, _width, _height-1);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textAlign = "left";
      ctx.fillText(self.select.value, _left+2, _height/2);

      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(_left+_width-15 +.5, .5, 15, _height-1);
      ctx.strokeRect(_left+_width-15 +.5, .5, 15, _height-1);

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(_left+_width-15 +4.5,  _height/2 -2.5);
      ctx.lineTo(_left+_width-15 +8,    _height/2 +2.5);
      ctx.lineTo(_left+_width-15 +11.5, _height/2 -2.5);
      ctx.closePath();
      ctx.fill();

    }

    return canvas;
  }  

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
    
  var evaluator;
  var canvas;
  var ctx;
  var expr;
  var font_size;
  var name;
  var imageSrc;
  var image;
  var despX;
  var despY;
  var txtW;
  var hasTouchSupport;
  var delay = 900;

  /**
   * Descartes button control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the button control
   */
  descartesJS.Button = function(parent, values) {
    /**
     * image file name
     * type {String}
     * @private
     */
    this.imageSrc = "";

    /**
     * image
     * type {Image}
     * @private
     */
    this.image = new Image();
    
    /**
     * over image
     * type {Image}
     * @private
     */
    this.imageOver = new Image();

    /**
     * down image
     * type {Image}
     * @private
     */
    this.imageDown = new Image();

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    if (this.font_size === -1) {
      this.fontSizeNotSet = true;
    }

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }

    // color expression of the form _COLORES_ffffff_000000_P_22 specified in the image field
    // the first color is the background color
    // the second color is the text color
    // the last number ir the font size
    var tmpParam;
    if (this.imageSrc.match("_COLORES_")) {
      tmpParam       = this.imageSrc.split("_");
      this.colorInt  = new descartesJS.Color(tmpParam[2]);
      this.color     = new descartesJS.Color(tmpParam[3]);
      this.font_size = this.parser.parse(tmpParam[5]);
      this.imageSrc  = "";
    }

    this.imageSrc = this.parser.parse("'" + this.imageSrc + "'");
    
    // if the button has an image then load it and try to load the over and down images
    var imageSrc = this.evaluator.evalExpression(this.imageSrc).trim();
    if (imageSrc != "") {
      var prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
      var sufix  = imageSrc.substr(imageSrc.lastIndexOf("."));

      // empty image, i.e. reference to vacio.gif
      if (imageSrc.toLowerCase().match(/vacio.gif$/)) {
        this.imageSrc = this.parser.parse("'vacio.gif'");

        this.image.ready = 1;

        // ## Descartes 3 patch ##
        // if the image is empty then the name of the button is not displayed
        if (this.parent.version === 3) {
          this.name = this.parser.parse('');
        }
        // ## Descartes 3 ##

        this.emptyImage = { ready: true };
        imageSrc = this.parser.parse("'vacio.gif'");
      } 
      // the image is not empty
      else {
        this.image = this.parent.getImage(imageSrc);
        this.imageOver = this.parent.getImage(prefix + "_over" + sufix);
        this.imageDown = this.parent.getImage(prefix + "_down" + sufix);
      }
    }

    // create the canvas and the rendering context
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("class", "DescartesButton");
    this.canvas.setAttribute("id", this.id);
    this.canvas.setAttribute("width", this.w+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;

    this.addControlContainer(this.canvas);

    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the button parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Button, descartesJS.Control);

  /**
   * Init the button
   */
  descartesJS.Button.prototype.init = function() {
    evaluator = this.evaluator;
    canvas = this.canvas;
    expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = parseInt(expr[0][2]);
      this.h = parseInt(expr[0][3]);
    }
    
    canvas.setAttribute("width", this.w+"px");
    canvas.setAttribute("height", this.h+"px");
    canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + "; display: block; background-repeat: no-repeat;");

    if (this.fontSizeNotSet) {
      this.font_size = evaluator.parser.parse(descartesJS.getFieldFontSize(this.h) +"");
    }

    // create the background gradient
    this.createGradient(this.w, this.h);

    canvas.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
  }
  
  /**
   * Update the button
   */
  descartesJS.Button.prototype.update = function() {
    evaluator = this.evaluator;
    canvas = this.canvas;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // hide or show the button control
    if (this.drawIfValue) {
      canvas.style.display = "block";
      this.draw();
    } else {
      this.click = false;
      canvas.style.display = "none";
    }

    if (this.activeIfValue) {
      this.canvas.style.cursor = "pointer";
    }
    else {
      this.canvas.style.cursor = "not-allowed";
    }

    // update the position and size
    this.updatePositionAndSize();
  }

  /**
   * Draw the button
   */
  descartesJS.Button.prototype.draw = function() {
    evaluator = this.evaluator;
    ctx = this.ctx;

    font_size = evaluator.evalExpression(this.font_size);
    name = evaluator.evalExpression(this.name);

    imageSrc = evaluator.evalExpression(this.imageSrc);
    image = (imageSrc === "vacio.gif") ? this.emptyImage : this.parent.getImage(imageSrc);
    
    ctx.clearRect(0, 0, this.w, this.h);

    // text displace when the button is pressed
    despX = 0;
    despY = 0;
    if (this.click) {
      despX = 1;
      despY = 1;
    }

    // the image is ready
    if ((image) && (image.ready)) {
      if ( (image !== this.emptyImage) && (image.complete) ) {
        this.canvas.style.backgroundImage = "url(" + this.image.src + ")";
        this.canvas.style.backgroundPosition = (parseInt((this.w-image.width)/2)+despX) + "px " + (parseInt((this.h-image.height)/2)+despY) + "px";
        // ctx.drawImage(image, parseInt((this.w-image.width)/2)+despX, parseInt((this.h-image.height)/2)+despY);
      }
    }
    // the image is not ready or do not have a image
    else {
      ctx.fillStyle = this.colorInt.getColor();
      ctx.fillRect(0, 0, this.w, this.h);

      if (!this.click) {
        descartesJS.drawLine(ctx, this.w-1, 0, this.w-1, this.h, "rgba(0,0,0,"+(0x80/255)+")");
        descartesJS.drawLine(ctx, 0, 0, 0, this.h, "rgba(0,0,0,"+(0x18/255)+")");
        descartesJS.drawLine(ctx, 1, 0, 1, this.h, "rgba(0,0,0,"+(0x08/255)+")");
      }
      
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
    if ( (this.activeIfValue) && (this.imageOver.src != "") && (this.imageOver.ready) && (this.over) ) {
      this.canvas.style.backgroundImage = "url(" + this.imageOver.src + ")";
      this.canvas.style.backgroundPosition = (parseInt((this.w-image.width)/2)+despX) + "px " + (parseInt((this.h-image.height)/2)+despY) + "px";
      // ctx.drawImage(this.imageOver, parseInt((this.w-image.width)/2)+despX, parseInt((this.h-image.height)/2)+despY);
    }

    if ( (this.activeIfValue) && (this.imageDown.src != "") && (this.imageDown.ready) && (this.click) ) {
      this.canvas.style.backgroundImage = "url(" + this.imageDown.src + ")";
      this.canvas.style.backgroundPosition = (parseInt((this.w-image.width)/2)+despX) + "px " + (parseInt((this.h-image.height)/2)+despY) + "px";
      // ctx.drawImage(this.imageDown, parseInt((this.w-image.width)/2)+despX, parseInt((this.h-image.height)/2)+despY);
    }
    else if ((this.click) && (!image)) {
      descartesJS.drawLine(ctx, 0, 0, 0, this.h-2, "gray");
      descartesJS.drawLine(ctx, 0, 0, this.w-1, 0, "gray"); 

      ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
      ctx.fillRect(0, 0, this.w, this.h);
    }
      
    ctx.fillStyle = this.color.getColor();
    ctx.font = this.italics + " " + this.bold + " " + font_size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // text border
    if (this.colorInt.getColor() != this.color.getColor()) {
      ctx.lineJoin = "round";
      ctx.lineWidth = parseInt(font_size/6);
      ctx.strokeStyle = this.colorInt.getColor();
      ctx.strokeText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
    }

    // write the button name
    ctx.fillText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);

    // draw the under line
    if (this.underlined) {
      txtW = ctx.measureText(name).width;
      ctx.strokeStyle = this.color.getColor();
      ctx.lineWidth = MathFloor(font_size/10) || 2;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo( parseInt((this.w-txtW)/2) + despX, MathFloor((this.h + font_size)/2) + MathFloor(font_size/5) - 1.5 + despY );
      ctx.lineTo( parseInt((this.w+txtW)/2) + despX, MathFloor((this.h + font_size)/2) + MathFloor(font_size/5) - 1.5 + despY );
      ctx.stroke();
    }
     
    if (!this.activeIfValue) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, this.w, this.h);      
      // ctx.globalCompositeOperation = "destination-in";
      // ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0x66/255) + ")";
      // ctx.fillRect(0, 0, this.w, this.h);
      // ctx.globalCompositeOperation = "source-over";
    }
    
  }
  
  /**
   * Function executed when the button is pressed
   */
  descartesJS.Button.prototype.bottonPressed = function() {
    this.updateAndExecAction();
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Button.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;
    
    var self = this;
    var timer;

    // prevent the context menu display
    self.canvas.oncontextmenu = function () { return false; };

    /**
     * Repeat a function during a period of time, when the user click and hold the click in the button
     * @param {Number} delayTime the delay of time between the function repetition
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
     * @private
     */
    function repeat(delayTime, fun, firstTime) {
      clearInterval(timer);

      if (self.click) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      }
    }

    this.click = false;
    this.over = false;
    
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown);
      this.canvas.addEventListener("mouseover", onMouseOver);
      this.canvas.addEventListener("mouseout", onMouseOut);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      evt.preventDefault();

      // blur other elements when clicked
      document.activeElement.blur();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.click = true;
          
          self.draw();
          
          // se registra el valor de la variable
          self.evaluator.setVariable(self.id, self.evaluator.evalExpression(self.valueExpr));

          if (self.action == "calculate") {
            repeat(delay, self.bottonPressed, true);
          }
          
          if (hasTouchSupport) {
            window.addEventListener("touchend", onMouseUp);
          } else {
            window.addEventListener("mouseup", onMouseUp);
          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      // remove the focus of the controls
      document.body.focus();
      
      if ((self.activeIfValue) || (self.click)) {
        self.click = false;
        self.draw();
        
        if (self.action != "calculate") {
          self.bottonPressed();
        }
        
        evt.preventDefault();

        if (hasTouchSupport) {
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
        }
      }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.draw();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.click = false;
      self.draw();
    }
  }

  descartesJS.Button.prototype.getScreenshot = function() {
    return this.canvas;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tmpIncr;
  var expr;
  var oldFieldValue;
  var oldValue;
  var ctx;
  var w;
  var h;
  var c1;
  var c2;
  var triaX;
  var triaY;
  var resultValue;
  var incr;
  var decimals;
  var evalMin;
  var evalMax;
  var hasTouchSupport;

  /**
   * Descartes spinner control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the spinner control
   */
  descartesJS.Spinner = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }

    // control container
    this.containerControl = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");

    // the label
    this.label = document.createElement("label");
    // this.txtLabel = document.createTextNode();
    // this.label.appendChild(this.txtLabel);

    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.field);
    this.containerControl.appendChild(this.canvas);
    this.containerControl.appendChild(this.divUp);
    this.containerControl.appendChild(this.divDown);

    this.addControlContainer(this.containerControl);

    // if the decimals are negavite or zero
    this.originalIncr = this.incr;
    if (this.evaluator.evalExpression(this.decimals) <= 0) {
      var tmpIncr = this.evaluator.evalExpression(this.incr);

      if (tmpIncr > 0) {
        this.incr = this.evaluator.parser.parse(parseInt(tmpIncr).toString());
        this.originalIncr = this.incr;
      }
      else {
        this.incr = this.evaluator.parser.parse("1");
      }
    }

    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the menu parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Spinner, descartesJS.Control);

  /**
   * Init the spinner
   */
  descartesJS.Spinner.prototype.init = function() {
    evaluator = this.evaluator;

    var name = evaluator.evalExpression(this.name).toString();
    this.label.innerHTML = name;

    // validate the initial value
    this.value = this.validateValue(evaluator.evalExpression(this.valueExpr));
    
    // get the width of the initial value to determine the width of the text field
    var fieldValue = this.formatOutputValue(this.value);

    // find the font size of the text field
    this.fieldFontSize = (this.parent.version !== 2) ? descartesJS.getFieldFontSize(this.h) : 10;

    // extra space added to the name
    var extraSpace = (this.parent.version !== 2) ? "" : "_____";
    
    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px Arial");

    // widths are calculated for each element
    var canvasWidth = 2 + parseInt(this.h/2);
    var labelWidth = parseInt(this.w/2 - canvasWidth/2);
    var minTFWidth = fieldValueSize;
    var minLabelWidth = descartesJS.getTextWidth(name+extraSpace, this.fieldFontSize+"px Arial");

    if (!this.visible) {
      labelWidth = this.w - canvasWidth;
      minTFWidth = 0;
    }

    if (labelWidth < minLabelWidth) {
      labelWidth = minLabelWidth;
    }
    
    if (name == "") {
      labelWidth = 0;
    }
    
    if (this.w-labelWidth-canvasWidth < minTFWidth) {
      labelWidth = this.w - canvasWidth - minTFWidth;
    }
    
    if (labelWidth < 0) {
      labelWidth=0;
    }

    var fieldWidth = this.w - (labelWidth + canvasWidth);

    this.containerControl.setAttribute("class", "DescartesSpinnerContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.setAttribute("id", this.id);

    this.canvas.setAttribute("width", canvasWidth+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "position: absolute; left: " + labelWidth + "px; top: 0px;");
    this.ctx = this.canvas.getContext("2d");
    
    this.divUp.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + canvasWidth + "px; height : " + this.h/2 + "px; left: " + labelWidth + "px; top: 0px;");
    this.divDown.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + canvasWidth + "px; height : " + this.h/2 + "px; left: " + labelWidth + "px; top: " + this.h/2 + "px;");

    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"_spinner");
    this.field.setAttribute("class", "DescartesSpinnerField");
    this.field.setAttribute("style", "font-family: Arial; font-size: " + this.fieldFontSize + "px; width : " + fieldWidth + "px; height : " + this.h + "px; left: " + (canvasWidth + labelWidth) + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    this.field.value = fieldValue;

    this.label.setAttribute("class", "DescartesSpinnerLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
    // register the control value
    evaluator.setVariable(this.id, this.value);

    // create the background gradient
    this.createGradient(this.h/2, this.h);

    // this.update();
  }

  /**
   * Update the spinner
   */
  descartesJS.Spinner.prototype.update = function() {
    evaluator = this.evaluator;
    
    this.label.innerHTML = evaluator.evalExpression(this.name).toString();

    if (evaluator.evalExpression(this.decimals) <= 0) {
      tmpIncr = evaluator.evalExpression(this.incr);

      if (tmpIncr > 0) {
        this.incr = evaluator.parser.parse(parseInt(tmpIncr).toString());
        this.originalIncr = this.incr;
      }
      else {
        this.incr = evaluator.parser.parse("1");
      }
    } 
    else {
      this.incr = this.originalIncr;
    }

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = !this.activeIfValue;
    
    // hide or show the spinner control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block"
      this.draw();
    } else {
      this.click = false;
      this.containerControl.style.display = "none";
    }

    // update the position and size
    this.updatePositionAndSize();

    if (document.activeElement != this.field) {
      oldFieldValue = this.field.value;
      oldValue = this.value;
      
      // update the spinner value
      this.value = this.validateValue( evaluator.getVariable(this.id) );
      this.field.value = this.formatOutputValue(this.value);

      if ((this.value == oldValue) && (this.field.value != oldFieldValue)) {
        // update the spinner value
        this.value = this.validateValue( oldFieldValue );
        this.field.value = this.formatOutputValue(this.value);
      }

      // register the control value
      evaluator.setVariable(this.id, this.value);
    }
  }

  /**
   * Draw the spinner
   */
  descartesJS.Spinner.prototype.draw = function() {
    ctx = this.ctx;

    w = this.canvas.width;
    h = this.canvas.height
    
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = this.linearGradient;
    ctx.fillRect(0, 0, w, h);

    // draw the upper lines for depth efect
    if (this.up) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }
    
    descartesJS.drawLine(ctx, 0, 0, w, 0, c1);
    descartesJS.drawLine(ctx, 0, 0, 0, h/2, c1);
    descartesJS.drawLine(ctx, 0, h/2, w, h/2, c2);

    // draw the lower lines for depth efect
    if (this.down) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }
    
    descartesJS.drawLine(ctx, 0, h/2+1, w, h/2+1, c1);
    descartesJS.drawLine(ctx, 0, h/2+1, 0, h, c1);
    descartesJS.drawLine(ctx, 0, h-1, w, h-1, c2);
    
    triaX = [parseInt(w/2+1), parseInt(w/5+1), parseInt(w-w/5+1)];
    triaY = [parseInt(h/8+1), parseInt(h/8+1+h/4), parseInt(h/8+1+h/4)];
    
    // draw the uper triangle
    ctx.fillStyle = (this.activeIfValue) ? "#2244cc" : "#8888aa";
    ctx.beginPath();
    ctx.moveTo(triaX[0], triaY[0]);
    ctx.lineTo(triaX[1], triaY[1]);
    ctx.lineTo(triaX[2], triaY[2]);
    ctx.fill();

    triaY = [parseInt(h-h/8), parseInt(h-h/8-h/4), parseInt(h-h/8-h/4)];

    // draw the lower triangle
    ctx.fillStyle = (this.activeIfValue) ? "#d00018" : "#aa8888";
    ctx.beginPath();
    ctx.moveTo(triaX[0], triaY[0]);
    ctx.lineTo(triaX[1], triaY[1]);
    ctx.lineTo(triaX[2], triaY[2]);
    ctx.fill();

    // draw another layer for pressed effect
    ctx.fillStyle = "rgba(0,0,0,"+ 24/255 +")";
    if (this.up) { 
      ctx.fillRect(0, 0, w, h/2);
    }
    if (this.down) { 
      ctx.fillRect(0, h/2, w, h); 
    }
  }

  /**
   * Validate if the value is the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number, 
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.Spinner.prototype.validateValue = function(value) {
    evaluator = this.evaluator;

    if (!isNaN(parseFloat(value))) {
      // remove the exponential notation of the number and convert it to a fixed notation
      if (value.toString().match("e")) {
        value = parseFloat(value).toFixed(20);
      }
    } 
    value = value.toString();
    
    resultValue = parseFloat( evaluator.evalExpression( evaluator.parser.parse(value.replace(this.parent.decimal_symbol, ".")) ) );

    // if the value is a string that do not represent a number, parseFloat return NaN
    if (isNaN(resultValue)) {
      resultValue = 0; 
    }

    evalMin = evaluator.evalExpression(this.min);
    evalMax = evaluator.evalExpression(this.max);

    if (evalMin === "") {
      evalMin = -Infinity;
    }
    if (evalMax === "") {
      evalMax = Infinity;
    }
 
    // if is less than the lower limit
    if (resultValue < evalMin) {
      resultValue = evalMin;
    } 
    
    // if si greater than the upper limit
    if (resultValue > evalMax) {
      resultValue = evalMax;
    }

    if (this.discrete) {
      incr = evaluator.evalExpression(this.incr);
      resultValue = (incr==0) ? 0 : (incr * Math.round(resultValue / incr));
    }

    decimals = evaluator.evalExpression(this.decimals);
    if (decimals <= 0) {
      decimals = 0;
    }

    resultValue = parseFloat(parseFloat(resultValue).toFixed(decimals));
    
    return resultValue;
  }

  /**
   * Increase the value of the spinner
   */
  descartesJS.Spinner.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.evaluator.evalExpression(this.incr) );
  }
  
  /**
   * Decrease the value of the spinner
   */
  descartesJS.Spinner.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.evaluator.evalExpression(this.incr) );
  }
  
  /**
   * Change the spinner value
   */
  descartesJS.Spinner.prototype.changeValue = function(value) {
    if (this.activeIfValue) {
      this.value = this.validateValue(value);
      this.field.value = this.formatOutputValue(this.value);

      // register the control value
      this.evaluator.setVariable(this.id, this.value);

      this.updateAndExecAction();
    }
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Spinner.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;
    var delay = (hasTouchSupport) ? 500 : 200;
    var timer;

    // prevent the context menu display
    self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.field.oncontextmenu = self.label.oncontextmenu = function() { return false; };

    // prevent the default events int the label    
    if (hasTouchSupport) {
      this.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; });
    } 
    else {
      this.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; });
    }

    /**
     * Repeat a function during a period of time, when the user click and hold the click in the button
     * @param {Number} delayTime the delay of time between the function repetition
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
     * @private
     */    
    function repeat(delayTime, fun, firstTime) {
      clearInterval(timer);

      if (self.up || self.down) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responds to enter
      if (evt.keyCode == 13) {
        self.changeValue(self.field.value);
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField);

    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseDown_UpButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.up = true;
          repeat(delay, self.increase, true);
          self.draw();
        }
      }
    }

    if (hasTouchSupport) {
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton);
    } else {
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown_DownButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.down = true;
          repeat(delay, self.decrease, true);
          self.draw();
        }
      }
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton);
    } else {
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();      
    }
    if (!hasTouchSupport) {
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      this.divUp.addEventListener("touchend", onMouseUp_UpButton);
      window.addEventListener("touchend", onMouseUp_UpButton);
    } else {
      this.divUp.addEventListener("mouseup", onMouseUp_UpButton);
      window.addEventListener("mouseup", onMouseUp_UpButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchend", onMouseUp_DownButton);
      window.addEventListener("touchend", onMouseUp_DownButton);
    } else {
      this.divDown.addEventListener("mouseup", onMouseUp_DownButton);
      window.addEventListener("mouseup", onMouseUp_DownButton);
    }

    /*
     * Prevent an error with the focus of a text field
     */
    self.field.addEventListener("click", function(evt) {
      this.select();
      this.focus();
    });    
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var oldFieldValue;
  var oldValue;
  var resultValue;
  var decimals;
  var indexDot;
  var value;
  var limInf;
  var limSup;
  var cond1;
  var cond2;
  var cond3;
  var cond4;
  var answer_i_0;
  var answer_i_1;
  var tmpValue;
  var tmpAnswer;
  var regExpPattern;
  var answerValue;
  var evalMin;
  var evalMax;

  var hasTouchSupport;

  /**
   * Descartes text field control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the text field control
   */
  descartesJS.TextField = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }
    
    if (this.valueExprString === undefined) {
      if (this.onlyText) {
        this.valueExprString = '0';
      }
      else {
        this.valueExprString = "";
      }
    }

    // an empty string
    this.emptyString = false;

    // the evaluation of the control
    this.ok = 0;
    
    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // if the answer exist
    if (this.answer) {
      // the answer is encrypted
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }
      this.answerPattern = this.answer;

      this.answer = descartesJS.buildRegularExpresionsPatterns(this.answer, this.evaluator);

      if (this.onlyText) {
        // find the first answer pattern
        var sepIndex = this.answerPattern.indexOf("|");
        this.firstAnswer = (sepIndex == -1) ? this.answerPattern : this.answerPattern.substring(0, sepIndex);
      } else {
        // find the minimum value of the first interval of a numeric answer pattern
        this.firstAnswer = this.parser.parse( this.answerPattern.substring(1, this.answerPattern.indexOf(",")) );
      }
    }
    
    // if the text field is only text, then the value has to fulfill the validation norms
    if (this.onlyText) {
      if ( !(this.valueExprString.match(/^'/)) || !(this.valueExprString.match(/'$/)) ) {
        this.valueExpr = this.evaluator.parser.parse( "'" + this.valueExprString + "'" );
      }

      this.validateValue = function(value) {
        // value = value.replace(evaluator.parent.decimal_symbol, ".");

        if ( (value == "''") || (value == "'") ) {
          return "";
        }

        if ((value) && value.match(/^'/) && value.match(/'$/)) {
          return value.substring(1,value.length-1);
        }

        return value;
      }
      this.formatOutputValue = function(value) { 
        return value.toString(); 
      }
    }
    
    // if the name is only white spaces
    if (name.trim() == "") {
      name = "";
    }

    // control container
    this.containerControl = document.createElement("div");

    // the text field
    this.field = document.createElement("input");

    // the label
    this.label = document.createElement("label");

    // add the elements to the container
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.field);
    
    this.addControlContainer(this.containerControl);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();
    
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextField, descartesJS.Control);
  
  /**
   * Init the text field
   */
  descartesJS.TextField.prototype.init = function() {
    evaluator = this.evaluator;

    var name = evaluator.evalExpression(this.name).toString();
    this.label.innerHTML = name;
    
    // validate the initial value
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );

    // get the width of the initial value to determine the width of the text field
    var fieldValue = this.formatOutputValue(this.value);

    // find the font size of the text field
    this.fieldFontSize = descartesJS.getFieldFontSize(this.h);

    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px Arial");
    
    // widths are calculated for each element
    var labelWidth = parseInt(this.w/2);
    var minTFWidth = fieldValueSize;
    var minLabelWidth = descartesJS.getTextWidth(name, this.fieldFontSize+"px Arial");
    
    if (labelWidth < minLabelWidth) {
      labelWidth = minLabelWidth;
    }
    
    if (name == "") {
      labelWidth = 0;
    }
    
    if (this.w-labelWidth < minTFWidth) {
      labelWidth = this.w - minTFWidth;
    }
    
    if (labelWidth < 0) {
      labelWidth=0;
    }
    
    var fieldWidth = this.w - (labelWidth);
    
    this.containerControl.setAttribute("class", "DescartesTextFieldContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"TextField");
    this.field.setAttribute("class", "DescartesTextFieldField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + fieldWidth + "px; height : " + this.h + "px; left: " + labelWidth + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    this.field.value = fieldValue;
    
    this.label.setAttribute("class", "DescartesTextFieldLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
    // if the text field evaluates, get the ok value
    if (this.evaluate) {
      this.ok = this.evaluateAnswer();
    }
    
    // register the control value
    this.evaluator.setVariable(this.id, this.value);
    this.evaluator.setVariable(this.id+".ok", this.ok);

    this.oldValue = this.value;

    this.update();
  }

  /**
   * Update the text field
   */
  descartesJS.TextField.prototype.update = function() {
    evaluator = this.evaluator;

    this.label.innerHTML = evaluator.evalExpression(this.name).toString();    
    
    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = !this.activeIfValue;
    
    // hide or show the text field control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block";
    } else {
      this.containerControl.style.display = "none";
    }    
    
    // update the position and size
    this.updatePositionAndSize();

    if (document.activeElement != this.field) {
      oldFieldValue = this.field.value;
      oldValue = this.value;
          
      // update the text field value
      this.value = this.validateValue( evaluator.getVariable(this.id) );
      this.field.value = this.formatOutputValue(this.value);
      
      if ((this.value === oldValue) && (this.field.value != oldFieldValue)) {
        // update the spinner value
        this.value = this.validateValue( oldFieldValue );
        this.field.value = this.formatOutputValue(this.value);
      }
      
      // register the control value
      evaluator.setVariable(this.id, this.value);
    }
  }

  /**
   * Validate if the value is in the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number, 
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.TextField.prototype.validateValue = function(value) {
    // if the value is an empty text
    if ((value === "") || (value == "''")) {
      return "";
    }
    
    evaluator = this.evaluator;
    
    resultValue = parseFloat( evaluator.evalExpression( evaluator.parser.parse(value.toString().replace(this.parent.decimal_symbol, ".")) ) );
    
    // if the value is a string that do not represent a number, parseFloat return NaN
    if (isNaN(resultValue)) {
      resultValue = 0; 
    }
    
    evalMin = evaluator.evalExpression(this.min);
    if (evalMin == "") {
      evalMin = -Math.Infinity;
    }
    evalMax = evaluator.evalExpression(this.max);
    if (evalMax == "") {
      evalMax = Math.Infinity;
    }

    if (this.discrete) {
      var incr = evaluator.evalExpression(this.incr);
      resultValue = (incr==0) ? 0 : (incr * Math.round(resultValue / incr));
    }
    
    resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    
    return resultValue;    
  }
  
  /**
   * Format the value with the number of decimals, the exponential representation and the decimal symbol
   * @param {String} value tha value to format
   * @return {String} return the value with the format applyed
   */
  descartesJS.TextField.prototype.formatOutputValue = function(value) {
    if (value === "") {
      return "";
    }

    // call the draw function of the father (uber instead of super as it is reserved word)
    return this.uber.formatOutputValue.call(this, value);
  }

  /**
   * Change the text field value
   * @param {String} value is the new value to update the text field
   * @param {Boolean} update is a condition to update the parent or not
   */
  descartesJS.TextField.prototype.changeValue = function(value, update) {
    if (this.activeIfValue) {
      this.value = this.validateValue(value);
      this.field.value = this.formatOutputValue(this.value);
      
      // if the text field evaluates, get the ok value
      if (this.evaluate) {
        this.ok = this.evaluateAnswer();
      }
      
      // register the control value
      this.evaluator.setVariable(this.id, this.value);
      this.evaluator.setVariable(this.id+".ok", this.ok);
      
      this.updateAndExecAction();
    }    
  }
  
  /**
   * @return
   */
  descartesJS.TextField.prototype.evaluateAnswer = function() {
    return descartesJS.esCorrecto(this.answer, this.value, this.evaluator, this.answer);
  }
  
  /**
   * @return 
   */
  descartesJS.TextField.prototype.getFirstAnswer = function() {
    // if the text field has an answer pattern
    if (this.answer) {
      // if the text field is only text
      if (this.onlyText) {
        return this.firstAnswer;
      }
      // if the text field is numeric
      else {
        return this.evaluator.evalExpression(this.firstAnswer);
      }
    }
    // if the text field has not an anser pattern
    else {
      return "";
    }
  }  
    
  /**
   * Register the mouse and touch events
   */
  descartesJS.TextField.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;    

    // prevent the context menu display
    self.field.oncontextmenu = self.label.oncontextmenu = function() { return false; };

    // prevent the default events int the label    
    if (hasTouchSupport) {
      self.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; });
    } 
    else {
      self.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; });
    }

    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onBlur_textField(evt) {
      // self.update();
      self.changeValue(self.field.value, true);
    }
    this.field.addEventListener("blur", onBlur_textField);
        
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onKeyDown_TextField(evt) {
      if (self.activeIfValue) {
        // responds to enter
        if (evt.keyCode == 13) {
          self.changeValue(self.field.value, true);
        }
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField);

    /*
     * Prevent an error with the focus of a text field
     */
    self.field.addEventListener("click", function(evt) {
      this.select();
      this.focus();
    });    
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathAbs = Math.abs;

  var parser;
  var evaluator;

  var expr
  var val;
  var tempInd;
  var diff;
  var rest;
  var resultValue;
  var decimals;
  var indexDot;
  var subS;
  var hasTouchSupport;

  var closeBracket;
  var tmpText;
  var pos;
  var lastPos;
  var ignoreSquareBracket;
  var charAt;
  var charAtAnt;

  /**
   * Descartes menu control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the menu control
   */
  descartesJS.Menu = function(parent, values) {
    this.options = "";

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    parser = this.parser;
    evaluator = this.evaluator;

    // the evaluation of the control
    this.ok = 0;
    
    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // if the answer exist
    if (this.answer) {
      // the answer is encrypted
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }

      this.answer = parseInt(this.answer.split(",")[0].replace("[", "")) || 0;
    }

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }
    
    // options are separated using the comma as separator
    this.options = this.options.split(",");
    
    this.menuOptions = [];
    this.strValue = [];

    var splitOption;
    // parse the options
    for (var i=0, l=this.options.length; i<l; i++) {

      // split the options if has values with square backets (option[value])
      splitOption = this.customSplit(this.options[i]);

      // if divide the option only has a value, then are not specifying its value and take the order in which it appears
      if (splitOption.length == 1) {
        this.menuOptions.push( splitOption[0] );
        this.strValue.push( i.toString() );
      } 
      // if divide the option has two values, then has a value specified
      else if (splitOption.length == 2) {
        this.menuOptions.push( splitOption[0] );
        
        // if the value is an empty string, then asign the order value
        if (splitOption[1] == "") {
          this.strValue.push( i.toString() );
        }
        // if not, then use te especified value
        else {
          this.strValue.push(splitOption[1]);
        }
      }
    }

    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      // is an expression
      if ( (this.menuOptions[i].match(/^\[/)) && (this.menuOptions[i].match(/\]$/)) ) {
        this.menuOptions[i] = parser.parse( this.menuOptions[i].substring(1, this.menuOptions[i].length-1) );
      }
      // is a string
      else {
        this.menuOptions[i] = parser.parse( "'" + this.menuOptions[i] + "'" );
      }
    }

    // parse the option values
    for (var i=0, l=this.strValue.length; i<l; i++) {
      if ( (this.strValue[i].match(/^\[/)) && (this.strValue[i].match(/\]$/)) ) {
        this.strValue[i] = parser.parse( this.strValue[i].substring(1, this.strValue[i].length-1) );
      } 
      else {
        this.strValue[i] = parser.parse( this.strValue[i] );
      }
    }
   
    // control container
    this.containerControl = document.createElement("div");

    // the label
    this.label = document.createElement("label");
    
    // the menu
    this.select = document.createElement("select");

    // add the options to the menu
    var opt;
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      opt = document.createElement("option");
      opt.innerHTML = evaluator.evalExpression( this.menuOptions[i] );
      this.select.appendChild(opt);
    }

    // the text field
    this.field = document.createElement("input");

    // add the elements to the container
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.select);
    
    // if visible then show the text field
    if (this.visible) {
      this.containerControl.appendChild(this.field);
    }

    this.addControlContainer(this.containerControl);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the menu parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Menu, descartesJS.Control);

  var evaluator;

  /**
   * Init the menu
   */
  descartesJS.Menu.prototype.init = function() {
    evaluator = this.evaluator;

    var name = evaluator.evalExpression(this.name).toString();
    this.label.innerHTML = name;

    // find the font size of the text field
    this.fieldFontSize = (this.parent.version != 2) ? descartesJS.getFieldFontSize(this.h) : 10;

    var minchw = 0;
    var indMinTFw = 0;
    var minTFw = 0;
    var mow;
    this.value = evaluator.evalExpression(this.valueExpr);
    this.indexValue = this.getIndex(this.value);

    // find the widest choice to set the menu width
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      mow = descartesJS.getTextWidth( evaluator.evalExpression(this.menuOptions[i]).toString(), this.fieldFontSize+"px Arial" );
      if (mow > minchw) {
        minchw = mow;
        indMinTFw = i;
      }
    }
    
    minchw += 25;
    minTFw = descartesJS.getTextWidth( this.formatOutputValue(evaluator.evalExpression(this.strValue[indMinTFw])), this.fieldFontSize+"px Arial" ) + 7;
    
    var labelWidth = descartesJS.getTextWidth(name, this.fieldFontSize+"px Arial") +10;
    var fieldWidth = minTFw;

    if (name == "") {
      labelWidth = 0;
    }
    if (!this.visible) {
      fieldWidth = 0;
    }
    var chw = this.w - fieldWidth - labelWidth;
    while (chw<minchw && labelWidth>0) {
      labelWidth--;
      chw++;
    }
    while (chw<minchw && fieldWidth>0) {
      fieldWidth--;
      chw++;
    }
    while (labelWidth+chw+fieldWidth+1<this.w) {
      chw++;
      fieldWidth++;
    }
    var chx = labelWidth;
    var TFx = chx + chw;
    fieldWidth = this.w - TFx;
    
    var fieldValue = this.formatOutputValue( evaluator.evalExpression(this.strValue[this.indexValue]) );

    this.containerControl.setAttribute("class", "DescartesMenuContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.label.setAttribute("class", "DescartesMenuLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"menu");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesMenuField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + fieldWidth + "px; height : " + this.h + "px; left: " + TFx + "px;");
    this.field.setAttribute("tabindex", this.tabindex);

    this.select.setAttribute("id", this.id+"menuSelect");
    this.select.setAttribute("class", "DescartesMenuSelect");
    this.select.setAttribute("style", "text-align: left; font-size: " + this.fieldFontSize + "px; line-height: " + this.h + "px; width : " + chw + "px; height : " + this.h + "px; left: " + chx + "px; border-color: #7a8a99; border-width: 1.5px; border-style: solid; background-color: #eeeeee;");
    this.select.setAttribute("tabindex", this.tabindex);
    this.select.selectedIndex = this.indexValue;

    // register the control value
    evaluator.setVariable(this.id, parseFloat(fieldValue));

    this.update();
  }

  /**
   * Update the menu
   */
  descartesJS.Menu.prototype.update = function() { 
    evaluator = this.evaluator;

    this.label.innerHTML = evaluator.evalExpression(this.name).toString();

    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      this.select.options[i].innerHTML = evaluator.evalExpression( this.menuOptions[i] );
    }
    
    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = (this.activeIfValue) ? false : true;
    this.select.disabled = (this.activeIfValue) ? false : true;
    
    // hide or show the menu control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block";
    } else {
      this.click = false;
      this.containerControl.style.display = "none";
    }

    // update the position and size
    this.updatePositionAndSize();

    if (document.activeElement != this.select) {
      // update the value of the menu
      this.value = evaluator.getVariable(this.id);
      if (isNaN(this.value)) {
        this.value = 0;
      }
      this.field.value = this.formatOutputValue(this.value);
      
      // register the control value
      evaluator.setVariable(this.id, parseFloat(this.value));
      this.select.selectedIndex = parseFloat(this.getIndex(this.value));
    }

    this.ok = (this.value == this.answer) ? 1 : 0;
    this.evaluator.setVariable(this.id+".ok", this.ok);    
  }

  /**
   *
   */
  descartesJS.Menu.prototype.customSplit = function(op) {
    closeBracket = false;
    tmpText = "";
    pos = 0;
    lastPos = 0;
    ignoreSquareBracket = -1;

    while (pos < op.length) {
      charAt = op.charAt(pos);
      charAtAnt = op.charAt(pos-1);

      // find a open square bracket
      if ((charAt === "[") && (ignoreSquareBracket === -1)) {
        if ((closeBracket) || (tmpText != "")) {
          tmpText += "¦";
        }

        lastPos = pos;
        ignoreSquareBracket++;

      }
      else if (charAt === "[") {
        ignoreSquareBracket++;
      }

      // if find a close square bracket add the strin +'
      else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
        closeBracket = true;
        lastPos = pos+1;
        ignoreSquareBracket--;
      }
      
      else if (op.charAt(pos) == "]") {
        ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
      } 

      tmpText = tmpText + op.charAt(pos);

      pos++;
    }

    return tmpText.split("¦");
  }

  /**
   * Get the selected index
   * @param {String} val the value to find the index
   * @return {Number} return the index asociated to the value
   */
  descartesJS.Menu.prototype.getIndex = function(val) {
    val = parseFloat( (val.toString()).replace(this.parent.decimal_symbol, ".") );
    tempInd = -1;
    diff = Infinity;
    
    for (var i=0, l=this.strValue.length; i<l; i++) {
      rest = MathAbs( val - parseFloat( this.evaluator.evalExpression(this.strValue[i])) );
      
      if (rest <= diff) {
        diff = rest;
        tempInd = i;
      }
    }
        
    return tempInd;
  }  

  /**
   * Change the menu value
   */
  descartesJS.Menu.prototype.changeValue = function() {
    if (this.activeIfValue) {
      // register the control value
      this.evaluator.setVariable(this.id, this.value);

      this.updateAndExecAction();
    }
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Menu.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;

    // prevent the context menu display
    self.select.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = function() { return false; };

    if (hasTouchSupport) {
      self.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; })
    } 
    else {
      self.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; })
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onChangeSelect(evt) {
      self.value = self.evaluator.evalExpression( self.strValue[this.selectedIndex] );
      self.field.value = self.formatOutputValue(self.value);
      self.evaluator.setVariable(self.id, self.field.value);
      
      self.changeValue();
      
      evt.preventDefault();
    }
    this.select.addEventListener("change", onChangeSelect);
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responds to enter
      if (evt.keyCode == 13) {
        self.indexValue = self.getIndex(self.field.value);

        self.value = self.evaluator.evalExpression( self.strValue[self.indexValue] );
        self.field.value = self.formatOutputValue(self.indexValue);
        self.select.selectedIndex = self.indexValue;
        
        self.changeValue();
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField);

    /*
     * Prevent an error with the focus of a text field
     */
    self.field.addEventListener("click", function(evt) {
      this.select();      
      this.focus();
    });
    self.select.addEventListener("click", function(evt) {
      this.focus();
    });
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  var horizontalScrollbar = "h";
  var verticalScrollbar = "v";

  var evaluator;
  var self;
  var fieldValue;
  var expr;
  var ctx;
  var tmpH;
  var tmpW;
  var desp;
  var tmpPos;
  var smw;
  var resultValue;
  var incr;
  var decimals;
  var indexDot;
  var subS;
  var newValue;
  var limInf;
  var limSup;
  var min;
  var max;

  var hasTouchSupport;

  var tmpContainer;
  var tmpDisplay;
  var pos;

  /**
   * Descartes scrollbar control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the scrollbar control
   */
  descartesJS.Scrollbar = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }

    this.orientation = (this.w >= this.h) ? horizontalScrollbar : verticalScrollbar;

    // control container
    this.containerControl = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");

    // the scroll handler
    this.scrollManipulator = document.createElement("div");

    // the label
    this.label = document.createElement("label");

    // add the elements to the container
    this.containerControl.appendChild(this.canvas);
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.divUp);
    this.containerControl.appendChild(this.divDown);
    this.containerControl.appendChild(this.field);
    this.containerControl.appendChild(this.scrollManipulator);
    
    this.addControlContainer(this.containerControl);

    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the menu parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Scrollbar, descartesJS.Control);

  /**
   * Init the scrollbar
   */
  descartesJS.Scrollbar.prototype.init = function() {
    evaluator = this.evaluator;
    
    // get the offset of the scrollbar container to get the correct mouse cordinates
    this.findOffset();

    // if has decimasl the increment are the interval [min, max] dividen by 100, if not then the incremente is 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }

    // validate the initial value
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );

    // format the output value
    fieldValue = this.formatOutputValue(this.value);

    expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    }
    this.orientation = (this.w >= this.h) ? horizontalScrollbar : verticalScrollbar;

    // init the scroll configuration
    this.initScroll(fieldValue);

    // change the value if really need a change
    this.changeScrollPositionFromValue();
    this.prePos = this.pos;
    // register the control value
    evaluator.setVariable(this.id, this.value);
  }

  /**
   * Init the scroll configuration
   */
  descartesJS.Scrollbar.prototype.initScroll = function(fieldValue) {
    self = this;
    evaluator = self.evaluator;

    var name = evaluator.evalExpression(self.name).toString();
    self.label.innerHTML = name;

    var defaultHeight = (self.orientation === verticalScrollbar) ? parseInt(19 + (5*(self.h-100))/100) : self.h;

    // find the font size of the text field
    self.fieldFontSize = (self.orientation === verticalScrollbar) ? (defaultHeight - parseInt(self.h/20) -1) : ((self.parent.version !== 2) ? descartesJS.getFieldFontSize(defaultHeight) : 10);

    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", self.fieldFontSize+"px Arial");
    
    var spaceH = self.parent.getSpaceById(self.spaceID).h;
    
    self.labelHeight = (name == "") ? 0 : defaultHeight;
    self.fieldHeight = (self.visible == "") ? 0 : defaultHeight;
    
    // vertical orientation
    if (self.orientation === verticalScrollbar) {
      self.canvasWidth = self.w;
      self.canvasHeight = self.h - self.labelHeight - self.fieldHeight;    

      if (self.canvasHeight + self.y - spaceH >= 18) {
        self.canvasHeight = spaceH;
      }
      
      var sbx = 0;
      var sby = self.fieldHeight;
      var TFy = sby + self.canvasHeight;

      self.canvasX = 0;
      self.canvasY = self.fieldHeight;
      
      self.labelWidth = self.w;
      self.labelY = TFy;
      
      self.upWidth = self.downW = self.w;
      self.upHeight = self.downH = 15;
      self.upX = 0;
      self.upY = self.fieldHeight;
      self.downX = 0;
      self.downY = TFy-self.downH;
      
      self.fieldWidth = self.w;
      self.fieldX = 0;
      
      self.scrollManipulatorW = self.w;
      self.scrollManipulatorH = parseInt( (self.canvasHeight -self.upHeight -self.downH -self.labelHeight -self.fieldHeight)/10 );
      self.scrollManipulatorH = (self.scrollManipulatorH < 15) ? 15 : self.scrollManipulatorH;
      
      self.scrollManipulatorLimInf = TFy -self.downH -self.scrollManipulatorH;
      self.scrollManipulatorLimSup = sby+self.downH;
    }
    else {
      var minsbw = 58;
      
      // get the width of all elements in the scrollbar
      var minLabelWidth = descartesJS.getTextWidth(name, self.fieldFontSize+"px Arial") +10;
      self.labelWidth = minLabelWidth;
      var minTFWidth = fieldValueSize;
      self.fieldWidth = minTFWidth;
      
      if (name == "") {
        self.labelWidth = 0;
      }
      
      if (!self.visible) {
        self.fieldWidth = 0;
      }
      
      var sbw = self.w - self.fieldWidth - self.labelWidth;
      while ((sbw < minsbw) && (self.labelWidth > 0)) {
        self.labelWidth--;
        sbw++;
      }
      while ((sbw < minsbw) && (self.fieldWidth > 0)) {
        self.fieldWidth--;
        sbw++;
      }
      
      var sbx = self.labelWidth;
      var sby = 0;
      var TFx = sbx + sbw;
      self.fieldWidth = self.w - TFx;
      
      self.canvasWidth = sbw;
      self.canvasHeight = self.h;
      self.canvasX = self.labelWidth;
      self.canvasY = 0;

      self.fieldX = self.canvasWidth + self.labelWidth;
      
      self.labelHeight = self.h;
      self.labelY = 0;
      
      self.upWidth = self.downW = 15;
      self.upHeight = self.downH = self.h;
      self.upX = TFx-self.downW;
      self.upY = 0;
      self.downX = self.labelWidth;
      self.downY = 0;
      
      self.scrollManipulatorW = parseInt( (self.canvasWidth-self.upWidth-self.downW)/10 );
      self.scrollManipulatorW = (self.scrollManipulatorW < 15) ? 15 : self.scrollManipulatorW;
      self.scrollManipulatorH = self.h;
      
      self.scrollManipulatorLimInf = sbx+self.downW;
      self.scrollManipulatorLimSup = sbx+self.canvasWidth-self.downW -self.scrollManipulatorW;
    }

    self.containerControl.setAttribute("class", "DescartesScrollbarContainer");
    self.containerControl.setAttribute("style", "width: " + self.w + "px; height: " + self.h + "px; left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");
    
    self.canvas.setAttribute("width", self.w+"px");
    self.canvas.setAttribute("height", self.h+"px");
    self.canvas.setAttribute("style", "position: absolute; left: 0px; top: 0px;");    
    self.ctx = self.canvas.getContext("2d");
  
    self.divUp.setAttribute("class", "DescartesCatcher");
    self.divUp.setAttribute("style", "width : " + self.upWidth + "px; height : " + self.upHeight + "px; left: " + self.upX + "px; top: " + self.upY + "px;");
    self.divDown.setAttribute("class", "DescartesCatcher");
    self.divDown.setAttribute("style", "width : " + self.downW + "px; height : " + self.downH + "px; left: " + self.downX + "px; top: " + self.downY + "px;");
    
    self.scrollManipulator.setAttribute("class", "DescartesCatcher");
    self.scrollManipulator.setAttribute("style", "width : " + self.scrollManipulatorW + "px; height : " + self.scrollManipulatorH + "px;");
    self.scrollManipulator.style.top = ((self.orientation === verticalScrollbar) ? self.scrollManipulatorLimInf : 0) + "px";
    self.scrollManipulator.style.left = ((self.orientation === verticalScrollbar) ? 0 : self.scrollManipulatorLimInf) + "px";
        
    // style the text field
    self.field.setAttribute("type", "text");
    self.field.setAttribute("id", self.id+"scrollbar");
    self.field.setAttribute("class", "DescartesScrollbarField");
    self.field.setAttribute("style", "font-size: " + self.fieldFontSize + "px; width : " + self.fieldWidth + "px; height : " + self.fieldHeight + "px; left: " + self.fieldX + "px; top: 0px;");
    self.field.value = fieldValue;
    if (self.fieldHeight === 0) {
      self.field.style.display = "none";
    }
    
    // style the label
    self.label.setAttribute("class", "DescartesScrollbarLabel");
    self.label.setAttribute("style", "font-size:" + self.fieldFontSize + "px; width: " + self.labelWidth + "px; height: " + self.labelHeight + "px; line-height: " + self.labelHeight + "px; left: 0px; top:" + self.labelY + "px;");
    
  }
    
  /**
   * Update the scrollbar
   */
  descartesJS.Scrollbar.prototype.update = function() {
    evaluator = this.evaluator;

    this.label.innerHTML = evaluator.evalExpression(this.name).toString();

    // the incremente is the interval [min, max] dividen by 100 if has decimasl, if not then the incremente is 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = !this.activeIfValue;
    
    // hide or show the menu control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block";
      this.draw();
    } else {
      this.containerControl.style.display = "none";
    }
    
    // update the position and size
    this.updatePositionAndSize();

    // update the value of the menu
    var tmpValue = this.validateValue( evaluator.getVariable(this.id) );
    if ( (tmpValue != this.value) && !((Math.abs(tmpValue - this.value)>0) && (Math.abs(tmpValue - this.value)<.000000001))) {
      this.value = tmpValue;
      this.changeScrollPositionFromValue();
      this.prePos = this.pos;
    }

    this.value = tmpValue;
    this.field.value = this.formatOutputValue(this.value);

    // register the control value
    evaluator.setVariable(this.id, this.value);
  }

  /**
   * Draw the scrollbar
   */
  descartesJS.Scrollbar.prototype.draw = function() {
    self = this;
    ctx = self.ctx;

    tmpW = MathFloor(this.w);
    tmpH = MathFloor(this.h);

    ctx.fillStyle = "#e0e4e8";
    ctx.fillRect(0, 0, tmpW, tmpH);

    ctx.strokeStyle = "#7a8a99";

    if (self.down) {
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);
    }
    ctx.strokeRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);

    if (self.up) {
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);
    }
    ctx.strokeRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);

    desp = 4;
    ctx.fillStyle = "black";
    ctx.beginPath();

    if (self.orientation === horizontalScrollbar) {
      // triangle in the buttons
      ctx.moveTo(self.downX +desp, self.downH/2);
      ctx.lineTo(self.downX +self.downW -desp, desp);
      ctx.lineTo(self.downX +self.downW -desp, self.downH -desp);
      ctx.moveTo(self.upX + self.upWidth -desp, self.downH/2);
      ctx.lineTo(self.upX +desp, desp);
      ctx.lineTo(self.upX +desp, self.downH -desp);
      ctx.fill();

      if (self.activeIfValue) {
        // scroll handler
        tmpPos = MathFloor(self.pos);
        ctx.fillStyle = "#ccdcec";
        ctx.fillRect(tmpPos+.5, 0, MathFloor(self.scrollManipulatorW), tmpH);
        ctx.strokeStyle = "#6382bf";
        ctx.strokeRect(tmpPos+.5, 0, MathFloor(self.scrollManipulatorW), tmpH);

        // scroll handler lines
        smw = MathFloor(self.scrollManipulatorW/2);
        ctx.beginPath();
        ctx.moveTo(tmpPos+smw+.5-2, 3);
        ctx.lineTo(tmpPos+smw+.5-2, tmpH-3);
        ctx.moveTo(tmpPos+smw+.5,   3);
        ctx.lineTo(tmpPos+smw+.5,   tmpH-3);
        ctx.moveTo(tmpPos+smw+.5+2, 3);
        ctx.lineTo(tmpPos+smw+.5+2, tmpH-3);
        ctx.stroke();
      }

    }
    else {
      // triangle in the buttons
      ctx.moveTo(self.downX +self.downW/2, self.downY +self.downH -desp);
      ctx.lineTo(self.downX +desp, self.downY +desp);
      ctx.lineTo(self.downX +self.downW -desp, self.downY +desp);
      ctx.moveTo(self.upX +self.upWidth/2, self.upY +desp);
      ctx.lineTo(self.upX +desp, self.upY +self.upHeight -desp);
      ctx.lineTo(self.upX +self.upWidth -desp, self.upY +self.upHeight -desp);
      ctx.fill();

      if (self.activeIfValue) {
        // scroll handler
        tmpPos = MathFloor(self.pos);
        ctx.fillStyle = "#ccdcec";
        ctx.fillRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollManipulatorH));
        ctx.strokeStyle = "#6382bf";
        ctx.strokeRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollManipulatorH));

        // scroll handler lines
        smw = MathFloor(self.scrollManipulatorH/2);
        ctx.beginPath();
        ctx.moveTo(3,      tmpPos+smw+.5-2);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5-2);
        ctx.moveTo(3,      tmpPos+smw+.5);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5);
        ctx.moveTo(3,      tmpPos+smw+.5+2);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5+2);
        ctx.stroke();
      }
    }

    // external border
    ctx.strokeRect(.5, .5, tmpW-1, tmpH-1);

    // inactive shade
    if (!self.activeIfValue) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, tmpW, tmpH.h);
    }
  }
  
  /**
   * Validate if the value is the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number, 
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.Scrollbar.prototype.validateValue = function(value) {
    evaluator = this.evaluator;
    resultValue = value.toString();
    resultValue = parseFloat( resultValue.replace(this.parent.decimal_symbol, ".") );

    // if the value is a string that do not represent a number, parseFloat return NaN
    if (isNaN(resultValue)) {
      resultValue = 0; 
    }
    
    // if is less than the lower limit
    this.minimo = evaluator.evalExpression(this.min);
    if (resultValue < this.minimo) {
      this.value = null;
      resultValue = this.minimo;
    }

    // if si greater than the upper limit
    this.maximo = evaluator.evalExpression(this.max);
    if (resultValue > this.maximo) {
      this.value = null;
      resultValue = this.maximo;
    }

    incr = this.incr;
    resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

//     if (this.discrete) {
//       var incr = this.incr;
//       resultValue = incr * Math.round(resultValue / incr);
//     }

    if (this.fixed) {
      resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    }

    return resultValue;
  }

  /**
   * Increase the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.incr );
  }
  
  /**
   * Decrease the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.incr );
  }

  /**
   * Increase by then the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.increase10 = function() {
    desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == horizontalScrollbar) {
      if (this.clickPos.x > this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }
    } else {
      if (this.clickPos.y < this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }      
    }
  }
  
  /**
   * Decrease by then the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.decrease10 = function() {
    desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == horizontalScrollbar) {
      if (this.clickPos.x < this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    } else {
      if (this.clickPos.y > this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    }
  }
  
  /**
   * Change the scrollbar value
   */
  descartesJS.Scrollbar.prototype.changeValue = function(value) {
    if (this.activeIfValue) {
      newValue = this.validateValue(value);

      // change the value if really need a change
      if (newValue != this.value) {
        this.value = newValue;
        this.field.value = this.formatOutputValue(newValue);
        
        this.changeScrollPositionFromValue();

        this.prePos = this.pos;

        // register the control value
        this.evaluator.setVariable(this.id, this.value);

        this.updateAndExecAction();
      }
    }
  }

  /**
   * Change the value when the scroll handler move
   */
  descartesJS.Scrollbar.prototype.changeValueForScrollMovement = function() {
    evaluator = this.evaluator;
    limInf = this.scrollManipulatorLimInf;
    limSup = this.scrollManipulatorLimSup;
    min = evaluator.evalExpression(this.min);
    max = evaluator.evalExpression(this.max);
    incr = this.incr;
        
    newValue = MathFloor( (((this.pos-limInf)*(max-min))/(limSup-limInf))/incr )*incr  +min;
    
    // if the value change, the update everything
    if (newValue != this.value) {
      this.value = newValue;
      this.field.value = this.formatOutputValue(newValue);
      
      // register the control value
      evaluator.setVariable(this.id, this.value);
      
      // update the controls
      this.parent.updateControls();
      // execute the acction
      this.actionExec.execute();
      // update again the controls
      this.parent.update();
    }
  }
  
  /**
   * Change the position of the scroll handler give the value
   */
  descartesJS.Scrollbar.prototype.changeScrollPositionFromValue = function() {
    evaluator = this.evaluator;
    limInf = this.scrollManipulatorLimInf;
    limSup = this.scrollManipulatorLimSup;
    min = evaluator.evalExpression(this.min);
    max = evaluator.evalExpression(this.max);
    incr = this.incr;
    
    this.pos = (((this.value-min)*(limSup-limInf))/(max-min))+limInf;
    
    if (this.orientation == horizontalScrollbar) {
      // this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.scrollManipulatorW + "px; height : " + this.h + "px; left: " + this.pos + "px; top: 0px;");
      this.scrollManipulator.style.left = this.pos + "px";
    } else {
      // this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.scrollManipulatorH + "px; left: 0px; top: " + this.pos + "px;");
      this.scrollManipulator.style.top = this.pos + "px";
    }
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Scrollbar.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;
    var delay = (hasTouchSupport) ? 500 : 200;
    var timer;

    // prevent the context menu display
    self.canvas.oncontextmenu = self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = self.scrollManipulator.oncontextmenu = function () { return false; };

    /**
     * Repeat a function during a period of time, when the user click and hold the click in the button
     * @param {Number} delayTime the delay of time between the function repetition
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
     * @private
     */    
    function repeat(delayTime, fun, firstTime, limit) {
      clearInterval(timer);

      if ((self.up || self.down || self.canvasClick) && (Math.abs(self.value - limit) > .0000001)) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun, false, limit); }, delayTime);
      }
    }
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responds to enter
      if (evt.keyCode == 13) {
        self.changeValue(self.field.value);
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField);
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onMouseDown_canvas(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.clickPos = self.getCursorPosition(evt);
          self.canvasClick = true;
          
          if (self.orientation == horizontalScrollbar) {
            if (self.clickPos.x < self.prePos) {
              repeat(delay, self.decrease10, true, self.minimo);
            } 
            else {
              repeat(delay, self.increase10, true, self.maximo);
            }
          } 
          else {
            if (self.clickPos.y < self.prePos) {
              repeat(delay, self.increase10, true, self.maximo);
            } 
            else {
              repeat(delay, self.decrease10, true, self.minimo);
            }
          }
        }
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown_canvas);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown_canvas);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_Canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_Canvas);
    } else {
      window.addEventListener("mouseup", onMouseUp_Canvas);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove_Canvas(evt) {
      if (self.canvasClick == true) {
        self.clickPos = self.getCursorPosition(evt);
        evt.preventDefault();
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchmove", onMouseMove_Canvas);
    } else {
      this.canvas.addEventListener("mousemove", onMouseMove_Canvas);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown_scrollManipulator(evt) {
      if (self.activeIfValue) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("mouseup", onMouseUp_scrollManipulator);
        window.addEventListener("mousemove", onMouseMove_scrollManipulator);
        
        evt.preventDefault();
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchStart_scrollManipulator(evt) {
      if (self.activeIfValue) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("touchend", onTouchEnd_scrollManipulator);
        window.addEventListener("touchmove", onToucheMove_scrollManipulator);
        
        evt.preventDefault();
      }    
    }
    
    if (hasTouchSupport) {
      this.scrollManipulator.addEventListener("touchstart", onTouchStart_scrollManipulator);
    } else {
      this.scrollManipulator.addEventListener("mousedown", onMouseDown_scrollManipulator);
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseUp_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("mouseup", onMouseUp_scrollManipulator, false);
      window.removeEventListener("mousemove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onTouchEnd_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("touchend", onTouchEnd_scrollManipulator, false);
      window.removeEventListener("touchmove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseMove_scrollManipulator(evt) {
      var newPos = self.getCursorPosition(evt);

      if (self.orientation == horizontalScrollbar) {
        self.pos = self.prePos - (self.initPos.x - newPos.x);

        if (self.pos < self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos > self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }

        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.scrollManipulatorW + "px; height : " + self.h + "px; left: " + self.pos + "px; top: 0px;"); 
      } else {
        self.pos = self.prePos - (self.initPos.y - newPos.y);

        if (self.pos > self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos < self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }
       
        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.w + "px; height : " + self.scrollManipulatorH + "px; left: 0px; top: " + self.pos + "px;"); 
      }
      
      self.changeValueForScrollMovement();

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown_UpButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.up = true;
          repeat(delay, self.increase, true, self.maximo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton);
    } else {
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton);
    }
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onMouseDown_DownButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.down = true;
          repeat(delay, self.decrease, true, self.minimo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton);
    } else {
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();      
    }
    if (!hasTouchSupport) {
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton);
    }

    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseOut_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();
      self.draw();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_UpButton);
    } else {
      window.addEventListener("mouseup", onMouseUp_UpButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
      self.draw();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_DownButton);
    } else {
      window.addEventListener("mouseup", onMouseUp_DownButton);
    }
    
  }
  
 /**
   * Find the offset postion of a scrollbar
   */
  descartesJS.Scrollbar.prototype.findOffset = function() {
    tmpContainer = this.containerControl;

    this.offsetLeft = 0;
    this.offsetTop = 0;

    // store the display style
    tmpDisplay = this.containerControl.style.display;

    // make visible the element to get the offset values
    this.containerControl.style.display = "block";

    while (tmpContainer) {
      this.offsetLeft += (tmpContainer.offsetLeft || 0);
      this.offsetTop  += (tmpContainer.offsetTop || 0);
      
      tmpContainer = tmpContainer.parentNode;
    }

    // restore the display style
    this.containerControl.style.display = tmpDisplay;
  }

  /**
   * Get the cursor position of the mouse in absolute coordinates respect to space where it is
   * @param {Event} evt the event containing the mouse position
   * @return {Object} return an object with the cursor position
   */
  descartesJS.Scrollbar.prototype.getCursorPosition = function(evt) {
    pos = descartesJS.getCursorPosition(evt);

    return { x: pos.x - this.offsetLeft, 
             y: pos.y - this.offsetTop 
           };
  }  

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes audio control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the audio control
   */
  descartesJS.Audio = function(parent, values) {
    /**
     * condition to show the controls
     * type {Boolean}
     * @private
     */
    this.controls = true;

    this.file = "";

    this.oldDrawIf = 0;

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    var self = this;

    // the audio position and size
    var expr = self.evaluator.evalExpression(self.expresion);
    if (expr[0].length == 4) {
      self.w = expr[0][2];
      self.h = expr[0][3];
    } else {
      self.w = 200;
      self.h = 28;
    }
    
    self.audio = self.parent.getAudio(self.file);

    if (self.autoplay) {
      self.audio.setAttribute("autoplay", "autoplay");
      self.audio.play();
    }
    
    if (self.loop) {
      self.audio.setAttribute("loop", "loop");
    }

    if (self.controls) {
      self.audio.setAttribute("controls", "controls");
    }

    self.audio.setAttribute("style", "position: absolute; width: " + self.w + "px; left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    self.addControlContainer(self.audio);

    //
    self.evaluator.setFunction(self.id + ".play", function() {
      self.audio.play();
    });
    self.evaluator.setFunction(self.id + ".pause", function() {
      self.audio.pause();
    });
    self.evaluator.setFunction(self.id + ".stop", function() {
      self.audio.pause();
      self.audio.currentTime = 0.0;
    });
    self.audio.addEventListener("timeupdate", function(evt) {
      self.evaluator.setVariable(self.id + ".currentTime", self.audio.currentTime);
      // self.parent.update();
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Audio, descartesJS.Control);

  /**
   * Init the audio
   */
  descartesJS.Audio.prototype.init = function() {
    // this.audio.setAttribute("width", this.w);
    // this.audio.setAttribute("height", this.h);
    this.audio.style.left = this.x + "px";
    this.audio.style.top  = this.y + "px";

    this.update();
  }

  var drawif;
  /**
   * Update the audio control
   */
  descartesJS.Audio.prototype.update = function() {
    evaluator = this.evaluator;

    drawif = evaluator.evalExpression(this.drawif) > 0
    
    // hide or show the audio control
    if (drawif) {
      this.audio.style.display = "block";
    } else {
      this.audio.style.display = "none";

      if (drawif !== this.oldDrawIf) {
        this.audio.pause();
      }
    }    

    this.oldDrawIf = drawif;

    // update the position and size
    this.updatePositionAndSize();
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes video control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the video control
   */
  descartesJS.Video = function(parent, values) {
    /**
     * condition to show the controls
     * type {Boolean}
     * @private
     */
    this.controls = true;

    this.file = "";

    this.oldDrawIf = 0;    

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    var self = this;
    evaluator = self.evaluator;    
    
    var expr = self.evaluator.evalExpression(self.expresion);
    if (expr[0].length == 4) {
      self.w = expr[0][2];
      self.h = expr[0][3];
    } else {
      self.w = null;
      self.h = null;
    }
    
    self.video = document.createElement("video");

    if (self.autoplay) {
      self.video.setAttribute("autoplay", "autoplay");
    }

    if (self.loop) {
      self.video.setAttribute("loop", "loop");
    }

    if (self.controls) {
      self.video.setAttribute("controls", "controls");
    }

    if (self.poster) {
      self.video.setAttribute("poster", self.poster);
    }

    if (self.w) {
      self.video.setAttribute("width", self.w);
      self.video.setAttribute("height", self.h);
    }
    self.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + self.x + "px; top: " + self.y + "px;");
    
    var filename = self.file;
    var indexDot = filename.lastIndexOf(".");
    
    if (indexDot != -1) {
      filename = self.file.substring(0, indexDot);
    }
    
    var source;
    //mp4
    if (self.video.canPlayType("video/mp4")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".mp4");
      source.setAttribute("type", "video/mp4");
      self.video.appendChild(source);
    }
    // ogg, ogv
    if (self.video.canPlayType("video/ogg")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogg");
      source.setAttribute("type", "video/ogg");
      self.video.appendChild(source);

      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogv");
      source.setAttribute("type", "video/ogg");
      self.video.appendChild(source);
    }
    // webm
    if (self.video.canPlayType("video/webm")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".webm");
      source.setAttribute("type", "video/webm");
      self.video.appendChild(source);
    }

    self.addControlContainer(self.video);

    //
    self.evaluator.setFunction(self.id + ".play", function() {
      self.video.play();
    });
    self.evaluator.setFunction(self.id + ".pause", function() {
      self.video.pause();
    });
    self.evaluator.setFunction(self.id + ".stop", function() {
      self.video.pause();
      self.video.currentTime = 0.0;
    });
    self.video.addEventListener("timeupdate", function(evt) {
      self.evaluator.setVariable(self.id + ".currentTime", self.video.currentTime);
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Video, descartesJS.Control);

  /**
   * Init the audio
   */
  descartesJS.Video.prototype.init = function() {
    // this.video.setAttribute("width", this.w);
    // this.video.setAttribute("height", this.h);
    this.video.style.left = this.x + "px";
    this.video.style.top  = this.y + "px";

    this.update();
  }

  var drawif;
  /**
   * Update the video control
   */
  descartesJS.Video.prototype.update = function() {
    evaluator = this.evaluator;

    drawif = evaluator.evalExpression(this.drawif) > 0

    // hide or show the video control
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";

      if (drawif !== this.oldDrawIf) {
        this.video.pause();
      }
    }

    this.oldDrawIf = drawif;

    // update the position and size
    this.updatePositionAndSize();    
  }
    
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var evaluator;
  var displaceY;

  /**
   * Descartes scrollbar control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the scrollbar control
   */
  descartesJS.TextArea = function(parent, values){
    this.font = "Monospaced,PLAIN,12";

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // always show in the interior region
    this.region = "interior";

    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // la respuesta existe
    if (this.answer) {
      // la respuesta esta encriptada
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }

      var parseAnswer = this.parent.lessonParser.parseText(this.answer);
    }

    // control container
    this.containerControl = document.createElement("div");

    // the text area
    this.textArea = document.createElement("div");
    this.textAreaAnswer = document.createElement("div");

    // show answer button
    this.showButton = document.createElement("div");
    
    // active cover
    this.activeCover = document.createElement("div");
    
    // add the elements to the container
    this.containerControl.appendChild(this.textArea);
    this.containerControl.appendChild(this.textAreaAnswer);
    this.containerControl.appendChild(this.showButton);
    this.containerControl.appendChild(this.activeCover);
    
    this.addControlContainer(this.containerControl);
    
    this.showAnswer = false;

    // plain text
    if ( (this.text == undefined) || (this.text.type == "simpleText")) {
      this.text = this.rawText || "";
    }
    // rtf text
    else {
      if (this.text.hasFormula) {
        this.text = this.rawText;
      }
      else {
        this.text = this.text.toHTML();
      }
    }
    
    // rtf answer
    if ((parseAnswer) && (parseAnswer.type != "simpleText")) {
      if (!this.text.hasFormula) {
        this.answer = parseAnswer.toHTML();
      }
      else {
        this.answer = "";
      }
    }
   
    this.evaluator.setVariable(this.id, this.text);

    this.drawButton();
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextArea, descartesJS.Control);

  /**
   * Init the text area
   */
  descartesJS.TextArea.prototype.init = function() {
    displaceY = (this.answer) ? 28 : 8;
    evaluator = this.evaluator;
    
    var newText;

    if (this.text.match(/<span/)) {
      newText = this.text;
    }
    else {
      newText = this.text.replace(/\\n/g, "<br/>");
    } 

    this.containerControl.setAttribute("class", "DescartesTextAreaContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    this.containerControl.setAttribute("spellcheck", "false");

    // text area
    this.textArea.setAttribute("class", "DescartesTextAreaContainer");
    this.textArea.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textArea.setAttribute("contenteditable", "true");  
    this.textArea.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;' >" + newText + "</span>";
    
    // text area answer
    this.textAreaAnswer.setAttribute("class", "DescartesTextAreaContainer");
    this.textAreaAnswer.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textAreaAnswer.style.display = (this.showAnswer) ? "block" : "none";
    this.textAreaAnswer.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;'>" + this.answer + "</span>";
    
    // show answer button
    this.showButton.setAttribute("style", "width: 20px; height: 16px; position: absolute; bottom: 4px; right: 4px; cursor: pointer;");
    this.showButton.style.backgroundImage = "url(" + this.imageUnPush + ")";
    this.showButton.style.display = (this.answer) ? "block" : "none";
    this.showButton.innerHTML = "<span style='position: relative; top: 2px; text-align: center; font: 9px Arial'> S </span>";

    this.activeCover.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");

    this.update();
  }
  
  /**
   * Draw the show/hide button
   */
  descartesJS.TextArea.prototype.drawButton = function() {
    var w = 20;
    var h = 16;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    var ctx = canvas.getContext("2d");

    this.canvas = canvas;
    this.ctx = ctx;
    this.createGradient(w, h);

    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = this.linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, w-1, 0, w-1, h, "rgba(0,0,0,"+(0x80/255)+")");
    descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
    descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");
    this.imageUnPush = canvas.toDataURL();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = this.linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, 0, 0, 0, h-2, "gray");
    descartesJS.drawLine(ctx, 0, 0, w-1, 0, "gray"); 
    ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
    ctx.fillRect(0, 0, this.w, this.h);

    this.imagePush = canvas.toDataURL();
  }

  /**
   * Update the text area
   */
  descartesJS.TextArea.prototype.update = function() {
    evaluator = this.evaluator;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    var newText;

    if (this.text.match(/<span/)) {
      newText = this.rawText;
    }
    else {
      newText = this.text;
    } 

    evaluator.setVariable(this.id, newText);

    // enable or disable the control
    this.activeCover.style.display = (this.activeIfValue) ? "none" : "block";
    
    // hide or show the text field control
    this.containerControl.style.display = (this.drawIfValue) ? "block" : "none";

    // update the position and size
    this.updatePositionAndSize();
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.TextArea.prototype.registerMouseAndTouchEvents = function() {
    var self = this;

    /**
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();
      self.showAnswer = !self.showAnswer;
      self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
      self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
      self.showButton.style.backgroundImage = "url(" + self.imagePush + ")";
    }
    this.showButton.addEventListener("mousedown", onMouseDown);    

    /**
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();
      self.showButton.style.backgroundImage = "url(" + self.imageUnPush + ")";
    }
    this.showButton.addEventListener("mouseup",  onMouseUp);
    this.showButton.addEventListener("mouseout", onMouseUp);
  }

  descartesJS.TextArea.prototype.getScreenshot = function() {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", this.w);
    canvas.setAttribute("height", this.h);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeRect(0, 0, this.w, this.h);

    return canvas;
  }  
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var evaluator;
  var parser;
  var x;
  var y;
  var cpos;
  var ctx;
  var backCtx;
  var constraintPosition;

  var hasTouchSupport;

  /**
   * Descartes graphic control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic control
   */
  descartesJS.GraphicControl = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    parser = parent.evaluator.parser;
    
    /**
     * space identifier
     * type {String}
     * @private
     */
    this.spaceID = "";

    /**
     * text
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * size
     * type {Node}
     * @private
     */
    this.size = parser.parse("4");

    /**
     * font control
     * type {String}
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * image control
     * type {Image}
     * @private
     */
    this.image = new Image();
    var self = this;
    this.image.onload = function() {
      this.ready = 1;
    }

    /**
     * image file name
     * type {String}
     * @private
     */
    this.imageSrc = "";
    
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    this.touchId = null;
    
    // get the Descartes font
    this.font = descartesJS.convertFont(this.font);
    
    // build the contraint
    if (this.constraintExpr) {
      this.constraint = parser.parse(this.constraintExpr);
      
      if (this.constraint.type == "(expr)") {
        this.constraint = parser.parse(this.constraintExpr.substring(1, this.constraintExpr.length-1));
      }

      if (this.constraint.type == "compOperator") {
        var left = this.constraint.childs[0];
        var right = this.constraint.childs[1];
        this.newt = new descartesJS.R2Newton(this.evaluator, this.constraint);
      } else {
        this.constraint = null;
      }

      constraintPosition = new descartesJS.R2(0, 0);
    }

    // get the container
    this.container = this.getContainer();

    // dom element for catch the mouse events
    this.mouseCacher = document.createElement("div");
    this.mouseCacher.setAttribute("class", "DescartesGraphicControl");
    this.mouseCacher.setAttribute("id", this.id);
    this.mouseCacher.setAttribute("dragged", true);
    this.mouseCacher.setAttribute("tabindex", "-1"); 
 
    this.ctx = this.space.ctx;

    this.container.appendChild(this.mouseCacher);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    this.xString = this.id + ".x";
    this.yString = this.id + ".y";
    this.activoString = this.id + ".activo";

    if ((this.space.id !== "") && (parent.version !== 2)) {
      this.mxString = this.space.id + ".mouse_x";
      this.myString = this.space.id + ".mouse_y";
      this.mclickedString = this.space.id + ".mouse_clicked";
      this.mclicizquierdoString = this.space.id + ".clic_izquierdo";
    }
    else {
      this.mxString = "mouse_x";
      this.myString = "mouse_y";
      this.mclickedString = "mouse_clicked";
      this.mclicizquierdoString = "clic_izquierdo";
    }

    this.init();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  // descartesJS.extend(descartesJS.GraphicControl, descartesJS.Control);

  /**
   * Init the graphic control
   */
  descartesJS.GraphicControl.prototype.init = function() {
    evaluator = this.evaluator;
    hasTouchSupport = descartesJS.hasTouchSupport;
    
    // find the x and y position
    var expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    evaluator.setVariable(this.xString, this.x);
    evaluator.setVariable(this.yString, this.y);

    var radioTouch = 70;

    // if the control has an image name
    if ((this.imageSrc != "") && !(this.imageSrc.toLowerCase().match(/vacio.gif$/))) {
      this.image = this.parent.getImage(this.imageSrc);

      this.width = this.image.width;
      this.height = this.image.height;
    
      this._w = ((hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    } 
    else {
      this.width = (evaluator.evalExpression(this.size)*2);
      this.height = (evaluator.evalExpression(this.size)*2);
      
      this._w = ((hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    }

    this.mouseCacher.setAttribute("style", "cursor: pointer; background-color: rgba(255, 255, 255, 0); width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");
    this.mouseCacher.style.left = parseInt(this.space.getAbsoluteX(this.x)-this._w/2)+"px";
    this.mouseCacher.style.top = parseInt(this.space.getAbsoluteY(this.y)-this._h/2)+"px";

    evaluator.setVariable(this.activoString, 0);

    this.setImage = false;

    this.update();
  }
  
  /**
   * Update the graphic control
   */
  descartesJS.GraphicControl.prototype.update = function() {
    evaluator = this.evaluator;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // update the position
    this.x = evaluator.getVariable(this.xString);
    this.y = evaluator.getVariable(this.yString);
    x = this.space.getAbsoluteX(this.x);
    y = this.space.getAbsoluteY(this.y);

    this.mouseCacher.style.display = (!this.activeIfValue) ? "none" : "block";
    this.mouseCacher.style.left = parseInt(x-this._w/2)+"px";
    this.mouseCacher.style.top = parseInt(y-this._h/2)+"px";
    
    // eval the constraint    
    if (this.constraint) {
      this.evalConstraint();
    }

    this.draw();
  }

  /**
   * Draw the graphic control
   */
  descartesJS.GraphicControl.prototype.draw = function() {
    evaluator = this.evaluator;

    if (this.drawIfValue) {
      ctx = this.ctx;
      backCtx = this.space.backgroundCtx;
      x = parseInt(this.space.getAbsoluteX(this.x))+.5;
      y = parseInt(this.space.getAbsoluteY(this.y))+.5;
      
      if (this.text != "") {
        this.drawText(x, y);
      }

      // if the control do not have a image or is not ready
      if (!this.image.ready) {
        ctx.beginPath();
        ctx.arc(x, y, parseInt(this.width/2), 0, PI2, false);
    
        ctx.fillStyle = this.colorInt.getColor();
        ctx.fill();
      
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color.getColor();
        ctx.stroke();
      
        if (this.active) {
          ctx.beginPath();
          ctx.arc(x, y, parseInt(this.width/2)-2, 0, PI2, false);
          ctx.strokeStyle = this.colorInt.borderColor();
          ctx.stroke();
        }

        // if has trace
        if (this.trace) {
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = this.trace.getColor();
          backCtx.beginPath();
          backCtx.arc(x, y, parseInt(this.width/2), 0, PI2, false);
          backCtx.stroke();
        }
      } 
      // if the control has an image and is ready
      else {
      	if ((this.image.complete) && (!this.setImage)) {
          // this.mouseCacher.style.backgroundImage = "url(" + this.image.src + ")";
          // this.setImage = true;
          ctx.drawImage(this.image, parseInt(x-this.image.width/2), parseInt(y-this.image.height/2));
        }
        
        // if has trace
        if (this.trace) {
          backCtx.save();
          backCtx.translate(x, y);
          backCtx.scale(parseInt(this.image.width/2), parseInt(this.image.height/2));

          backCtx.beginPath();
          backCtx.arc(0, 0, 1, 0, PI2, false);
          backCtx.restore();
        
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = this.trace.getColor();
          backCtx.stroke();
        }
      }
    }
    
  }

  /**
   * Eval the constraint and change the position
   */
  descartesJS.GraphicControl.prototype.evalConstraint = function(x, y) {
    constraintPosition.set(this.x, this.y);

    cpos = this.newt.findZero(constraintPosition);
    this.x = cpos.x;
    this.y = cpos.y;
    this.evaluator.setVariable(this.xString, this.x);
    this.evaluator.setVariable(this.yString, this.y);
  }

  /**
   * Draw the graphic control text
   */
  descartesJS.GraphicControl.prototype.drawText = function(x, y) {
    ctx = this.ctx;
    evaluator = this.evaluator;
    
    ctx.fillStyle = this.color.getColor();
    ctx.font = this.font;
    ctx.textBaseline = "alphabetic";

    ctx.fillText(evaluator.evalExpression(this.text[0], evaluator.evalExpression(this.decimals), this.fixed), 
                 parseInt(x+1+this.width/2), 
                 parseInt(y-1-this.height/2)
                );
  }

  /**
   * Add the control to a espace and get the space container
   * @return {HTMLDiv} return the space container
   */
  descartesJS.GraphicControl.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // si el control esta en un espacio interno
    for(var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];

      if (space_i.id == this.spaceID) {
        space_i.addCtr(this);
        this.zIndex = space_i.zIndex;
        // set the space to draw the control
        this.space = space_i;
        return space_i.graphicControlContainer;
      }
    }
    
    // if do not find the space return the first space 
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    // set the space to draw the control
    this.space = spaces[0];
    return spaces[0].graphicControlContainer;
  }
  
  /**
   * Deactivate the graphic control removing the circle mark
   */
  descartesJS.GraphicControl.prototype.deactivate = function() {
    this.active = false;
    this.evaluator.setVariable(this.activoString, 0);
  }  
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.GraphicControl.prototype.registerMouseAndTouchEvents = function() {
    var self = this;

    this.click = false;
    this.over = false;
    this.active = false;

    // prevent the context menu display
    this.mouseCacher.oncontextmenu = function () { return false; };    

    if (descartesJS.hasTouchSupport) {
      this.mouseCacher.addEventListener("touchstart", onTouchStart);
    } else {
      this.mouseCacher.addEventListener("mousedown", onMouseDown);
      this.mouseCacher.addEventListener("mouseover", onMouseOver);
      this.mouseCacher.addEventListener("mouseout", onMouseOut);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if ((self.activeIfValue) && (self.over)) {
          
          self.parent.deactivateGraphiControls();
          self.click = true;
          self.active = true;
          self.evaluator.setVariable(self.activoString, 1);

          self.evaluator.setVariable(self.mclickedString, 0);
          self.evaluator.setVariable(self.mclicizquierdoString, 0);
          
          self.posAnte = self.getCursorPosition(evt);
// console.log(self.posAnte, self.space.getRelativeX(self.space.getCursorPosition(evt).x), self.space.getRelativeY(self.space.getCursorPosition(evt).y));
          self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };

          // self.evaluator.setVariable(self.mxString, self.x);
          // self.evaluator.setVariable(self.myString, self.y);

          self.evaluator.setVariable(self.mxString, self.space.getRelativeX(self.posAnte.x));
          self.evaluator.setVariable(self.myString, self.space.getRelativeY(self.posAnte.y));

          self.parent.update();
          
          window.addEventListener("mouseup", onMouseUp);
          window.addEventListener("mousemove", onMouseMove);
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onTouchStart(evt) {
      // remove the focus of the controls
      document.body.focus();

      evt.preventDefault();

      if (self.activeIfValue) {
        self.parent.deactivateGraphiControls();
        self.click = true;
        self.active = true;
        self.evaluator.setVariable(self.activoString, 1);

        self.evaluator.setVariable(self.mclickedString, 0);
        self.evaluator.setVariable(self.mclicizquierdoString, 0);        

        self.posAnte = self.getCursorPosition(evt);
        self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };

        // self.evaluator.setVariable(self.mxString, self.x);
        // self.evaluator.setVariable(self.myString", self.y);

        self.evaluator.setVariable(self.mxString, self.space.getRelativeX(self.posAnte.x));
        self.evaluator.setVariable(self.myString, self.space.getRelativeY(self.posAnte.y));

        self.parent.update();
        
        window.addEventListener("touchmove", onMouseMove);
        window.addEventListener("touchend", onMouseUp);
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      // remove the focus of the controls
      document.body.focus();

      evt.preventDefault();
      self.touchId = null;

      self.evaluator.setVariable(self.mclickedString, 1);
      self.evaluator.setVariable(self.mclicizquierdoString, 1);

      if ((self.activeIfValue) || (self.active)) {
        self.click = false;

        if (descartesJS.hasTouchSupport) {
          window.removeEventListener("touchmove", onMouseMove, false);
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
          window.removeEventListener("mousemove", onMouseMove, false);
        }
        
        // self.evaluator.setVariable(self.mxString, self.x);
        // self.evaluator.setVariable(self.myString, self.y);
        self.evaluator.setVariable(self.mxString, self.space.getRelativeX(self.posAnte.x)+self.x);
        self.evaluator.setVariable(self.myString, self.space.getRelativeY(self.posAnte.y)+self.y);

        self.parent.update();
        
        self.mouseCacher.style.left = (self.space.getAbsoluteX(self.x)-self._w/2)+"px";
        self.mouseCacher.style.top = (self.space.getAbsoluteY(self.y)-self._h/2)+"px";
      }
    }
    
    var posNew;
    var tmpX;
    var tmpY;
    var cpos;

    /**
     * 
     * @param {Event}
     * @private
     */
    function onMouseMove(evt) {
      evt.preventDefault();
      evt.touchId = self.touchId;

      self.evaluator.setVariable(self.mclickedString, 0);
      self.evaluator.setVariable(self.mclicizquierdoString, 0);

      posNew = self.getCursorPosition(evt);

      self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
      self.posY = self.prePos.y - (self.posAnte.y - posNew.y);
      
      ////////////////////////////////////////////////////////////////////////////
      // if (self.constraint) {
        // tmpX = self.space.getRelativeX(self.posX);
        // tmpY = self.space.getRelativeY(self.posY);
        
        // cpos = self.newt.findZero(new descartesJS.R2(tmpX, tmpY));
        // self.x = cpos.x;
        // self.y = cpos.y;
        // self.evaluator.setVariable(self.xString, self.x);
        // self.evaluator.setVariable(self.yString, self.y);
      // }
      // ////////////////////////////////////////////////////////////////////////////
      // else {
        self.evaluator.setVariable(self.xString, self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.yString, self.space.getRelativeY(self.posY));
        // self.evaluator.setVariable(self.mxString, self.x);
        // self.evaluator.setVariable(self.myString, self.y);
        self.evaluator.setVariable(self.mxString, self.space.getRelativeX(self.posAnte.x)+self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.myString, self.space.getRelativeY(self.posAnte.y)+self.space.getRelativeY(self.posY));

      // }

      // update the controls
      self.parent.updateControls();

      self.parent.update();      
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.click = false;
    }
    
    // function onBlur(evt) {
    //   console.log("en blur");
    // }
    // this.mouseCacher.addEventListener("blur", onBlur);        
  }
  
  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor postion
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.GraphicControl.prototype.getCursorPosition = function(evt) {
    // if has touch events
    if (evt.touches) {
      var touch;

      if (!evt.touchId) {
        for (var i=0, l=evt.touches.length; i<l; i++) {
          if (evt.target == evt.touches[i].target) {
            touch = evt.touches[i];

            this.touchId = touch.identifier;
         
            break;
          }
        }
      }
      else {
        for (var i=0, l=evt.touches.length; i<l; i++){
          if (evt.touches[i].identifier == evt.touchId) {
            touch = evt.touches[i];

            break;
          }
        }
      }
      // var touch = evt.touches[0];
    
      mouseX = touch.pageX; 
      mouseY = touch.pageY;
    } 
    // if has mouse events
    else {
      // all browsers
      if (evt.pageX != undefined && evt.pageY != undefined) { 
        mouseX = evt.pageX; 
        mouseY = evt.pageY;
      } 
      // IE
      else { 
        mouseX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
      }
    }

    return { x: mouseX - (this.space.container.offsetLeft + this.space.container.parentNode.offsetLeft), 
             y: mouseY - (this.space.container.offsetTop + this.space.container.parentNode.offsetTop)
           };
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var temp;
  var babelValue;
  var values_i_0;
  var values_i_1;
  var spaceObj;
  var controlObj;
  var graphicObj;
  var auxiliarObj;
  var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg)/gi;

  var theAction_action;
  var theAction_parent;
  var theAction_parameter;

  var splitValues;
  var pos;
  var i;
  var initToken;
  var initPosToken;
  var endPosToken;
  var stringToken;
  var valueToken;
  var charAt;

  var splitString;
  var parenthesesStack;
  var lastSplitIndex;

  var tmpColor;
  var splitColor;
  var hexColor;

  var subtitleFontSize;
  var plecaObj;
  var paddingSides = 15;
  var image;
  var imageHeight;
  var divTitle;
  var divSubTitle;
  var tempDiv;
  var tempDivHeight;
  var tempFontSize;
  var noLines;
  var tempDecrement;
  var tmpIndexEqual;
  var tmpIndexSpace;

  var charAt;

  /**
   * Parser of principal elements of descartes
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   */
  descartesJS.LessonParser = function(parent) {
    this.parent = parent;

    this.parser = parent.evaluator.parser;

    this.RTFparser = new descartesJS.RTFParser(parent.evaluator);
  }

  /**
   * Parse the button configuration
   * @param {String} values is the string containing the values ​​that define the button configuration
   * @return {Object} return a configuration object with the corresponding values
   */
  descartesJS.LessonParser.prototype.parseButtonsConfig = function(values) {
    // default values
    var buttonConfigObj = { rowsNorth: 0, rowsSouth: 0, widthEast: 125, widthWest: 125, height: 23 };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);
    
    // traverse all values and asign to variables of the button configuration
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {
        //
        case("rowsNorth"):
        case("rowsSouth"):
        case("widthEast"):
        case("widthWest"):
        case("height"):
          buttonConfigObj[babelValue] = parseInt(values_i_1);
          break;

        //
        case("about"):
        case("config"):
        case("init"):
        case("clear"):
          buttonConfigObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // any variable missing
        default:
          console.log("----- attributo de space no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    return buttonConfigObj;
  }
  
  /**
   * Parse and create a space
   * @param {String} values is the string containing the values ​​that define the space
   * @return {Space} return a space constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseSpace = function(values) {
    // object containing all the values ​​found in values
    spaceObj = {};
    
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables to the space
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      babelValue = babel[values_i_0];

      switch(babelValue) {
        // the type of the space (2D, 3D or another)
        case("type"):
        // identifier
        case("id"):
        // control identifier (for rtf positioning)
        case("cID"):
        // file name of an external space
        case("file"):
          spaceObj[babelValue] = values_i_1;
          break;

        // fixed condition
        case("fixed"):
        // condition to show the numbers in the space
        case("numbers"):
        // sensitive to mouse movements condition
        case("sensitive_to_mouse_movements"):
        // space 3D
        case("R3"):
        // split option for the render
        case("split"):
          spaceObj[babelValue] = (babel[values_i_1] === "true");
          break;          

        // how the background image is positioned
        case("bg_display"):
        // render mode sort, painter, raytrace
        case("render"):
          spaceObj[babelValue] = babel[values_i_1];
          break;

        // color of the net
        case("net"):
        // color of the net 10
        case("net10"):
        // color of the axis
        case("axes"):
        // color of the coordinate text of the mouse
        case("text"):
          spaceObj[babelValue] = (babel[values_i_1] === "false") ? "" : new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // text of the X axis
        case("x_axis"):
        // text of the Y axis
        case("y_axis"):
          spaceObj[babelValue] = (babel[values_i_1] === "false") ? "" : values_i_1;
          break;
          
        // x position of origin
        case("O.x"):
          spaceObj["OxExpr"] = values_i_1;
          break;

        // y position of origin
        case("O.y"):
          spaceObj["OyExpr"] = values_i_1;
          break;

        // background image
        case("image"):
          spaceObj["imageSrc"] = values_i_1;
          break;
          
        // x position
        case("x"):
          temp = values_i_1;
          
          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
            temp = (this.parent.container.width*parseFloat(temp)/100).toString();
          }
          // if not specified with a percentage get the numerical value of the position in x
          else {
            temp = values_i_1;
          }
          
          spaceObj["xExpr"] = this.parser.parse(temp);
          break;
          
        // y position
        case("y"):
          temp = values_i_1;
          
          // if specified with a percentage use the parent container's height to get the value in pixels
          if (temp[temp.length-1] === "%") {
            temp = (this.parent.container.height*parseFloat(temp)/100).toString();
          } 
          // if not specified with a percentage get the numerical value of the position in y
          else {
            temp = values_i_1;
          }
          
          spaceObj["yExpr"] = this.parser.parse(temp);
          break;
          
        // width
        case("width"):
          temp = values_i_1;

          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["wExpr"] = temp;
            temp = this.parent.container.width*parseFloat(temp)/100;
          }
          // if not specified with a percentage get the numerical value of the width
          else {
            temp = parseFloat(values_i_1);
            
            // whether to convert the value to a number the values ​​are different, then the width becomes the width of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.width; // default value
            }
          }
          
          spaceObj["w"] = temp;
          break;
          
        // height
        case("height"):
          temp = values_i_1;

          // if specified with a percentage use the parent container's height to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["hExpr"] = temp;
            temp = this.parent.container.height*parseFloat(temp)/100;
          } 
          // if not specified with a percentage get the numerical value of the height
          else {
            temp = parseFloat(values_i_1);
            
            // whether to convert the value to a number the values ​​are different, then the height becomes the height of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.height; // default value
            }
          }
          
          spaceObj["h"] = temp;
          break;
          
        // drawif condition
        case("drawif"):
          spaceObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // scale
        case("scale"):
          temp = parseFloat(values_i_1);
          
          // whether to convert the value to a number the values ​​are different, then use the default value
          // this case ocurrs when the scale has a no valid value
          if (temp.toString() != values_i_1) {
            temp =  48; // default value
          }          
          
          spaceObj["scale"] = temp;
          break;
                  
        // background color
        case("background"):
          spaceObj["background"] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;
          
        // any variable missing
        default:
          console.log("----- attributo de space no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }   
    }

    // construct the space
    switch(spaceObj.type) {
      case("R2"):
        return new descartesJS.Space2D(this.parent, spaceObj);
        break;

      case("R3"):
        return new descartesJS.Space3D(this.parent, spaceObj);
        break;

      case("AP"):
        return new descartesJS.SpaceAP(this.parent, spaceObj);
        break;

      case("HTMLIFrame"):
        return new descartesJS.SpaceHTML_IFrame(this.parent, spaceObj);
        break;

      // Descartes 2
      default:
        return new descartesJS.Space2D(this.parent, spaceObj);
        break;
    }
  }

  /**
   * Parse and create a control
   * @param {String} values is the string containing the values ​​that define the control
   * @return {Control} return a control constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseControl = function(values) {
    // object containing all the values ​​found in values
    controlObj = { type: "numeric" };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables to the control
    for (var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {
        
        // identifier
        case("id"):
        // name
        case("name"):
        // parameter of the action
        case("parameter"):
        // tooltip
        case("tooltip"):
        // font tooltip
        case("tooltipFont"):
        // explanation
        case("Explanation"):
        // font explanation
        case("ExplanationFont"):
        // control identifier (for rtf positioning)
        case("cID"):
        // control menu options
        case("options"):
        // control graphic text font
        case("font"):
        // file name of a video or audio control
        case("file"):
        // answer pattern
        case("answer"):
          controlObj[babelValue] = values_i_1;
          break;

        // interface (spinner, button, etc)
        case("gui"):
        // region
        case("region"):
        // action
        case("action"):
        // relative position of control mesagges
        case("msg_pos"):
        // video control poster image
        case("poster"):
          controlObj[babelValue] = babel[values_i_1];
          break;

        // condition to use fixed notation in the text
        case("fixed"):
        // visible condition
        case("visible"):
        // condition for the discrete increment
        case("discrete"):
        // condition for a only text control
        case("onlyText"):
        // condition to evaluate the control
        case("evaluate"):
        // condition to auto play a video or audio control
        case("autoplay"):
        // condition to loop a video or audio control
        case("loop"):
        // condition to show the controls of a video or audio control
        case("controls"):
          controlObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // color text
        case("color"):
        // color-int text
        case("colorInt"):
        // control graphic trace
        case("trace"):
          controlObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // font size
        case("font_size"):
        // drawif condition
        case("drawif"):
        // activeif condition
        case("activeif"):
        // number of decimals of the text in the graphic control
        case("decimals"):
        // minimum value
        case("min"):
        // maximum value
        case("max"):
        // control graphic size
        case("size"):
          controlObj[babelValue] = this.parser.parse(values_i_1);
          break;
          
        // control graphic constraint
        case("constraint"):
          controlObj["constraintExpr"] = values_i_1;
          break;

        // image
        case("image"):
          controlObj["imageSrc"] = values_i_1;
          break;
          
        // id of the containing space
        case("space"):
          controlObj["spaceID"] = values_i_1;
          break;
          
        // type
        case("type"):
          controlObj["type"] = babel[values_i_1.trim()];
          break;
                    
        // expresion of the position and size
        case("expresion"):
          controlObj["expresion"] = this.parser.parse(values_i_1.replace(")(", ","));
          break;

        // bold text contidition
        case("bold"):
          if (babel[values_i_1] != "false") {
            controlObj["bold"] = "bold";
          }
          break;
          
        // italic text condition 
        case("italics"):
          if (babel[values_i_1] != "false") {
            controlObj["italics"] = "italic";
          }
          break;
          
        // underline text condition
        case("underlined"):
          if (babel[values_i_1] != "false") {
            controlObj["underlined"] = true;
          }
          break;
          
        // value
        case("value"):
          var tmpVal = values_i_1.replace(/&squot;/g, "'");

          // replace the pipes with single quotation marks in the text value
          if (tmpVal.match(/^\|/)) {
            tmpVal = "'" + tmpVal.substring(1);
            if (tmpVal.match(/\|$/)) {
              tmpVal = tmpVal.substring(0, tmpVal.length-1) + "'";
            }
          }

          // the value expression for future evaluation
          controlObj["valueExpr"] = this.parser.parse(tmpVal);
          // the value string for reference
          controlObj["valueExprString"] = tmpVal;          
          break;
          
        // increment
        case("incr"):
          if (values_i_1 != 0) {
            controlObj["incr"] = this.parser.parse(values_i_1);
          }
          break;

        // condition to show the text content in exponential notation
        case("exponentialif"):
          controlObj["exponentialif"] = parseFloat(values_i_1); // parse the posible expression
          break;

        // control graphic text
        case("text"):
          // the raw string
          controlObj["rawText"] = values_i_1;
          
          var tmpText = this.parseText(values_i_1);
          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          controlObj["text"] = tmpText;
          break;
          
        // any variable missing
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // find the font of the paramether
          if ((prefix === "parameter") && (sufix === "font")) {
            controlObj["parameterFont"] = values_i_1;
            break;
            
          // find the font of the explanation
          } else if ((prefix === "Explanation") && (sufix === "font")) {
            controlObj["ExplanationFont"] = values_i_1;
            break;
            
          // find the font of the tooltip
          } else if ((prefix === "tooltip") && (sufix === "font")) {
            controlObj["tooltipFont"] = values_i_1;
            break;            
          }
         
          console.log("----- attributo de control no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }



    if (controlObj.type === "numeric") {
      switch (controlObj.gui) {
        case("spinner"):
          return new descartesJS.Spinner(this.parent, controlObj);
          break;
          
        case("button"):
          return new descartesJS.Button(this.parent, controlObj);
          break;
          
        case("textfield"):
          return new descartesJS.TextField(this.parent, controlObj);
          break;
          
        case("menu"):
          return new descartesJS.Menu(this.parent, controlObj);
          break;
          
        case("scrollbar"):
          return new descartesJS.Scrollbar(this.parent, controlObj);
          break;
          
        default:
          return new descartesJS.Spinner(this.parent, controlObj);
          break;
      }
    }
    
    else if (controlObj.type === "video") {
      return new descartesJS.Video(this.parent, controlObj);
    }
    
    else if (controlObj.type === "audio") {
      return new descartesJS.Audio(this.parent, controlObj);
    }
    
    else if (controlObj.type === "graphic") {
      return new descartesJS.GraphicControl(this.parent, controlObj);
    }
    
    else if (controlObj.type === "text") {
      return new descartesJS.TextArea(this.parent, controlObj);
    }
  }

  /**
   * Parse and create a graphic
   * @param {String} values is the string containing the values ​​that define the graphic
   * @param {Boolean} abs_coord is a boolean specifying the use of absolute coordinate in macro graphics
   * @param {Boolena} background is a boolean specifying that draw in the background the macro graphics
   * @param {Node} rotateExp is a expression that specify a rotation for the macro graphics
   * @return {Graphic} return a graphic constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseGraphic = function(values, abs_coord, background, rotateExp) { 
    // object containing all the values ​​found in values
    graphicObj = { rotateExp: rotateExp, parameter: "t" };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables del graphic
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {        

        // type
        case("type"):
        // text alignment
        case("align"):
          graphicObj[babelValue] = babel[values_i_1];
          break;

        // condition to draw the graphic in the background
        case("background"):
        // type of coordinates
        case("abs_coord"):
        // visible condition
        case("visible"):
        // editable condition
        case("editable"):
        // condition to use fixed notation in the text
        case("fixed"):
        // arc condition to use vectors
        case("vectors"):
          graphicObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // color
        case("color"):
        // fill color
        case("fill"):
        // equation fill+ color
        case("fillP"):
        // equation fill- color
        case("fillM"):
        // arrow color
        case("arrow"):
        // trace
        case("trace"):
          // patch for catala
          if (babel[values_i_1] === "false") {
            graphicObj[babelValue] = "";
          }
          else {
            graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          }
          break;

        // family parameter
        case("family"):
        // parameter of a curve
        case("parameter"):
        // information
        case("info"):
        // text font
        case("font"):
        // macro name
        case("name"):
          graphicObj[babelValue] = values_i_1;
          break;

        // drawif condition
        case("drawif"):
        // width
        case("width"):
        // number of decimals of the text in the graphic
        case("decimals"):
        // size
        case("size"):
        // arrow spear size
        case("spear"):
        // arc center
        case("center"):
        // arc radius
        case("radius"):
        // arc init angle
        case("init"):
        // arc end angle
        case("end"):
        // image opacity
        case("opacity"):
        // image and macro rotation
        case("inirot"):
        // macro initial position
        case("inipos"):
        // range
        case("range"):
          graphicObj[babelValue] = this.parser.parse(values_i_1);
          break;

        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;

        // expression
        case("expresion"):
          if (graphicObj.type != "macro") {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
                    
        // text
        case("text"):
          graphicObj["text"] = this.parseText(values_i_1);
          break;
          
        // file name
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");
          if ((fileTmp.charAt(0) === "[") && (fileTmp.charAt(fileTmp.length-1) === "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }
          // explicit image file name
          if (fileTmp.match(regExpImage)) {
            fileTmp = "'" + fileTmp + "'";
          }
          graphicObj["file"] = this.parser.parse(fileTmp);
          break;
          
        // color border
        case("border"):
          if (babel[values_i_1] != "false") {
            graphicObj["border"] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          }
          break;
          
        // any variable missing
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]) {
                
                // find the interval variable of a family
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // find the number of steps in the family
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {

            if (values_i_0.match(graphicObj["parameter"] + ".")) {

              // default parameter in a macro
              if (graphicObj["parameter"] !== values_i_0.substring(0, values_i_0.indexOf(graphicObj["parameter"]) +graphicObj["parameter"].length)) {
                graphicObj["parameter"] = values_i_0.substring(0, values_i_0.indexOf(graphicObj["parameter"]) +graphicObj["parameter"].length);
              }

              switch (babel[values_i_0.substring(graphicObj["parameter"].length +1)]) {

                // find the interval variable of a family
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // find the number of steps in the family
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          console.log("----- attributo del graphic no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }

    // MACRO //
    // when absolute coordinates are used
    if (abs_coord) {
      graphicObj.abs_coord = abs_coord;
    }
    // if have to draw the macro in the background
    if (background) {
      graphicObj.background = background;
    }
    // MACRO //

    switch(graphicObj.type) {
      case("text"):
        return new descartesJS.Text(this.parent, graphicObj);
        break;

      case("image"):
        return new descartesJS.Image(this.parent, graphicObj);
        break;

      case("point"):
        return new descartesJS.Point(this.parent, graphicObj);
        break;

      case("polygon"):
        return new descartesJS.Polygon(this.parent, graphicObj);
        break;

      case("arc"):
        return new descartesJS.Arc(this.parent, graphicObj);
        break;

      case("segment"):
        return new descartesJS.Segment(this.parent, graphicObj);
        break;

      case("arrow"):
        return new descartesJS.Arrow(this.parent, graphicObj);
        break;

      case("macro"):
        return new descartesJS.Macro(this.parent, graphicObj);
        break;

      case("curve"):
        return new descartesJS.Curve(this.parent, graphicObj);
        break;

      case("equation"):
        return new descartesJS.Equation(this.parent, graphicObj);
        break;

      case("sequence"):
        return new descartesJS.Sequence(this.parent, graphicObj);
        break;

      case("fill"):
        return new descartesJS.Fill(this.parent, graphicObj);
        break;

      default:
        break;
    }

  }

  /**
   * Parse and create a 3D graphic
   * @param {String} values is the string containing the values ​​that define the 3D graphic
   * @param {Boolean} abs_coord is a boolean specifying the use of absolute coordinate in macro graphics
   * @param {Boolena} background is a boolean specifying that draw in the background the macro graphics
   * @param {Node} rotateExp is a expression that specify a rotation for the macro graphics
   * @return {3DGraphic} return a 3D graphic constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parse3DGraphic = function(values, abs_coord, background, rotateExp) { 
    // object containing all the values ​​found in values
    graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";
    
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables del graphic
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      babelValue = babel[values_i_0];

      switch(babelValue) {
        // type
        case("type"):
        // ilumination model
        case("model"):
          graphicObj[babelValue] = babel[values_i_1];
          break;
          
        // condition to draw the graphic in the background
        case("background"):
        // condition to use fixed notation in the text
        case("fixed"):
        // condition to draw the edges
        case("edges"):
          graphicObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // color
        case("color"):
        // back face color
        case("backcolor"):
          graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // type
        case("type"):
        // ilumination model
        case("model"):
          graphicObj[babelValue] = babel[values_i_1];
          break;
          
        // condition to draw the graphic in the background
        case("background"):
        // condition to use fixed notation in the text
        case("fixed"):
        // condition to draw the edges
        case("edges"):
        // condition to calculate the intersection edges of faces
        case("split"):
          graphicObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // color
        case("color"):
        // back face color
        case("backcolor"):
          graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // drawif condition
        case("drawif"):
        // width
        case("width"):
        // lenght
        case("length"):
        // height
        case("height"):
        // number of decimals of the text in the graphic
        case("decimals"):
        // Nu parameter
        case("Nu"):
        // Nv parameter
        case("Nv"):
        // initial position
        case("inipos"):
        // end position
        case("endpos"):
          graphicObj[babelValue] = this.parser.parse(values_i_1);
          break;          

        // family parameter
        case("family"):
        // curve parameter
        case("parameter"):
        // font text
        case("font"):
        // name
        case("name"):
        // initial rotation
        case("inirot"):
        // end rotation
        case("endrot"):
          graphicObj[babelValue] = values_i_1;
          break;          
          
        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // expression
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1.replace(/\\n/g, "");
          }
          break;
                    
        // text
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;
          
        // file name
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");

          if ((fileTmp.charAt(0) === "[") && (fileTmp.charAt(fileTmp.length-1) === "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }

          if (fileTmp.match(/./)) {
            fileTmp = "'" + fileTmp + "'";
          }

          graphicObj["file"] = this.parser.parse(fileTmp);
          break;          

          break;

        // drawif condition
        case("drawif"):
        // width
        case("width"):
        // lenght
        case("length"):
        // number of decimals of the text in the graphic
        case("decimals"):
        // Nu parameter
        case("Nu"):
        // Nv parameter
        case("Nv"):
        // initial rotation
        case("inirot"):
        // end rotation
        case("endrot"):
        // initial position
        case("inipos"):
        // end position
        case("endpos"):
          graphicObj[babelValue] = this.parser.parse(values_i_1);
          break;          

        // family parameter
        case("family"):
        // curve parameter
        case("parameter"):
        // font text
        case("font"):
        // name
        case("name"):
          graphicObj[babelValue] = values_i_1;
          break;          
          
        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // expression
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
                    
        // text
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;
          
        // file name
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");

          if ((fileTmp.charAt(0) === "[") && (fileTmp.charAt(fileTmp.length-1) === "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }

          if (fileTmp.match(/./)) {
            fileTmp = "'" + fileTmp + "'";
          }

          graphicObj["file"] = this.parser.parse(fileTmp);
          break;

        //
        default:
          if (graphicObj["family"] !== undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {

              // family interval
              if (babel[values_i_0.substring(graphicObj["family"].length+1)] === "interval") {
                graphicObj["family_interval"] = this.parser.parse(values_i_1);
                break;
              }
              // family steps
              else {
                graphicObj["family_steps"] = this.parser.parse(values_i_1);
                break;
              }
            }
          }

          console.log("----- attributo del graphic3D no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;

      }
    }

    switch(graphicObj.type) {
      case("point"):
        return new descartesJS.Point3D(this.parent, graphicObj);
        break;

      case("segment"):
        return new descartesJS.Segment3D(this.parent, graphicObj);
        break;

      case("polygon"):
        return new descartesJS.Polygon3D(this.parent, graphicObj);
        break;

      case("curve"):
        return new descartesJS.Curve3D(this.parent, graphicObj);
        break;

      case("triangle"):
        return new descartesJS.Triangle3D(this.parent, graphicObj);
        break;

      case("face"):
        return new descartesJS.Face3D(this.parent, graphicObj);
        break;

      case("polireg"):
        return new descartesJS.Polireg3D(this.parent, graphicObj);
        break;

      case("surface"):
        return new descartesJS.Surface3D(this.parent, graphicObj);
        break;

      case("text"):
        return new descartesJS.Text3D(this.parent, graphicObj);
        break;

      case("cube"):
      case("box"):
      case("tetrahedron"):
      case("octahedron"):
      case("sphere"):
      case("dodecahedron"):
      case("icosahedron"):
      case("ellipsoid"):
      case("cone"):
      case("cylinder"):
      case("mesh"):
        return new descartesJS.OtherGeometry(this.parent, graphicObj);
        break;

      case("macro"):
        return new descartesJS.Macro3D(this.parent, graphicObj);
        break;

      default:
        console.log(graphicObj.type);
        break;
    }
  }
  
  /**
   * Parse and create an auxiliar
   * @param {String} values is the string containing the values ​​that define the auxiliar
   * @return {Auxiliary} return a auxiliar constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAuxiliar = function(values) {
    // object containing all the values ​​found in values
    auxiliarObj = {};

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);
    
    for(var i=0, l=values.length; i<l; i++) {
      values[i][1] = (values[i][1]).replace(/&squot;/g, "'");
    }
    
    // traverse all values and asign to variables del auxiliar
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {

        // identifier
        case("id"):
        // file name of a vector
        case("file"):
        // init expression
        case("init"):
        // do expression
        case("doExpr"):
        // while expression
        case("whileExpr"):
        // function range
        case("range"):
        // local variables
        case("local"):
        // expression
        case("expresion"):
        // event condition
        case("condition"):
        // event parameter
        case("parameter"):
          auxiliarObj[babelValue] = values_i_1;
          break;

        // editable condition
      	case("editable"):
        // constant condition
        case("constant"):
        // vector condition
        case("array"):
        // matrix condition
        case("matrix"):
        // algorithm condition
        case("algorithm"):
        // event expression
        case("event"):
        // sequence condition
        case("sequence"):
          auxiliarObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // number of elements in a vector
        case("size"):
        // number of rows in a matrix
        case("rows"):
        // number of columns in a matrix
        case("columns"):
          auxiliarObj[babelValue] = this.parser.parse(values_i_1);
          break;

        // type of evaluation
        case("evaluate"):
        // // event expression
        // case("event"):
        // execution expression of an event
        case("execution"):
        // relative position of event mesagges
        case("msg_pos"):
        // event action
        case("action"):
          auxiliarObj[babelValue] = babel[values_i_1];
          break;

        // any variable missing
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // find the font of the paramether
          if ((prefix === "parameter") && (sufix === "font")) {
            auxiliarObj["parameterFont"] = values_i_1;
            break;
          }
          
          console.log("----- attributo de auxiliar no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    // sequence
    if (auxiliarObj.sequence) {
      // var auxS = new descartesJS.AuxSequence(this.parent, auxiliarObj);
      var auxS = new descartesJS.Function(this.parent, auxiliarObj);
      return;
    }
    
    // constant
    else if (auxiliarObj.constant) {
      // only once evaluation
      var auxC = new descartesJS.Constant(this.parent, auxiliarObj);
      
      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxC);
      }
      return;
    }

    // algorithm
    else if ((auxiliarObj.algorithm) && (auxiliarObj.evaluate)) {
      // only once evaluation
      var auxA = new descartesJS.Algorithm(this.parent, auxiliarObj);
      
      // always evaluation
//       if (auxiliarObj.evaluate === "always") {
        this.parent.auxiliaries.push(auxA);
//       }
      return;
    }
    
    // vector
    else if ((auxiliarObj.array) && (!auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // only once evaluation
      var auxV = new descartesJS.Vector(this.parent, auxiliarObj);

      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxV);
      }
      return;
    }

    // matrix
    else if ((auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // only once evaluation
      var auxM = new descartesJS.Matrix(this.parent, auxiliarObj);

      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxM);
      }
      return;
    }
    
    // event
    else if ((auxiliarObj.event) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // var auxE = new descartesJS.Event(this.parent, auxiliarObj);
      // this.parent.events.push(auxE);

      this.parent.events.push( new descartesJS.Event(this.parent, auxiliarObj) );

      return;
    }
    
    else {
      // function
      if (auxiliarObj.id.charAt(auxiliarObj.id.length-1) === ")") {
        // var auxF = new descartesJS.Function(this.parent, auxiliarObj);
        new descartesJS.Function(this.parent, auxiliarObj);
      } 
      // variable
      else {
      	// var auxV = new descartesJS.Variable(this.parent, auxiliarObj);
        new descartesJS.Variable(this.parent, auxiliarObj);
      }
      return;
    }
  }
  
  /**
   * Parse and create an action
   * @param {String} theAction is the string containing the values ​​that define the action
   * @return {Action} return a action constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAction = function(theAction) {
    theAction_action = theAction.action;
    theAction_parent = theAction.parent;
    theAction_parameter = theAction.parameter;
    
    // if has some action then create it
    if (theAction_action) {
      switch (theAction_action) {
        // show a message
        case("message"):
          return (new descartesJS.Message(theAction_parent, theAction_parameter));
          break;
          
        // performs calculations
        case("calculate"):
          return (new descartesJS.Calculate(theAction_parent, theAction_parameter));
          break;
          
        // open an URL
        case("openURL"):
          return (new descartesJS.OpenURL(theAction_parent, theAction_parameter));
          break;

        // open a scene
        case("openScene"):
          return (new descartesJS.OpenScene(theAction_parent, theAction_parameter));
          break;

        // show credits
        case("about"):
          return (new descartesJS.About(theAction_parent, theAction_parameter));
          break;

        // show the editor
        case("config"):
          return (new descartesJS.Config(theAction_parent, theAction_parameter));
          break;

        // init the scene
        case("init"):
          return (new descartesJS.Init(theAction_parent, theAction_parameter));
          break;
          
        // clear the trace
        case("clear"):
          return (new descartesJS.Clear(theAction_parent, theAction_parameter));
          break;
          
        // start the animation
        case("animate"):
          return (new descartesJS.Animate(theAction_parent, theAction_parameter));
          break;
          
        // init the animation
        case("initAnimation"):
          return (new descartesJS.InitAnimation(theAction_parent, theAction_parameter));
          break;
          
        // play audio
        case("playAudio"):
          return (new descartesJS.PlayAudio(theAction_parent, theAction_parameter));
          break;

        default:
          console.log("----- Accion no soportada aun: <" + theAction_action + "> -----");
          break;
      }
    }
    // if has not some action then return a function that does nothing
    else {
      return {execute : function() {}};
    }
  }

  /**
   * Parse and create an animation
   * @param {String} values is the string containing the values ​​that define the animation
   * @return {Animation} return a animation constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAnimation = function(values) {
    // object containing all the values ​​found in values
    var animationObj = {};
    
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables of the animation
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {

        // identifier
        case("id"):
        // time delay
        case("delay"):
        // init expression
        case("init"):
        // do expression
        case("doExpr"):
        // while expression
        case("whileExpr"):
          animationObj[babelValue] = values_i_1;
          break;
          
        // condition to show the controls
        case("controls"):
        // condition to star automatically
        case("auto"):
        // condition to loop
        case("loop"):
        // algorithm condition
        case("algorithm"):
        // type of evaluation          
        case("evaluate"):
          animationObj[babelValue] = (babel[values_i_1] === "true");
          break;          
         
        // any variable missing
        default:
          console.log("----- attributo de la animacion no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }
    
    return (new descartesJS.Animation(this.parent, animationObj));
  }

  /**
   * 
   */
  descartesJS.LessonParser.prototype.parsePleca = function(values, w) {
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // object containing all the values ​​found in values
    plecaObj = { 
                title:        "",
                subtitle:     "",
                subtitlines:  0,
                bgcolor:      "#536891",
                fgcolor:      "white",
                align:        "left",
                titleimage:   "",
                titlefont:    "SansSerif,BOLD,20",
                subtitlefont: "SansSerif,PLAIN,18"
             };
 
    // traverse all values and asign to variables of the pleca
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(values_i_0) {
        // title text
        case("title"):
          plecaObj.title = values_i_1;
          break;
         
        // subtitle text
        case("subtitle"):
          plecaObj.subtitle = values_i_1;
          break;

        // number of lines of the subtitle
        case("subtitlines"):
          plecaObj.subtitlines = values_i_1;
          break;

        // background color
        case("bgcolor"):
          if (values_i_1 != "") {
            plecaObj.bgcolor = (new descartesJS.Color(values_i_1, this.parent.evaluator)).getColor();
          }
          break;

        // text color
        case("fgcolor"):
          if (values_i_1 != "") {
            plecaObj.fgcolor = (new descartesJS.Color(values_i_1, this.parent.evaluator)).getColor();
          }
          break;

        // alignment
        case("align"):
          if (values_i_1 != "") {
            plecaObj.align = values_i_1;
          }
          break;

        // file image
        case("titleimage"):
          plecaObj.titleimage = values_i_1;
          break;

        // title font
        case("titlefont"):
          plecaObj.titlefont = (values_i_1 != "") ? descartesJS.convertFont(values_i_1) : descartesJS.convertFont(plecaObj.titlefont);
          break;

        // subtitle font
        case("subtitlefont"):
          plecaObj.subtitlefont = (values_i_1 != "") ? descartesJS.convertFont(values_i_1) : descartesJS.convertFont(plecaObj.subtitlefont);
          break;

        // any variable missing
        default:
          console.log("----- attributo de la pleca no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }

    // the pleca is empty
    if ((plecaObj.title === "") && (plecaObj.subtitle === "")) {
      return document.createElement("div");
    }

    // the subtitle font size
    subtitleFontSize = plecaObj.subtitlefont.substring(0, plecaObj.subtitlefont.indexOf("px"));
    subtitleFontSize = subtitleFontSize.substring(subtitleFontSize.lastIndexOf(" "));

    // the image and its height if it exists
    if (plecaObj.titleimage != "") {
      image = this.parent.getImage(plecaObj.titleimage);
      imageHeight = image.height;
    }
    
    // create the container
    plecaObj.divPleca = document.createElement("div");
    plecaObj.divPleca.setAttribute("id", "descartesPleca");

    // if there is an image, then the height of the pleca is adjusted to the height of the image
    if (imageHeight) {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; height: "+ (imageHeight-16) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; overflow: hidden; z-index: 100;");
      
      image.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1; width: 100%; height: 100%");
      plecaObj.divPleca.appendChild(image);
    } 
    // if there is not an image, the the height is not specified and the contaier guest the height
    else {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; z-index: 100;");
    }
    
    // creates the container for the title and the content is added
    divTitle = document.createElement("div");
    divTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.titlefont + "; overflow: hidden; white-space: nowrap;");
    divTitle.innerHTML = plecaObj.title;

    // create the container for the subtitle
    divSubTitle = document.createElement("div");

    // if the number of lines of the subtitle is equal to 1 then the height of the subtitle fits only one line
    if (parseInt(plecaObj.subtitlines) === 1) {
      tempDecrement = 0;

      // creates a temporary container that serves as a substitute container for the subtitle, to determine the font size of the subtitle container
      tempDiv = document.createElement("div");
      tempDiv.innerHTML = plecaObj.subtitle;
      document.body.appendChild(tempDiv);
      tempFontSize = subtitleFontSize;

      do {
        tempFontSize = tempFontSize - tempDecrement;
        
        // style is assigned to temporary container to measure the number of lines in the text
        tempDiv.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; width: " + (w-2*paddingSides) + "px; line-height: " + tempFontSize + "px;")
        
        // find the height of the temporary container
        tempDivHeight = tempDiv.offsetHeight;
        // find the number of lines by dividing the height between the height of a line
        noLines = tempDivHeight / tempFontSize;

        tempDecrement = 1;
      } 
      // If the number of lines is one or the font size becomes smaller than 8px then the search ends
      while ((noLines > 1) && (tempFontSize > 8));

      // temporary container is removed from the body
      document.body.removeChild(tempDiv);
      
      // assign to the subtitle style the proper font size
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; line-height: 110%; overflow: hidden; white-space: nowrap;");
    } 
    // if the number of lines is different from 1, then the number of lines is ignored
    else {
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; line-height: 110%;");
    }
    // assign the content to the subtitle
    divSubTitle.innerHTML = plecaObj.subtitle;

    plecaObj.divPleca.appendChild(divTitle);
    plecaObj.divPleca.appendChild(divSubTitle);
    
    plecaObj.divPleca.imageHeight = imageHeight;
    return plecaObj.divPleca;
  }
  
  /**
   * Removes single quotes in the value and divided into an array of parameters name and value pairs
   * @param {String} values the string to divided
   * @return {Array<Array<Strin>>} return the array of name and value pairs
   */
  descartesJS.LessonParser.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");
    
    splitValues = [];
    pos = 0;
    i = 0;
    initToken = false;
    initPosToken = 0;
    endPosToken = 0;
    stringToken = false;
    valueToken = false;

    // traverse the string to split
    while (pos < values.length) {
      // ignoring the blank spaces if not started the identification of a token
      if ((values.charAt(pos) === " ") && (!initToken)) {
        pos++;
      }
      
      // find a character which is different from a blank space
      if ((values.charAt(pos) !== " ") && (!initToken)) {
        initToken = true;
        initPosToken = pos;
      }
      
      // values ​​are specified as a string
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) === "'") && (!stringToken)) {
        stringToken = true;
        
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+2;
        
        pos+=2;
      }
      
      if ((stringToken) && (values.charAt(pos) === "'")) {
        stringToken = false;
        
        initToken = false;
        
        splitValues[i].push(values.substring(initPosToken, pos));
        
        i++;
      }

      // values ​​are specified as a word sequence
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) !== "'") && (!stringToken)) {
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;
        
        pos++;

        // find the next space and equal sign
        tmpIndexEqual = (values.substring(pos)).indexOf("=");

        if (tmpIndexEqual === -1) {
          tmpIndexEqual = values.length;
          tmpIndexSpace = values.length;
        } 
        else {
          tmpIndexEqual += pos;

          tmpIndexSpace = values.substring(pos, tmpIndexEqual).lastIndexOf(" ");
          if (tmpIndexSpace === -1) {
            tmpIndexSpace = values.length;
          }
          else {
            tmpIndexSpace += pos;
          }
        }

        splitValues[i].push(values.substring(initPosToken, tmpIndexSpace));
        i++;
        initToken = false;

        pos = tmpIndexSpace;
      }

      pos++;
    }      

    return splitValues;
  }
  
  /**
   * Parse a text an construct a simple text or rtf text
   * @param {String} text the string text to parse
   * @param {Object} return a rtf text or a simple text
   */
  descartesJS.LessonParser.prototype.parseText = function(text) {
    // is a RTF text
    if (text.match(/^\{\\rtf1/)) {
      return this.RTFparser.parse(text.substring(10));
    }
    
    // is a simple text
    return new descartesJS.SimpleText(this.parent, text);
  }

  return descartesJS;
})(descartesJS || {}, babel);/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathFloor = Math.floor;
  var lastChildIndex;
  var newRoot;
  var root;
  var right;
  var evalArgument;
  descartesJS.fullDecimals = false;
  
  /**
   * Nodes of a parse tree
   * @param {String} type the type of the node
   * @param {Object} value the value of the node
   * @constructor 
   */
  descartesJS.Node = function(type, value) {
    this.sep = "";
    this.type = type;
    this.value = value;
    this.parent = null;
    this.childs = [];
  }

  /**
   * Get the root of the parse tree
   * @return {Node} return the root of the parse tree
   */
  descartesJS.Node.prototype.getRoot = function() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Add a child to the parse tree
   * @param {Node} child the child that want to add
   */
  descartesJS.Node.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  /**
   * Replace the last child in the parse tree with a new node
   * @param {Node} child the new child to replace the last child in the parse tree
   */
  descartesJS.Node.prototype.replaceLastChild = function(child) {
    lastChildIndex = this.childs.length-1,
    lastChild = this.childs[lastChildIndex];
  
    lastChild.parent = null;
    this.childs[lastChildIndex] = child;
    child.parent = this;

    return child;
  }

  /**
   * Decide if the parse tree contains a node with some value
   * @param {Node} value the value to find in the parse tree
   * @return {Boolean} return true if the value is in the parse tree or false if not
   */
  descartesJS.Node.prototype.contains = function(value) {
    if (this.value === value) {
      return true;
    } 
    
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (this.childs[i].contains(value)) {
        return true;
      }
    }

    return false;
  }
    
  /**
   * Converts a parse tree with an equal operator as principal operator in a parse tree with a minus operator as a principal operator
   * @return {Node} return a new parse tree with the convertion of the principal operator
   */
  descartesJS.Node.prototype.equalToMinus = function() {
    if (this.type === "compOperator") {
      this.type = "operator";
      this.value = "-";
      
      root = new descartesJS.Node("compOperator", "==");
      right = new descartesJS.Node("number", "0");
      
      root.addChild(this);
      root.addChild(right);

      newRoot = this.getRoot();
      newRoot.setAllEvaluateFunction();
      
      return newRoot;
    }

    return this;
  }

  /**
   * Register the evaluation functions to all the nodes in the tree
   */
   descartesJS.Node.prototype.setAllEvaluateFunction = function() {
    this.setEvaluateFunction();

    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].setAllEvaluateFunction();
    }
  }

  /**
   * Set the apropiate evaluate function for the node
   * 
   */
  descartesJS.Node.prototype.setEvaluateFunction = function() {
    // number
    if (this.type === "number") {
      this.evaluate = function(evaluator) {
        return descartesJS.returnValue(parseFloat(this.value));
      }
    }
    
    // string
    else if (this.type === "string") {
      this.evaluate = function(evaluator) {
        return this.value;
      }
    }
    
    // variable
    else if ( (this.type === "identifier") && (this.childs.length === 0) ) {
      if (this.value == "rnd") {
        this.evaluate = function(evaluator) {
          return descartesJS.returnValue(Math.random());
        }
      }
      else {
        var variableValue;
        this.evaluate = function(evaluator, getMatrix) {
          variableValue = evaluator.variables[this.value];

          // the variable has an auxiliar variable value
          if (typeof(variableValue) === "object") {
            return variableValue.evaluate(evaluator);
          }

          // if the name of the variable is the name of a matrix, for matrix operations
          if ((variableValue == undefined) && (getMatrix || evaluator.matrices[this.value])) {            
            variableValue = evaluator.matrices[this.value];
          }

          return (variableValue !== undefined) ? variableValue : 0; 
        }
      }
    }
    
    // vector
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length === 1)) {
      var pos;
      var value;
      this.evaluate = function(evaluator) {
        pos = this.childs[0].childs[0].evaluate(evaluator);

        try {
          value = evaluator.vectors[this.value][(pos<0) ? 0 : mathFloor(pos)];
          return (value !== undefined) ? value : 0;
        }
        catch(e) { 
          return 0; 
        }
      }
    }
    
    // matrix
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
      var pos1;
      var pos2;
      var value;
      this.evaluate = function(evaluator) {
        pos1 = this.childs[0].childs[0].evaluate(evaluator);
        pos2 = this.childs[0].childs[1].evaluate(evaluator);

        try {
          value = evaluator.matrices[this.value][(pos1<0) ? 0 : mathFloor(pos1)][(pos2<0) ? 0 : mathFloor(pos2)]; 
          return (value !== undefined) ? value : 0;
        }
        catch(e) {
          return 0;
        }
      }
    }
    
    // function
    else if ( (this.type === "identifier") && (this.childs[0].type === "parentheses") ) {
      var argu;

      this.evaluate = function(evaluator) {
        argu = [];
        for (var i=0, l=this.childs[0].childs.length; i<l; i++) {
          argu[i] = this.childs[0].childs[i].evaluate(evaluator);
        }
      
        if (this.value === "_Eval_") {
          argu[0] = (argu.length > 0) ? argu[0].toString() : '';
          return descartesJS.returnValue( evaluator.evalExpression( evaluator.parser.parse( argu[0].replace(evaluator.parent.decimal_symbol_regexp, ".") ) ) );
        }

        return descartesJS.returnValue( evaluator.functions[this.value].apply(evaluator, argu) );
      }
    }
    
    // operator
    else if (this.type === "operator") {
      var op1;
      var op2;
      var result;

      if (this.value === "+") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // numeric or string operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return descartesJS.returnValue(op1 + op2);
          }
          // matix operation
          else {
            return sumMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "-") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return descartesJS.returnValue(op1 - op2);
          }
          // matrix operation
          else {
            return substactMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "*") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return descartesJS.returnValue(op1 * op2);
          }
          // matrix operation
          else {
            return multiplicationMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "/") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return descartesJS.returnValue(op1 / op2);
          }
          // matrix operation
          else {
            return divisionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "%") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator);
          op2 = this.childs[1].evaluate(evaluator);
          return op1 - mathFloor(op1/op2)*op2;
        }
      }
      else if (this.value === "^") {
        this.evaluate = function(evaluator) {
          return descartesJS.returnValue( Math.pow( this.childs[0].evaluate(evaluator), this.childs[1].evaluate(evaluator) ) );
        }
      }
    }
    
    // comparison operator
    else if (this.type === "compOperator") {
      if (this.value === "<") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) < this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "<=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) <= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) > this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) >= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "==") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) === this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "!=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) != this.childs[1].evaluate(evaluator))+0;
        }
      }
    }
    
    // boolean operator
    else if (this.type === "boolOperator") {
      var op1;

      if (this.value === "&") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
          else {
            return 0;
          }
        }
      }

      else if (this.value === "|") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return 1;
          }
          else {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
        }
      }

      else if (this.value === "!") { 
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          return !op1+0; 
        }
      }
    }
    
    // conditional
    else if (this.type === "conditional") {
      var op1;

      this.evaluate = function(evaluator) {
        op1 = this.childs[0].evaluate(evaluator);

        if (op1 > 0) {
          return this.childs[1].evaluate(evaluator);
        }
        else {
          return this.childs[2].evaluate(evaluator);
        }        
      }
    }
    
    // sign
    else if (this.type === "sign") {
      if (this.value === "sign+") {
        this.evaluate = function(evaluator) {
          return this.childs[0].evaluate(evaluator);
        }
      }
      else {
        this.evaluate = function(evaluator) {
          return -(this.childs[0].evaluate(evaluator));
        }
      }
    }
    
    // parentheses
    else if (this.type === "parentheses") {
      this.evaluate = function(evaluator, getMatrix) {
        return this.childs[0].evaluate(evaluator, getMatrix);
      }
    }
    
    // expression of the type (x,y) or [x,y]
    else if ( (this.type === "(expr)") || (this.type === "[expr]") ) {
      var l;
      var result;
      var tmpRes;
      this.evaluate = function(evaluator) {
        l = this.childs.length;
        result = [];

        if ( (l === 1) && (this.childs[0].childs.length === 1) && (this.type === "(expr)") ) {
          result = this.childs[0].childs[0].evaluate(evaluator);
        }

        else {
          for (var i=0; i<l; i++) {
            tmpRes = [];
            for (var j=0, n=this.childs[i].childs.length; j<n; j++) {
              tmpRes.push( this.childs[i].childs[j].evaluate(evaluator));
            }
            result[i] = tmpRes;
          }
        }

        return result;
      }
    }

    // asignation
    else if (this.type === "asign") {
      var ide;
      var expre;
      var pos;
      var tmpPos;
      var tmpPos0;
      var tmpPos1;
      var asignation;

      this.evaluate = function(evaluator) {
        ide = this.childs[0];
        expre = this.childs[1];

        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket")) {
          pos = ide.childs[0].childs;

          // vector 
          if (pos.length === 1) {
            tmpPos = pos[0].evaluate(evaluator);
            tmpPos = (tmpPos < 0) ? 0 : mathFloor(tmpPos);

            evaluator.vectors[ide.value][tmpPos] = expre.evaluate(evaluator);

            return;
          }

          // matrix
          else if (pos.length === 2) {
            tmpPos0 = pos[0].evaluate(evaluator);
            tmpPos1 = pos[1].evaluate(evaluator);
            tmpPos0 = (tmpPos0 < 0) ? 0 : mathFloor(tmpPos0);
            tmpPos1 = (tmpPos1 < 0) ? 0 : mathFloor(tmpPos1);

            // condition to handle wrong matrix access
            if (!evaluator.matrices[ide.value][tmpPos0]) {
              evaluator.matrices[ide.value][tmpPos0] = [];
            }
            evaluator.matrices[ide.value][tmpPos0][tmpPos1] = expre.evaluate(evaluator);

            return;
          }
        }
        else {
          asignation = expre.evaluate(evaluator);

          // the asignation is a variable
          if (!asignation.type) {

            // prevent to asign a value to an auxiliar variable
            if (typeof(evaluator.variables[ide.value]) !== "object") {
              evaluator.variables[ide.value] = asignation;
            }

          } 
          // the asignation is a matrix
          else {
            evaluator.matrices[ide.value] = asignation;
          }

          return;
        }
      }
    }
  }

  var rows;
  var cols;
  var result;
  var i, j, k, l;

  /**
   *
   */
  function createMatrix(rows, cols) {
    result = [];
    result.type = "matrix";
    result.rows = rows;
    result.cols = cols;
    
    var vectInit;
    for (j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      result[j] = vectInit;
    }

    return result;
  }

  /**
   *
   */
  function sumMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] + op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function substactMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] - op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function multiplicationMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);
    var sum;

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        sum = 0;
        for (k=0; k<cols; k++) {
          sum += op1[k][j]*op2[i][k];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  /**
   *
   */
  function minor(I, J, T) {
    var M = createMatrix(T.length-1, T.length-1);

    for (var i=0, l=M.length; i<l; i++) {
      for (var j=0; j<l; j++) {
        if (i<I) {
          if (j<J) {
            M[i][j] = T[i][j];
          }
          else {
            M[i][j] = T[i][j+1];
          }
        }
        else {
          if (i<J) {
            M[i][j] = T[i+1][j];
          }
          else {
            M[i][j] = T[i+1][j+1];
          }
        }
      }
    }

    return M;
  }
  /**
   *
   */
  function determinant(T) {
    if (T.cols > 1) {
      var D = 0;
      var s = 1;
      for (var j=0, l=T.cols; j<l; j++) {
        D += s*T[0][j]*determinant(minor(0, j, T));
        s = -s;
      }
      return D;
    } else {
      return T[0][0];
    }
   }

  /**
   *
   */
  function inverseMatriz(T) {
    var S = createMatrix(T.length, T.length);
    var det = determinant(T);

    if (det === 0) {
      return 0;
    }

    var s = 1/det;
    var t;

    if (T.length > 1) {
      for (var i=0, l=T.length; i<l; i++) {
        t = s;
        for (var j=0; j<l; j++) {
          S[j][i] = t*determinant(minor(i, j, T));
          t = - t;
        }
        s = -s;
      }
    }
    else {
      S[0][0] = s;
    }

    return S;
  }  

  /**
   *
   */
  function divisionMatriz(op1, op2) {
    var inverse = inverseMatriz(op2);

    if (inverse === 0) {
      return createMatrix(op1.rows, op1.cols);
    }

    return multiplicationMatrix(op1, inverse);
  }

  /**
   */
  descartesJS.Node.prototype.toString = function() {
    var str = "tipo: " + this.type + ", valor: " + this.value + "\n";
  
    this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    for (var i=0, l=this.childs.length; i<l; i++) {
      str += this.sep +this.childs[i].toString();
    }
  
    return str;
  }  

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var inputInicial;
  var tokens ;
  var exit;
  var pos;
  var val;
  var str;
  var inc;
  var count;
  var lastTokenType;

  var whiteSpaceRegExp = /^\s+/;
  var identifierRegExp = /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[0-9a-zA-Z_\u00C0-\u021B]+[0-9]*)*/;
  var numberRegExp = /^[0-9]+[.][0-9]+|^[.][0-9]+|^[0-9]+/;
  var compOperatorRegExp = /^==|^!=|^<=|^<|^>=|^>|^#/;
  var boolOperatorRegExp = /^\!|^\~|^\&\&|^\&|^\|\||^\|/;
  var asignRegExp = /^=/;
  var conditionalRegExp = /^[\?\:]/;
  var operatorRegExp = /^[\+\-\*\/\%\^]/;
  var squareBracketRegExp = /^\[|^\]/;
  var parenthesesRegExp = /^\(|^\)/;
  var separatorRegExp = /^,/;
  var finalOfExpressionRegExp = /^;/;

  /**
   * Descartes tokenizer
   * @constructor 
   */
  descartesJS.Tokenizer = function() {  };
  
  descartesJS.Tokenizer.prototype.tokenize = function(input) {
    inputInicial = input;

    if (input) {
      // change the values in UTF of the form \u##
      input = input.replace(/\\u(\S+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1, 16)); });

      // superindex numbers codified with &sup#;
      input = input.replace(/\&sup(.+);/g, "^ $1 ");

      // single quotation marks
      input = input.replace(/&squot;/g, "'");
      
      // replace the pipes used like string marks
      if (input.match(/\=\|\*/g)) {
        input = input.replace("|*", "'", "g").replace("*|", "'", "g");
      }
      // replace the pipes used like string marks
      if (input.match(/\=\|/g)) {
        input = input.replace("|", "'", "g");
      }
    }
    
    tokens = [];
    exit = false;
    pos = 0;
    str = input;
    count = 0;
    lastTokenType = "";
       
    /** 
     * Auxiliar function to add tokens and move the character position
     * @param {String} type the type of the token
     * @param {String} value the value of the token
     * @param {Number} size the length of the value of the token
     */
    function addToken(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
      count++;
      lastTokenType = type;
    }

    while ((input) && (pos < input.length)) {
      exit = pos;
      
// console.log("--253", input.charAt(pos), input.charAt(pos).charCodeAt(0), String.fromCharCode(179))

      // string
      if (str[0] == "'") {
        inc = 1;
        while (str[inc] != "'") {
          if (inc < str.length) {
            inc++;
          } else {
            console.log(">Error, unknown symbol: ["+str+"], in the string <<" + inputInicial + ">>" );
            return;
          }
        }
        
        val = str.substring(1, inc);
        addToken("string", val, val.length+2);
        continue;
      }
      
      // white spaces
      val = str.match(whiteSpaceRegExp);
      if (val) {
        str = str.slice(val[0].length);
        pos += val[0].length;
        count++;
        continue;
      }
      
      // identifier
      val = str.match(identifierRegExp);
      if (val) {
        // expression of the form 2pi change to 2*pi, so we need to know that the type of the last token is a number
        if (lastTokenType === "number") {
          // add a multiplication operator
          tokens.push({ type: "operator", value: "*" });
        }
        // add the identifier token
        addToken("identifier", val[0], val[0].length);
        continue;
      }
    
      // number
      val = str.match(numberRegExp);
      if (val) {
        addToken("number", val[0], val[0].length);
        continue;
      }
    
      // comparison
      val = str.match(compOperatorRegExp);
      if (val) {
        var tempVal = val[0];

        if (tempVal == "#") { tempVal = "!="; }     
          addToken("compOperator", tempVal, val[0].length);
        continue;
      }

      // booleans
      val = str.match(boolOperatorRegExp);
      if (val) {
        var tempVal = val[0];
        if (tempVal == "||") { tempVal = "|"; } 
        else if (tempVal == "&&") { tempVal = "&"; }
        else if (tempVal == "~") { tempVal = "!"; }

        addToken("boolOperator", tempVal, val[0].length);
        continue;
      }

      // equal (asign)
      val = str.match(asignRegExp);
      if ((val) && !(str.match( /^==/))) {
        addToken("asign", val[0], val[0].length);
        continue;
      }

      // conditional
      val = str.match(conditionalRegExp);
      if (val) {
        addToken("conditional", val[0], val[0].length);
        continue;
      }
    
      // operator
      val = str.match(operatorRegExp);
      if (val) {
        addToken("operator", val[0], val[0].length);
        continue;
      }

      // square brackets
      val = str.match(squareBracketRegExp);
      if (val) {
        addToken("square_bracket", val[0], val[0].length);
        continue;
      }

      // parentheses
      val = str.match( parenthesesRegExp );
      if (val) {
        if ((val == "(") && (lastTokenType === "number")) {
          // add a multiplication operator
          tokens.push({ type: "operator", value: "*" });
        }

        addToken("parentheses", val[0], val[0].length);
        continue;
      }

      // separator
      val = str.match(separatorRegExp);
      if (val) {
        addToken("separator", val[0], val[0].length);
        continue;
      }

      // square
      if (str.charCodeAt(0) === 178) {
        // add a multiplication operator
        tokens.push({ type: "operator", value: "^" });

        // add the identifier token
        addToken("number", 2, 1);
        continue;
      }
      // cube
      if (str.charCodeAt(0) === 179) {
        // add a multiplication operator
        tokens.push({ type: "operator", value: "^" });

        // add the identifier token
        addToken("number", 3, 1);
        continue;
      }

      // final of expression
      val = str.match(finalOfExpressionRegExp);
      if (val) {
        addToken("final_of_expresion", val[0], val[0].length);
        continue;
      }

      if (exit == pos){
        console.log("Error, simbolo no conocido: ["+str+"], en la cadena <<" + inputInicial + ">>" );
        return;
      }
    }
  
    return tokens;
  }
  
  var result;
  var exclude = /rnd|pi|e|Infinity|-Infinity|sqr|sqrt|raíz|exp|log|log10|abs|ent|sgn|ind|sin|sen|cos|tan|cot|sec|csc|sinh|senh|cosh|tanh|coth|sech|csch|asin|asen|acos|atan|min|max/;

  /**
   * Auxiliary funtion for the macros that take a list of tokens and get a string representation
   * @param {Array<Object>} tokens the tokens to be flat
   * @return {String} return a string representation of the tokens
   */
  descartesJS.Tokenizer.prototype.flatTokens = function(tokens, prefix) {
    tokens = tokens || [];
    prefix = prefix || "";

    result = "";
    
    for (var i=0, l=tokens.length; i<l; i++) {
      if (tokens[i].type == "string") {
        result = result + "&squot;" + tokens[i].value + "&squot;";
      } 
      else if ((tokens[i].type == "identifier") && (!tokens[i].value.match(exclude))) {
        result = result + prefix + tokens[i].value;
      }
      else {
        result = result + tokens[i].value;
      }
    }
    
    return result;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Descartes parser
   * @constructor 
   */
  descartesJS.Parser = function(evaluator) {
    this.evaluator = evaluator;
    
    this.tokenizer = new descartesJS.Tokenizer();
    this.vectors = {};
    this.matrices = {};
    this.variables = {};
    this.functions = {};
    
    this.registerDefaultValues();
  }
  
  /**
   * Set the value to a variable
   * @param {String} name the name of the variable to set
   * @param {Object} value the value of the variable to set
   */
  descartesJS.Parser.prototype.setVariable = function(name, value) {
    this.variables[name] = value;
  }

  /**
   * Get the value to a variable
   * @param {String} name the name of the variable to get the value
   */
  descartesJS.Parser.prototype.getVariable = function(name) {
    // this.variables[name] = (this.variables[name] !== undefined) ? this.variables[name] : 0;
    return this.variables[name];
  }

  /**
   * Set the value of a position in a vector
   * @param {String} name the name of the vector to set
   * @param {Number} pos the position in the vector to set
   * @param {Object} value the value of the vector to set
   */
  descartesJS.Parser.prototype.setVector = function(name, pos, value) {
    this.vectors[name][pos] = value;
  }

  /**
   * Get the value to a vector
   * @param {String} name the name of the vector to get the value
   */
  descartesJS.Parser.prototype.getVector = function(name) {
    if (!this.vectors.hasOwnProperty(name)) {
      this.vectors[name] = [0,0,0];
    }
    return this.vectors[name];
  }

  /**
   * Set the value of a position in a matrix
   * @param {String} name the name of the matrix to set
   * @param {Number} pos1 the row position in the matrix to set
   * @param {Number} pos2 the column position in the matrix to set
   * @param {Object} value the value of the matrix to set
   */
  descartesJS.Parser.prototype.setMatrix = function(name, pos1, pos2, value){
    this.matrices[name][pos1][pos2] = value;
  }

  /**
   * Get the value to a matrix
   * @param {String} name the name of the matrix to get the value
   */
  descartesJS.Parser.prototype.getMatrix = function(name){
    if (!this.matrices.hasOwnProperty(name)) {
      this.matrices[name] = [[0,0,0],[0,0,0],[0,0,0]];
    }
    return this.matrices[name];
  }

  /**
   * Set the value to a function
   * @param {String} name the name of the function to set
   * @param {Object} value the value of the function to set
   */
  descartesJS.Parser.prototype.setFunction = function(name, value){
    this.functions[name] = value;
  }

  /**
   * Get a function
   * @param {String} name the name of the function to get
   */
  descartesJS.Parser.prototype.getFunction = function(name){
    if (!this.functions.hasOwnProperty(name)) {
      this.functions[name] = function(){ return 0; };
    }
    return this.functions[name];
  }

  var parenthesesType = "parentheses";
  var squareBracketType = "square_bracket";
  var asignType = "asign";
  var compOperatorType = "compOperator";
  var identifierType = "identifier";
  var operatorType = "operator";
  var boolOperatorType = "boolOperator";
  var conditionalType = "conditional";
  var signType = "sign";
  var numberType = "number";
  var stringType = "string";
  var i;
  var l;
  var tokens;
  var lastNode;
  var node;
  var asignation;
  var count;
  var openParentesis;
  var openSquareBracket;
  var openConditional;
  var tokens_i;
  var tokens_i_value;
  var tokens_i_type;
  var root;  
 
  /**
   * Function that parses a string
   * @param {String} input the input to parse
   * @param {Boolean} asignation identify if the input is treated like an asignation
   * @return {Node} return a parse tree from the parses input
   */
  descartesJS.Parser.prototype.parse = function(input, asignation) {
    tokens = this.tokenizer.tokenize(input);

    // tokens is undefined
    if (!tokens) {
      tokens = [];
    }
    lastNode = null;
    asignation = !asignation || false;
    count = 0;
    
    openParentesis = 0;
    openSquareBracket = 0;
    openConditional = 0;
    
    for (i=0, l=tokens.length; i<l; i++) {
      tokens_i = tokens[i];
      tokens_i_value = tokens_i.value;
      tokens_i_type = tokens_i.type;
      
      ////////////////////////////////////////////////////////////////////////////////      
      // verify if the variables exist
      ////////////////////////////////////////////////////////////////////////////////      
      if (tokens_i_type === identifierType) {
        // the identifier is a function
        if ( ((i+1)<l) && (tokens[i+1].type === parenthesesType) && (tokens[i+1].value === "(") ) {
          this.getFunction(tokens_i_value);
        }
        // the identifier is a vector or a matrix
        else if ( ((i+1)<l) && (tokens[i+1].type === squareBracketType) && (tokens[i+1].value === "[") ) {
          // vector
          if ( (tokens[i+3]) && (tokens[i+3].type === squareBracketType) && (tokens[i+3].value === "]") ) {
            this.getVector(tokens_i_value);
          }
          // matrix
          else {
            this.getMatrix(tokens_i_value);
          }
        }
        // the identifier is a variable
        else {
          // this.getVariable(prefix + tokens_i_value);
          this.getVariable(tokens_i_value);
        } 
      }
      ////////////////////////////////////////////////////////////////////////////////
      
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Asignation (one equal sign)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type === asignType) && (asignation) ) {
        tokens_i_type = compOperatorType;
        tokens_i_value = "==";
      }
      if (tokens_i_type === asignType) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        // the tree is not empty
        if (lastNode != null) {
          // the last element of the tree is an identifier
          if (lastNode.type === identifierType) {
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
            } 
            
            node.addChild(lastNode);
            lastNode = node;
            asignation = true;
          }
          // the last element of the tree is a square bracket
          else if (lastNode.type === squareBracketType) {
            node.addChild(lastNode.parent);
            lastNode = node;
            asignation = true;            
          }
          
          // otherwise
          else {
            node.type = compOperatorType;
            node.value = "==";
            asignation = true;
            
            // find an element in the tree having a higher precedence to the node to be added
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) >= this.getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }
            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            // reached the root
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
        } 
        
        // do not have last element
        else {
          console.log("Error1: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
      
        // continue with the next token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Parentheses, function, vectors and matrices
      //
      ////////////////////////////////////////////////////////////////////////////////
      // open parentheses and open square brackets 
      if ( (tokens_i_type === parenthesesType) && (tokens_i_value === "(") || 
        (tokens_i_type === squareBracketType) && (tokens_i_value === "[") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
      
        if (tokens_i_value === "(") {
          openParentesis++;
        }
        
        if (tokens_i_value === "[") {
          openSquareBracket++;
        }

        // the first element of the tree
        if (lastNode === null) {
          if (tokens_i_value === "(") {
            (new descartesJS.Node("(expr)", "(expr)")).addChild(node);
          }

          if (tokens_i_value === "[") {
            (new descartesJS.Node("[expr]", "[expr]")).addChild(node);
          }
          
          lastNode = node;
        }
        // the tree has some element
        else {
          // the last element of the tree is an operator
          if ( (lastNode.type === operatorType) || (lastNode.type === boolOperatorType) || (lastNode.type === compOperatorType) || (lastNode.type === conditionalType) || (lastNode.type === asignType) ) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          // the last element is a sign
          else if (lastNode.type === signType) {
            lastNode.addChild(node);
            lastNode = node;
          }

          // the last element in the tree is an open parentheses
          else if ((lastNode.type === parenthesesType) && (lastNode.value === "(")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          // the last element in the tree is an open square bracket
          else if ((lastNode.type === squareBracketType) && (lastNode.value === "[")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          // the last element in the tree is a close parentheses
          else if ((lastNode.type === parenthesesType) && (lastNode.value === "()")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          // the last element in the tree is a close square bracket
          else if ((lastNode.type === squareBracketType) && (lastNode.value === "[]")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          // the last element in the tree is an identifier
          else if (lastNode.type === identifierType) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          // otherwise
          else {
            console.log("Error2: en la expresion <<" + input + ">>, en el token ["+ i +"] {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        // continue with the next token
        continue;
      }
      
      // close parentheses
      else if ((tokens_i_type === parenthesesType) && (tokens_i_value === ")")) {

        openParentesis--;

        // the first element of the tree
        if (lastNode === null) {
          console.log("Error3: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        // the tree has some element
        else {
          // find the correspondign open parentheses
          while (lastNode && lastNode.parent && (lastNode.value != "(")) {
            lastNode = lastNode.parent;
          }
          
          // if find the parentheses match
          if ((lastNode) && (lastNode.value === "(")) {
            lastNode.value = "()";
          }
          
          // if not find the parentheses match
          else {
            console.log("Error4: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        // continue with the next token
        continue;
      }
      
      // close square brackets
      else if ((tokens_i_type === squareBracketType) && (tokens_i_value === "]")) {

        openSquareBracket--;
        
        // the first element of the tree
        if (lastNode === null) {
          console.log("Error5: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        // the tree has some element
        else {
          // find the correspondign square brackets
          while (lastNode && lastNode.parent && (lastNode.value != "[")) {
            lastNode = lastNode.parent;
          }
          
          // if find the square brackets
          if ((lastNode) && (lastNode.value === "[")) {
            lastNode.value = "[]";
          }
          
          // if not find the square brackets
          else {
            console.log("Error6: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        // continue with the next token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Numbers, strings and identifiers
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ((tokens_i_type === numberType) || (tokens_i_type === stringType) || (tokens_i_type === identifierType)) {
        if (tokens_i_type === identifierType) {
          // node = new descartesJS.Node(tokens_i_type, prefix + tokens_i_value);
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }
        else {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }

        // the first element of the tree
        if (lastNode === null) {
          lastNode = node;
        }
        
        // the tree has some element
        else {
          // the last element of the tree is an operator, an open parentheses, a sign or an asignation
          if ( (lastNode.type === operatorType) || (lastNode.type === compOperatorType) || (lastNode.type === boolOperatorType) || ((lastNode.type === parenthesesType) && (lastNode.value === "(")) || ((lastNode.type === squareBracketType) && (lastNode.value === "[")) || (lastNode.type === signType)  || (lastNode.type === conditionalType) || (lastNode.type === asignType)) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          // otherwise
          else {
            console.log("Error7: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        // continue with the next token
        continue;
      }

      ////////////////////////////////////////////////////////////////////////////////
      //
      // Operators
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type === operatorType) || (tokens_i_type === compOperatorType) || (tokens_i_type === boolOperatorType) ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        // the first element of the tree
        if (lastNode === null) {
          // an operator can start an expression if is a sign expression
          if ((tokens_i_value === "-") || (tokens_i_value === "+")){
            node.type = signType;
            node.value = signType + tokens_i_value;
            lastNode = node;
          } 
            
          // an operator can start an expression if is a boolean negation
          else if (tokens_i_value === "!") {
            lastNode = node;
          }

          // otherwise
          else {
            console.log("Error8: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");  //throw("Error: no se puede iniciar una expresion con un operador <<" + input + ">>")
            break;
          }
        }
        
        // the tree has some element
        else {
          // the last element of the tree is an operator or an open parentheses and the operator is + or -
          if ( (lastNode.type === operatorType) || (lastNode.type === compOperatorType) || (lastNode.type === boolOperatorType) || (lastNode.type === asignType) || (lastNode.type === conditionalType) || (((lastNode.type === squareBracketType) && (lastNode.value === "[")) && ((tokens_i_value === "-") || (tokens_i_value === "+") || (tokens_i_value === "!"))) || (((lastNode.type === parenthesesType) && (lastNode.value === "(")) && ((tokens_i_value === "-") || (tokens_i_value === "+") || (tokens_i_value === "!"))) ) {
            // sign of an expression
            if ((tokens_i_value === "-") || (tokens_i_value === "+")){
              node.type = signType;
              node.value = signType + tokens_i_value;
            }
            lastNode.addChild(node);
            lastNode = node;
          }
            
          // the last element of the tree is a number, parenthetical expression, a string or an identifier
          else if ( (lastNode.type === numberType) || ((lastNode.type === parenthesesType) && (lastNode.value === "()")) || ((lastNode.type === squareBracketType) && (lastNode.value === "[]")) || (lastNode.type === stringType) || (lastNode.type === identifierType) || (lastNode.type === conditionalType) ||(lastNode.type === asignType) ) {
              
            // find an element in the tree having a higher precedence to the node to be added
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) >= this.getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }
              
            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
              
            // reached the root
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
            
          // otherwise
          else {
            console.log("Error9: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        // continue with the next token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Conditional
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type === conditionalType) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        // the tree has some element
        if (lastNode != null) {
          // the operator is ?
          if (node.value === "?") {
            openConditional++;
            
            // find an element in the tree having a higher precedence to the node to be added
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) > this.getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }
            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            // reached the root
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          } else {
            openConditional--;
            
            // find the correspondign signo ? correspondiente
            while (lastNode && lastNode.parent && (lastNode.value != "?")) {
              lastNode = lastNode.parent;
            }
            // if can find the ?
            if ((lastNode) && (lastNode.value === "?")) {
              lastNode.value = "?:";
            }
            
            // if can not find the ?
            else {
              console.log("Error10: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
              break;
            }
          }
        }
      
        // last element do not exist
        else {
          console.log("Error11: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
    
        // continue with the next token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Separator (comma ,)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type === "separator") {
        // the tree has some element
        if (lastNode != null) {
          // find in the tree an open parentheses
          while ( (lastNode.parent) && (lastNode.value != "(") && (lastNode.value != "[") ) {
            lastNode = lastNode.parent;
          }
        }
        
        else {
          console.log("Error12: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
        
        // continue with the next token
        continue;
      }
      
      console.log("Error13: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
      break;
    }
    
    // missing or too many parentheses or square brackets
    if (openParentesis > 0) {
      alert("Error, faltan parentesis por cerrar: " + input);
    }
    if (openParentesis < 0) {
      alert("Error, faltan parentesis por abrir: " + input);
    }
    
    if (openSquareBracket > 0) {
      alert("Error, faltan square bracketss por cerrar: " + input);
    }
    if (openSquareBracket < 0) {
      alert("Error, faltan square bracketss por abrir: " + input);
    }
    // miss the second term of the conditional
    if (openConditional !=0) {
      alert("Error, condicional incompleta: " + input);
    }

    root = (lastNode) ? lastNode.getRoot() : null;
    if (root) {
      root.setAllEvaluateFunction();
    }

    return root;
  }

  /**
   * Get the precedence of an operator
   * @param {String} op the operator to get the precedence
   * @return {Number} return a number that represent the precedence
   */
  descartesJS.Parser.prototype.getPrecedence = function(op) {
    switch(op){
      case "=":  return 1;
      case "(":  return 2;
      case "[":  return 2;
      case "?":  return 2;
      case ":":  return 3;
      case "?:": return 3;
      case "|":  return 6; //check
      case "&":  return 7; //check
      case "<":  return 5;
      case "<=": return 5;
      case ">":  return 5;
      case ">=": return 5;
      case "==": return 5;
      case "!=": return 5;
      case "+":  return 6;
      case "-":  return 6;
      case "/":  return 7;
      case "*":  return 7;
      case "sign-": return 7;
      case "sign+": return 7;
      case "!":  return 8;
      case "%":  return 8;
      case "^":  return 9;
      default:   return 9;
    }
  }

  /**
   * Register the default variables and functions of Descartes
   */
  descartesJS.Parser.prototype.registerDefaultValues = function() {
    var decimals = 1000000000000000;
    // register the default variables
    this.variables["rnd"] = Math.random;
    this.variables["pi"] = descartesJS.returnValue(Math.PI);
    this.variables["e"] = descartesJS.returnValue(Math.E);
    this.variables["Infinity"] = Infinity;
    this.variables["-Infinity"] = -Infinity;
    
    // register the default funtions
    this.functions["sqr"]   = function(x) { return (x*x) };
    this.functions["sqrt"]  = this.functions["raíz"] = Math.sqrt;
    this.functions["exp"]   = Math.exp;
    this.functions["log"]   = Math.log;
    this.functions["log10"] = function(x) { return Math.log(x)/Math.log(10); };
    this.functions["abs"]   = Math.abs;
    this.functions["ent"]   = Math.floor; //function(x) { return Math.floor( parseInt(x*decimals)/decimals ); };
    this.functions["sgn"]   = function(x) { return (x>0) ? 1 : ((x<0) ? -1 : 0); };
    this.functions["ind"]   = function(x) { return (x) ? 1 : 0 };
    this.functions["sin"]   = this.functions["sen"] = Math.sin;
    this.functions["cos"]   = Math.cos;
    this.functions["tan"]   = Math.tan;
    this.functions["cot"]   = function(x) { return 1/Math.tan(x); };
    this.functions["sec"]   = function(x) { return 1/Math.cos(x); };
    this.functions["csc"]   = function(x) { return 1/Math.sin(x); };
    this.functions["sinh"]  = this.functions["senh"] = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
    this.functions["cosh"]  = function(x) { return (Math.exp(x)+Math.exp(-x))/2; };
    this.functions["tanh"]  = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); };
    this.functions["coth"]  = function(x) { return 1/this.functions.tanh(x); };
    this.functions["sech"]  = function(x) { return 1/this.functions.cosh(x); };
    this.functions["csch"]  = function(x) { return 1/this.functions.sinh(x); };
    this.functions["asin"]  = this.functions["asen"] = Math.asin;
    this.functions["acos"]  = Math.acos;
    this.functions["atan"]  = Math.atan;
    this.functions["min"]   = Math.min;
    this.functions["max"]   = Math.max;
    this.functions["_Num_"] = function(x) { return parseFloat(x); };

    // new internal functions
    var self = this;
    this.functions["_Trace_"] = function(x) { console.log(x); };
    this.functions["_Stop_Audios_"] = function() { self.evaluator.parent.stopAudios(); };
    ////////////////////////////////////////

    // function for the dialog
    this.functions["esCorrecto"] = function(x, y, regExp) { return descartesJS.esCorrecto(x, y, self.evaluator, regExp); };
    this.functions["escorrecto"] = function(x, y, regExp) { return descartesJS.escorrecto(x, y, self.evaluator, regExp); };

    // if the lesson is inside a iframe then register the comunication functions with the parent
    if (window.parent !== window) {

      // function to set a variable value to the parent
      this.functions["parent.set"] = function(varName, value) {
        window.parent.postMessage({ type: "set", name: varName, value: value }, '*');
      }
      
      // function to update the parent
      this.functions["parent.update"] = function() {
        window.parent.postMessage({ type: "update" }, '*');
      }

      // function to execute a function in the parent
      this.functions["parent.exec"] = function(functionName, functionParameters) {
        window.parent.postMessage({ type: "exec", name: functionName, value: functionParameters }, '*');
      }
    }

    ////////////////////////////////////////
    // new funcionaity //
    this.functions["_GetValues_"] = function(file, name) {
      var response;
      if (file) {
        var fileElement = document.getElementById(file);

        if ((fileElement) && (fileElement.type == "descartes/archivo")) {
          response = fileElement.text.replace(/&brvbar;/g, "¦");
        }
      }
      else {
        response = descartesJS.openExternalFile(file);
      }

      var initialIndex = -1;
      var finalIndex = -1;
      var values = [];
      var storeValues = false;
      var tmpValue;

      if (response) {
        response = response.replace(/\r/g, "").split("\n");

        for (var i=0, l=response.length; i<l; i++) {

          // initial position of the values
          if (response[i].match("<" + name + ">")) {
            tmpValue = response[i].trim().split("<" + name + ">");

            if ((tmpValue.length == 2) && (tmpValue[1] != "")) {
              values = values.concat(tmpValue[1].split("¦"));
            }

            storeValues = true;
            continue;
          }

          // final position of the values
          if (response[i].match("</" + name + ">")) {
            tmpValue = response[i].trim().split("</" + name + ">");

            if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
              values = values.concat(tmpValue[0].split("¦"))
            }

            storeValues = false;
            continue;
          }

          // add elementes in between
          if (storeValues) {
            values = values.concat(response[i].split("¦"));
          }
        }

        for(var i=0,l=values.length; i<l; i++) {
          tmpValue = values[i].split("=");
          tmpValue[0] = tmpValue[0].trim();

          if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
            // is a string
            if (isNaN(parseFloat(tmpValue[1]))) {
              // .replace(/^\s|\s$/g, "") remove the initial white space
              self.setVariable(tmpValue[0], tmpValue[1].replace(/^\s|\s$/g, ""));
            }
            // is a number
            else {
              self.setVariable(tmpValue[0], parseFloat(tmpValue[1]));
            }
          }
        }
      }

      return 0;
    };

    this.functions["_GetMatrix_"] = function(file, name) {
      var response;
      if (file) {
        var fileElement = document.getElementById(file);

        if ((fileElement) && (fileElement.type == "descartes/archivo")) {
          response = fileElement.text.replace(/&brvbar;/g, "¦");
        }
      }
      else {
        response = descartesJS.openExternalFile(file);
      }
      
      var initialIndex = -1;
      var finalIndex = -1;
      var values = [];
      var storeValues = false;
      values.type = "matrix";

      var tmpValue;

      if (response) {
        response = response.replace(/\r/g, "").split("\n");

        for (var i=0, l=response.length; i<l; i++) {
          // initial position of the values
          if (response[i].match("<" + name + ">")) {
            tmpValue = response[i].trim().split("<" + name + ">");

            if ((tmpValue.length == 2) && (tmpValue[1] != "")) {
              values.push(tmpValue[1].split("¦").map(myMapFun));
            }

            storeValues = true;
            continue;
          }

          // final position of the values
          if (response[i].match("</" + name + ">")) {
            tmpValue = response[i].trim().split("</" + name + ">");

            if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
              values.push(tmpValue[0].split("¦").map(myMapFun));
            }

            storeValues = false;
            continue;
          }

          // add elementes in between
          if (storeValues) {
            values.push(response[i].split("¦").map(myMapFun));
          }
        }

        self.matrices[name] = values;
        self.setVariable(name + ".filas", values[0].length);
        self.setVariable(name + ".columnas", values.length);
      }

      return 0;
    };

    var anchor = document.createElement("a");
    var blob;
    /**
     *
     */
    this.functions["_Save_"] = function(filename, data) {
      document.body.appendChild(anchor);
      blob = new Blob([data.replace(/\\n/g, "\n")], {type: "text/plain"});

      anchor.setAttribute("download", filename);
      anchor.setAttribute("href", window.URL.createObjectURL(blob));
      anchor.click();

      document.body.removeChild(anchor);

      return 0;
    };

    var files;
    var reader;
    var _varname;
    var _callback;
    var input = document.createElement("input");
    input.setAttribute("type", "file");

    onHandleFileSelect = function(evt) {
      files = evt.target.files;

      reader = new FileReader();
      /**
       * read the content of the file
       */
      reader.onload = function(evt) {
        descartesJS.addExternalFileContent(files[0].name, evt.target.result)

        self.setVariable(_varname, files[0].name);

        if (self.getFunction(_callback)) {
          self.getFunction(_callback).apply(self.evaluator, []);
          self.evaluator.parent.update();
        }
      }

      if (files.length >0) {
        reader.readAsText(files[0]);
      }
    }

    input.addEventListener("change", onHandleFileSelect);

    /**
     *
     */
    this.functions["_Open_"] = function(varname, callback) {
      _varname = varname;
      _callback = callback;

      input.click();

      return 0;
    }

    /**
     *
     */
    this.functions["_SaveState_"] = function() {
      this.functions._Save_("state.txt", JSON.stringify( { variables: this.variables, vectors: this.vectors, matrices: this.matrices } ) );
      return 0;
    }

    var files2;
    var reader2;
    var input2 = document.createElement("input");
    input2.setAttribute("type", "file");

    /**
     *
     */
    function copyNewValues(oldVal, newVal) {
      // traverse the values to replace the defaults values of the object
      for (var propName in newVal) {
        // verify the own properties of the object
        if (newVal.hasOwnProperty(propName)) {
          oldVal[propName] = newVal[propName];
        }
      }
    }

    /**
     *
     */
    onHandleFileSelect2 = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      files2 = evt.target.files;

      reader2 = new FileReader();
      /**
       * read the content of the file
       */
      reader2.onload = function(evt) {
        var jsonParse = {};
        try {
          jsonParse = JSON.parse(evt.target.result);
        }
        catch(e) { };

        if (jsonParse.variables) {
          copyNewValues(self.variables, jsonParse.variables);
        }
        if (jsonParse.vectors) {
          copyNewValues(self.vectors, jsonParse.vectors);
        }
        if (jsonParse.matrices) {
          copyNewValues(self.matrices, jsonParse.matrices);
        }

        self.evaluator.parent.update();
      }

      if (files2.length >0) {
        reader2.readAsText(files2[0]);
      }
    }
    input2.removeEventListener("change", onHandleFileSelect2);
    input2.addEventListener("change", onHandleFileSelect2);

    /**
     *
     */
    this.functions["_OpenState_"] = function() {
      input2.click(); 

      return 0;
    }

    /**
     *
     */
    this.functions["_Rojo_"] = function(c) {
      return (new descartesJS.Color(c).r)/255;
    }
    /**
     *
     */
    this.functions["_Verde_"] = function(c) {
      return (new descartesJS.Color(c).g)/255;
    }
    /**
     *
     */
    this.functions["_Azul_"] = function(c) {
      return (new descartesJS.Color(c).b)/255;
    }
    /**
     *
     */
    this.functions["_AnchoDeCadena_"] = function(str, font, style, size) {
      return descartesJS.getTextWidth(str, descartesJS.convertFont(font + "," + style + "," + size))
    }
    ////////////////////////////////////////
  }  

/**
 *
 */
function myMapFun(x) {
  if (isNaN(parseFloat(x))) {
    // .replace(/^\s|\s$/g, "") remove the initial white space
    return x.replace(/^\s|\s$/g, "");
  }
  else {
    return parseFloat(x);
  }
}

// console.log(((new descartesJS.Parser).parse("(t,func(t))")).toString());
// console.log(((new descartesJS.Parser).parse("((Aleat=0)&(Opmult=2)|(Aleat=1)&(Opmult=3))\nVerError=(Opm_ok=0)\nPaso=(Opm_ok=1)?Paso+1:Paso")).toString());
// console.log(((new descartesJS.Parser).parse("3(x+2)")).toString());
// console.log(((new descartesJS.Parser).parse("-2^1.4")).toString());

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
    
  /**
   * Descartes evaluador
   * @parent {DescartesApp} parent the parent asociated with the evaluator
   * @constructor 
   */
  descartesJS.Evaluator = function (parent) {
    this.parent = parent;
    this.parser = new descartesJS.Parser(this);
    this.variables = this.parser.variables;
    this.functions = this.parser.functions;
    this.vectors   = this.parser.vectors;
    this.matrices  = this.parser.matrices;
  }
  
  /**
   * Set the value to a variable
   * @param {String} name the name of the variable to set
   * @param {Object} value the value of the variable to set
   */
  descartesJS.Evaluator.prototype.setVariable = function(name, value) {
    this.variables[name] = value;
  }

  /**
   * Get the value to a variable
   * @param {String} name the name of the variable to get the value
   */
  descartesJS.Evaluator.prototype.getVariable = function(name) {
    return this.variables[name];
  }

  /**
   * Set the value of a position in a vector
   * @param {String} name the name of the vector to set
   * @param {Number} pos the position in the vector to set
   * @param {Object} value the value of the vector to set
   */
  descartesJS.Evaluator.prototype.setVector = function(name, pos, value) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    this.vectors[name][pos] = value;
  }

  /**
   * Get the value to a vector
   * @param {String} name the name of the vector to get the value
   */
  descartesJS.Evaluator.prototype.getVector = function(name, pos) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    return this.vectors[name][pos];
  }

  /**
   * Set the value of a position in a matrix
   * @param {String} name the name of the matrix to set
   * @param {Number} pos1 the row position in the matrix to set
   * @param {Number} pos2 the column position in the matrix to set
   * @param {Object} value the value of the matrix to set
   */
  descartesJS.Evaluator.prototype.setMatrix = function(name, pos1, pos2, value) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    this.matrices[name][pos1][pos2] = value;
  }

  /**
   * Get the value to a matrix
   * @param {String} name the name of the matrix to get the value
   */
  descartesJS.Evaluator.prototype.getMatrix = function(name, pos1, pos2) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    return this.matrices[name][pos1][pos2];
  }

  /**
   * Set the value to a function
   * @param {String} name the name of the function to set
   * @param {Object} value the value of the function to set
   */
  descartesJS.Evaluator.prototype.setFunction = function(name, value) {
    this.functions[name] = value;
  }

  /**
   * Get a function
   * @param {String} name the name of the function to get
   */
  descartesJS.Evaluator.prototype.getFunction = function(name) {
    return this.functions[name];
  }

  /**
   * 
   */
  descartesJS.Evaluator.prototype.evalExpression = function (expr) {
    return (expr) ? expr.evaluate(this) : 0;
  }

  // evaluator used in a range evaluation
  descartesJS.externalEvaluator = new descartesJS.Evaluator();  
    
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathMax = Math.max;
  var externalDecimals = 2;
  var externalFixed = false;
  var localColor;
  
  /**
   * A node of rtf text
   * @constructor 
   */
  descartesJS.RTFNode = function(evaluator, value, nodeType, style) {
    this.evaluator = evaluator;

    this.type = "rtfNode";
   
    this.value = value;
    this.nodeType = nodeType;
    this.style = style;
    this.styleString = style.toString()
    this.color = style.textColor;
    this.underline = style.textUnderline;
    this.overline = style.textOverline;
    
    this.parent = null;
    this.children = [];
    
    switch(this.nodeType) {
      // the principal text block
      case ("textBlock"):
        this.draw = this.drawTextBlock;
        break;

      // a text line
      case ("textLineBlock"):
        this.draw = this.drawTextLineBlock;
        break;

      // a formula
      case ("formula"):
        this.draw = this.drawFormula;
        break;
      
      // a super index
      case ("superIndex"):
        this.draw = this.drawSuperIndex;
        break;

      // a sub index
      case ("subIndex"):
        this.draw = this.drawSubIndex;
        break;

      // a dynamic text
      case ("dynamicText"):
        this.draw = this.drawDynamicText;
        this.decimal_symbol = this.evaluator.parent.decimal_symbol;
        break;

      // a fraction
      case ("fraction"):
        this.draw = this.drawFraction;
        break;
      
      // a numerator or denominator
      case ("numerator"):
      case ("denominator"):
        this.draw = this.drawNumDen;
        break;
      
      // a radical
      case ("radical"):
        this.draw = this.drawRadical;
        break;
          
      // a limit
      case ("limit"):
        this.draw = this.drawLimit;
        break;
      
      // an integral
      case ("integral"):
        this.draw = this.drawIntegral;
        break;
      
      // a sum
      case ("sum"):
        this.draw = this.drawSum;
        break;
      
      // a matrix
      case ("matrix"):
        this.draw = this.drawMatrix;
        break;
      
      // a defparts element
      case ("defparts"):
        this.draw = this.drawDefparts;
        break;
      
      // a text or new line
      case ("text"):
      case ("newLine"):
        this.draw = this.drawText;
        break;
      
      // a hyperlink
      case ("hyperlink"):
        this.draw = this.drawHyperlink;
        break;

      // a math symbol
      case ("mathSymbol"):
        this.draw = this.drawMathSymbol;
        break;
      
      // an index of a root or contents of a root or from value of a root
      // an index of a sum or contents of a sum or from value of a sum
      // an element 
      case ("index"):
      case ("radicand"):
      case ("from"):
      case ("to"):
      case ("what"):
      case ("element"):
        this.draw = this.drawGenericBlock;
        break;
      
      // a component of a control
      case ("componentNumCtrl"):
        this.draw = this.drawComponentNumCtrl;
        break;

      // a component of a space
      case ("componentSpace"):
        this.draw = this.drawComponentSpace;
        break;
    }
  }

  /**
   * Get the root of the tree of nodes
   * return {RTFNode} return the root of the tree of nodes
   */
  descartesJS.RTFNode.prototype.getRoot = function() {
    if (this.parent == null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Add a child to the tree of nodes
   * @param {descartesJS.RTFNode} child the child to add
   */
  descartesJS.RTFNode.prototype.addChild = function(child) {
    child.parent = this;
    this.children.push(child);
  }
  
  // metric values, needed to calculate the super and sub indices
  var previousMetric = { ascent: 0, descent: 0, h: 0 };
  /**
   * Set the previous metric
   * @param {Number} ascent the ascent value
   * @param {Number} descent the descent value
   * @param {Number} h the h value
   */
  function updatePreviousMetric(ascent, descent, h) {
    previousMetric.ascent = ascent;
    previousMetric.descent = descent;
    previousMetric.h = h; 
  }
  
  /**
   * Get the text metrics of the rtf text
   */
  descartesJS.RTFNode.prototype.getTextMetrics = function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType == "textBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getTextMetrics();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "textLineBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      this.getBlockMetric();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "newLine") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      this.w = 0;
      this.h = metrics.h;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if ( (this.nodeType == "text") || (this.nodeType == "dynamicText")) {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      var textTemp = this.value;
      var decimals;
      var fixed;

      // if the text is a dynamic text
      if (typeof(this.value) != "string") {
        decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
        fixed = (this.fixed == undefined) ? externalFixed : this.fixed;
        textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);

        // is a number
        if (parseFloat(textTemp).toString() === textTemp.toString()) {
          textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : descartesJS.removeNeedlessDecimals((parseFloat(textTemp).toFixed(decimals)));
          textTemp = (""+textTemp).replace(".", this.decimal_symbol);
        }
        
        textTemp += " ";
      }
            
      this.w = descartesJS.getTextWidth(textTemp, this.styleString);
      this.h = metrics.h;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "formula") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.getBlockMetric();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "hyperlink") {
      var metric = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metric.baseline;
      this.descent = metric.descent;
      this.ascent = metric.ascent;
      
      this.w = descartesJS.getTextWidth(this.value, this.styleString);
      this.h = metric.h;

      this.clickCacher = document.createElement("div");
      this.clickCacher.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; cursor: pointer;");

      var _self = this;
      this.clickCacher.addEventListener("click", function(evt) {
        _self.click = true;
        window.open(_self.URL, _self.URL);
      })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "superIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;

      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.h < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.h = this.ascent + this.descent;
        this.w = this.spaceWidth*1.5;
      }
      
      var tmpAscent = prevh/2 - prevDescent + this.h;
      this.superIndexPos = tmpAscent - this.ascent;
      
      this.ascent = tmpAscent;
      this.descent = prevDescent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "subIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.h < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.h = this.ascent + this.descent;
        this.w = this.spaceWidth*1.5;
      }

      this.subIndexPos = prevDescent +1;
      
      this.ascent = prevAscent;
      this.descent = this.subIndexPos + this.descent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "fraction") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var num = this.children[0];
      var den = this.children[1];
      var metric = descartesJS.getFontMetrics(num.styleString);

      num.getBlockMetric();
      den.getBlockMetric();

      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;

      if (num.h < 0) {
        num.h = metric.h;
        num.w = this.spaceWidth;
      }
      if (den.h < 0) {
        den.h = metric.h;
        den.w = this.spaceWidth;
      }
      
      this.h = num.h + den.h -1;

      this.ascent = num.h + Math.round( prevh/2 )-prevDescent;
      this.descent = this.h - this.ascent;
      this.baseline = this.ascent;

      this.w = Math.max(num.w, den.w) +this.spaceWidth +8;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "radical") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var index;
      var radicand;
      var tmpStyle = this.children[0].style.clone();
      var tmpRadican;

      // correction in the roots when has only one child (problem in some lessons of Arquimedes)
      if (this.children.length === 1) {
        // radican
        this.children[1] = new descartesJS.RTFNode(this.evaluator, " ", "radicand", tmpStyle);
        this.children[1].addChild(this.children[0]);
        // index
        this.children[0] = new descartesJS.RTFNode(this.evaluator, " ", "index", tmpStyle);
      }
      // if has mora tan one child
      else {
        // if the first two children not are an index and radicand, then is a problem in Arquimedes
        // and is necesary to add all the children un the radicand value
        if ( (this.children[0].nodeType !== "index") || (this.children[1].nodeType !== "radicand") ) {
          // radican
          tmpRadican = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
          for (var i=0, l=this.children.length; i<l; i++) {
            tmpRadican.addChild(this.children[i]);
          }
          this.children = [];

          this.children[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
          this.children[1] = tmpRadican;
        }
      }

      index    = this.children[0];
      radicand = this.children[1];

      if(index.children.length <= 0) {
        var tmpStyle = this.style.clone();
        tmpStyle.fontSize = parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2);
        index.addChild( new descartesJS.RTFNode(this.evaluator, " ", "text", tmpStyle) );
      }
      if(radicand.children.length <= 0) {
        radicand.addChild( new descartesJS.RTFNode(this.evaluator, " ", "text", this.style.clone()) );
      }

      index.getBlockMetric();
      radicand.getBlockMetric();

      if (radicand.h/2 < index.h) {
        this.ascent = radicand.h/2 + index.h+2 - radicand.descent;
      } 
      else {
        this.ascent = radicand.ascent +4;
      }
      
      this.descent = radicand.descent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      this.w = index.w + radicand.w +4*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "sum") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();

      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.h = tmpMetric.h;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.h = tmpMetric.h;
      }
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      // the ascent
      if (metric.h+to.h > what.ascent) {
        this.ascent = metric.h-metric.descent +to.h;
      } else {
        this.ascent = what.ascent;
      }
      
      // the descent
      if (from.h > what.descent) {
        this.descent = from.h + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
      
      this.w = Math.max(from.w, to.w, symbolWidth) + Math.max(what.w, this.spaceWidth) +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "integral") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.h = tmpMetric.h;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.h = tmpMetric.h;
      }

      var metric = descartesJS.getFontMetrics(this.styleString);

      // the ascent
      if (metric.h+to.h > what.ascent) {
        this.ascent = metric.h-metric.descent +to.h;
      } else {
        this.ascent = what.ascent;
      }
      
      // the descent
      if (from.h > what.descent) {
        this.descent = from.h + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
        
      this.w = Math.max(from.w, to.w, symbolWidth) + Math.max(what.w, this.spaceWidth) +2*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "limit") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      var tmpMetric;
      var metric = descartesJS.getFontMetrics(this.styleString);

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.h = tmpMetric.h;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.h = tmpMetric.h;
      }
      // if "what" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (what.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(what.styleString);
        what.ascent = tmpMetric.ascent;
        what.descent = tmpMetric.descent;
        what.h = tmpMetric.h;
      }
            
      this.ascent = what.ascent;
      this.descent = Math.max(metric.h, what.descent);
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      var limitWidth = descartesJS.getTextWidth(" " + String.fromCharCode(parseInt(8594)), this.styleString);

      if (from.w == 0) {
        from.w = this.spaceWidth;
      }
      if (to.w == 0) {
        to.w = this.spaceWidth;
      }
      if (what.w == 0) {
        what.w = this.spaceWidth;
      }

      this.w = to.w + from.w + what.w + limitWidth + this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "matrix") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var maxAscenderh = metric.ascent;
      var maxDescenderh = metric.descent;
      var maxHeigth = metric.h;
      var maxWidth = this.spaceWidth;

      var childh;
      var childWidth;

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();

        childh = this.children[i].h;
        childWidth = this.children[i].w;
        
        if (maxHeigth < childh) {
          maxHeigth = childh;
          maxAscenderh = this.children[i].ascent;
          maxDescenderh = this.children[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childh = maxHeigth;
      this.childAscent = maxAscenderh;
      this.childDescent = maxDescenderh;
      
      this.h = this.rows * maxHeigth;
      this.ascent = this.h/2 + prevDescent;
      this.descent = this.h - this.ascent;
      this.w = this.columns * this.childWidth +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "defparts") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);
      
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevh = previousMetric.h;
      
      var maxAscenderh = metric.ascent;
      var maxDescenderh = metric.descent;
      var maxHeigth = metric.h;
      var maxWidth = this.spaceWidth;

      var childh;
      var childWidth;

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();
        
        childh = this.children[i].h;
        childWidth = this.children[i].w;
        
        if (maxHeigth < childh) {
          maxHeigth = childh;
          maxAscenderh = this.children[i].ascent;
          maxDescenderh = this.children[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childh = maxHeigth;
      this.childAscent = maxAscenderh;
      this.childDescent = maxDescenderh;
      
      this.h = this.parts * maxHeigth;
      this.ascent = this.h/2 + prevDescent;
      this.descent = this.h - this.ascent;
      this.w = maxWidth +this.spaceWidth/2;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "mathSymbol") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;
      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
                  
      this.w = descartesJS.getTextWidth(this.value, this.styleString) + this.spaceWidth;
      this.h = metrics.h;
    }
    
    else if (this.nodeType == "componentNumCtrl") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentNumCtrl = this.evaluator.parent.getControlByCId(this.value);

      var tmpH = this.componentNumCtrl.h || 0;
      
      this.baseline = Math.round(3*tmpH/5);
      this.descent = Math.round(2*tmpH/5);
      this.ascent = this.baseline;

      this.h = tmpH;
      this.w = this.componentNumCtrl.w;
    }
    
    else if (this.nodeType == "componentSpace") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentSpace = this.evaluator.parent.getSpaceByCId(this.value);
      
      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;
      
      this.h = 0;
      this.w = this.componentSpace.w;
    }
        
    else {
      console.log("Element i=unknown", this.nodeType);
    }
    
  }
  
  /**
   * Get the metric of a block
   */
  descartesJS.RTFNode.prototype.getBlockMetric = function() {
    this.w = 0;
    var maxDescenderh = -1;
    var maxAscenderh = -1;
    var childh;
    var children_i;
    
    // loops throught all the children of a text line to determine which is the width and the height
    for (var i=0, l=this.children.length; i<l; i++) {
      children_i = this.children[i];
      children_i.getTextMetrics();

      childAscent = children_i.ascent;
      childDescent = children_i.descent;

      this.w += children_i.w;
     
      // update the previous metric
      updatePreviousMetric(childAscent, childDescent, children_i.h);

      if (maxAscenderh < childAscent) {
        maxAscenderh = childAscent;
      }

      if (maxDescenderh < childDescent) {
        maxDescenderh = childDescent;
      }      
    }

    this.ascent = maxAscenderh;
    this.descent = maxDescenderh;
    this.baseline = this.ascent;
    this.h = this.ascent + this.descent;
  }
  
  /**
   * Draw a text block
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {Number} decimals the number of decimals of the text
   * @param {Boolean} fixed the number of significant digits of the number in the text
   * @param {String} align the alignment of the text
   * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
   */
  descartesJS.RTFNode.prototype.drawTextBlock = function(ctx, x, y, decimals, fixed, align, displaceY, color) {
    localColor = color;

    // if the text has a dynamic text, then is necesary to calculate the width of the elements
    if(!this.stableWidth) {
      externalDecimals = decimals;
      externalFixed = fixed;
      this.getTextMetrics();
    }

    displaceY = (displaceY) ? -this.children[0].ascent : 0;
    
    var desp = 0;
    var previousChildPos = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        previousChildPos += this.children[i-1].h;
      }
      
      // // if the text align is center
      // if (align == "center") {
      //   desp = -this.children[i].w/2;
      // }
      // // if the text align is right
      // else if (align == "right") {
      //   desp =-this.children[i].w;
      // }
      
      this.children[i].draw(ctx, x +desp, y +displaceY +previousChildPos);
    }
  }

  /**
   * Draw a text line block
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawTextLineBlock = function(ctx, x, y) {
    var antChildX = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      ctx.strokeStyle = localColor;
      ctx.fillStyle = localColor;

      if (i>0) {
        antChildX += this.children[i-1].w;

        if ((this.children[i-1].nodeType == "formula")) {
          antChildX += 2*this.children[i-1].spaceWidth;
        }
      }

      this.children[i].draw(ctx, x+antChildX, y+this.baseline);
    }

  }  
  
  /**
   * Draw a formula
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawFormula = function(ctx, x, y) {
    var antChildX = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].w;
      }
      this.children[i].draw(ctx, x + this.spaceWidth + antChildX, y);
    }    
  }
      
  /**
   * Draw a text
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawText = function(ctx, x, y) {
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(this.value, x-1, y);
    
    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(x-1+this.w, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(x-1+this.w, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
  }
      
  /**
   * Draw a dynamic text
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawDynamicText = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth*.5);

    var decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
    var fixed = (this.fixed == undefined) ? externalFixed : this.fixed;

    var textTemp = this.evaluator.evalExpression(this.value);
    // the text is a number
    if (parseFloat(textTemp).toString() === textTemp.toString()) {
      textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : descartesJS.removeNeedlessDecimals((parseFloat(textTemp).toFixed(decimals)));
      textTemp = (""+textTemp).replace(".", this.decimal_symbol);
    }

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    this.w = descartesJS.getTextWidth(textTemp, this.styleString);
    ctx.fillText(textTemp, spaceWidth + x, y);

    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(spaceWidth + x-1+this.w, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(spaceWidth + x-1+this.w, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
    
    this.w += 2*spaceWidth;
  }

  /**
   * Draw a hyperlink
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawHyperlink = function(ctx, x, y) {
    // add and position of the click cacher div
    if (!this.clickCacher.parentNode) {
      // ctx.canvas.parentNode.appendChild(this.clickCacher);
      if (ctx.canvas.nextSibling.className) {
        ctx.canvas.parentNode.insertBefore(this.clickCacher, ctx.canvas.nextSibling.nextSibling);
      }
      else {
        ctx.canvas.parentNode.insertBefore(this.clickCacher, ctx.canvas.nextSibling);
      }
      this.clickCacher.style.left = (x -2) + "px";
      this.clickCacher.style.top  = (y - this.ascent -2) + "px";
    }

    ctx.save();

    if (this.click) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";      
    }
    else {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
    }

    ctx.font = this.styleStr;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(this.value, x-1, y);
    
    var isBold = this.style.textBold == "bold";
    var sep = isBold ? 1 : .5;
    ctx.lineWidth = isBold ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x-1, Math.ceil(y+this.descent/2) +sep -2);
    ctx.lineTo(x-1+this.w, Math.ceil(y+this.descent/2) +sep -2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw a radical
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawRadical = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth);
    
    this.children[0].draw(ctx, x, Math.floor(y +this.children[1].descent -this.children[1].h/2 -this.children[0].descent));
    this.children[1].draw(ctx, x+1.5*spaceWidth+(this.children[0].w), y);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()

    ctx.moveTo(x, Math.floor(y +this.children[1].descent -this.children[1].h/2));
    ctx.lineTo(x+this.children[0].w, Math.floor(y +this.children[1].descent -this.children[1].h/2));
    ctx.lineTo(x+this.children[0].w +.5*spaceWidth, y+this.children[1].descent);
    ctx.lineTo(x+this.children[0].w +1*spaceWidth, y-this.children[1].ascent);
    ctx.lineTo(x+this.children[0].w +2*spaceWidth+this.children[1].w, y-this.children[1].ascent);

    ctx.stroke();
  }
  
  /**
   * Draw a fraction
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawFraction = function(ctx, x, y) {
    this.children[0].draw(ctx, x+(this.w-this.children[0].w)/2, y -this.ascent);
    this.children[1].draw(ctx, x+(this.w-this.children[1].w)/2, y -this.ascent + this.children[0].h -1);

    var spaceWidth = Math.floor(this.spaceWidth*.5);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(x+spaceWidth, parseInt(y -this.ascent + this.children[0].h) -.5);
    ctx.lineTo(x-spaceWidth+this.w-1, parseInt(y -this.ascent + this.children[0].h) -.5);
    ctx.stroke();
  }

  /**
   * Draw a numerator or denominator
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawNumDen = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].w;
      }
      this.children[i].draw(ctx, x+antChildX, y+this.baseline);
    }  
  }
  
  /**
   * Draw a sub index
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSubIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].w;
      }
      this.children[i].draw(ctx, x+antChildX, y +this.subIndexPos);
    }
  }
  
  /**
   * Draw a super index
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSuperIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].w;
      }
      this.children[i].draw(ctx, x+antChildX, y -this.superIndexPos);
    }  
  }

  /**
   * Draw a limit
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawLimit = function(ctx, x, y) {
    var metric = descartesJS.getFontMetrics(this.styleString);

    var symbolString = " " + String.fromCharCode(parseInt(8594));
    var symbolWidth = descartesJS.getTextWidth(symbolString, this.styleString);
    
    // from
    this.children[0].draw(ctx, x, y +metric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +this.children[0].w +symbolWidth, y +metric.descent +this.children[1].ascent);
    
    //what
    this.children[2].draw(ctx, x +symbolWidth +this.children[0].w +this.children[1].w, y);

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("lím", x +this.children[0].w, y);
    
    ctx.fillText(symbolString, x+this.children[0].w, y +metric.descent +this.children[0].ascent);
  }
  
  /**
   * Draw an integral
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawIntegral = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    
    
    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(symbolStyle);

    var maxWidth = Math.max(this.children[0].w, this.children[1].w, Math.floor(1.5*symbolWidth));
    
    // from
    this.children[0].draw(ctx, x +symbolWidth, y +symbolMetric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +symbolWidth +this.spaceWidth/2, y -this.ascent +this.children[1].ascent);
    
    // what
    this.children[2].draw(ctx, x +maxWidth +symbolWidth, y);

    // sigma character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8747)), x, y +symbolMetric.descent/2);
  }

  /**
   * Draw a sum
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSum = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    

    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(this.styleString);

    var maxWidth = Math.max(this.children[0].w, this.children[1].w, symbolWidth);
    
    // from
    this.children[0].draw(ctx, x +(maxWidth-this.children[0].w)/2, y +symbolMetric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +(maxWidth-this.children[1].w)/2, y -symbolMetric.ascent -this.children[1].descent);
    
    // what
    this.children[2].draw(ctx, x +maxWidth, y);

    // sum character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8721)), x +Math.floor( (maxWidth-symbolWidth)/2 ), y-5);      
  }

  /**
   * Draw a matrix
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawMatrix = function(ctx, x, y) {
    var columnIndex;
    var rowIndex;
    
    for (var i=0, l=this.children.length; i<l; i++) {
      columnIndex = i%this.columns;
      rowIndex = Math.floor(i/this.columns);
            
      this.children[i].draw(ctx, 2*this.spaceWidth + x + columnIndex*this.childWidth, y-this.ascent+this.childAscent + rowIndex*this.childh);
    }
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(Math.floor(x +this.spaceWidth) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth) +.5, y +this.descent +.5);
    
    ctx.moveTo(Math.floor(x +this.w -this.spaceWidth) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.w -this.spaceWidth/2) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.w -this.spaceWidth/2) -.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.w -this.spaceWidth) -.5, y +this.descent +.5);    
    
    ctx.stroke();  
  }
  
  /**
   * Draw a def parts
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawDefparts = function(ctx, x, y) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx, x + 3*this.spaceWidth, y-this.ascent+this.childAscent + (i%this.parts)*this.childh);
    }

    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(parseInt(x +2*this.spaceWidth) +.5, y -this.ascent +.5);
    ctx.lineTo(parseInt(x +2*this.spaceWidth) -4.5, y -this.ascent +4.5);
    ctx.lineTo(parseInt(x +2*this.spaceWidth) -4.5, y +this.descent -this.h/2 -4.5);
    ctx.lineTo(x -.5, y +this.descent -this.h/2);
    ctx.lineTo(parseInt(x +2*this.spaceWidth) -4.5, y +this.descent -this.h/2 +4.5);
    ctx.lineTo(parseInt(x +2*this.spaceWidth) -4.5, y +this.descent -4.5);
    ctx.lineTo(parseInt(x +2*this.spaceWidth) +.5, y +this.descent +.5);
    
    ctx.stroke(); 
  }

  /**
   * Draw a math symbol
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawMathSymbol = function(ctx, x, y) {
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
    }
    ctx.beginPath()

    if (this.value == "(") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("(", x, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.h/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth/5, y +this.parent.descent -this.parent.h/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.h/10);
      // ctx.stroke();
    }
    else if (this.value == ")") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(")", x+this.spaceWidth, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.h/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth +4*this.spaceWidth/5, y +this.parent.descent -this.parent.h/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.h/10);
      // ctx.stroke();
    }
    else {
      ctx.font = this.styleString;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      
      ctx.fillText(this.value, x +this.w/2, y);      
    }
  }
  
  /**
   * Draw a generic block, that do not need to modify the position of its components
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawGenericBlock = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].w;
      }
      this.children[i].draw(ctx, x+antChildX, y);
    }  
  }  
  
  /**
   * Draw a control componet
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawComponentNumCtrl = function(ctx, x, y) {
    // update the metrics of the parent
    this.parent.getTextMetrics();
    // this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.parent.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
    this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
  }
  
  /**
   * Draw a space component
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawComponentSpace = function(ctx, x, y) {
    this.getTextMetrics();
    this.componentSpace.xExpr = this.evaluator.parser.parse(x+"");
    this.componentSpace.yExpr = this.evaluator.parser.parse((y-this.parent.ascent)+"");
  }

  /**
   * Draw a unknown element
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.draw = function(ctx, x, y) {
    console.log(">>> Dibujo desconocido ", this.nodeType);
    // this.children[0].draw(ctx, x, y);
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.toHTML = function() {
    var htmlString = "";
    
    if ( (this.nodeType === "textLineBlock") || (this.nodeType === "textBlock") ) {
      for (var i=0, l=this.children.length; i<l; i++) {
        htmlString = htmlString + this.children[i].toHTML();
      }
    }
    else if (this.nodeType === "text") {
      htmlString = "<span " + this.style.toCSS() + ">" + this.value + "</span>"; 
    }
    else if (this.nodeType === "newLine") {
      htmlString = "<span " + this.style.toCSS() + ">" + this.value + "<br /></span>";
    }
    else {
      // console.log(">>><<<", this);
    }
    
    return htmlString;
  }
  
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var StringFromCharCode = String.fromCharCode;
  var tokens;
  var inputLenght;
  var tokens;
  var tokenType;
  var tokenValue;
  var pos;
  var blockNumber;
  var currentChar;
  var nextChar;
  var insideControlWord;
  var lastTokenType;
  var tmpMatch;
  var tmpText;

  /**
   * A rtf tokenizer
   * @constructor 
   */
  descartesJS.RTFTokenizer = function() { };
  
  /**
   * Get a rtf parse tree from an input
   * @param {String} input the rtf text to tokenize
   */
  descartesJS.RTFTokenizer.prototype.tokenize = function(input) {
    if (input) {
      // input = input.replace(/\\'(\w{2})/g, function(str, m1){ return StringFromCharCode(parseInt(m1, 16)); });
      input = input.replace(/\&gt;/g, ">")
                   .replace(/\&lt;/g, "<")
                   .replace(/\&quote;/g, "''")
                   .replace(/\&squot;/g, "'")
                   .replace(/\\rquote /g, "'")
                   .replace(/\\endash /g, "-")
                   .replace(/\n/g, " ")
                   .replace(/\r/g, "")
                   .replace(/\\uc(\d+) /g, "")
                   .replace(/\\uc(\d+)/g, "");
    } 
    else {
      return [];
    }

    tokens = [];
    inputLenght = input.length;
    tokens = [];
    tokenValue = "";
    pos = 0;
    blockNumber = 0;
    nextChar = input.charAt(0);
    insideControlWord = false;
    lastTokenType = "text";

    while (pos < inputLenght) {
      currentChar = nextChar;
      nextChar = input.charAt(pos+1);

      // outside a controlWord, maybe a text or init of the input
      if (!insideControlWord) {
        // found a controlWord
        if (currentChar === "\\") {
          insideControlWord = true;

          // save a text node if readed
          if (tokenValue !== "") {
            tokens.push({ type: "text", value: tokenValue });
            lastTokenType = "text";
          }

          tokenValue = "";
        }
        // open block
        else if (currentChar === "{") {
          blockNumber++;

          // save a text node if readed
          if (tokenValue !== "") {
            tokens.push({ type: "text", value: tokenValue });
          }

          tokenValue = "";

          tokens.push({ type: "openBlock", value: blockNumber });
          lastTokenType = "openBlock";
        }
        // close block
        else if (currentChar === "}") {
          // save a text node if readed
          if (tokenValue !== "") {
            tokens.push({ type: "text", value: tokenValue })
          }

          tokenValue = "";

          tokens.push({ type: "closeBlock", value: blockNumber });
          lastTokenType = "closeBlock";
          blockNumber--;
        }
        // control word
        else {
          // if ((tokenValue === "") && (currentChar === " ") && (lastTokenType === "controlWord")) {
          //   // lastTokenType = "text";
          //   lastTokenType = "controlWord";
          // }
          // else {
            tokenValue += currentChar;
          // }
        }
      }

      // inside a controlWord
      else {
        if ((nextChar === "\\") || (nextChar === "{") || (nextChar === "}") || (nextChar === " ") || (nextChar === ";")) {
          insideControlWord = false;
          tokenValue += currentChar;

          // if the controlWord has a space 
          if (nextChar === " ") {
            pos++
            nextChar = input.charAt(pos+1);
          }

          // controlWord of the form \'##
          tmpMatch = tokenValue.match(/^\'([0-9a-f]{2})/);
          if (tmpMatch) {
            tmpText = "";
            if (lastTokenType === "text") {
              tmpText = tokens.pop().value;
            }

            tmpText += StringFromCharCode(parseInt(tmpMatch[1], 16)) + tokenValue.substring(3);

            tokenValue = tmpText;
          }
          else {
            // controlWord of the form \u###
            tmpMatch = tokenValue.match(/^u[0-9]+/);
            if (tmpMatch) {
              tmpText = "";
              if (lastTokenType === "text") {
                tmpText = tokens.pop().value;
              }

              tmpText += StringFromCharCode(tmpMatch[0].substring(1));

              tokenValue = tmpText;
            }
            // generic controlWord
            else {
              // scaped characters
              if ((tokenValue === "{") || (tokenValue === "}")) {
                tokens.push({ type: "text", value: tokenValue });
                lastTokenType = "text";
              }
              else {
                tokens.push({ type: "controlWord", value: tokenValue });
                lastTokenType = "controlWord";
              }
              
              tokenValue = "";
            }
          }
        }
        else {
          tokenValue += currentChar;
        }
      }

      pos++;
    }

    // if the last text token is not added
    if (tokenValue !== "") {
      tokens.push({ type: "text", value: tokenValue })
    }

    return tokens;
  }  

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  var tokens;
  var indexToken;
  var fontTable;
  var openBlockIndex;
  var tempI;
  var colorTable;
  var colorTableIndex;
  var r;
  var g;
  var b;
  var newNode;
  var lastNode;
  var lastDynamicNode;
  var lastMatrixNode;
  var lastPartsNode;
  var descartesFormula;
  var dinamycText;
  var setDecimals;
  var setRows;
  var setColumns;
  var setParts;
  var currentBlock;
  var styleStack;
  var styleStackTop;
  var stableWidth;
  var blockNum;
  var formulaBlock;
  var formulaStack;
  var hasFormula;
  var descartesComponentNumCtrl;
  var descartesComponentSpace;
  var descartesHyperLink;
  
  /**
   * Descartes RTF parser
   * @constructor 
   */
  descartesJS.RTFParser = function(evaluator) {
    this.evaluator = evaluator;
    this.tokenizer = new descartesJS.RTFTokenizer();
  }

  /**
   * Parse a string and get a rtf parse tree
   * @param {String} input the input string to parse
   * @param {RTFNode} return a parse tree corresponding to the rtf input
   */
  descartesJS.RTFParser.prototype.parse = function(input) {
// console.log(input);
    tokens = this.tokenizer.tokenize(input);
    tokens = checkMathSymboslInFormula(tokens);
    indexToken = 0;
    fontTable = {};
    tempI = 2;
// console.log(tokens);
    
    // build the font block
    if ( (tokens[0].type == "openBlock") && (tokens[1].value == "fonttbl") ) {
      openBlockIndex = tokens[0].value;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }
      
      tempI++;
    }

    colorTable = {};
    colorTableIndex = 0;
    
    // build the color block
    if ( (tokens[tempI].type == "openBlock") && (tokens[tempI+1].value == "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;
      
      tempI++;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);

        if (tokens[tempI].value === ";") {
          tempI++;
        }

        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }
      
      tempI++;      
    }

    // initial parse tree nodes
    newNode = new descartesJS.RTFNode(this.evaluator, "", "textBlock", "", false, "");
    lastNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", "", false, "");
    newNode.addChild(lastNode);
    
    lastDynamicNode = null;
    lastMatrixNode = null;
    lastPartsNode = null;
    descartesFormula = false;
    dinamycText = false;
    setDecimals = false;
    setRows = false;
    setColumns = false;
    setParts = false;
    currentBlock = [];
    styleStack = [ new descartesJS.FontStyle(20, "Arial", "", "", false, false, null) ];
    styleStackTop = styleStack[0];
    stableWidth = true;

    blockNum = -1;
    formulaBlock = -1;
    formulaStack = [];
    
    // has formula flag 
    hasFormula = false;
    
    // arquimedes rft components
    descartesComponentNumCtrl = false;
    descartesComponentSpace = false;
    descartesHyperLink = false;
    
    // build the text nodes
    for (var i=tempI, l=tokens.length; i<l; i++) {
      // font type
      if ((tokens[i].type == "controlWord") && (fontTable[tokens[i].value])) {
        styleStackTop.fontType = fontTable[tokens[i].value];
        continue;
      }
      // font size
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^fs(\d+)/))) {
        styleStackTop.fontSize = parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2);
        continue;
      }
      // init bold text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b")) {
        styleStackTop.textBold = "bold";
        continue;
      }
      // end bold text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b0")) {
        styleStackTop.textBold = "";
        continue;
      }
      // init italic text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i")) {
        styleStackTop.textItalic = "italic";
        continue;
      }
      // end italic text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i0")) {
        styleStackTop.textItalic = "";
        continue;
      }
      // init underline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ul")) {
        styleStackTop.textUnderline = true;
        continue;
      }
      // end underline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ulnone")) {
        styleStackTop.textUnderline = false;
        continue;
      }
      // init overline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ol")) {
        styleStackTop.textOverline = true;
        continue;
      }
      // end overline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "olnone")) {
        styleStackTop.textOverline = false;
        continue;
      }
      // color text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^cf(\d+)/))) {
        styleStackTop.textColor = colorTable[parseInt(tokens[i].value.substring(2))];
        if (formulaStack.length > 0) {
          formulaStack[formulaStack.length-1].style.textColor = styleStackTop.textColor;
        }

        continue;
      }
      // init a rtf block, expressions or formulas
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;
        
        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);
        
        formulaStack.push(null);

        continue;
      }
      // close a rtf block, expression or formulas
      else if (tokens[i].type == "closeBlock") {
        if (tokens[i].value == formulaBlock) {
          formulaBlock = -1;
          descartesFormula = false;
          lastNode = lastNode.parent;
        }
        
        styleStack.pop();
        styleStackTop = styleStack[styleStack.length-1];

        formulaStack.pop();

        continue;
      }
      // a new line
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "par")) {
        lastNode.addChild( new descartesJS.RTFNode(this.evaluator, "", "newLine", styleStackTop.clone()) );
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", styleStackTop.clone());
        
        // find a textBlock to add the new line
        if (lastNode.nodeType != "textBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);
        lastNode = newNode;

        continue;
      }
      // descartes formula
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")) {
        hasFormula = true;
        formulaBlock = blockNum;
        descartesFormula = true;
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "formula", styleStackTop.clone());
        lastNode.addChild(newNode);
        lastNode = newNode;
        
        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // fraction, sum, integral and limit
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "fraction") || 
                                                     (tokens[i].value == "radicand") || 
                                                     (tokens[i].value == "radical") ||
                                                     (tokens[i].value == "what") ||
                                                     (tokens[i].value == "sum") ||
                                                     (tokens[i].value == "integral") ||
                                                     (tokens[i].value == "limit")
                                                    )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "",  tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      // root index, limits of sum and integral
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "index")) || 
                                                      (tokens[i].value == "to") ||
                                                      (tokens[i].value == "from") ) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2);

        // the size of the font can not be less than 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      // numerator or denominator of a fraction
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "num") || (tokens[i].value == "den"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.round(tmpStyle.fontSize - tmpStyle.fontSize*.1);

        // the size of the font can not be less than 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "num") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "numerator", tmpStyle);
        }
        else if (tokens[i].value == "den") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "denominator", tmpStyle);
        }

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      // subindex or superindex
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "subix") || (tokens[i].value == "supix"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.floor(tmpStyle.fontSize - tmpStyle.fontSize/3);
        
        // the size of the font can not be less than 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "subix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "subIndex", tmpStyle);
        }
        else if (tokens[i].value == "supix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "superIndex", tmpStyle);
        }
        
        newNode.originalStyle = formulaStack[formulaStack.length-2].style.clone();

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;        
      }
      // defparts, a matrix or an element
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
               
        if (tokens[i].value == "defparts") {
          lastPartsNode = newNode;
        }
        else if (tokens[i].value == "matrix") {
          lastMatrixNode = newNode;
        }

        continue;        
      }
      // number of parts
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "parts")) {
        setParts = true;
        continue;
      }
      // set the number of parts
      else if ((tokens[i].type == "text") && (setParts)) {
        lastPartsNode.parts = (parseInt(tokens[i].value));
        setParts = false;
        continue;
      }
      // number of rows
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "rows")) {
        setRows = true;
        continue;
      }
      // set the number of rows
      else if ((tokens[i].type == "text") && (setRows)) {
        lastMatrixNode.rows = (parseInt(tokens[i].value));
        setRows = false;
        continue;
      }
      // number of columns
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "columns")) {
        setColumns = true;
        continue;
      }
      // set the number of columns
      else if ((tokens[i].type == "text") && (setColumns)) {
        lastMatrixNode.columns = (parseInt(tokens[i].value));
        setColumns = false;
        continue;
      }
      // dinamyc text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "expr")) {
        stableWidth = false;
        dinamycText = true;
        continue;
      }
      // number of decimals in the text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "decimals")) {
        setDecimals = true;
        continue;
      }
      // set the number of decimals
      else if ((tokens[i].type == "text") && (setDecimals)) {
        lastDynamicNode.decimals = this.evaluator.parser.parse( tokens[i].value +"");
        setDecimals = false;
        continue;
      }
      // init fixed representation
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed1")) {
        lastDynamicNode.fixed = true;
        continue;
      }
      // end fixed representation
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed0")) {
        lastDynamicNode.fixed = false;
        continue;
      }
      // a component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "component")) { }
      // a control component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "NumCtrl")) {
        descartesComponentNumCtrl = true;
      }
      // a space component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "Space")) {
        descartesComponentSpace = true;
      }
      // hyperlink
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "hyperlink")) {
        descartesHyperLink = true;
      }
      // hyperlink content
      else if ((tokens[i].type == "text") && (descartesHyperLink)) {
        textContent = ((tokens[i].value).split("|"))[0];
        tmpStyle = styleStackTop.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "hyperlink", tmpStyle);
        newNode.URL = ((tokens[i].value).split("|"))[1];
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);

        descartesHyperLink = false;
        continue;
      }
      // a control component content
      else if ((tokens[i].type == "text") && (descartesComponentNumCtrl)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentNumCtrl", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentNumCtrl = false;
        continue;
      }
      // a space component content
      else if ((tokens[i].type == "text") && (descartesComponentSpace)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentSpace", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentSpace = false;
        continue;
      }
      // dynamic text content
      else if ((tokens[i].type == "text") && (dinamycText)) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        textContent = this.evaluator.parser.parse(tokens[i].value);

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "dynamicText", tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;
        
        // save the reference to the last dynamic node, to asign the number of decimals and the fixed representation
        lastDynamicNode = newNode;
        
        dinamycText = false;
        continue;
      }
      // no formula text
      else if ((tokens[i].type == "text") && (!dinamycText) && (!descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", styleStackTop.clone());
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }
        
        lastNode.addChild(newNode);
        continue;
      }
      // formula text
      else if ((tokens[i].type == "text") && (!dinamycText) && (descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", formulaStack[formulaStack.length-1].style.clone());
        
        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      // mathematic symbols parentheses
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.textItalic = "";
        
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", tmpStyle);

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      // mathematic symbols +, -, *,  =
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") || 
                (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone());

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      
      // unknown elements
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }

    // get the root node
    if (lastNode != null) {
      var rootNode = lastNode.getRoot();
      rootNode.stableWidth = stableWidth;
      rootNode.getTextMetrics();
      
      rootNode.hasFormula = hasFormula;
      
      // console.log(rootNode);
    }
    
    return rootNode;
  }

  /**
   * Font style for rtf text
   * @param {Number} fontsize the size of the font
   * @param {String} fontType the font family name
   * @param {String} textItalic the flag if the text is italic
   * @param {String} textBold the flag if the text is bold
   * @param {Boolean} textUnderline the flag if the text is undelined
   * @param {Boolean} textOverline the flag if the text is overlined
   * @param {String} textColor the color of the text
   * @constuctor
   */
  descartesJS.FontStyle = function(fontSize, fontType, textItalic, textBold, textUnderline, textOverline, textColor) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.textItalic = textItalic;
    this.textBold = textBold;
    this.textUnderline = textUnderline;
    this.textOverline = textOverline;
    this.textColor = textColor;
  }
  
  /**
   * Convert the font style to a string representation
   * @return {String} return the string representation of the style
   */
  descartesJS.FontStyle.prototype.toString = function() {
    return (this.textBold + " " + this.textItalic + " " + this.fontSize + "px " + this.fontType).trim();
  }
  
  /**
   * Get a CSS style
   * {String} retur a CSS style for the font style
   */
  descartesJS.FontStyle.prototype.toCSS = function() {
    var cssRule = "style='font: " + this.fontSize + "px " + this.fontType + "; ";

    if (this.textUnderline && !this.textOverline) {
      cssRule += "text-decoration: underline; ";
    }
    if (!this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: overline; ";
    }
    if (this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: underline overline; ";
    }
    if (this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: bold; ";
    }
    if (!this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: normal; ";
    }
    if (this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: bold; ";
    }
    if (!this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: normal; ";
    }
    if (this.textColor) {
      cssRule += "color: " + this.textColor + "; ";
    }

    return cssRule + "'";
  }

  /**
   * Clone a font style
   * @return {FontStyle} return a clone font style
   */
  descartesJS.FontStyle.prototype.clone = function() {
    return new descartesJS.FontStyle(this.fontSize, this.fontType, this.textItalic, this.textBold, this.textUnderline, this.textOverline, this.textColor);
  }

  function checkMathSymboslInFormula(tokens) {
//     console.log(tokens);
    var tokensResult = [];
    
    var inFormula = false;
    var ignoreText = false;
    var inExpression = false;
    var currentOpenBlock = [];
    
    for (var i=0, l=tokens.length; i<l; i++) {
      // register if open a block, to see if it is within a formula or not
      if (tokens[i].type == "openBlock") {
        currentOpenBlock.push(tokens[i].value);
      }
      
      // register if close a block, to see if it is within a formula or not
      if (tokens[i].type == "closeBlock") {
        currentOpenBlock.pop();
        
        if (currentOpenBlock.length <= 0) {
          inFormula = false;
        }
      }
      
      // the parentheses within an expression should not be changed
      if ((tokens[i].type == "controlWord") && ((tokens[i].value == "expr") || (tokens[i].value == "decimals"))) {
        ignoreText = true;
      }
      
      // register if is on a formula, to check the texts within it
      if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")){
        inFormula = true
      }
      
      // if the token is a text and we are in a formula and the text is not an expression then must seek parentheses
      if ((tokens[i].type == "text") && (inFormula) && (!ignoreText)) {
        var lastIndex = 0;
        var value = tokens[i].value;
        var newValue = "";
        
        for (var j=0, k=value.length; j<k; j++) {

          if ( (value.charAt(j) == "(") || (value.charAt(j) == ")") || 
               (value.charAt(j) == "+") || (value.charAt(j) == "-") || 
               (value.charAt(j) == "*") || (value.charAt(j) == "=") 
             ) {
            newValue = value.substring(lastIndex, j);
            if (newValue != "") {
              tokensResult.push( {type: "text", value: newValue} );
            }
            tokensResult.push( {type: value.charAt(j), value: value.charAt(j)} );
            lastIndex = j+1;
          }

        }

        // when end the for, add the rest of the string
        newValue = value.substring(lastIndex, j);
        if (newValue != "") {
          tokensResult.push( {type: "text", value: newValue} );
        }
      }
      // other nodes
      else {
        tokensResult.push(tokens[i]);
        if ((tokens[i].type == "text") && (ignoreText)) {
          ignoreText = false;
        }
      }
    }
    
//     console.log(tokensResult);
    return tokensResult;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var parent;
  var evaluator;
  var parser;
  var thisID;
  var newH;
  var newW;
  var parentH;
  var parentW;
  var temp;
  var OxExpr;
  var OyExpr;

  var tmpContainer;
  var tmpDisplay;
  var containerClass;
  var pos;

  /**
   * Descartes space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    
    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = this.parent.evaluator;

    evaluator = this.evaluator;
    parser = evaluator.parser;

    /**
     * identifier
     * type {String}
     */
    this.id = "";
    
    /**
     * initial values
     * type {String}
     * @private
     */
    this.values = values;
    
    /**
     * type
     * type {String}
     * @private
     */
    this.type = "R2";

    /**
     * x position
     * type {Node}
     * @private
     */
    this.xExpr = parser.parse("0");

    /**
     * y position
     * type {Node}
     * @private
     */
    this.yExpr = parser.parse("0");

    /**
     * width
     * type {Number}
     * @private
     */
    this.w = parseInt(parent.container.width);

    /**
     * height
     * type {Number}
     * @private
     */
    this.h = parseInt(parent.container.height);
    
    /**
     * drawif condition
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");

    /**
     * fixed space condition
     * type {Boolean}
     * @private
     */
    this.fixed = (parent.version != 2) ? false : true;

    /**
     * scale
     * type {Number}
     * @private
     */
    this.scale = 48;
    
    /**
     * displacement x of the origin
     * type {Number}
     * @private
     */
    this.Ox = 0;

    /**
     * displacement y of the origin
     * type {Number}
     * @private
     */
    this.Oy = 0;
    
    /**
     * background image
     * type {Image}
     * @private
     */
    this.image = new Image();
    this.image.onload = function() {
      this.ready = 1;
    }

    /**
     * background image file name
     * type {String}
     * @private
     */
    this.imageSrc = "";
    
    /**
     * how the background image is positioned
     * type {String}
     * @private
     */
    this.bg_display = "topleft";
    
    /**
     * background color
     * type {String}
     * @private
     */
    if ( (parent.code === "descinst.com.mja.descartes.DescartesJS.class") || (parent.arquimedes) ) {
      this.background = new descartesJS.Color("f0f8fa");
    }
    else {
      this.background = new descartesJS.Color("ffffff");
    }
    
    /**
     * net condition and color
     * type {String}
     * @private
     */
    this.net = (parent.version != 2) ? new descartesJS.Color("c0c0c0") : "";

    /**
     * net 10 condition and color
     * type {String}
     * @private
     */
    this.net10 = (parent.version != 2) ? new descartesJS.Color("808080") : "";

    /**
     * axes condition and color
     * type {String}
     * @private
     */
    // ## parche para descartes 2 ## //
    this.axes = (parent.version != 2) ? new descartesJS.Color("808080") : "";

    /**
     * coordinate text condition and color
     * type {String}
     * @private
     */
    this.text = new descartesJS.Color("ffafaf");

    /**
     * condition to draw the axis numbers
     * type {Boolean}
     * @private
     */
    this.numbers = false;

    /**
     * x axis text
     * type {String}
     * @private
     */
    this.x_axis = (parent.version != 2) ? "" : " ";

    /**
     * y axis text
     * type {String}
     * @private
     */
    this.y_axis = (parent.version != 2) ? "" : " ";

    /**
     * sensitive to mose movements condition
     * type {Boolean}
     * @private
     */
    this.sensitive_to_mouse_movements = false;
    
    /**
     * component identifier (rtf text positioning)
     * type {String}
     * @private
     */    
    this.cID = ""

    /**
     * mouse x position
     * type {Number}
     * @private
     */
    this.mouse_x = 0;

    /**
     * mouse y position
     * type {Number}
     * @private
     */
    this.mouse_y = 0;
    
    /**
     * the controls
     * type {Array<Controls>}
     * @private
     */
    this.ctrs = [];

    /**
     * the graphic controls
     * type {Array<Controls>}
     * @private
     */
    this.graphicsCtr = [];
    
    /**
     * the graphics
     * type {Array<Graphics>}
     * @private
     */
    this.graphics = [];
    
    /**
     * the background graphics
     * type {Array<Graphics>}
     * @private
     */
    this.backgroundGraphics = [];
    
    /**
     * z index of the elements
     * @type {Number}
     * @private 
     */
    this.zIndex = parent.zIndex;

    this.plecaHeight = parent.plecaHeight || 0;
    this.displaceRegionNorth = parent.displaceRegionNorth || 0;
    this.displaceRegionWest = parent.displaceRegionWest || 0;

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    this.init();
  }
  
  /**
   * Init the values of the space
   */
  descartesJS.Space.prototype.init = function() {
    parent = this.parent;
    evaluator = this.evaluator;
    thisID = this.id;

    this.displaceRegionNorth = parent.displaceRegionNorth || 0;
    this.displaceRegionWest = parent.displaceRegionWest || 0;

    if (this.wExpr != undefined) {
      this.w = (parseInt(parent.container.width) - this.displaceRegionWest)*parseFloat(this.wExpr)/100;
    }
    if (this.hExpr != undefined) {
      this.h = (parseInt(parent.container.height) - this.displaceRegionNorth)*parseFloat(this.hExpr)/100;
    }

    parentH = parseInt(parent.container.height);
    parentW = parseInt(parent.container.width);
        
    // get the x and y position
    this.x = evaluator.evalExpression(this.xExpr) + this.displaceRegionWest;
    this.y = evaluator.evalExpression(this.yExpr) + this.plecaHeight + this.displaceRegionNorth;

    // if the container exist then modify it's x and y position
    if (this.container) {
      this.container.style.left = this.x + "px";
      this.container.style.top = this.y + "px";
    }
    
    // ignore the change in the size if the id of the space is _BASE_
    // if (thisID === "_BASE_") {
      if (this.y >=0) {
        newH = parentH - this.y;
        if (this.h > newH) {
          this.h = newH;
        }
      } else {
        newH = this.h + this.y;
        if (newH >= parentH) {
          this.h = parentH;
        } else {
          this.h = newH;
        }
      }

      if (this.x >=0) {
        newW = parentW - this.x;
        if (this.w > newW) {
          this.w = newW;
        }
      } else {
        newW = this.w + this.x;
        if (newW >= parentW) {
          this.w = parentW;
        } else {
          this.w = newW;
        }
      }
    // }

    // if the space has a background image then get the image from the loader
    if ((this.imageSrc != "") || !(this.imageSrc.trim().toLowerCase().match(/vacio.gif$/))) {
      this.image = parent.getImage(this.imageSrc);
    }

    // Ox
    // if specified with a percentage
    if (this.OxExpr) {
      OxExpr = this.OxExpr;
      if (OxExpr[OxExpr.length-1] === "%") {
        this.Ox = this.w*parseFloat(OxExpr)/100;
      } 
      // if not specified with a percentage
      else {
        temp = parseFloat(OxExpr);
        
        // whether to convert the value to a number the values ​​are different
        if (temp != OxExpr) {
          temp = 0;
        }
        this.Ox = temp;
      }
    }

    // Oy
    // if specified with a percentage
    if (this.OyExpr) {
      OyExpr = this.OyExpr;
      if (OyExpr[OyExpr.length-1] === "%") {
        this.Oy = this.h*parseFloat(OyExpr)/100;
      } 
      // if not specified with a percentage
      else {
        temp = parseFloat(OyExpr);
        
        // whether to convert the value to a number the values ​​are different
        if (temp != OyExpr) {
          temp = 0;
        }
        this.Oy = temp;
      }
    }

    // register the space variables
    // ## Descartes 2 patch ## //
    if ((this.id !== "") && (parent.version !== 2)) {
      evaluator.setVariable(thisID + "._w", this.w);
      evaluator.setVariable(thisID + "._h", this.h);
      evaluator.setVariable(thisID + ".escala", this.scale);
      evaluator.setVariable(thisID + ".Ox", this.Ox);
      evaluator.setVariable(thisID + ".Oy", this.Oy);
      evaluator.setVariable(thisID + ".mouse_x", 0);
      evaluator.setVariable(thisID + ".mouse_y", 0);
      evaluator.setVariable(thisID + ".mouse_pressed", 0);
      evaluator.setVariable(thisID + ".mouse_clicked", 0);
      evaluator.setVariable(thisID + ".clic_izquierdo", 0);
    }
    else {
      temp = evaluator.getVariable("_w");
      if (temp === undefined) { temp = this.w; };
      evaluator.setVariable("_w", temp);

      temp = evaluator.getVariable("_h");
      if (temp === undefined) { temp = this.h; };
      evaluator.setVariable("_h", temp);

      temp = evaluator.getVariable("escala");
      if (temp === undefined) { temp = this.scale; };
      evaluator.setVariable("escala", temp);

      temp = evaluator.getVariable("Ox");
      if (temp === undefined) { temp = this.Ox; };
      evaluator.setVariable("Ox", temp);

      temp = evaluator.getVariable("Oy");
      if (temp === undefined) { temp = this.Oy; };
      evaluator.setVariable("Oy", temp);
      
      evaluator.setVariable("mouse_x", 0);
      evaluator.setVariable("mouse_y", 0);
      evaluator.setVariable("mouse_pressed", 0);
      evaluator.setVariable("mouse_clicked", 0);
      evaluator.setVariable("clic_izquierdo", 0);

      if ((this.x_axis === "") && (this.y_axis === "") && (parent.version == 2)) {
        this.axes = "";
      }
    }

    this.w_2 = this.w/2;
    this.h_2 = this.h/2;
  }
  
  /**
   * Add a control to the list of controls of the space
   * @param {Control} ctr is the control to add
   */
  descartesJS.Space.prototype.addCtr = function(ctr) {
    if (ctr.type === "graphic") {
      this.graphicsCtr.push(ctr);
    } 
    else {
      this.ctrs.push(ctr);
    }
  }
  
  /**
   * Add a graphic to the list of graphics of the space
   * @param {Graphic} gra is the graphic to add
   */
  descartesJS.Space.prototype.addGraph = function(gra) {
    if ((gra.background) && (this.type !== "R3")) {
      this.backgroundGraphics.push(gra);
    }
    else {
      this.graphics.push(gra);
    }
  }

  /**
   * Calculate the position relative to the X axis
   * @param {Number} x ths position
   * @return {Number} return the position relative to the X axis
   */
  descartesJS.Space.prototype.getRelativeX = function(x) {
    return (parseInt(x) - this.w_2 - this.Ox)/this.scale;
  }

  /**
   * Calculate the position relative to the Y axis
   * @param {Number} y ths position
   * @return {Number} return the position relative to the Y axis
   */
  descartesJS.Space.prototype.getRelativeY = function(y) {
    return (-parseInt(y) + this.h_2 + this.Oy)/this.scale;
  }
  
  /**
   * Calculate the position absolute respect to the canvas coordinate system
   * @param {Number} x ths position
   * @return {Number} return the position absolute to the X axis
   */
  descartesJS.Space.prototype.getAbsoluteX = function(x) {
    return (x*this.scale + this.w_2 + this.Ox);
  }

  /**
   * Calculate the position absolute respect to the canvas coordinate system
   * @param {Number} y ths position
   * @return {Number} return the position absolute to the Y axis
   */
  descartesJS.Space.prototype.getAbsoluteY = function(y) {
    return (-y*this.scale + this.h_2 + this.Oy);
  }

  /**
   * Find the offset postion of a space
   */
  descartesJS.Space.prototype.findOffset = function() {
    tmpContainer = this.container;

    this.offsetLeft = 0;
    this.offsetTop = 0;

    // store the display style
    if ((this.container) && (this.container.style)) {
      tmpDisplay = this.container.style.display;
    }

    // make visible the element to get the offset values
    this.container.style.display = "block";

    if (tmpContainer.getBoundingClientRect) {
      var boundingRect = tmpContainer.getBoundingClientRect();
      this.offsetLeft = boundingRect.left;
      this.offsetTop  = boundingRect.top;
    }
    else {
      while (tmpContainer) {
        if ((tmpContainer.tagName) && (tmpContainer.tagName.toLowerCase() !== "html")) {
          this.offsetLeft += tmpContainer.offsetLeft || 0;
          this.offsetTop  += tmpContainer.offsetTop || 0;
          tmpContainer = tmpContainer.parentNode;
        }
        else {
          tmpContainer = null;
        }
      }
    }
    
    // restore the display style
    if ((this.container) && (this.container.style)) {
      this.container.style.display = tmpDisplay;
    }
  }

  /**
   * Get the cursor position of the mouse in absolute coordinates respect to space where it is
   * @param {Event} evt the event containing the mouse position
   * @return {Object} return an object with the cursor position
   */
  descartesJS.Space.prototype.getCursorPosition = function(evt) {
    pos = descartesJS.getCursorPosition(evt);

    return { x: pos.x - this.offsetLeft, 
             y: pos.y - this.offsetTop 
           };
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var self;

  /**
   * Descartes 2D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceExternal = function(parent) {
    // call the parent constructor
    // descartesJS.Space.call(this, parent, values);

    self = this;
    self.parent = parent;

    self.width = 228;
    self.vSpace = 25;

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", "_DescartesExternalRegion_");
    // self.container.setAttribute("class", "DescartesSpaceExternalContainer");
    self.container.setAttribute("style", "-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; border-style: ridge; border-width: 5px; border-color: gray; box-shadow: 0px 0px 25px 5px #000; overflow-y: scroll; overflow-x: hidden; position: absolute; left: 0px; top: 0px; z-index: 10000; width: " + (self.width +27) + "px; height: 460px; background-color: #63b4fb");

    self.moveManipulator = document.createElement("div");
    self.moveManipulator.setAttribute("style", " position: absolute; left: 0px; top: 0px; width: " + (self.width +27) + "; height: " + self.vSpace + "px; line-height: " + self.vSpace + "px; background-color: ddd; cursor: move; padding-left: 75px; font-family: Sans-Serif; font-size: 18px;");
    self.moveManipulator.innerHTML = "Descartes";
    self.container.appendChild(self.moveManipulator);

    self.ctrs = [];
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  // descartesJS.extend(descartesJS.SpaceExternal, descartesJS.Space);
   
  descartesJS.SpaceExternal.prototype.init = function() {
    document.body.appendChild(this.container);

    self = this;
    var parser = self.parent.evaluator.parser;
    var fontSizeDefaultButtons = "15";
    var text;

    for (var i=0,l=self.ctrs.length; i<l; i++) {
      self.ctrs[i].expresion = parser.parse("(0," + (self.vSpace + 23 + i*35) + "," + (self.width) + ",35)");
      self.ctrs[i].update();
    }

    self.numCtr = l;

    // create the credits button
    if (self.language == "espa\u00F1ol") {
      text = "cr\u00E9ditos";
    } 
    else if (self.language == "english") {
      text = "about";
    }
    else {
      text = "cr\u00E9ditos";
    }

    var btnAbout = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         expresion: parser.parse("(0," + self.vSpace + "," + (self.width/2) + ",25)") 
                                                        });
    btnAbout.actionExec = { execute: descartesJS.showAbout };
    btnAbout.update();

    // create the configuration button
    var btnConfig = new descartesJS.Button(self.parent, { region: "external", 
                                                          name: "config", 
                                                          font_size: parser.parse(fontSizeDefaultButtons),
                                                          action: "config",
                                                          expresion: parser.parse("(" + (self.width/2) + "," + self.vSpace + "," + (self.width/2) + ",25)") 
                                                        });
    btnConfig.update();    

    // create the init button
    if (self.language == "espa\u00F1ol") {
      text = "inicio";
    } 
    else if (self.language == "english") {
      text = "init";
    }
    else {
      text = "inicio";
    }

    var btnInit = new descartesJS.Button(self.parent, { region: "external", 
                                                        name: text, 
                                                        font_size: parser.parse(fontSizeDefaultButtons), 
                                                        action: "init", 
                                                        expresion: parser.parse("(0," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)") 
                                                      });
    btnInit.update();

    // create the clear button
    if (self.language == "espa\u00F1ol") {
      text = "limpiar";
    } 
    else if (self.language == "english") {
      text = "clear";
    }
    else {
      text = "limpiar";
    }
    
    var btnClear = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         action: "clear",
                                                         expresion: parser.parse("(" + (self.width/2) + "," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)") 
                                                       });
    btnClear.update();

    // create the clear button
    if (self.language == "espa\u00F1ol") {
      text = "cerrar";
    } 
    else if (self.language == "english") {
      text = "close";
    }
    else {
      text = "close";
    }

    var btnClose = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         expresion: parser.parse("(" + (self.width/4) + "," + (self.vSpace + 46 + l*35) + "," + (self.width/2) + ",25)") 
                                                       });
    btnClose.update();
    btnClose.canvas.addEventListener("click", function(evt) {
      self.hide();
    });

    self.setPositionAndSize();

    // add the events for the movement
    /**
     *
     */
    function onMouseMove(evt) {
      self.newPosition = descartesJS.getCursorPosition(evt);
      self.container.style.left = self.initialPosition.x + (self.newPosition.x - self.oldPosition.x) + "px";
      self.container.style.top  = self.initialPosition.y + (self.newPosition.y - self.oldPosition.y) + "px";
    }

    /**
     *
     */
    function onMouseUp(evt) {
      evt.preventDefault();

      self.findOffset();

      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    }

    /**
     *
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      self.oldPosition = descartesJS.getCursorPosition(evt);
      self.initialPosition = { x: self.container.offsetLeft, y: self.container.offsetTop };

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
    }

    self.moveManipulator.addEventListener("mousedown", onMouseDown);

    self.findOffset();
    self.hide();
  }

  /**
   * Add a control to the list of controls of the space
   * @param {Control} ctr is the control to add
   */
  descartesJS.SpaceExternal.prototype.addCtr = function(ctr) {
    this.ctrs.push(ctr);
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.show = function() {
    this.setPositionAndSize();

    this.container.style.display = "block";
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.hide = function() {
    this.container.style.display = "none";
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.setPositionAndSize = function() {
    var self = this;
    var newHeight = self.vSpace + 46 + self.numCtr*35 + 25 + 10;

    self.container.style.left = Math.max((parseInt(window.innerWidth - self.width)/2), 0) + "px";
    self.container.style.top = "5px";

    // minimun space
    if (window.innerHeight < (self.vSpace + 75)) {
      self.container.style.height = (self.vSpace + 75) + "px";
    }
    else if (newHeight > (window.innerHeight-10)) {
      self.container.style.height = window.innerHeight-10;
    }
    else {
      self.container.style.height = newHeight + "px";
    }
  }

  /**
   * Find the offset postion of a space
   */
  descartesJS.SpaceExternal.prototype.findOffset = function() {
    tmpContainer = this.container;

    this.offsetLeft = 0;
    this.offsetTop = 0;

    // store the display style
    if ((this.container) && (this.container.style)) {
      tmpDisplay = this.container.style.display;
    }

    // make visible the element to get the offset values
    this.container.style.display = "block";

    if (tmpContainer.getBoundingClientRect) {
      var boundingRect = tmpContainer.getBoundingClientRect();
      this.offsetLeft = boundingRect.left;
      this.offsetTop  = boundingRect.top;
    }
    else {
      while (tmpContainer) {
        if ((tmpContainer.tagName) && (tmpContainer.tagName.toLowerCase() !== "html")) {
          this.offsetLeft += tmpContainer.offsetLeft || 0;
          this.offsetTop  += tmpContainer.offsetTop || 0;
          tmpContainer = tmpContainer.parentNode;
        }
        else {
          tmpContainer = null;
        }
      }
    }
    
    // restore the display style
    if ((this.container) && (this.container.style)) {
      this.container.style.display = tmpDisplay;
    }

    // find the offset for the controls that need it
    for (var i=0,l=this.ctrs.length; i<l; i++) {
      if (this.ctrs[i].findOffset) {
        this.ctrs[i].findOffset();
      }
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var PI2 = Math.PI*2;
  var minScale = 0.000001;
  var maxScale = 1000000;

  var axisFont = descartesJS.convertFont("SansSerif,PLAIN,12");
  var mouseTextFont = descartesJS.convertFont("Monospaced,PLAIN,12");

  var self;

  var evaluator;
  var parent;
  var ctx;

  var changeX;
  var changeY;
  var thisGraphics_i;
  var thisCtrs_i;

  var rsc;
  var dec;
  var wh_temp;

  var w;
  var h;
  var x;
  var y;
  var Ox;
  var Oy;
  var x1;
  var x2;
  var y1;
  var y2;

  var coordTxt_X;
  var coordTxt_Y;
  var coordTxt;
  var coordTxtW;
  var mouseX;
  var mouseY;
  var posX;
  var posY;

  var hasTouchSupport;
  var disp;

  /**
   * Descartes 2D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space2D = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    self = this;
    
    // create the canvas
    self.backgroundCanvas = document.createElement("canvas");
    self.backgroundCanvas.setAttribute("id", self.id + "_background");
    self.backgroundCanvas.setAttribute("width", self.w + "px");
    self.backgroundCanvas.setAttribute("height", self.h + "px");
    self.backgroundCtx = self.backgroundCanvas.getContext("2d");
    self.backgroundCtx.imageSmoothingEnabled = false;
    self.backgroundCtx.mozImageSmoothingEnabled = false;
    self.backgroundCtx.webkitImageSmoothingEnabled = false;

    self.canvas = document.createElement("canvas");
    self.canvas.setAttribute("id", self.id + "_canvas");
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.setAttribute("class", "DescartesSpace2DCanvas");
    self.canvas.setAttribute("style", "z-index: " + self.zIndex + ";");
    self.ctx = self.canvas.getContext("2d");
    self.ctx.imageSmoothingEnabled = false;
    self.ctx.mozImageSmoothingEnabled = false;
    self.ctx.webkitImageSmoothingEnabled = false;

    // create a graphic control container
    self.graphicControlContainer = document.createElement("div");
    self.graphicControlContainer.setAttribute("id", self.id + "_graphicControls");
    self.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");
    
    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.setAttribute("id", self.id + "_numericalControls");
    self.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", self.id);
    self.container.setAttribute("class", "DescartesSpace2DContainer");
    self.container.setAttribute("style", "left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    // ### ARQUIMEDES ###
    // if is the default arquimedes add a border to the container
    if ((self.parent.arquimedes) && (self.background.getColor() === "#f0f8fa")) {
      self.container.style.border = "1px solid #b8c4c8";
    }
    // ### ARQUIMEDES ###

    // add the elements to the container
    self.container.appendChild(self.backgroundCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);
    
    parent.container.insertBefore(self.container, parent.loader);

    // variable to expose the image of the space
    self.parent.images[self.id + ".image"] = self.canvas;
    self.parent.images[self.id + ".image"].ready = 1;
    self.parent.images[self.id + ".image"].complete = true;
    self.evaluator.setVariable(self.id + ".image", self.id + ".image");

    // variable to expose the image of the background space
    self.parent.images[self.id + ".back"] = self.backgroundCanvas;
    self.parent.images[self.id + ".back"].ready = 1;
    self.parent.images[self.id + ".back"].complete = true;
    self.evaluator.setVariable(self.id + ".back", self.id + ".back");

    if ((self.id !== "") && (parent.version !== 2)) {
      self.OxString    = self.id + ".Ox";
      self.OyString    = self.id + ".Oy";
      self.scaleString = self.id + ".escala";
      self.wString     = self.id + "._w";
      self.hString     = self.id + "._h";  
      self.mxString    = self.id + ".mouse_x";
      self.myString    = self.id + ".mouse_y";
      self.mpressedString = self.id + ".mouse_pressed";
      self.mclickedString = self.id + ".mouse_clicked";
      self.mclicizquierdoString = self.id + ".clic_izquierdo";
    }
    else {
      self.OxString    = "Ox";
      self.OyString    = "Oy";
      self.scaleString = "escala";
      self.wString     = "_w";
      self.hString     = "_h";
      self.mxString    = "mouse_x";
      self.myString    = "mouse_y";
      self.mpressedString = "mouse_pressed";
      self.mclickedString = "mouse_clicked";
      self.mclicizquierdoString = "clic_izquierdo";
    }

    // register the mouse and touch events
    // if (self.id !== "descartesJS_scenario") {
      self.registerMouseAndTouchEvents();
    // }

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space2D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space2D.prototype.init = function() {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the canvas if has some regions
    if (self.canvas) {
      self.backgroundCanvas.setAttribute("width", self.w + "px");
      self.backgroundCanvas.setAttribute("height", self.h + "px");
      self.canvas.setAttribute("width", self.w + "px");
      self.canvas.setAttribute("height", self.h + "px");
    };

    // find the offset of the container
    if (self.container) {
      self.findOffset();
    }
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space2D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    evaluator.setVariable(self.wString, self.w);
    evaluator.setVariable(self.hString, self.h);

    // check the draw if condition
    self.drawIfValue = evaluator.evalExpression(self.drawif) > 0;

    // draw the space
    if (self.drawIfValue) {

      changeX = (self.x !== (evaluator.evalExpression(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.evalExpression(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxString)) ||
                         (self.Oy !== evaluator.getVariable(self.OyString)) ||
                         (self.scale !== evaluator.getVariable(self.scaleString));

      self.x = (changeX) ? evaluator.evalExpression(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.evalExpression(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ox = evaluator.getVariable(self.OxString);
      self.Oy = evaluator.getVariable(self.OyString);
      self.scale = evaluator.getVariable(self.scaleString);
      self.drawBefore = self.drawIfValue;

      // check if the scale is not below the lower limit
      if (self.scale < minScale) {
        self.scale = minScale;
        evaluator.setVariable(self.scaleString, minScale);
      }
      // check if the scale is not above the upper limit
      else if (self.scale > maxScale) {
        self.scale = maxScale;
        evaluator.setVariable(self.scaleString, maxScale);
      }
      
      // if some property change then adjust the container style
      if ((changeX) || (changeY)) {
        self.container.style.left = self.x + "px";
        self.container.style.top = self.y + "px";
        self.findOffset();
      }

      self.container.style.display = "block";
        
      // draw the trace
      self.drawTrace = (!self.spaceChange) && (!self.click);

      if (self.spaceChange) {
        self.drawBackground();
      }
      self.draw();
    } 
    // hide the space
    else {
      self.container.style.display = "none";
    }
    
  }

  /**
   * Draw the space background 
   */
  descartesJS.Space2D.prototype.drawBackground = function() {
    evaluator = this.evaluator;
    ctx = this.backgroundCtx;

    // draw the background color
    ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    ctx.fillStyle = this.background.getColor();
    ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

    // draw the background image if any
    if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
      if (this.bg_display === "topleft") {
        ctx.drawImage(this.image, 0, 0);
      } 
      else if (this.bg_display === "stretch") {
        ctx.drawImage(this.image, 0, 0, this.w, this.h);
      } 
      else if (this.bg_display === "patch") {
        ctx.fillStyle = ctx.createPattern(this.image, "repeat");
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if (this.bg_display === "center") {
        ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
      }
    }
    
    rsc = this.scale;
    dec = 0;
    wh_temp = ((this.w+this.h) < 0) ? 0 : (this.w+this.h);

    while (rsc>(wh_temp)) {
      rsc/=10;
      dec++;
    }
    while (rsc<(wh_temp)/10) {
      rsc*=10;
    }

    ctx.lineWidth = 1;

    // draw the big net
    if (this.net !== "") {
      ctx.strokeStyle = this.net.getColor();
      this.drawMarks(ctx, rsc/10, -1);
    }
    
    // draw the finnest net
    if ( ((this.parent.version !== 2) && (this.net10 !== "")) || 
         ((this.parent.version === 2) && (this.net !== "") && (this.net10 !== ""))
       ) {
      ctx.strokeStyle = this.net10.getColor();
      this.drawMarks(ctx, rsc, -1);
    }
    
    // draw the axes
    if (this.axes !== "") {
      ctx.strokeStyle = this.axes.getColor();
      
      ctx.beginPath();
      // x axis
      if ((this.x_axis !== "") || (this.parent.version !== 2)) {
        ctx.moveTo(0, MathFloor(this.h/2+this.Oy)+.5);
        ctx.lineTo(this.w, MathFloor(this.h/2+this.Oy)+.5);
      }

      // y axis
      if ((this.y_axis !== "") || (this.parent.version !== 2)) {
        ctx.moveTo(MathFloor(this.w/2+this.Ox)+.5, 0);
        ctx.lineTo(MathFloor(this.w/2+this.Ox)+.5, this.h);
      }
      
      ctx.stroke();

      this.drawMarks(ctx, rsc, 4);
      this.drawMarks(ctx, rsc/2, 2);
      this.drawMarks(ctx, rsc/10, 1);
    }
    
    // draw the axis names
    if ((this.x_axis !== "") || (this.y_axis !== "")) {
      ctx.fillStyle = (this.axes !== "") ? this.axes.getColor() : "black";

      ctx.font = axisFont
      ctx.textAlign = "right";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(this.x_axis, MathFloor(this.w)-2, MathFloor(this.h/2+this.Oy)+12);
      ctx.fillText(this.y_axis, MathFloor(this.w/2+this.Ox)-2, 12); 
    }
    
    // draw the axis numbers
    if ((this.numbers) && (this.axes != "")) {
      ctx.fillStyle = this.axes.getColor();
      ctx.font = axisFont
      ctx.textAlign = "start";
      ctx.textBaseline = "bottom";

      if (rsc > ((this.w+this.h)/2)) {
        this.drawNumbers(ctx, rsc/5, (rsc<=this.scale)?dec+1:dec);
      } 
      
      else if (rsc > ((this.w+this.h)/4)) {
        this.drawNumbers(ctx, rsc/2, (rsc<=this.scale)?dec+1:dec);
      } 
      
      else {
        this.drawNumbers(ctx, rsc, dec);
      }
    }

    // draw the background graphics
    for(var i=0, l=this.backgroundGraphics.length; i<l; i++) {
      this.backgroundGraphics[i].draw();
    }    
  }

  /**
   * Draw the space
   */
  descartesJS.Space2D.prototype.draw = function() {
    ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the no background graphics
    for(var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if ((thisGraphics_i.trace !== "") && (this.drawTrace)) {
        thisGraphics_i.drawTrace();
      }

      thisGraphics_i.draw();
    }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].update();
      this.graphicsCtr[i].draw();
    }

    // draw the text showing the mouse postion
    if ((this.text != "") && (this.click) && (this.whichButton === "L")) {
      ctx.fillStyle = this.text.getColor();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.font = mouseTextFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      coordTxt_X = (this.scale <= 1) ? ((this.mouse_x).toFixed(0)) : (this.mouse_x).toFixed((this.scale).toString().length);
      coordTxt_Y = (this.scale <= 1) ? ((this.mouse_y).toFixed(0)) : (this.mouse_y).toFixed((this.scale).toString().length);
      coordTxt = "(" + coordTxt_X + "," + coordTxt_Y + ")";
      coordTxtW = MathFloor(ctx.measureText(coordTxt).width/2);
      mouseX = this.getAbsoluteX(this.mouse_x);
      mouseY = this.getAbsoluteY(this.mouse_y);
      posX = MathFloor(mouseX);
      posY = MathFloor(mouseY-10);

      // prevents the mouse position text get out of the space
      if ((posX+coordTxtW) > this.w) {
        posX = this.w-coordTxtW;
      } 
      else if ((posX-coordTxtW) < 0) {
        posX = coordTxtW;
      }
      if ((posY+1) > this.h) {
        posY = this.h;
      } 
      else if ((posY-14) < 0) { // 14 is aproximately the text width
        posY = 15;
      }

      ctx.fillText(coordTxt, posX, posY);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.5, 0, PI2, true);
      ctx.stroke();
    }
  }
  
  /**
   * Draw the axis marks in the space
   * @param {CanvasRenderingContext2D} ctx the rendering context to draw
   * @param {Number} rsc
   * @param {Number} sz
   */
  descartesJS.Space2D.prototype.drawMarks = function(ctx, rsc, sz) {
    w = this.w;
    h = this.h;
    
    x1 = 0;
    x2 = w;
    y1 = 0;
    y2 = h;
    Ox = MathFloor(w/2+this.Ox);
    Oy = MathFloor(h/2+this.Oy);
    
    if (sz >= 0) {
      x1 = Ox-sz;
      x2 = Ox+sz;
      y1 = Oy-sz;
      y2 = Oy+sz;
    }
        
    ctx.beginPath();
    
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.moveTo(x+.5, y1+.5);
      ctx.lineTo(x+.5, y2+.5);
    }
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      ctx.moveTo(x1+.5, y+.5);
      ctx.lineTo(x2+.5, y+.5);
    }

    ctx.stroke();
  }
    
  /**
   * Draw the axis numbers
   * @param {CanvasRenderingContext2D} ctx the rendering context to draw
   * @param {Number} rsc
   * @param {Number} dec
   */
  descartesJS.Space2D.prototype.drawNumbers = function(ctx, rsc, dec) {
    w = this.w;
    h = this.h;
    
    Ox = MathFloor(w/2+this.Ox);
    Oy = MathFloor(h/2+this.Oy);
    
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.fillText(parseFloat( (i*rsc/this.scale).toFixed(4) ), x+1, Oy-2);
    }
    
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      if (parseFloat( (-i*rsc/this.scale) ) !== 0) {
        ctx.fillText(parseFloat( (-i*rsc/this.scale).toFixed(4) ), Ox+5, y+5);
      }
    }
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Space2D.prototype.registerMouseAndTouchEvents = function() {
    var self = this;
    hasTouchSupport = descartesJS.hasTouchSupport;

    // prevent the context menu display
    self.canvas.oncontextmenu = function () { return false; };

    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de touch (iOS, android)
    ///////////////////////////////////////////////////////////////////////////
    if (hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements);
      }
      this.canvas.addEventListener("touchstart", onTouchStart);
    }

    /**
     * @param {Event} evt 
     * @private
     */
    function onTouchStart(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 1;
      self.evaluator.setVariable(self.mpressedString, 1);
      self.evaluator.setVariable(self.mclickedString, 0);
      self.evaluator.setVariable(self.mclicizquierdoString, 0);

      // deactivate the graphic controls
      self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);
      
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onTouchEnd);

      // try to preserv the slide gesture in the tablets
      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      // }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchEnd(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.mpressedString, 0);
      self.evaluator.setVariable(self.mclickedString, 1);
      self.evaluator.setVariable(self.mclicizquierdoString, 1);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();

      self.parent.update();      
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de mouse
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements);
      }
      this.canvas.addEventListener("mousedown", onMouseDown);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 1;

      // deactivate the graphic controls
      self.parent.deactivateGraphiControls();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton === "R") {
        window.addEventListener("mouseup", onMouseUp);

        self.clickPosForZoom = (self.getCursorPosition(evt)).y;
        self.clickPosForZoomNew = self.clickPosForZoom;
        
        // if not fixed add a zoom manager
        if (!self.fixed) {
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom);
        }
      }
      
      if (self.whichButton === "L") {
        self.evaluator.setVariable(self.mpressedString, 1);
        self.evaluator.setVariable(self.mclickedString, 0);
        self.evaluator.setVariable(self.mclicizquierdoString, 0);

        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.mpressedString, 0);
      self.evaluator.setVariable(self.mclickedString, 1);
      self.evaluator.setVariable(self.mclicizquierdoString, 1);

      evt.preventDefault();

      if (self.whichButton === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);

        // show the external space
        if (self.clickPosForZoom == self.clickPosForZoomNew) {
          self.parent.externalSpace.show();
        }
      }

      window.removeEventListener("mousemove", onMouseMove, false);
      window.removeEventListener("mouseup", onMouseUp, false);
      
      self.parent.update();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);
      self.evaluator.setVariable(self.mxString, self.mouse_x);
      self.evaluator.setVariable(self.myString, self.mouse_y);

      self.evaluator.setVariable(self.mclickedString, 0);
      self.evaluator.setVariable(self.mclicizquierdoString, 0);

      self.parent.update();
    }
    
    /**
     * @param {Event} evt
     * @private
     */
    function onMouseMoveZoom(evt) {
      evt.preventDefault();

      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      self.evaluator.setVariable(self.scaleString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));

      self.parent.update();      
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
      // if the space is not fixed, then change the origin coordinates
      if (!self.fixed) {
        self.posNext = self.getCursorPosition(evt);
        disp = { x: MathFloor(self.posAnte.x-self.posNext.x), 
                 y: MathFloor(self.posAnte.y-self.posNext.y) };

        self.evaluator.setVariable(self.OxString, (self.Ox - disp.x));
        self.evaluator.setVariable(self.OyString, (self.Oy - disp.y));
        self.posAnte.x -= disp.x;
        self.posAnte.y -= disp.y;
      }

      onSensitiveToMouseMovements(evt);

      // // try to preserv the slide gesture in the tablets
      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
      evt.preventDefault();
      // }
    }
  }
    
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathMax   = Math.max;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  var MathSqrt  = Math.sqrt;
  var MathPI_2  = Math.PI/2;
  var tiltAngle = Math.PI*15/180;
  var cosTiltAngle = Math.cos(tiltAngle);
  var sinTiltAngle = Math.sin(tiltAngle);
  var minScale = 0.000001;
  var maxScale = 1000000;

  var evaluator;
  var parent;
  var self;
  var thisGraphics_i;
  var thisGraphicsNext;
  var primitives;
  var primitivesLength;
  var hasTouchSupport;
  var changeX;
  var changeY;
  var dispX;
  var dispY;

  var dx;
  var dy;
  var dz;
  var t;

  var angle;
  var cosAngle;
  var sinAngle;
  var newV1;

  var r;
  var g;
  var b;
  var dl3;
  var intensity = [];
  var I;
  var c;
  var normal;
  var toEye;
  var aveDistanceToEye;
  var unitToEye;

  var t_rr;
  var r_rr;
  var N_rr;

  /**
   * Descartes 3D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    self = this;

    // create the canvas
    self.backgroundCanvas = document.createElement("canvas");
    self.backgroundCanvas.setAttribute("id", self.id + "_background");
    self.backgroundCanvas.setAttribute("width", self.w + "px");
    self.backgroundCanvas.setAttribute("height", self.h + "px");
    // self.backgroundCtx = self.backgroundCanvas.getContext("2d");
    // self.backgroundCtx.imageSmoothingEnabled = false;
    // self.backgroundCtx.mozImageSmoothingEnabled = false;
    // self.backgroundCtx.webkitImageSmoothingEnabled = false;

    self.canvas = document.createElement("canvas");
    self.canvas.setAttribute("id", self.id + "_canvas");
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.setAttribute("class", "DescartesSpace3DCanvas");
    self.canvas.setAttribute("style", "z-index: " + self.zIndex + ";");
    self.ctx = self.canvas.getContext("2d");
    self.ctx.imageSmoothingEnabled = false;
    self.ctx.mozImageSmoothingEnabled = false;
    self.ctx.webkitImageSmoothingEnabled = false;
    
    // create a graphic control container
    self.graphicControlContainer = document.createElement("div");
    self.graphicControlContainer.setAttribute("id", self.id + "_graphicControls");
    self.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");
    
    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.setAttribute("id", self.id + "_numericalControls");
    self.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", self.id);
    self.container.setAttribute("class", "DescartesSpace3DContainer");
    self.container.setAttribute("style", "left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    // add the elements to the container
    self.container.appendChild(self.backgroundCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);
    
    parent.container.insertBefore(self.container, parent.loader);
    
    self.eye = { x: 0, y: 0, z: 0 };

    self.lights = [ { x: 50, y:  50, z: 70},
                    { x: 50, y: -50, z: 30},
                    { x: 20, y:   0, z: -80},
                    { x:  0, y:   0, z: 0}
                  ];
    for (var i=0, l=self.lights.length; i<l; i++) {
      self.lights[i] = descartesJS.normalize3D(self.lights[i]);
    }
    self.light3 = { x:  0, y:   0, z: 0};

    self.intensity = [.4, .5, .3, 0];
    self.userIntensity = 0;
    self.dim = 1;
    self.tmpIntensity = [];
    
    self.OxStr = self.id + ".Ox";
    self.OyStr = self.id + ".Oy";
    self.scaleStr = self.id + ".escala";
    self.wStr = self.id + "._w";
    self.hStr = self.id + "._h";
    self.obsStr = self.id + ".observador";
    self.rotZStr = self.id + ".rot.z";
    self.rotYStr = self.id + ".rot.y";
    self.userI_Dim_Str = self.id + ".userIlum.dim";
    self.userI_I_Str = self.id + ".userIlum.I";
    self.userI_x_Str = self.id + ".userIlum.x";
    self.userI_y_Str = self.id + ".userIlum.y";
    self.userI_z_Str = self.id + ".userIlum.z";

    // set the value to the rotation variables
    self.evaluator.setVariable(self.rotZStr, 0);
    self.evaluator.setVariable(self.rotYStr, 0);
    self.evaluator.setVariable(self.userI_Dim_Str, self.dim);
    self.evaluator.setVariable(self.userI_I_Str, self.userIntensity);
    self.evaluator.setVariable(self.userI_x_Str, 0);
    self.evaluator.setVariable(self.userI_y_Str, 0);
    self.evaluator.setVariable(self.userI_z_Str, 0);

    // register the mouse and touch events
    self.registerMouseAndTouchEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space3D.prototype.init = function(checkObserver) {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the canvas if has some regions
    if (self.canvas) {
      // self.backgroundCanvas.setAttribute("width", self.w + "px");
      // self.backgroundCanvas.setAttribute("height", self.h + "px");
      self.canvas.setAttribute("width", self.w + "px");
      self.canvas.setAttribute("height", self.h + "px");
    };

    // find the offset of the container
    if (self.container) {
      self.findOffset();
    }

    self.w_2 = self.w/2;
    self.h_2 = self.h/2;

    self.oldMouse = {x: 0, y: 0};
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    evaluator.setVariable(self.wStr, self.w);
    evaluator.setVariable(self.hStr, self.h);

    // check the draw if condition
    self.drawIfValue = evaluator.evalExpression(self.drawif) > 0;

    if (self.drawIfValue) {
      changeX = (self.x !== (evaluator.evalExpression(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.evalExpression(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxStr)) ||
                         (self.Oy !== evaluator.getVariable(self.OyStr)) ||
                         (self.scale !== evaluator.getVariable(self.scaleStr));

      self.x = (changeX) ? evaluator.evalExpression(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.evalExpression(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ox = evaluator.getVariable(self.OxStr);
      self.Oy = evaluator.getVariable(self.OyStr);
      self.scale = evaluator.getVariable(self.scaleStr);
      self.drawBefore = self.drawIfValue;

      if ((firstTime) || (self.observer == undefined)) {
        var observerSet;
        // check if the observer is the name of some control
        for (var i=0, l=self.parent.controls.length; i<l; i++) {
          if (self.parent.controls[i].id === self.obsStr) {
            observerSet = true;
          }
        }

        if (observerSet) {
          self.observer = evaluator.getVariable(self.obsStr) || (self.w + self.h) * 0.5;
        }
        else {
          self.observer = (self.w + self.h) * 2.5;
        }

        self.observer = MathMax(self.observer, 0.1*(self.w+self.h));

        evaluator.setVariable(self.obsStr, self.observer);

        ////////////////////////////////////////////////////////////////////////////////////////////////
        self.eye = { x: (self.observer/self.scale)*cosTiltAngle, 
                     y: 0, 
                     z: (self.observer/self.scale)*sinTiltAngle
                   };
        self.D = self.scale*self.eye.x/cosTiltAngle;
        self.XE = MathRound(self.scale*self.eye.y +0.5);
        self.YE = MathRound(self.scale*self.eye.z +0.5);
        ////////////////////////////////////////////////////////////////////////////////////////////////
      }

      self.observer = MathMax(evaluator.getVariable(self.obsStr), 0.1*(self.w+self.h));
      evaluator.setVariable(self.obsStr, self.observer);

      // check if the scale is not below the lower limit
      if (self.scale < minScale) {
        self.scale = minScale;
        evaluator.setVariable(self.scaleStr, minScale);
      }
      // check if the scale is not above the upper limit
      else if (self.scale > maxScale) {
        self.scale = maxScale;
        evaluator.setVariable(self.scaleStr, maxScale);
      }

      // if some property change then adjust the container style
      if ((changeX) || (changeY)) {
        self.container.style.left = self.x + "px";
        self.container.style.top = self.y + "px";
        self.findOffset();
      }

      self.container.style.display = "block";

      self.dim = evaluator.getVariable(self.userI_Dim_Str);
      self.userIntensity = evaluator.getVariable(self.userI_I_Str);
      // user defined light
      self.light3 = { x: parseInt(evaluator.getVariable(self.userI_x_Str)),
                      y: parseInt(evaluator.getVariable(self.userI_y_Str)),
                      z: parseInt(evaluator.getVariable(self.userI_z_Str))
                    };

      self.updateCamera();

      // draw the geometry
      self.draw();
    }
    // hide the space
    else {
      self.container.style.display = "none";
    }
  }

  /**
   * Auxiliary function to sort the primitives
   */
  function depthSort(a, b) {
    return b.depth - a.depth;
  }

  /**
   * Draw the primitives of the graphics, the primitives are obtained from the update step
   */
  descartesJS.Space3D.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.background.getColor();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the background image if any
    if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
      if (this.bg_display === "topleft") {
        this.ctx.drawImage(this.image, 0, 0);
      } 
      else if (this.bg_display === "stretch") {
        this.ctx.drawImage(this.image, 0, 0, this.w, this.h);
      } 
      else if (this.bg_display === "patch") {
        this.ctx.fillStyle = ctx.createPattern(this.image, "repeat");
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if (this.bg_display === "center") {
        this.ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
      }
    }

    // if not interact with the space
    // if (!this.click) {
      // update the graphics to build its primitives
      for(var i=0, l=this.graphics.length; i<l; i++) {
        this.graphics[i].update();
      }
    // }

    this.primitives = [];

    // split the primitives if needed
    for (var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if ((thisGraphics_i.split) || (this.split)) {
        for (var j=i+1; j<l; j++) {
          thisGraphicsNext = this.graphics[j];

          if ((thisGraphicsNext.split) || (this.split)) {
            thisGraphics_i.splitFace(thisGraphicsNext);
          }
        }
      }

      this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
    }

    primitives = this.primitives;
    primitivesLength = primitives.length;

    for(var i=0; i<primitivesLength; i++) {
      primitives[i].computeDepth(this);
    }

    primitives = primitives.sort(depthSort);

    // // draw the primitives
    // if (this.render === "painter") {
    //   this.drawPainter(primitives);
    // }
    // else {
      for(var i=0; i<primitivesLength; i++) {
        primitives[i].draw(this.ctx, this);
      }
    // }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].draw();
    }
  }

  var tmpPrimitive;

  descartesJS.renderNode = function(v) {
    this.value = v;
    this.back = null;
    this.front = null;
  }

  descartesJS.renderNode.prototype.inOrder = function() {
    var list = [];
    if (this.back) {
      list = list.concat(this.back.inOrder());
    }
    list.push(this.value);
    if (this.front) {
      list = list.concat(this.front.inOrder());
    }

    return list;
  }

  descartesJS.Space3D.prototype.buildTree = function(primitives) {
    if (primitives.length === 0) {
      return null;
    }

    var front_or_back;
    var backList = [];
    var frontList = [];
    tmpPrimitive = primitives.shift();

    for (var i=0, l=primitives.length; i<l; i++) {
      front_or_back = null;

      for (var vert=0,vertL=primitives[i].spaceVertices.length; vert<vertL; vert++) {
        // if (tmpPrimitive.spaceVertices.length > 2) {
        //   whereIs = this.inPlane(tmpPrimitive.spaceVertices[0], tmpPrimitive.spaceVertices[1], tmpPrimitive.spaceVertices[2], primitives[i].spaceVertices[vert]);
        // }
        // else {
        //   whereIs = 0;
        // }
        whereIs = this.inPlane2(tmpPrimitive.spaceVertices[0], tmpPrimitive.normal, primitives[i].spaceVertices[vert]);
        whereIs = (tmpPrimitive.direction > 0) ? -whereIs : whereIs;

        if (front_or_back === null) {
          if (whereIs < 0) {
            front_or_back = "front";
          }
          else if (whereIs > 0) {
            front_or_back = "back";
          }
        }
        else {
          if (whereIs < 0) {
            if (front_or_back === "back") {
              front_or_back = "cross";
            }
          }
          else if (whereIs > 0) {
            if (front_or_back === "front") {
              front_or_back = "cross";
            }
          }
        }
      }

      if (front_or_back === "back") {
        backList.push( primitives[i] );
      }
      else if (front_or_back === "front") {
        frontList.push( primitives[i] );
      }
//       else if (front_or_back == null) {
//         backList.push( primitives[i] );
// // console.log(front_or_back);
//       } 
      else {
        front_or_back = null;

        for (var vert=0,vertL=tmpPrimitive.spaceVertices.length; vert<vertL; vert++) {
          // if (primitives[i].spaceVertices.length > 2) {
          //   whereIs = this.inPlane(primitives[i].spaceVertices[0], primitives[i].spaceVertices[1], primitives[i].spaceVertices[2], tmpPrimitive.spaceVertices[vert]);
          // }
          // else {
          //   whereIs = 0;
          // }
          whereIs = this.inPlane2(primitives[i].spaceVertices[0], primitives[i].normal, tmpPrimitive.spaceVertices[vert]);
          whereIs = (primitives[i].direction > 0) ? -whereIs : whereIs;

          if (front_or_back === null) {
            if (whereIs < 0) {
              front_or_back = "front";
            }
            else if (whereIs > 0) {
              front_or_back = "back";
            }
          }
          else {
            if (whereIs < 0) {
              if (front_or_back === "back") {
                front_or_back = "cross";
              }
            }
            else if (whereIs > 0) {
              if (front_or_back === "front") {
                front_or_back = "cross";
              }
            }
          }
        }

        if (front_or_back === "front") {
          backList.push( primitives[i] );
        }
        else {
          frontList.push( primitives[i] );
        }

// console.log(front_or_back);
      }

    }

    var returnTree = new descartesJS.renderNode(tmpPrimitive);
    returnTree.back = this.buildTree(backList);
    returnTree.front = this.buildTree(frontList);
    return returnTree;
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.drawPainter = function(primitives) {
    var renderTree = this.buildTree(primitives).inOrder();

    for(var i=0; i<renderTree.length; i++) {
      renderTree[i].draw(this.ctx, this);
    }
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.inPlane = function(p1, p2, p3, p) {
    return parseFloat( ((p.x - p1.x)*(p2.y - p1.y)*(p3.z - p1.z) + 
                        (p.y - p1.y)*(p2.z - p1.z)*(p3.x - p1.x) + 
                        (p.z - p1.z)*(p2.x - p1.x)*(p3.y - p1.y) -
                        (p.z - p1.z)*(p2.y - p1.y)*(p3.x - p1.x) -
                        (p.y - p1.y)*(p2.x - p1.x)*(p3.z - p1.z) -
                        (p.x - p1.x)*(p2.z - p1.z)*(p3.y - p1.y)).toFixed(8)
                      );
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.inPlane2 = function(p1, n, p) {
    return parseFloat( (n.x*(p.x - p1.x) + n.y*(p.y - p1.y) + n.z*(p.z - p1.z)).toFixed(8) );
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.updateCamera = function() {
    self = this;

    self.D = self.observer;

    self.eye.x = self.D/self.scale;
    self.eye.y = self.XE/self.scale;
    self.eye.z = self.YE/self.scale;
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.rotateVertex = function(v) {
    // Z rotation
    angle = descartesJS.degToRad(self.evaluator.getVariable(self.rotZStr));
    cosAngle = MathCos(angle);
    sinAngle = MathSin(angle);

    newV1 = { x: v.x*cosAngle - v.y*sinAngle,
              y: v.x*sinAngle + v.y*cosAngle,
              z: v.z
            };

    // Y rotation    
    angle  = descartesJS.degToRad(self.evaluator.getVariable(self.rotYStr));
    cosAngle  = MathCos(angle);
    sinAngle  = MathSin(angle);

    return { x: newV1.z*sinAngle + newV1.x*cosAngle,
             y: newV1.y,
             z: newV1.z*cosAngle - newV1.x*sinAngle
           };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.project = function(v) {
    self = this;

    dx = self.eye.x - v.x;
    dy = self.eye.y - v.y;
    dz = self.eye.z - v.z;
    t = -v.x/MathSqrt(dx*dx + dy*dy + dz*dz) || 0;

    dx =  self.scale*(v.y + t*(self.eye.y - v.y));
    dy = -self.scale*(v.z + t*(self.eye.z - v.z));

    return { x: parseInt(dx +this.w_2 +this.Ox),
             y: parseInt(dy +this.h_2 +this.Oy),
             z: t
           };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.computeColor = function(color, primitive, metal) {
    toEye = descartesJS.subtract3D(this.eye, primitive.average);
    aveDistanceToEye = descartesJS.norm3D(toEye);
    unitToEye = descartesJS.scalarProduct3D(toEye, 1/aveDistanceToEye);

    this.lights[3] = descartesJS.subtract3D( this.light3, primitive.average);
    dl3 = descartesJS.norm3D(this.lights[3]);

    for (var i=0, l=this.intensity.length-1; i<l; i++) {
      intensity[i] = this.intensity[i]*this.dim;
    }
    intensity[3] = ((this.userIntensity*this.userIntensity)/dl3) || 0;

    I = (metal) ? this.dim/2 : this.dim/4;
    c = 0;

    normal = (primitive.direction >=0) ? primitive.normal : descartesJS.scalarProduct3D(primitive.normal, -1);

    for (var i=0, l=this.lights.length; i<l; i++) {
      if (metal) {
        c = Math.max( 0, descartesJS.dotProduct3D(reflectedRay(this.lights[i], normal), unitToEye) );
        c = c*c*c;
      }
      else {
        c = Math.max(0, descartesJS.dotProduct3D(this.lights[i], normal));
      }

      I+= intensity[i]*c;
    }
    I = Math.min(I, 1);

    r = MathFloor(color.r*I);
    g = MathFloor(color.g*I);
    b = MathFloor(color.b*I);

    return "rgba(" + r + "," + g + "," + b + "," + color.a + ")";
  }    

  /**
   *
   */
  function reflectedRay(l, uN) {
    t_rr = descartesJS.subtract3D(l, descartesJS.scalarProduct3D(uN, descartesJS.dotProduct3D(l, uN)));
    r_rr = descartesJS.add3D(l, descartesJS.scalarProduct3D(t_rr, -2));
    N_rr = descartesJS.norm3D(r_rr);
    if (N_rr !== 0) {
      return descartesJS.scalarProduct3D(r_rr, 1/N_rr);
    }
    return descartesJS.scalarProduct3D(l, -1);
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Space3D.prototype.registerMouseAndTouchEvents = function() {
    var self = this;

    hasTouchSupport = descartesJS.hasTouchSupport;

    this.canvas.oncontextmenu = function () { return false; };

    if (hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("touchstart", onTouchStart);
    }

    /**
     * @param {Event} evt
     * @private
     */
    function onTouchStart(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 1;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      self.posAnte = self.getCursorPosition(evt);
      self.oldMouse.x = self.getRelativeX(self.posAnte.x);
      self.oldMouse.y = self.getRelativeY(self.posAnte.y);

      onSensitiveToMouseMovements(evt);

      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onTouchEnd);

      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      // }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchEnd(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // 
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("mousedown", onMouseDown);
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 1;

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();
      
      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton === "R") {
        window.addEventListener("mouseup", onMouseUp);

        self.clickPosForZoom = (self.getCursorPosition(evt)).y;
        self.clickPosForZoomNew = self.clickPosForZoom;

        // if fixed add a zoom manager
        if (!self.fixed) {
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom);
        }
      }

      else if (self.whichButton == "L") {
        self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = self.getCursorPosition(evt);
        self.oldMouse.x = self.getRelativeX(self.posAnte.x);
        self.oldMouse.y = self.getRelativeY(self.posAnte.y);

        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      if (self.whichButton === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);

        // show the external space
        if (self.clickPosForZoom == self.clickPosForZoomNew) {
          self.parent.externalSpace.show();
        }
      }

      window.removeEventListener("mousemove", onMouseMove, false);
      window.removeEventListener("mouseup", onMouseUp, false);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);
      self.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);

      self.parent.update();
    }
    
    /**
     *
     * @param {Event} evt 
     * @private
     */
    function onMouseMoveZoom(evt) {
      evt.preventDefault();

      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      self.evaluator.setVariable(self.scaleStr, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));

      self.parent.update();
    }
    
    this.disp = {x: 0, y: 0};

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
      if ((!self.fixed) && (self.click)) {

        dispX = parseInt((self.oldMouse.x - self.mouse_x)*100);
        dispY = parseInt((self.oldMouse.y - self.mouse_y)*100);

        if ((dispX !== self.disp.x) || (dispY !== self.disp.y)) {
          self.alpha = descartesJS.degToRad( self.evaluator.getVariable(self.rotZStr));
          self.beta  = descartesJS.degToRad(-self.evaluator.getVariable(self.rotYStr));

          self.alpha = MathRound( descartesJS.radToDeg(self.alpha) - dispX );
          self.beta  = MathRound( descartesJS.radToDeg(self.beta)  - dispY );

          // set the value to the rotation variables
          self.evaluator.setVariable(self.rotZStr, self.alpha);
          self.evaluator.setVariable(self.rotYStr, -self.beta);

          self.disp.x = dispX;
          self.disp.y = dispY;

          self.oldMouse.x = self.getRelativeX(self.posAnte.x);
          self.oldMouse.y = self.getRelativeY(self.posAnte.y);
        }

        onSensitiveToMouseMovements(evt);

        evt.preventDefault();
      }
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes aplication space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceAP = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    // array for the parent public variables
    this.importarVars = null;
    // array for the own public variables
    this.exportarVars = null;

    evaluator = parent.evaluator;
    
    // if the file name is an expression
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // if the file name is a string
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    // if is not an expression or a string, then is a string without single quotes
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }

    // register which are the old open file
    this.oldFile = evaluator.evalExpression(this.file);
    
    this.initFile();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceAP, descartesJS.Space);
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.initFile = function() {
    this.firstUpdate = true;
    
    var response;

    if (this.oldFile) {

      // if the content is embedded in the webpage
      var spaceElement = document.getElementById(this.oldFile);
      if ((spaceElement) && (spaceElement.type == "descartes/spaceApFile")) {
        response = spaceElement.text;
      }
      
      else {
        response = descartesJS.openExternalFile(this.oldFile);
      }
      
      if (response != null) {
        response = response.split("\n");
      }
    }
    
    // if the file is readed and have an applet label, then init the creation
    if ( (response) && (response.toString().match(/<applet/gi)) ) {
      // find the Descartes applet content
      var appletContent = "";
      var initApplet = false;
      for (var i=0, l=response.length; i<l; i++) {
        if ( response[i].match("<applet") ) {
          initApplet = true;
        }
        
        if (initApplet) {
          appletContent += response[i];
        }
        
        if ( response[i].match("</applet") ) {
          break;
        }
      }
      
      var myApplet = document.createElement("div");
      myApplet.innerHTML = appletContent;
      myApplet.firstChild.setAttribute("width", this.w);
      myApplet.firstChild.setAttribute("height", this.h);
      
      var oldContainer = (this.descApp) ? this.descApp.container : null;
      
      this.descApp = new descartesJS.DescartesApp(myApplet.firstChild);
      this.descApp.container.setAttribute("class", "DescartesAppContainer");
      this.descApp.container.setAttribute("style", "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
      
      // add the new space
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      // for every space find his offset
      var tmpSpaces = this.descApp.spaces;
      for (var i=0, l=tmpSpaces.length; i<l; i++) {
        tmpSpaces[i].findOffset();
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
      var self = this;
      this.descApp.update = function() {
        this.updateAuxiliaries();
        this.updateEvents();
        this.updateControls();
        this.updateSpaces();
        
        self.exportar();
      }      
    }
    // if cant read the file then create an empty container that has the background color and the background image
    else {
      var oldContainer = (this.descApp) ? this.descApp.container : null;
      
      this.descApp = {};
      this.descApp.container = document.createElement("div");
      this.descApp.container.setAttribute("class", "DescartesAppContainer");

      // style container
      var styleString = "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";";
      
      if (this.image) {
        if (this.bg_display == "topleft") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat;";
        } 
        else if (this.bg_display == "stretch") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-size: 100% 100%;";
        } 
        else if (this.bg_display == "patch") {
          styleString += "background-image: url(" + this.imageSrc + ");";
        }
        else if (this.bg_display == "center") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-position: center center;";
        }
      }
      
      this.descApp.container.setAttribute("style", styleString);
      
      // add the container to the principal container
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    }
  }
  
  /**
   * Update the space
   */
  descartesJS.SpaceAP.prototype.update = function() {
    var tmpFile = this.evaluator.evalExpression(this.file);
    if (this.oldFile != tmpFile) {
      this.oldFile = tmpFile;
      this.initFile();
    }
    else {
      var changeX = (this.x != this.evaluator.evalExpression(this.xExpr));
      var changeY = (this.y != (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight));

      this.x = (changeX) ? this.evaluator.evalExpression(this.xExpr) : this.x;
      this.y = (changeY) ? (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight) : this.y;

      // some property of the space change then change the container properties
      if (changeX) {
        this.descApp.container.style.left = this.x + "px";
      }
      if (changeY) {
        this.descApp.container.style.top = this.y + "px";
      }
      if ((changeX) || (changeY)) {
        var tmpSpaces = this.descApp.spaces;
        for (var i=0, l=tmpSpaces.length; i<l; i++) {
          tmpSpaces[i].findOffset();
        }
      }

      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // find the external variables
      if (this.firstUpdate) {
        this.firstUpdate = false;

        // if the array to store the variables is not initialized
        if (this.importarVars == null) {
          this.importarVars = [];
          for (var propName in this.evaluator.variables) {
            // check only the own properties
            if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
              this.importarVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
            }
          }
        } 
      }

      // import the variables if needed
      this.importar();
    }
  }

  /**
   * 
   */
  descartesJS.SpaceAP.prototype.importar = function() {
    var tmpEval;
    var updateThis = false;
    for (var i=0, l=this.importarVars.length; i<l; i++) {
      tmpEval = this.evaluator.getVariable(this.importarVars[i].varName)
      if (tmpEval != this.importarVars[i].value) {
        this.importarVars[i].value = tmpEval;
        this.descApp.evaluator.setVariable(this.importarVars[i].varName, this.importarVars[i].value);
        updateThis = true;
      }
    }

    if (updateThis) {
      this.descApp.update();
    }
  }
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.exportar = function() {
    
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var changeX;
  var changeY;
  var file;

  /**
   * Descartes IFrame space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceHTML_IFrame = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    var evaluator = this.parent.evaluator;

    // PATCH
    // if the web browser is firefox then a problem ocurrs with a none visible iframe
    var isFirefox = window.navigator.userAgent.toLowerCase().match(/firefox/);
    // PATCH

    this.file = (this.file) ? this.file.trim() : "";

    // if the file name is an expression
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // if the file name is a string
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    // if is not an expression or a string, then is a string without single quotes
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }
    
    // register which are the old open file
    this.oldFile = evaluator.evalExpression(this.file);    
    
    this.MyIFrame = document.createElement("iframe");
    this.MyIFrame.setAttribute("src", this.oldFile);
    this.MyIFrame.setAttribute("id", this.id);
    this.MyIFrame.setAttribute("marginheight", 0);
    this.MyIFrame.setAttribute("marginwidth", 0);
    this.MyIFrame.setAttribute("frameborder", 0);
    this.MyIFrame.setAttribute("scrolling", "auto");
    // this.MyIFrame.setAttribute("style", "overflow: hidden; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    // this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");

    this.MyIFrame.setAttribute("style", "position: static; left: 0px; top: 0px;");

console.log()

    this.container = document.createElement("div");
    // this.container.setAttribute("style", "-webkit-overflow-scrolling: touch; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    if (descartesJS.isIOS) {
      this.container.setAttribute("style", "overflow: scroll; -webkit-overflow-scrolling: touch; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    }
    else {
      this.container.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";"); 
    }
    
    this.container.appendChild(this.MyIFrame);

    // this.parent.container.insertBefore(this.MyIFrame, this.parent.loader);
    this.parent.container.insertBefore(this.container, this.parent.loader);

    // register the comunication functions
    var self = this;

    this.MyIFrame.onload = function(evt) {
      var iframe = this;

      // set a value to a variable
      var iframeSet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "set", name: varName, value: value }, "*");
      }      
      self.evaluator.setFunction(self.id + ".set", iframeSet);

      // update the scene
      var iframeUpdate = function() {
        iframe.contentWindow.postMessage({ type: "update" }, "*");
      }      
      self.evaluator.setFunction(self.id + ".update", iframeUpdate);
      
      // exec a funcion of the scene
      var iframeExec = function(functionName, functionParameters) {
        iframe.contentWindow.postMessage({ type: "exec", name: functionName, value: functionParameters }, "*");
      }
      self.evaluator.setFunction(self.id + ".exec", iframeExec);
    }

    this.update = this.iframeUpdate;

    // a scroll variable to determine if the scroll is show or not
    this.evaluator.setVariable(this.id + "._scroll", 0);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceHTML_IFrame, descartesJS.Space);
  
  /**
   * Init the space
   */
  descartesJS.SpaceHTML_IFrame.prototype.init = function() {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the iframe if has some regions
    if (self.MyIFrame) {
      self.MyIFrame.style.width  = self.w + "px";
      self.MyIFrame.style.height = self.h + "px";
      self.MyIFrame.style.left   = self.x + "px";
      self.MyIFrame.style.top    = self.y + "px";
    }

  }

  /**
   * Update the space
   */
  descartesJS.SpaceHTML_IFrame.prototype.iframeUpdate = function(firstTime) {
    evaluator = this.evaluator;

    this.drawIfValue = evaluator.evalExpression(this.drawif) > 0;

    if (this.drawif) {

      this.MyIFrame.style.display = (this.drawIfValue)? "block" : "none";

      if (firstTime) {
        this.x = Math.Infinity;
        this.y = Math.Infinity;
      }      
      changeX = (this.x !== (evaluator.evalExpression(this.xExpr) + this.displaceRegionWest));
      changeY = (this.y !== (evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth));
      this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
      this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;

      // if the position change
      if ((changeX) || (changeY)) {
        this.MyIFrame.style.left = this.x + "px";
        this.MyIFrame.style.top = this.y + "px";
      }

      file = evaluator.evalExpression(this.file);
      if (file !== this.oldFile) {
        this.oldFile = file;
        this.MyIFrame.setAttribute("src", file);
      }
     
      this.scrollVar = evaluator.getVariable(this.id + "._scroll");
      
      if (this.scrollVar == 1) {
        this.MyIFrame.setAttribute("scrolling", "yes");
        this.MyIFrame.style.overflow = "";
      }
      else if (this.scrollVar == -1) {
        this.MyIFrame.setAttribute("scrolling", "no");
        this.MyIFrame.style.overflow = "hidden";
      }
      else {
        this.MyIFrame.setAttribute("scrolling", "auto");
        this.MyIFrame.style.overflow = "";
      }
    }

  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var scale;

  /**
   * Descartes loader
   * @constructor 
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesLoader = function(descartesApp) {
    this.children = descartesApp.children;
    this.lessonParser = descartesApp.lessonParser;
    this.images = descartesApp.images;
    this.images.length = descartesApp.images.length;
    this.audios = descartesApp.audios;
    this.audios.length = descartesApp.audios.length;
    this.arquimedes = descartesApp.arquimedes;
    this.descartesApp = descartesApp;

    var imageURL = (descartesApp.image_loader) ? descartesApp.image_loader : drawDescartesLogo(descartesApp.loader.width, descartesApp.loader.height);

    this.imageLoader = document.createElement("div");
    this.imageLoader.width = descartesApp.width;
    this.imageLoader.height = descartesApp.height;
    this.imageLoader.setAttribute("class", "DescartesLoaderImage")
    this.imageLoader.setAttribute("style", "background-image: url(" + imageURL + "); width: " + descartesApp.width + "px; height: " + descartesApp.height + "px;");
    descartesApp.loader.appendChild(this.imageLoader);
    
    this.loaderBar = document.createElement("canvas");
    this.loaderBar.width = descartesApp.width;
    this.loaderBar.height = descartesApp.height;
    this.loaderBar.setAttribute("class", "DescartesLoaderBar");
    this.loaderBar.setAttribute("style", "width: " + descartesApp.width + "px; height:" + descartesApp.height + "px;");
    this.loaderBar.ctx = this.loaderBar.getContext("2d");

    descartesApp.loader.appendChild(this.loaderBar);
    
    // this.barWidth = Math.floor(descartesApp.loader.width/10);
    this.barWidth = Math.floor(80);
    this.barHeight = Math.floor(descartesApp.loader.height/70);
    
    var self = this;
    this.timer = setInterval(function() { self.drawLoaderBar(self.loaderBar.ctx, descartesApp.width, descartesApp.height); }, 10);

    descartesApp.firstRun = false;

    this.initPreloader();
  }

  /**
   * Init the preload of images and audios
   */
  descartesJS.DescartesLoader.prototype.initPreloader = function() {
    var children = this.children;
    var images = this.images;
    var audios = this.audios;
    var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg)/gi;
    var regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi;
    // var regExpVector = /vector|array|bektore|vecteur|matriz/g;
    // var regExpFile = /archivo|file|fitxer|artxibo|fichier|arquivo/g;

    // if arquimedes then add the license image
    if (this.arquimedes) {
      var licenceFile = "lib/DescartesCCLicense.png";
      images[licenceFile] = descartesJS.getCreativeCommonsLicenseImage();
      images[licenceFile].addEventListener('load', function() { this.ready = 1; });
      images[licenceFile].addEventListener('error', function() { this.errorload = 1; });
    }

    var imageFilename;
    var imageTmp;
    var audioFilename;
    var vec;
    var i, j, l, il, al;
    // check all children in the applet
    for (i=0, l=children.length; i<l; i++) {
      if (children[i].name === "rtf") {
        continue;
      }

      // macro patch
      if (children[i].value.match(/'macro'|'makro'/g)) {
        var filename = "";
        var response;

        var values = this.lessonParser.split(children[i].value);
        for (var v_i=0, v_l=values.length; v_i<v_l; v_i++) {
          if (babel[values[v_i][0]] === "expresion") {
            filename = values[v_i][1];
          }
        }

        if (filename) {
          // the macro is embeded in the webpage
          var macroElement = document.getElementById(filename);

          if ((macroElement) && (macroElement.type == "descartes/macro")) {
            response = macroElement.text;
          }

          // the macro is in an external file
          else {
            response = descartesJS.openExternalFile(filename);
            
            // verify the content is a Descartes macro
            if ( (response) && (!response.match(/tipo_de_macro/g)) ) {
              response = null;
            }
          }
        }

        if (response) {
          imageFilename = response.match(regExpImage);

          if (imageFilename) {
            for (var j, il=imageFilename.length; j<il; j++) {
              imageTmp = imageFilename[j];

              // if the filename is not VACIO.GIF or vacio.gif
              if (!(imageTmp.toLowerCase().match(/vacio.gif$/)) && ((imageTmp.substring(0, imageTmp.length-4)) != "") ) {
                images[imageTmp] = new Image();
                images[imageTmp].addEventListener('load', function() { this.ready = 1; });
                images[imageTmp].addEventListener('error', function() { this.errorload = 1; });
                images[imageTmp].src = imageTmp;
              }
            }
          }
        }
      }
      // macro patch

      // check if the children has an image filename
      imageFilename = (children[i].value).match(regExpImage);

      // if imageFilename has a match then add the images
      if (imageFilename) {
        for (j=0, il=imageFilename.length; j<il; j++) {
          imageTmp = imageFilename[j];

          // if the filename is not VACIO.GIF or vacio.gif
          if (!(imageTmp.toLowerCase().match(/vacio.gif$/)) && ((imageTmp.substring(0, imageTmp.length-4)) != "") ) {
            images[imageTmp] = new Image();
            images[imageTmp].addEventListener('load', function() { this.ready = 1; });
            images[imageTmp].addEventListener('error', function() { this.errorload = 1; });
            images[imageTmp].src = imageTmp;
          }
        }
      }

      // check if the children has an audio filename
      audioFilename = (children[i].value).match(regExpAudio);
     
      // if audioFilename has a match then add the audios
      if (audioFilename) {
        for (j=0, al=audioFilename.length; j<al; j++) {
          this.initAudio(audioFilename[j]);
        }
      }

      // // check if the children has a vector that loads a file
      // vec = (children[i].value).match(regExpVector) && (children[i].value).match(regExpFile);
      //
      // // if vec has a match then create the vector for the preload of images. Note: this vectors is created 2 times
      // if (vec) {
      //   this.lessonParser.parseAuxiliar(children[i].value);
      // }      
    }
        
    // count how many images
    for (var propName in images) {
      if (images.hasOwnProperty(propName)) {
        this.images.length++;
      }
    }

    // count how many audios
    for (var propName in audios) {
      if ((audios).hasOwnProperty(propName)) {
        this.audios.length++;
      }
    }

    var self = this;
    var total = this.images.length + this.audios.length;
    
    /**
     * Function that checks if all the media are loaded
     */
    var checkLoader = function() {
      // contador para determinar cuantas imagenes se han cargado
      self.readys = 0;
      
      // how many images are loaded
      for (var propName in images) {
        if (images.hasOwnProperty(propName)) {
          if ( (images[propName].ready) || (images[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // how many audios are loaded
      for (var propName in self.audios) {
        if (audios.hasOwnProperty(propName)) {
          if ( (audios[propName].ready) || (audios[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // if the number of count elements is diferente to the total then execute again checLoader
      if (self.readys != total) {
        setTimeout(checkLoader, 30);
      }
      // if the number of count elements is equal to the total then clear the timer and init the build of the app
      else {
        clearTimeout(self.timer);
        self.descartesApp.initBuildApp();
      }
    }

    // first execution of checkLoader
    checkLoader();
  }

  /**
   * Add a new audio to the array of audios
   * @param {String} file the filename of the new audio
   */
  descartesJS.DescartesLoader.prototype.initAudio = function(file) {
    // var audios = this.audios;

    // var lastIndexOfDot = file.lastIndexOf(".");
    // lastIndexOfDot = (lastIndexOfDot === -1) ? file.lenght : lastIndexOfDot;
    // var filename = file.substring(0, lastIndexOfDot);

    // var mediaElement = new Audio();
    // mediaElement.setAttribute("preload", "auto");

    // var onCanPlayThrough = function() {
    //   this.ready = 1;
    // }
    
    // var onError = function() {
    //   console.log("El archivo '" + file + "' no puede ser reproducido");
    //   this.errorload = 1;
    // }

    // mediaElement.addEventListener('canplaythrough', onCanPlayThrough);
    // mediaElement.addEventListener('load', onCanPlayThrough);
    // mediaElement.addEventListener('error', onError);

    // var source;
    // // mp3
    // if (mediaElement.canPlayType("audio/mpeg")) {
    //   source = document.createElement("source");
    //   source.setAttribute("src", filename + ".mp3");
    //   source.setAttribute("type", "audio/mpeg");
    //   mediaElement.appendChild(source);
    // }
    // // ogg, oga
    // if (mediaElement.canPlayType("audio/ogg")) {
    //   source = document.createElement("source");
    //   source.setAttribute("src", filename + ".ogg");
    //   source.setAttribute("type", "audio/ogg");
    //   mediaElement.appendChild(source);

    //   source = document.createElement("source");
    //   source.setAttribute("src", filename + ".oga");
    //   source.setAttribute("type", "audio/ogg");
    //   mediaElement.appendChild(source);
    // }
    // // wav
    // if (mediaElement.canPlayType("audio/wav")) {
    //   source = document.createElement("source");
    //   source.setAttribute("src", filename + ".wav");
    //   source.setAttribute("type", "audio/wav");
    //   mediaElement.appendChild(source);
    // }

    // mediaElement.load();
    // mediaElement.play();
    // mediaElement.pause();

    // audios[file] = mediaElement;


    var audios = this.audios;
    
    audios[file] = new Audio(file);
    audios[file].filename = file;

    var onCanPlayThrough = function() {
      this.ready = 1;
    }
    
    var onError = function() {
      if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
        audios[file] = new Audio(this.filename.replace("mp3", "ogg"));
        audios[file].filename = this.filename.replace("mp3", "ogg");
        audios[file].addEventListener('canplaythrough', onCanPlayThrough);
        audios[file].addEventListener('load', onCanPlayThrough);
        audios[file].addEventListener('error', onError);
        audios[file].load();
      } 
      else {
        console.log("El archivo '" + file + "' no puede ser reproducido");
        this.errorload = 1;
      }
    }
    audios[file].addEventListener('canplaythrough', onCanPlayThrough);
    audios[file].addEventListener('load', onCanPlayThrough);
    audios[file].addEventListener('error', onError);

    if (descartesJS.hasTouchSupport) {
      audios[file].load();
      audios[file].play();
      // setTimeout( function(){ console.log("detenido"); audios[file].pause(); }, 10);
      audios[file].ready = 1;
    } else {
      audios[file].load();
    }
  }

  var barWidth;
  var barHeight;
  var howMany;
  var sep;
  /**
   * Draw the loader bar
   * @param {CanvasContextRendering2D} ctx the context render where to draw
   * @param {Number} w the width of the canvas
   * @param {Number} h the height of the canvas
   */
  descartesJS.DescartesLoader.prototype.drawLoaderBar = function(ctx, w, h) {
    // // scale = 2;
    // if (w < h) {
    //   scale = (w/(120*3));
    // }
    // else {
    //   scale = (h/(65*3));
    // }
    barWidth = this.barWidth;
    barHeight = this.barHeight;
    howMany = this.images.length + this.audios.length;
    sep = (2*(barWidth-2))/howMany;
    
    ctx.translate(w/2, (h-(65*scale))/2 +90*scale);
    // ctx.translate(w/2, h-25*scale);
    ctx.scale(scale, scale);

    ctx.strokeRect(-barWidth, -barHeight, 2*barWidth, barHeight);
    
    ctx.fillStyle = "gray";
    ctx.fillRect(-barWidth+2, -barHeight+2, 2*(barWidth-2), barHeight-4);
    
    ctx.fillStyle = "#1f375d";
    ctx.fillRect(-barWidth+2, -barHeight+2, this.readys*sep, barHeight-4);

    // reset the transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }  

  /**
   * Draw the descartesJS logo
   * @param {Number} w space width
   * @param {Number} h space height
   * @return {Image} return the image corresponding to the logo
   */
  var drawDescartesLogo = function(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");

    ctx.save();
    
    ctx.strokeStyle = "#1f375d";
    ctx.fillStyle = "#1f375d";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    ctx.beginPath();
    // the original image measure 120 x 65 pixels
    // scale = 3;
    if (w < h) {
      scale = (w/(120*3));
    }
    else {
      scale = (h/(65*3));
    }
    scale = (scale > 2.5) ? 2.5 : scale;

    ctx.translate((w-(120*scale))/2, (h-(65*scale))/2);
    ctx.scale(scale, scale);
    
    ctx.moveTo(3,25);
    ctx.lineTo(3,1);
    ctx.lineTo(21,1);
    ctx.bezierCurveTo(33,1, 41,15, 41,25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1,63); ctx.lineTo(1,64);

    ctx.moveTo(5,62); ctx.lineTo(5,64);

    ctx.moveTo(9,61); ctx.lineTo(9,64);

    ctx.moveTo(13,60); ctx.lineTo(13,64);

    ctx.moveTo(17,58); ctx.lineTo(17,64);

    ctx.moveTo(21,56); ctx.lineTo(21,64);

    ctx.moveTo(25,53); ctx.lineTo(25,64);

    ctx.moveTo(29,50); ctx.lineTo(29,64);

    ctx.moveTo(33,46); ctx.lineTo(33,64);

    ctx.moveTo(37,41); ctx.lineTo(37,64);

    ctx.moveTo(41,32); ctx.lineTo(41,64);
    ctx.stroke();

    ctx.font = "20px Arial, Helvetica, 'Droid Sans', Sans-serif";
    ctx.fillText("escartes", 45, 33);
    ctx.fillText("JS", 98, 64);
    ctx.restore();

    return canvas.toDataURL();
  }  
    
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                 "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                 "                                       Los contenidos de esta unidad didáctica interactiva están bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                 "                                       La unidad didáctica fue creada con Arquímedes, que es un producto de código abierto, {\\*\\hyperlink Creditos|http://arquimedes.matem.unam.mx/Descartes5/creditos/conCCL.html}\\par "+
                 "}";

  /**
   * Descartes application interprete with javascript
   * @constructor 
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesApp = function(applet) {

    /**
     * applet code
     * @type {<applet>}
     * @private
     */
    this.applet = applet;
    
    // this.externalVariables = {};

    /**
     * container of the java applet
     * @type {<HTMLelement>}
     * @private 
     */
    this.parentContainer = applet.parentNode;

    /**
     * width of the applet
     * @type {Number}
     * @private 
     */
    this.width = parseFloat( applet.getAttribute("width") );

    /**
     * height of the applet
     * @type {Number}
     * @private 
     */
    this.height = parseFloat( applet.getAttribute("height") );

    /**
     * decimal symbol
     * @type {String}
     * @private
     */
    this.decimal_symbol = ".";
    this.decimal_symbol_regexp = new RegExp("\\" + this.decimal_symbol, "g");

    /**
     * parameters of the applet
     * type {Array.<param>}
     * @private
     */
    this.children = applet.getElementsByTagName("param");

    descartesJS.creativeCommonsLicense = true;
    for (var i=0,l=this.children.length; i<l; i++) {
      if (this.children[i].name == "CreativeCommonsLicense") {
        descartesJS.creativeCommonsLicense = (this.children[i].value == "no") ? false : true;
      }
    }

    /**
     * string that determines what kind of descartes lesson is
     * @type {String}
     * @private
     */
    this.code = applet.getAttribute("code");

    /**
     * 
     */
    this.saveState = [];
    
    /**
     * images used in the applet
     * type {Array.<Image>}
     * @private
     */
    this.images = {};
    
    /**
     * number of images used in the applet
     * type {Number}
     * @private 
     */
    this.images.length = -1;
    
    /**
     * audios used in the applet
     * type {Array.<Audio>}
     * @private
     */
    this.audios = {};
    
    /**
     * number of audios used in the applet
     * type {Number}
     * @private 
     */
    this.audios.length = -1;
    
    /**
     * variable to record if the applet is interpreted for the first time, used to show the loader screen
     * type {Boolean}
     * @private
     */
    this.firstRun = true;

    // init the interpretation
    this.init()
  }

  /**
   * Init the variables needed for parsing and create the descartes lesson
   */
  descartesJS.DescartesApp.prototype.init = function() {
    /**
     * evaluator and parser of expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * parser of elements in the lesson
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * variable that tell us whether the lesson is an arquimedes lesson
     * type {Boolean}
     * @private
     */
    this.arquimedes = !!this.code.match("descinst.DescartesWeb2_0.class", "i") || 
                      !!this.code.match("Arquimedes", "i") ||
                      !!this.code.match("Discurso", "i");

    // licences for arquimedes
    this.licenseA = (descartesJS.creativeCommonsLicense) ? licenseA : "";

    var children = this.children;
    var children_i;
    var heightRTF = 0;
    var heightButtons = 0;
    var licenceHeight = (descartesJS.creativeCommonsLicense) ? 90 : 0;

    for(var i=0, l=children.length; i<l; i++) {
      children_i = children[i];
    
      // get the rtf height
      if (children_i.name == "rtf_height") {
        heightRTF = parseInt(children_i.value);
      }

      // get the buttons height
      if (babel[children_i.name] == "Buttons") {
        this.buttonsConfig = this.lessonParser.parseButtonsConfig(children_i.value);
        heightButtons = this.buttonsConfig.height;
      }

      // get image source for the loader
      if (children_i.name == "image_loader") {
        this.image_loader = children_i.value;
      }
    }

    // configure an arquimedes lesson
    if (this.arquimedes) {
      // modify the lesson height if find rtf height
      if (heightRTF) {
        this.height =  heightRTF + heightButtons + licenceHeight; // 70 is the height of the licence image
      }
    }

    /**
     * array to store the lesson spaces
     * type {Array.<Space>}
     * @private
     */
    this.spaces = [];

    /**
     * external region
     * type {Space}
     * @private
     */
    if (this.externalSpace) {
      document.body.removeChild(this.externalSpace.container);
    }
    this.externalSpace = new descartesJS.SpaceExternal(this);

    /**
     * north region
     * type {Space}
     * @private
     */
    this.northSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * south region
     * type {Space}
     * @private
     */
    this.southSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * east region
     * type {Space}
     * @private
     */
    this.eastSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * west region
     * type {Space}
     * @private
     */
    this.westSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * special region to put the credits, config, init and clean buttons
     * type {Space}
     * @private
     */
    this.specialSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * region to show text fields for editable content
     * type {Space}
     * @private
     */
    this.editableRegion = {container: document.createElement("div"), textFields: []};
        
    /**
     * array to store the lesson controls 
     * type {Array.<Control>}
     * @private
     */
    this.controls = [];
   
    /**
     * array to store the lesson auxiliaries
     * type {Array.<Auxiliary>}
     * @private
     */
    this.auxiliaries = [];
   
    /**
     * array to store the lesson events
     * type {Array.<Event>}
     * @private
     */
    this.events = [];

    // variables used for the htmliframe get function
    this.cacheVars = {};
    this.getVarsNames = {};
   
    /**
     * the z index for order the graphics
     * @type {Number}
     * @private 
     */
    this.zIndex = 0;

    /**
     * tabulation index for the text fields
     * @type {Number}
     * @private 
     */
    this.tabindex = 0;
    
    /**
     * pleca height
     * @type {Number}
     * @private
     */
    this.plecaHeight = 0;

    /**
     * number of iframes in the lesson
     * @type {Number}
     * @private
     */
    this.numberOfIframes = 0;
    
    // code needed for reinit the lesson
    if (this.container != undefined) {
      this.parentContainer.removeChild(this.container);
    }

    this.container = document.createElement("div");
    this.loader = document.createElement("div");

    // append the lesson container to the java applet container
    this.parentContainer.appendChild(this.container);
    this.container.width = this.width;
    this.container.height = this.height;
    this.container.setAttribute("class", "DescartesAppContainer");
    this.container.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px;");
    
    // add the loader
    this.container.appendChild(this.loader);
    this.loader.width = this.width;
    this.loader.height = this.height;
    this.loader.setAttribute("class", "DescartesLoader");
    this.loader.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px; z-index:1000;");

    // if is the first time in execute the interpretation
    if (this.firstRun) {
      this.descartesLoader = new descartesJS.DescartesLoader(this);
    } else {
      this.initBuildApp();
    }
  }
  
  /**
   * Init the parse and creation of objects for the descartes lesson
   */
  descartesJS.DescartesApp.prototype.initBuildApp = function() {
    var children = this.children;
    var lessonParser = this.lessonParser;
    
    var tmpSpaces = [];
    var tmpControls = [];
    var tmpAuxiliaries = [];
    var tmpGraphics = [];
    var tmp3DGraphics = [];
    var tmpAnimations = [];
    
    var children_i;

    // check all the children
    for(var i=0, l=children.length; i<l; i++) {
      children_i = children[i];
      
      // find the parameters for the pleca
      if (children_i.name == "pleca") {
        var divPleca = lessonParser.parsePleca(children_i.value, this.width);
        this.container.insertBefore(divPleca, this.loader);
        this.plecaHeight = (divPleca.imageHeight) ? divPleca.imageHeight : divPleca.offsetHeight;
        continue;
      }
      
      // find the parameters for the exterior space
      if (babel[children_i.name] == "Buttons") {
        this.buttonsConfig = lessonParser.parseButtonsConfig(children_i.value);
        continue;
      }
      
      // find the decimal symbol
      if (babel[children_i.name] == "decimal_symbol") {
        this.decimal_symbol = children_i.value;
        this.decimal_symbol_regexp = new RegExp("\\" + this.decimal_symbol, "g");
        continue;
      }
      
      // find the descartes version
      if (babel[children_i.name] == "version") {
        this.version = parseInt(children_i.value);
        continue;
      }

      // find the language of the lesson, needed for arquimedes
      if (babel[children_i.name] == "language") {
        this.language = children_i.value;
        continue;
      }      

      // // find if the applet is enable for the interaction
      // if (babel[children_i.getAttribute("enable")] == "enable") {
      //   this.enable = babel[children_i.getAttribute("enable")];
      //   continue;
      // }
      
      // ##ARQUIMEDES## //
      // find the rtf text of an arquimedes lesson
      if (children_i.name == "rtf") {
        var posX = (this.width-780)/2;
        var posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);

        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10,20]' background='yes' text='" + children_i.value.replace(/'/g, "&squot;") + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[" + posX + "," + (posY-25) + "]' background='yes' text='" + this.licenseA + "'");
        if (descartesJS.creativeCommonsLicense) {
          tmpGraphics.push("space='descartesJS_scenario' type='image' expresion='[" + (posX+15) + "," + posY + "]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'");
        }

        continue;
      }
      // ##ARQUIMEDES## //

      // if the name of the children start with "E" then is a space
      if (children_i.name.charAt(0) == "E") {
        if (children_i.value.match(/'HTMLIFrame'/)) {
          this.numberOfIframes++;
        }
        
        tmpSpaces.push(children_i.value);
        continue;
      }
      
      // if the name of the children start with "C_" then is a control
      if ((children_i.name.charAt(0) == "C") && (children_i.name.charAt(1) == "_")) {
        tmpControls.push(children_i.value);
        continue;
      }

      // if the name of the children start with "A_" then is an auxiliary 
      if ((children_i.name.charAt(0) == "A") && (children_i.name.charAt(1) == "_")) {
        tmpAuxiliaries.push(children_i.value);
        continue;
      }

      // if the name of the children start with "G" then is a graphic
      if (children_i.name.charAt(0) == "G") {
        tmpGraphics.push(children_i.value);
        continue;
      }

      // if the name of the children start with "S" then is a tridimensional graphic
      if (children_i.name.charAt(0) == "S") {
        tmp3DGraphics.push(children_i.value);
        continue;
      }
      
      // if the name of the children is "Animation" then is an animation
      if (babel[children_i.name] == "Animation") {
        tmpAnimations.push(children_i.value);
        continue;
      }
    }

    // the scenario region is only visible in arquimedes lessons
    this.scenarioRegion = {container: document.createElement("div"), scroll: 0};
    this.scenarioRegion.container.setAttribute("id", "descartesJS_Scenario_Region");
    this.scenarioRegion.scenarioSpace = this.lessonParser.parseSpace("tipo='R2' id='descartesJS_scenario' fondo='blanco' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='" + this.width + "' alto='" + this.height + "'");
    this.scenarioRegion.container.appendChild(this.scenarioRegion.scenarioSpace.container);

    // ##ARQUIMEDES## //
    // if arquimedes then add the container of the scenario region
    if (this.arquimedes) {
      this.container.appendChild(this.scenarioRegion.container);
      this.spaces.push(this.scenarioRegion.scenarioSpace);
    }
    // ##ARQUIMEDES## //    

    // init the spaces
    var tmpSpace;
    for (var i=0, l=tmpSpaces.length; i<l; i++) {
      tmpSpace = lessonParser.parseSpace(tmpSpaces[i]);

      // ##ARQUIMEDES## //
      if (this.arquimedes) {
        this.scenarioRegion.container.appendChild(tmpSpace.container);
      }
      // ##ARQUIMEDES## //

      // create and add a space to the list of spaces
      this.spaces.push(tmpSpace);

      // increase the z index for the next space is placed on the above space
      this.zIndex++;
    }

    // init the graphics
    var tmpGraph;
    for (var i=0, l=tmpGraphics.length; i<l; i++) {
      tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
      if (tmpGraph) {
        if (tmpGraph.visible) {
          this.editableRegionVisible = true;
        }

        tmpGraph.space.addGraph(tmpGraph);
      }
    }
    
    // init the tridimensional graphics
    var tmp3DGraph;
    for (var i=0, l=tmp3DGraphics.length; i<l; i++) {
      tmpGraph = lessonParser.parse3DGraphic(tmp3DGraphics[i]);
      if (tmpGraph) {
        tmpGraph.space.addGraph(tmpGraph);
      }
    }

    // init the controls
    for (var i=0, l=tmpControls.length; i<l; i++) {
      this.controls.push( lessonParser.parseControl(tmpControls[i]) );
    }
    
    // init the auxiliary
    for (var i=0, l=tmpAuxiliaries.length; i<l; i++) {
      lessonParser.parseAuxiliar(tmpAuxiliaries[i]);
    }

    // init the animation
    for (var i=0, l=tmpAnimations.length; i<l; i++) {
      this.animation = lessonParser.parseAnimation(tmpAnimations[i]);
    }

    // configure the regions
    this.configRegions();

    this.updateAuxiliaries();
    // beware
    this.updateAuxiliaries();
    // beware
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].init();
    }
    this.updateControls();

    this.updateSpaces(true);

    // finish the interpretation
    var self = this;
    if (this.numberOfIframes) {
      setTimeout(function() { self.finishInit(); }, 300*this.numberOfIframes);
    }
    else {
      this.finishInit();
    }

// console.log(this.auxiliaries)

  }
  
  /**
   * Finish the interpretation
   */
  descartesJS.DescartesApp.prototype.finishInit = function() {
    this.update();

    // hide the loader
    this.loader.style.display = "none";
    // this.parentContainer.style.overflow = "hidden";
    
    // // if the applet is disabled then put a div blocking the interacion
    // if (this.enable) {
    //   this.blocker = document.createElement("div");
    //   this.blocker.setAttribute("class", "blocker");
    //   this.blocker.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px");
    //   this.container.appendChild(this.blocker);
    // }

    // if the window parent is diferente from the current window, then the lesson is embedded in an iFrame
    if (window.parent !== window) {
      this.parentContainer.style.margin = "0px";
      this.parentContainer.style.padding = "0px";

      window.parent.postMessage({ type: "reportSize", href: window.location.href, width: this.width, height: this.height }, '*');
      window.parent.postMessage({ type: "ready" }, '*');

      descartesJS.onResize();
    }

    // scene open in a new window
    if (window.opener) {
      window.opener.postMessage({ type: "isResizeNeeded", href: window.location.href }, '*');
    }

    this.externalSpace.init();
  }

  /**
   * Adjust the size of the window if needed
   */
  descartesJS.DescartesApp.prototype.adjustSize = function() {
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    this.parentContainer.style.margin = "0px";
    this.parentContainer.style.padding = "0px";
    var winWidth = parseInt(this.width)+30;
    var winHeight = parseInt(this.height)+90;

    window.moveTo((parseInt(screen.width)-winWidth)/2, (parseInt(screen.height)-winHeight)/2);
    window.resizeTo(winWidth, winHeight);

    descartesJS.onResize();      
  }
  
  /**
   * Configure the regions
   */
  descartesJS.DescartesApp.prototype.configRegions = function() {
    var parser = this.evaluator.parser;
    var buttonsConfig = this.buttonsConfig;
    var principalContainer = this.container;
    
    // descartes 4
    if (this.version != 2) {
      var fontSizeDefaultButtons = "15";
      var aboutWidth = 100;
      var configWidth = 100;
      var initWidth = 100;
      var clearWidth = 100;
    }
    // descartes 2
    else {
      var fontSizeDefaultButtons = "14";
      var aboutWidth = 63;
      var configWidth = 50;
      var initWidth = 44;
      var clearWidth = 53;
    }

    var northRegionHeight = 0;
    var southRegionHeight = 0;
    var eastRegionHeight = 0;
    var westRegionHeight = 0;
    var editableRegionHeight = 0;
    var northRegionWidht = 0;
    var southRegionWidht = 0;
    var eastRegionWidth = 0;
    var westRegionWidth = 0;

    var northSpaceControls = this.northSpace.controls;
    var southSpaceControls = this.southSpace.controls;
    var eastSpaceControls = this.eastSpace.controls;
    var westSpaceControls = this.westSpace.controls;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // north region
    if ((buttonsConfig.rowsNorth > 0) || ( northSpaceControls.length > 0) || (buttonsConfig.about) || (buttonsConfig.config)) {
      if (buttonsConfig.rowsNorth <= 0) {
        northRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsNorth = 1;
      }
      // if the number of rows is diferent of zero then the height is the number of rows
      else {
        northRegionHeight = buttonsConfig.height * buttonsConfig.rowsNorth;
      }

      var container = this.northSpace.container;
      container.setAttribute("id", "descartesJS_northRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + northRegionHeight + "px; background:#c0c0c0; position:absolute; left:0px; top:0px; z-index:100;")

      principalContainer.insertBefore(container, this.loader);
      
      northRegionWidht = principalContainer.width;
      var displaceButton = 0;

      // show the credits button
      if (buttonsConfig.about) {
        displaceButton = aboutWidth;
        northRegionWidht -= displaceButton;
      }
      // show the configuration button
      if (buttonsConfig.config) {
        northRegionWidht -= configWidth;
      }
      
      var numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
      var controlWidth = northRegionWidht/numberOfControlsPerRow;
      
      // configure the controls in the region
      for (var i=0, l=northSpaceControls.length; i<l; i++) {
        northSpaceControls[i].expresion = parser.parse("(" + (displaceButton +controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        northSpaceControls[i].drawif = parser.parse("1");
        northSpaceControls[i].init();
      }
      
      // create the credits button
      if (buttonsConfig.about) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "cr\u00E9ditos";
        } 
        else if (this.language == "english") {
          text = "about";
        }
        else {
          text = "cr\u00E9ditos";
        }

        var btnAbout = new descartesJS.Button(this, {region: "north", 
                                                     name: text, 
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     expresion: parser.parse("(0, 0, " + aboutWidth + ", " + northRegionHeight + ")")
                                                    });
        btnAbout.actionExec = { execute: descartesJS.showAbout };
        btnAbout.update();
      }
      // create the configuration button
      if (buttonsConfig.config) {
        var text = "config";
        
        var btnConfig = new descartesJS.Button(this, {region: "north", 
                                                      name: text, 
                                                      font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "config",
                                                      expresion: parser.parse("(" + (northRegionWidht + aboutWidth)  + ", 0, " + configWidth + ", " + northRegionHeight + ")")
                                                     });
        btnConfig.update();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // south region
    if ((buttonsConfig.rowsSouth > 0) || (southSpaceControls.length > 0) || (buttonsConfig.init) || (buttonsConfig.clear)) {

      // if the number of rows is zero but contains controls then the height is the specified height
      if (buttonsConfig.rowsSouth <= 0) {
        southRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsSouth = 1;
      }
      // if the number of rows is diferent of zero then the height is the number of rows
      else {
        southRegionHeight = buttonsConfig.height * buttonsConfig.rowsSouth;
      }

      southRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // show the init button
      if (buttonsConfig.init) {
        displaceButton = initWidth;
        southRegionWidht -= displaceButton;
      }
      // show the clear button
      if (buttonsConfig.clear) {
        southRegionWidht -= clearWidth;
      }

      var container = this.southSpace.container;
      container.setAttribute("id", "descartesJS_southRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + southRegionHeight + "px; background:#c0c0c0; position:absolute; left: 0px; top:" + (principalContainer.height-southRegionHeight) + "px; z-index:100;")

      principalContainer.insertBefore(container, this.loader);

      var numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
      var controlWidth = southRegionWidht/numberOfControlsPerRow;
      
      // configure the controls in the region
      for (var i=0, l=southSpaceControls.length; i<l; i++) {
        southSpaceControls[i].expresion = parser.parse("(" + (displaceButton + controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        southSpaceControls[i].drawif = parser.parse("1");
        southSpaceControls[i].init();
      }
      
      // create the init button
      if (buttonsConfig.init) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "inicio";
        } 
        else if (this.language == "english") {
          text = "init";
        }
        else {
          text = "inicio";
        }

        var btnInit = new descartesJS.Button(this, {region: "south", 
                                                    name: text, 
                                                    font_size: parser.parse(fontSizeDefaultButtons), 
                                                    action: "init", 
                                                    expresion: parser.parse("(0, 0, " + initWidth + ", " + southRegionHeight + ")") 
                                                  });
        btnInit.update();
      }
      // create the clear button
      if (buttonsConfig.clear) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "limpiar";
        } 
        else if (this.language == "english") {
          text = "clear";
        }
        else {
          text = "limpiar";
        }
        
        var btnClear = new descartesJS.Button(this, {region: "south", 
                                                     name: text, 
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     action: "clear",
                                                     expresion: parser.parse("(" + (southRegionWidht + initWidth) + ", 0, " + clearWidth + ", " + southRegionHeight + ")")
                                                     });
        btnClear.update();
      }      
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // east region
    if (eastSpaceControls.length > 0) {
      eastRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      eastRegionWidth = buttonsConfig.widthEast;
      
      var container = this.eastSpace.container;
      container.setAttribute("id", "descartesJS_eastRegion");
      container.setAttribute("style", "width:" + eastRegionWidth + "px; height:" + eastRegionHeight + "px; background:#c0c0c0; position:absolute; left:" + (principalContainer.width - eastRegionWidth) + "px; top:" + northRegionHeight + "px; z-index:100;");

      principalContainer.insertBefore(container, this.loader);

      // configure the controls in the region
      for (var i=0, l=eastSpaceControls.length; i<l; i++) {
        eastSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + eastRegionWidth + "," + buttonsConfig.height +")");
        eastSpaceControls[i].drawif = parser.parse("1");
        eastSpaceControls[i].init();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // west region
    if (westSpaceControls.length > 0) {
      westRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      westRegionWidth = buttonsConfig.widthWest;
      
      var container = this.westSpace.container;
      container.setAttribute("id", "descartesJS_westRegion");
      container.setAttribute("style", "width: " + westRegionWidth + "px; height: " + westRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + northRegionHeight + "px; z-index: 100;");

      principalContainer.insertBefore(container, this.loader);

      // configure the controls in the region
      for (var i=0, l=westSpaceControls.length; i<l; i++) {
        westSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + westRegionWidth + "," + buttonsConfig.height +")");
        westSpaceControls[i].drawif = parser.parse("1");
        westSpaceControls[i].init();
      }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // editable and visible region
    if (this.editableRegionVisible) {
      editableRegionHeight = buttonsConfig.height;
      var container = this.editableRegion.container;
      container.setAttribute("id", "descartesJS_editableRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + editableRegionHeight + "px; position:absolute; left:0px; top:" + (principalContainer.height - southRegionHeight - buttonsConfig.height) + "px; z-index:100; background:#c0c0c0; overflow:hidden;");

      principalContainer.insertBefore(container, this.loader);

      var editableRegionTextFields = this.editableRegion.textFields
      var textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;

      var fontSize = descartesJS.getFieldFontSize(editableRegionHeight);
      // configure the text fields in the region
      for (var i=0, l=editableRegionTextFields.length; i<l; i++) {
        if (editableRegionTextFields[i].type == "div") {
          container.appendChild(editableRegionTextFields[i].container);

          ////////////////////////////////////////////////////////////////
          // the container
          editableRegionTextFields[i].container.setAttribute("style", "font-family: Arial, Helvetica, 'Droid Sans', Sans-serif; width: " + (textFieldsWidth-4) + "px; height: " + (editableRegionHeight) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px;")// border: 2px groove white;");

          ////////////////////////////////////////////////////////////////
          // the label
          var label = editableRegionTextFields[i].container.firstChild;
          
          label.setAttribute("style", "font-family: Arial, Helvetica, 'Droid Sans', Sans-serif; font-size: " + fontSize + "px; padding-top: 0%; background-color: #e0e4e8; position: absolute; left: 0px; top: 0px; height:" + (editableRegionHeight) + "px; text-align: center; line-height: "+ (editableRegionHeight) +"px;");
          var labelWidth = label.offsetWidth;
          label.style.width = labelWidth + "px";

          // remove the first and last character, because are initially underscores
          label.firstChild.textContent = label.firstChild.textContent.substring(3, label.firstChild.textContent.length-3);
          
          ////////////////////////////////////////////////////////////////
          // the text field
          var textfield = editableRegionTextFields[i].container.lastChild;
          // textfield.setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; width:" + (textFieldsWidth-labelWidth-8) + "px; height:" + (editableRegionHeight-9) + "px; position:absolute; left:" + (labelWidth) + "px; top:0px; border:2px groove white;");
          textfield.setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; font-size: " + fontSize + "px; width:" + (textFieldsWidth-labelWidth) + "px; height:" + (editableRegionHeight) + "px; position:absolute; left:" + (labelWidth) + "px; top:0px; border:2px groove white;");
        } 

        else {
          container.appendChild(editableRegionTextFields[i]);

          editableRegionTextFields[i].setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; font-size: " + fontSize + "px; width:" + (textFieldsWidth) + "px; height:" + (editableRegionHeight) + "px; position:absolute; left:" + ( i*textFieldsWidth ) + "px; top:0px; border:2px groove white;");
        }
      }
    }    
    
    this.displaceRegionNorth = northRegionHeight;
    this.displaceRegionWest = westRegionWidth;
    
    principalContainer.width = principalContainer.width - eastRegionWidth;
    principalContainer.height = principalContainer.height - southRegionHeight - editableRegionHeight;
    
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].init()
    }
    
  }

  /**
   * Update the applet
   */
  descartesJS.DescartesApp.prototype.update = function() {
    this.updateAuxiliaries();
    this.updateEvents();
    this.updateControls();
    this.updateSpaces();

    // send the cache vars to the htmliframes
    // this.sendCacheVars();
  }
  
  /**
   * Deactivate the graphic controls
   */
  descartesJS.DescartesApp.prototype.deactivateGraphiControls = function() {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.type == "graphic") {
        controls_i.deactivate();
      }
    }    
  }
  
  /**
   * Update the auxiliaries
   */
  descartesJS.DescartesApp.prototype.updateAuxiliaries = function() {
    for (var i=0, l=this.auxiliaries.length; i<l; i++) {
      this.auxiliaries[i].update();
    }
  }

  /**
   * Update the events
   */
  descartesJS.DescartesApp.prototype.updateEvents = function() {
    for (var i=0, l=this.events.length; i<l; i++) {
      this.events[i].update();
    }    
  }
  
  /**
   * Update the controls
   */
  descartesJS.DescartesApp.prototype.updateControls = function() {
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].update();
    }
  }

  /**
   * Update the spaces
   */
  descartesJS.DescartesApp.prototype.updateSpaces = function(firstime) {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].update(firstime);
    } 
  }
  
  /**
   * Clear the trace in the space
   */
  descartesJS.DescartesApp.prototype.clear = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].spaceChange = true;

      if (this.spaces[i].drawBackground) {
        this.spaces[i].drawBackground();
      }
    }    
  }
  
  /**
   * Play the animation
   */
  descartesJS.DescartesApp.prototype.play = function() {
    if (this.animation) {
      this.animation.play();
    }
  }
  
  /**
   * Stop the animation
   */
  descartesJS.DescartesApp.prototype.stop = function() {
    if (this.animation) {
      this.animation.stop();
    }
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.DescartesApp.prototype.reinitAnimation = function() {
    if (this.animation) {
      // this.animation.reinit();
      this.animation.play();
    }
  }

  /**
   * Stop the playing audios
   */
  descartesJS.DescartesApp.prototype.stopAudios = function() {
    // stop the animation
    this.stop()

    // stop the audios
    for (var propName in this.audios) {
      if ((this.audios).hasOwnProperty(propName)) {
        if (this.audios[propName].pause) {
          this.audios[propName].pause();
          this.audios[propName].currentTime = 0;
        }
      }
    }
  }

  /**
   * Get an image by name
   * @param {String} name the name of the image
   * @return {Image} the image with the name
   */
  descartesJS.DescartesApp.prototype.getImage = function(name) {
    var images = this.images;
    if (name) {
      // if the image exist return that image
      if (images[name]) {
        return images[name];
      }
      // if do not exist then create a new image
      else {
        images[name] = new Image();
        images[name].addEventListener('load', function() { this.ready = 1; });
        images[name].addEventListener('error', function() { this.errorload = 1; });
        images[name].src = name;

        return images[name];
      }
    }
  }
  
  /**
   * Get an audio by name
   * @param {String} name the name of the audio
   * @return {Audio} the audio with the name
   */
  descartesJS.DescartesApp.prototype.getAudio = function(name) {
    var audios = this.audios;
    if (name) {
      // if the audio exist return that audio
      if (audios[name]) {
        return audios[name];
      }
      // if do not exist then create a new audio
      else {
        var lastIndexOfDot = name.lastIndexOf(".");
        lastIndexOfDot = (lastIndexOfDot === -1) ? name.lenght : lastIndexOfDot;
        var namename = name.substring(0, lastIndexOfDot);

        // var mediaElement = new Audio();
        // mediaElement.setAttribute("preload", "auto");

        // var onCanPlayThrough = function() {
        //   this.ready = 1;
        // }
        
        // var onError = function() {
        //   console.log("El archivo '" + name + "' no puede ser reproducido");
        //   this.errorload = 1;
        // }

        // mediaElement.addEventListener('canplaythrough', onCanPlayThrough);
        // mediaElement.addEventListener('load', onCanPlayThrough);
        // mediaElement.addEventListener('error', onError);

        // var source;
        // // mp3
        // if (mediaElement.canPlayType("audio/mpeg")) {
        //   source = document.createElement("source");
        //   source.setAttribute("src", filename + ".mp3");
        //   source.setAttribute("type", "audio/mpeg");
        //   mediaElement.appendChild(source);
        // }
        // // ogg, oga
        // if (mediaElement.canPlayType("audio/ogg")) {
        //   source = document.createElement("source");
        //   source.setAttribute("src", filename + ".ogg");
        //   source.setAttribute("type", "audio/ogg");
        //   mediaElement.appendChild(source);

        //   source = document.createElement("source");
        //   source.setAttribute("src", filename + ".oga");
        //   source.setAttribute("type", "audio/ogg");
        //   mediaElement.appendChild(source);
        // }
        // // wav
        // if (mediaElement.canPlayType("audio/wav")) {
        //   source = document.createElement("source");
        //   source.setAttribute("src", filename + ".wav");
        //   source.setAttribute("type", "audio/wav");
        //   mediaElement.appendChild(source);
        // }

        // mediaElement.load();
        // mediaElement.play();
        // mediaElement.pause();

        // audios[name] = mediaElement;
        
        audios[name] = new Audio(name);
        
        var onCanPlayThrough = function(evt) {
          this.ready = 1;
        }
        audios[name].addEventListener('canplaythrough', onCanPlayThrough);
        
        var onError = function(evt) {
          if (!this.canPlayType("audio/" + name.substring(name.length-3)) && (name.substring(name.length-3) == "mp3")) {
            audios[name] = new Audio(name.replace("mp3", "ogg"));
            audios[name].addEventListener('canplaythrough', onCanPlayThrough);
            audios[name].addEventListener('load', onCanPlayThrough);
            audios[name].addEventListener('error', onError);
            audios[name].load();
          } else {
            console.log("El archivo '" + name + "' no puede ser reproducido");
            this.errorload = 1;
          }
        }
        audios[name].addEventListener('error', onError);
              
  //       audios[name].load();
        audios[name].play();
        setTimeout( function(){ audios[name].pause(); }, 15);
        
        return audios[name];
      }
    }
    else {
      return new Audio();
    }
  }  
  
  /**
   * Get a control by a component identifier
   * @param {String} cID the component identifier of the control
   * @return {Control} return a control with a component identifier or a dummy control if not find
   */
  descartesJS.DescartesApp.prototype.getControlByCId = function(cID) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.cID == cID) {
        return controls_i;
      }
    }
    
    return {update: function() {}, w: 0};     
  }

  /**
   * Get a control by identifier
   * @param {String} id the identifier of the control
   * @return {Control} return a control with identifier or a dummy control if not find
   */
  descartesJS.DescartesApp.prototype.getControlById = function(id) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.id == id) {
        return controls_i;
      }
    }
    
    return {update: function() {}}; 
  }
  
  /**
   * Get a space by a component identifier
   * @param {String} cId the component identifier of the space
   * @return {Space} return a space with the component identifier or a dummy space if not find
   */
  descartesJS.DescartesApp.prototype.getSpaceByCId = function(cID) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.cID == cID) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }
  
  /**
   * Get a space by identifier
   * @param {String} cId the identifier of the space
   * @return {Space} return a space with the identifier or a dummy space if not find
   */
  descartesJS.DescartesApp.prototype.getSpaceById = function(id) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.id == id) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }

  var tmpVal;
  /**
   * Get a string representation of an array
   * @param {Array} array the array to get the string representation
   * @return {String} return a string representing the array
   */
  function arrayToString(array) {
    var result = "[";

    for (var i=0, l=array.length; i<l; i++) {
      // nested array
      if (array[i] instanceof Array) {
        result += arrayToString(array[i]);
      }
      // value
      else {
        tmpVal = array[i];
        if ( (typeof(tmpVal) == "undefined") || (!tmpVal)) {
          tmpVal = 0;
        }
        
        if (typeof(tmpVal) == "string") {
          tmpVal = "'" + tmpVal + "'";
        }

        result += tmpVal;
      }

      // add commas to the string
      if (i<l-1) {
        result += ",";
      }
    }

    return result + "]"
  }

  /**
   * Get the state of the applet
   * @return {String} return a string with the variables, vectors and matrices separate with commas
   */
  descartesJS.DescartesApp.prototype.getState = function() {
    var theValues;
    var state = "";
    
    var theVariables = this.evaluator.variables;
    // check all the variables
    for (var varName in theVariables) {
      if (theVariables.hasOwnProperty(varName)) {
        theValues = theVariables[varName];
        
        // if the value is a string, we must ensure that it does not lose the single quotes
        if (typeof(theValues) == "string") {
          theValues = "'" + theValues + "'";
        }
        
        // if the name of the variable is the name of an internal variable or is an object, the ignore it
        if ( (theValues != undefined) && (varName != "rnd") && (varName != "pi") && (varName != "e") && (varName != "Infinity") && (varName != "-Infinity") && (typeof(theValues) != "object") ) {
          
          state = (state != "") ? (state + "\n" + varName + "=" + theValues) : (varName + "=" + theValues);
        }
      }
    }

    var theVectors = this.evaluator.vectors;
    // check all the vectors
    for (var vecName in theVectors) {
      if (theVectors.hasOwnProperty(vecName)) {
        theValues = theVectors[vecName];

        state = state + "\n" + vecName + "=" + arrayToString(theValues);
      }
    }

    var theMatrices = this.evaluator.matrices;
    // check all the matrices
    for (var matName in theMatrices) {
      if (theMatrices.hasOwnProperty(matName)) {
        theValues = theMatrices[matName];

        state = state + "\n" + matName + "=" + arrayToString(theValues);
      }
    }

    // return the values in the form variable1=value1\nvariable2=value2\n...\nvariableN=valueN
    return state; 
  }
  
  /**
   * Set the state of the applet
   * @param {String} state string containing the values to set of the form variable1=value1\nvariable2=value2\n...\nvariableN=valueN
   */
  descartesJS.DescartesApp.prototype.setState = function(state) {
    var theState = state.split("\n");
    
    var tmpParse;
    var value;

    for (var i=0, l=theState.length; i<l; i++) {
      tmpParse = theState[i].split("=");

      // the text is of the type variable=value
      if (tmpParse.length >= 2) {
        value = eval(tmpParse[1]);

        // the value of a matrix
        if (tmpParse[1].indexOf("[[") != -1) {
          this.evaluator.matrices[tmpParse[0]] = value;
          // this.evaluator.variables[tmpParse[0] + ".filas"] = value.length; 
          // this.evaluator.variables[tmpParse[0] + ".columnas"] = value[0].length; 
          this.evaluator.matrices[tmpParse[0]].rows = value.length;
          this.evaluator.matrices[tmpParse[0]].cols = value[0].length;
        }
        // the value of a vector
        else if (tmpParse[1].indexOf("[") != -1) {
          this.evaluator.vectors[tmpParse[0]] = value;
          this.evaluator.variables[tmpParse[0] + ".long"] = value.length;
        }
        // the vale of a variable
        else {
          this.evaluator.variables[tmpParse[0]] = value;
        }
      }

      // update the lesson
      this.update();

      // tmpParse = this.evaluator.parser.parse(theState[i], true);
      
      // // se ejecuta la asignacion de valores que se encuentra en la cadena del estado
      // this.evaluator.evalExpression( tmpParse );
      
      // // se guardan las asinaciones de valores para futuras asignaciones
      // this.saveState.push(tmpParse);
    }
    
  }
  
  /**
   * Get the evaluation of the lesson
   * @return {String} return a string of the form: questions=something \n correct=something \n wrong=something \n control1=respuestaAlumno|0 ó 1 \n control2=respuestaAlumno|0 ó 1
   */
  descartesJS.DescartesApp.prototype.getEvaluation = function() {
    var questions = 0;
    var correct = 0;
    
    var answers = "";
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      if ( (this.controls[i].gui == "textfield") && (this.controls[i].evaluate) ) {
        questions++;
        correct += this.controls[i].ok;
        this.controls[i].value = (this.controls[i].value == "") ? "''" : this.controls[i].value;
        answers += (" \\n " + this.controls[i].id + "=" + this.controls[i].value + "|" + this.controls[i].ok);
      }
    }
    
    return "questions=" + questions + " \\n correct=" + correct + " \\n wrong=" + (questions-correct) + answers;
  }

  /**
   * Store que values in the text fields in the moment of the execution and show the first element in the answer pattern
   */
  descartesJS.DescartesApp.prototype.showSolution = function() {
    var controls = this.controls;
    for (var i=0, l=controls.length; i<l; i++) {
      if ( (controls[i].gui == "textfield") && (controls[i].evaluate) ) {
        controls[i].changeValue( controls[i].getFirstAnswer() );
      }
    }
    
    this.update();
  }

  /**
   * Store the values in the text fields in the moment of the execution and show the answer of the student
   */
  descartesJS.DescartesApp.prototype.showAnswer = function() {
    for (var i=0, l=this.saveState.length; i<l; i++){
      this.evaluator.evalExpression( this.saveState[i] );
    }
    
    this.update();
  }

  // descartesJS.DescartesApp.prototype.registerCacheVar = function(name) {
  //   this.getVarsNames[name] = 0;
  // }

  // descartesJS.DescartesApp.prototype.sendCacheVars = function() {
  //   // traverse the values
  //   for (var propName in this.getVarsNames) {
  //     // verify the own properties of the object
  //     if (this.getVarsName.hasOwnProperty(propName)) {
  //       iframe.contentWindow.postMessage({ type: "get", name: varName }, "*");
  //     }
  //   }
  // }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Array to store the javascript replacements of the java applets
   * type [DescartesApp]
   * @private
   */
  descartesJS.apps = [];

  /**
   * Make the javascript replacements of the java applets
   */
  function makeDescartesApps() {
    var applets = getDescartesApplets();

    // for all descartes applets in the page make a javascript replacement
    for (var i=0, l=applets.length; i<l; i++) {
      descartesJS.apps.push( new descartesJS.DescartesApp(applets[i]) );
      changeClassDescartesJS(applets[i]);
    }
  }

  /** 
   * Hide the applets in the page
   */
  function hideApplets() {
    var cssNode = document.getElementById("StyleDescartesApps");
    
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    // create the CSS style to hide the applets
    cssNode = document.createElement("style");
    cssNode.id = "StyleDescartesApps";
    cssNode.type = "text/css";
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.innerHTML = "applet.DescartesJS {display:none;} applet {display:none;} ajs.DescartesJS {display:none;} ajs {display:none;}";
    
    // add the style in the head of the document
    document.head.appendChild(cssNode); 
  }
  
  /** 
   * Show the hidden applets
   */
  function showApplets() {
    var cssNode = document.getElementById("StyleDescartesApps");

    cssNode.innerHTML = "applet.DescartesJS {display:block;} applet {display:block;} ajs.DescartesJS {display:block;} ajs {display:block;}";
  }
  
  /** 
   * Shows applets that are not descartes
   */
  function showNoDescartesJSApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS {display:none;} applet {display:none;} ajs.DescartesJS {display:none;} ajs {display:none;}";
  }
  
  /**
   * Find and get the descartes applets in the document
   * @return {Array.<applet>} the descartes applets in the document
   */
  function getDescartesApplets() {
    // get all the applets in the document
    var applets = document.getElementsByTagName("applet");
    var appletsAJS = document.getElementsByTagName("ajs");
    var applet_i;
    
    // se crea un arreglo donde guardar los applets encontrados
    var tmpArrayApplets = [];

    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      if ( (applet_i.getAttribute("code").match("DescartesJS")) || 
           (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class")) ||
           (applet_i.getAttribute("code").match("Descartes")) || 
           (applet_i.getAttribute("code").match("Arquimedes")) ||
           (applet_i.getAttribute("code").match("Discurso"))
         ) {
        tmpArrayApplets.push(applet_i);
      }
    }

    for (var i=0, l=appletsAJS.length; i<l; i++) {
      applet_i = appletsAJS[i];
      if ( (applet_i.getAttribute("code").match("DescartesJS")) || 
           (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class")) ||
           (applet_i.getAttribute("code").match("Descartes")) || 
           (applet_i.getAttribute("code").match("Arquimedes")) ||
           (applet_i.getAttribute("code").match("Discurso"))
         ) {
        tmpArrayApplets.push(applet_i);
      }
    }
    
    return tmpArrayApplets;
  }
  
  /**
   * Change the class of an applet to "DescartesJS"
   * @param {<applet>} applet the applet to change the class
   */
  function changeClassDescartesJS(applet) {
    applet.className = "DescartesJS";
  }

  /**
   * Remove extra data included in an previous interpretation
   */
  function removeDescartesAppContainers() {
    // get all html tags
    var allHTMLTags = document.getElementsByTagName("*");
    
    // array to store the elements to be removed
    var toBeRemoved = [];
    
    for (var i=0, l=allHTMLTags.length; i<l; i++) {
      // remove elements with "DescartesAppContainer" class
      if (allHTMLTags[i].className == "DescartesAppContainer") {
        toBeRemoved.push(allHTMLTags[i]);
      }
    }

    // remove the elements in the toBeRemove array
    for (var i=0, l=toBeRemoved.length; i<l; i++) {
      (toBeRemoved[i].parentNode).removeChild(toBeRemoved[i]);
    }
  }
  
  /**
   * Get the array of descartes apps, i.e. javascript interpretations of the descartes applets
   * @return {Array.<DescartesApp>}
   */
  descartesJS.getDescartesApps = function() {
    return descartesJS.apps;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // The following code is executed immediately
  //////////////////////////////////////////////////////////////////////////////////////////////////  
  // if the variable debugDescartesJS exist and is true then hide the applets
  if (!(window.hasOwnProperty('debugDescartesJS') && debugDescartesJS)) { 
    hideApplets();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Function to handle the resize of the browser
   * @param {Event} evt the evt of resize the browser
   */
  descartesJS.onResize = function(evt) {
    var spaces;
    for (var i=0, l=descartesJS.apps.length; i<l; i++) {
      spaces = descartesJS.apps[i].spaces;

      for (var j=0, k=spaces.length; j<k; j++) {
        spaces[j].findOffset();
      }
    }
  }
  
  /**
   * Function to handle the load evt of the document
   * @param {Event} evt the evt of load the web page
   */
  function onLoad(evt) {
    // get the features for interpreting descartes applets
    descartesJS.getFeatures();

    // if has support for canvas start the interpretation
    if (descartesJS.hasCanvasSupport) {
      window.scrollTo(0, 10);

      removeDescartesAppContainers();
      makeDescartesApps();
      // showNoDescartesJSApplets();
      window.addEventListener("resize", descartesJS.onResize);

      // scroll the page 2 pixel to remove the address bar when page is done loading in mobile
      window.scrollTo(0, 2);      

      document.body.setAttribute("tabIndex", 1000000);
    } 
    // if has not support for canvas show the applets and do not interpret
    else {
      // prompt a message to install chrome frame
      // when the installation is ready reload the webpage
      // document.location.reload()

      showApplets();
    }
  }
  
  /**
   * Function to handle the message between frames
   * @param {Event} evt the evt of receive a message
   */
  descartesJS.receiveMessage = function(evt) {
    if (descartesJS.apps.length > 0) {
      var data = evt.data;
      
      if (!data) {
        return;
      }

      // set a value to a variable
      if (data.type === "set") {
        descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
      }

      // // get the value of a variable
      // if (data.type === "get") {
      //   descartesJS.apps[0].registerCacheVar(data.name);
      // }
      
      // update the scene
      else if (data.type === "update") {
        descartesJS.apps[0].update();
      }
            
      // execute a function
      else if (data.type === "exec") {
        var fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        var params = [];
        
        if (data.value !== "") {
          params = (data.value.toString()).split(",");
        }
        
        if (fun) {
          fun.apply(descartesJS.apps[0].evaluator, params);
        }
      }

      else if (data.type === "isResizeNeeded") {
        evt.source.postMessage({ type: "doResize" }, '*');
      }

      else if (data.type === "doResize") {
        if (descartesJS.apps.length > 0) {
          descartesJS.apps[0].adjustSize();
        }
      }
    }
  }

  // if the DescartesJS library is loaded multiple times, prevt the collision of diferent version
  if (descartesJS.loadLib == undefined) {
    descartesJS.loadLib = true;

    // register the onload evt
    window.addEventListener("load", onLoad);
    
    // register the message evt, to handle the messages between frames
    window.addEventListener("message", descartesJS.receiveMessage);
  }

  return descartesJS;
})(descartesJS || {});