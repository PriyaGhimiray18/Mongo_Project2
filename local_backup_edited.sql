--
-- hostel_booking_ownerQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_userId_fkey";
ALTER TABLE ONLY public."Room" DROP CONSTRAINT "Room_hostelId_fkey";
ALTER TABLE ONLY public."Booking" DROP CONSTRAINT "Booking_userId_fkey";
ALTER TABLE ONLY public."Booking" DROP CONSTRAINT "Booking_roomId_fkey";
ALTER TABLE ONLY public."Account" DROP CONSTRAINT "Account_userId_fkey";
DROP INDEX public."VerificationToken_token_key";
DROP INDEX public."VerificationToken_identifier_token_key";
DROP INDEX public."User_studentId_key";
DROP INDEX public."User_email_key";
DROP INDEX public."Session_sessionToken_key";
DROP INDEX public."Room_room_number_hostelId_key";
DROP INDEX public."Hostel_name_key";
DROP INDEX public."Booking_userId_idx";
DROP INDEX public."Booking_roomId_idx";
DROP INDEX public."Account_provider_providerAccountId_key";
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_pkey";
ALTER TABLE ONLY public."Room" DROP CONSTRAINT "Room_pkey";
ALTER TABLE ONLY public."Hostel" DROP CONSTRAINT "Hostel_pkey";
ALTER TABLE ONLY public."Booking" DROP CONSTRAINT "Booking_pkey";
ALTER TABLE ONLY public."Account" DROP CONSTRAINT "Account_pkey";
ALTER TABLE public."Room" ALTER COLUMN id DROP DEFAULT;
DROP TABLE public._prisma_migrations;
DROP TABLE public."VerificationToken";
DROP TABLE public."User";
DROP TABLE public."Session";
DROP SEQUENCE public."Room_id_seq";
DROP TABLE public."Room";
DROP TABLE public."Hostel";
DROP TABLE public."Booking";
DROP TABLE public."Account";
DROP TYPE public."RoomStatus";
DROP TYPE public."BookingStatus";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: hostel_booking_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO hostel_booking_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: hostel_booking_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: hostel_booking_owner
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."BookingStatus" OWNER TO hostel_booking_owner;

--
-- Name: RoomStatus; Type: TYPE; Schema: public; Owner: hostel_booking_owner
--

CREATE TYPE public."RoomStatus" AS ENUM (
    'AVAILABLE',
    'PARTIALLY_BOOKED',
    'FULLY_BOOKED',
    'MAINTENANCE'
);


ALTER TYPE public."RoomStatus" OWNER TO hostel_booking_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO hostel_booking_owner;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "studentName" text NOT NULL,
    department text NOT NULL,
    "checkinDate" timestamp(3) without time zone NOT NULL,
    "numPeople" integer NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "checkoutDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "studentId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "roomId" integer NOT NULL
);


ALTER TABLE public."Booking" OWNER TO hostel_booking_owner;

--
-- Name: Hostel; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."Hostel" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    accommodation text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Hostel" OWNER TO hostel_booking_owner;

