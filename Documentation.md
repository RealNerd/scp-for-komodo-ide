# Quick overview of how to use the scp-for-komodo-ide extension.

# Introduction #

This extension is a quick and dirty implementation that I built for my own use. While I love the Komodo IDE, I have been frustrated since the beginning that it doesn't have built-in SCP and mapping from local to remote servers and paths.

In my mind, projects should very easily map from a local path to a remote server/path quite simply -- so this extension assumes a very simple mapping such as the following.

  * Assume a project with local files stored in **`/Users/blake/MyProject`**
  * Assume a remote server called **example.com**
  * Assume a remote root path **`/var/www/html/MyProject`**

In this case, the SCP command for any file in the local path should look something like `scp _local-path_/file user@example.com:_remote-path_/file. As long as the _local-path_, _remote-path_, _remote-server_ and SCP _username_ are defined somewhere in the Komodo project, it is simple to map an open file in the IDE and shell out to the SCP command.

That's all scp-for-komodo-ide does.

# Details #

## Implementation ##

Since my goal was to create an integrated SCP for Komodo projects (not to create a compelling user experience), I took the low road on configuration. I manually add the configuration options to the project file directly. To do this, simply open your **project.kpf** file in your favorite text editor and add the following lines inside the _preference-set_ element:

```
  <string id="scp_local_path_prefix">/Users/blake/MyProject</string>
  <string id="scp_remote_path_prefix">/var/www/html/MyProject</string>
  <string id="scp_remote_server">example.com</string>
  <string id="scp_user">remote_user</string>
```

If any of the above settings is not available, an error message will be issued.

## Usage within the IDE ##

Once the extension is installed, a new menu item will appear under the Komodo **File** menu. It is simply called **SCP**. A key mapping can be configured in the Komodo preferences if desired.

# Notes #

This extension uses SCP without providing a password as described in http://www.linuxjournal.com/article/8600.