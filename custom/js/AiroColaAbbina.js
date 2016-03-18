/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var AiroCola = AiroCola || {};


AiroCola.abbina = {
    
  
    
    TabellaFoto: {Nome:"tblFoto", Riga: "rigaElencoFoto_", Etichetta: "labelFoto_", CellaEtichetta: "cellaEtichetta_", Anteprima: "tblFotoAnteprima_"},
    TabellaIscritti: {Nome:"iscritti", Riga: "rigaElencoIscritti_", Compagnia: "tdCompagnia_", Tessera: "tdTessera_"},
    
    showPicture: function (file){
        var myHtml = "<div class = 'centerDiv'><img src='"+ AiroCola.parameters.getImagePathToSet() + file + "'/></div>";
        $('body').append(myHtml);
     //   $('body').ap
        
    },
    
    Data: {
        //disabbinafoto
        disabbinaTessera:  function(nTessera, funzioneOK, funzioneKO) {
                    
                    var datastring = AiroCola.api_tools._prepareMethodAndParms("disabbinafoto", {tessera:nTessera});
                    $.ajax({type: "GET",
                                dataType: 'json',
                                url: AiroCola.parameters.ApiRemoteServerName,
                                data: datastring, 
                                async: false,
                                crossDomain : true,
                                success: funzioneOK,
                                error: funzioneKO
                           });
                    },

        loadPiazzole:  function(piazzolaDa, piazzolaA, funzione) {
                    var datastring = AiroCola.api_tools._prepareMethodAndParms("piazzole", {min:piazzolaDa, max:piazzolaA});
                    $.ajax({type: "GET",
                                dataType: 'json',
                                url: AiroCola.parameters.ApiRemoteServerName,
                                data: datastring, 
                                crossDomain : true}
                                ).done(funzione);
                    },
        loadIscrittiDaAbbinare:  function(funzione) {
                    var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieridaabbinare", {min:1, max:2});
                    $.ajax({type: "GET",
                                dataType: 'json',
                                url: AiroCola.parameters.ApiRemoteServerName,
                                data: datastring, 
                                crossDomain : true}
                                ).done(funzione);
                    },
                    /*
                     * Attenzione - Chiamata SINCRONA
                     * @param {numeric} nTessera
                     * @param {string} nomeFoto
                     * @param {function} funzione
                     * @returns {undefined}
                     */
        abbinaTesseraAFoto:  function(nTessera, nomeFoto, funzione) {
                    var datastring = AiroCola.api_tools._prepareMethodAndParms("abbinafoto", {foto:nomeFoto, tessera:nTessera});
                    $.ajax({type: "GET",
                                dataType: 'json',
                                url: AiroCola.parameters.ApiRemoteServerName,
                                data: datastring, 
                                async: false,
                                crossDomain : true,
                                success: funzione,
                                error: function (jqXHR, textStatus, errorThrown){
                                    console.log("errore");
                                    
                                    
                                }});
                               
                    },
        loadFotoDaAssociare: function(success) {
                var datastring = AiroCola.api_tools._prepareMethodAndParms("fotodaassociare", {nascondipath: 1});
                $.ajax({type: "GET",
                            dataType: 'json',
                            url: AiroCola.parameters.ApiRemoteServerName,
                            data: datastring, 
                            crossDomain : true}
                            ).done(success);
                }
        },
        Frontend: {
             
            loadAll: function () {
               var ABB = AiroCola.abbina;
               ABB.Data.loadIscrittiDaAbbinare(ABB.Frontend.impaginaIscritti);
               ABB.Data.loadFotoDaAssociare(ABB.Frontend.impaginaFoto);

            },
    
            refreshIscritti: function() {
                /*
                 *  Qui vengono impaginati i dati degli arcieri da abbinare
                 * @type AiroCola.abbina.TabellaIscritti
                 */
                var ST= AiroCola.sessionTools;

                var AC= AiroCola.abbina.TabellaIscritti;

                // Eliminazione eventuali righe precedenti;
                $('#' + AC.Nome + ' tbody tr').remove();
                var Cap = AiroCola.Tools.capitalize;
                var data = ST.getData(AC.Nome);
                $.each(data, function(key, val){
                   var riga = "<tr id = '" + AC.Riga + key +"' class='rigaElenco'>";
                   riga += "<td class = 'sortPiazzola'>" + val.Piazzola + "</td>";
                   riga += "<td class = 'sortPosizione'>" + val.Posizione + "</td>";
                   riga += "<td class = 'sortCognome'>" + Cap(val.Cognome) + "</td>";
                   riga += "<td class = 'sortNome'>" + Cap(val.Nome) + "</td>";
                   riga += "<td class = 'sortClasse'>" + val.Classe + "</td>";
                   riga += "<td class = 'sortCategoria'>" + val.Categoria + "</td>";
                   riga += "<td class = 'sortCompagnia'>" + val.Compagnia + "</td>";
                   riga += "<td class = 'sortTessera'>" + val.Tessera + "</td>";
                   riga += "</tr>";
                   $('#' + AC.Nome + ' tbody').append(riga);

                });

                // Aggiunto per LIST.JS
                var options = {
                  valueNames: [ 'sortPiazzola', 'sortPosizione', 'sortCognome', 'sortNome', 'sortClasse', 'sortCategoria', 'sortCompagnia', 'sortTessera' ]
                };


                var userList = new List('divIscritti', options);

            },
    
            impaginaIscritti: function(data) {
                var AC= AiroCola.abbina.TabellaIscritti;
                var FE = AiroCola.abbina.Frontend;
                
                // Salva tutti i dati del parametro data in session 
                AiroCola.sessionTools.setData(data.data, AC.Nome);
                
                // impagina la tabella iscritti (verranno usati i dati in session);
                FE.refreshIscritti();
                
                
                /*
                 * Eventi dragover e dragleave per evidenziare il drag & drop
                 */
                $('#' + AC.Nome + ' tr').on('dragleave',  FE.removeDragOver);
                $('#' + AC.Nome + ' tr').on('dragover',  FE.addDragOver);
                
                $('#' + AC.Nome + ' tr').on('drop',  FE.dropPicture);

            },
            
            addDragOver: function (event) {
                var AC= AiroCola.abbina.TabellaIscritti;
                event.preventDefault();
                var target = AiroCola.Tools.getObjectIDByRow(event.target.parentElement.id, AC.Riga);
                $('#' + target).addClass('dragover');
            


              
               },
            removeDragOver: function (event) {
                var AC= AiroCola.abbina.TabellaIscritti;
                event.preventDefault();
                var target = AiroCola.Tools.getObjectIDByRow(event.target.parentElement.id, AC.Riga);
                $('#' + target).removeClass('dragover');
            },
            dropPicture: function (event) {
                event.preventDefault();
               // var ff = new AiroCola.abbina.Frontend;
               

                var data = event.originalEvent.dataTransfer.getData("text");
                // var id = ev.dataTransfer.getData("id");

                if (data === "") {
                    console.log('data è vuoto!');
                    return;
                } 

                var T = AiroCola.Tools;
                var idRigaFoto = T.getRowID(data);
                var rigaFoto = AiroCola.sessionTools.getRow(AiroCola.abbina.TabellaFoto.Nome, idRigaFoto);
                var foto = rigaFoto.Name;

                var objIDRigaTessera = T.getTRId(event.target);
                var idRigaTessera = T.getRowID(objIDRigaTessera); 
                var rigaTessera = AiroCola.sessionTools.getRow(AiroCola.abbina.TabellaIscritti.Nome, idRigaTessera);
                var tessera = rigaTessera.Tessera;
                var nome = rigaTessera.Nome + " " + rigaTessera.Cognome;
                
               // var tessera = row.Tessera;
                var abb = AiroCola.abbina;
                var trFoto = '#' +  abb.TabellaFoto.Riga + idRigaFoto;
                var trIscritti = '#' +  abb.TabellaIscritti.Riga + idRigaTessera;


                abb.Data.abbinaTesseraAFoto(tessera, foto, function (data, textStatus, jqXHR) {
                    // console.log('fico');
                    $(trFoto).remove();
                    $(trIscritti).remove();
                    
                    var remove = AiroCola.sessionTools.removeByID;
                    var ab = AiroCola.abbina;
                    remove(ab.TabellaFoto.Nome, idRigaFoto);
                    remove(ab.TabellaIscritti.Nome, idRigaTessera);
                    
                    ab.Frontend.printAnnullaAbbinamento(nome, tessera, foto);
                    
                });

                        
                
            },
            impaginaFoto: function(data) {
                var AC= AiroCola.abbina.TabellaFoto;
                var FE = AiroCola.abbina.Frontend;
                
                // Salva tutti i dati del parametro data in session 
                AiroCola.sessionTools.setDataArr(data.data, AC.Nome);
                
                // impagina la tabella iscritti (verranno usati i dati in session);
                FE.refreshFoto();
           
                $('#' + AC.Nome + ' tr').on('dragstart', function(event){
                   event.originalEvent.dataTransfer.setData("text", event.target.id);
                });
                /*
                 * Cliccando sull'icona della foto viene mostrata un'anteprima.
                 */
                $('#' + AC.Nome + ' a').on('click', function (event) {
                    
                    var T = AiroCola.Tools;
                    // Recupero dell'id della foto cliccata
                    var riga = T.getRowID(T.getTRId(event.target));
                    
                    // recupero del nome della tabella foto in session
                    var tabFoto = AiroCola.abbina.TabellaFoto.Nome;
                    
                    // recupero del nome della foto
                    var nomeFoto = AiroCola.sessionTools.getRow(tabFoto, riga).Name;
                    
                    // percorso completo della foto
                    var urlFoto = AiroCola.parameters.RemoteServerImagesToSet + nomeFoto;
                    
                    $("#modalHeader").text(nomeFoto);
                    $("#modalFoto").attr('src', urlFoto);
                    $("#myModal").modal();
                });


                $('#' + AC.Nome + ' td').on('dragstart', function (event) {
                    event.originalEvent.dataTransfer.setData("text", event.target.id);
                });
                
                
                
            },
            refreshFoto: function () {

                var AC = AiroCola.abbina.TabellaFoto;
                var data = AiroCola.sessionTools.getData(AC.Nome);
                $('#' + AC.Nome + ' tbody tr').remove();
                $.each(data, function (key, val) {
                    var riga = "<tr id = '" + AC.Riga + key + "'>";
                    riga += "<td id='" + AC.CellaEtichetta + key + "' draggable='true'>";
                    riga += "<span>";
                    riga += "<label>" + val.Name + "</label>";
                    riga += "&nbsp;&nbsp;&nbsp;<a class='glyphicon glyphicon-eye-open'/>";
                    riga += "</span>";
                    riga += "</td></tr>";
                    $('#' + AC.Nome + ' tbody').append(riga);

                });
                    

            },
            printAnnullaAbbinamento: function(nome, tessera, foto) {
                var divAnnulla = "#annullaabbinamento";
                
                $(divAnnulla).fadeIn(500);
                
//        
                $("#labelAnnullaAbbinamento").unbind().removeClass("invisible");
                //$("#labelAnnullaAbbinamento").removeClass("invisible");

                var testo = "Hai appena abbinato <span class='bold'>" + nome + "</span>, tessera <span class='bold'>" + tessera + "</span> alla foto <span class='bold'>" + foto + "</span>";
                $("#annullaabbinamento label").html(testo);
                $("#labelAnnullaAbbinamento").on('click', function () {
                    //  alert("Rimuovi abbinamento a tessera " + tessera);

                    AiroCola.abbina.Data.disabbinaTessera(
                        tessera,
                        function (esito) {
                            console.log(esito);
                            $("#annullaabbinamento label").html("L'abbinamento tessera / foto è stato correttamente rimosso.");
                            AiroCola.abbina.Frontend.loadAll();
                        },
                        function (esito) {
                            console.log(esito);
                            $("#annullaabbinamento label").html("Errore! Riprovare manualmente dall'apposita interfaccia");
                            AiroCola.abbina.Frontend.loadAll();

                        }
                    );

                    $("#labelAnnullaAbbinamento").unbind().addClass("invisible");
                    $("#annullaabbinamento label").html("L'abbinamento tessera / foto è stato correttamente rimosso.");
                });
                setTimeout(
                            function(){
                                $(divAnnulla).fadeOut(800);
                            },
                            3000
                        );
                
            }
    }
};

$(document).ready(function(){
   // Caricamento della barra dei menù
    $('#header').load('headmenu.html');
    
    
    // Ridimensionamento della finestra
    var hFinestra = window.innerHeight;
    var hHeader = $("#header").height();
    var hFooter = $("#impaginaFooter").height();
    var hDiv = (hFinestra - (hHeader + hFooter));

    $(".divAltezzaFissa").css("height", hDiv);
    
  
    
    // Caricamento dati
    AiroCola.abbina.Frontend.loadAll();

 





});

