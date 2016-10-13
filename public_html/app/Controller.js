var Tasktracker = Tasktracker || {};

Tasktracker.controller = (function ($, dataContext) {
    var ajaxServer = "Tasktracker.php",
    // global lists and variables
    taskFormOptions,
    logEntriesList = [],
    currentEditTaskId,
    defaultDlgTrsn = { transition: "slideup" },
    // dialog boxes
    ajaxErrorDlg = "#data-error-dialog",
    inputErrorDlg = "#invalid-error-dialog",
    noRecordsDlg = "#empty-records-dialog",
    noChangeDlg = "#log-not-changed-dialog",
    // Selector variables
    logsListPageSel = "#logs-list-page",
    editLogPageSel = "#edit-log-page",
    confirmDeleteLogDlgSel = "#confirm-delete-log-dialog",
    menuPageId = "menu-page",
    addTasksPageId = "add-tasks-page",
    showLogsPageId = "show-logs-page",
    logsListPageId = "logs-list-page",
    upateTaskPageId = "edit-log-page",
    addTasksFormSel = "#add-task-form",
    updateTaskFormSel = "#edit-task-form",
    showLogFormSel = "#show-logs-form",
    logsListContentSel ="#logs-list-content",
    viewLogPageId = "view-log-page",
    reportsPageId = "reports-page",
    saveTaskButtonSel = "#save-task-button",
    taskDateSel = "#task-date",
    componentsListSel = ".components",
    categoriesListSel = ".categories",
    sitesListSel = ".sites",
    taskComponentSel = "#select-component",
    taskCategorySel = "#select-category",
    editComponentSel = "#edit-select-component",
    editCategorySel = "#edit-select-category",
    taskSiteSel = "#select-site",
    taskTimeSel = "#task-time",
    editSiteSel = "#edit-select-site",
    editTimeSel = "#edit-task-time",
    taskDetailsSel = "#task-details",
    editDetailsSel = "#edit-details",
    refreshButonSel = "#refresh-task",
    saveButtonSel = "#save-task-button",
    showLogsButtonSel = "#show-logs-btn",
    showLogsStartDateSel = "#log-start-date",
    showLogsEndDateSel = "#log-end-date",
    logListItemSel = ".log-list-item",
    deleteTaskButtonSel = "#delete-task",
    okToDeleteLogButtonSel = "#ok-to-delete-log-button",
    updateTaskButtonSel = "#update-task-button";
    
    // utility functions 
    var getToday = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd;
        } 
        if(mm<10) {
            mm='0'+mm;
        } 
        today = yyyy+'-'+mm+'-'+dd;
        return today;
    };
     
    var buildLogsList = function (logs) {
       var logsList = [],
       logsCount = logs.length,
       i,
       task;
       for (i = 0; i < logsCount; i += 1) {
           task = logs[i];
            var logModel = new Tasktracker.LogModel({
                id: task['id'],
                systemid: task['systemid'],
                categoryid: task['categoryid'],
                logged: task['logged'],
                component: task['component'],
                category: task['category'],
                siteid: task['siteid'],
                site: task['site'],
                details: task['details'],
                duration: task['duration']
            });           
            logsList.push(logModel);
        }
        return logsList;
    };
    
    var deleteLogFromList = function () {
        var i,
        logEntry;
        for (i = 0; i < logEntriesList.length; i += 1) {
          logEntry = logEntriesList[i];
          if(logEntry.id === currentEditTaskId) {
              logEntriesList.splice(i, 1);
              break;
          }
          
        }
    };
    
    var changeLogList = function (logData) {
        var i,
        logEntry;        
        var logModel = new Tasktracker.LogModel({
            id: logData['id'],
            systemid: logData['systemid'],
            categoryid: logData['catid'],
            logged: logData['logdate'],
            component: logData['component'],
            category: logData['category'],
            siteid: logData['siteid'],
            site: logData['site'],
            details: logData['details'],
            duration: logData['duration']
        });           
        for (i = 0; i < logEntriesList.length; i += 1) {
            logEntry = logEntriesList[i];
            if(logEntry.id === logModel.id) {
                logEntriesList.splice(i,1,logModel);
                break
            }
        }
    };
    
    // functions for changing the view
    var loadSiteSelection = function () {
        var html = '<option value="0">-Select-</option>';
        $.each(taskFormOptions.sites, function () {
            html += '<option value="'+this['id']+'">'+this['val']+'</option>';
        });
        $(sitesListSel).html(html);
    };
    
    var loadComponentSelection = function () {
        var html = '<option value="0">-Select-</option>';
        $.each(taskFormOptions.components, function () {
            html += '<option value="'+this['id']+'">'+this['val']+'</option>';
        });
        $(componentsListSel).html(html);
    };    
    
    var renderLogsList = function () {
       // de-reference this each time the log list is displayed
       currentEditTaskId = null;
       var view = $(logsListContentSel),
       logsCount = logEntriesList.length,
       liArray = [],
       liHtml = "",
       i,
       logDate,
       dateParts,
       groupDate,
       task,
       ul;
       view.empty();
       ul = $("<ul id=\"logs-list\" data-role=\"listview\"data-divider-theme=\"c\"></ul>").appendTo(view);

            for (i = 0; i < logsCount; i += 1) {
                task = logEntriesList[i];
                console.log(task);
                dateParts = task.logged.split('-');
                logDate = (new Date(dateParts[0],dateParts[1]-1,dateParts[2])).toDateString();
                if (logDate !== groupDate) {
                    groupDate = logDate;
                    liArray.push("<li data-role=\"list-divider\">" + logDate + "</li>");
                }
                liHtml = "<li>"
                + "<a href=\"index.html#edit-log-page?id=" + task.id + "\">" 
                + "<div class=\"log-list-item\">"
                + "<h4>" + task.site + "<h4>"
                + "<div>" + task.category + "</div>"
                + "<p>" + task.details + "</p>"
                + "<p class=\"ui-li-aside\">"+ task.duration + "&nbspmin" + "</p>"
                + "</div>"
                + "</a>"
                + "</li>";
                liArray.push(liHtml);
            }
            var listItems = liArray.join("");
            $(listItems).appendTo(ul);
            ul.listview();
            ul.listview('refresh', true);
    };
    
    
    var initEditCategories = function () {
        var logsCount = logEntriesList.length,
        i,
        j,
        task,
        componentId,
        categoryVal,
        categoryId,
        categoryComponentKey,
        html = '<option value="0">-Select-</option>';
        for (i = 0; i < logsCount; i += 1) {
            task = logEntriesList[i];
            if (task.id === currentEditTaskId) {
                componentId = task.systemid;
                for (j = 0; j < taskFormOptions.categories.length; j++ ) {
                    categoryId = taskFormOptions.categories[j]['id'];
                    categoryVal = taskFormOptions.categories[j]['val'];
                    categoryComponentKey = taskFormOptions.categories[j]['componentId'];
                    if (componentId === categoryComponentKey) {
                        html += '<option value="'+categoryId+'">'+categoryVal+'</option>';
                    }
                }
                $(editCategorySel).html(html).selectmenu();
                break;
            }
        }
    };
    
    
    
    var loadLogEditForm = function () {
        $(editSiteSel).selectmenu();
        $(editTimeSel).selectmenu();
        $(editComponentSel).selectmenu();
        var logsCount = logEntriesList.length,
        i,
        taskId,
        task;
        for (i = 0; i < logsCount; i += 1) {
            task = logEntriesList[i];
            if (task.id === currentEditTaskId) {
                $(editDetailsSel).val(task.details);
                $(editTimeSel).val(task.duration).selectmenu("refresh", true);
                $(editSiteSel).val(task.siteid).selectmenu("refresh", true);
                $(editComponentSel).val(task.systemid).selectmenu("refresh", true);
                $(editCategorySel).val(task.categoryid).selectmenu("refresh", true);
                break;
            }
        }
        //$.mobile.changePage(editLogPageSel, defaultDlgTrsn);
    };
    
    
    
    
    // callbacks passed to dataContext module
    var taskElementsCompleted = function (ajaxResult, data) {
        if (ajaxResult.success !== true) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        } else {
            taskFormOptions = data;
            loadSiteSelection();
            loadComponentSelection();
            $(taskDateSel).val(getToday());
            $(taskDetailsSel).val("");
        }
           
   }; 
    
   var addTaskCompleted = function (ajaxResult, data) {
       $.mobile.loading( 'hide' ); 
       if (ajaxResult.success !== true) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        }
        if (data.status === false) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        }
   };
    
    var updateTaskCompleted = function (ajaxResult, data) {
        $.mobile.loading( 'hide' ); 
       if (ajaxResult.success !== true) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        }
        else if (data.status === false) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        } else {
            changeLogList(data.log);
            renderLogsList();
            $.mobile.changePage(logsListPageSel, defaultDlgTrsn);
        }
       
    };
   
   var showLogsCompleted = function (ajaxResult, data) {
       $.mobile.loading( 'hide' );
       //create the log entries in the logs container
        if (ajaxResult.success !== true) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
            logEntriesList = [];
        }
        else if (data.status === false) {
            $.mobile.changePage(noRecordsDlg, defaultDlgTrsn);
            logEntriesList = [];
        } else {
            //logEntriesList = data.logs;
            logEntriesList = buildLogsList(data.logs);
            renderLogsList();
            $.mobile.changePage(logsListPageSel, defaultDlgTrsn);
        }
   };
   
   var deleteLogCompleted = function (ajaxResult, data) {
       $.mobile.loading( 'hide' ); 
       if (ajaxResult.success !== true) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        }
        else if (data.status === false) {
            $.mobile.changePage(ajaxErrorDlg, defaultDlgTrsn);
        } else {
            deleteLogFromList();
            renderLogsList();
            $.mobile.changePage(logsListPageSel, defaultDlgTrsn);
        }
       
   };
   // end callbacks passed to datacontext module

 
   var resetFormControls = function () {
        $(taskDetailsSel).val("");
        $(taskDateSel).val(getToday());
        $(taskComponentSel).val("0").attr('selected', true).siblings('option').removeAttr('selected');
        $(taskCategorySel).val("0").attr('selected', true).siblings('option').removeAttr('selected');
        $(taskSiteSel).val("0").attr('selected', true).siblings('option').removeAttr('selected');
        $(taskTimeSel).val("0").attr('selected', true).siblings('option').removeAttr('selected');
        $(taskComponentSel).selectmenu("refresh", true);
        $(taskCategorySel).selectmenu("refresh", true);
        $(taskSiteSel).selectmenu("refresh", true);
        $(taskTimeSel).selectmenu("refresh", true);
        return false;
   }; 
    
    
    // event callbacks
    var initTaskElements = function () {
        dataContext.getTaskElements(taskElementsCompleted);
    };
    
