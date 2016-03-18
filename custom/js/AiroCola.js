/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";


/** @namespace Namespace for MYAPP classes and functions. */
var AiroCola = AiroCola || {};





/*
 * Funzioni di manipolazione delle stringhe
 * @namespace AiroCola
 * @class string_tools
 * @type {type}
 */

AiroCola.api_tools = {
    defaultOutputFormat: "json",
    _prepareMethodAndParms: function (method, parms) {

        //   var result = "method=" + method + "&format=" + this.defaultOutputFormat;


        parms.method = method;
        parms.format = this.defaultOutputFormat;
        var result = $.param(parms);



        /*          //Ho scoperto che lo fa jQuery! :)
         
         var parmString = $.param(parms);
         if (parmString.length>0) {
         result +=  "&" + parmString;
         }
         var myParm = Object.keys(parms);
         
         
         for (var ix = 0; ix < myParm.length; ix++) {
         var key = myParm[ix];
         var data = parms[key];
         result += "&" + key + "=" + data;
         
         }*/

        return result;

    }

};


AiroCola.Tools = {
    
        
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    },

    
    /*
     * @param {String} divName
     * @function printDiv;
     * Stampa il contenuto del div passato come parametro
     */
    printDiv: function (divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    },
    /*
     * Chiude la tab corrente
     * @returns {undefined}
     */
    closeTab: function () {
        if (confirm("Close Window?")) {
            close();
        }
    },
    /*
     * Apre l'url passato in una nuova tab del browser.
     * @param {type} url
     * @returns 
     */
    OpenInNewTab: function (url) {
        var win = window.open(url, '_blank');
        win.focus();
    },
    /*
     * Determina se "numero" è pari
     * @param numero {Numeric}
     * @return boolean
     */

    isPair: function (numero) {
        if (isNaN(numero) === false)
        {
            return (numero % 2 === 0 ? true : false);
        } else
        {
            return null;
        }

    },
    deparams: function (str) {

        var parametri = str || document.search.slice(1);
        var pairs = parametri.split('&');
        var result = {};


        pairs.forEach(function (pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return result;
    },
    getTRId: function (element) {

        var nextObj = element;
        while (!nextObj.hasAttribute('id') && nextObj.nodeName != 'BODY') {
            nextObj = nextObj.parentElement;
        }
        if (nextObj.hasAttribute('id')) {
            return nextObj.id;
        } else {
            return "";
        }

    },
    capitalize: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    /*
     * Dato un oggetto riga, ne estrae la parte numerica e calcola l'id dell'oggetto figlio
     * @param {string} id -> ID dell'oggetto padre
     * @param {string} nome -> prefisso dell'oggetto figlio
     * @return {string} -> ID Completo dell'oggetto figlio.
     */
    getObjectIDByRow: function (id, nome) {
        return nome + AiroCola.Tools.getRowID(id);
    },
    /*
     * Determina il pregressivo numerico a partire dall'oggetto passato con id in formato stringa_numero
     * @param {string} idOggetto
     * @return {Number}
     */
    getRowID: function (idOggetto) {
        var idRiga = -1;
        var lenOggetto = idOggetto.length;

        if (lenOggetto) {

            var pos = idOggetto.search(/_/) + 1;
            var len = lenOggetto - pos;
            idRiga = parseInt(idOggetto.substr(pos, len));
            if (idRiga < 0) {
                console.log("getRowID: L'oggetto è ->'" + idOggetto + "'");
            }
        }



        return idRiga;
    },
    getQueryStringParam: function (ParamName) {
        // Memorizzo tutta la QueryString in una variabile
        var QS = window.location.toString();
        // Posizione di inizio della variabile richiesta
        var indSta = QS.indexOf(ParamName);
        // Se la variabile passata non esiste o il parametro è vuoto, restituisco null
        if (indSta === -1 || ParamName === "")
            return null;
        // Posizione finale, determinata da una eventuale &amp; che serve per concatenare più variabili
        var indEnd = QS.indexOf('&amp;', indSta);
        // Se non c'è una &amp;, il punto di fine è la fine della QueryString
        if (indEnd === -1)
            indEnd = QS.length;
        // Ottengo il solore valore del parametro, ripulito dalle sequenze di escape
        var valore = unescape(QS.substring(indSta + ParamName.length + 1, indEnd));
        // Restituisco il valore associato al parametro 'ParamName'
        return valore;
    }
},
AiroCola.Date = {
    /*
     * Formatta una data in italiano gg mese(esteso) anno. Es. 21/12/2010 -> 21 dicembre 2010
     * Se non viene passato nessun parametro, prende di default la data corrente.
     * @namespace AiroCola.Date
     * @param {type} giorno
     * @returns {String}
     */
    formatDate: function (giorno) {
        var arrMese = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        //giorno = giorno || Date();
        var myDate = new Date(giorno || Date());
        var day = myDate.getDate();
        var year = myDate.getFullYear();
        var monthN = myDate.getMonth();
        var month = arrMese[monthN];
        return day + ' ' + month + ' ' + year;
    }

},
AiroCola.sessionTools = {
    
    
    setItemValue: function(tablename, id, element, value) {
        var data = JSON.parse(sessionStorage[tablename]);
        var row = data[id];
        row[element] = value;
        sessionStorage[tablename] =  JSON.stringify(data);
        
    },
    
    getRow: function (tableName, id) {
        var raw = sessionStorage.getItem(tableName);
        var source = JSON.parse(raw);
        var row = this.findByID(source, id);
        return source[row];
    },
    setData: function (data, name) {

        var memo = [];
        $.each(data, function (key, val) {
            var mySet = val;
            mySet.ID = key;

            memo.push(mySet);

        });
        sessionStorage.setItem(name, JSON.stringify(memo));

    },
    setDataArr: function (data, name) {

        var memo = [];
        $.each(data, function (key, val) {
            var mySet = {Name: val};
            mySet.ID = key;

            memo.push(mySet);

        });
        sessionStorage.setItem(name, JSON.stringify(memo));

    },
    getData: function (name) {

        var data = sessionStorage.getItem(name);
        return JSON.parse(data);

    },
    /*
     * Rimuove un oggetto da un array di oggetti salvati in session cercandolo per ID. 
     * Restituisce true se è riuscito, false se qualcosa non ha funzionato (es. non trova l'ID).
     * @param {Array} dataset --> Oggetto a cui rimuovere la riga;
     * @param {numeric} row --> ID della Riga da eliminare
     * @returns {Boolean}
     */
    removeByID: function (dataset, row) {
        var archive = sessionStorage;

        var rawData = archive.getItem(dataset);

        if (rawData !== undefined) {
            var obj = JSON.parse(rawData);
            if (Array.isArray(obj)) {
                var riga = AiroCola.sessionTools.findByID(obj, row);
                if (riga >= 0) {
                    obj.splice(riga, 1);
                    archive.setItem(dataset, JSON.stringify(obj));
                    return true;
                }

            }
        }
        return false;
    },
    /*
     * Trova l'indice di un oggetto da trovare all'interno dell'array di oggetti identificati con il campo ID
     * @param {array} source --> l'array in cui ricercare
     * @param {numeric} key --> La chiave da trovare (ID)
     * @returns {Number} --> l'indice reale dell'array
     */
    findByID: function (source, key) {
        for (var i = 0; i < source.length; i++) {
            if (source[i].ID === key) {
                return i;
            }
        }
        return -1;
    },
    getRowEx: function (dataset, target) {
        var T = AiroCola.Tools;
        var idRiga = T.getRowID(T.getTRId(target));
        var riga = AiroCola.sessionTools.getRow(dataset, idRiga);
        return riga;

    }
    
    
    
},
        

AiroCola.Modal = {
    ShowModalParm: function (title, body, buttons, size) {
        this.Title = title;
        this.Body = body;

        if (Array.isArray(buttons)) {
            this.Buttons = buttons;
        } else {
            this.Buttons = [];
            this.Buttons.push(buttons);
        }

        this.Size = size;
    },
    // var ShowModalParm = {Title: '', Body: '', Buttons: [], Size: ''};
    //  var ShowModalParmButton = {Text: '', ID: '', Event: null, Action: "data-dismissal = 'modal'"};
    ShowModalParmButton: function (text, id, event, action) {
        this.ID = id;
        this.Text = text;
        if (action === null || action === undefined || action === '') {
            action = "data-dismissal = 'modal'";
        }
        this.Action = action;
        this.Event = event;
    },
    showModal: function (parm) {
        var modalName = 'myModal';
        var modalControl = '#' + modalName;

        $(modalControl).remove();

        var htmlSnipet = "    <!-- Modal --> ";
        htmlSnipet += "<div class='modal fade' id='" + modalName + "' role='dialog'>";
        htmlSnipet += "<div class='modal-dialog'>";
        htmlSnipet += "<!-- Modal content-->";
        htmlSnipet += "<div class='modal-content'>";
        htmlSnipet += "<div class='modal-header'>";
        htmlSnipet += "<button type='button' class='close' data-dismiss='modal'>&times;</button>";
        htmlSnipet += "<h4 class='modal-title'>" + parm.Title + "</h4>";
        htmlSnipet += "</div>";
        htmlSnipet += "<div class='modal-body'>";
        htmlSnipet += "<p>" + parm.Body + "</p>";
        htmlSnipet += "</div>";
        htmlSnipet += "<div class='modal-footer'>";

        htmlSnipet += "</div>";
        htmlSnipet += "</div>";
        htmlSnipet += "</div>";

        $('body').append(htmlSnipet);

        parm.Buttons.forEach(function (key, data) {
         //   console.log(key);

            htmlSnipet = "<button id='" + key.ID + "' type='button' class='btn btn-default' data-dismiss='modal'>" + key.Text + "</button>";
            $('.modal-footer').append(htmlSnipet);

            //  htmlSnipet += "<button id='" + key.ID + "' type='button' class='btn btn-default' data-dismiss='modal'>"   + key.Text + "</button>";
            $('#' + key.ID).on('click', key.Event);
            //if ()
        });

        $(modalControl).modal();
    },
    showModalYesNo: function (message, title, funcYes, funcNo) {
        var buttons = [];
        var AC = AiroCola.Modal;

        buttons.push(new AC.ShowModalParmButton("Si", AiroCola.Tools.guid(), funcYes));
        buttons.push(new AC.ShowModalParmButton("No", AiroCola.Tools.guid(), funcNo));

        var parm = new AC.ShowModalParm(title, message, buttons, 2)
        AC.showModal(parm);
    }

};






var OLDAiroCola = OLDAiroCola || {};

OLDAiroCola.abbinamento_foto = {
    loadPiazzole: function (piazzolaDa, piazzolaA, funzione) {
        var datastring = AiroCola.api_tools._prepareMethodAndParms("piazzole", {min: piazzolaDa, max: piazzolaA});
        $.ajax({type: "GET",
            dataType: 'json',
            url: AiroCola.parameters.ApiRemoteServerName,
            data: datastring,
            crossDomain: true}
        ).done(funzione);
    },
    loadIscrittiDaAbbinare: function (funzione) {
        var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieridaabbinare", {min: 1, max: 2});
        $.ajax({type: "GET",
            dataType: 'json',
            url: AiroCola.parameters.ApiRemoteServerName,
            data: datastring,
            crossDomain: true}
        ).done(funzione);
    },
    abbinaTesseraAFoto: function (nTessera, nomeFoto, funzione) {
        var datastring = AiroCola.api_tools._prepareMethodAndParms("abbinafoto", {foto: nomeFoto, tessera: nTessera});
        $.ajax({type: "GET",
            dataType: 'json',
            url: AiroCola.parameters.ApiRemoteServerName,
            data: datastring,
            async: false,
            crossDomain: true}
        ).done(funzione).fail(function (data) {
            console.log("errore");
            console.log(data.promise.responseText);
        });
    },
    loadFotoDaAssociare: function (funzione) {
        var datastring = AiroCola.api_tools._prepareMethodAndParms("fotodaassociare", Array());
        $.ajax({type: "GET",
            dataType: 'json',
            url: AiroCola.parameters.ApiRemoteServerName,
            data: datastring,
            crossDomain: true}
        ).done(funzione);
    }
};
