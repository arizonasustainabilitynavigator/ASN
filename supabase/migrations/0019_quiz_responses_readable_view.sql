-- Readable view
create or replace view public.quiz_responses_readable
with (security_invoker = true)
as
select
  qr.id,
  qr.user_id,
  u.email as user_email,
  qr.answers->>'orgZipCode' as zip_code,
  qr.answers->>'orgCountry' as country,
  coalesce(nullif(qr.answers->>'orgTypeOther', ''), qr.answers->>'orgType') as org_type,
  qr.answers->>'orgCategory' as org_category,
  qr.answers->>'employeeCount' as employee_count,
  qr.answers->>'orgLocation' as location,
  qr.answers->>'orgFacilityType' as facility_type,
  array(select jsonb_array_elements_text(qr.answers->'orgOperations')) as operations,
  array(select jsonb_array_elements_text(qr.answers->'orgResourcesUsed')) as resources_used,
  array(select jsonb_array_elements_text(qr.answers->'orgResourcesToReduce')) as resources_to_reduce,
  array(select jsonb_array_elements_text(qr.answers->'orgSustainabilityTopics')) as sustainability_topics,
  array(select jsonb_array_elements_text(qr.answers->'orgCompletedPractices')) as completed_practices,
  array(select jsonb_array_elements_text(qr.answers->'orgCompletedAssessments')) as completed_assessments,
  array(select jsonb_array_elements_text(qr.answers->'orgExperienceLevel')) as experience_level,
  array(select jsonb_array_elements_text(qr.answers->'orgObstacles')) as obstacles,
  array(select jsonb_array_elements_text(qr.answers->'orgSupportNeeded')) as support_needed,
  array(select jsonb_array_elements_text(qr.answers->'orgInsentivesDesired')) as incentives_desired,
  array(select jsonb_array_elements_text(qr.answers->'orgPlanFormat')) as plan_format,
  qr.created_at
from public.quiz_responses qr
join auth.users u on u.id = qr.user_id;
