provider "aws" {
  region = "us-east-1"   
}

 
resource "aws_instance" "example" {
  ami           = "ami-0157af9aea2eef346"  
  instance_type = "t3.micro"                

  tags = {
    Name = "Test-Janith-5203"
  }
}