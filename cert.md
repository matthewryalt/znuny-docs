# Let's Encrypt Certificate Setup with acme.sh

This guide covers setting up automated Let's Encrypt SSL certificates using Docker and acme.sh with Cloudflare DNS validation, and deploying them to multiple Apache servers.

## Prerequisites

- Docker and Docker Compose installed on Windows
- Cloudflare account with DNS management for your domain
- Turnkey Linux servers running Apache with Webmin

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Cloudflare API Token](#cloudflare-api-token)
3. [Docker Compose Configuration](#docker-compose-configuration)
4. [Certificate Registration and Issuance](#certificate-registration-and-issuance)
5. [Automatic Renewal](#automatic-renewal)
6. [Deploying to Apache Servers](#deploying-to-apache-servers)


## Initial Setup

Create a directory for certificates on your Windows machine:

```bash
mkdir D:\certs
cd D:\certs
```

## Cloudflare API Token

1. Log into [Cloudflare dashboard](https://cloudflare.com)
2. Click on your profile icon (top right) → **My Profile**
3. Select **API Tokens** from the left sidebar
4. Click **Create Token**
5. Use the **Edit zone DNS** template
6. Set permissions:
   - **Zone** → **DNS** → **Edit**
   - **Zone Resources** → Include → Specific zone → Select your domain
7. Click **Continue to summary** → **Create Token**
8. Copy the token (shown only once)

## Docker Compose Configuration

Create `docker-compose.yml` in `D:\certs`:

```yaml
services:
  acme:
    image: neilpang/acme.sh
    container_name: acme-letsencrypt
    volumes:
      - ./acme-certs:/acme.sh
    environment:
      - CF_Token=your-cloudflare-api-token-here
      - ACCOUNT_EMAIL=alerts+certserver@mail.ichabod.xyz
      - DEFAULT_CA=letsencrypt
    command: daemon --server letsencrypt
    restart: unless-stopped
    networks:
      - default

networks:
  default:
    driver: bridge

# To issue a certificate, run:
# docker-compose run --rm acme --issue --dns dns_cf -d yourdomain.com -d www.yourdomain.com

# To renew all certificates:
# docker-compose run --rm acme --renew-all

# To force renew a specific certificate:
# docker-compose run --rm acme --renew -d yourdomain.com --force
```

**Update the following values:**
- `CF_Token`: listed in Dociker file
- `ACCOUNT_EMAIL`: Your email address

## Certificate Registration and Issuance

### Register Account

```bash
docker-compose run --rm acme --register-account -m alerts+certserver@mail.ichabod.xyz --server letsencrypt
```

### Issue Certificate

For a single domain:
```bash
docker-compose run --rm acme --issue --dns dns_cf -d ichabod.xyz --server letsencrypt
```


### Certificate Files Location

Certificates are stored in: `D:\certs\acme-certs\yourdomain.com\`

Files generated:
- `yourdomain.com.cer` - Certificate
- `yourdomain.com.key` - Private key
- `fullchain.cer` - Full certificate chain (use this for Apache)
- `ca.cer` - CA certificate

## Automatic Renewal

Start the daemon container for automatic renewal:

```bash
docker-compose up -d
```

The container will:
- Run continuously in the background
- Check daily for certificates nearing expiry
- Automatically renew certificates within 60 days of expiration

Verify the container is running:
```bash
docker-compose ps
```

## Deploying to Apache Servers

### Option 1: SMB/CIFS Share Mount (Recommended)

This method allows all servers to access certificates directly from the Windows machine.

#### Windows Setup

1. Right-click `D:\certs\acme-certs` folder
2. Properties → Sharing → Advanced Sharing
3. Check "Share this folder"
4. Permissions → Add user with Read access
5. Note the share path: `\\192.168.147.105\acme-certs`

#### Linux Server Setup

Add credentials:
```
username=Znuny
password=Lin AD
```

Secure the file:
```bash
chmod 600 /root/.smbcredentials
```

Create mount point:
```bash
mkdir -p /mnt/certs
```

Mount the share:
```bash
mount -t cifs //192.168.147.105/acme-certs /mnt/certs -o credentials=/root/.smbcredentials,uid=root,gid=root
```

Make mount persistent (add to `/etc/fstab`):
```
//192.168.147.105/acme-certs /mnt/certs cifs credentials=/root/.smbcredentials,uid=root,gid=root,_netdev 0 0
```

#### Auto-reload Apache on Certificate Renewal

Create reload script `/usr/local/bin/check-cert-reload.sh`:
```bash
#!/bin/bash
# Check if cert was modified in last 24 hours, reload Apache if so
if [ $(find /mnt/certs/yourdomain.com/fullchain.cer -mtime -1) ]; then
    systemctl reload apache2
fi
```

Make executable:
```bash
chmod +x /usr/local/bin/check-cert-reload.sh
```

Add to crontab:
```bash
crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/check-cert-reload.sh
``

