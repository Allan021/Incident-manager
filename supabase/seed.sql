alter table public.incident_updates disable trigger incident_updates_touch;

insert into public.profiles (id, name, email) values
  ('11111111-1111-4111-8111-111111111111', 'Maya Chen',     'maya@opswatch.dev'),
  ('22222222-2222-4222-8222-222222222222', 'Diego Ramos',   'diego@opswatch.dev'),
  ('33333333-3333-4333-8333-333333333333', 'Priya Nair',    'priya@opswatch.dev'),
  ('44444444-4444-4444-8444-444444444444', 'Sam Okafor',    'sam@opswatch.dev'),
  ('55555555-5555-4555-8555-555555555555', 'Lena Fischer',  'lena@opswatch.dev'),
  ('66666666-6666-4666-8666-666666666666', 'Alex Rivera',   'alex@opswatch.dev')
on conflict (id) do nothing;

insert into public.incidents (id, title, description, severity, status, owner_id, created_at, updated_at, resolved_at) values
  ('INC-2431', 'API gateway returning 5xx in us-east-1',
   'Error rate on the public API jumped to 34% at 02:41 UTC. Load balancer health checks are flapping across all three AZs; upstream auth service suspected.',
   'critical', 'investigating', '11111111-1111-4111-8111-111111111111',
   now() - interval '47 minutes', now() - interval '3 minutes', null),

  ('INC-2430', 'Checkout payments failing — Stripe webhook timeouts',
   'Roughly 60% of checkout attempts fail at the payment confirmation step. Stripe webhooks are timing out against our callback endpoint after the 14:00 deploy.',
   'critical', 'identified', '22222222-2222-4222-8222-222222222222',
   now() - interval '128 minutes', now() - interval '9 minutes', null),

  ('INC-2429', 'Elevated p99 latency on search service',
   'Search p99 rose from 180ms to 2.4s after the index shard rebalance. A cache-warming job is running; latency is trending back down.',
   'high', 'monitoring', '33333333-3333-4333-8333-333333333333',
   now() - interval '310 minutes', now() - interval '22 minutes', null),

  ('INC-2428', 'Failed deploy v2.41.0 stuck in rollout',
   'Canary passed but the fleet-wide rollout of v2.41.0 stalled at 40%. New pods crash-loop on a missing config key; rollback is blocked by a migration.',
   'high', 'investigating', '44444444-4444-4444-8444-444444444444',
   now() - interval '65 minutes', now() - interval '14 minutes', null),

  ('INC-2427', 'Background job queue backlog growing',
   'The email and export job queue has 42k pending jobs and is growing ~2k/min. Worker autoscaling is capped by a misconfigured quota.',
   'medium', 'identified', '11111111-1111-4111-8111-111111111111',
   now() - interval '190 minutes', now() - interval '35 minutes', null),

  ('INC-2426', 'Intermittent DNS resolution failures (Cloudflare)',
   'Around 2% of requests from EU POPs fail DNS resolution. Cloudflare has acknowledged an issue on their status page; we added a secondary resolver.',
   'medium', 'monitoring', '55555555-5555-4555-8555-555555555555',
   now() - interval '420 minutes', now() - interval '51 minutes', null),

  ('INC-2425', 'Suspicious login attempts from new ASN — security review',
   'Anomaly detection flagged 400+ failed logins from a previously unseen ASN over 6 hours. No successful compromise observed; reviewing patterns.',
   'low', 'investigating', '33333333-3333-4333-8333-333333333333',
   now() - interval '540 minutes', now() - interval '88 minutes', null),

  ('INC-2424', 'Database failover completed — primary restored',
   'The primary Postgres instance became unresponsive at 09:12; automatic failover promoted the replica in 40 seconds. Writes fully recovered.',
   'high', 'resolved', '22222222-2222-4222-8222-222222222222',
   now() - interval '26 hours', now() - interval '23 hours', now() - interval '23 hours'),

  ('INC-2423', 'CDN cache purge outage (Fastly)',
   'Cache purges silently failed for 3 hours due to an expired Fastly API token, serving stale content on marketing pages.',
   'medium', 'resolved', '44444444-4444-4444-8444-444444444444',
   now() - interval '48 hours', now() - interval '46 hours', now() - interval '46 hours')