//    var onBeforePageShow = function () {
//        var activePage = $.mobile.activePage.attr("id");
//        
//        switch (activePage) {
//            case upateTaskPageId:
//                alert("this worked");
//                //var ID = getUrlVars()["id"];
//                //alert(ID);
//                break;
//        }
//        
//    };
    
    
    var onRefreshButtonTap = function () {
        resetFormControls();
    };
    
    var onSaveButtonTap = function () {
        if (validateAddForm()) {
          var loaderOptions = { text: "Saving task", textVisible: true, theme: 'b'};
          $.mobile.loading( 'show', loaderOptions);
          var data = $(addTasksFormSel).serializeArray();
          dataContext.addTask( data, addTaskCompleted);
            
        } else {
            $.mobile.changePage(inputErrorDlg, defaultDlgTrsn);
        }
        
    };
    
    
    var onShowLogsButtonTap = function () {
        if (validateShowLogForm()) {
            var loaderOptions = { text: "Retrieving logs", textVisible: true, theme: 'b'};
            $.mobile.loading( 'show', loaderOptions);
            var data = $(showLogFormSel).serializeArray();
            dataContext.showLog( data, showLogsCompleted);
        } else {
            $.mobile.changePage(inputErrorDlg, defaultDlgTrsn);
        }
    };
    
    var onComponentChange = function (componentId) {
        if (componentId === "select-component") {
            var componentIdSelected = $(taskComponentSel).val();
            var categoryListBox = $(taskCategorySel);
        } else {
            var componentIdSelected = $(editComponentSel).val();
            var categoryListBox = $(editCategorySel);
        }
        var i;
        var html = '<option value="0">-Select-</option>';
        for (i = 0; i < taskFormOptions.categories.length; i++ ) {
            var id = taskFormOptions.categories[i]['id'];
            var val = taskFormOptions.categories[i]['val'];
            var componentId = taskFormOptions.categories[i]['componentId'];
            if (componentId === componentIdSelected) {
                html += '<option value="'+id+'">'+val+'</option>';
            }
        }
        categoryListBox.html(html).selectmenu('refresh', true);
        return false;
    };
    
    var onUpdateTaskButtonTap = function () {
        if (validateUpdateForm() === 0) {
          var loaderOptions = { text: "Updating task", textVisible: true, theme: 'b'};
          $.mobile.loading( 'show', loaderOptions);
          var data = $(updateTaskFormSel).serializeArray();
          data.push({name:"logid", value:currentEditTaskId});
          dataContext.updateTask( data, updateTaskCompleted);
            
        } else if (validateUpdateForm() === 1) {
            $.mobile.changePage(inputErrorDlg, defaultDlgTrsn);
        } else {
            $.mobile.changePage(noChangeDlg, defaultDlgTrsn);
        }
    };
    
    var onDeleteTaskButtonTap = function () {
        if (currentEditTaskId) {
            $.mobile.changePage(confirmDeleteLogDlgSel, defaultDlgTrsn);
        }
    };
    
    var onOKToDeleteLogButtonTapped = function () {
       var loaderOptions = { text: "Deleting Task", textVisible: true, theme: 'b'};
       $.mobile.loading( 'show', loaderOptions);
       var data = [{name:"logid", value:currentEditTaskId}];
       dataContext.deleteLog( data, deleteLogCompleted);
    };
    
    // end event callbacks   
    
    // validation functions for forms submission
    var validateAddForm = function () {
        var taskdate = $(taskDateSel).val();
        var taskcomponent = $(taskComponentSel).val();
        var taskcategory = $(taskCategorySel).val();
        var tasksite = $(taskSiteSel).val();
        var tasktime = $(taskTimeSel).val();
        var taskdetails = $(taskDetailsSel).val();
        var regExp = /^(20[0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/;
        
        if (regExp.test(taskdate) === false){
            return false;
        }
        if (taskcomponent === '0' || tasksite === '0' || taskcategory === '0' || tasktime === "0") {
                return false;
        }
        return true;
    };
    
    var validateShowLogForm = function () {
        var taskStart = $(showLogsStartDateSel).val();
        var taskEnd = $(showLogsEndDateSel).val();
        var regExp = /^(20[0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/;
        
        if (regExp.test(taskStart) === false || regExp.test(taskEnd) === false){
            return false;
        }
        
        if (new Date(taskStart) > new Date(taskEnd)) {
            return false;
        }
        
        return true;
    };
    
     var validateUpdateForm = function () {
        var i,
        log;
        var taskcomponent = $(editComponentSel).val();
        var taskcategory = $(editCategorySel).val();
        var tasksite = $(editSiteSel).val();
        var tasktime = $(editTimeSel).val();
        var taskDetails = $(editDetailsSel).val();
        if (taskcomponent === '0' || tasksite === '0' || taskcategory === '0' || tasktime === "0") {
                return 1;
        }
        // if nothing has changed
        for (i = 0; i < logEntriesList.length; i += 1) {
            log = logEntriesList[i];
            if (log.id === currentEditTaskId) {
                if (taskcomponent === log.systemid && tasksite === log.siteid && taskcategory === log.categoryid && tasktime === log.duration && taskDetails === log.details) {
                    return 2;
                }
            }
        }
         
         return 0;
    };
    
    // controller init function
    
    var init = function () {
        dataContext.init({ 
            serverUrl: ajaxServer
        });
        var d = $(document);
        defaultLoadingMsg = $.mobile.loadingMessage;
        initTaskElements();
        d.delegate(refreshButonSel, "tap", onRefreshButtonTap);
        d.delegate(saveButtonSel, "tap", onSaveButtonTap);
        d.delegate(showLogsButtonSel, "tap", onShowLogsButtonTap);
        //d.bind("pagebeforeshow", onBeforePageShow);
//        d.on('pagebeforeshow', upateTaskPageSel, function () {
//            //var parameters = $(this).data("url").split("?")[1];
//            var parameters = $(this).data("url");
//            //parameter = parameters.replace("paremeter=","");  
//            alert(parameters);
//        }); 
        
        d.on("pagecontainerbeforetransition", function (e, data){
            if ($.type(data.toPage) !== "undefined" && $.type(data.absUrl) !== "undefined" && data.toPage[0].id == upateTaskPageId) {
                var parsed = $.mobile.path.parseUrl(data.absUrl),
                hash = parsed.hash.split("?"),
                logId = hash[1].split("=")[1];
                if (logId !== undefined) {
                    currentEditTaskId = logId;
                    initEditCategories();
                    loadLogEditForm();
                }
            }
        });
        
        
        
        
        
        
        d.delegate(componentsListSel, "change", function () {
            //which components list?
            var whichComponent = $(this).attr('id');
            onComponentChange(whichComponent);
        });
        d.delegate(updateTaskButtonSel, "tap", onUpdateTaskButtonTap);
        d.delegate(deleteTaskButtonSel, "tap", onDeleteTaskButtonTap);
        d.delegate(okToDeleteLogButtonSel, "tap", onOKToDeleteLogButtonTapped);    
    };
    
    var public = {
        init: init
    };
    
    return public;
    
})(jQuery, Tasktracker.dataContext);

$(document).bind("mobileinit", function (){
    Tasktracker.controller.init();
});