// delete article
function showModelDeleteArticle(id) {
    sessionStorage.setItem("idArticle", id);
    $('#ModalDeleteArticle').modal('show');
}
function hideModelDeleteArticle() {
    $('#ModalDeleteArticle').modal('hide');
}
function DeleteArticle() {
    if (sessionStorage.getItem("idArticle") != 0 && sessionStorage.getItem("idArticle") != undefined) {
        var id = sessionStorage.getItem("idArticle");
        $.post("/Article/DeleteArticle", { id: id }, function (result) {
            if (result.success) {
                hideModelDeleteArticle();
                alertify.success(result.message);
                setTimeout(function () { location.reload(); }, 1000);
            }
            else {
                hideModelDeleteArticle();
                alertify.error(result.message);
            }
        });
    }
    else {
        alertify.error("Cannot delete this Article");
    }
}


// add article
function showModelAddArticle(id) {
    $('#ModalAddArticle').modal('show');
}
function hideModelAddArticle() {
    $('#ModalAddArticle').modal('hide');
}
function AddArticle() {
    class Article {
        Designation;
        Categorie;
        Prix;
        DateFabrication;
        constructor() {
            this.Designation = $("#Designation").val();
            this.Categorie = $("#Categorie").val();
            this.Prix = $("#Prix").val();
            this.DateFabrication = $("#DateFabrication").val();
        }
    }
    $.validator.unobtrusive.parse($("#form"));
    if ($(form).valid()) {
        $.post("/Article/AddArticle", { Article: new Article() }, function (result) {
            if (result.success) {
                hideModelAddArticle();
                alertify.success(result.message);
                setTimeout(function () { location.reload(); }, 1000);
            }
            else {
                hideModelAddArticle();
                alertify.error(result.message);
            }
        });
    }
    else {
        return false;
    }

}

// update article

function showModelUpdateArticle(id) {
    if (id != 0 && id != undefined) {
        $.get("/Article/GetArticle", { id: id }, function (result) {
            $("#updatedesignation").val(result.designation);
            $("#updatecategorie").val(result.categorie);
            $("#updateprix").val(result.prix);
            $("#updatedatefabrication").val(result.dateFabrication.substr(0, 10));
            sessionStorage.setItem("idArticle", id);
            $('#ModalUpdateArticle').modal('show');
        });

    }
    else {
        alertify.error("Cannot Show this Article");
    }
}
function hideModelUpdateArticle() {
    $('#ModalUpdateArticle').modal('hide');
}
function UpdateArticle() {
    class Article {
        Designation;
        Categorie;
        Prix;
        DateFabrication;
        constructor() {
            this.Designation = $("#updatedesignation").val();
            this.Categorie = $("#updatecategorie").val();
            this.Prix = $("#updateprix").val();
            this.DateFabrication = $("#updatedatefabrication").val();
        }
    }
    $.validator.unobtrusive.parse($("#formupdate"));
    if ($(formupdate).valid()) {
        if (sessionStorage.getItem("idArticle") != 0 && sessionStorage.getItem("idArticle") != undefined) {
            var id = sessionStorage.getItem("idArticle");
            $.post("/Article/UpdateArticle", { id: id, Article: new Article() }, function (result) {
                if (result.success) {
                    hideModelUpdateArticle();
                    alertify.success(result.message);
                    setTimeout(function () { location.reload(); }, 1000);
                }
                else {
                    hideModelUpdateArticle();
                    alertify.error(result.message);
                }
            });
        }
        else {
            alertify.error("Cannot update this Article");
        }

    }
    else {
        return false;
    }

}
