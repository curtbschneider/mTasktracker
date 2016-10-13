var Tasktracker = Tasktracker || {};

Tasktracker.LogModel = function (config) {
    "use strict";
    this.id = config.id;
    this.systemid = config.systemid;
    this.categoryid = config.categoryid;
    this.logged = config.logged;
    this.component = config.component;
    this.category = config.category;
    this.siteid = config.siteid;
    this.site = config.site;
    this.details = config.details;
    this.duration = config.duration;
};

Tasktracker.LogModel.prototype.isValid = function () {
    "use strict";
    if (this.id) {
        return true;
    }
    return false;
};

