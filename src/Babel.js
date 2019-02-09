/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  if (babel.loadLib) { return babel; }

  babel.loadLib = true;
 
// ñ -> \u00F1
// á -> \u00E1
// é -> \u00E9
// í -> \u00ED
// ó -> \u00F3
// ú -> \u00FA

  babel["falso"] = babel["false"] = babel["fals"] = babel["gezurra"] = babel["faux"] = babel["fals"] = "false";
  babel["verdadero"] = babel["true"] = babel["veritable"] = babel["egia"] = babel["vrai"] = babel["verdadeiro"] = babel["veritable"] = "true";
  babel["no"] = babel["ez"] = babel["non"] = babel["n\u00E3o"] = "false";
  babel["s\u00ED"] = babel["yes"] = babel["bai"] = babel["oui"] = babel["si"] = babel["sim "] = "true";
  babel["negro"] = babel["black"] = babel["negre"] = babel["beltza"] = babel["noir"] = babel["preto"] = babel["#000000"] = "#000000";
  babel["maxenta"] = babel["magenta"] = babel["#ff00ff"] = "#ff00ff";
  babel["azul"] = babel["blue"] = babel["blau"] = babel["urdina"] = babel["bleu"] = babel["#0000ff"] = "#0000ff";
  babel["turquesa"] = babel["cyan"] = babel["turkesa"] = babel["turquoise"] = babel["#00ffff"] = "#00ffff";
  babel["verde"] = babel["green"] = babel["verd"] = babel["berdea"] = babel["vert"] = babel["#00ff00"] = "#00ff00";
  babel["amarillo"] = babel["yellow"] = babel["groc"] = babel["horia"] = babel["jaune"] = babel["amarelo"] = babel["#ffff00"] = "#ffff00";
  babel["naranja"] = babel["orange"] = babel["taronja"] = babel["laranja"] = babel["laranxa"] = babel["#ffc800"] = "#ffc800";
  babel["rojo"] = babel["red"] = babel["vermell"] = babel["gorria"] = babel["rouge"] = babel["vermello"] = babel["vermelho"] = babel["#ff0000"] = "#ff0000";
  babel["pink"] = babel["rosa"] = babel["arrosa"] = babel["rose"] = babel["#ffafaf"] = "#ffafaf";
  babel["grisObscuro"] = babel["darkGray"] = babel["grisFosc"] = babel["gris iluna"] = babel["grisObscur"] = babel["grisEscuro"] = babel["cinzaEscuro"] = babel["#404040"] = "#404040";
  babel["gris"] = babel["gray"] = babel["grisa"] = babel["cinza"] = babel["#808080"] = "#808080";
  babel["grisClaro"] = babel["lightGray"] = babel["grisClar"] = babel["gris argia"] = babel["grisClair"] = babel["cinzaClaro"] = babel["#c0c0c0"] = "#c0c0c0";
  babel["blanco"] = babel["white"] = babel["blanc"] = babel["zuria"] = babel["branco"] = babel["#ffffff"] = "#ffffff";
  babel["escala"] = babel["scale"] = babel["eskala"] = babel["\u00E9chelle"] = "scale";
  babel["nombre"] = babel["name"] = babel["nom"] = babel["izena"] = babel["nome"] = "name";
  babel["ikusgai"] = babel["vis\u00EDvel"] = babel["visible"] = "visible";
  babel["rastro"] = babel["trace"] = babel["rastre"] = babel["arrastoa"] = "trace";
  babel["fondo"] = babel["background"] = babel["fons"] = babel["hondoa"] = babel["fond"] = babel["fundo"] = "background";

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
  babel["relleno+"] = babel["fill+"] = babel["ple+"] = babel["betea+"] = babel["plein+"] = babel["recheo+"] = babel["preencher+"] = babel["fillP"] = "fillP";
  babel["relleno-"] = babel["fill-"] = babel["ple-"] = babel["betea-"] = babel["plein-"] = babel["recheo-"] = babel["preencher-"] = babel["fillM"] = "fillM";
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
  babel["valor"] = babel["value"] = babel["balio"] = babel["valeur"] = "value";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
  babel["curva"] = babel["curve"] = babel["corba"] = babel["kurba"] = babel["courbe"] = "curve";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
  babel["punto"] = babel["point"] = babel["punt"] = babel["puntu"] = babel["ponto"] = "point";
  babel["segmento"] = babel["segment"] = babel["zuzenki"] = "segment";
  babel["arco"] = babel["arc"] = babel["arku"] = "arc";
  babel["pol\u00EDgono"] = babel["polygon"] = babel["pol\u00EDgon"] = babel["poligono"] = babel["polygone"] = "polygon";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irudi"] = babel["imaxe"] = babel["imagem"] = "image";
  babel["Versi\u00F3n"] = babel["Version"] = babel["Versi\u00F3"] = babel["Vers\u00E3o"] = babel["version"] = "version";
  babel["Idioma"] = babel["Language"] = babel["Hizkuntza"] = babel["Langue"] = babel["language"] = "language";
  babel["O.x"] = "O.x";
  babel["O.y"] = "O.y";
  babel["Botones"] = babel["Buttons"] = babel["Botons"] = babel["Botoiak"] = babel["Boutons"] = babel["Bot\u00F3ns"] = babel["Bot\u00F5es"] = babel["Botons"] = "Buttons";
  babel["Animaci\u00F3n"] = babel["Animation"] = babel["Animaci\u00F3"] = babel["Animazio"] = babel["Anima\u00E7\u00E3o"] = "Animation";
  babel["constante"] = babel["constant"] = babel["Konstante"] = "constant";
  babel["fuente"] = babel["font"] = babel["iturri"] = babel["source"] = babel["fonte"] = "font";
  babel["num\u00E9rico"] = babel["numeric"] = babel["num\u00E8ric"] = babel["zenbakizko"] = babel["num\u00E9rique"] = "numeric";
  babel["gr\u00E1fico"] = babel["graphic"] = babel["gr\u00E0fic"] = babel["grafiko"] = babel["graphique"] = "graphic";
  babel["hacer"] = babel["do"] = babel["fer"] = babel["egin"] = babel["faire"] = babel["facer"] = babel["fazer"] = babel["doExpr"] = "doExpr";
  babel["mientras"] = babel["while"] = babel["mentre"] = babel["bitartean"] = babel["tandis que"] = babel["mentres"] = babel["enquanto"] = babel["whileExpr"] = "whileExpr";
  babel["evaluar"] = babel["evaluate"] = babel["avalua"] = babel["ebaluatu"] = babel["\u00E9valuer"] = babel["avaliar"] = "evaluate";
  babel["variable"] = babel["aldagaia"] = babel["vari\u00E1vel"] = "variable";
  babel["funci\u00F3n"] = babel["function"] = babel["funci\u00F3"] = babel["funtzio"] = babel["fonction"] = babel["fun\u00E7\u00E3o"] = "function";
  babel["algoritmo"] = babel["algorithm"] = babel["algorisme"] = babel["algorithme"] = "algorithm";
  babel["vector"] = babel["array"] = babel["bektore"] = babel["vecteur"] = babel["matriz"] = "array";
  babel["dibujar-si"] = babel["draw-if"] = babel["marraztu-baldin"] = babel["dessiner-si"] = babel["debuxar-se"] = babel["desenhar-se"] = babel["dibuixa-si"] = babel["drawif"] = "drawif";
  babel["dominio"] = babel["range"] = babel["domini"] = babel["izate-eremua"] = babel["domain"] = babel["dom\u00EDnio"] = "range";
  babel["pausa"] = babel["delay"] = babel["eten"] = "delay";
  babel["eje-x"] = babel["x-axis"] = babel["eix-x"] = babel["x-ardatza"] = babel["axe-x"] = babel["eixe-x"] = babel["eixo-x"] = babel["x_axis"] = "x_axis";
  babel["eje-y"] = babel["y-axis"] = babel["eix-y"] = babel["y-ardatza"] = babel["axe-y"] = babel["eixe-y"] = babel["eixo-y"] = babel["y_axis"] = "y_axis";
  babel["n\u00FAmeros"] = babel["numbers"] = babel["nombres"] = babel["zenbakiak"] = "numbers";
  babel["exponencial-si"] = babel["exponential-if"] = babel["esponentzial-baldin"] = babel["exponentiel-si"] = babel["exponencial-se"] = babel["exponentialif"] = "exponentialif";
  babel["familia"] = babel["family"] = babel["fam\u00EDlia"] = babel["famille"] = "family";
  babel["intervalo"] = babel["interval"] = babel["tarte"] = babel["intervalle"] = "interval";
  babel["pasos"] = babel["steps"] = babel["passos"] = babel["pausoak"] = babel["pas"] = "steps";
  babel["centro"] = babel["center"] = babel["centre"] = babel["zentro"] = "center";
  babel["radio"] = babel["radius"] = babel["radi"] = babel["erradio"] = babel["rayon"] = babel["raio"] = "radius";
  babel["fin"] = babel["end"] = babel["fi"] = babel["bukaera"] = babel["fim"] = "end";
  babel["una-sola-vez"] = babel["only-once"] = babel["una-sola-vegada"] = babel["behin-bakarrik"] = babel["une-seule-fois"] = babel["unha-soa-vez"] = babel["apenas-uma-vez"] = babel["onlyOnce"] = "onlyOnce";
  babel["siempre"] = babel["always"] = babel["sempre"] = babel["beti"] = babel["toujours"] = "always";
  babel["color-int"] = babel["int-colour"] = babel["barruko-kolore"] = babel["couleur-int"] = babel["cor-int"] = babel["colorInt"] = "colorInt";
  babel["repetir"] = babel["loop"] = babel["repeteix"] = babel["errepikatu"] = babel["r\u00E9p\u00E9ter"] = "loop";
  babel["controles"] = babel["controls"] = babel["kontrolak"] = babel["contr\u00F4les"] = babel["controis"] = "controls";
  babel["animar"] = babel["animate"] = babel["anima"] = babel["animatu"] = babel["animer"] = "animate";
  babel["auto"] = "auto";
  babel["alto"] = babel["height"] = babel["alt"] = babel["altu"] = babel["haut"] = babel["altura"] = "height";
  babel["x"] = babel["left"] = "x";
  babel["y"] = babel["top"] = "y";
  babel["espacio"] = babel["space"] = babel["espai"] = babel["espazio"] = babel["espace"] = babel["espazo"] = babel["espa\u00E7o"] = "space";
  babel["Nu"] = "Nu";
  babel["Nv"] = "Nv";
  babel["ancho"] = babel["depth"] = babel["amplada"] = babel["zabalera"] = babel["largeur"] = babel["ancho"] = babel["profundidade"] = babel["amplada"] = babel["width"] = "width";
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
  babel["color"] = babel["kolore"] = babel["couleur"] = babel["cor"] = babel["colour"] = babel["kolorea"] = "color";
  babel["luz"] = babel["light"] = babel["llum"] = babel["argia"] = babel["lumi\u00E8re"] = "light";
  babel["metal"] = babel["metall"] = babel["m\u00E9tal"] = "metal";
  babel["alambre"] = babel["wire"] = babel["filferro"] = babel["alanbre"] = babel["fil de fer"] = babel["arame"] = "wire";
  babel["cortar"] = babel["split"] = babel["talla"] = babel["moztu"] = babel["couper"] = babel["dividir"] = "split";
  babel["despliegue"] = babel["render"] = babel["desplegament"] = babel["zabaltze"] = babel["d\u00E8ploiement"] = babel["despregamento"] = babel["processar"] = "render";
  babel["orden"] = babel["sort"] = babel["ordre"] = babel["ordena"] = babel["orde"] = babel["ordenar"] = "sort";
  babel["pintor"] = babel["painter"] = babel["margolari"] = babel["peintre"] = "painter";
  babel["trazado de rayos"] = babel["ray trace"] = babel["tra\u00E7at de raigs"] = babel["izpi trazadura"] = babel["trace de rayons"] = babel["trazado de raios"] = babel["tra\u00E7ado de raios"] = babel["raytrace"] = "raytrace";
  babel["imagen"] = babel["bg_image"] = babel["imatge"] = babel["irudia"] = babel["imaxe"] = babel["imagem_de_fundo"] = babel["image"] = "image";
  babel["despl_imagen"] = babel["bg_display"] = babel["despl_imatge"] = babel["irudi desplazamendu"] = babel["despl_image"] = babel["despr_imaxe"] = babel["apresenta\u00E7\u00E3o_de_imagem"] = "bg_display";
  babel["arr-izq"] = babel["topleft"] = babel["dalt-esq"] = babel["goi-ezk"] = babel["au-dessus-gau"] = babel["arr-esq"] = babel["acima-esquerda"] = "topleft";
  babel["expand."] = babel["stretch"] = babel["hedatu"] = babel["expandir "] = "stretch";
  babel["mosaico"] = babel["patch"] = babel["mosaic"] = babel["mosaiko"] = babel["mosa\u00EFque"] = "patch";
  babel["centrada"] = babel["zentratu"] = babel["centr\u00E9e"] = babel["centrado"] = "imgcenter";
  babel["archivo"] = babel["file"] = babel["fitxer"] = babel["artxibo"] = babel["fichier"] = babel["arquivo"] = "file";
  babel["tipo_de_macro"] = babel["macro_type"] = babel["tipus_de_macro"] = babel["makro_mota"] = babel["type_de_macro"] = babel["tipo_de_macro"] = babel["tipo_de_macro"] = babel["tipus_de_macro"] = "macro_type";
  babel["filas_norte"] = babel["rows_north"] = babel["files_nord"] = babel["HTML kodea"] = babel["files_nord"] = babel["filas_norte"] = babel["linhas_norte"] = babel["files_nord"] = babel["rowsNorth"] = "rowsNorth";
  babel["filas_sur"] = babel["rows_south"] = babel["files_sud"] = babel["ipar_lerro"] = babel["files_sud"] = babel["filas_sur"] = babel["linhas_sul"] = babel["files_sud"] = babel["rowsSouth"] = "rowsSouth";
  babel["ancho_este"] = babel["width_east"] = babel["ample_est"] = babel["hego_lerro"] = babel["ample_est"] = babel["ancho_leste"] = babel["largura_leste"] = babel["ample_est"] = babel["widthEast"] = "widthEast";
  babel["ancho_oeste"] = babel["width_west"] = babel["ample_oest"] = babel["ekialde_zabalera"] = babel["ample_ouest"] = babel["ancho_oeste"] = babel["largura_oeste"] = babel["ample_oest"] = babel["widthWest"] = "widthWest";
  babel["fijo"] = babel["fixed"] = babel["fix"] = babel["hegoalde_zabalera"] = babel["fixe"] = babel["fixo"] = "fixed";
  babel["Reiniciar Animaci\u00F3n"] = babel["Init Animation"] = babel["Reinicia Animaci\u00F3"] = babel["finko"] = babel["Recommencer l'Animation"] = babel["Reiniciar Anima\u00E7\u00E3o"] = babel["initAnimation"] = "initAnimation";
  babel["Explicaci\u00F3n"] = babel["Explanation"] = babel["Azalpena"] = babel["Explication"] = babel["Explica\u00E7\u00E3o"] = babel["Explicaci\u00F3"] = "Explanation";
  babel["tooltip"] = babel["dica"] = "tooltip";
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
  babel["abrir URL"] = babel["open URL"] = babel["obre URL"] = babel["URL zabaldu"] = babel["ouvrir URL"] = babel["openURL"] = "openURL";
  babel["abrir Escena"] = babel["open Scene"] = babel["obre Escena"] = babel["eszena zabaldu"] = babel["ouvrir Escena"] = babel["abrir Cena"] = babel["openScene"] = "openScene";
  babel["bot\u00F3n"] = babel["button"] = babel["bot\u00F3"] = babel["botoi"] = babel["bouton"] = babel["bot\u00E3o"] = "button";
  babel["mensaje"] = babel["message"] = babel["mezua"] = babel["mensaxe"] = babel["mensagem"] = babel["missatge"] = "message";
  babel["alternar"] = babel["alternate"] = babel["alterna"] = babel["txandakatu"] = babel["alterner"] = "alternate";
  babel["ejecuci\u00F3n"] = babel["execution"] = babel["execuci\u00F3"] = babel["gauzatze"] = babel["ex\u00E9cution"] = babel["execuci\u00F3n"] = babel["execu\u00E7\u00E3o"] = "execution";
  babel["calcular"] = babel["calculate"] = babel["calcula"] = babel["kalkulatu"] = babel["calculer"] = "calculate";
  babel["coord_abs"] = babel["abs_coord"] = babel["koor_abs"] = "abs_coord";
  babel["negrita"] = babel["bold"] = babel["negreta"] = babel["lodi"] = babel["caract\u00E8re gras"] = babel["negra"] = babel["negrito"] = "bold";
  babel["cursiva"] = babel["italics"] = babel["etzana"] = babel["italique"] = babel["it\u00E1lico"] = "italics";
  babel["subrayada"] = babel["underlined"] = babel["subratllat"] = babel["azpimarratua"] = babel["soulignement"] = babel["subli\u00F1ada"] = babel["sublinhado"] = "underlined";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irundia"] = babel["imaxe"] = babel["imagem"] = "image";
  babel["pos_mensajes"] = babel["msg_pos"] = babel["pos_missatges"] = babel["mezuen_pos"] = babel["pos_messages"] = babel["pos_mensaxes"] = "msg_pos";
  babel["izquierda"] = babel["left"] = babel["esquerra"] = babel["eskerrean"] = babel["gauche"] = babel["esquerda"] = babel["esquerda"] = babel["esquerra"] = babel["x"] = "x";
  babel["derecha"] = babel["right"] = babel["dreta"] = babel["eskuinan"] = babel["droite"] = babel["dereita"] = babel["direita"] = babel["dreta"] = "right";
  babel["sensible_a_los_movimientos_del_rat\u00F3n"] = babel["sensitive_to_mouse_movements"] = babel["sensible_als_moviments_del_ratol\u00ED"] = babel["xagu mugimenduarekiko sentikorra"] = babel["sensible_aux_mouvements_du_souris"] = babel["sensible_aos_movementos_do_rato"] = babel["sens\u00EDvel_aos_movimentos_do_mouse"] = "sensitive_to_mouse_movements";
  babel["reproducir"] = babel["play"] = babel["reprodueix"] = babel["erreproduzitu"] = babel["reproduire"] = babel["reproduzir"] = babel["playAudio"] = "playAudio";
  babel["activo-si"] = babel["active-if"] = babel["actiu-si"] = babel["altiboa-baldin"] = babel["actif-si"] = babel["activo-se"] = babel["ativo-se"] = babel["activeif"] = "activeif";
  babel["rotfin"] = babel["finrot"] = babel["bukrot"] = babel["endrot"] = "endrot";
  babel["posfin"] = babel["finpos"] = babel["bukpos"] = babel["endpos"] = "endpos";
  babel["editable"] = babel["editagarria"] = babel["edit\u00E1vel"] = "editable";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["R2"] = "R2";
  babel["R3"] = "R3";
  babel["vectores"] = babel["bektoreak"] = babel["vecteurs"] = babel["vetores"] = babel["vectors"] = "vectors";
  babel["fuente puntos"] = babel["font size"] = babel["font punts"] = babel["puntu iturria"] = babel["source points"] = babel["fonte puntos"] = babel["fonte pontos"] = babel["font_size"] = "font_size";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
  babel["punto"] = babel["dot"] = babel["punt"] = babel["puntu"] = babel["point"] = babel["ponto"] = "point";
  babel["escenario"] = babel["scenario"] = babel["escenari"] = babel["agertoki"] = babel["sc\u00E8ne"] = babel["cen\u00E1rio"] = "scenario";
  babel["cID"] = "cID";
  babel["matriz"] = babel["matrix"] = babel["matriu"] = babel["matrice"] = "matrix";
  babel["filas"] = babel["rows"] = babel["files"] = "rows";
  babel["columnas"] = babel["columns"] = babel["colonnes"] = "columns";
  babel["solo_texto"] = babel["only_text"] = babel["seulement_texte"] = babel["s\u00F3_texto"] = babel["tan_sols_texte"] = babel["onlyText"] = "onlyText";
  babel["respuesta"] = babel["answer"] = "answer";
  babel["peso"] = babel["weight"] = babel["pes"] = "weight";
  babel["decimal_symbol"] = babel["signo decimal"] = babel["decimal symbol"] = "decimal_symbol";
  babel["info"] = "info";
  
  ////////////////////////
  //  new options added
  babel["library"] = "library";

  babel["color_contorn_text"] = babel["color_text_border"] = babel["color_borde_texto"] = babel["muga_testuaren_kolorea"] = babel["couleur_contour_texte"] = babel["cor_borde_texto"] = babel["colore_bordo_testo"] = babel["cor_borda_texto"] = babel["color_contorn_text"] = babel["border"] = "border";
  babel["video"] = babel["vid\u00e9o"] = "video";
  babel["audio"] = babel["\u00e0udio"] = "audio"; 
  babel["autoplay"] = "autoplay";
  babel["loop"] = "loop";
  babel["poster"] = "poster";
  babel["opacidad"] = babel["opacity"] = babel["opacit\u00E9"] = babel["opacitat"] = babel["opacidade"] = "opacity";
  babel["alinear"] = babel["align"] = babel["ali\u00F1ar"] = babel["aligner"] = "align";
  babel["anchor"] = "anchor";
  babel["a_left"] = "left";
  babel["a_center"] = "center";
  babel["a_right"] = "right";
  babel["a_justify"] = "justify";
  babel["a_top_left"] = "top_left";
  babel["a_top_center"] = "top_center";
  babel["a_top_right"] = "top_right";
  babel["a_center_left"] = "center_left";
  babel["a_center_center"] = "center_center";
  babel["a_center_right"] = "center_right";
  babel["a_bottom_left"] = "bottom_left";
  babel["a_bottom_center"] = "bottom_center";
  babel["a_bottom_right"] = "bottom_right";
  babel["malla"] = babel["mesh"] = "mesh";
  babel["local"] = babel["Local"] = "local";
  babel["rectangle"] = babel["rect\u00E1ngulo"] = "rectangle";
  babel["lineDash"] = "lineDash";
  babel["solid"] = "solid";
  babel["dot"] = "dot";
  babel["dash"] = "dash";
  babel["dash_dot"] = "dash_dot";

  babel["offset_dist"] = "offset_dist";
  babel["offset_angle"] = "offset_angle";

  babel["cssClass"] = "cssClass";
  babel["doc"] = "doc";

  babel["flat"] = "flat";
  babel["borderColor"] = "borderColor";
  babel["text_align"] = "text_align";
  babel["image_align"] = "image_align";

  babel["checkbox"] = "checkbox";
  babel["torus"] = babel["toro"] = "torus";
  babel["R"] = "R";
  babel["r"] = "r";
  babel["border_radius"] = "border_radius";
  babel["radio_group"] = "radio_group";
  babel["font_family"] = "font_family";
  babel["resizable"] = "resizable";

  // extra
  babel["antialias"] = "antialias";
  babel["image_loader"] = "image_loader";
  babel["expand"] = "expand";
  babel["cover"] = babel["cubrir"] = "expand";
  babel["fit"] = babel["escalar"] = "fit";
  babel["code"] = "code";
  babel["jsfun"] = "jsfun";

  return babel;
})(babel || {});