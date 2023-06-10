var articlesArray = [];
var idArticle;

// DataTable Article
articlesTable =
    $('#article-datable').DataTable({
        "lengthMenu": [25, 50, 100],
        "dom": "<'row'<'col-xs-6 col-sm-4'l><'hidden-xs col-sm-4'><'col-xs-6 col-sm-4 Add-article'f>>" +
            "tr" +
            "<'row'<'col-12'p>>",
        language: {
            processing: "Traitement en cours...",
            search: "Recherche:",
            lengthMenu: "�lements affich�s: _MENU_",
            info: "",
            infoEmpty: "",
            infoFiltered: "",
            infoPostFix: "",
            loadingRecords: "Chargement en cours...",
            zeroRecords: "Aucun mail n'est trouv�.",
            emptyTable: "Aucun mail n'est trouv�.",
            paginate: {
                first: "Premier",
                previous: "Pr&eacute;c&eacute;dent",
                next: "Suivant",
                last: "Dernier"
                //loadingIndicator: true
            },
            aria: {
                sortAscending: ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre d�croissant"
            }
        },
        bAutoWidth: false,
        "deferLoading": 10,
        "deferRender": true,
        "aoColumns": [
            null,
            null,
            null, null,
            { "bSortable": false }
        ],
        "aaSorting": [],
        select: {
            style: 'single',
            selector: 'td:not(:last-child)'
        }
    });

// Render List Of Article
function renderArticlesDataTable(Articles) {
    articlesTable.clear();
    for (let item of Articles) {
        let newPrix = item.prix == 0 || item.prix == null ? "" : item.prix;
        let newdateFabrication = item.dateFabrication == null ? "" : moment(item.dateFabrication).format("YYYY-MM-DD");
        let tableRow = $(`
        <tr>
        <td>${item.designation}</td>
        <td>${item.categorie == null ? "" : item.categorie}</td>
        <td>${item.prix == 0 || item.prix == null ? "" : item.prix}</td>
        <td>${item.dateFabrication == null ? "" : moment(item.dateFabrication).format("DD/MM/YYYY")}</td>
        <td class="tools action-buttons" >
            <a href="#" class="green" onclick="AddUpdateArticle(${item.id},\`${item.designation}\`,'${item.categorie}',\`${newPrix}\`,\`${newdateFabrication}\`)" data-toggle="tooltip" data-placement="bottom" title="Modifier">
                <i class="ace-icon fa fa-edit bigger-130"></i>
            </a>
            <a href="#" class="red" onclick="DeleteArticle(${item.id})" data-toggle="tooltip" data-placement="bottom" title="Supprimer">
                <i class="ace-icon fa fa-trash-o bigger-140"></i>
            </a>
        </td>
    </tr>
   `);
        articlesTable.rows.add($(tableRow));
    }
    articlesTable.draw();
}

// Get ALL Article
function getAndRenderArticles() {
    $.ajax({
        url: `https://localhost:44310/api/Article`,
        method: "GET",
        dataType: "json",
    }).then(function (response) {
        if (response.success) {
            articlesArray= response.data;
            renderArticlesDataTable(articlesArray);
        }
        else {
            alertify.error(response.message);
        }
        return response;
    }).fail(function (response) {
        alertify.error("L'API de service n'est pas d�marr�e.");
    });
}
// Show ALL Article Added
getAndRenderArticles();
$(".Add-article").append(`
    <button style="margin: -34px auto" class="btn btn-sm btn-success pull-right" title="Ajouter" onclick="AddUpdateArticle(0)">
        <i class="fa fa-plus fa-x"></i>
    </button>
`);

// Show Popup Article
var AddUpdateArticle = (id, designation, categorie, prix, dateFabrication) => {
    idArticle = id;
    if (id == 0) {
        $('#Name-Article').html('Ajouter Article');
        $("#Designation").val("");
        $("#Categorie").val("");
        $("#Prix").val("");
        $("#DateFabrication").val("");
    }
    else {
        $('#Name-Article').html('Modifier Article');
        $("#Designation").val(designation);
        $("#Categorie").val(categorie);
        $("#Prix").val(prix);
        $("#DateFabrication").val(dateFabrication);
    }
    $("#ModalAddUpdateArticle").modal("show");
}

// Add or update Article
$(document).on("click", "#submitArticle", function (e) {
    e.preventDefault();
    if (!$('form#Article-form').valid()) {
        $(".error").html("Ce champ est obligatoire.");
        return false;
    }
    var formData = new FormData();
    if (![null, undefined].includes(idArticle)) {
        formData.append("Id", idArticle);
    }
    if (![null, undefined].includes($("#Designation").val())) {
        formData.append("Designation", $("#Designation").val());
    }
    if (![null, undefined].includes($("#Categorie").val())) {
        formData.append("Categorie", $("#Categorie").val());
    }
    if (![null, undefined].includes($("#Prix").val())) {
        formData.append("Prix", $("#Prix").val());
    }
    if (![null, undefined].includes($("#DateFabrication").val())) {
        formData.append("DateFabrication", $("#DateFabrication").val());
    }
    $.ajax({
        url: "https://localhost:44310/api/Article",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                $("#ModalAddUpdateArticle").modal("hide");
                alertify.success(response.message);
                let article = response.data;
                if (idArticle == 0) {
                    articlesArray.push(article);
                    renderArticlesDataTable(articlesArray);
                }
                else {
                    // get index
                    var index = articlesArray.findIndex(A => A.id == idArticle);
                    // update data;
                    articlesArray.splice(index, 1, article);
                    renderArticlesDataTable(articlesArray);
                }
            }
            else {
                alertify.error(response.message);
            }
        },
        error: function (response) {
            alertify.error(response.message);
        }
    });
});

// Delete Article
var DeleteArticle = (id) => {
    if (id != "" && id != undefined) {
        alertify.set({
            labels: {
                ok: "Supprimer",
                cancel: "Annuler"
            }
        });
        alertify.confirm("Voulez-vous supprimer cet article ?", function (e) {
            if (e) {
                $.ajax({
                    url: `https://localhost:44310/api/Article/${id}`,
                    method: "Delete",
                    success: function (response) {
                        if (response.success) {
                            alertify.success(response.message);
                            articlesArray = articlesArray.filter(A => A.id != id);
                            renderArticlesDataTable(articlesArray);
                        }
                        else {
                            alertify.error(response.message);
                        }
                    },
                    error: function (response) {
                        alertify.error(response.message);
                    }
                });
            }
        });
    }
}

// Close Popup Modal Article
$(".close-modal-article").on("click", function () {
    $("#Article-form")[0].reset();
    $("#ModalAddUpdateArticle").modal("hide");
});