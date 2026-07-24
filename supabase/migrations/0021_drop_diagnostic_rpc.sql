-- 0021: Remove the temporary diagnostic RPC introduced in 0020 — it exposed
-- internal RLS policy definitions to any caller and was only needed to
-- track down the job-application insert bug fixed in the app layer.

drop function if exists margaret_debug_policies(text);
