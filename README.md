# deepscholar-mock
This is a sample for login state sharing using jwt between deepsholoar and pdfanno.

## Requirements.
### Versions.
* Node.js : `v8+`
* Npm : `v5+`
### Libraries.
```
$ npm install
```

## Prepare.
### Domains.
Set your `hosts` below. These domains are used to share login state.
```
# /etc/hosts
127.0.0.1  deepscholar.local               # Domain for this app.
127.0.0.1  pdfanno.deepscholar.local       # SubDomain for pdfanno.
127.0.0.1  api.pdfanno.deepscholar.local   # SubDomain for the api of pdfanno.
```
### PDFAnno.
Clone and change the branch.
```
$ cd /path/you/favorite
$ git clone https://github.com/paperai/pdfanno.git
$ cd pdfanno
$ git checkout -b auth-share-sample origin/ auth-share-sample
```
Install dependencies.
```
$ npm install
```

## Launch apps.
### This app.
```
$ node app.js
```
### pdfanno.
```
# pdfanno.
# Server.
$ npm run server:dev
# Frontend.
$ npm run dev
```

## Access to.
```
http://deepscholar.local:4000
```