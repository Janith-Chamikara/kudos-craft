provider "aws" {
  region = "us-east-1"   
}

resource "aws_instance" "vm_janith" {
  ami           = "ami-07fb0a5bf9ae299a4"  
  instance_type = "t3.micro"                

  tags = {
    Name = "Janith-chamikara"
  }
}