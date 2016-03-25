var permission = {
    camera: function (cameraSuccessCallback, cameraErrorCallback) {
        var permissions = window.plugins.permissions;
        permissions.hasPermission(checkPermissionCallback, cameraErrorCallback, permissions.CAMERA);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    cameraErrorCallback();
                };

                permissions.requestPermission(function (status) {
                    if (!status.hasPermission) {
                        errorCallback();
                    } else {
                        cameraSuccessCallback();
                    }
                }, errorCallback, permissions.CAMERA);
            } else {
                cameraSuccessCallback();
            }
        }
    }
};
