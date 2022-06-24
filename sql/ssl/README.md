## Purpose
The purpose of this

## Host File Details
Press `Win + R` and run `C:\Windows\System32\drivers\etc\hosts`, opening in an editor like Notepad++ and add the following entries:

	127.0.0.1 kiszka.com
	127.0.0.1 buddha.com

This will allow for local name resolution to `localhost`, when calling endpoints (e.g. in the browser)

## Certificate Details

#### 1) Create Config File (kiszka.cnf)

	[req]
	distinguished_name = req_distinguished_name
	req_extensions = v3_req

	[req_distinguished_name]
	countryName = US
	countryName_default = US
	stateOrProvinceName = Michigan
	stateOrProvinceName_default = Michigan
	localityName = Oakland
	localityName_default = Oakland
	organizationalUnitName = Kiszka
	organizationalUnitName_default = Kiszka
	commonName = *.kiszka.com
	commonName_max = 64

	[ v3_req ]
	# Extensions to add to a certificate request
	basicConstraints = CA:TRUE
	keyUsage = nonRepudiation, digitalSignature, keyEncipherment, keyCertSign
	extendedKeyUsage=serverAuth, clientAuth, codeSigning
	subjectAltName = @alt_names

	[alt_names]
	DNS.1 = kiszka.com
	DNS.2 = *.kiszka.com
	DNS.3 = buddha.com
	DNS.4 = *.buddha.com

> The `CA:TRUE` flag determines whether or not the certificate is a CA certificate

#### 2) Create Private Key

	openssl genrsa -out kiszka.key 2048

#### 3) Create Certificate Signing Request (CSR)

	openssl req -new -out kiszka.csr -key kiszka.key -config kiszka.cnf

#### 4) Sign the Certificate

	openssl x509 -req -days 3650 -in kiszka.csr -signkey kiszka.key -out kiszka.crt -extensions v3_req -extfile kiszka.cnf

#### 5) Install the Certificate as a "Trusted Root Certification Authority"
Double-click `kiszka.crt` and install the certificate to the **Local Machine** and into the **Trusted Root Certification Authorities** folder


## React Details
#### 1) Create `certs` folder
Create a folder names `certs` and follow the steps above.

#### 2) Create `.env` file
Create a `.env` file in the root of the CRA directory (**not** in `/src`) and add the following entries:

	HTTPS=true
	SSL_CRT_FILE=../certs/kiszka.crt
	SSL_KEY_FILE=../certs/kiszka.key

  > **Notice the `../`**
  > The example above assums that the `certs` folder is **above** the `/src` directory (i.e. one (1) level higher than the `.env` file).