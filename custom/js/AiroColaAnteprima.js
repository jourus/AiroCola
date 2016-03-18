
var AiroCola = AiroCola || {};


AiroCola.Anteprima = {
    Data: {
        loadDataArciere: function (tessera, funzione) {
            var datastring = AiroCola.api_tools._prepareMethodAndParms("arcieriabbinati", {tessera: tessera});
            $.ajax({type: "GET",
                dataType: 'json',
                url: AiroCola.parameters.ApiRemoteServerName,
                data: datastring,
                async: false,
                crossDomain: true}
            ).done(funzione);
        }
    },
    Snipets: {
        getFotoFrame: function (nome, cognome, classe, categoria, luogo, data, foto, riga) {

            var snipet = "<div class='contenitore'>";
            snipet += "<div class='foto'> <img src='" + AiroCola.parameters.RemoteServerImages + foto + "' alt='" + foto + "'/></div>";
            snipet += "<div class='stemma'><img class='imgStemma' src='img/LogoAiro.png' alt='Stemma'/><div class='classecat'>" + classe + " " + categoria + "</div></div>";
            snipet += "<div class='dettagli'>";
            snipet += "<div class='testi'>";

            snipet += "<div id='stampaArciere" + riga + "' class='stampaArciere'>" + AiroCola.Tools.capitalize(nome) + " " + AiroCola.Tools.capitalize(cognome) + "</div>";
            snipet += "<div class='stampaCompagnia'>Arcieri dell'Airone</div>";
            snipet += "<div class='stampaLuogo'>" + luogo + ", " + data + "</div>";

            snipet += "</div>";
            snipet += "<div class='cleardiv'></div>";
            snipet += "</div>";
            snipet += "</div>";
            return snipet;
        },
        getSeparatoreV: function () {
            var snipet = "<!-- INIZIO - Questo blocco serve per inserire le linee verticali di taglio -->";
            snipet += "<div class= 'verticale'>";
            snipet += "<div class='vert-scuro'></div>";
            snipet += "<div class='vert-chiaro'></div>";
            snipet += "<div class='vert-scuro'></div>";
            //snipet += "<div class='vert-scuro'></div>";
            snipet += "</div>";
            snipet += "<!-- FINE - Questo blocco serve per inserire le linee verticali di taglio -->";
            return snipet;
        },
        getSeparatoreO: function () {

            var snipet = "<!-- INIZIO - Questo blocco serve per inserire le linee orizzontali di taglio -->";
            snipet += "<div class='orizzontale'>";
            snipet += "<div class='orizz-scuro'></div>";
            snipet += "<div class='orizz-chiaro'></div>";
            snipet += "<div class='orizz-scuro'></div>";
            snipet += "<div class='orizz-chiaro'></div>";
            snipet += "<div class='orizz-scuro'></div>";
            snipet += "</div>";
            snipet += "<!-- FINE - Questo blocco serve per inserire le linee orizzontali di taglio -->";
            return snipet;
        },
        getSaltoPagina: function () {
            var snipet = "<div class='saltoPagina'></div>";
            return snipet;
        }
    },
    Impagina: function ()
    {
        // Tutti i tasselli verranno accodati al DIV "stampami"
        var target = '#stampami';

        // var listaTessere = $.param({tessere: "27247,11359,15837,20013,20433,11359,15837,20013,20433,20434"});
        // var result = AiroCola.Tools.deparams(listaTessere);
        var result = AiroCola.Tools.getQueryStringParam('tessere');
        
        

        if (result===null || result == "") {
            return;
        }
        $('.nessunaFoto').remove();
            
        var parametri = result.split(',');
        //  console.log(parametri);
        var sepO = AiroCola.Anteprima.Snipets.getSeparatoreO();
        var sepV = AiroCola.Anteprima.Snipets.getSeparatoreV();
        var saltoPagina = AiroCola.Anteprima.Snipets.getSaltoPagina();
        var myparm = parametri.length;
        //   $(target).append(saltoPagina);
        $(target).append(sepO);
        for (var x = 0; x < myparm; x++)
        {
            var arciere = {Nome: "", Cognome: "", Classe: "", Categoria: "", Foto: ""};
            AiroCola.Anteprima.Data.loadDataArciere(parametri[x], function (data) {
                arciere = data.data[0];
            });

            var snipet = AiroCola.Anteprima.Snipets.getFotoFrame(arciere.Nome, arciere.Cognome, arciere.Classe, arciere.Categoria, "Bisnate", AiroCola.Date.formatDate(), arciere.Foto, x);

            $(target).append(sepV);
            $(target).append(snipet);

            // Ogni due foto viene aggiunta la riga di separazione orizzontale di stampa
            if (!AiroCola.Tools.isPair(x)) {
                $(target).append(sepV);
                $(target).append(sepO);
            }

            // Ogni 4 foto viene aggiunto il salto pagina
            if ((x + 1) % 4 === 0) {
                //  $(target).append(saltoPagina);
                $(target).append(saltoPagina);
                $(target).append(sepO);
            }

        }
        if (!AiroCola.Tools.isPair(x)) {
            $(target).append(sepV);
            $(target).append(sepO);

        }

    }
};

$(document).ready(function () {

    $('#printButton').on('click', function () {
        AiroCola.Tools.printDiv('stampami');
    });
    
    $('#closeButton').on('click', function () {
        AiroCola.Tools.closeTab();
    });
        
    
    AiroCola.Anteprima.Impagina();

});


            