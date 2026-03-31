# Baseline AWS layout — extend with VPC, ECS, ALB, ElastiCache, DocumentDB.
terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "region" {
  type    = string
  default = "us-east-1"
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "healthscan_static" {
  bucket_prefix = "healthscan-web-"
}

output "web_bucket" {
  value = aws_s3_bucket.healthscan_static.id
}
