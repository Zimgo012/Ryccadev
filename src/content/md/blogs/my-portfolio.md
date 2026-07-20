---
title: My-Portfolio
summary: A blog on how I created and deploy my portfolio website
author: John Rycca Belcina
date: July 21, 26
tags:
  - VPS
  - Nginx
  - Oracle
  - Firewall
  - Web-Server
  - Astro
  - Self-Hosted
---
Hello World. In this blog, I will be documenting how I deployed my personal portfolio website. At first, I was planning to use third-party services to host my website. However, I realized that I had never actually created a server from scratch, configured it, secured it, and deployed an application directly into it. Instead of using a managed platform, I decided to try setting everything up myself. I wanted to understand what actually happens behind the scenes when a website is deployed and accessed through the internet. Before starting this project, I gathered the main requirements that I needed:
### Requirements
- **App Running**
- **VPS**
- **DNS**
- **Hardening ssh**
-  **Firewall**
- **Load balancer**
- **Automated deployment**
- **Monitoring** 

This project was not only about putting my portfolio online. It was also a learning experience where I could understand more about servers, networking, security, and deployment workflows.

---

## Creating Astro Project

The first thing I did is to for this whole project is to create the app/website. I created mine with the help of Astro. Astro is a web framework tool for building content-rich websites. It features something like  island architecture, where you can specify rendering methods, either for server-rendered components or client-rendered components. Here is a sample scenario:

#### Client Island
Astro, by default, default, will render components as static HTML and remove unnecessary client-side JavaScript, stripping out all client-side automatically. Now you have multiple components.

```astro
<Counter />
<ThemeToggle />
<Weather />
<Video />
<Animation/>
```
Now you wanted to optimize it and choose when each component becomes interactive, you will just the configure it by passing a prop.

```astro
<Counter client:load/> 
<ThemeToggle client:idle/>
<Weather client:visible/>
<Video client:media = "(min-width: 1024px)"/>
<Animation client:only/> 
```

- `client:load` runs immediately after the page loads
- `client:idle` waits until browser is idle before loading JavaScript
- `client:visible` waits until the component 
- `client:media` render  on specific media query matches. Like device size (Phone (min-width: 640px),Tablet(min-width:720px), etc)
- `client:only` render on client side only

#### Server Island

You can also set a component to render separately on the server. Imagine you have a dashboard:
```astro
<Header />

<Sidebar />

<Stats server:defer />

<Footer />
```
The Stats component now renders on the server, while everything else is on client.

#### Other features
The reason why I chose this framework is that I can create the structure and components of the website with just plain HTML/CSS and JavaScript. Not that I'm strictly bounded by that rule but I can also import different UI frameworks and use them as my components. 

Second, is that I can create my content easily with Markdown files and render pages with the styles and layouts that I have already configured. 

Example source code:\
`blogs.astro`
```astro
 ---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
    const posts = await getCollection("blogs");

    return posts.map((post) => ({
        params: { id: post.id },
        props: { post },
    }));
}

const { post } = Astro.props;

const { Content } = await render(post);
---

<BaseLayout webtitle={post.data.title}>

    <article class="blog-content">

        <h1>{post.data.title}</h1>

        <p>
            Author: {post.data.author}
        </p>

        <p>
            Date: {post.data.date}
        </p>

        <Content />

    </article>

</BaseLayout>

```

`first-blog.md`
```md
---
title: "My First Blog"
author: "JC"
date: "July 10, 2026"
tags:
  - Astro
  - Web Development
---

# Hello Astro

This blog is written in **Markdown**.

Astro converts this file into HTML while keeping my custom layout and styles.

## Features

- Markdown content
- Custom CSS styling
- Static page generation
- Component-based layouts
```

