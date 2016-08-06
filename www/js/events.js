document.addEventListener('deviceready', function () {
    document.addEventListener('backbutton', function (e) {
        console.log('cordova: event: back', e);
        if (!biblio || !biblio.back) return true;
        if (biblio.back.length == 0) {
            navigator.Backbutton.goHome(function () {
                console.log('success')
            }, function () {
                console.log('fail')
            });
        }
        e.stopPropagation();
        e.preventDefault();

        var page = biblio.back.pop();
        if (page) {
            $.mobile.changePage(page, {transition: "slide", reverse: true});
            if (page == "#pageBooks") {
                biblio.back = [];
            }
        }
        return false;
    }, false);
}, false);