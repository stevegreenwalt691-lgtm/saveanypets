-- Donations are bank transfer only, never online payment. This column holds the bank
-- details text shown on /get-involved#donate, edited by an admin in /admin/settings.
alter table site_settings add column donation_details text;
