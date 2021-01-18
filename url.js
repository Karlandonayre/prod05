require(
    [
        "esri/identity/IdentityManager",
        "esri/core/urlUtils",
        "esri/layers/FeatureLayer",
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",
        "esri/core/watchUtils",
        "dojo/_base/array",
        "esri/core/urlUtils",

        "dojo/domReady!"
    ],
    function(
        IdentityManager,
        urlUtils,
        FeatureLayer,
        QueryTask,
        Query,
        watchUtils,
        array,
        urlUtils
    ) {
        $("#mensaje").hide();

        // _proxyurl2 = "https://proxy-esri.herokuapp.com/proxy.php"; //palomino

        // urlUtils.addProxyRule({
        //   urlPrefix: "https://gisem.osinergmin.gob.pe/serverdc/rest/services",
        //   proxyUrl: _proxyurl2
        // });
        //servicio prueba
        var url_mal_georef = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/ResultadosXY2LVGLP/FeatureServer/2";
        var url_ok_georef = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/ResultadosXY2LVGLP/FeatureServer/3";
        var url_no_georef = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/ResultadosXY2LVGLP/FeatureServer/5";

        //Fields
        var fobjectid = "OBJECTID";
        var fregisthidroc = "CDGO_DGH";
        var frsocial = "RAZON";
        var fnomdepa = "NOMDEPA";
        var fnomprov = "NOMPROV";
        var fnomdist = "NOMDIST";
        var fdireccion = "DIRECCION";
        var factividad = "ACTIVIDAD";
        var fcoddepart = "CODDEPARTAMENTO";
        var fcodprov = "CODPROVINCIA";
        var fcoddist = "Ubigeo_ID_txt";
        var fcodosinergmin = "CODIGO_OSINERG";

        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $("#btn_export").on('click', function() {
            let urlparams = window.location.search
            _params_url = urlparams.substring(1);
            (_params_url == undefined || _params_url == ' ') ? _params_url = "undefined": "";
            cargar(_params_url);
        });

        function cargar(_params_url) {
            var cod_dist = _params_url.split('=')[1];
            cargarDatos(cod_dist);
        }

        function cargarDatos(cod_dist) {
            let cod_distrito = cod_dist;
            let nombre_distrito = "";
            let list_codOsinerg = [];
            let progreso = 0;
            let cant = 0;
            let total = 0;
            let sql = "";
            sql = fcoddist + " = '" + cod_distrito + "'";
            console.log("primer sql ",sql)
            var query = new QueryTask({ url: url_ok_georef });
            var params = new Query;
            params.returnGeometry = false;
            params.outFields = ["*"];
            params.where = sql;
            query.execute(params).then(function(response) {

                if (response.features.length === 0) {
                    console.log("sin registros");
                    sql2 = fcoddist + " = '" + cod_distrito + "'";
                    console.log("segundo sql ",sql2)
                    $("#mensaje").css('display', 'block');
                    $("#mensaje").fadeOut(4000);
                    $("#mensaje").show();
                    $("#mensaje").hide(4000);
                } else {
                    var registros = response.features;
                    var tabla = $("#tbl_datos").html("");
                    $(".lbl-progreso").css("display", "inline-block");

                    for (var i = 0; i < registros.length; i++) {
                        var atributos = registros[i].attributes;
                        var departamento = (atributos[fnomdepa] != null) ? atributos[fnomdepa] : "";
                        var provincia = (atributos[fnomprov] != null) ? atributos[fnomprov] : "";
                        var distrito = (atributos[fnomdist] != null) ? atributos[fnomdist] : "";
                        var codOsinergmin = atributos[fcodosinergmin];
                        var regHidroc = atributos[fregisthidroc];
                        var rsocial = atributos[frsocial];
                        var direccion = atributos[fdireccion];
                        var actividad = atributos[factividad];

                        list_codOsinerg.push("'" + codOsinergmin + "'");
                        tabla.append(`<tr>
                              <td>${departamento}</td>
                              <td>${provincia}</td>
                              <td>${distrito}</td>
                              <td>${codOsinergmin}</td>
                              <td>${regHidroc}</td>
                              <td>${rsocial}</td>
                              <td>${direccion}</td>
                              <td>${actividad}</td>
                              <td>SI</td>
                            </tr>`);
                        cant = cant + 1;
                        total = registros.length;
                        var porcentaje = 50;
                        progreso = (cant * porcentaje) / total
                        $("#progreso").css("width", `${progreso}%`);
                        $("#porcentaje").html(`${progreso}%`);
                        console.log(progreso + "%");
                    }
                    sql2 = fcoddist + " = '" + cod_distrito + "' and "+fcodosinergmin+" not in (" + list_codOsinerg + ")";
                    console.log("sql2 con datos ",sql2)
                }
                nombre_distrito = distrito;

                var query2 = new QueryTask({ url: url_mal_georef });
                var params2 = new Query;
                params2.returnGeometry = false;
                params2.outFields = ["*"];
                params2.where = sql2;
                return query2.execute(params2);
            }).then(function(response) {
                total = total + response.features.length;
                if (response.features.length === 0) {
                    console.log("sin registros");
                    sql3 = fcoddist + " = '" + cod_distrito + "'";
                    console.log("sql3 ",sql3)
                } else {
                    var registros = response.features;
                    var tabla = $("#tbl_datos");
                    for (var i = 0; i < registros.length; i++) {
                        var atributos = registros[i].attributes;
                        var departamento = (atributos[fnomdepa] != null) ? atributos[fnomdepa] : "";
                        var provincia = (atributos[fnomprov] != null) ? atributos[fnomprov] : "";
                        var distrito = (atributos[fnomdist] != null) ? atributos[fnomdist] : "";
                        var codOsinergmin = atributos[fcodosinergmin];
                        var regHidroc = atributos[fregisthidroc];
                        var rsocial = atributos[frsocial];
                        var direccion = atributos[fdireccion];
                        var actividad = atributos[factividad];
                        list_codOsinerg.push("'" + codOsinergmin + "'");

                        tabla.append(`<tr>
                              <td>${departamento}</td>
                              <td>${provincia}</td>
                              <td>${distrito}</td>
                              <td>${codOsinergmin}</td>
                              <td>${regHidroc}</td>
                              <td>${rsocial}</td>
                              <td>${direccion}</td>
                              <td>${actividad}</td>
                              <td>EN PROCESO</td>
                            </tr>`);

                        cant = cant + 1;
                        var porcentaje = 70;
                        progreso = cant * porcentaje / total;
                        console.log(progreso + "%");
                        $("#progreso").css("width", `${progreso}%`);
                        $("#porcentaje").html(`${progreso}%`);
                    }
                    sql3 = fcoddist + " = '" + cod_distrito + "' and "+fcodosinergmin+" not in (" + list_codOsinerg + ")";
                    console.log("sql3 con datos ",sql3)
                }


                var query3 = new QueryTask({ url: url_no_georef });
                var params3 = new Query;
                params3.returnGeometry = false;
                params3.outFields = ["*"];
                params3.where = sql3;
                return query3.execute(params3);
            }).then(function(response) {
                total = total + response.features.length;
                if (response.features.length === 0) {
                    console.log("sin registros");
                    progreso = 100;
                    console.log(progreso + "%");
                    $("#progreso").css("width", `${progreso}%`);
                    $("#porcentaje").html(`${progreso}%`);
                } else {
                    var registros = response.features;
                    var tabla = $("#tbl_datos");
                    for (var i = 0; i < registros.length; i++) {
                        var atributos = registros[i].attributes;
                        var departamento = (atributos[fnomdepa] != null) ? atributos[fnomdepa] : "";
                        var provincia = (atributos[fnomprov] != null) ? atributos[fnomprov] : "";
                        var distrito = (atributos[fnomdist] != null) ? atributos[fnomdist] : "";
                        var codOsinergmin = atributos[fcodosinergmin];
                        var regHidroc = atributos[fregisthidroc];
                        var rsocial = atributos[frsocial];
                        var direccion = atributos[fdireccion];
                        var actividad = atributos[factividad];

                        tabla.append(`<tr>
                              <td>${departamento}</td>
                              <td>${provincia}</td>
                              <td>${distrito}</td>
                              <td>${codOsinergmin}</td>
                              <td>${regHidroc}</td>
                              <td>${rsocial}</td>
                              <td>${direccion}</td>
                              <td>${actividad}</td>
                              <td>EN PROCESO</td>
                            </tr>`);

                        cant = cant + 1;
                        var porcentaje = 100;
                        progreso = cant * porcentaje / total;
                        console.log(progreso + "%");
                        $("#progreso").css("width", `${progreso}%`);
                        $("#porcentaje").html(`${progreso}%`);
                    }
                }
                $(".lbl-progreso").css("display", "none");
                exportar(nombre_distrito);
            })
        }

        function exportar(distrito) {
            //exportacion de datos a excel
            var filename = 'export_' + distrito + '.xls';
            var $tbldatos = document.getElementById('tbl_exportar');
            Exporter.export($tbldatos, filename, 'Locales de venta LGVL');
            return false;
        }

    })