on conflict (id) do nothing;

insert into public.incident_updates (incident_id, author_id, message, created_at) values
  ('INC-2431', '11111111-1111-4111-8111-111111111111', 'Error rate now at 34% and climbing. Paging the networking on-call.', now() - interval '3 minutes'),
  ('INC-2431', '44444444-4444-4444-8444-444444444444', 'Health checks flapping in us-east-1a and 1c. Auth service p99 at 9s.', now() - interval '12 minutes'),
  ('INC-2431', '11111111-1111-4111-8111-111111111111', 'Declared SEV-1. Opened bridge in #inc-2431.', now() - interval '41 minutes'),

  ('INC-2430', '22222222-2222-4222-8222-222222222222', 'Root cause: the 14:00 deploy added a blocking call in the webhook handler. Rolling back now.', now() - interval '9 minutes'),
  ('INC-2430', '55555555-5555-4555-8555-555555555555', 'Stripe dashboard confirms timeouts started 14:04. No issue on their side.', now() - interval '55 minutes'),
  ('INC-2430', '22222222-2222-4222-8222-222222222222', 'Payment failures spiking, checkout conversion down 58%. Investigating.', now() - interval '120 minutes'),

  ('INC-2429', '33333333-3333-4333-8333-333333333333', 'p99 down to 640ms. Keeping the incident in monitoring for another hour.', now() - interval '22 minutes'),
  ('INC-2429', '33333333-3333-4333-8333-333333333333', 'Cache warmer at 70%. Latency improving steadily.', now() - interval '84 minutes'),
  ('INC-2429', '44444444-4444-4444-8444-444444444444', 'Shard rebalance confirmed as the trigger. Warming caches to recover.', now() - interval '200 minutes'),

  ('INC-2428', '44444444-4444-4444-8444-444444444444', 'Crash loop is a missing FEATURE_FLAGS_URL env var. Checking why canary passed.', now() - interval '14 minutes'),
  ('INC-2428', '66666666-6666-4666-8666-666666666666', 'Rollback blocked: migration 0142 is not backwards-compatible. Working on a fix-forward.', now() - interval '38 minutes'),

  ('INC-2427', '11111111-1111-4111-8111-111111111111', 'Quota bump approved. Scaling workers from 12 to 48.', now() - interval '35 minutes'),
  ('INC-2427', '11111111-1111-4111-8111-111111111111', 'Backlog at 42k. Autoscaler hitting the instance quota in project prod-workers.', now() - interval '95 minutes'),

  ('INC-2426', '55555555-5555-4555-8555-555555555555', 'Secondary resolver live. Failure rate down to 0.2%.', now() - interval '51 minutes'),
  ('INC-2426', '55555555-5555-4555-8555-555555555555', 'Cloudflare status page confirms EU DNS degradation. Tracking their updates.', now() - interval '240 minutes'),

  ('INC-2425', '33333333-3333-4333-8333-333333333333', 'All attempts hit accounts with MFA. Rate-limited the ASN, continuing the review.', now() - interval '88 minutes'),

  ('INC-2424', '22222222-2222-4222-8222-222222222222', 'Resolved. Post-incident review scheduled for Thursday.', now() - interval '23 hours'),
  ('INC-2424', '22222222-2222-4222-8222-222222222222', 'Failover completed in 40s. Verifying replication lag.', now() - interval '25 hours'),

  ('INC-2423', '44444444-4444-4444-8444-444444444444', 'Token rotated and the purge backlog flushed. Resolved.', now() - interval '46 hours');

alter table public.incident_updates enable trigger incident_updates_touch;
