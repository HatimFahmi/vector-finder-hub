
create or replace function match_images (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    id,
    url,
    1 - (embedding <=> query_embedding) as similarity
  from images
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