These are just few of the things that Astro can do a lot of thing. Check it out here at [Astro official webpage](https://astro.build).

---
---

## Virtual Private Server

Before VPS providers became common, developers usually hosted applications directly from their own computers.

The idea was simple: the computer would act as the server. It would run the application, connect to the internet, and accept requests from users.

However, this approach has many limitations. The computer needs to stay powered on and connected to the internet at all times. I would also need to handle hardware failures, networking configuration, security, and maintaining the server environment.

Because of these limitations, VPS providers became popular. Instead of managing physical hardware, I can rent a virtual server from a cloud provider that is already connected to the internet and designed to run applications continuously.

Before setting everything up, I first needed to understand what a VPS actually is.

A **VPS (Virtual Private Server)** is, to simplify, my own virtual computer in the cloud.

A VPS is a virtual machine running on a physical server managed by a cloud provider. The provider manages the underlying hardware, while I get my own isolated environment where I can install software, configure networking, and deploy applications.

This virtual machine can then be used to host different types of services:

- Websites
- APIs
- Databases
- Background services
- Development environments

There are many VPS providers available, such as DigitalOcean, AWS, Azure, Linode, and more.

For this project, I decided to use **Oracle Cloud** because they provide a generous free tier that is enough for hosting a personal portfolio website.

#### Making Oracle Free Tier

The first step was creating an Oracle Cloud free tier account.

I signed up through the [Oracle Free Tier Account](https://www.oracle.com/ca-en/cloud/free/) and created my account.

After logging in, I started setting up the networking and compute resources needed for my VPS.

#### High-level Setup Diagram

![VPS High level diagram](../../../../public/blog-pictures/my-portfolio/vps-high-level-diagram.png) 

#### Making VCN

A `VCN(Virtual Cloud Network)` is a private network inside the cloud.

It is similar to having a home network, but instead it exists inside the cloud environment. It allows me to control how my cloud resources communicate with each other and with the public internet.

I created my VCN inside Oracle:

- Click the hamburger button `☰`, go to **Networking** and select **Virtual Cloud Networks**.

![vcn1](../../../../public/blog-pictures/my-portfolio/vcn1.png)

- Create a new VCN.

![vcn2](../../../../public/blog-pictures/my-portfolio/vcn2.png)

- Configure the VCN settings.

![vcn3](../../../../public/blog-pictures/my-portfolio/vcn3.png)

- Click **Create** to create the VCN.

#### Creating Instance for the VPS

After creating the VCN, I needed to create the actual virtual machine.

- Click the hamburger button `☰`, go to **Compute** and select **Instances**.

![vps1](../../../../public/blog-pictures/my-portfolio/vps1.png)

- Click **Create Instance**.

![vps2](../../../../public/blog-pictures/my-portfolio/vps2.png)

- Select an image.

For this project, I used Ubuntu because it is commonly used for server environments and has a lot of available documentation.

*(Note: I used a less powerful instance this time since the Ampere-based processor is not always available.)*

![vps4](../../../../public/blog-pictures/my-portfolio/vps4.png)

- Select a shape.

The shape determines the resources allocated to my VPS, such as CPU and memory.

Since this is only a personal portfolio website, I selected a smaller instance because I do not need a lot of computing power.

![vps5](../../../../public/blog-pictures/my-portfolio/vps5.png)

- Leave the security settings as default.

I changed some of these settings later when configuring firewall rules and SSH security.

![vps6](../../../../public/blog-pictures/my-portfolio/vps6.png)

- Set the VCN to the VCN I created earlier.

![vps7](../../../../public/blog-pictures/my-portfolio/vps7.png)

- **IMPORTANT!** Download the SSH key and public key.

I made sure to save them somewhere safe because Oracle does not allow me to download the private key again later.

![vps8](../../../../public/blog-pictures/my-portfolio/vps8.png)

- Set up the boot volume.

The free tier can have up to 200GB of storage across all instances.

I can also configure VPU (Volume Performance Units), which allows me to adjust the disk performance.

Since I am not running heavy processes, I decided to use the balanced configuration.

I read more about Oracle block volume performance here:

https://docs.oracle.com/en-us/iaas/Content/Block/Concepts/blockvolumeperformance.html

![vps9](../../../../public/blog-pictures/my-portfolio/vps9.png)

- Create the instance.

![vps10](../../../../public/blog-pictures/my-portfolio/vps10.png)

At this point, I had my own VPS running in Oracle Cloud. The next step was configuring the server environment and preparing it to host my website.

---
---

---

## Setting up VPS

After creating my VPS, the next step was configuring the server environment.

#### SSH to the VPS

The first thing I needed to do was connect to my VPS using SSH.

*(I will make a blog about how SSH commands work and how the protocol works in detail sometime. For now, I will use this as a reference: https://www.digitalocean.com/community/tutorials/ssh-essentials-working-with-ssh-servers-clients-and-keys)*

To connect to the VPS, I needed the SSH private key that I downloaded earlier and the public IP address assigned to my Oracle instance.

The command to connect:

```bash
ssh -i <drag-key-file-here> ubuntu@ip_address
```

After successfully connecting, I was now inside my VPS and could start configuring the environment.

---

#### Update System Packages

The first thing I did was update Ubuntu and its pre-installed packages.

This helps keep the system updated, fixes known security vulnerabilities, and prevents possible installation issues later.

Command to update:

```bash
sudo apt update && sudo apt upgrade -y
```

---

#### Install Essential Tools

Next, I installed some essential tools that I would need while managing my VPS.

These tools help with debugging, editing configurations, monitoring resources, and deploying applications.

List of tools:

| Tool | Purpose |
| -------- | ----------------------------- |
| git | pulls project or debug builds |
| curl | test APIs / downloads |
| wget | fetch files |
| unzip | handle archives |
| vim/nano | edit server configuration files |
| htop | monitor CPU/RAM usage |
| rsync | efficient file deployment |

Command to install:

```bash
sudo apt install git curl wget unzip vim nano htop rsync -y
```

---

#### Adding Swap (Virtual Memory)

Since I was using a smaller VPS instance with only 1GB of RAM, I decided to add swap memory as an extra safety measure.

So what is virtual memory?

**Virtual memory** is a memory management technique used by operating systems to give applications the appearance of having more memory than the available physical RAM.

Instead of immediately failing when RAM is exhausted, the operating system can use disk space as temporary memory.

![swap](../../../../public/blog-pictures/my-portfolio/swap.png)

I created a 2GB swap file using these commands:

```bash
sudo fallocate -l 2G /swapfile # allocates 2GB worth of swap
sudo chmod 600 /swapfile # modifies permissions
sudo mkswap /swapfile # prepares the file so Linux recognizes it as swap memory
sudo swapon /swapfile # activates swap
```

Then I made the swap permanent so it would still exist after restarting the VPS:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

#### Firewall

A firewall is a security layer that controls network traffic coming into and leaving my server.

It helps protect my VPS by controlling which ports are accessible from the public internet.

During this project, I ran into many connection issues, and the main cause was related to firewall rules.

Later, I found out that Oracle specifically warns against using UFW (Uncomplicated Firewall) on their Ubuntu images.

UFW is a tool that simplifies configuring Linux firewall rules. However, Oracle's default security setup uses its own networking rules, and using UFW can cause unexpected behavior.

Oracle documentation states:

> Do not use Uncomplicated Firewall (UFW) to edit firewall rules on an Ubuntu image.

Reference:

https://docs.oracle.com/en-us/iaas/Content/Compute/References/bestpracticescompute.html

The difference between UFW and iptables is that UFW is only an interface that manages the actual Linux firewall system, which is iptables.

![linux-netfliter](../../../../public/blog-pictures/my-portfolio/firewall.png)

I configured my firewall using iptables directly.

First, I disabled UFW to make sure it was not interfering:

```bash
sudo ufw reset
sudo ufw disable
```

Next, I checked the existing firewall rules:

```bash
sudo iptables -L INPUT -n --line-numbers
```

Then I allowed required ports.

For example, allowing HTTP traffic:

```bash
sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
```

I repeated the same process for other required ports:

```bash
sudo iptables -I INPUT 1 -p tcp --dport <port-number> -j ACCEPT
```

After configuring the rules, I saved the current firewall configuration:

```bash
sudo netfilter-persistent save
```

To automatically restore firewall rules after reboot, I installed iptables-persistent:

```bash
sudo apt install iptables-persistent -y
```

---

#### Basic Protection

After setting up the firewall, I added a basic protection package.

I installed **Fail2Ban**, which monitors failed login attempts and automatically blocks suspicious IP addresses.

```bash
sudo apt install fail2ban -y
```

---

#### More SSH Hardening

After securing the basic firewall rules, I wanted more control over my VPS access.

I restricted SSH access by allowing only my own IP address instead of allowing every IP address.

I am still continuing to improve my SSH security and harden my server as I learn more about server administration.

---
---

---

## Setting up Web Server (NGINX)

After configuring my VPS, I needed a program that could handle incoming requests from the public internet and return my website files.

This is where NGINX comes in.

Before installing it, I first needed to understand what NGINX actually does.

NGINX is a high-performance open-source web server, reverse proxy, content cache, and load balancer.

In simple terms, I can think of NGINX as a traffic controller inside my VPS. When a user accesses my website, NGINX receives the request, determines what the user needs, and returns the correct content.

*(I will make a blog about NGINX and how it works in more detail in the future.)*

---

## Setting up NGINX

The first step was installing NGINX inside my VPS.

```bash
sudo apt install nginx -y
```

After installing it, I configured NGINX to start automatically whenever the VPS boots.

```bash
sudo systemctl enable nginx
```

Then I started the NGINX service:

```bash
sudo systemctl start nginx
```

At this point, NGINX was running on my server.

---

## Creating Project Directory

Next, I created a directory where I would store my website build files.

```bash
sudo mkdir -p /var/www/project
```

I then changed the ownership of the directory so my current user could manage the files without needing root access.

```bash
sudo chown -R $USER:$USER /var/www/project
```

---

## Changing Subnet Rules in Oracle

Even though NGINX was running, my website was still not publicly accessible.

Oracle Cloud has another layer of networking security called security lists. I needed to allow incoming traffic through the required ports.

I needed to open:

- Port 80 for HTTP
- Port 443 for HTTPS

Steps:

- Go to my instance.

![subnet1](../../../../public/blog-pictures/my-portfolio/subnet1.png)

- Scroll down to VNIC and select the VCN being used.

![subnet2](../../../../public/blog-pictures/my-portfolio/subnet2.png)

- Go to security.

![subnet3|669](../../../../public/blog-pictures/my-portfolio/subnet3.png)

- Add an ingress rule.

![subnet4](../../../../public/blog-pictures/my-portfolio/subnet4.png)

- Add rules for port 80 and 443.

![subnet5](../../../../public/blog-pictures/my-portfolio/subnet5.png)

- Set the source CIDR to `0.0.0.0/0`.

This allows anyone on the internet to access my website.

Since this is only a portfolio website, allowing public access is fine. However, for private services such as internal APIs or management tools, I would restrict access to specific IP addresses.

![subnet6](../../../../public/blog-pictures/my-portfolio/subnet6.png)

---

## Creating Test Page and Testing Connection

Before deploying my actual website, I wanted to make sure that NGINX was working correctly.

Inside my VPS, I created a simple HTML page:

```bash
echo "<h1>Server Works</h1>" > /var/www/project/index.html
```

I could then test it by visiting:

```
http://your_public_ipv4
```

or using curl inside the VPS:

```bash
curl http://localhost
```

If everything was configured correctly, I should see the test page.

---

## Configure NGINX

The next step was creating my own NGINX configuration.

I created a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/project
```

Then I added my configuration:

```nginx
server {    
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/portfolio;

    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

This configuration tells NGINX:

- Listen for HTTP requests on port 80.
- Use `/var/www/portfolio` as the website directory.
- Serve `index.html` as the default page.
- Return a 404 error if the requested file does not exist.

---

## Enabling NGINX Configuration

After creating the configuration, I enabled it by creating a symbolic link.

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
```

By default, NGINX comes with a default server configuration. I needed to remove the default server because it was conflicting with my own configuration.

I edited:

```bash
sudo nano /etc/nginx/sites-available/default
```

Then I removed the default server listening on port 80.

![nginxdefault](../../../../public/blog-pictures/my-portfolio/nginxdefault.png)

After making changes, I tested the NGINX configuration:

```bash
sudo nginx -t
```

If the configuration was valid, I reloaded NGINX:

```bash
sudo systemctl reload nginx
```

At this point, my VPS was ready to serve website files.

---
---

---

## Deploying Application (Manually)

After finishing my VPS and web server setup, the next step was deploying my actual application.

For the first deployment, I decided to do it manually before setting up automation.

I did not want to build my Astro project directly inside my VPS because the instance I was using only had limited RAM. Although I added swap memory, building projects inside the server would still be slower.

Instead, I decided to build the project locally and only transfer the final build files to my VPS.

The deployment flow looked like this:

```
Local Machine
      |
      | npm run build
      |
      v
Astro Static Files
      |
      | rsync
      |
      v
Oracle VPS
      |
      v
NGINX
      |
      v
Website
```

---

### Building Astro Project

Inside my local machine, I built my Astro project using:

```bash
npm run build
```

Astro generated the final static files inside the `dist` directory.

---

### Uploading Build Files Using rsync

I used `rsync` to transfer my build files from my local machine to my VPS.

```bash
rsync -avz -e "ssh -i '<keyhere>'" dist/ ubuntu@SERVER_IP:/var/www/portfolio/
```

The command transfers the generated files into the directory that NGINX is serving.

After uploading the files, I tested the website by visiting:

```
http://my_public_ip
```

At this point, my portfolio website was accessible through my VPS IP address.

---

# Setting up DNS

After successfully deploying my website, the next step was connecting my domain name to my VPS.

DNS stands for **Domain Name System**.

It works like a phonebook for the internet. Instead of users remembering a public IP address such as:

```
123.123.123.123
```

they can use a human-readable domain name such as:

```
example.com
```

The DNS system translates the domain name into the server's IP address.

---

There are many DNS providers available, and the setup process differs depending on the provider.

For my project, I used [Spaceship](https://www.spaceship.com) as my domain provider because their pricing was affordable and they provide useful DNS management features.

The steps I followed:

- Purchased a domain name.
- Configured DNS records.

![dns1](../../../../public/blog-pictures/my-portfolio/dns1.png)

- Waited for DNS propagation.
- Tested the domain by visiting it.

After the DNS records propagated, my domain successfully pointed to my VPS.

---

# Setting up HTTPS

After setting up DNS, the next step was securing my website with HTTPS.

**HTTP** sends data as plain text, which means the communication between the client and server can potentially be intercepted.

**HTTPS** adds a TLS/SSL encryption layer, allowing data to be transferred securely between the user and the server.

To enable HTTPS, I used Certbot.

---

## Installing Certbot

First, I installed Certbot and the NGINX plugin:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Then I ran Certbot:

```bash
sudo certbot --nginx
```

![certbot1](../../../../public/blog-pictures/my-portfolio/certbot1.png)

![certbot2](../../../../public/blog-pictures/my-portfolio/certbot2.png)

Certbot automatically:

- Requested an SSL certificate.
- Configured NGINX.
- Enabled HTTPS.
- Set up certificate renewal.

After completing this step, my website was now accessible securely through HTTPS.

More information about Certbot can be found here:

https://certbot.eff.org

---
---
---

## Automated Deployment Setup

After successfully deploying my website manually, I wanted to automate the deployment process.

Manually building and uploading files works, but it becomes repetitive every time I make changes to my website.

To solve this, I used **GitHub Actions** to automatically build my Astro project and deploy the generated files to my VPS whenever I push changes to my main branch.

My deployment workflow:

```
Developer
    |
    | git push
    |
    v
GitHub Actions
    |
    | npm install
    | npm run build
    |
    v
Upload dist files
    |
    v
Oracle VPS
    |
    v
NGINX serves website
```

I created a GitHub Actions workflow to handle this process:

```yml
name: Deploy VPS

on:
  push:
    branches:
      - main

  workflow_dispatch:


jobs:

  deploy:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: 24

      - run: npm ci

      - run: npm run build

      - name: Upload dist
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "dist/*"
          target: "/var/www/rycca.dev"
```

This workflow automatically:

1. Checks out my latest code.
2. Installs the required dependencies.
3. Builds my Astro website.
4. Uploads the generated files to my VPS.

---

## Creating Deployment User

For security reasons, I did not want my GitHub Actions workflow to use my main VPS user.

Instead, I created a separate user specifically for deployments.

I created separate SSH keys tied to this deployment user and stored the private key inside GitHub Secrets.

This way:

- My main user credentials are not exposed.
- The deployment process has only the permissions it needs.
- I can disable deployment access separately if needed.

---

## Setting up Monitoring and Logging

Since this is not a large-scale application with many services, I decided to keep monitoring simple.

For now, I used built-in Linux logs and `tmux` to easily monitor different areas of my VPS.

`tmux` allows me to create multiple terminal sessions inside one SSH connection.

This is useful because I can keep different monitoring commands running at the same time.

My current tmux setup:

![tmux](../../../../public/blog-pictures/my-portfolio/tmux1.png)

![tmux2](../../../../public/blog-pictures/my-portfolio/tmux2.png)

For a larger production system, I would consider adding more advanced monitoring tools such as:

- Prometheus
- Grafana
- Log aggregation systems
- Server health monitoring services

However, for a personal portfolio website, this setup is enough for my current needs.

---

## Reflection

After completing this project, I gained a better understanding of what happens behind a deployed website.

Previously, deploying a website mostly meant pushing code to a hosting platform and letting the platform handle everything.

By deploying this manually, I had to understand different parts of the process:

- How DNS connects a domain to a server.
- How a VPS works.
- How firewalls control access.
- How NGINX serves web content.
- How HTTPS certificates work.
- How automated deployment pipelines are created.

There were many issues during the process, especially with networking and firewall configuration. However, troubleshooting these problems helped me understand how different layers of a deployment stack communicate with each other.

This project gave me a better foundation in server administration and deployment workflows. Although this setup is simple compared to a production environment, it gave me the experience of managing a server from the ground up.