--
-- Name: Room; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."Room" (
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    capacity integer NOT NULL,
    floor integer NOT NULL,
    "hostelId" text NOT NULL,
    occupants integer DEFAULT 0 NOT NULL,
    room_number integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."Room" OWNER TO hostel_booking_owner;

--
-- Name: Room_id_seq; Type: SEQUENCE; Schema: public; Owner: hostel_booking_owner
--

CREATE SEQUENCE public."Room_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Room_id_seq" OWNER TO hostel_booking_owner;

--
-- Name: Room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hostel_booking_owner
--

ALTER SEQUENCE public."Room_id_seq" OWNED BY public."Room".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO hostel_booking_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "studentId" text,
    password text NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO hostel_booking_owner;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO hostel_booking_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: hostel_booking_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO hostel_booking_owner;

--
-- Name: Room id; Type: DEFAULT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Room" ALTER COLUMN id SET DEFAULT nextval('public."Room_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."Booking" (id, "studentName", department, "checkinDate", "numPeople", email, phone, "checkoutDate", "createdAt", status, "studentId", "updatedAt", "userId", "roomId") FROM stdin;
ed216cf3-ee9d-4793-b896-c5d512857b4d	shilpa Rai\nPriya Ghimiray\nPhub Gyem	1EG\n2EG\n2IT	2025-05-18 00:00:00	2	02230201.cst@rub.edu.bt	77766463	\N	2025-05-18 04:47:42.168	PENDING	02230201\n02230143\n02230193	2025-05-18 04:47:42.168	04ff452e-272f-4a07-b5d8-8fc1b66d5d62	321
c1f6960f-8ec4-431d-9775-60a714d5782b	Priya Ghimiray	2IT	2025-05-18 00:00:00	1	02230143.cst@rub.edu.bt	77766463	\N	2025-05-18 05:21:29.923	CONFIRMED	02230143	2025-05-18 05:21:29.923	7f4068a3-7660-4094-8bd7-a184ddafaab2	320
9969186b-ec2e-49ac-9e0d-e110f89ee3e7	phub Gyem	2EG	2025-05-18 00:00:00	1	02230143.cst@rub.edu.bt	77766463	\N	2025-05-18 05:21:29.923	CONFIRMED	02230193	2025-05-18 05:21:29.923	7f4068a3-7660-4094-8bd7-a184ddafaab2	320
16cacde2-ca9d-4617-9350-9b3838e6e1a2	Shilpa Rai	1EG	2025-05-18 00:00:00	1	02230143.cst@rub.edu.bt	77766463	\N	2025-05-18 05:21:29.923	CONFIRMED	02230201	2025-05-18 05:21:29.923	7f4068a3-7660-4094-8bd7-a184ddafaab2	320
dc572181-eed9-4197-8d5c-4b091a341839	Choney Rangdel	2IT	2025-05-18 00:00:00	1	02230122.cst@rub.edu.bt	17456734	\N	2025-05-18 05:29:36.569	CONFIRMED	02220122	2025-05-18 05:29:36.569	7f4068a3-7660-4094-8bd7-a184ddafaab2	34
f7256268-97b4-4666-8e6c-f6ae1e7bf199	Thukten Tshering	2IT	2025-05-18 00:00:00	1	02230122.cst@rub.edu.bt	17456734	\N	2025-05-18 05:29:36.569	CONFIRMED	02230155	2025-05-18 05:29:36.569	7f4068a3-7660-4094-8bd7-a184ddafaab2	34
50f7732a-765a-439b-9aba-1348a141d285	Rinchen Om	2IT	2025-05-19 00:00:00	1	02230144.cst@rub.edu.bt	7789034	\N	2025-05-19 14:26:16.808	CONFIRMED	02230144	2025-05-19 14:26:16.808	6fc20b9a-96f9-420f-80d0-dba29609095e	347
54d26ff4-e6df-46a6-8bf4-f08e6389a56b	Sangay Choden	2EG	2025-05-19 00:00:00	1	02230144.cst@rub.edu.bt	7789034	\N	2025-05-19 14:26:16.808	CONFIRMED	02230204	2025-05-19 14:26:16.808	6fc20b9a-96f9-420f-80d0-dba29609095e	347
\.


--
-- Data for Name: Hostel; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."Hostel" (id, name, type, description, accommodation, "createdAt", "updatedAt") FROM stdin;
948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	Hostel E	boys	Boy's Hostel	2 floors	2025-05-17 11:36:52.321	2025-05-17 11:36:52.321
9da3a49f-0d75-4811-8a21-beaef9b20639	Hostel A	boys	Boy's Hostel	3 floors	2025-05-17 11:36:52.461	2025-05-17 11:36:52.461
a190f3e7-666a-483a-b172-b5470cfb97b1	Hostel B	boys	Boy's Hostel	3 floors	2025-05-17 11:36:52.572	2025-05-17 11:36:52.572
0cfd134f-0cb0-4e78-8f17-de48015a7aee	RKA	boys	Boy's Hostel	4 floors	2025-05-17 11:36:52.686	2025-05-17 11:36:52.686
69e08ae2-1334-4e29-9c8f-eec75c276fa8	RKB	boys	Boy's Hostel	4 floors	2025-05-17 11:36:52.849	2025-05-17 11:36:52.849
4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	NK	boys	Boy's Hostel	4 floors	2025-05-17 11:36:52.98	2025-05-17 11:36:52.98
c0292ceb-bda5-4c59-9dff-212e2ad6293c	Lhawang	boys	Boy's Hostel	3 floors	2025-05-17 11:36:53.072	2025-05-17 11:36:53.072
0ff535e5-2e0e-4bda-bab1-3eface5fc64e	Hostel F	girls	Girl's Hostel	3 floors	2025-05-17 11:36:53.133	2025-05-17 11:36:53.133
80803a59-a4e8-4e0a-85f4-dac5e680a7a7	Hostel C	girls	Girl's Hostel	3 floors	2025-05-17 11:36:53.328	2025-05-17 11:36:53.328
6db81ac5-ceb6-42f3-a578-58b3196b3c97	Hostel D	girls	Girl's Hostel	3 floors	2025-05-17 11:36:53.445	2025-05-17 11:36:53.445
a9dc4d37-ca22-4d50-ac97-3b76cda80edc	Hostel J	girls	New Girls hostel	Two per room	2025-05-18 09:35:47.031	2025-05-18 09:35:47.031
\.


--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."Room" (status, capacity, floor, "hostelId", occupants, room_number, id) FROM stdin;
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	101	1
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	102	2
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	103	3
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	104	4
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	105	5
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	106	6
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	107	7
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	108	8
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	109	9
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	110	10
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	111	11
AVAILABLE	2	1	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	112	12
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	201	13
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	202	14
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	203	15
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	204	16
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	205	17
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	206	18
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	207	19
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	208	20
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	209	21
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	210	22
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	211	23
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	212	24
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	213	25
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	214	26
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	215	27
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	216	28
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	217	29
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	218	30
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	219	31
AVAILABLE	2	2	948ec7fa-d3ac-47e1-b83d-4d1b42ab1ebd	0	220	32
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	101	33
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	103	35
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	104	36
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	105	37
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	106	38
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	107	39
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	108	40
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	109	41
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	110	42
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	111	43
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	112	44
AVAILABLE	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	0	113	45
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	201	46
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	202	47
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	203	48
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	204	49
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	205	50
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	206	51
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	207	52
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	208	53
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	209	54
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	210	55
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	211	56
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	212	57
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	213	58
AVAILABLE	2	2	9da3a49f-0d75-4811-8a21-beaef9b20639	0	214	59
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	301	60
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	302	61
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	303	62
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	304	63
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	305	64
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	306	65
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	307	66
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	308	67
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	309	68
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	310	69
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	311	70
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	312	71
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	313	72
AVAILABLE	2	3	9da3a49f-0d75-4811-8a21-beaef9b20639	0	314	73
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	101	74
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	102	75
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	103	76
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	104	77
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	105	78
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	106	79
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	107	80
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	108	81
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	109	82
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	110	83
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	111	84
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	112	85
AVAILABLE	2	1	a190f3e7-666a-483a-b172-b5470cfb97b1	0	113	86
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	201	87
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	202	88
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	203	89
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	204	90
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	205	91
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	206	92
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	207	93
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	208	94
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	209	95
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	210	96
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	211	97
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	212	98
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	213	99
AVAILABLE	2	2	a190f3e7-666a-483a-b172-b5470cfb97b1	0	214	100
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	301	101
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	302	102
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	303	103
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	304	104
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	305	105
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	306	106
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	307	107
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	308	108
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	309	109
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	310	110
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	311	111
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	312	112
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	313	113
AVAILABLE	2	3	a190f3e7-666a-483a-b172-b5470cfb97b1	0	314	114
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	101	115
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	102	116
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	103	117
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	104	118
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	105	119
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	106	120
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	107	121
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	108	122
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	109	123
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	110	124
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	111	125
AVAILABLE	4	1	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	112	126
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	201	127
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	202	128
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	203	129
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	204	130
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	205	131
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	206	132
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	207	133
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	208	134
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	209	135
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	210	136
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	211	137
AVAILABLE	4	2	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	212	138
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	301	139
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	302	140
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	303	141
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	304	142
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	305	143
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	306	144
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	307	145
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	308	146
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	309	147
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	310	148
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	311	149
AVAILABLE	4	3	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	312	150
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	401	151
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	402	152
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	403	153
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	404	154
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	405	155
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	406	156
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	407	157
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	408	158
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	409	159
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	410	160
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	411	161
AVAILABLE	4	4	0cfd134f-0cb0-4e78-8f17-de48015a7aee	0	412	162
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	101	163
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	102	164
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	103	165
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	104	166
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	105	167
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	106	168
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	107	169
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	108	170
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	109	171
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	110	172
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	111	173
AVAILABLE	4	1	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	112	174
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	201	175
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	202	176
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	203	177
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	204	178
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	205	179
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	206	180
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	207	181
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	208	182
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	209	183
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	210	184
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	211	185
AVAILABLE	4	2	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	212	186
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	301	187
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	302	188
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	303	189
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	304	190
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	305	191
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	306	192
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	307	193
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	308	194
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	309	195
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	310	196
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	311	197
AVAILABLE	4	3	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	312	198
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	401	199
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	402	200
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	403	201
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	404	202
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	405	203
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	406	204
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	407	205
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	408	206
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	409	207
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	410	208
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	411	209
AVAILABLE	4	4	69e08ae2-1334-4e29-9c8f-eec75c276fa8	0	412	210
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	101	211
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	102	212
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	103	213
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	104	214
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	105	215
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	106	216
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	107	217
AVAILABLE	4	1	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	108	218
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	201	219
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	202	220
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	203	221
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	204	222
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	205	223
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	206	224
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	207	225
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	208	226
AVAILABLE	4	2	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	209	227
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	301	228
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	302	229
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	303	230
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	304	231
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	305	232
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	306	233
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	307	234
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	308	235
AVAILABLE	4	3	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	309	236
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	401	237
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	402	238
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	403	239
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	404	240
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	405	241
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	406	242
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	407	243
AVAILABLE	4	4	4e93f3d3-b522-40ba-99c4-55d6bb60bc3c	0	408	244
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	101	245
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	102	246
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	103	247
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	104	248
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	105	249
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	106	250
AVAILABLE	4	1	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	107	251
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	201	252
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	202	253
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	203	254
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	204	255
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	205	256
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	206	257
AVAILABLE	4	2	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	207	258
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	301	259
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	302	260
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	303	261
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	304	262
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	305	263
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	306	264
AVAILABLE	4	3	c0292ceb-bda5-4c59-9dff-212e2ad6293c	0	307	265
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	101	266
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	102	267
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	103	268
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	104	269
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	105	270
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	106	271
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	107	272
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	108	273
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	109	274
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	110	275
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	111	276
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	112	277
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	113	278
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	114	279
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	115	280
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	116	281
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	117	282
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	118	283
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	119	284
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	120	285
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	121	286
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	122	287
AVAILABLE	3	1	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	123	288
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	201	289
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	202	290
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	203	291
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	204	292
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	205	293
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	206	294
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	207	295
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	208	296
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	209	297
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	210	298
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	211	299
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	212	300
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	213	301
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	214	302
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	215	303
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	216	304
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	217	305
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	218	306
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	219	307
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	220	308
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	221	309
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	222	310
AVAILABLE	3	2	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	223	311
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	301	312
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	302	313
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	303	314
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	304	315
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	305	316
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	306	317
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	307	318
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	308	319
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	311	322
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	312	323
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	313	324
BOOKED	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	3	309	320
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	314	325
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	315	326
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	316	327
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	317	328
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	318	329
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	319	330
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	320	331
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	321	332
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	322	333
AVAILABLE	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	0	323	334
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	101	335
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	102	336
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	103	337
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	104	338
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	105	339
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	106	340
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	107	341
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	108	342
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	109	343
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	110	344
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	111	345
AVAILABLE	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	112	346
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	201	348
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	202	349
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	203	350
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	204	351
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	205	352
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	206	353
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	207	354
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	208	355
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	209	356
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	210	357
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	211	358
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	212	359
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	213	360
AVAILABLE	2	2	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	214	361
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	301	362
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	302	363
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	303	364
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	304	365
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	305	366
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	306	367
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	307	368
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	308	369
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	309	370
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	310	371
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	311	372
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	312	373
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	313	374
AVAILABLE	2	3	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	0	314	375
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	101	376
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	102	377
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	103	378
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	104	379
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	105	380
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	106	381
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	107	382
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	108	383
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	109	384
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	110	385
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	111	386
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	112	387
AVAILABLE	2	1	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	113	388
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	201	389
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	202	390
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	203	391
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	204	392
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	205	393
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	206	394
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	207	395
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	208	396
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	209	397
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	210	398
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	211	399
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	212	400
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	213	401
AVAILABLE	2	2	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	214	402
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	301	403
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	302	404
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	303	405
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	304	406
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	305	407
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	306	408
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	307	409
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	308	410
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	309	411
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	310	412
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	311	413
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	312	414
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	313	415
AVAILABLE	2	3	6db81ac5-ceb6-42f3-a578-58b3196b3c97	0	314	416
PARTIALLY_BOOKED	3	3	0ff535e5-2e0e-4bda-bab1-3eface5fc64e	2	310	321
BOOKED	2	1	9da3a49f-0d75-4811-8a21-beaef9b20639	2	102	34
FULLY_BOOKED	2	1	80803a59-a4e8-4e0a-85f4-dac5e680a7a7	2	113	347
available	3	1	a9dc4d37-ca22-4d50-ac97-3b76cda80edc	0	101	447
available	3	2	a9dc4d37-ca22-4d50-ac97-3b76cda80edc	0	102	448
available	2	1	a9dc4d37-ca22-4d50-ac97-3b76cda80edc	0	104	449
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."User" (id, username, email, "studentId", password, "isAdmin", "createdAt") FROM stdin;
7f4068a3-7660-4094-8bd7-a184ddafaab2	Priya Ghimiray 	02230143.cst@rub.edu.bt	02230143	$2a$10$uc5TYYSeGrWTXIyGiIpDj.a1cg68/jSgQXtpSDy8BZPh/Bj987owW	f	2025-05-17 11:40:38.457
b48a4ddc-c493-48f5-b264-0efdd41f1ab2	Phub Gyem	02230193.cst@rub.edu.bt	02230193	$2a$10$mqcjnJyoSAbsQ3VTxBjKEe498Ab3bli6kyJWHRRbZq8z9CewoVfGm	f	2025-05-18 04:39:41.237
04ff452e-272f-4a07-b5d8-8fc1b66d5d62	shilpa Rai	02230201.cst@rub.edu.bt	02230201	$2a$10$/aj7Q0xRtF8D39VxA8LpJOGL1jOi4rtbxnwllqataeFHEsq3fKhqC	f	2025-05-18 04:42:21.413
ff4e57f7-cf47-4ac3-8c38-4681093aa80e	Chimi Dem	chimidem.cst@rub.edu.bt	\N	$2b$10$kd2Fkw45gdTCUhH9vopg5.2blNfSQ3GtKeIo.iQkgGeI1PA89SnyG	t	2025-05-18 12:00:33.031
6fc20b9a-96f9-420f-80d0-dba29609095e	Rinchen Om	02230144.cst@rub.edu.bt	02230144	$2a$10$YfUGNe09DQ8c9fkUJTv7/ufWKLkVkDOL.i.P1uZaqFhUmFw6MQjn2	f	2025-05-19 14:17:07.86
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: hostel_booking_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
85f47520-db96-4b1f-9fbb-73adcad6b53c	dd0e4d19e75d127144e0f23bcb37ebfdb28c715b6d67e1d5131d08f73204196a	2025-05-17 17:36:44.538113+06	20250517113644_init	\N	\N	2025-05-17 17:36:44.45907+06	1
f4b40b36-b496-46af-b795-23fec20e175f	be48806f1ace708f52251aa9209d0be07b2d17bfea618f01a935f075edc292bd	2025-05-18 21:38:17.490772+06	20250518153817_add_nextauth_models	\N	\N	2025-05-18 21:38:17.415332+06	1
\.


--
-- Name: Room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hostel_booking_owner
--

SELECT pg_catalog.setval('public."Room_id_seq"', 449, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Hostel Hostel_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_pkey" PRIMARY KEY (id);


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Booking_roomId_idx; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE INDEX "Booking_roomId_idx" ON public."Booking" USING btree ("roomId");


--
-- Name: Booking_userId_idx; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE INDEX "Booking_userId_idx" ON public."Booking" USING btree ("userId");


--
-- Name: Hostel_name_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "Hostel_name_key" ON public."Hostel" USING btree (name);


--
-- Name: Room_room_number_hostelId_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "Room_room_number_hostelId_key" ON public."Room" USING btree (room_number, "hostelId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_studentId_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "User_studentId_key" ON public."User" USING btree ("studentId");


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: hostel_booking_owner
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Room Room_hostelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES public."Hostel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hostel_booking_owner
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: hostel_booking_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- hostel_booking_ownerQL database dump complete
--

