document.addEventListener('deviceready', function () {
    document.addEventListener('backbutton', function (e) {
        console.log('cordova: event: back', e);
        if (!biblio || !biblio.back) return true;

        e.stopPropagation();
        e.preventDefault();

        $.mobile.navigate(biblio.back.pop());
        return false;
    }, false);
}, false);