/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  if (babel.loadLib) { return babel; }

  babel.loadLib = true;

  babel["no"] = babel["ez"] = babel["non"] = babel["não"] = babel["falso"] = babel["false"] = babel["fals"] = babel["gezurra"] = babel["faux"] = babel["fals"] = "false";
  babel["sí"] = babel["yes"] = babel["bai"] = babel["oui"] = babel["si"] = babel["sim"] = babel["verdadero"] = babel["true"] = babel["veritable"] = babel["egia"] = babel["vrai"] = babel["verdadeiro"] = babel["veritable"] = "true";
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
  babel["escala"] = babel["scale"] = babel["eskala"] = babel["échelle"] = "scale";
  babel["nombre"] = babel["name"] = babel["nom"] = babel["izena"] = babel["nome"] = "name";
  babel["ikusgai"] = babel["visível"] = babel["visible"] = "visible";
  babel["rastro"] = babel["trace"] = babel["rastre"] = babel["arrastoa"] = "trace";
  babel["fondo"] = babel["background"] = babel["fons"] = babel["hondoa"] = babel["fond"] = babel["fundo"] = "background";

  babel["parámetro"] = babel["parameter"] = babel["parametroa"] = babel["parâmetro"] = babel["paràmetre"] = "parameter";
  babel["sucesión"] = babel["sequence"] = babel["successió"] = babel["segida"] = babel["succession"] = babel["seqüência"] = "sequence";
  babel["tamaño"] = babel["size"] = babel["neurria"] = babel["taille"] = babel["tamanho"] = babel["grandària"] = "size";
  babel["decimales"] = babel["decimals"] = babel["hamartarra"] = babel["décimales"] = babel["decimais"] = "decimals";
  babel["red"] = babel["net"] = babel["xarxa"] = babel["sarea"] = babel["réseau"] = babel["rede"] = babel["malha"] = "net";
  babel["red10"] = babel["net10"] = babel["xarxa10"] = babel["sarea10"] = babel["réseau10"] = babel["rede10"] = babel["malha10"] = "net10";
  babel["ejes"] = babel["axes"] = babel["eixos"] = babel["ardatzak"] = babel["eixes"] = "axes";

  //////////////////////////////
  // configuration buttons
  //////////////////////////////
  babel["créditos"] = babel["about"] = babel["crèdits"] = babel["kreditoak"] = babel["crédits"] = babel["sobre"] = "about";
  babel["config"] = babel["konfig"] = babel["configuração"] = "config";
  babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["início"] = "init";
  babel["limpiar"] = babel["clear"] = babel["neteja"] = babel["ezabatu"] = babel["nettoye"] = babel["limpar"] = "clear";

  //////////////////////////////
  babel["incr"] = babel["gehi"] = babel["incremento"] = "incr";
  babel["min"] = babel["inf"] = "min";
  babel["max"] = babel["sup"] = babel["máx"] = "max";
  babel["relleno"] = babel["fill"] = babel["ple"] = babel["betea"] = babel["plein"] = babel["recheo"] = babel["preencher"] = "fill";
  babel["relleno+"] = babel["fill+"] = babel["ple+"] = babel["betea+"] = babel["plein+"] = babel["recheo+"] = babel["preencher+"] = babel["fillP"] = "fillP";
  babel["relleno-"] = babel["fill-"] = babel["ple-"] = babel["betea-"] = babel["plein-"] = babel["recheo-"] = babel["preencher-"] = babel["fillM"] = "fillM";
  babel["flecha"] = babel["arrow"] = babel["fletxa"] = babel["gezia"] = babel["flèche"] = babel["frecha"] = babel["seta"] = "arrow";
  babel["punta"] = babel["spear"] = babel["muturra"] = babel["pointe"] = babel["ponta"] = "spear";
  babel["región"] = babel["region"] = babel["regió"] = babel["eskualde"] = babel["région"] = babel["rexión"] = babel["região"] = "region";
  babel["norte"] = babel["north"] = babel["nord"] = babel["ipar"] = "north";
  babel["sur"] = babel["south"] = babel["sud"] = babel["hego"] = babel["sul"] = "south";
  babel["este"] = babel["east"] = babel["est"] = babel["ekialde"] = babel["leste"] = "east";
  babel["oeste"] = babel["west"] = babel["oest"] = babel["hegoalde"] = babel["ouest"] = "west";
  babel["exterior"] = babel["external"] = babel["kanpoalde"] = babel["externo"] = "external";
  babel["expresión"] = babel["expresion"] = babel["expresió"] = babel["adierazpen"] = babel["expressão"] = "expresion";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["posición"] = babel["position"] = babel["posició"] = babel["posizio"] = babel["posição"] = "position";
  babel["constricción"] = babel["constraint"] = babel["constricció"] = babel["beharte"] = babel["constriction"] = babel["constrición"] = babel["restrição"] = "constraint";
  babel["valor"] = babel["value"] = babel["balio"] = babel["valeur"] = "value";
  babel["ecuación"] = babel["equation"] = babel["equació"] = babel["ekuazio"] = babel["équation"] = babel["equação"] = "equation";
  babel["curva"] = babel["curve"] = babel["corba"] = babel["kurba"] = babel["courbe"] = "curve";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = babel["testua"] = "text";
  babel["punto"] = babel["point"] = babel["punt"] = babel["puntu"] = babel["ponto"] = babel["dot"] = "point";
  babel["segmento"] = babel["segment"] = babel["zuzenki"] = "segment";
  babel["arco"] = babel["arc"] = babel["arku"] = "arc";
  babel["polígono"] = babel["polygon"] = babel["polígon"] = babel["poligono"] = babel["polygone"] = "polygon";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irudi"] = babel["imaxe"] = babel["imagem"] = babel["bg_image"] = babel["irudia"] = babel["imagem_de_fundo"] = babel["irundia"] = "image";
  babel["Versión"] = babel["Version"] = babel["Versió"] = babel["Versão"] = babel["version"] = "version";
  babel["Idioma"] = babel["Language"] = babel["Hizkuntza"] = babel["Langue"] = babel["language"] = "language";
  babel["O.x"] = "O.x";
  babel["O.y"] = "O.y";
  babel["Botones"] = babel["Buttons"] = babel["Botons"] = babel["Botoiak"] = babel["Boutons"] = babel["Botóns"] = babel["Botões"] = babel["Botons"] = "Buttons";
  babel["Animación"] = babel["Animation"] = babel["Animació"] = babel["Animazio"] = babel["Animação"] = "Animation";
  babel["constante"] = babel["constant"] = babel["Konstante"] = "constant";
  babel["fuente"] = babel["font"] = babel["iturri"] = babel["source"] = babel["fonte"] = "font";
  babel["numérico"] = babel["numeric"] = babel["numèric"] = babel["zenbakizko"] = babel["numérique"] = "numeric";
  babel["gráfico"] = babel["graphic"] = babel["gràfic"] = babel["grafiko"] = babel["graphique"] = "graphic";
  babel["hacer"] = babel["do"] = babel["fer"] = babel["egin"] = babel["faire"] = babel["facer"] = babel["fazer"] = babel["doExpr"] = "doExpr";
  babel["mientras"] = babel["while"] = babel["mentre"] = babel["bitartean"] = babel["tandis que"] = babel["mentres"] = babel["enquanto"] = babel["whileExpr"] = "whileExpr";
  babel["evaluar"] = babel["evaluate"] = babel["avalua"] = babel["ebaluatu"] = babel["évaluer"] = babel["avaliar"] = "evaluate";
  babel["variable"] = babel["aldagaia"] = babel["variável"] = "variable";
  babel["función"] = babel["function"] = babel["funció"] = babel["funtzio"] = babel["fonction"] = babel["função"] = "function";
  babel["algoritmo"] = babel["algorithm"] = babel["algorisme"] = babel["algorithme"] = "algorithm";
  babel["vector"] = babel["array"] = babel["bektore"] = babel["vecteur"] = babel["matriz"] = "array";
  babel["dibujar-si"] = babel["draw-if"] = babel["marraztu-baldin"] = babel["dessiner-si"] = babel["debuxar-se"] = babel["desenhar-se"] = babel["dibuixa-si"] = babel["drawif"] = "drawif";
  babel["dominio"] = babel["range"] = babel["domini"] = babel["izate-eremua"] = babel["domain"] = babel["domínio"] = "range";
  babel["pausa"] = babel["delay"] = babel["eten"] = "delay";
  babel["eje-x"] = babel["x-axis"] = babel["eix-x"] = babel["x-ardatza"] = babel["axe-x"] = babel["eixe-x"] = babel["eixo-x"] = babel["x_axis"] = "x_axis";
  babel["eje-y"] = babel["y-axis"] = babel["eix-y"] = babel["y-ardatza"] = babel["axe-y"] = babel["eixe-y"] = babel["eixo-y"] = babel["y_axis"] = "y_axis";
  babel["números"] = babel["numbers"] = babel["nombres"] = babel["zenbakiak"] = "numbers";
  babel["exponencial-si"] = babel["exponential-if"] = babel["esponentzial-baldin"] = babel["exponentiel-si"] = babel["exponencial-se"] = babel["exponentialif"] = "exponentialif";
  babel["familia"] = babel["family"] = babel["família"] = babel["famille"] = "family";
  babel["intervalo"] = babel["interval"] = babel["tarte"] = babel["intervalle"] = "interval";
  babel["pasos"] = babel["steps"] = babel["passos"] = babel["pausoak"] = babel["pas"] = "steps";
  babel["centro"] = babel["center"] = babel["centre"] = babel["zentro"] = "center";
  babel["radio"] = babel["radius"] = babel["radi"] = babel["erradio"] = babel["rayon"] = babel["raio"] = "radius";
  babel["fin"] = babel["end"] = babel["fi"] = babel["bukaera"] = babel["fim"] = "end";
  babel["una-sola-vez"] = babel["only-once"] = babel["una-sola-vegada"] = babel["behin-bakarrik"] = babel["une-seule-fois"] = babel["unha-soa-vez"] = babel["apenas-uma-vez"] = babel["onlyOnce"] = "onlyOnce";
  babel["siempre"] = babel["always"] = babel["sempre"] = babel["beti"] = babel["toujours"] = "always";
  babel["color-int"] = babel["int-colour"] = babel["barruko-kolore"] = babel["couleur-int"] = babel["cor-int"] = babel["colorInt"] = "colorInt";
  babel["repetir"] = babel["loop"] = babel["repeteix"] = babel["errepikatu"] = babel["répéter"] = "loop";
  babel["controles"] = babel["controls"] = babel["kontrolak"] = babel["contrôles"] = babel["controis"] = "controls";
  babel["animar"] = babel["animate"] = babel["anima"] = babel["animatu"] = babel["animer"] = "animate";
  babel["auto"] = "auto";
  babel["y"] = babel["top"] = "y";
  babel["espacio"] = babel["space"] = babel["espai"] = babel["espazio"] = babel["espace"] = babel["espazo"] = babel["espaço"] = "space";
  babel["Nu"] = "Nu";
  babel["Nv"] = "Nv";
  babel["alto"] = babel["height"] = babel["alt"] = babel["altu"] = babel["haut"] = babel["altura"] = babel["alçada"] = babel["hauteur"] = babel["alto"] = "height";
  babel["ancho"] = babel["depth"] = babel["amplada"] = babel["zabalera"] = babel["largeur"] = babel["profundidade"] = babel["amplada"] = babel["width"] = babel["ample"] = babel["large"] = babel["largura"] = "width";
  babel["largo"] = babel["length"] = babel["llargada"] = babel["luzera"] = babel["longueur"] = babel["longo"] = babel["comprimento"] = babel["llargada"] = "length";
  babel["color_reverso"] = babel["backcolor"] = babel["color_revers"] = babel["atzealde kolorea"] = babel["couleur_revers"] = babel["cor_reverso"] = babel["cor_de_fundo"] = "backcolor";
  babel["aristas"] = babel["edges"] = babel["arestes"] = babel["ertzak"] = babel["arêtes"] = babel["arestas"] = "edges";
  babel["rotini"] = babel["inirot"] = "inirot";
  babel["posini"] = babel["inipos"] = "inipos";
  babel["triángulo"] = babel["triangle"] = babel["hirukia"] = babel["triângulo"] = "triangle";
  babel["cara"] = babel["face"] = babel["aurpegi"] = "face";
  babel["polireg"] = babel["regpoly"] = babel["polígonoRegular"] = "polireg";
  babel["superficie"] = babel["surface"] = babel["superfície"] = babel["azalera"] = "surface";
  babel["cubo"] = babel["cube"] = babel["cub"] = babel["kubo"] = "cube";
  babel["paralelepípedo"] = babel["box"] = babel["paral·lelepípede"] = babel["paralelepipedo"] = babel["parallélépipède"] = "box";
  babel["cono"] = babel["cone"] = babel["con"] = babel["kono"] = babel["cône"] = "cone";
  babel["cilindro"] = babel["cylinder"] = babel["cilindre"] = babel["zilindro"] = babel["cylindre"] = "cylinder";
  babel["esfera"] = babel["sphere"] = babel["sphère"] = "sphere";
  babel["tetraedro"] = babel["tetrahedron"] = babel["tetraedre"] = babel["tétraèdre"] = "tetrahedron";
  babel["octaedro"] = babel["octahedron"] = babel["octaedre"] = babel["oktaedro"] = babel["octaèdre"] = "octahedron";
  babel["dodecaedro"] = babel["dodecahedron"] = babel["dodecaedre"] = babel["dodekaedro"] = babel["dodécaèdre"] = "dodecahedron";
  babel["icosaedro"] = babel["icosahedron"] = babel["icosaedre"] = babel["ikosaedro"] = babel["icosaèdre"] = "icosahedron";
  babel["elipsoide"] = babel["ellipsoid"] = babel["el·lipsoide"] = babel["ellipsoïde"] = babel["elipsóide"] = "ellipsoid";
  babel["macro"] = babel["makro"] = "macro";
  babel["id"] = "id";
  babel["modelo"] = babel["model"] = babel["eredu"] = babel["modèle"] = "model";
  babel["color"] = babel["kolore"] = babel["couleur"] = babel["cor"] = babel["colour"] = babel["kolorea"] = "color";
  babel["luz"] = babel["light"] = babel["llum"] = babel["argia"] = babel["lumière"] = "light";
  babel["metal"] = babel["metall"] = babel["métal"] = "metal";
  babel["alambre"] = babel["wire"] = babel["filferro"] = babel["alanbre"] = babel["fil de fer"] = babel["arame"] = "wire";
  babel["cortar"] = babel["split"] = babel["talla"] = babel["moztu"] = babel["couper"] = babel["dividir"] = "split";
  babel["despliegue"] = babel["render"] = babel["desplegament"] = babel["zabaltze"] = babel["dèploiement"] = babel["despregamento"] = babel["processar"] = "render";
  babel["orden"] = babel["sort"] = babel["ordre"] = babel["ordena"] = babel["orde"] = babel["ordenar"] = "sort";
  babel["pintor"] = babel["painter"] = babel["margolari"] = babel["peintre"] = "painter";
  babel["trazado de rayos"] = babel["ray trace"] = babel["traçat de raigs"] = babel["izpi trazadura"] = babel["trace de rayons"] = babel["trazado de raios"] = babel["traçado de raios"] = babel["raytrace"] = "raytrace";
  babel["despl_imagen"] = babel["bg_display"] = babel["despl_imatge"] = babel["irudi desplazamendu"] = babel["despl_image"] = babel["despr_imaxe"] = babel["apresentação_de_imagem"] = "bg_display";
  babel["arr-izq"] = babel["topleft"] = babel["dalt-esq"] = babel["goi-ezk"] = babel["au-dessus-gau"] = babel["arr-esq"] = babel["acima-esquerda"] = "topleft";
  babel["expand."] = babel["stretch"] = babel["hedatu"] = babel["expandir "] = "stretch";
  babel["mosaico"] = babel["patch"] = babel["mosaic"] = babel["mosaiko"] = babel["mosaïque"] = "patch";
  babel["centrada"] = babel["zentratu"] = babel["centrée"] = babel["centrado"] = babel["imgcenter"] = "imgcenter";
  babel["archivo"] = babel["file"] = babel["fitxer"] = babel["artxibo"] = babel["fichier"] = babel["arquivo"] = "file";
  babel["filas_norte"] = babel["rows_north"] = babel["files_nord"] = babel["HTML kodea"] = babel["files_nord"] = babel["filas_norte"] = babel["linhas_norte"] = babel["files_nord"] = babel["rowsNorth"] = "rowsNorth";
  babel["filas_sur"] = babel["rows_south"] = babel["files_sud"] = babel["ipar_lerro"] = babel["files_sud"] = babel["filas_sur"] = babel["linhas_sul"] = babel["files_sud"] = babel["rowsSouth"] = "rowsSouth";
  babel["ancho_este"] = babel["width_east"] = babel["ample_est"] = babel["hego_lerro"] = babel["ample_est"] = babel["ancho_leste"] = babel["largura_leste"] = babel["ample_est"] = babel["widthEast"] = "widthEast";
  babel["ancho_oeste"] = babel["width_west"] = babel["ample_oest"] = babel["ekialde_zabalera"] = babel["ample_ouest"] = babel["ancho_oeste"] = babel["largura_oeste"] = babel["ample_oest"] = babel["widthWest"] = "widthWest";
  babel["fijo"] = babel["fixed"] = babel["fix"] = babel["hegoalde_zabalera"] = babel["fixe"] = babel["fixo"] = "fixed";
  babel["Reiniciar Animación"] = babel["Init Animation"] = babel["Reinicia Animació"] = babel["finko"] = babel["Recommencer l'Animation"] = babel["Reiniciar Animação"] = babel["initAnimation"] = "initAnimation";
  babel["Explicación"] = babel["Explanation"] = babel["Azalpena"] = babel["Explication"] = babel["Explicação"] = babel["Explicació"] = "Explanation";
  babel["tooltip"] = babel["dica"] = "tooltip";
  babel["discreto"] = babel["discrete"] = babel["discret"] = babel["diskretu"] = "discrete";
  babel["interfaz"] = babel["gui"] = babel["interfície"] = babel["interfaze"] = babel["interface"] = "gui";
  babel["pulsador"] = babel["spinner"] = babel["polsador"] = babel["pultsadore"] = babel["bouton"] = "spinner";
  babel["campo de texto"] = babel["textfield"] = babel["camp de text"] = babel["testu esarrua"] = babel["champ de texte"] = "textfield";
  babel["menú"] = babel["choice"] = babel["menu"] = babel["escolha"] = "menu";
  babel["barra"] = babel["scrollbar"] = babel["barre"] = "scrollbar";
  babel["opciones"] = babel["options"] = babel["opcions"] = babel["aukerak"] = babel["opcións"] = babel["opções"] = "options";
  babel["interior"] = babel["barruko"] = babel["intérieur"] = "interior";
  babel["condición"] = babel["condition"] = babel["condició"] = babel["baldintza"] = babel["condição"] = "condition";
  babel["acción"] = babel["action"] = babel["acció"] = babel["ekintza"] = babel["ação"] = "action";
  babel["evento"] = babel["event"] = babel["esdeveniment"] = babel["gertaera"] = babel["événement"] = "event";
  babel["abrir URL"] = babel["open URL"] = babel["obre URL"] = babel["URL zabaldu"] = babel["ouvrir URL"] = babel["openURL"] = "openURL";
  babel["abrir Escena"] = babel["open Scene"] = babel["obre Escena"] = babel["eszena zabaldu"] = babel["ouvrir Escena"] = babel["abrir Cena"] = babel["openScene"] = "openScene";
  babel["botón"] = babel["button"] = babel["botó"] = babel["botoi"] = babel["bouton"] = babel["botão"] = "button";
  babel["mensaje"] = babel["message"] = babel["mezua"] = babel["mensaxe"] = babel["mensagem"] = babel["missatge"] = "message";
  babel["alternar"] = babel["alternate"] = babel["alterna"] = babel["txandakatu"] = babel["alterner"] = "alternate";
  babel["ejecución"] = babel["execution"] = babel["execució"] = babel["gauzatze"] = babel["exécution"] = babel["execución"] = babel["execução"] = "execution";
  babel["calcular"] = babel["calculate"] = babel["calcula"] = babel["kalkulatu"] = babel["calculer"] = "calculate";
  babel["coord_abs"] = babel["abs_coord"] = babel["koor_abs"] = "abs_coord";
  babel["negrita"] = babel["bold"] = babel["negreta"] = babel["lodi"] = babel["caractère gras"] = babel["negra"] = babel["negrito"] = "bold";
  babel["cursiva"] = babel["italics"] = babel["etzana"] = babel["italique"] = babel["itálico"] = "italics";
  babel["subrayada"] = babel["underlined"] = babel["subratllat"] = babel["azpimarratua"] = babel["soulignement"] = babel["subliñada"] = babel["sublinhado"] = "underlined";
  babel["pos_mensajes"] = babel["msg_pos"] = babel["pos_missatges"] = babel["mezuen_pos"] = babel["pos_messages"] = babel["pos_mensaxes"] = "msg_pos";
  babel["izquierda"] = babel["left"] = babel["esquerra"] = babel["eskerrean"] = babel["gauche"] = babel["esquerda"] = babel["esquerda"] = babel["esquerra"] = babel["x"] = "x";
  babel["derecha"] = babel["right"] = babel["dreta"] = babel["eskuinan"] = babel["droite"] = babel["dereita"] = babel["direita"] = babel["dreta"] = "right";
  babel["sensible_a_los_movimientos_del_ratón"] = babel["sensitive_to_mouse_movements"] = babel["sensible_als_moviments_del_ratolí"] = babel["xagu mugimenduarekiko sentikorra"] = babel["sensible_aux_mouvements_du_souris"] = babel["sensible_aos_movementos_do_rato"] = babel["sensível_aos_movimentos_do_mouse"] = "sensitive_to_mouse_movements";
  babel["reproducir"] = babel["play"] = babel["reprodueix"] = babel["erreproduzitu"] = babel["reproduire"] = babel["reproduzir"] = babel["playAudio"] = "playAudio";
  babel["activo-si"] = babel["active-if"] = babel["actiu-si"] = babel["altiboa-baldin"] = babel["actif-si"] = babel["activo-se"] = babel["ativo-se"] = babel["activeif"] = "activeif";
  babel["rotfin"] = babel["finrot"] = babel["bukrot"] = babel["endrot"] = "endrot";
  babel["posfin"] = babel["finpos"] = babel["bukpos"] = babel["endpos"] = "endpos";
  babel["editable"] = babel["editagarria"] = babel["editável"] = "editable";
  babel["R2"] = "2D";
  babel["R3"] = "3D";
  babel["vectores"] = babel["bektoreak"] = babel["vecteurs"] = babel["vetores"] = babel["vectors"] = "vectors";
  babel["fuente puntos"] = babel["font size"] = babel["font punts"] = babel["puntu iturria"] = babel["source points"] = babel["fonte puntos"] = babel["fonte pontos"] = babel["font_size"] = "font_size";
  babel["escenario"] = babel["scenario"] = babel["escenari"] = babel["agertoki"] = babel["scène"] = babel["cenário"] = "scenario";
  babel["cID"] = "cID";
  babel["matriz"] = babel["matrix"] = babel["matriu"] = babel["matrice"] = "matrix";
  babel["filas"] = babel["rows"] = babel["files"] = "rows";
  babel["columnas"] = babel["columns"] = babel["colonnes"] = "columns";
  babel["solo_texto"] = babel["only_text"] = babel["seulement_texte"] = babel["só_texto"] = babel["tan_sols_texte"] = babel["onlyText"] = "onlyText";
  babel["respuesta"] = babel["answer"] = "answer";
  babel["peso"] = babel["weight"] = babel["pes"] = "weight";
  babel["decimal_symbol"] = babel["signo decimal"] = babel["decimal symbol"] = "decimal_symbol";
  babel["info"] = "info";
  
  ////////////////////////
  //  new options added
  babel["library"] = "library";

  babel["color_contorn_text"] = babel["color_text_border"] = babel["color_borde_texto"] = babel["muga_testuaren_kolorea"] = babel["couleur_contour_texte"] = babel["cor_borde_texto"] = babel["colore_bordo_testo"] = babel["cor_borda_texto"] = babel["color_contorn_text"] = babel["border"] = "border";
  babel["video"] = babel["vidéo"] = "video";
  babel["audio"] = babel["àudio"] = "audio"; 
  babel["autoplay"] = "autoplay";
  babel["poster"] = "poster";
  babel["opacidad"] = babel["opacity"] = babel["opacité"] = babel["opacitat"] = babel["opacidade"] = "opacity";
  babel["alinear"] = babel["align"] = babel["aliñar"] = babel["aligner"] = "align";
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
  babel["rectangle"] = babel["rectángulo"] = "rectangle";
  babel["lineDash"] = "lineDash";
  babel["solid"] = "solid";
  babel["dot"] = "dot";
  babel["dash"] = "dash";
  babel["dash_dot"] = "dash_dot";

  babel["offset_dist"] = "offset_dist";
  babel["offset_angle"] = "offset_angle";

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
  babel["doc"] = "doc";
  babel["image_dec"] = "image_dec";
  babel["image_inc"] = "image_inc";
  babel["btn_pos"] = "btn_pos";

  babel["border_width"] = "border_width";
  babel["border_color"] = "border_color";

  babel["v_left"] = "v_left";
  babel["v_right"] = "v_right";
  babel["h_left"] = "h_left";
  babel["h_right"] = "h_right";
  babel["h_left_right"] = "h_left_right";

  babel["label_color"] = "label_color";
  babel["label_text_color"] = "label_text_color";

  babel["shadowColor"] = "shadowColor";
  babel["shadowBlur"] = "shadowBlur";
  babel["shadowOffsetX"] = "shadowOffsetX";
  babel["shadowOffsetY"] = "shadowOffsetY";
  babel["border_size"] = "border_size";

  babel["clip"] = "clip";
  babel["keyboard"] = "keyboard";
  babel["kblayout"] = "kblayout";
  babel["kbexp"] = "kbexp";

  babel["extra_style"] = "extra_style";

  return babel;
})(babel || Object.create(null));
