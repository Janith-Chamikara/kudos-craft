provider "aws" {
  region = "us-east-1"   
}
resource "aws_instance" "vm_janith" {
  ami           = "ami-002eb5e5d89c8763b"  
  instance_type = "t3.micro"                

  tags = {
    Name = "Janith-chamikara"
  }
}