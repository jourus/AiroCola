/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var AiroCola = AiroCola || {};


AiroCola.stampa = {
    PaginaDiStampa: '/anteprima.html?',
    GiaStampato: 'giastampato',
    PosizioneElementi: {Selezionato: 8, Tessera: 6},
    TabellaAbbinati: {Nome: "stampami", Riga: "rigaAbbinati_", Compagnia: "tdCompagnia_", Tessera: "tdTessera_"},
    Data: {
        buttare_loadDataArciere: function (tessera, funzione) {
            var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieriabbinati", {tessera: tessera});
            $.ajax({type: "GET",
                dataType: 'json',
                url: AiroCola.parameters.ApiRemoteServerName,
                data: datastring,
                async: false,
                crossDomain: true}
            ).done(funzione);
        },
        loadAbbinati: function (funzione, tutti) {
            var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieriabbinati", {tutti: tutti});
            $.ajax({type: "GET",
                dataType: 'json',
                url: AiroCola.parameters.ApiRemoteServerName,
                data: datastring,
                crossDomain: true}
            ).done(funzione);
        },
        confermaStampato: function (tessera, funzione) {
            var datastring = AiroCola.api_tools._prepareMethodAndParms("stampato", {tessera: tessera});
            $.ajax({type: "GET",
                dataType: 'json',
                url: AiroCola.parameters.ApiRemoteServerName,
                data: datastring,
                async: false,
                crossDomain: true}
            ).done(funzione);
        }
    },
    Frontend: {
        iconaGiaStampato: "<span class = 'glyphicon glyphicon-ok'></span>",
        
        rigaAbbinati: function (elemento) {
            var riga = AiroCola.sessionTools.getRowEx(AiroCola.stampa.TabellaAbbinati.Nome, elemento);
            return riga;

        },
        loadAll: function () {
            
           
            var ABB = AiroCola.stampa;
            ABB.Data.loadAbbinati(ABB.Frontend.impaginaAbbinati, 1);

        },
        refreshAbbinati: function () {
            /*
             *  Qui vengono impaginati i dati degli arcieri già abbinati
             * @type AiroCola.abbina.TabellaAbbinati
             */
            var ST = AiroCola.sessionTools;

            var AC = AiroCola.stampa.TabellaAbbinati;

            // Eliminazione eventuali righe precedenti;
            $('#' + AC.Nome + ' tbody tr').remove();
            var Cap = AiroCola.Tools.capitalize;
            var data = ST.getData(AC.Nome);
            $('#' + AC.Nome + ' tbody').hide();
            
            // console.log(data);

            $.each(data, function (key, val) {
                var c = (val.Stampato == 1) ? AiroCola.stampa.Frontend.iconaGiaStampato : '';
                var giaStampato = (val.Stampato == 1) ? AiroCola.stampa.GiaStampato : "";
                var riga = "<tr id = '" + AC.Riga + val.ID + "' class='rigaElenco " + giaStampato + "'>";
                riga += "<td class = 'sortPiazzola'>" + val.Piazzola + "</td>";
                riga += "<td class = 'sortPosizione'>" + val.Posizione + "</td>";
                riga += "<td class = 'sortCognome'>" + Cap(val.Cognome) + "</td>";
                riga += "<td class = 'sortNome'>" + Cap(val.Nome) + "</td>";
                riga += "<td class = 'sortClasse'>" + val.Classe + "</td>";
                riga += "<td class = 'sortCategoria'>" + val.Categoria + "</td>";
                riga += "<td class = 'sortTessera'>" + val.Tessera + "</td>";
                riga += "<td>" + c + "</td>";
                riga += "<td><input id = 'checkbox_" + val.ID + "'class='mycheckbox' type='checkbox'/></td>";
                riga += "</tr>";
                $('#' + AC.Nome + ' tbody').append(riga);



            });

            var p = AiroCola.stampa.Frontend.getMostraStampati();
            AiroCola.stampa.Frontend.setMostraStampati(p);


            $('#' + AC.Nome + ' tbody').show();
            // Aggiunto per LIST.JS
            var options = {
                valueNames: ['sortPiazzola', 'sortPosizione', 'sortCognome', 'sortNome', 'sortClasse', 'sortCategoria', 'sortTessera']
            };


            var userList = new List('divIscritti', options);



            //$('.mycheckbox').on('click', function (questo) {
            //console.log(questo);
            //ST.setData()
            // });
        },
        impaginaAbbinati: function (data) {
            var AC = AiroCola.stampa.TabellaAbbinati;
            var FE = AiroCola.stampa.Frontend;

            // Salva tutti i dati del parametro data in session 
            AiroCola.sessionTools.setData(data.data, AC.Nome);

            // impagina la tabella degli abbinati (verranno usati i dati in session);
            FE.refreshAbbinati();


            /*
             * Eventi dragover e dragleave per evidenziare il drag & drop
             */
            $('#' + AC.Nome + ' tr').on('dragleave', FE.removeDragOver);
            $('#' + AC.Nome + ' tr').on('dragover', FE.addDragOver);

            $('#' + AC.Nome + ' tr').on('drop', FE.dropPicture);



        },
        
        mostraAnteprima: function () {

            var totale = [];
            // Viene eseguito un ciclo su tutte le righe alla ricerca di quelle marcate per la stampa  
            $('.rigaElenco').each(function (x, qualcosa) {
                var pos = AiroCola.stampa.PosizioneElementi;
                var Selezionato = qualcosa.children[pos.Selezionato].children[0].checked;
                var Tessera = qualcosa.children[pos.Tessera].textContent;
                if (Selezionato) {
                    totale.push(parseInt(Tessera));
                }
            });
            var newUrl = totale.join(',');
            var testo = $.param({tessere: newUrl});

            AiroCola.Tools.OpenInNewTab(AiroCola.stampa.PaginaDiStampa + testo);

        },
        confermaStampa: function () {
            $('.rigaElenco').each(function (x, qualcosa) {
                var pos = AiroCola.stampa.PosizioneElementi;
                var Selezionato = qualcosa.children[pos.Selezionato].children[0].checked;
                var Tessera = qualcosa.children[pos.Tessera].textContent;
                if (Selezionato) {
                    AiroCola.stampa.Data.confermaStampato(Tessera, function(something){
                       console.log(something); 
                    });
                    $(this).remove();
                    //totale.push(parseInt(Tessera));
                    
                }
            });
            // refresh griglia
            AiroCola.stampa.Frontend.loadAll();
        },
        buttare_toggleMostraTutti: function () {
            $(this).button('toggle');
            // ricerca dell'attributo 'aria-pressed' nel pulsante Mostra / Nascondi. 
            var parm = $(this).attr('aria-pressed') == "true" ? 1 : 0;
            sessionStorage.setItem('MostraTutto', parm);
            //console.log($(this).attr('aria-pressed'));
            AiroCola.stampa.Frontend.loadAll();
        },
        
        toggleMostraStampati: function() {
            $(this).button('toggle');
            // ricerca dell'attributo 'aria-pressed' nel pulsante Mostra / Nascondi. 
            var f = AiroCola.stampa.Frontend;
            var parm = f.getMostraStampati();
            sessionStorage.setItem('MostraStampati', parm); 
            f.setMostraStampati(parm);
        },
        
        setMostraStampati: function(parm){
            if (parm===1) {
                $('.' + AiroCola.stampa.GiaStampato).fadeIn(100);
            } else {
                $('.' + AiroCola.stampa.GiaStampato).fadeOut(100);
            }
        
        },
        getMostraStampati: function() {
            return $('#showAll').attr('aria-pressed') == "true" ? 1 : 0;
        }
    }
};



