#!bin/bash
# Generate a localhost trusted SSL certificate
# https://github.com/RubenVermeulen/generate-trusted-ssl-certificate

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout server.key \
    -new \
    -out server.crt \
    -config ./openssl-custom.cnf \
    -sha256 \
    -days 365
