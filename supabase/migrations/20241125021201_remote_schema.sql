create type "public"."http_method" as enum ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

create table "public"."api_cache" (
    "id" uuid not null default uuid_generate_v4(),
    "endpoint" text not null,
    "response" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone not null
);


create table "public"."api_configs" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "base_url" text not null,
    "headers" jsonb default '{}'::jsonb,
    "rate_limit_per_minute" integer default 60,
    "cache_duration_seconds" integer default 3600
);


create table "public"."aye" (
    "quote_date" date not null,
    "underlying_last" double precision,
    "expire_date" date not null,
    "dte" bigint,
    "c_delta" double precision,
    "c_gamma" double precision,
    "c_vega" double precision,
    "c_theta" double precision,
    "c_rho" double precision,
    "c_iv" double precision,
    "c_volume" bigint,
    "c_last" double precision,
    "c_bid" double precision,
    "c_ask" double precision,
    "strike" double precision not null,
    "p_bid" double precision,
    "p_ask" double precision,
    "p_last" double precision,
    "p_delta" double precision,
    "p_gamma" double precision,
    "p_vega" double precision,
    "p_theta" double precision,
    "p_rho" double precision,
    "p_iv" double precision,
    "p_volume" bigint,
    "c_size_bid" bigint,
    "c_size_ask" bigint,
    "p_size_bid" bigint,
    "p_size_ask" bigint
);


create table "public"."cached_responses" (
    "id" uuid not null default uuid_generate_v4(),
    "config_id" uuid,
    "endpoint" text not null,
    "method" http_method default 'GET'::http_method,
    "params" jsonb default '{}'::jsonb,
    "response" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone not null
);


create table "public"."techtier" (
    "id" bigint generated by default as identity not null,
    "url" text not null,
    "name" text not null
);


alter table "public"."techtier" enable row level security;

CREATE UNIQUE INDEX api_cache_pkey ON public.api_cache USING btree (id);

CREATE UNIQUE INDEX api_configs_name_key ON public.api_configs USING btree (name);

CREATE UNIQUE INDEX api_configs_pkey ON public.api_configs USING btree (id);

CREATE UNIQUE INDEX aye_pkey ON public.aye USING btree (quote_date, expire_date, strike);

CREATE UNIQUE INDEX cached_responses_config_id_endpoint_method_params_key ON public.cached_responses USING btree (config_id, endpoint, method, params);

CREATE UNIQUE INDEX cached_responses_pkey ON public.cached_responses USING btree (id);

CREATE UNIQUE INDEX techtier_name_key ON public.techtier USING btree (name);

CREATE UNIQUE INDEX techtier_pkey ON public.techtier USING btree (id);

CREATE UNIQUE INDEX techtier_url_key ON public.techtier USING btree (url);

alter table "public"."api_cache" add constraint "api_cache_pkey" PRIMARY KEY using index "api_cache_pkey";

alter table "public"."api_configs" add constraint "api_configs_pkey" PRIMARY KEY using index "api_configs_pkey";

alter table "public"."aye" add constraint "aye_pkey" PRIMARY KEY using index "aye_pkey";

alter table "public"."cached_responses" add constraint "cached_responses_pkey" PRIMARY KEY using index "cached_responses_pkey";

alter table "public"."techtier" add constraint "techtier_pkey" PRIMARY KEY using index "techtier_pkey";

alter table "public"."api_configs" add constraint "api_configs_name_key" UNIQUE using index "api_configs_name_key";

alter table "public"."cached_responses" add constraint "cached_responses_config_id_endpoint_method_params_key" UNIQUE using index "cached_responses_config_id_endpoint_method_params_key";

alter table "public"."cached_responses" add constraint "cached_responses_config_id_fkey" FOREIGN KEY (config_id) REFERENCES api_configs(id) not valid;

alter table "public"."cached_responses" validate constraint "cached_responses_config_id_fkey";

alter table "public"."techtier" add constraint "techtier_name_key" UNIQUE using index "techtier_name_key";

alter table "public"."techtier" add constraint "techtier_url_key" UNIQUE using index "techtier_url_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_cached_api_data(p_config_name text, p_endpoint text, p_method http_method DEFAULT 'GET'::http_method, p_params jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_config api_configs%ROWTYPE;
    v_cached cached_responses%ROWTYPE;
    v_response jsonb;
    v_url text;
BEGIN
    -- Get API configuration
    SELECT * INTO v_config 
    FROM api_configs 
    WHERE name = p_config_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'API configuration not found: %', p_config_name;
    END IF;

    -- Check cache
    SELECT * INTO v_cached
    FROM cached_responses
    WHERE config_id = v_config.id
        AND endpoint = p_endpoint
        AND method = p_method
        AND params = p_params
        AND expires_at > now();

    IF FOUND THEN
        RETURN v_cached.response;
    END IF;

    -- Make API call using pg_net extension
    v_url := v_config.base_url || p_endpoint;
    
    -- Insert new cache entry
    INSERT INTO cached_responses (
        config_id,
        endpoint,
        method,
        params,
        response,
        expires_at
    ) VALUES (
        v_config.id,
        p_endpoint,
        p_method,
        p_params,
        v_response,
        now() + (v_config.cache_duration_seconds || ' seconds')::interval
    );

    RETURN v_response;
END;
$function$
;

grant delete on table "public"."api_cache" to "anon";

grant insert on table "public"."api_cache" to "anon";

grant references on table "public"."api_cache" to "anon";

grant select on table "public"."api_cache" to "anon";

