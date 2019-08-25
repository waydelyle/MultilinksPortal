# Multilinks Portal

TODO: Project description here

## Getting Things Up & Running

   * Clone repository => git clone https://github.com/ChrisDinhNZ/MultilinksPortal.git
   * Open Git Bash integrated terminal in Visual Studio Code
   * Change to ssl directory => [PATH_TO_REPO_FOLDER]/ssl
   * Generate key/cert pair => bash generate.sh
   * Add generated certificate to trusted list:
      + In File Explorer, double click on "server.crt"
      + Click "Install Certificate"
      + Select to store the certificate for "Current User" or "Local Machine" then click "Next"
      + Select "Place all certificates in the following store" then click "Browse"
      + Select "Trusted Root Certification Authorities" then click "OK"
      + Click "Next"
      + Click "Finish"
      + Click "OK" to close remaining dialogs
   * Return to root project directory => [PATH_TO_REPO_FOLDER]
   * Restore project dependencies => npm install
   * Web Portal should now be ready to launch => ng serve -o
   