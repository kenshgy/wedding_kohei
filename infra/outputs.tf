output "zone_id" {
  value = cloudflare_zone.main.id
}

output "pages_project_name" {
  value = cloudflare_pages_project.wedding.name
}

output "r2_buckets" {
  value = {
    photos = cloudflare_r2_bucket.photos.name
    assets = cloudflare_r2_bucket.assets.name
  }
}
