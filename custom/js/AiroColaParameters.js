/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/** @namespace Namespace for AiroCola classes and functions. */
var AiroCola = AiroCola || {};



AiroCola.parameters = {
    /*
     * Elenco dei parametri generici 
     */
    
    ApiRemoteServerName: "http://airolandia/airo/api/",
    RemoteServerImages: "http://airolandia/airo/immagini/foto/",
    RemoteServerImagesToSet: "http://airolandia/airo/immagini/fotononassociate/",
    
    getImagePathReady: function(){
        return this.RemoteServerImages;
    },
    getImagePathToSet: function(){
        return this.RemoteServerImagesToSet;
    },
    Abbinamento: {
        MostraAnnullo: true
    }
    
};