grant trigger on table "public"."api_cache" to "anon";

grant truncate on table "public"."api_cache" to "anon";

grant update on table "public"."api_cache" to "anon";

grant delete on table "public"."api_cache" to "authenticated";

grant insert on table "public"."api_cache" to "authenticated";

grant references on table "public"."api_cache" to "authenticated";

grant select on table "public"."api_cache" to "authenticated";

grant trigger on table "public"."api_cache" to "authenticated";

grant truncate on table "public"."api_cache" to "authenticated";

grant update on table "public"."api_cache" to "authenticated";

grant delete on table "public"."api_cache" to "service_role";

grant insert on table "public"."api_cache" to "service_role";

grant references on table "public"."api_cache" to "service_role";

grant select on table "public"."api_cache" to "service_role";

grant trigger on table "public"."api_cache" to "service_role";

grant truncate on table "public"."api_cache" to "service_role";

grant update on table "public"."api_cache" to "service_role";

grant delete on table "public"."api_configs" to "anon";

grant insert on table "public"."api_configs" to "anon";

grant references on table "public"."api_configs" to "anon";

grant select on table "public"."api_configs" to "anon";

grant trigger on table "public"."api_configs" to "anon";

grant truncate on table "public"."api_configs" to "anon";

grant update on table "public"."api_configs" to "anon";

grant delete on table "public"."api_configs" to "authenticated";

grant insert on table "public"."api_configs" to "authenticated";

grant references on table "public"."api_configs" to "authenticated";

grant select on table "public"."api_configs" to "authenticated";

grant trigger on table "public"."api_configs" to "authenticated";

grant truncate on table "public"."api_configs" to "authenticated";

grant update on table "public"."api_configs" to "authenticated";

grant delete on table "public"."api_configs" to "service_role";

grant insert on table "public"."api_configs" to "service_role";

grant references on table "public"."api_configs" to "service_role";

grant select on table "public"."api_configs" to "service_role";

grant trigger on table "public"."api_configs" to "service_role";

grant truncate on table "public"."api_configs" to "service_role";

grant update on table "public"."api_configs" to "service_role";

grant delete on table "public"."aye" to "anon";

grant insert on table "public"."aye" to "anon";

grant references on table "public"."aye" to "anon";

grant select on table "public"."aye" to "anon";

grant trigger on table "public"."aye" to "anon";

grant truncate on table "public"."aye" to "anon";

grant update on table "public"."aye" to "anon";

grant delete on table "public"."aye" to "authenticated";

grant insert on table "public"."aye" to "authenticated";

grant references on table "public"."aye" to "authenticated";

grant select on table "public"."aye" to "authenticated";

grant trigger on table "public"."aye" to "authenticated";

grant truncate on table "public"."aye" to "authenticated";

grant update on table "public"."aye" to "authenticated";

grant delete on table "public"."aye" to "service_role";

grant insert on table "public"."aye" to "service_role";

grant references on table "public"."aye" to "service_role";

grant select on table "public"."aye" to "service_role";

grant trigger on table "public"."aye" to "service_role";

grant truncate on table "public"."aye" to "service_role";

grant update on table "public"."aye" to "service_role";

grant delete on table "public"."cached_responses" to "anon";

grant insert on table "public"."cached_responses" to "anon";

grant references on table "public"."cached_responses" to "anon";

grant select on table "public"."cached_responses" to "anon";

grant trigger on table "public"."cached_responses" to "anon";

grant truncate on table "public"."cached_responses" to "anon";

grant update on table "public"."cached_responses" to "anon";

grant delete on table "public"."cached_responses" to "authenticated";

grant insert on table "public"."cached_responses" to "authenticated";

grant references on table "public"."cached_responses" to "authenticated";

grant select on table "public"."cached_responses" to "authenticated";

grant trigger on table "public"."cached_responses" to "authenticated";

grant truncate on table "public"."cached_responses" to "authenticated";

grant update on table "public"."cached_responses" to "authenticated";

grant delete on table "public"."cached_responses" to "service_role";

grant insert on table "public"."cached_responses" to "service_role";

grant references on table "public"."cached_responses" to "service_role";

grant select on table "public"."cached_responses" to "service_role";

grant trigger on table "public"."cached_responses" to "service_role";

grant truncate on table "public"."cached_responses" to "service_role";

grant update on table "public"."cached_responses" to "service_role";

grant delete on table "public"."techtier" to "anon";

grant insert on table "public"."techtier" to "anon";

grant references on table "public"."techtier" to "anon";

grant select on table "public"."techtier" to "anon";

grant trigger on table "public"."techtier" to "anon";

grant truncate on table "public"."techtier" to "anon";

grant update on table "public"."techtier" to "anon";

grant delete on table "public"."techtier" to "authenticated";

grant insert on table "public"."techtier" to "authenticated";

grant references on table "public"."techtier" to "authenticated";

grant select on table "public"."techtier" to "authenticated";

grant trigger on table "public"."techtier" to "authenticated";

grant truncate on table "public"."techtier" to "authenticated";

grant update on table "public"."techtier" to "authenticated";

grant delete on table "public"."techtier" to "service_role";

grant insert on table "public"."techtier" to "service_role";

grant references on table "public"."techtier" to "service_role";

grant select on table "public"."techtier" to "service_role";

grant trigger on table "public"."techtier" to "service_role";

grant truncate on table "public"."techtier" to "service_role";

grant update on table "public"."techtier" to "service_role";

create policy "allow anon read"
on "public"."techtier"
as permissive
for select
to anon
using (true);



