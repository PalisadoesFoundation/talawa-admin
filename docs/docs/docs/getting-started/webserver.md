---
id: webserver
title: Webserver Setup
slug: /webserver
sidebar_position: 4
---

This page outlines how to run Talawa-Admin on a cloud based server using SSL certificates.

## Apache

This is the Apache webserver configuration we use for the https://test.talawa.io website that uses SSL.

You can use these configuration examples for your website.

### Redirecting HTTP Traffic to HTTPS

The first configuration we use redirects HTTP traffic to the HTTPS site.

You will need to:

1. Adjust the IPv4 and IPv6 addresses in the `<VirtualHost>` line to match your server settings.
2. Update the `ServerName` to the DNS name of your system.

```
<VirtualHost 132.148.74.68:80 [2603:3:6102:f190::]:80>
  ServerName test.talawa.io
  Redirect / https://test.talawa.io/
</VirtualHost>
```

The next section outlines the HTTPS site setup.

### SSL Setup

You will need to:

1. Adjust the IPv4 and IPv6 addresses in the `<VirtualHost>` line to match your server settings.
1. Enable the following pre-requisite apache modules using these commands:
   ```
   sudo a2enmod proxy_wstunnel
   sudo a2enmod proxy_http
   sudo a2enmod proxy
   sudo a2enmod ssl
   sudo systemctl restart apache2
   ```
1. Update the `ServerName` to the DNS name of your system.
1. Update the location of your SSL certificates and keys.
1. Update the logfile names

```text
<VirtualHost 132.148.74.68:443 [2603:3:6102:f190::]:443>
  ##############################################################################
  # test.talawa.io (Talawa-Admin HTTPS on port 443)
  ##############################################################################

  ServerName  test.talawa.io

  ##############################################################################
  # Proxy (Requires these commands to activate)
  # "a2enmod proxy_wstunnel" "a2enmod proxy_http" "a2enmod proxy"
  ##############################################################################

  # Setup the proxy configuration
  ProxyPreserveHost On

  # Web and websocket proxy
  ProxyPass / http://localhost:4321/ upgrade=websocket
  ProxyPassReverse / http://localhost:4321/

  ##############################################################################
  # SSL (Requires command "a2enmod ssl" to activate)
  ##############################################################################

  SSLEngine on

  # This file changes each year
  SSLCertificateFile /path/to/ssl/certificate/location/certificate.crt

  # These files don't change year to year
  SSLCertificateChainFile /path/to/ssl/certificate/location/chain.crt
  SSLCertificateKeyFile /path/to/ssl/certificate/location/private.txt

  ##############################################################################
  # Logging
  ##############################################################################

  LogLevel warn
  ErrorLog /var/log/apache2/test.talawa.io_error.log
  CustomLog /var/log/apache2/test.talawa.io_access.log combined

</VirtualHost>

```
