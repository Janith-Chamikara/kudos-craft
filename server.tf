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

variable "ssh_key_path" {
  description = "Path to the public SSH key to bake into the server"
  default     = "~/.ssh/id_rsa.pub" 
}

provider "digitalocean" {
  token = var.do_token
}
resource "digitalocean_ssh_key" "ci_key" {
  name       = "jenkins-pipeline-key"
  public_key = file(var.ssh_key_path)
}

resource "digitalocean_droplet" "web" {
  image    = "ubuntu-22-04-x64"
  name     = "kudos-craft-server"
  region   = "nyc1"
  size     = "s-1vcpu-1gb" 
  ssh_keys = [digitalocean_ssh_key.ci_key.id] 
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}