//const { type } = require("jquery");


var idFichier=0;
var updateFichier=(id)=>{
idFichier=id;
//$("#idFichier").val(id);
//$("#fileID").val(FileUrl);
}
var FichierArray=[];
var FileUrl="default";
$(document).on("click", "#submitFile", function (e) {
    
    var formData = new FormData();
    if (![null, undefined].includes(idFichier)) {
        formData.append("Id", idFichier);
    }
    if (![null, undefined].includes(FileUrl)) {
        formData.append("FileUrl", FileUrl);
    }
    if (![null, undefined].includes($('#fileID').val())) {
    var fileInput = $('#fileID')[0];
        var file = fileInput.files[0];
        formData.append("formFile", file);
    
    // if (![null, undefined].includes($("#fileID").val())) {
    //     formData.append("formFile", $("#fileID").val());
    // }
    
    $.ajax({
        url: "https://localhost:5001/api/Fichier",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,  
    });   
 }
});


//affichage des fichiers
 $.ajax({
    url: "https://localhost:5001/api/Fichier",
    method: "GET",
    dataType:"json",
}).then(function(response){
    if(response.success){
        let fichiers=[];
        fichiers=response.data;
        function addLigne(ligne){
            $("#FichierListe").html(`${ligne}`);
        }
        function lignFromObjetc(fichier){
        var fileName = fichier.fileUrl.substring(fichier.fileUrl.lastIndexOf("\\")+ 1);
        let ligne=`<tr id="${fichier.id}">
              <td> <button style="border: 0px;" onclick="download(${fichier.id})"><a style="color:darkblue;"   hre="${fichier.fileUrl}"afficher</a>${fileName}</button></td>
              <td> <button style="border: 0px;"><a style="color:darkblue;"   hre="${fichier.fileUrl}"afficher</a>${fichier.taille}</button></td>
              <td> <button style="border: 0px;"><a style="color:darkblue;"   hre="${fichier.fileUrl}"afficher</a>${fichier.format}</button></td>


              <td><button class="btn btn-danger" onclick="deleteFichier(${fichier.id})">Supprimer</button><button class="btn btn-primary" onclick="download(${fichier.id})">voir</button></td>
            </tr>`;
            return ligne;
        }
        let lignes="";
        for(let fichier of fichiers){
            lignes=lignes+lignFromObjetc(fichier);
           
        }
        addLigne(lignes);
    }
    else{
        alertify.error(response.message);
    }
}).fail(function(response){
    alertify.error("API n\'est pas demmare");
});

function download(id){
    $.ajax({
        url: `https://localhost:5001/api/Fichier/${id}`,
        method: "GET",
        dataType: "json",
       
    }).then(function(response){
        
        if(response.success){
          fichier=response.data;      
          fetch(fichier.url)
          .then(response => response.blob())
          .then(blob => {
        //    var link = window.document.createElement("a");
        //    link.href = window.URL.createObjectURL(blob, { type: fichier.contentType });
        //    document.body.appendChild(link);
        //    link.click();
        //   document.body.removeChild(link);

          var binary = new Blob([blob], {type: fichier.contentType});
          var Createurl = window.URL.createObjectURL(binary);
          $("#idIframe").attr('src',Createurl);    
         });
          $("#idIframe").css("display","block");
          document.getElementById('idIframe').style.width="700px;";
          document.getElementById('idIframe').style.width="800px;";
          document.getElementById('container').style.display="none";   
        }
        else
        {
            alertify.error(response.message);
        }
        return response;
    }).fail(function(response){
        alertify.error("L'API  de service n\'est pas demare.");
    });             
}


function deleteFichier(id){

$.ajax({
    url: `https://localhost:5001/api/Fichier/${id}`,
    method: "Delete", 
   });
   document.getElementById(id).style.display="none";

}

// function ConvertUrlToBlob(url){
//     fetch(url).
//     then(response =>{
//         console.log(response);
//     });
//     // then((blob)=>{
    
//     //     var binary= new Blob([blob], {type: '.pdf'});
//     //     var Createurl=URL.CreateUrl(binary);
//     //     document.getElementById("idIframe").src=Createurl;
        
//     // });
// }
