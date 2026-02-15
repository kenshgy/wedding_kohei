terraform {
  required_version = ">= 1.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# DNS ゾーン
resource "cloudflare_zone" "main" {
  account_id = var.cloudflare_account_id
  zone       = "kenmiki.com"
}

# R2 バケット
resource "cloudflare_r2_bucket" "photos" {
  account_id = var.cloudflare_account_id
  name       = "kenmiki-wedding-photo"
  location   = "APAC"
}

resource "cloudflare_r2_bucket" "assets" {
  account_id = var.cloudflare_account_id
  name       = "kenmiki-wedding-assets"
  location   = "APAC"
}

# Pages プロジェクト
resource "cloudflare_pages_project" "wedding" {
  account_id        = var.cloudflare_account_id
  name              = "wedding-kenmiki"
  production_branch = "main"
}

# Pages カスタムドメイン
resource "cloudflare_pages_domain" "main" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.wedding.name
  domain       = "kenmiki.com"
}
