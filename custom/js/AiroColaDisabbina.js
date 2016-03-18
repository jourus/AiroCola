/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var AiroCola = AiroCola || {};


AiroCola.disabbina = {
    
  
    
    TabellaAbbinati: {Nome:"disabbinami", Riga: "rigaAbbinati_", Compagnia: "tdCompagnia_", Tessera: "tdTessera_"},
    
    
    
    Data: {
        //disabbinafoto
        //disabbinaTessera:  AiroCola.abbina.Data.disabbinaTessera,

        disabbinaTessera: AiroCola.abbina.Data.disabbinaTessera,
        
        loadAbbinati:  function(funzione) {
                    var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieriabbinati", {});
                    $.ajax({type: "GET",
                                dataType: 'json',
                                url: AiroCola.parameters.ApiRemoteServerName,
                                data: datastring, 
                                crossDomain : true}
                                ).done(funzione);
                    }
        },
        Frontend: {
            rigaAbbinati: function (elemento) {
                    var riga = AiroCola.sessionTools.getRowEx(AiroCola.disabbina.TabellaAbbinati.Nome, elemento);
                    return riga;

            },
            loadAll: function () {
               var ABB = AiroCola.disabbina;
               ABB.Data.loadAbbinati(ABB.Frontend.impaginaAbbinati);
               
            },
    
            refreshAbbinati: function() {
                /*
                 *  Qui vengono impaginati i dati degli arcieri già abbinati
                 * @type AiroCola.abbina.TabellaAbbinati
                 */
                var ST= AiroCola.sessionTools;

                var AC= AiroCola.disabbina.TabellaAbbinati;

                // Eliminazione eventuali righe precedenti;
                $('#' + AC.Nome + ' tbody tr').remove();
                var Cap = AiroCola.Tools.capitalize;
                var data = ST.getData(AC.Nome);
                
              //  console.log(data);
                
                $.each(data, function(key, val){
                   var riga = "<tr id = '" + AC.Riga + val.ID +"' class='rigaElenco'>";
                   riga += "<td class = 'sortPiazzola'>" + val.Piazzola + "</td>";
                   riga += "<td class = 'sortPosizione'>" + val.Posizione + "</td>";
                   riga += "<td class = 'sortCognome'>" + Cap(val.Cognome) + "</td>";
                   riga += "<td class = 'sortNome'>" + Cap(val.Nome) + "</td>";
                   riga += "<td class = 'sortTessera'>" + val.Tessera + "</td>";
                    riga += "<td><img src='" + AiroCola.parameters.RemoteServerImages + val.Foto + "' class= 'SmallPicture' </td>";
                     riga += "<td><span class='remove glyphicon glyphicon-remove'></span></td>";
                   riga += "</tr>";
                   $('#' + AC.Nome + ' tbody').append(riga);

                });
                

                $('span.remove').on('click', 
                                function(event) {
                                    var nomeRiga = event.target.parentElement.id;

                                    var riga = AiroCola.disabbina.Frontend.rigaAbbinati(event.target);
                                    var idDaEliminare = riga.ID;
                                    console.log('Disabbinare Tessera n.' + riga.Tessera);


                                    AiroCola.disabbina.Data.disabbinaTessera(
                                            riga.Tessera,
                                            function () {
                                                var tabella = AiroCola.disabbina.TabellaAbbinati.Nome;
                                                var rigaDaEliminare = AiroCola.disabbina.TabellaAbbinati.Riga + idDaEliminare;
                                                $('#' + rigaDaEliminare).remove();
                                                AiroCola.sessionTools.removeByID(tabella, idDaEliminare);
                                                console.log("missione compiuta");

                                            }, 
                                            function () {
                                                alert('Qualcosa è andato storto!!');
                                            }
                                        );


                                }
                    );
            
            

                
                // Aggiunto per LIST.JS
                var options = {
                  valueNames: [ 'sortPiazzola', 'sortPosizione', 'sortCognome', 'sortNome',  'sortTessera' ]
                };


                var userList = new List('divIscritti', options);
                
                
            },
    
            impaginaAbbinati: function(data) {
                var AC= AiroCola.disabbina.TabellaAbbinati;
                var FE = AiroCola.disabbina.Frontend;
                
                // Salva tutti i dati del parametro data in session 
                AiroCola.sessionTools.setData(data.data, AC.Nome);
                
                // impagina la tabella degli abbinati (verranno usati i dati in session);
                FE.refreshAbbinati();
                
                
                /*
                 * Eventi dragover e dragleave per evidenziare il drag & drop
                 */
                $('#' + AC.Nome + ' tr').on('dragleave',  FE.removeDragOver);
                $('#' + AC.Nome + ' tr').on('dragover',  FE.addDragOver);
                
                $('#' + AC.Nome + ' tr').on('drop',  FE.dropPicture);

            
           
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

                    AiroCola.disabbina.Data.disabbinaTessera(
                        tessera,
                        function (esito) {
                            console.log(esito);
                            $("#annullaabbinamento label").html("L'abbinamento tessera / foto è stato correttamente rimosso.");
                            AiroCola.disabbina.Frontend.loadAll();
                        },
                        function (esito) {
                            console.log(esito);
                            $("#annullaabbinamento label").html("Errore! Riprovare manualmente dall'apposita interfaccia");
                            AiroCola.disabbina.Frontend.loadAll();

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
    AiroCola.disabbina.Frontend.loadAll();

   

});

