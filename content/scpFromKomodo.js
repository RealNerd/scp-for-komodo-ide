/**
 * Utility functions for SCP from Komodo IDE
 *
 * Requires SCP to be installed locally and the remote host to be configured
 * for password-less authentication as described here:
 *   http://www.linuxjournal.com/article/8600
 *
 * Currently requires manual configuration in project.kpf file:
 *   <string id="scp_local_path_prefix">/User/blake/...</string>
 *   <string id="scp_remote_path_prefix">/home/blake/k-temp</string>
 *   <string id="scp_remote_server">74.53.192.162</string>
 *   <string id="scp_user">blake</string>
 *
 * TODO:
 *   - Check if local file exists before trying to copy
 *   - Color/encode output based on success/fail
 *   - Configuration setup in IDE
 *   - Configure timeout??
 *   - No error message on timeout
 */

xtk.include("domutils");

var scpUtils = {
  // Don't make this var, or it won't be visible afterwards.
  output: function(str) {
    try {
        // First make sure the command output window is visible
        ko.run.output.show(window, false);
        // Second, make sure we're showing the output pane, not the error list pane.
        var deckWidget = document.getElementById("runoutput-deck");
        if (deckWidget.getAttribute("selectedIndex") != 0) {
            ko.run.output.toggleView();
        }
        // Now find out which newline sequence the window uses, and write the
        // text to it.
        var scimoz = document.getElementById("runoutput-scintilla").scimoz;
        var prevLength = scimoz.length;
        var currNL = ["\r\n", "\n", "\r"][scimoz.eOLMode];
        var full_str = str + currNL;
        var full_str_byte_length = ko.stringutils.bytelength(full_str);
        var ro = scimoz.readOnly;
        try {
            scimoz.readOnly = false;
            scimoz.appendText(full_str_byte_length, full_str);
        } finally {
            scimoz.readOnly = ro;
        }
        // Bring the new text into view.
        scimoz.gotoPos(prevLength + 1);
    } catch(ex) {
        alert("problems printing [" + str + "]:" + ex + "\n");
    }
  },
  
  getPref: function(name, default_val) {
    var prefs = ko.projects.manager.currentProject.prefset;
    
    if (prefs.hasStringPref(name)) {
      return prefs.getStringPref(name);
    }
    
    return default_val;
  },
  
  setPref: function(name, value) {
    var prefs = ko.projects.manager.currentProject.prefset;
    prefs.setStringPref(name, value);
  },

  doSCP: function() {
    var currView = ko.views.manager.currentView;
    var viewDoc = currView.document;
    var localPath = viewDoc.file.path;
    var localPathPrefix = scpUtils.getPref('scp_local_path_prefix', ''); // '/Users/blake';
    var remotePathPrefix = scpUtils.getPref('scp_remote_path_prefix', ''); // '/www/twath/html/current'
    var scpUser = scpUtils.getPref('scp_user', '');
    var scpRemoteServer = scpUtils.getPref('scp_remote_server', '');
    
    if ((localPathPrefix != '') && (remotePathPrefix != '') && (scpUser != '') && (scpRemoteServer != '')) {
      var remotePath = remotePathPrefix + localPath.replace(localPathPrefix, '');
      var command = 'scp ' + localPath + ' ' + scpUser + '@' + scpRemoteServer + ':' + remotePath;

      var runSvc = Components.classes["@activestate.com/koRunService;1"].
                  createInstance(Components.interfaces.koIRunService);
      var process = runSvc.RunAndNotify(command,
                                        "",  // cwd,
                                        "", // environment settings,
                                        ""); // stdin input);
      var retval = process.wait(10); // wait until the process is done or max of 10 seconds
      if (retval == 0) {
        scpUtils.output('SUCCESS: ' + localPath + ' => ' + remotePath);
      } else {
        scpUtils.output('FAIL: ' + process.getStderr());
      }
    } else {
      scpUtils.output('This project is not configured for SCP')
    }
  }
};