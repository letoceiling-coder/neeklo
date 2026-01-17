CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: brief_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brief_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    company text,
    role text NOT NULL,
    project_name text,
    description text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    files jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: brief_submissions brief_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brief_submissions
    ADD CONSTRAINT brief_submissions_pkey PRIMARY KEY (id);


--
-- Name: brief_submissions Allow public insert on brief_submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert on brief_submissions" ON public.brief_submissions FOR INSERT TO anon WITH CHECK (true);


--
-- Name: brief_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brief_submissions ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


