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
  ){
  $("#mensaje").hide();

    _proxyurl2 = "https://proxy-esri.herokuapp.com/proxy.php"; //palomino

    urlUtils.addProxyRule({
      urlPrefix: "https://gisem.osinergmin.gob.pe/serverdc/rest/services",
      proxyUrl: _proxyurl2
    });
    //servicio prueba
    //var url_prueba = "https://services6.arcgis.com/qHdoJI2FoNfsEzow/ArcGIS/rest/services/tabla_servicio_dash/FeatureServer/0";
    var url_prueba = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/FS_LyOper_LVGLP_v04/FeatureServer/0";
    
    var url_mal_georef = "https://gisem.osinergmin.gob.pe/serverdc/rest/services/Prueba/LVGLP_total_test/FeatureServer/0";
    var url_ok_georef = "https://gisem.osinergmin.gob.pe/serverdc/rest/services/Prueba/LVGLP_total_test/FeatureServer/1";
    var url_no_georef = "https://gisem.osinergmin.gob.pe/serverdc/rest/services/Prueba/LVGLP_total_test/FeatureServer/5";

    //Fields
    var fobjectid = "objectid";
    var fregisthidroc = "cdgo_dgh";
    var frsocial = "razon";
    var fnombdepart = "nomdepartamento";
    var fnombprov = "nomprovincia";
    var fnombdist = "nomdistrito";
    var fdireccion = "direccion";
    var factividad = "actividad";
    var fcoddepart = "coddepartamento";
    var fcodprov = "codprovincia";
    var fcoddist = "ubigeo_id_txt";
    var fcodosinergmin = "codigo_osinerg";
    var festado = "coincide_dist";

    $("#btn_export").on('click', function(){
      let urlparams = window.location.search
      _params_url = urlparams.substring(1);
      (_params_url==undefined || _params_url==' ') ? _params_url = "undefined": "";
      cargar(_params_url);   
    });

    function cargar(_params_url){
      console.log("parametro",_params_url); 

      var cod_dist  = _params_url.split('=')[1];
      cargarDatos(cod_dist);
    } 

    function cargarDatos(cod_dist){
        let cod_distrito = cod_dist;
        let nombre_distrito = "";
        let list_codOsinerg = [];
        var sql = fcoddist+" = '"+cod_distrito+"'";
        console.log(sql);
        var query = new QueryTask({url:url_ok_georef});
        var params = new Query;
        params.returnGeometry = false;
        params.outFields = ["*"];
        params.where = sql;
        query.execute(params).then(function(response){
          console.log(response);
          if(response.features.length === 0){
            console.log("sin registros");
            $("#mensaje").css('display', 'block');
            $("#mensaje").fadeOut(4000);
            $("#mensaje").show();
            $("#mensaje").hide(4000);
          }else{
            var registros = response.features;
            var tabla = $("#tbl_datos").html("");
            for (var i = 0; i < registros.length; i++) {
              var atributos = registros[i].attributes;
              var departamento = atributos[fnombdepart];
              var provincia = atributos[fnombprov];
              var distrito = atributos[fnombdist];
              var codOsinergmin = atributos[fcodosinergmin];
              var regHidroc = atributos[fregisthidroc];
              var rsocial = atributos[frsocial];
              var direccion = atributos[fdireccion];
              var actividad = atributos[factividad];
              console.log(departamento);
              list_codOsinerg.push("'"+codOsinergmin+"'");
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
            }
          }
            nombre_distrito = distrito;
            var sql2 = fcoddist+" = '"+cod_distrito+"' and codigo_osinerg not in ("+list_codOsinerg+")";
            console.log(sql2);
            var query2 = new QueryTask({url:url_mal_georef});
            var params2 = new Query;
            params2.returnGeometry = false;
            params2.outFields = ["*"];
            params2.where = sql2;
            return query2.execute(params2);
        }).then(function(response){
          console.log(response);
          console.log("nombre de distritooooo",nombre_distrito);
          list_codOsinerg =[];
          if(response.features.length === 0){
             console.log("sin registros");
          }else{
            var registros = response.features;
            var tabla = $("#tbl_datos");
            for (var i = 0; i < registros.length; i++) {
              var atributos = registros[i].attributes;
              var departamento = atributos[fnombdepart];
              var provincia = atributos[fnombprov];
              var distrito = atributos[fnombdist];
              var codOsinergmin = atributos[fcodosinergmin];
              var regHidroc = atributos[fregisthidroc];
              var rsocial = atributos[frsocial];
              var direccion = atributos[fdireccion];
              var actividad = atributos[factividad];
              list_codOsinerg.push("'"+codOsinergmin+"'");
              console.log(departamento);
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
            }
          }

            var sql3 = "ubigeo_id = '"+cod_distrito+"' and codigo_osinerg not in ("+list_codOsinerg+")";
            console.log(sql3);
            var query3 = new QueryTask({url:url_no_georef});
            var params3 = new Query;
            params3.returnGeometry = false;
            params3.outFields = ["*"];
            params3.where = sql3;
            return query3.execute(params3);
        }).then(function(response){
          console.log(response);
          if(response.features.length === 0){
              console.log("sin registros");
              console.log(nombre_distrito);
              return exportar(nombre_distrito);
          }else{
            var registros = response.features;
            var tabla = $("#tbl_datos");
            for (var i = 0; i < registros.length; i++) {
              var atributos = registros[i].attributes;
              var departamento = atributos[fnombdepart];
              var provincia = atributos[fnombprov];
              var distrito = atributos[fnombdist];
              var codOsinergmin = atributos[fcodosinergmin];
              var regHidroc = atributos[fregisthidroc];
              var rsocial = atributos[frsocial];
              var direccion = atributos[fdireccion];
              var actividad = atributos[factividad];
              console.log(departamento);
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
            }
          }
          console.log(nombre_distrito);
          return exportar(nombre_distrito);
        })
    }

    function exportar(distrito){
      //exportacion de datos a excel
      var filename = 'export_'+distrito+'.xls';
      var $tbldatos = document.getElementById('tbl_exportar');
      Exporter.export($tbldatos, filename, 'Locales de venta LGVL');
      return false; 
    }

  })