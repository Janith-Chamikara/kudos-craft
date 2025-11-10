provider "aws" {
  region = "us-east-1"   
}

resource "aws_instance" "vm_janith" {
  ami           = "ami-000bc3d0f4b2707c9"  
  instance_type = "t3.micro"                

  tags = {
    Name = "Janith-chamikara"
  }
}