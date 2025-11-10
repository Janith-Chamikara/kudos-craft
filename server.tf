provider "aws" {
  region = "us-east-1"
}
resource "aws_key_pair" "janith_key" {
  key_name   = "janith-key"
  public_key = file("~/.ssh/id_ed25519_second.pub") 
}
resource "aws_security_group" "vm_janith_sg" {
  name        = "vm-janith-sg"
  description = "Allow SSH inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # WARNING: This is open to the world.
                                # For production, restrict this to your Jenkins IP.
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "vm_janith" {
  ami           = "ami-002eb5e5d89c8763b"
  instance_type = "t3.micro"

  key_name                    = aws_key_pair.janith_key.key_name
  vpc_security_group_ids      = [aws_security_group.vm_janith_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "Janith-chamikara"
  }
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.vm_janith.public_ip
}