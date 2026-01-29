terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "do_token" {
  description = "DigitalOcean Personal Access Token"
  sensitive   = true
}

variable "ssh_pub_key" {
  description = "The actual public key content text"
  type        = string
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "ci_key" {
  name       = "jenkins-pipeline-key"
  public_key = var.ssh_pub_key
}

resource "digitalocean_droplet" "web" {
  image    = "ubuntu-22-04-x64"
  name     = "kudos-craft-server"
  region   = "nyc1"
  size     = "s-1vcpu-2gb"
  ssh_keys = [digitalocean_ssh_key.ci_key.id]
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}