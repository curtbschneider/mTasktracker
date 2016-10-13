var Tasktracker = Tasktracker || {};

Tasktracker.dataContext = (function () {
    var ajaxServer;
    
    //Server calls 
    var getTaskElements = function (callback) {
        $.ajax({
            url: ajaxServer,
            type: "post",
            dataType: "json",
            data: {requested: "task-elements"},
            success: function (data, textStatus, jqXHR) {

                var syncResult = new Tasktracker.AjaxResult({
                    success: true,
                    errorThrown: null
                });

                callback(syncResult, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {


                var syncResult = new Tasktracker.AjaxResult({
                    success: false,
                    errorThrown: errorThrown
                });

                callback(syncResult, null);
            }
        });
    
    };
    
    var addTask = function (data, callback) {
        data.push({name: "requested", value: "add-task"});
        $.ajax({
            url: ajaxServer,
            type: "post",
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {

                var syncResult = new Tasktracker.AjaxResult({
                    success: true,
                    errorThrown: null
                });

                callback(syncResult, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {


                var syncResult = new Tasktracker.AjaxResult({
                    success: false,
                    errorThrown: errorThrown
                });

                callback(syncResult, null);
            }
        });
    
    };
    
    var updateTask = function (data, callback) {
        data.push({name: "requested", value: "update-task"});
        $.ajax({
            url: ajaxServer,
            type: "post",
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {

                var syncResult = new Tasktracker.AjaxResult({
                    success: true,
                    errorThrown: null
                });

                callback(syncResult, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {


                var syncResult = new Tasktracker.AjaxResult({
                    success: false,
                    errorThrown: errorThrown
                });

                callback(syncResult, null);
            }
        });
    
    };
    
    var showLog = function (data, callback) {
        data.push({name: "requested", value: "show-log"});
        $.ajax({
            url: ajaxServer,
            type: "post",
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {

                var syncResult = new Tasktracker.AjaxResult({
                    success: true,
                    errorThrown: null
                });

                callback(syncResult, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {


                var syncResult = new Tasktracker.AjaxResult({
                    success: false,
                    errorThrown: errorThrown
                });

                callback(syncResult, null);
            }
        });
        
    };
    
    var deleteLog = function (data, callback) {
        data.push({name: "requested", value: "delete-log"});        
        $.ajax({
            url: ajaxServer,
            type: "post",
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {

                var syncResult = new Tasktracker.AjaxResult({
                    success: true,
                    errorThrown: null
                });

                callback(syncResult, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {


                var syncResult = new Tasktracker.AjaxResult({
                    success: false,
                    errorThrown: errorThrown
                });

                callback(syncResult, null);
            }
        });
    };
    
    
    
    var init = function (config) {
        ajaxServer = config.serverUrl;
    };
    
    var public = {
        init: init,
        getTaskElements: getTaskElements,
        addTask: addTask,
        showLog: showLog,
        deleteLog: deleteLog,
        updateTask: updateTask
    };
    return public;
    
})();


