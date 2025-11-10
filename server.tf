provider "aws" {
  region = "us-east-1"   
}

resource "aws_instance" "vm_janith" {
  ami           = "ami-002e36fbd4cd923d5"  
  instance_type = "t3.micro"                

  tags = {
    Name = "Janith-chamikara"
  }
}