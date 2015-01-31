
/**
    Parameters:
        pages (array of DialogPage)
        defaultCloseAction (DialogAction) [optional] - is triggered when the dialog is closed
                                                       can be overriden by DialogPageOption
                                                       can be null
*/
function Dialog(pages, defaultCloseAction){
    this.pages = pages;
    this.closeAction = null;
    if(typeof defaultCloseAction !== 'undefined') this.closeAction = defaultCloseAction;
}


/**
    Parameters:
        title (string) - short message diplayed at the top of a dialog ingame (usually character name)
        message (string)
        options (array of DialogOption) [optional]
*/
function DialogPage(title, message, options){
    this.title = title;
    this.message = message;
    this.options = [];
    if(typeof options !== 'undefined') this.options = options;
}


/**
    Parameters:
        label (string) - text of the option displayed in the dialog
        nextPage (DialogPage) [optional] - next page to be displayed before closing the dialog; can be null
        action (DialogAction) [optional] - if the option is choosed and action is not null, then it's copied to Dialog.closeAction
*/
function DialogOption(label, nextPage, action){
    this.label = label;
    this.nextPage = null;
    this.action = null;
    if(typeof nextPage !== 'undefined') this.nextPage = nextPage;
    if(typeof action !== 'undefined') this.action = action;
}


function DialogAction(){
    this.apply = function(){
        // TODO
    }
}