$(document).ready(function () {
    // Caricamento della barra dei menù
    $('#header').load('headmenu.html');

    // Ridimensionamento della finestra
    var hFinestra = window.innerHeight;
    var hHeader = $("#header").height();
    var hFooter = $("#impaginaFooter").height();
    var hDiv = (hFinestra - (hHeader + hFooter + 70));

    $(".divAltezzaFissa").css("height", hDiv);

    var f = AiroCola.stampa.Frontend;
    // Caricamento dati
    f.loadAll();

    $('#printPreview').on('click', f.mostraAnteprima);

    // Gestione del pulsante "Mostra stampati" a caricamento. Utilizza la 
    // sessione per fare in modo che al refresh venga mantenuta
    // l'impostazione. Notare che per verificare lo stato, viene usato 
    // l'attributo "aria-pressed" che è specifico di bootstrap.
    //var status = parseInt(sessionStorage.getItem('MostraTutto'));
    var status = parseInt(sessionStorage.getItem('MostraStampati'));

    if (status === 1) {
        $('#showAll').button('toggle');
    }

    // Attiva la funzione "Mostra stampati" al click del pulsantes
   // $("#showAll").click(AiroCola.stampa.Frontend.toggleMostraTutti );
     $("#showAll").click(f.toggleMostraStampati );
    
    
    $("#confirmPrint").on('click', function() {
        var messaggio = "Le foto selezionate saranno marcate come 'Stampato' e saranno visiili solo se è attiva l'opzione 'Mostra stampati'. Confermi?";
        var titolo = "Conferma Stampa";
        AiroCola.Modal.showModalYesNo(messaggio, titolo, f.confermaStampa);
        
        
    
    });


});
