SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict WFiW8drSiL1oLfHgxnpfGFEtrAANovSGLHuhLKjPyaXdE7MT7UlJq3cWhLDKuzN

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at", "custom_claims_allowlist") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
cb757604-2eaf-4c01-b309-d817ed9ae496	8db1b004-e0ec-46c4-b973-8166c7fa11b2	2e6e396c-3f1b-4c50-a120-de7489d58114	s256	IfadDv3uzSwiMWtYbJdZSFiNXuAcOD9lTroEZSUqESY	recovery			2026-03-10 01:25:14.982712+00	2026-03-10 01:25:14.982712+00	recovery	\N	\N	\N	\N	\N	f
fad5435d-5ee5-448a-b192-2b575bcc490e	8db1b004-e0ec-46c4-b973-8166c7fa11b2	8fd330a2-0e78-436b-9487-13ec2448d99f	s256	UNvCtndMSfTvD7IwS68Ykv-JkA9Svq5gwKP6LTxqOvs	recovery			2026-03-10 01:45:41.090601+00	2026-03-10 01:45:41.090601+00	recovery	\N	\N	\N	\N	\N	f
6ffbe31a-6762-47a6-8a63-448626ac5a09	8db1b004-e0ec-46c4-b973-8166c7fa11b2	9a5ded6f-81a3-49e6-b868-23f84c752b9f	s256	-rHcb2mFxCQhRos4O4jcclJ_RVKE7MztXyn82k8MASQ	recovery			2026-03-10 01:46:46.852634+00	2026-03-10 01:46:46.852634+00	recovery	\N	\N	\N	\N	\N	f
d0f53e71-21c4-47f6-800a-6d3acd4aaf5c	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	8a046b58-810d-4736-b97d-70b861ca4452	s256	EtJ5OFNYCwr0_O2HRhSBoaitYiqpCvafJrtbu0rYKXA	recovery			2026-03-10 01:57:28.051812+00	2026-03-10 01:57:28.051812+00	recovery	\N	\N	\N	\N	\N	f
c60d77ad-3ed2-436d-a23c-90d34cbf05d9	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	c7ce881c-e0c8-47c5-9c83-462a945a55ef	s256	Of9Il2-66RG6J7SL8nYe1sDtXUohu_KIiKNFG2ga_5c	recovery			2026-03-10 02:05:12.249904+00	2026-03-10 02:05:12.249904+00	recovery	\N	\N	\N	\N	\N	f
28dc57aa-1b8e-4e62-9938-e06e9d89f0e9	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	8fa259e2-2787-4732-af95-42393b362874	s256	UEUSNVSTMbYlzrqpwM65Ts8QT2pthJyd4tGCUZ81lwA	recovery			2026-03-10 02:10:19.289195+00	2026-03-10 02:10:50.003754+00	recovery	2026-03-10 02:10:50.003695+00	\N	\N	\N	\N	f
ab553dbd-996f-4565-9a7d-f6d67263cac8	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	d4c2655c-ce20-4cd5-a109-bc28cbf5e0a4	s256	zPnx0BwlnYPEZZ3cosEnml-cEHlbyRJ4n95mRi3m44I	recovery			2026-03-10 02:14:10.493071+00	2026-03-10 02:14:23.100771+00	recovery	2026-03-10 02:14:23.100721+00	\N	\N	\N	\N	f
713f6081-1836-419e-b229-c3d8e06933a7	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	e45ff770-6fa8-4007-8919-52e1c041b78a	s256	4YBd-2reZcrlBKC2CS5gVNVNiVNC5f5NIvhRqEVb6qw	recovery			2026-03-10 02:22:04.838089+00	2026-03-10 02:22:36.377091+00	recovery	2026-03-10 02:22:36.377043+00	\N	\N	\N	\N	f
11b37f0f-495d-4be3-83f3-591f988e8420	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	41d8f1dd-9c9d-45da-ba07-6f7ae1345ac3	s256	VwRyVT4GON88OgCNp1mc5ORkoDGmONN8uFFJa8Y9Hzc	recovery			2026-03-10 02:27:39.071875+00	2026-03-10 02:27:51.81397+00	recovery	2026-03-10 02:27:51.813915+00	\N	\N	\N	\N	f
c92e434c-534f-4c41-b4d4-8c77e0f14628	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	305fbea8-f011-4df3-bbce-bd2b1726ceab	s256	3p9B_qHO7usLT0o8tPMWELzaArrW9idJpQnj3hgmnb4	recovery			2026-03-10 03:13:46.858192+00	2026-03-10 03:13:46.858192+00	recovery	\N	\N	\N	\N	\N	f
b96ae296-c110-4c19-87d9-0c1ad66a2518	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	17eadb40-0b7b-4c2c-8ce4-4ce8818f8c74	s256	p32Uxp8HNc_589VNl8ZRiksSl7oZkeu6Mx3HHbiPqt8	recovery			2026-03-10 03:22:49.636911+00	2026-03-10 03:23:49.064697+00	recovery	2026-03-10 03:23:49.064644+00	\N	\N	\N	\N	f
06237cec-f0a3-477e-8c5c-ef97f2189565	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	2bdd7602-4ec2-4d0c-8252-7c49575d9ac0	s256	zcWFetRJA4zNSbkZWWqS-9rMuSvhXimZUs6ITrlD3QY	recovery			2026-03-10 03:30:53.553396+00	2026-03-10 03:31:18.211361+00	recovery	2026-03-10 03:31:18.211307+00	\N	\N	\N	\N	f
7a61ecfb-d6df-4999-a090-2cefa1aa1a7e	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	ca68872a-3ca9-4acf-90cb-a1c0af63d307	s256	-OoW0emimx2YcOYvYkcHAu8vsxmKRqhCHQneT1U3iaY	recovery			2026-03-10 03:53:17.69412+00	2026-03-10 03:53:47.623574+00	recovery	2026-03-10 03:53:47.623519+00	\N	\N	\N	\N	f
d89b66a4-1bf8-45e0-aeea-61675bd5503c	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	37df7eca-5d39-44e6-88ab-4db5f09b55b9	s256	O4eMMjEyqDXYN-VOYP2-D_3xcnbUrrRj6IH-pR-PO4g	recovery			2026-03-10 04:04:03.903277+00	2026-03-10 04:04:14.25872+00	recovery	2026-03-10 04:04:14.25865+00	\N	\N	\N	\N	f
35d3dddc-3956-4d67-aab4-2e78d37abd11	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	654ac81f-e767-49e5-9288-b96b82e7385f	s256	YUMTVIIEHDm0KPsFDztMw_z6aO5u7oF9psWSqdDc2jE	recovery			2026-03-10 04:04:51.993589+00	2026-03-10 04:04:51.993589+00	recovery	\N	\N	\N	\N	\N	f
956f68eb-990b-4ec6-973e-1cab887097cb	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	c2954ff1-b1d0-42e8-bae3-c81b16000e8e	s256	VJmmncJiGsx0z1SUPVmG3fIK1EHF1uK_0BHP8zKijYs	recovery			2026-03-10 04:05:59.048007+00	2026-03-10 04:05:59.048007+00	recovery	\N	\N	\N	\N	\N	f
55f499c4-6437-4c11-9688-25c28906d987	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	5cb7b7a2-8074-424a-91e8-fa6b05d76dbb	s256	LCznM6XYkEPIt261986qjd0BiFD9eR9eeydTNxHB4cw	recovery			2026-03-10 04:06:04.898711+00	2026-03-10 04:06:15.185693+00	recovery	2026-03-10 04:06:15.185645+00	\N	\N	\N	\N	f
2cd1bf4b-f079-46ba-957c-c5417bc8f77c	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	bf67649c-7a14-4819-ae23-3ef874613549	s256	y6XD_8ikMqitEjaOKEqU72uUPd7yyRljDqaQdwVL8aI	recovery			2026-03-10 04:10:17.979282+00	2026-03-10 04:10:27.719905+00	recovery	2026-03-10 04:10:27.719855+00	\N	\N	\N	\N	f
05c9f08e-53c7-4b22-a5af-1b81c4f0225b	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	7d83d1d3-1c49-457d-9757-7eb2c0ed9fa8	s256	P2RDZvprtCyohHmOTk3qKbWwF4H3DK6eZV25MoRSrag	recovery			2026-03-10 04:14:32.360353+00	2026-03-10 04:14:43.974639+00	recovery	2026-03-10 04:14:43.97458+00	\N	\N	\N	\N	f
9838092f-d99b-4eff-b73f-ed55529351b5	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	5c9b77dc-d42a-4aca-ada1-9def4074b328	s256	O96fjbcGBR5BaT3lzDlRROll-Mnjc0HDYfTj9TvIpGQ	recovery			2026-03-10 04:37:56.471038+00	2026-03-10 04:38:08.703893+00	recovery	2026-03-10 04:38:08.703827+00	\N	\N	\N	\N	f
bfd8a663-8bd4-46eb-89ab-c6bc52907f12	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	b693d563-936f-47be-9661-8d951f1abe43	s256	qx8M7hFfQ84IIbz2Q3en-2H0J-fVibgNxyNCuJu2y3E	recovery			2026-03-10 15:09:04.76833+00	2026-03-10 15:09:04.76833+00	recovery	\N	\N	\N	\N	\N	f
36ad3bf3-19e5-415e-9420-f6cf2a1ee771	bfbc49ae-a77d-4282-bf0a-47a75bd1e64b	e1eabe05-0157-407f-8ac7-ff9fa79eee2a	s256	9hpnWRrMci5JhT290MHCQybSYofGbWO5nXql3oJcH30	recovery			2026-03-10 16:54:52.493448+00	2026-03-10 16:54:52.493448+00	recovery	\N	\N	\N	\N	\N	f
c1e62b49-ae91-4ac6-9b81-0af487e621a6	7775b5b0-213f-4347-a319-e74ab920d747	b9b2ecae-e827-4a9e-b21e-2d21d484ac4b	s256	iM6WdW8bPdmVS_yAuC62UUDet_IYiT3qM2Y-i8aOpig	recovery			2026-03-10 17:50:31.311905+00	2026-03-10 17:50:31.311905+00	recovery	\N	\N	\N	\N	\N	f
75810b1f-97b5-4595-9820-bbaa8749eb96	7775b5b0-213f-4347-a319-e74ab920d747	9a7fefe6-4bc5-4176-b61e-35b3656381a8	s256	52zDlbpp9sH9UU_C9ZO31w93_JjP1Xb7o4-SYFa93Vw	recovery			2026-03-10 17:54:02.060342+00	2026-03-10 17:54:02.060342+00	recovery	\N	\N	\N	\N	\N	f
c1551ef3-fe80-4774-b6f2-0ca631e3b900	2ee91872-abbe-4d2e-be03-8e4eb3b47e05	1ce4d75a-6ec2-4427-80d9-fbb620cbdf8d	s256	NSjdlkJ8S4RdOuTS-r9YLDnyRcEnHrYhx6xYBiMdPqk	recovery			2026-03-19 15:30:56.745208+00	2026-03-19 15:30:56.745208+00	recovery	\N	\N	\N	\N	\N	f
1b8f012d-a917-411b-94c1-893d0fd3901f	fb42a92d-b85a-4718-a456-1b8953871eaa	b14146a8-db49-4753-b2bc-896849b2d7fe	s256	_G7Gt1WF0JCyqPYL0wCXecTR5einGUPeGypoWtm6yV4	recovery			2026-03-19 15:31:11.703863+00	2026-03-19 15:31:11.703863+00	recovery	\N	\N	\N	\N	\N	f
dba8abe0-97a4-4786-926a-b81feff177ba	fac90012-570f-4d3c-90e2-dd3d991e5aec	2097e93d-0fc4-46d5-b7eb-8e5e5c719171	s256	RMHGdftVmx8c4Gxb7VQOftWStDlm253tjdgVm6oMvYQ	recovery			2026-03-19 15:31:13.448506+00	2026-03-19 15:31:13.448506+00	recovery	\N	\N	\N	\N	\N	f
c9fef74b-0df7-478e-bba2-744da17e1b59	a5c3f506-7bf6-4a27-af1c-c26035301e50	d35a3d9d-0060-4ca8-a22c-07e6497d334f	s256	127sYZdUgg62aBD0RMan9V-8TELdBrf4Ntnk01Rx9nE	recovery			2026-03-19 15:40:59.033388+00	2026-03-19 15:40:59.033388+00	recovery	\N	\N	\N	\N	\N	f
8d955080-3a1c-4f92-b122-a4abe18696da	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	97bb866f-4745-4ecf-b54a-9e2ab7ee4f1a	s256	6qjPGPG4XRnxmvv-sPcfoHPo5mpwWCXWpDBSRoVYNSU	recovery			2026-04-09 13:30:03.808585+00	2026-04-09 13:30:03.808585+00	recovery	\N	\N	\N	\N	\N	f
caab8fe6-12b7-490d-91a8-c5c6e6132930	b05fe275-d1f1-4af9-82af-06a688751425	2b9ae2ae-0956-4ae8-bc6b-d6f07ee3d5e7	s256	H_5Z6UzbvmNMLsOUyPSnC6QCI1Al8JIV7BJoPr-coqs	recovery			2026-07-07 15:13:49.422304+00	2026-07-07 15:13:49.422304+00	recovery	\N	\N	\N	\N	\N	f
95917a21-3ed8-4c51-b438-36f5fb5c7b14	8a923944-1c53-4584-94c1-f72c0848d04b	fc2b28ac-2bda-4fb4-b161-5bf02a24cc3a	s256	srxxhAfFuXO6fRvIsURZ-ivxPla3VzdVGjJ1fXyvyi8	recovery			2026-07-07 16:42:07.89538+00	2026-07-07 16:42:07.89538+00	recovery	\N	\N	\N	\N	\N	f
7a0af78a-79fb-4022-8690-d1560d33de61	ece5557b-c859-4da3-bd35-f1d2b3beb586	dd20f07a-56bf-4a27-9c19-64acf23d076e	s256	z5qdcIUwdqbDXZQGxBfU8viAoZVcJ26OCWu2Zyhdmak	recovery			2026-07-07 16:42:10.025336+00	2026-07-07 16:42:10.025336+00	recovery	\N	\N	\N	\N	\N	f
1cb08b46-4046-46b9-a37c-be1ffd29b6f7	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	e55efc5c-11dc-48c3-8ba6-ece780a6601f	s256	uncKO82AkHP5Q7QLYaqaIGdlBiN56NqOEeOZ2-YqA-o	recovery			2026-07-07 16:42:24.863106+00	2026-07-07 16:42:24.863106+00	recovery	\N	\N	\N	\N	\N	f
41f2d8b7-c12d-44ea-8e78-31ebd04c662f	bbde362e-ad70-445c-be8c-861b0e06052c	7b3d5a60-d3d7-48c3-997d-90c427bd3d70	s256	8Vs-Cm_NiErVhmf2acw5i5gwqprDsq6OQplXpTr08ng	recovery			2026-07-08 14:31:31.125834+00	2026-07-08 14:31:31.125834+00	recovery	\N	\N	\N	\N	\N	f
13dff106-45f0-40c9-8d66-6e86e1ee820d	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	8f6e1da1-ab51-4cd8-aa67-b373890b109a	s256	rXNcJb23St_fmcDXLJs3HB9n4nhjms292tSN_koAukM	recovery			2026-07-09 15:25:41.21406+00	2026-07-09 15:25:41.21406+00	recovery	\N	\N	\N	\N	\N	f
e6d416e3-01a8-43df-858d-dd840c35c915	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	b233921f-ab2b-476c-adbe-79ee224de695	s256	jWhOu7_ZBnp69rUV2hSd7KrSXye6qye08VFS0eGjPK0	recovery			2026-07-09 15:32:55.647501+00	2026-07-09 15:32:55.647501+00	recovery	\N	\N	\N	\N	\N	f
f8c8c0a3-26b9-45d1-8d64-83edd618bd24	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	267aa6df-1dd2-42e3-9562-16fd816820b7	s256	nA6754ef2GxjlChDSfWL0Wvh8Yq2h-nnE6xQhINln2Y	recovery			2026-07-09 16:24:22.151267+00	2026-07-09 16:24:22.151267+00	recovery	\N	\N	\N	\N	\N	f
0822ae02-d3b8-4fa4-85eb-e2d37991b506	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	981761f9-9a08-44bd-90f7-bb3b966bd7ec	s256	qKN334DRMAB1ntpkfitNBgY-I0JNe1sNG1yuXJz3wtw	recovery			2026-07-14 15:14:26.835182+00	2026-07-14 15:14:26.835182+00	recovery	\N	\N	\N	\N	\N	f
68d1a87b-771e-4ca0-9546-3fdb5e9f585f	bbde362e-ad70-445c-be8c-861b0e06052c	f0345207-49d0-4b5f-9687-b186116fe8df	s256	3GVOcFy85K1IDn57hBIz-MCnutEv6TVhKNXm6J7xJoE	recovery			2026-07-16 15:10:29.879521+00	2026-07-16 15:10:29.879521+00	recovery	\N	\N	\N	\N	\N	f
67ca998c-bc81-48d6-929c-d22c227cd5ab	b05fe275-d1f1-4af9-82af-06a688751425	b60ba5aa-e01f-4249-9588-c2cf3c2c9ad6	s256	yHkaR7xKy9p1HQOoy_Rra9VjYRw973xYUOGXU2hu_cc	recovery			2026-07-29 19:08:17.544682+00	2026-07-29 19:08:17.544682+00	recovery	\N	\N	\N	\N	\N	f
6fce2d16-127e-4ab1-ac7b-bf3daa100e6b	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	b6b7b671-56f5-42bc-8d22-ab3f09c55463	s256	yJV2uH5TCvXYIgo1RqCedTj-AZI9fOo118vEYJWlsb4	recovery			2026-08-06 15:42:10.313775+00	2026-08-06 15:42:10.313775+00	recovery	\N	\N	\N	\N	\N	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	1b35a5ec-c188-4e69-b68c-d37f158859e2	authenticated	authenticated	consul.uac.admin@gmail.com	$2a$10$JlCe9L5Hv0FM20hLBAaoS.T65Ga2ZdrZui5sv2/mHNmxa.n2W.Y8W	2026-03-09 17:35:24.410489+00	\N		\N		\N			\N	2026-08-06 15:26:44.099141+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-03-09 17:35:24.36656+00	2026-08-06 15:26:44.179995+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	authenticated	authenticated	augusto.torrejano.f@uniautonoma.edu.co	$2a$10$Mh2PoEey6mQuGUSQOopjb.Q..A8MgOtYw692Xx7IlB9RdDb4vdSs6	2026-03-19 15:27:01.980677+00	\N		\N		\N			\N	2026-04-09 15:37:53.189368+00	{"provider": "email", "providers": ["email"]}	{"cedula": "12132604", "correo": "augusto.torrejano.f@uniautonoma.edu.co", "telefono": "3125380084", "email_verified": true, "nombre_completo": "Augusto Torrejano"}	\N	2026-03-19 15:27:01.963144+00	2026-05-07 15:45:17.703499+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2ee91872-abbe-4d2e-be03-8e4eb3b47e05	authenticated	authenticated	jherson.valencia.c@uniautonoma.edu.co	$2a$10$qYwdkQIsICbzi.bsUTuJy.7iRybWi6l4UISfmnwOdhzEiC7Lz97EC	2026-03-19 15:23:03.094276+00	\N		\N		\N			\N	2026-05-07 14:48:26.578793+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1002981408", "correo": "Jherson.Valencia.c@uniautonoma.edu.co", "telefono": "3224062838", "email_verified": true, "nombre_completo": "Jherson Danilo Valencia Cardozo"}	\N	2026-03-19 15:23:03.042249+00	2026-08-05 21:34:39.361945+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	fb42a92d-b85a-4718-a456-1b8953871eaa	authenticated	authenticated	profesional.consultoriojuridico@uniautonoma.edu.co	$2a$10$iT.iwk9pAENuVS.l9WfBW.WhxoYbGHIYN8BURNmEq1vdJ0Jre09B2	2026-03-19 15:28:20.730798+00	\N		\N		\N			\N	2026-07-29 20:13:31.785897+00	{"provider": "email", "providers": ["email"]}	{"cedula": "34555412", "correo": "Profesional.consultoriojuridico@uniautonoma.edu.co", "telefono": "3137473148", "email_verified": true, "nombre_completo": "Maritza Repizo"}	\N	2026-03-19 15:28:20.716012+00	2026-07-29 20:13:31.864945+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8a923944-1c53-4584-94c1-f72c0848d04b	authenticated	authenticated	valentina.gonzalez.g@uniautonoma.edu.co	$2a$10$14hSLnGprmhs7S7BsmOFuutkIwiKHhET1z3W7tdwChqH2rKSFIvX6	2026-07-07 16:38:08.31652+00	\N		\N		\N			\N	2026-07-29 16:25:12.123004+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1061810825", "correo": "valentina.gonzalez.g@uniautonoma.edu.co", "telefono": "3042910323", "email_verified": true, "nombre_completo": "Valentina Gonzalez Giraldo"}	\N	2026-07-07 16:38:08.295479+00	2026-07-29 19:11:31.531717+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	authenticated	authenticated	derian.torres.y@uniautonoma.edu.co	$2a$10$ASXKyvgHbDw0IBt3TR77hOnp84lV4g2eIL7ZYrhDLSTq/JpxA2JOO	2026-07-07 16:39:16.804801+00	\N		\N		\N			\N	2026-07-27 15:07:47.419812+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1002949671", "correo": "derian.torres.y@uniautonoma.edu.co", "telefono": "3156157685", "email_verified": true, "nombre_completo": "Derian Dilvey Torres Yule"}	\N	2026-07-07 16:39:16.800579+00	2026-07-27 16:06:12.20967+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	authenticated	authenticated	amparo.pareja.l@uniautonoma.edu.co	$2a$10$hxNcS1YbY9eCTsByqymYvekWCVGv2/21ohazJImGmCA/5a45RvBui	2026-07-14 15:13:57.120687+00	\N		\N		\N			\N	2026-07-30 12:47:47.365839+00	{"provider": "email", "providers": ["email"]}	{"cedula": "41926676", "correo": "amparo.pareja.l@uniautonoma.edu.co", "telefono": "3128010503", "email_verified": true, "nombre_completo": "Amparo Pareja López"}	\N	2026-07-14 15:13:57.056603+00	2026-07-30 12:47:47.458901+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	fac90012-570f-4d3c-90e2-dd3d991e5aec	authenticated	authenticated	luisa.tomassoni.m@uniautonoma.edu.co	$2a$10$XfSU94zo3qSXM5bwttSzQemlJmqHOw5xCR8z6AVtdt.uswMc.cWCe	2026-03-19 15:21:24.090578+00	\N		\N		\N			\N	2026-05-07 15:25:29.803133+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1007143448", "correo": "luisa.tomassoni.m@uniautonoma.edu.co", "telefono": "3113881374", "email_verified": true, "nombre_completo": "Luisa Maria Tomassoni"}	\N	2026-03-19 15:21:24.064543+00	2026-07-14 01:09:46.20486+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bbde362e-ad70-445c-be8c-861b0e06052c	authenticated	authenticated	erasmo.paredes.l@uniautonoma.edu.co	$2a$10$ZJ90y23ECA0qE3PfrznNKOW/wQxhVjDakvQPdoAsJ0WVA70ZhK.v6	2026-07-08 14:27:12.965268+00	\N		\N		\N			\N	2026-07-27 14:16:51.349034+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1061810840", "correo": "Erasmo.paredes.l@uniautonoma.edu.co", "telefono": "3147089029", "email_verified": true, "nombre_completo": "Erasmo Javier Paredes Londoño"}	\N	2026-07-08 14:27:12.931545+00	2026-08-04 13:40:42.123561+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ece5557b-c859-4da3-bd35-f1d2b3beb586	authenticated	authenticated	lisbeth.munoz.d@uniautonoma.edu.co	$2a$10$I18xZHuk4da3wGWLUMSEo.HMzPmpn5E4.J.DuTbuLj/Rk76af02rC	2026-07-07 16:40:09.59901+00	\N		\N		\N			\N	2026-07-28 15:31:31.211738+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1193096007", "correo": "lisbeth.munoz.d@uniautonoma.edu.co", "telefono": "3102922004", "email_verified": true, "nombre_completo": "Lisbeth Daniela Muñoz Daza"}	\N	2026-07-07 16:40:09.576077+00	2026-07-28 17:22:12.164894+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b05fe275-d1f1-4af9-82af-06a688751425	authenticated	authenticated	consultoriojuridico@uniautonoma.edu.co	$2a$10$jIZ7W5Awa7AK0/C4Sm.8eO/WmK5x4QtuL.CH50/LZhtKv5azgPEuy	2026-07-07 15:08:52.681087+00	\N		\N		\N			\N	2026-08-03 19:00:05.497525+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-07-07 15:08:52.646625+00	2026-08-03 21:48:03.092637+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	authenticated	authenticated	julian.ortiz.chica@uniautonoma.edu.co	$2a$10$ftrqYL2ny8Do3sMFq59GGuzE2X5EP7SXxhKtsiRWstQ8gtuZ1ISa6	2026-07-09 16:23:34.765401+00	\N		\N		\N			\N	2026-08-07 02:55:22.818784+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1037668130", "correo": "julian.ortiz@uniautonoma.edu.co", "telefono": "3116215477", "email_verified": true, "nombre_completo": "Julian Ortiz Chica"}	\N	2026-07-09 15:08:44.262983+00	2026-08-07 02:55:22.825386+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a5c3f506-7bf6-4a27-af1c-c26035301e50	authenticated	authenticated	diego.cardenas.a@uniautonoma.edu.co	$2a$10$sUOIIDrUDO4TNmxSbyh2tuxZnvHFABTRzSBOQkKtQBtdJRLAqMS/C	2026-03-19 15:36:18.757968+00	\N		\N		\N			\N	2026-08-06 15:42:23.068786+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1061685005", "correo": "diego.cardenas.a@uniautonoma.edu.co", "telefono": "3104597499", "email_verified": true, "nombre_completo": "Diefo Fernando Cardenas"}	\N	2026-03-19 15:36:18.742235+00	2026-08-06 15:42:23.117856+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	180699bd-c51c-4921-baed-7e3f18d72a42	authenticated	authenticated	maalebuitron@unicauca.edu.co	$2a$10$x0lnwTUj25Pv2/Sj1k7QWeMSftC60QwiSciU8VTeJETDN2BiE/eeu	2026-08-06 15:29:48.259848+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"cedula": "1061767144", "correo": "maalebuitron@unicauca.edu.co", "telefono": "3147946181", "email_verified": true, "nombre_completo": "Alejandra Buitron Erazo"}	\N	2026-08-06 15:29:48.230634+00	2026-08-06 15:29:48.260777+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	authenticated	authenticated	luisa.villamizar.s@uniautonoma.edu.co	$2a$10$eoyMGiGY6060SCCVrtPCbewuuJQeR3o/8qAryJVCBI.gjfMCb1NYC	2026-08-06 15:31:48.213646+00	\N		\N		\N			\N	2026-08-06 15:43:03.845071+00	{"provider": "email", "providers": ["email"]}	{"cedula": "1061786717", "correo": "luisa.villamizar.s@uniautonoma.edu.co", "telefono": "3127686651", "email_verified": true, "nombre_completo": "Luisa Fernanda Villamizar Segura"}	\N	2026-08-06 15:31:48.145804+00	2026-08-06 15:43:03.848059+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
1b35a5ec-c188-4e69-b68c-d37f158859e2	1b35a5ec-c188-4e69-b68c-d37f158859e2	{"sub": "1b35a5ec-c188-4e69-b68c-d37f158859e2", "email": "consul.uac.admin@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-03-09 17:35:24.402534+00	2026-03-09 17:35:24.402591+00	2026-03-09 17:35:24.402591+00	79f8cbdb-ba61-4eef-b3fc-0cecbe808e07
fac90012-570f-4d3c-90e2-dd3d991e5aec	fac90012-570f-4d3c-90e2-dd3d991e5aec	{"sub": "fac90012-570f-4d3c-90e2-dd3d991e5aec", "email": "luisa.tomassoni.m@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-03-19 15:21:24.081138+00	2026-03-19 15:21:24.081211+00	2026-03-19 15:21:24.081211+00	32d8ded4-69ed-463b-aac6-5d5b9c281b1f
2ee91872-abbe-4d2e-be03-8e4eb3b47e05	2ee91872-abbe-4d2e-be03-8e4eb3b47e05	{"sub": "2ee91872-abbe-4d2e-be03-8e4eb3b47e05", "email": "jherson.valencia.c@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-03-19 15:23:03.073357+00	2026-03-19 15:23:03.073985+00	2026-03-19 15:23:03.073985+00	fd2a9f59-1ff0-40e2-8487-3859dd328049
c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	{"sub": "c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b", "email": "augusto.torrejano.f@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-03-19 15:27:01.975932+00	2026-03-19 15:27:01.975994+00	2026-03-19 15:27:01.975994+00	943c5b65-8f3d-4113-8ac7-e732e46352fe
fb42a92d-b85a-4718-a456-1b8953871eaa	fb42a92d-b85a-4718-a456-1b8953871eaa	{"sub": "fb42a92d-b85a-4718-a456-1b8953871eaa", "email": "profesional.consultoriojuridico@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-03-19 15:28:20.724848+00	2026-03-19 15:28:20.724898+00	2026-03-19 15:28:20.724898+00	9d852553-8a6a-4ed3-8a2d-9c674227f9fd
a5c3f506-7bf6-4a27-af1c-c26035301e50	a5c3f506-7bf6-4a27-af1c-c26035301e50	{"sub": "a5c3f506-7bf6-4a27-af1c-c26035301e50", "email": "diego.cardenas.a@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-03-19 15:36:18.752623+00	2026-03-19 15:36:18.752685+00	2026-03-19 15:36:18.752685+00	0b4656a7-31b6-4ef3-a134-26f89605060c
b05fe275-d1f1-4af9-82af-06a688751425	b05fe275-d1f1-4af9-82af-06a688751425	{"sub": "b05fe275-d1f1-4af9-82af-06a688751425", "email": "consultoriojuridico@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-07 15:08:52.671012+00	2026-07-07 15:08:52.671071+00	2026-07-07 15:08:52.671071+00	05f8cd3a-fd49-4260-b209-8eb6ea704398
8a923944-1c53-4584-94c1-f72c0848d04b	8a923944-1c53-4584-94c1-f72c0848d04b	{"sub": "8a923944-1c53-4584-94c1-f72c0848d04b", "email": "valentina.gonzalez.g@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-07 16:38:08.312639+00	2026-07-07 16:38:08.312695+00	2026-07-07 16:38:08.312695+00	4127d8d0-5009-4166-84d4-2dad95085392
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{"sub": "e1b7662c-e9a6-45f6-87d5-5198548cd2c6", "email": "derian.torres.y@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-07 16:39:16.80306+00	2026-07-07 16:39:16.803114+00	2026-07-07 16:39:16.803114+00	417bebab-bed2-4d6c-a852-69c3bd7e4042
ece5557b-c859-4da3-bd35-f1d2b3beb586	ece5557b-c859-4da3-bd35-f1d2b3beb586	{"sub": "ece5557b-c859-4da3-bd35-f1d2b3beb586", "email": "lisbeth.munoz.d@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-07 16:40:09.597356+00	2026-07-07 16:40:09.597409+00	2026-07-07 16:40:09.597409+00	efa12a4c-312b-44f6-b9f5-f15eef48fb50
bbde362e-ad70-445c-be8c-861b0e06052c	bbde362e-ad70-445c-be8c-861b0e06052c	{"sub": "bbde362e-ad70-445c-be8c-861b0e06052c", "email": "erasmo.paredes.l@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-08 14:27:12.960485+00	2026-07-08 14:27:12.960539+00	2026-07-08 14:27:12.960539+00	ea9ccf48-56f0-4592-995a-41ba79897595
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{"sub": "ccd9c5b3-35ba-40ab-a345-c6bf1af51576", "email": "julian.ortiz@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-09 15:08:44.288957+00	2026-07-09 15:08:44.289012+00	2026-07-09 15:08:44.289012+00	37f27b71-0305-4f73-9f3f-6ecbf404b583
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{"sub": "cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd", "email": "amparo.pareja.l@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-07-14 15:13:57.111972+00	2026-07-14 15:13:57.112042+00	2026-07-14 15:13:57.112042+00	60e00a20-5b14-4718-b1e5-45ad47826d50
180699bd-c51c-4921-baed-7e3f18d72a42	180699bd-c51c-4921-baed-7e3f18d72a42	{"sub": "180699bd-c51c-4921-baed-7e3f18d72a42", "email": "maalebuitron@unicauca.edu.co", "email_verified": false, "phone_verified": false}	email	2026-08-06 15:29:48.254271+00	2026-08-06 15:29:48.254338+00	2026-08-06 15:29:48.254338+00	95e67b95-3217-4570-a6b9-d1619b595475
a83bd223-61a7-4ece-9ccf-40f3771c5a5c	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	{"sub": "a83bd223-61a7-4ece-9ccf-40f3771c5a5c", "email": "luisa.villamizar.s@uniautonoma.edu.co", "email_verified": false, "phone_verified": false}	email	2026-08-06 15:31:48.200138+00	2026-08-06 15:31:48.200771+00	2026-08-06 15:31:48.200771+00	3cd5d495-fb73-4377-821d-44f8f797d917
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
a1babdfb-0c30-4adb-8e95-da588a8d2c72	bbde362e-ad70-445c-be8c-861b0e06052c	2026-07-27 14:16:51.351937+00	2026-07-27 15:15:09.019187+00	\N	aal1	\N	2026-07-27 15:15:09.019075	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36	191.156.4.222	\N	\N	\N	\N	\N
a2adc2a9-3339-44cd-9c8b-f9699a00c7e2	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-08-07 02:55:18.885551+00	2026-08-07 02:55:21.409038+00	\N	aal1	\N	2026-08-07 02:55:21.408944	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:152.0) Gecko/20100101 Firefox/152.0	190.130.97.65	\N	\N	\N	\N	\N
f3342db9-f7bc-45db-944d-194ca17caa63	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	2026-04-09 13:31:16.150549+00	2026-04-09 13:31:16.150549+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	179.1.113.99	\N	\N	\N	\N	\N
3e60f01f-83ba-42fe-9742-fabfc10e67ae	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-08-07 02:55:22.818884+00	2026-08-07 02:55:22.818884+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:152.0) Gecko/20100101 Firefox/152.0	190.130.97.65	\N	\N	\N	\N	\N
6bbe3c75-0014-403d-957b-fdf725a30975	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	2026-04-09 15:37:53.18946+00	2026-04-09 15:37:53.18946+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	179.1.113.100	\N	\N	\N	\N	\N
5ccfa86e-9d8a-4903-a457-d99788fdcbd9	b05fe275-d1f1-4af9-82af-06a688751425	2026-07-29 19:18:27.453079+00	2026-07-29 19:18:27.453079+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	179.1.113.98	\N	\N	\N	\N	\N
7a98e2ab-f027-4303-a7dc-8d85fc8bcb1b	fb42a92d-b85a-4718-a456-1b8953871eaa	2026-07-29 20:13:31.787105+00	2026-07-29 20:13:31.787105+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	179.1.113.98	\N	\N	\N	\N	\N
5c41d992-dc01-415f-a10c-c8396d6dc81c	fac90012-570f-4d3c-90e2-dd3d991e5aec	2026-05-07 15:25:29.803232+00	2026-07-14 01:09:46.236331+00	\N	aal1	\N	2026-07-14 01:09:46.235516	Vercel Edge Functions	100.31.53.98	\N	\N	\N	\N	\N
3af6caa6-1d35-47ad-94b9-73c21550fb24	b05fe275-d1f1-4af9-82af-06a688751425	2026-08-03 19:00:05.498607+00	2026-08-03 21:48:07.200233+00	\N	aal1	\N	2026-08-03 21:48:07.200139	Vercel Edge Functions	98.93.112.69	\N	\N	\N	\N	\N
c1b95e3d-6296-4ca4-99bb-f0f9d01b6f21	bbde362e-ad70-445c-be8c-861b0e06052c	2026-07-27 13:51:27.591264+00	2026-08-04 13:40:42.188734+00	\N	aal1	\N	2026-08-04 13:40:42.188622	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Safari/605.1.15	179.1.113.101	\N	\N	\N	\N	\N
08c2ccdc-d3eb-4748-b90a-e132aceb05ad	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	2026-08-06 15:43:03.845177+00	2026-08-06 15:43:03.845177+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	179.1.113.98	\N	\N	\N	\N	\N
9c1f7810-9ba3-4655-881b-c6a5e1ed630d	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	2026-04-09 15:28:19.311272+00	2026-05-07 15:45:17.750822+00	\N	aal1	\N	2026-05-07 15:45:17.750726	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	179.1.113.98	\N	\N	\N	\N	\N
bdc41d8c-1687-47ec-9585-e7994e8816d7	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-08-06 20:54:46.971234+00	2026-08-06 20:54:46.971234+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	179.1.113.101	\N	\N	\N	\N	\N
3b7a721b-1f4f-4d8c-8db1-d3c3b7ad36e6	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-28 15:31:31.213617+00	2026-07-28 19:58:08.102401+00	\N	aal1	\N	2026-07-28 19:58:08.102294	Vercel Edge Functions	54.152.75.138	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
bdc41d8c-1687-47ec-9585-e7994e8816d7	2026-08-06 20:54:47.055542+00	2026-08-06 20:54:47.055542+00	password	b55916bd-8edb-4304-8b85-0f63a4f7ee33
a2adc2a9-3339-44cd-9c8b-f9699a00c7e2	2026-08-07 02:55:18.950071+00	2026-08-07 02:55:18.950071+00	password	efaaf1fd-ebef-41fb-b812-129502e7e844
3e60f01f-83ba-42fe-9742-fabfc10e67ae	2026-08-07 02:55:22.826038+00	2026-08-07 02:55:22.826038+00	password	0d08f892-e0e0-49b5-99a4-c7debd4f9f3f
3b7a721b-1f4f-4d8c-8db1-d3c3b7ad36e6	2026-07-28 15:31:31.257104+00	2026-07-28 15:31:31.257104+00	password	b9e19c76-ad11-498d-8fac-17350c036024
f3342db9-f7bc-45db-944d-194ca17caa63	2026-04-09 13:31:16.15315+00	2026-04-09 13:31:16.15315+00	password	81d5c742-ab3e-4dc0-b979-ae492b415a57
9c1f7810-9ba3-4655-881b-c6a5e1ed630d	2026-04-09 15:28:19.371904+00	2026-04-09 15:28:19.371904+00	password	243126b4-a1b7-4bc2-a859-d81c01c18260
6bbe3c75-0014-403d-957b-fdf725a30975	2026-04-09 15:37:53.211801+00	2026-04-09 15:37:53.211801+00	password	71cdb079-7bb4-4eeb-a386-7ff4ef8d6e54
c1b95e3d-6296-4ca4-99bb-f0f9d01b6f21	2026-07-27 13:51:27.610738+00	2026-07-27 13:51:27.610738+00	password	7be03d16-2bd8-413d-bf63-62790b516b32
5c41d992-dc01-415f-a10c-c8396d6dc81c	2026-05-07 15:25:29.835563+00	2026-05-07 15:25:29.835563+00	password	bca386f9-d6f5-40f1-b99c-f65a89006e5d
a1babdfb-0c30-4adb-8e95-da588a8d2c72	2026-07-27 14:16:51.394766+00	2026-07-27 14:16:51.394766+00	password	816b45a5-2e30-4c80-b232-87be2b4abfa7
5ccfa86e-9d8a-4903-a457-d99788fdcbd9	2026-07-29 19:18:27.456303+00	2026-07-29 19:18:27.456303+00	password	be1994ad-1758-4496-b247-dc82124cedb0
7a98e2ab-f027-4303-a7dc-8d85fc8bcb1b	2026-07-29 20:13:31.872311+00	2026-07-29 20:13:31.872311+00	password	e27c791a-4ded-4bc0-826c-bb592cf33141
3af6caa6-1d35-47ad-94b9-73c21550fb24	2026-08-03 19:00:05.510048+00	2026-08-03 19:00:05.510048+00	password	657e17f5-069e-4f8a-a59d-61cc91e03a87
08c2ccdc-d3eb-4748-b90a-e132aceb05ad	2026-08-06 15:43:03.848443+00	2026-08-06 15:43:03.848443+00	password	e097cf66-5db7-4314-90b6-86ac3a6bf67d
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	570	g4gh3vn7ldgb	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	f	2026-08-06 20:54:47.014821+00	2026-08-06 20:54:47.014821+00	\N	bdc41d8c-1687-47ec-9585-e7994e8816d7
00000000-0000-0000-0000-000000000000	87	od7ryxn5jnq6	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	t	2026-04-09 15:28:19.343304+00	2026-05-07 14:42:18.624812+00	\N	9c1f7810-9ba3-4655-881b-c6a5e1ed630d
00000000-0000-0000-0000-000000000000	447	vanqbnswnly7	bbde362e-ad70-445c-be8c-861b0e06052c	t	2026-07-27 14:16:51.372679+00	2026-07-27 15:15:08.98564+00	\N	a1babdfb-0c30-4adb-8e95-da588a8d2c72
00000000-0000-0000-0000-000000000000	109	qrpnom3hy7ef	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	t	2026-05-07 14:42:18.642114+00	2026-05-07 15:45:17.667098+00	od7ryxn5jnq6	9c1f7810-9ba3-4655-881b-c6a5e1ed630d
00000000-0000-0000-0000-000000000000	115	22wob37ng65a	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	f	2026-05-07 15:45:17.690006+00	2026-05-07 15:45:17.690006+00	qrpnom3hy7ef	9c1f7810-9ba3-4655-881b-c6a5e1ed630d
00000000-0000-0000-0000-000000000000	114	l3sw4uimt7s5	fac90012-570f-4d3c-90e2-dd3d991e5aec	t	2026-05-07 15:25:29.822269+00	2026-05-12 20:38:42.921069+00	\N	5c41d992-dc01-415f-a10c-c8396d6dc81c
00000000-0000-0000-0000-000000000000	547	znu4zb3pc2w6	fb42a92d-b85a-4718-a456-1b8953871eaa	f	2026-07-29 20:13:31.826968+00	2026-07-29 20:13:31.826968+00	\N	7a98e2ab-f027-4303-a7dc-8d85fc8bcb1b
00000000-0000-0000-0000-000000000000	559	pxwnscqrxbnm	b05fe275-d1f1-4af9-82af-06a688751425	f	2026-08-03 21:48:03.081595+00	2026-08-03 21:48:03.081595+00	aot37y7rzkds	3af6caa6-1d35-47ad-94b9-73c21550fb24
00000000-0000-0000-0000-000000000000	83	g4p3gonrfvwr	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	f	2026-04-09 13:31:16.151566+00	2026-04-09 13:31:16.151566+00	\N	f3342db9-f7bc-45db-944d-194ca17caa63
00000000-0000-0000-0000-000000000000	88	ynhwgpvgd7qv	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	f	2026-04-09 15:37:53.204025+00	2026-04-09 15:37:53.204025+00	\N	6bbe3c75-0014-403d-957b-fdf725a30975
00000000-0000-0000-0000-000000000000	571	fivwbhfgwik6	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	t	2026-08-07 02:55:18.921912+00	2026-08-07 02:55:21.395223+00	\N	a2adc2a9-3339-44cd-9c8b-f9699a00c7e2
00000000-0000-0000-0000-000000000000	572	n4qu3l4tzqdd	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	f	2026-08-07 02:55:21.397171+00	2026-08-07 02:55:21.397171+00	fivwbhfgwik6	a2adc2a9-3339-44cd-9c8b-f9699a00c7e2
00000000-0000-0000-0000-000000000000	544	jqsl4zsibo2u	b05fe275-d1f1-4af9-82af-06a688751425	f	2026-07-29 19:18:27.454481+00	2026-07-29 19:18:27.454481+00	\N	5ccfa86e-9d8a-4903-a457-d99788fdcbd9
00000000-0000-0000-0000-000000000000	445	z2twuo5ntolf	bbde362e-ad70-445c-be8c-861b0e06052c	t	2026-07-27 13:51:27.608583+00	2026-08-01 13:24:11.85338+00	\N	c1b95e3d-6296-4ca4-99bb-f0f9d01b6f21
00000000-0000-0000-0000-000000000000	557	silokjar2pxi	b05fe275-d1f1-4af9-82af-06a688751425	t	2026-08-03 19:00:05.506458+00	2026-08-03 19:59:01.766363+00	\N	3af6caa6-1d35-47ad-94b9-73c21550fb24
00000000-0000-0000-0000-000000000000	515	awxdhzisf5xa	ece5557b-c859-4da3-bd35-f1d2b3beb586	t	2026-07-28 15:31:31.242382+00	2026-07-28 17:22:12.131365+00	\N	3b7a721b-1f4f-4d8c-8db1-d3c3b7ad36e6
00000000-0000-0000-0000-000000000000	522	ie7pyivj2p4b	ece5557b-c859-4da3-bd35-f1d2b3beb586	f	2026-07-28 17:22:12.150748+00	2026-07-28 17:22:12.150748+00	awxdhzisf5xa	3b7a721b-1f4f-4d8c-8db1-d3c3b7ad36e6
00000000-0000-0000-0000-000000000000	116	ap7a3awrvxdh	fac90012-570f-4d3c-90e2-dd3d991e5aec	t	2026-05-12 20:38:42.940282+00	2026-07-14 01:09:46.185375+00	l3sw4uimt7s5	5c41d992-dc01-415f-a10c-c8396d6dc81c
00000000-0000-0000-0000-000000000000	238	fnzm4ywbsm56	fac90012-570f-4d3c-90e2-dd3d991e5aec	f	2026-07-14 01:09:46.200747+00	2026-07-14 01:09:46.200747+00	ap7a3awrvxdh	5c41d992-dc01-415f-a10c-c8396d6dc81c
00000000-0000-0000-0000-000000000000	569	bedbfzwegy3z	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	f	2026-08-06 15:43:03.846365+00	2026-08-06 15:43:03.846365+00	\N	08c2ccdc-d3eb-4748-b90a-e132aceb05ad
00000000-0000-0000-0000-000000000000	454	xxob7kxloc63	bbde362e-ad70-445c-be8c-861b0e06052c	f	2026-07-27 15:15:08.993346+00	2026-07-27 15:15:08.993346+00	vanqbnswnly7	a1babdfb-0c30-4adb-8e95-da588a8d2c72
00000000-0000-0000-0000-000000000000	573	vksmjzq2dvy4	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	f	2026-08-07 02:55:22.821186+00	2026-08-07 02:55:22.821186+00	\N	3e60f01f-83ba-42fe-9742-fabfc10e67ae
00000000-0000-0000-0000-000000000000	558	aot37y7rzkds	b05fe275-d1f1-4af9-82af-06a688751425	t	2026-08-03 19:59:01.7894+00	2026-08-03 21:48:03.057593+00	silokjar2pxi	3af6caa6-1d35-47ad-94b9-73c21550fb24
00000000-0000-0000-0000-000000000000	552	b24e7dqsmz4b	bbde362e-ad70-445c-be8c-861b0e06052c	t	2026-08-01 13:24:11.874576+00	2026-08-04 13:40:42.084262+00	z2twuo5ntolf	c1b95e3d-6296-4ca4-99bb-f0f9d01b6f21
00000000-0000-0000-0000-000000000000	562	wird3zvzk3pn	bbde362e-ad70-445c-be8c-861b0e06052c	f	2026-08-04 13:40:42.10796+00	2026-08-04 13:40:42.10796+00	b24e7dqsmz4b	c1b95e3d-6296-4ca4-99bb-f0f9d01b6f21
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."usuarios" ("id_usuario", "nombre_completo", "sexo", "cedula", "telefono", "edad", "contacto_familiar", "estado_civil", "estrato", "direccion", "correo", "tipo_vivienda", "situacion_laboral", "otros_ingresos", "valor_otros_ingresos", "concepto_otros_ingresos", "tiene_contrato", "tiene_representado", "enfoque_diverso", "caracterizacion_lgbtiq", "tipo_documento", "fecha_expedicion_doc", "ciudad_expedicion", "fecha_nacimiento", "nacionalidad", "identidad_genero", "orientacion_sexual", "escolaridad", "grupo_etnico", "barrio", "zona", "tenencia_vivienda", "comuna", "tiene_sisben", "personas_cargo", "rango_salarial", "servicios_publicos", "sabe_leer", "discapacidad", "condicion_actual") FROM stdin;
9bc43727-83dd-4b09-bf69-85c9c83b69a4	NARVAEZ YULIETH	FEMENINO	1061805105	3156382545	28	\N	soltero	1	Calle 10	yulieth130@hotmail.com	otra	otro	f	0.00	\N	f	t	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
eb0d1b5f-1ea1-42de-9575-efc8c311ce46	ORTIZ RENE	MASCULINO	10536202	3009614464	66	3215699264	casado	2	Calle 13A #19-22	renejesusortiz202@gmail.com	propia	dependiente	f	0.00	\N	t	t	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a87c87ca-cb21-4197-b6d8-bdb86aa53a7b	BECERRA CAMAYO LIIANA	FEMENINO	1061698941	3113215150	\N	\N	\N	\N	\N	liliabera556@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7cdab4f2-2f06-442a-91a6-e16717a09e6e	ILES MIGUEL ANGEL	MASCULINO	10535854	3116265115	\N	\N	\N	\N	\N	diles1882@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5079a397-230c-4e52-9eea-cb2034824355	CHACON MUÑOZ LIBARDO	MASCULINO	76304468	3216296208	\N	\N	\N	\N	\N	libardo28chacon@hotmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c2c741ec-2344-4d97-bd93-18e8db07ef2a	LOPEZ RIVERO MARIA EUGENIA	FEMENINO	11453316	123	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43dd3cc5-bb8e-46d2-afbc-362a4baa5a99	SANCHEZ VELASCO ASTIRID VANESSA	FEMENINO	1061728384	3204576062	\N	\N	\N	\N	\N	astrid199033@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99d8e35a-4a47-4d2d-be24-98e4d77707bc	RODRIGUEZ MOSQUERA MILTON URIEL	MASCULINO	76320026	3106615106	52	3155258410	casado	1	Cra 17 # 69 N 35 	\N	otra	independiente	f	\N	\N	f	t	f	\N	CC	1992-08-19	Popayan 	1974-08-15	Colombiana	\N	\N	Primaria completa	No informa	Bello Horizonte 	Urbana	Otra	Comuna 2 	t	\N	\N	\N	t	\N	\N
09b97da7-ff41-403f-813d-828760287a69	MUÑOZ ARAUJO RAFAEL	MASCULINO	4735194	3022912193	66	Ninguno 	soltero	1	Vereda El Trebol Patia.	Ninguno	propia	independiente	f	\N	\N	f	t	f	\N	CC	\N	\N	1958-08-12	\N	\N	\N	Primaria completa	No informa	Vereda El Trebol Patia.	Urbana	Propia	\N	t	\N	No informa	\N	t	\N	\N
befca510-1f89-423e-abff-0206d48825bb	PEREZ CALAMBAS DANIEL UBEYMAR	MASCULINO	76319873	3136198287	\N	\N	\N	\N	\N	piuchr@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7fd3ccc8-15b1-44a7-988e-21bd9bcf5859	BASTIDAS CORREDOR JUVENAL	MASCULINO	10524292	314843963	77	Lorena 3168260647	soltero	2	cra 9 #63N 42 bella vista	lorebaspe@yahoo.es	propia	independiente	f	800003.00	\N	f	t	\N	\N	CC	1973-02-16	Popayan 	1949-05-06	Colombiana 	\N	\N	\N	\N	Bella vista 	Urbana	Propia	\N	\N	\N	Menos de un salario mínimo	\N	t	\N	Adulto mayor
c5ef8770-e775-4f52-aca6-7e3f45f176e8	QUILINDO MARIA ELSA	FEMENINO	48667840	3136226574	58	\N	soltero	1	Carrera 3A # 13A - 41 barrio el cadillal 	marianelsaquilindo@gmail.com	arrendada	independiente	f	80000.00	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	No informa	Prefiero no decirlo	barrio cadillal 	Urbana	Alquilada	centro 	t	\N	\N	Alcantarillado,Acueducto,Energía eléctrica	t	Ninguna	Víctima del conflicto armado,Víctima de desplazamiento,Madre cabeza de familia
4d11d65d-2110-493d-8626-75f7040be0f2	MUÑOZ HIGIDIO JULIAN ANDRES	MASCULINO	1061734100	3233420008	35	Maria Idalia Higidio 3148180912	soltero	2	Cra 20 # 61N - 2 -25	munozjulianandres866@gmail.com	propia	independiente	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	Bachillerato completo	No informa	El uvo 	Urbana	Propia	\N	t	\N	Entre 1 y 2 salarios	\N	t	Física	\N
fc6fd13c-339a-42a4-85cc-65c078a67503	MELENGE SAUCA AIDA LUCIA	FEMENINO	34558505	3203602707	52	\N	soltero	2	centro popayan	amelenje0@gmail.com	arrendada	otro	f	\N	\N	f	f	f	\N	CC	\N	popayan cauca 	\N	colombiana 	\N	\N	No informa	Indígena	popayan cauca 	Urbana	Alquilada	centro	t	\N	\N	Energía eléctrica,Acueducto,Alcantarillado	\N	Ninguna	Prefiero no decirlo
47244b0a-a1ea-4473-8df6-3ee2244520fe	VELASCO HURTADO JOSE BELISARIO	MASCULINO	10545224	3217140259	62	\N	casado	3	Calle 3 3#22-69	josebelicauca@outlook.com	arrendada	dependiente	f	0.00	\N	t	t	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15fa30c7-7e84-4667-ba58-b2a5580c5b62	ANAYA SOLANO JONATHAN	MASCULINO	1143975133	3122611656	30	\N	unión libre	2	calle 2 43 b-15 barrio maria occidente	anaya2024.j@gmail.com	arrendada	desempleado	f	\N	\N	f	t	f	\N	CC	2013-08-26	cali valle	1995-08-23	colombiano 	\N	\N	No informa	No informa	maria occidente 	Urbana	Alquilada	calle 2 43 b-15 barrio maria occidente	t	\N	No informa	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	Prefiero no decirlo
bb05ae72-9bdc-425e-96fa-a0adde2aeee3	ASTAIZA CARLOS ARTURO NOE	MASCULINO	10522479	3128568875	76	\N	\N	\N	Cra 11 A # 12 B35. Barrio los Alcacerez	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Propia	\N	\N	\N	\N	\N	\N	\N	\N
c443aaa0-5543-4ab6-a15d-72411118b73d	MONTILLA LASSO YAMILETH	FEMENINO	25277015	3117809768	52	\N	soltero	\N	Cra 28 # 444 Barrio junin.	yamilethmontilla22@gmail.com	\N	\N	\N	\N	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Propia	\N	\N	\N	\N	\N	\N	\N	\N
d3462b7f-af9e-4e79-92b3-6b4f00b81381	GOMEZ MENESES AGRIPINO	MASCULINO	4627757	3125242973	\N	\N	\N	\N	Calle 18 A # 22a-09	agripinogomezmeneses@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3b184e51-be26-466c-a9d3-1c5fe67317fd	BLANCO GOMEZ JORGE ALBERTO	MASCULINO	4237923	3114074656	65	\N	unión libre	2	Calle 3A numero 56-20 Lomas de Granada	jorgeblanco1961@gmail.com	\N	\N	\N	\N	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Propia	\N	\N	\N	Entre 1 y 2 salarios	\N	\N	\N	\N
0a5a8438-64fc-4812-86a3-b989411ff435	VILLOTA APONTE EDGAR LEONARDO	MASCULINO	14697589	3146770324	43	\N	unión libre	1	calle 3 #34-49 b/san jose	camilavillotaaponte@gmail.com	\N	\N	\N	\N	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Alquilada	\N	\N	\N	\N	\N	\N	\N	\N
3cdccff7-8ac9-447d-81d5-4c3aec399daf	RIOS SOL JULIO	MASCULINO	4604835	3143211253	89	\N	casado	1	Vereda la capilla Cajibío 	agrovettdelrio@gmail.com	propia	desempleado	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	No informa	Indígena	Vereda la capilla 	Rural	Propia	\N	t	\N	Menos de un salario mínimo	Acueducto	t	Ninguna	Adulto mayor
bca9859b-8de8-476e-8b0c-6e1a50cc628d	RODRIGUEZ GOMEZ JHOVANNY ANDRES	MASCULINO	1058974781	3189094228	30	\N	casado	\N	\N	\N	\N	independiente	t	900000.00	\N	\N	\N	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Familiar	\N	\N	\N	\N	\N	\N	\N	\N
68229df1-e450-415c-a77c-4fd4aacb2e8f	RAMIREZ GARCIA CARLOS ANDRES	MASCULINO	1007752762	3234802784	26	\N	soltero	\N	\N	\N	\N	desempleado	t	500000.00	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Alquilada	\N	\N	\N	\N	\N	\N	\N	\N
769c55a6-bd1e-4b7f-a5d5-53652e46db6c	BOTINA URBANO JOSE EFRAIN	MASCULINO	10540785	3104837364	64	\N	unión libre	1	Vereda de Torres	tallerpintoyo@gmail.com	\N	dependiente	t	1500000.00	\N	\N	f	\N	\N	CC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Alquilada	\N	\N	\N	\N	\N	\N	\N	\N
377d7c70-5a80-4af8-aebd-2c8bf695a7d6	MAMIAN GALINDEZ IRMA	FEMENINO	52112452	3217161042	56	\N	unión libre	2	Calle 65 19-63	\N	propia	desempleado	f	\N	\N	f	t	\N	\N	CC	\N	Bogota	\N	Colombiana	\N	\N	\N	\N	\N	Urbana	Propia	\N	\N	\N	\N	\N	t	\N	\N
04c77a75-bbe6-45e3-8ab2-01095a9bd81a	CASTILLO PEÑA BERTHA MARIA	FEMENINO	34528260	3126199845	71	\N	soltero	2	carrera 17 # 61 n 10 popayán	leivyy1122@gmail.com	propia	independiente	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	No informa	No informa	carrera 17 # 61 n 10 popayán	\N	Propia	\N	f	\N	Un salario mínimo	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	Adulto mayor
4bd15572-6294-4dcb-9273-a04767094bf0	BECOCHE QUINA BELARMINA	FEMENINO	25341404	3217562021	56	\N	soltero	1	Calle 73 CN 3b # 3b - 28	becochebelarmina@gmail.com	propia	otro	t	\N	\N	f	t	f	\N	CC	1989-07-31	Cajibio 	1970-04-18	Colombiana 	\N	\N	Primaria completa	No informa	Villa Garcia 	Rural	Propia	Comuna 7 	t	\N	\N	\N	t	\N	\N
50ad2d3b-b7f3-495a-bc2c-f1be73b93014	GRIJALBA QUILINDO ROBERT ALEJANDRO	MASCULINO	76327472	3108652805	45	\N	unión libre	2	c 5 #22-11 barrio los comuneros 	alexalba13726@gmail.com	arrendada	dependiente	f	\N	\N	f	t	f	\N	CC	\N	popayan 	\N	\N	\N	\N	No informa	No informa	los comuneros 	Urbana	Alquilada	\N	t	1	Un salario mínimo	Alcantarillado,Acueducto,Energía eléctrica	t	Ninguna	Prefiero no decirlo
a7c31d96-ef6f-4c05-8443-4ce6f230efed	CASTRO CAPOTE MARIA DEL MAR	FEMENINO	1061812144	3146857718	27	\N	unión libre	1	Carrera 2 27N-60	mc4ad25@gmail.com	propia	desempleado	f	\N	\N	f	f	\N	\N	CC	\N	Popayán	\N	Colombiana	\N	\N	Primaria completa	\N	\N	Urbana	Propia	\N	\N	\N	\N	\N	\N	\N	\N
265a3109-3fde-4cfd-88aa-466876a49aa7	ITAZ FLORES ANITA	FEMENINO	34558216	3136119122	56	\N	soltero	1	Carrera 11 No. 21-36 dean alto	\N	propia	independiente	f	\N	\N	f	t	\N	\N	CC	\N	Popayán	\N	Colombiana	\N	\N	Bachillerato incompleto	\N	Dean Alto	Urbana	Propia	\N	\N	\N	Menos de un salario mínimo	\N	t	\N	Madre cabeza de familia
28bf2618-62b1-494b-b946-52c456240a46	LEDEZMA BETTY BIRMANIA	FEMENINO	34566013	3187376215	50	3019404199	soltero	2	Calle 56 Norte 13-60	Ninguno	propia	desempleado	f	\N	\N	f	t	f	\N	CC	1992-05-12	\N	1974-05-09	Colombina 	\N	\N	Bachillerato completo	No informa	Bosques De Morinda 	Urbana	Propia	Comuna 2	t	\N	\N	\N	\N	\N	\N
e9bcc969-b1b5-45ba-9d5b-e6b2f2e00664	CHAMIZO MEDINA LIBERTO	MASCULINO	4615104	3234425693	64	\N	unión libre	1	Vereda los tendidos - Polideportivo Vereda Los Tendidos	\N	propia	independiente	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	Primaria completa	No informa	Vereda los tendidos - Polideportivo Vereda Los Tendidos	Rural	Propia	\N	t	\N	Un salario mínimo	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	Prefiero no decirlo
b305131f-9c25-4923-93df-e408d58c8496	IBARRA ARIAS ALBERTO	FEMENINO	16612742	3228021355	68	Ximena 3122439343	casado	1	Carrera 9 No. 62A-05 Barrio Bellavista	15dalix13@gmail.com	propia	desempleado	f	\N	\N	f	t	\N	\N	CC	1977-03-28	Cali	1958-05-18	Colombiana	\N	\N	Bachillerato completo	No informa	Bellavista	Urbana	Propia	\N	f	\N	\N	Energía eléctrica,Acueducto,Alcantarillado	t	\N	\N
a6a69e9b-bfa5-4917-89ba-ffa30e828c5e	MOLANO NIEVES ANGELA	FEMENINO	34315978	3128749419	44	3116427333	soltero	2	Carrera 5 No. 7-46 Barrio Centro	distribuidorangeles2011@gmail.com	arrendada	independiente	f	\N	\N	f	t	f	\N	CC	2000-01-26	Popayan	1982-01-05	Colombiana	\N	\N	Técnico	\N	Centro	Urbana	Alquilada	\N	t	\N	Un salario mínimo	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	\N
6a0ee993-3913-4b39-8f39-9c0c9bff21e0	IDROBO MARIA LUZ	FEMENINO	25395878	3206170445	81	\N	viudo	1	Lote 219 Valero las palma 	marialuz1971.idrobo@gmail.com	propia	desempleado	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	Colombia 	\N	\N	Primaria completa	No informa	Galería la palma 	Urbana	Invasión	\N	t	\N	Menos de un salario mínimo	\N	f	Física	Adulto mayor
935a6b4e-390b-4915-97f5-98245afb9e48	GUZMAN LOPEZ ERMILA	FEMENINO	34555645	3128378237	56	\N	unión libre	2	carrera 33 # 17- 16 barrio muich 	\N	propia	desempleado	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	No informa	No informa	carrera 33 # 17- 16 barrio muich 	\N	\N	\N	\N	\N	No informa	Alcantarillado,Acueducto,Energía eléctrica	t	Ninguna	Prefiero no decirlo
ccf00a9e-fbbd-49a1-b7ee-b7e201665897	MARTINEZ GRAJALES JESUS ENRIQUE	MASCULINO	10542295	3217345267	64	\N	unión libre	2	Carrera 28 No. 5a 65	\N	propia	independiente	f	\N	\N	f	t	\N	\N	CC	\N	Popayan	\N	Colombiano	\N	\N	\N	\N	\N	Urbana	Propia	\N	\N	\N	Un salario mínimo	\N	t	\N	\N
2421cbb8-90ad-4f25-a668-6548a010ff07	DIAZ BUITRON LUZ ESNEILA	FEMENINO	34325173	3146667906	43	DAYANA IDROBO Cel: 3246763195	soltero	1	Carrera 52B # 3-6 Valle del Ortigal Torre 18 Apto. 303 Popayán-Cauca	luzadrianadiaz84@gmail.com	propia	independiente	f	\N	\N	f	f	f	\N	CC	2002-05-03	Popayán	1983-05-09	Colombiana	\N	\N	Bachillerato incompleto	No informa	Valle del Ortigal	Urbana	Propia	\N	t	2	Menos de un salario mínimo	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	Madre cabeza de familia,Víctima del conflicto armado
e6b46100-60e1-45c3-b272-06a7be257666	RUIZ DAZA ERNESTO DARIO	MASCULINO	1061726313	3207346483	35	\N	soltero	4	Carrera 14 # 33AN 80	ernestoruizmd@gmail.com	arrendada	dependiente	f	\N	\N	f	t	f	\N	CC	\N	\N	\N	\N	\N	\N	Profesional	No informa	Campo bello	Urbana	Alquilada	\N	f	1	Entre 2 y 3 salarios	Energía eléctrica,Acueducto,Alcantarillado	t	Ninguna	\N
\.


--
-- Data for Name: casos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."casos" ("id_caso", "id_usuario", "resumen_hechos", "observaciones", "fecha_creacion", "estado", "fecha_cierre", "area", "tipo_proceso", "observaciones_estudiante", "clasificacion", "fecha_vencimiento_estudiante", "fecha_vencimiento_asesor", "periodo", "fecha_entrega_entrevista", "ultima_modificacion") FROM stdin;
50	e6b46100-60e1-45c3-b272-06a7be257666	Don Ernesto se acerca buscando asesoría para saber si asiste o no a una conciliación que tiene con la madre de su hija para fijar cuota de alimentos. Se le indica que si debe asistir para poder lograr a los acuerdos de cuota y que debe llevar las evidencias de el dinero que el mensualmente le está pasando a la menor. Se le indica también que hable en la conciliación para llegar al acuerdo de visita con la menor.		2026-07-28	pendiente_aprobacion	\N	civil_familia	No creado	\N	\N	\N	2026-07-31 16:00:41.090113+00	2026-2	2026-07-29 16:00:41.090113+00	2026-07-29 16:00:41.090113+00
4	a87c87ca-cb21-4197-b6d8-bdb86aa53a7b	\N		2026-05-07	en_proceso	\N	otros	en_proceso	\N	\N	\N	\N	2026-1	\N	2026-05-07 00:00:00+00
2	eb0d1b5f-1ea1-42de-9575-efc8c311ce46	El señor Rene fui accionado en un proceso ejecutivo, en el cual se estableció que debía pagar la suma de 1'200.000 y dicho valor fue descontado de la nómina por medio de embargo de salario (Existe en el comprobante de pago). Dicho embargo continuo incluso cuando ya se había pagado la totalidad de la obligación, ascendiendo más o menos a 2'762.648, con una diferencia aproximada de 1'562.648. El señor Rene quiere que se le reintegre esa diferencia de valor. El acudió al juzgado y le solicitaron llevar un oficio con los desprendibles	Se observa que el usuario es un funcionario Público con un salario de mas de tres salarios mínimos, por lo cual se le indica que el Consultorio Jurídico le presta la asesoría para la explicación, pero para contestar la demanda debe se con un abogado, por los salarios devengados y su vinculación laboral con una entidad Publica, por lo tanto, queda solo en asesoría. Se le indico las posibles soluciones a la demanda, de contestar, allanarse, presentar excepciones o conciliar, o en su defecto guardar silencio. Con el auto que sigue la ejecución se puede presentar la liquidación del crédito para que le aporte los títulos que sobren de la medida cautelar, y en su defecto se le podría hacer esta liquidación para que la presente al despacho.	2026-04-09	activo	\N	civil_familia	en_proceso	Soporte\nDemanda ejecutiva\nComprobante de Pagos\nOficio emitido por el juzgado\n\nExpediente\nhttps://etbcsj-my.sharepoint.com/:f:/g/personal/j02prpcppn_cendoj_ramajudicial_gov_co/IgBX7HdxibzjQ5oskOdwstD9Ado8j61W1Bugug8jiS87UM0?e=Lkaouq\n\nUna vez observado el expediente se denota que apenas fue notificado el presente día y tiene 10 días hábiles para proponer las excepciones que tenga a su favor	solo_asesoria	\N	\N	2026-1	\N	2026-04-09 00:00:00+00
1	9bc43727-83dd-4b09-bf69-85c9c83b69a4	La usuaria se acerca al consultorio con el fin de recibir asesoría respecto de una denuncia penal por el delito de suplantación de identidad, revisando la consulta de procesos de la fiscalía general de la nación arroja que el caso está asignado a la fiscalía 16 local y que desde el 17 de septiembre de 2021 no hay actuaciones procesales. Se le indica a la usuaria que procede una solicitud de avance de la investigación penal el cual puede ser llevado por C.J, pero la usuaria no cuenta con la documentación necesaria para el trámite. Se le indica que regrese nuevamente con la documentación indicada 	Asesoría penal 	2026-03-19	activo	\N	penal	en_proceso	\N	\N	\N	\N	2026-1	\N	2026-03-19 00:00:00+00
40	7fd3ccc8-15b1-44a7-988e-21bd9bcf5859	El usuario manifiesta que vive cerca del súper giros de bella vista y que en las noches suenan alarmas de forma constante, lo cual ha perturbado su tranquilidad y sus horas de descanso ya que es un adulto mayor, solicita derecho de petición .		2026-07-22	activo	\N	publica	No creado	\N	en_tramite	\N	\N	2026-2	2026-07-22 16:24:30.866972+00	2026-07-27 15:17:23.501217+00
43	265a3109-3fde-4cfd-88aa-466876a49aa7	La usuaria manifiesta que tiene un conflicto con su ex pareja de hace 10 años, ya que el saco un crédito a nombre de ella el cual no a cancelado, y además, las escrituras de la casa de la usuaria también están a nombre de el.\nHicieron una conciliación en la estación de policía pero no se logro llegar a ningún acuerdo entre los dos, es decir, fue fracasada. \nLa usuaria quiere saber que puede hacer; se le indica que debe acercarse el 10 de agosto.		2026-07-27	pendiente_aprobacion	\N	civil_familia	No creado	\N	\N	\N	2026-07-29 15:44:51.889437+00	2026-2	2026-07-27 15:44:51.889437+00	2026-07-27 15:45:42.461633+00
46	6a0ee993-3913-4b39-8f39-9c0c9bff21e0	Doña Ángela se acerca buscando asesoría ya que está en situación de discapacidad debido a sus enfermedades, busca la manera de que la alcaldía o la E.P.S. le brinde ayuda para una silla de ruedas y que la que tiene es prestada, se le indica que vuelva el 10 de agosto para ayudarle a realizar un derecho de petición.		2026-07-28	pendiente_aprobacion	\N	publica	No creado	\N	\N	\N	2026-07-30 15:05:06.746551+00	2026-2	2026-07-28 15:05:06.746551+00	2026-07-28 15:06:55.699126+00
29	99d8e35a-4a47-4d2d-be24-98e4d77707bc	El St. Milton Uriel Lodríquez Mosquera Identificado con N° de cédulas de ciudadanía 76.320.026 me manifiesta su caso\ndonde se le brinda la accesaria y manífiesta que el padre va a dejar un testamento a nombre de cuatro hermanos,\nle reitero que para realizar debe tener en cuenta el consentimiento de el para dejar claridad la respaticion por herencia a sus cuatro hijos. 		2026-07-17	cerrado	2026-07-21	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 16:33:59.854163+00	2026-07-22 15:28:31.954665+00
37	a7c31d96-ef6f-4c05-8443-4ce6f230efed	La usuaria manifiesta que necesita un reajuste de cuota alimentaria en beneficio de su hijo ya que hace muchos años hicieron una conciliación pero no han hecho el reajuste anual y adicionalmente solicita un aumento debido a complicaciones de salud del menor.\nSe dirige al centro de conciliación para programar audiencia.		2026-07-22	cerrado	2026-07-27	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-22 16:19:57.581935+00	2026-07-27 13:54:55.142818+00
10	3b184e51-be26-466c-a9d3-1c5fe67317fd	El día 29/04/2026, al acercarse al Banco de Bogotá a solicitar el extracto de su tarjeta de crédito con el fin de hacer un pago, el señor Jorge Alberto Blanco se percató de dichos avance no autorizados,\nde manera inmediata, informó el hecho al banco, donde radico un oficio  mediante el radicado No. 1-1301373839, presentando el respectivo reclamo. Al recibir una respuesta no favorable por parte del banco frente al radicado anterior, le llegó la notificación de nuevas transacciones ocurridas entre el 18/04/2026 y el 20/04/2026, las cuales corresponden a retiros realizados sin tarjeta física, en corresponsal bancario.\nEl señor manifiesta que las alertas tempranas de los movimientos mencionados no le llegaron , y que posteriormente se presentaron movimientos adicionales no reconocidos.\nAnte esta situación, el señor Jorge Alberto Blanco decide acudir a la Fiscalía General de la Nación a instaurar una denuncia, bajo el tipo de noticia criminal, hurto por medios informáticos y semejantes.		2026-07-09	archivado	2026-07-21	publica	No creado	\N	en_tramite	\N	\N	2026-2	\N	2026-07-27 14:32:48.877604+00
3	47244b0a-a1ea-4473-8df6-3ee2244520fe	El usuario solicita un derecho de Peticion en materia laboral pensional para que se le reconozcan 365 días de cotización por año, en este momento se le reconocen 360 por año. Esos 5 días adicionales por año cotizado lograría alcanzar las semanas requeridas para pensionarse antes, por eso quiere que Colpensiones le reconozca esa diferencia. 	Al verificar la Historia Laboral expedida por COLPENSIONES, se evidencia que el usuario cuenta con 1.255,14 semanas efectivamente cotizadas al sistema hasta el mes de febrero de 2026; en esa medida, si se aplica el criterio fijado por la Corte Suprema de Justicia en la sentencia SL138-2024, según el cual para establecer las semanas cotizadas el año debe tomarse conforme al calendario, esto es, de 365  días, le haría falta cotizar aproximadamente 7 meses adicionales para cumplir con el requisito de las 1.300 semanas exigidas por la Ley. En virtud de lo anterior, el caso es recepcionado en el Consultorio Jurídico y, una vez brindada la asesoría al usuario, este manifiesta que su deseo es solicitar al fondo de pensiones el reconocimiento de dichos días faltantes, razón por la cual se remite al área pública para proceder con proyección del derecho de petición ante la AFP.	2026-04-23	activo	\N	laboral	en_proceso	Cuenta con el reporte de Semanas Cotizadas en Pensiones	en_tramite	\N	\N	2026-1	\N	2026-04-23 00:00:00+00
8	d3462b7f-af9e-4e79-92b3-6b4f00b81381	Don Agripino Gomez Meneses Identíficado con Cedula de ciudadanía N° 4.627.757 tuvo un accidente de transito en el año 2024 el cual reitera una indemnizacion por el accidente que le occurrio, dado el caso le reitero al usuario que debe traer los documentos pertinentes y neceserarios para para realizar un Derecho de Peticion,		2026-07-08	cerrado	2026-07-09	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-09 16:36:33.533201+00
13	5079a397-230c-4e52-9eea-cb2034824355	El señor libardo se acerca a pedir asesoría por un préstamo que tiene en el banco en el cual le habían dicho que eran 36 cuotas y terminaron siendo 59 se le informó que debe traer el contrato con el banco para poder leerlo y ver en qué se le puede colaborar 		2026-07-09	cerrado	2026-07-14	privado	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-14 15:08:05.244343+00
41	28bf2618-62b1-494b-b946-52c456240a46	La Sra, Betty Birmania Ledezma identificada con cedula de ciudadania 34.566.013, se le brinda la accesoria donde manifiesta inconformismo con un  conjuto residencial en el norte de la ciudad por que se esta viendo afectada su vivenda, le manifiesto que puede hacer una conciliacion directamente con la administradora del conjunto, si no llegan a un acuerdo le dije que se acercara el 10 de agosto del presente año.		2026-07-27	pendiente_aprobacion	\N	civil_familia	No creado	que se esta viendo afectra 	\N	\N	2026-07-29 16:19:00.386348+00	2026-2	2026-07-27 16:19:00.386348+00	2026-07-27 16:26:11.951122+00
11	bb05ae72-9bdc-425e-96fa-a0adde2aeee3	El señor Carlos Arturo manifiesta que debía varios años de impuesto predial, por lo cual realizó un acuerdo de pago, el cual venía pagando oportunamente, pero no le siguieron recibiendo más pagos en el banco y le manifestaron que que ya había pagado la totalidad del acuerdo. \nAhora él acudió a averiguar pero seguía debiendo, razón por la cual al incumplir el acuerdo de pago se incrementó significativamente otra vez la deuda.	\N	2026-07-09	activo	\N	publica	No creado	Se necesita derecho de petición para solicitar información de a qué lugar fueron sumados estos pagos, copia del acuerdo de pago realizado y en que estado se encuentra actualmente la deuda.	en_tramite	\N	\N	2026-2	\N	2026-07-29 19:24:11.805432+00
20	09b97da7-ff41-403f-813d-828760287a69	El Sr. Rafael Muñoz Araujo, Identificado con Cedula de ciudadania 4.735.194 me manifesto su caso donde sufrio un accidente de transito hace aproximadamente 10 años, trajo los documentos para tomar su caso, reitere que se acercara el 10 de agosto para que tomaran el caso.		2026-07-16	cerrado	2026-07-22	laboral	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 17:31:51.215542+00	2026-07-22 15:44:57.529143+00
19	769c55a6-bd1e-4b7f-a5d5-53652e46db6c	1. El usuario pone de manifiesto que tiene intensión de participar públicamente como candidato al Concejo de Popayán.\n2. En el año de 1991 recibió sentencia condenatoria por tentativa de homicidio en un juzgado de la ciudad de Pasto Nariño.\n3. El usuario Manifiesta que no conoce si la sentencia de esa fecha puede aplicar como inhabilidad para aspirar al cargo o inscribirse como candidato.\n4. Que la Ley 136 de 1994, en el artículo 43, numeral 1, habla de las excepciones y, si podría él exceptuarse por amparo en una de esas causas.		2026-07-14	activo	\N	publica	No creado	Se recomienda realizar derecho de petición al Consejo Nacional Electoral - CNE solicitando concepto a esta entidad.	en_tramite	\N	\N	2026-2	2026-07-16 16:26:16.611+00	2026-07-30 12:54:04.064932+00
47	935a6b4e-390b-4915-97f5-98245afb9e48	La señora manifiesta que la última factura la pagó en el año 2009   lo hizo a la empresa de telefonía de  movistar y que a la fecha le llega una factura por un valor de setecientos mil pesos ($700.000) moneda corriente. Igualmente, manifiesta que recibe llamadas en repetidas ocasiones desde los siguientes números: 6017443512 y 3336025620. Se le informa a la señora que regrese el día 10 de agosto de 2026, con el fin de elaborar el respectivo derecho de petición		2026-07-28	pendiente_aprobacion	\N	publica	No creado	\N	\N	\N	2026-07-30 15:46:07.945604+00	2026-2	2026-07-28 15:46:07.945604+00	2026-07-28 15:59:29.953177+00
23	befca510-1f89-423e-abff-0206d48825bb	El señor Daniel se acerca para un asesoría para una conciliación ya que requiere liquidar la sociedad conyugal para desafilarla de la caja de compensación. El señor Daniel se separó hace 27 años.\nSe remite a conciliación 		2026-07-16	cerrado	2026-07-17	civil_familia	No creado	Se le indica que se acerque mañana 17 de julio en un horario de 8 am a 10 am para hablar con la docente maritzabel encarga de las conciliaciones 	solo_asesoria	\N	\N	2026-2	2026-07-16 17:20:11.101+00	2026-07-17 15:55:55.928918+00
21	68229df1-e450-415c-a77c-4fd4aacb2e8f	el señor relata lo siguiente, que perteneció al ejercito nacional al batallón de popayán cauca  donde lo enviaron a caldono y allá tuvo un problema con uno de los compañeros y conllevo a una riña donde el se vio afectado por que lo empujo y se fracturo el brazo izquierdo, y el argumenta que ya un abogado le esta llevando caso, el di e que no  le tiene confianza al abogado ya que este mismo lleva el caso del compañero que le fracturo el brazo, se le brindo la asesoría correspondiente 		2026-07-16	cerrado	2026-07-21	publica	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-16 20:35:16.151+00	2026-07-21 15:21:05.684136+00
30	377d7c70-5a80-4af8-aebd-2c8bf695a7d6	La usuaria manifiesta que se quiere separar de su compañero permanente pero han podido llegar a ningún acuerdo incluso en conciliación sobre los bienes que tienen juntos, se tiene que disolver la sociedad conyugal por vía judicial.\nSe le informa que se tiene que acercar el 10 de agosto.		2026-07-17	cerrado	2026-07-21	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 15:42:05.707628+00	2026-07-21 16:26:04.59543+00
33	b305131f-9c25-4923-93df-e408d58c8496	1. Inició labores con esta empresa realizando labores de transporte con el vehículo de placa TKK882 y desarrollando la actividad de conductor (el vehículo era de su propiedad); el día 2 de enero de 2010 fehca en la que inició labores.\n2. Estas labores las desempeñó desde el día lunes hasta el dia sabado, todas las semanas desde esa fecha, hasta el 31 de marzo de marzo de 2026, realizando recorrido por todas las tiendas a las que esta empresa surtía de productos.\n3. El día miércoles 1 de abril de 2026, el señor Alberto recibió llamada por celular del señor Adolfo Ortega, que ocupaba el cargo de jefe de bodega y le manifestó que ya no trabajaba más con la empresa.\n4. Trabajó sin descanso desde el 2010 hasta el 2026, fecha en la que lo retiraron de las actividades que diario realizaba.\n5. Que cumplía horario de inicio de recorridos con entregas.\n6. Cumplía ordenes impartidas por Adolfo Ortega (Román Bolaños).		2026-07-17	pendiente_aprobacion	\N	laboral	No creado	Se le informa al señor Alberto, que por ser tema del Área de Derecho Laboral, debe regresar a partir del 10 de agosto de 2026 al Consultorio Jurídico, para que pueda ser atendido por esta área.	\N	\N	2026-07-29 16:49:57.747802+00	2026-2	2026-07-27 16:49:57.747802+00	2026-07-27 16:49:57.747802+00
39	7fd3ccc8-15b1-44a7-988e-21bd9bcf5859	Don Juvenal se acerca para que por favor le realicemos una acción de tutela para la al alcaldía, ya que en enero presentó derecho de petición y no se recibió respuesta y tampoco solución alguna frente a la situación. (Es un bar) lo cual está afectando su descanso en las noches 		2026-07-22	activo	\N	publica	No creado	\N	en_tramite	\N	\N	2026-2	2026-07-22 16:10:31.191003+00	2026-07-27 23:56:04.869884+00
15	c2c741ec-2344-4d97-bd93-18e8db07ef2a	La Sra. Maria Eugenia rivera, identificada con N° 11.453.316 de venezuela, me manifiesta que su hijo fue privado de  su libertad, tenia un representante legar de confianza el cual nunca asistio a ninguna audienciencia, le reitero que para tener otro representante lega el que tiene el caso debe estar a paz y salvo para tomar el caso de la persona privada de su libertad.		2026-07-10	cerrado	2026-07-14	penal	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-14 15:13:09.945924+00
17	bca9859b-8de8-476e-8b0c-6e1a50cc628d	Se acerca a consultar cómo debe tramitar su divorcio ya que por mutuo acuerdo decidió separarse con la mujer. Se le indica que debe buscar un abogado para poder hacer la liquidación y la disolución del contrato de matrimonio. Se le indica que se acerque a la defensora del pueblo a ver si quizás puedan asignarle un abogado.		2026-07-10	cerrado	2026-07-14	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-14 15:14:34.751372+00
12	c443aaa0-5543-4ab6-a15d-72411118b73d	La Sra. Yamileth Montilla Lasso con Cedula de Ciudadania 25.277.015 me manifiesta que aparece como dueña y propietara de dos predios que aparecen como parcelacion en la rejoya, se le da la accesoria porque es un caso civil le dije que acercara desde el 8 de agosto del presente año 2026.		2026-07-09	pendiente_aprobacion	\N	civil_familia	No creado	\N	\N	\N	2026-07-16 03:56:51.124584+00	2026-2	\N	2026-07-09 16:10:28.450228+00
18	43dd3cc5-bb8e-46d2-afbc-362a4baa5a99	Se acerca nuevamente para solicitar un embargo por una suma de dinero, se le indica que se puede proceder o hacer una conciliación y ella opta por proceder, se le indica que el día 10 de agosto vuelva a acercarse para poder ayudarle con el proceso 		2026-07-10	cerrado	2026-07-14	privado	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-14 15:14:54.277186+00
35	4bd15572-6294-4dcb-9273-a04767094bf0	La Sra. Becoche Quina Belarmina identificada con Cedula de Ciudadania 25.341.404 se acerca con el fin de manifestar un contrato de Canon de Arrendamiento, se le brinda la accesroia manifestando una duda que si se incumpel que puede hacer, pero le manifiesto que la arrendataria esta cumpliendo cada mes con el pago mensual y lo pactado el contrato se realizo durante seis meses y ya lleva cuatro meses cumpliendo, reitero que se esta cumpliendo con el contrato y lo pactado entre las partes.		2026-07-21	cerrado	2026-07-21	civil_familia	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 16:18:33.415391+00	2026-07-22 15:22:45.104755+00
7	50ad2d3b-b7f3-495a-bc2c-f1be73b93014	El señor manifiesta que hace 4 años y medio hizo un contrato verbal con la señora mencionada, el cual se trataba de obtener un porcentaje por ayudarle a vender unos lotes, esto equivale a 10 millones por lote, el en total vendió 3 lotes, pero la señora nunca le pagó, ella tenia que librar los lotes con otra persona por lote cual le pidió prestado su comisión al señora nunca y le dijo que luego le pagaba, pero hasta la fecha actual no recibe respuesta por parte de ella, quiere saber qué puede hacer para recibir el pago y si es posible cobrar un interés por la demora.		2026-07-08	cerrado	2026-07-09	privado	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-09 15:19:51.378983+00
27	3cdccff7-8ac9-447d-81d5-4c3aec399daf	Don julio se acerca a pedir asesoría por un predio que él tenía hace más 50 años y el INCORA, ahora ANT le prometió otro terreno y nunca se lo dieron. Don julio después de todo este tiempo no tiene número de predial, contrato o algún papel donde indique que ese predio pertenecía a él. Solicita que ajustemos su derecho de petición para presentarlo en la ANT al igual se le explica que debe tener número predial 		2026-07-17	cerrado	2026-07-21	publica	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 15:28:34.875688+00	2026-07-21 16:20:41.136494+00
48	ccf00a9e-fbbd-49a1-b7ee-b7e201665897	El usuario manifiesta que hace 15 años construyo un apartamento encima de la casa de su hermana, luego de terminar el apartamento ella le ofreció un lote y se quedo con el apartamento.\nEl señor manifiesta que se siente estafado puesto que el valor del apartamento es mayor al del lote, y quiere saber que puede hacer.\nSe le brindó asesoría.		2026-07-28	pendiente_aprobacion	\N	civil_familia	No creado	\N	\N	\N	2026-07-30 15:49:51.311643+00	2026-2	2026-07-28 15:49:51.311643+00	2026-07-28 15:51:30.186339+00
31	15fa30c7-7e84-4667-ba58-b2a5580c5b62	El señor Jhonathan indica que asistió a audiencia de conciliación, en la cual no se retractó de lo manifestado, sin que se le diera mayor atención al asunto. Señala que su ex jefe compartió información confidencial suya con el grupo de compañeros, lo cual ha derivado en varias querellas en su contra y en actos de hostigamiento constante por parte de estos.\nAsimismo, manifiesta que existe una denuncia en su contra ante la Fiscalía por el presunto hurto de una memoria USB, frente a lo cual argumenta que dicha memoria fue enviada a través de la empresa de mensajería Interrápidísimo a la empresa 		2026-07-17	cerrado	2026-07-21	penal	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-17 19:00:07.633232+00	2026-07-21 15:30:29.385+00
16	7fd3ccc8-15b1-44a7-988e-21bd9bcf5859	El señor juvenal asiste debido a que por su casa hay un súper giros y en las noches tienen programadas alarmas muy fuertes, lo cual ha perturbado su tranquilidad y no lo dejan descansar, esto lo ha afectado mucho ya que es un adulto mayor.\nSe le brinda asesoría y se le pide fotocopia de la cédula, fotos y dirección de el súper giros y fotocopia de la narración de los hechos.		2026-07-10	cerrado	2026-07-14	publica	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-22 15:45:23.535249+00
6	43dd3cc5-bb8e-46d2-afbc-362a4baa5a99	Se acerca pidiendo asesoría para saber cómo desalojar a un inquilino ya que en conciliación acordaron 6 meses para desalojo. Se le informa que debe ir a la policía a pedir apoyo para el desalojo 		2026-07-08	cerrado	2026-07-08	privado	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-08 15:53:02.619082+00
36	50ad2d3b-b7f3-495a-bc2c-f1be73b93014	El señor manifiesta que hace aproximadamente cuatro (4) años colaboró en la gestión de venta de tres (3) lotes a favor de una inmobiliaria. Como contraprestación por dicha gestión, las partes acordaron de manera verbal el pago de una comisión por valor de treinta millones de pesos ($30.000.000).\n\nAsimismo, indica que, pese al tiempo transcurrido, la comisión no ha sido cancelada. Señala que cuenta con varias grabaciones de conversaciones sostenidas con la señora involucrada, en las cuales esta reconoce la existencia del acuerdo y manifiesta su compromiso de efectuar el pago de la comisión pactada.		2026-07-21	cerrado	2026-07-21	privado	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-21 16:21:40.460034+00	2026-07-27 14:15:29.773337+00
42	4d11d65d-2110-493d-8626-75f7040be0f2	El señor Julián se acerca solicitando asesoría para hacer un denuncio ya que fue agredido físicamente y esta en incapacidad debido a las lesiones ocasionadas, se le indica que se acerque a la fiscalía a colocar el denuncio junto. No los exámenes que tiene, resultados de medicina legal e historia clínica. Se le indica que vuelva el 10 de agosto para poder colaborarle con el caso		2026-07-27	pendiente_aprobacion	\N	penal	No creado	\N	\N	\N	2026-07-29 15:48:57.635071+00	2026-2	2026-07-27 15:48:57.635071+00	2026-07-27 15:51:31.935434+00
28	fc6fd13c-339a-42a4-85cc-65c078a67503	La señora solicita asesoría en calidad de representante de sus padres, ambos adultos mayores y pertenecientes a una comunidad indígena, toda vez que su hermana los vinculó a la EPS Sanitas en el régimen contributivo. La solicitante manifiesta su interés en trasladarlos al régimen subsidiado, debido a que los subsidios correspondientes no les están siendo entregados. el siguiente caso no se puede llevar ya que la señora no es la titular del caso 		2026-07-17	cerrado	2026-07-21	laboral	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-17 18:50:45.621673+00	2026-07-21 15:33:43.630933+00
14	0a5a8438-64fc-4812-86a3-b989411ff435	El señor EDGAR LEONARDO VILLOTA APONTE,  firmó un contrato de prestación de servicios con la empresa FRENOSMAXX, representada por el señor ANTHONY LEONEL IBARRA RIVERA, al momento de la firma se le manifestó verbalmente que la empresa le pagaría prestaciones sociales y un porcentaje por las reparaciones de motores que realizara sin embargo, el señor Villota firmó el contrato sin saber su contenido, ya que no sabe leer ni escribir,\nen desarrollo de sus labores el señor Villota sufrió un accidente de trabajo, una caja de cambios le cayó sobre el pecho, por lo cual fue atendido de urgencia y le fue expedida una incapacidad de 20 a 25 días, al reincorporarse a laborar, el empleador llegó acompañado de la Policía Nacional y lo retiró de la zona de trabajo sin ningún fundamento, con base en lo anterior, el señor Villota solicita se le reconozca la indemnización correspondiente por los perjuicios sufridos y el afirma que tiene que pagar  todos los daños causados ya que le incumplieron con lo pactado.		2026-07-10	cerrado	2026-07-14	laboral	No creado	\N	solo_asesoria	\N	\N	2026-2	\N	2026-07-14 15:12:51.392434+00
44	04c77a75-bbe6-45e3-8ab2-01095a9bd81a	Se brindó asesoría a la señora en materia civil respecto a una aclaración de compraventa con garantía hipotecaria. La asesoría consistió en la revisión de los documentos, las fechas de los pagos y las cláusulas del contrato. Asimismo, manifiesta que acepta y queda informada de que el día 10 de agosto se recibirán los documentos correspondientes por parte del área civil.		2026-07-27	pendiente_aprobacion	\N	privado	No creado	\N	\N	\N	2026-07-29 21:32:51.242278+00	2026-2	2026-07-27 21:32:51.242278+00	2026-07-27 21:36:56.941632+00
5	bb05ae72-9bdc-425e-96fa-a0adde2aeee3	Don Carlos Noe identificado co  Cedula de Ciudadania N° 10522479 de timbio. \n\nMe maniofiesta el Sr. Carlos que se acerco a la Alcaldia con  el fin de que cancelo el impuesto del predial y directamete en las oficinas le dijeron que estaba al dia.\n\nConforme a la dicho le dije que se acercara con los recibos de pago del predial y solicitar un Derecho De Peticion dirijido a la Alcaldia.		2026-07-08	cerrado	2026-07-17	publica	No creado	\N	en_tramite	\N	\N	2026-2	\N	2026-07-17 15:41:52.973008+00
9	7cdab4f2-2f06-442a-91a6-e16717a09e6e	El señor Miguel aportó la documentación para realizar un derecho de petición a la fiscalía para que desarchiven su caso por hurto de una camioneta pública en el año 2012 además solicita que el número telefónico de la denuncia ya no lo tiene y desea que lo cambien 		2026-07-08	archivado	2026-07-28	publica	No creado	\N	en_tramite	\N	\N	2026-2	\N	2026-07-28 15:28:51.188187+00
32	b305131f-9c25-4923-93df-e408d58c8496	1. Inició labores con esta empresa realizando transportes con el vehículo de placa TKK882 y prestando la actividad de conductor (el vehículo es de su propiedad); el día 2 de enero de 2010 inició labores.\n2. Estas labores las desempeño desde el día lunes hasta el día sábado desde esa fecha, hasta el 31 de marzo de 2026, realizando recorrido por todas las tiendas a las que esta empresa surtía de productos.\n3. El día miércoles 1 de abril de 2026, el señor Alberto recibió llamada por celular del señor Adolfo Ortega, que ocupaba el cargo de jefe de bodega y le manifestó que ya no trabajaba más con la empresa.\n4. Que trabajó sin descanso desde el 2010 hasta el 2026, fecha en la que lo retiraron de las actividades que diario realizaba.\n5. Que cumplía horario de inicio de recorridos con entregas.\n6. Cumplía ordenes impartidas por Adolfo Ortega de parte del señor Román Bolaños.		2026-07-17	activo	\N	laboral	No creado	Se le recibe un documento "Certificado parcial de retención en la fuente No. 8369", el cual hace como soporte de las tareas que a diario realizaba, en cumplimiento de su jornada de trabajo en el recorrido.	solo_asesoria	\N	\N	2026-2	2026-07-21 16:14:37.451615+00	2026-07-22 15:39:09.80149+00
22	c5ef8770-e775-4f52-aca6-7e3f45f176e8	La usuaria manifiesta que necesita un derecho de petición para solicitar o conocer en que estado se encuentra su indemnización como víctima del conflicto armado. \nSe le solicita copia del registro de victimas para proceder con el derecho de petición.		2026-07-16	cerrado	2026-07-21	publica	No creado	\N	solo_asesoria	\N	\N	2026-2	2026-07-16 16:37:08.422+00	2026-07-21 15:22:11.090562+00
38	e9bcc969-b1b5-45ba-9d5b-e6b2f2e00664	1. En la inspección 4 urbana de policía municipal de Popayán se instauró en contra del señor Liberto una querella por presunta infracción al art. 77 de la Ley 1801 de 2016.\n2. Que el señor Liberto pone de manifiesto que el terreno por el cual se inicia proceso de querella es de su propiedad y no de la señora Ana Teresa Medina Chantre.\n3. En el año 2025 se contrató por parte del señor Liberto Chamizo Medina a un profesional en topografía para hacer la consultoría para la respectiva restitución de cercos o cerramientos de colindancia.\n4. Que el señor Liberto tiene en su poder los documentos y planos de soporte del levantamiento topográfico que realizó el topógrafo.\n5. Que el topógrafo se llama Raúl Campo Ospina con Matrícula No. 01-17517 CPNT y entregó planos en marzo de 2025.		2026-07-22	pendiente_aprobacion	\N	privado	No creado	Se le informa al señor Liberto que debe regresar al Consultorio Jurídico a partir del 10 de agosto de 2026.	\N	\N	2026-07-29 16:34:03.271471+00	2026-2	2026-07-27 16:34:03.271471+00	2026-07-29 13:44:20.310411+00
49	2421cbb8-90ad-4f25-a668-6548a010ff07	1. Con el señor accionado, la señora Esneida tiene una hija menor de edad, debidamente reconocida conforme consta en R.C. 1.058.940.655 - Indicativo serial 60020707.\n2. Que la menor actualmente tiene 7 años de edad y vive con la mamá en el Valle del Ortigal, Torre 18, Apto 303.\n3. Hasta la fecha en que la menor tenía 3 meses de edad, con el progenitor llevaron una unión marital de hecho, tiempo en el cual habitaron en el apartamento de propiedad de la señora Esneila en el Valle del Ortigal, del municipio de Popayán.\n4. Llegada esta fecha, el señor Andrés Fernando se va de la residencia y acuerdan de manera verbal, que él iba a aportar mensualmente $200.000, y pagó las cuotas  hasta que la menor cumplió un (01) año de edad.\n5. Para esa fecha, la señora Esneila manifiesta que el progenitor no volvió a pagar la cuota y tampoco supo más de él.		2026-07-28	pendiente_aprobacion	\N	civil_familia	No creado	Se escucha el caso de la señora Esneila, sin embargo ella manifiesta que requiere de un proceso de Conciliación, motivo por el cual se hace la Remisión para el Centro de Conciliación del Consultorio Jurídico de la Corporación Universitaria Autónoma del Cauca.	\N	\N	2026-07-30 16:24:53.313426+00	2026-2	2026-07-28 16:24:53.313426+00	2026-07-29 14:28:35.792509+00
45	a6a69e9b-bfa5-4917-89ba-ffa30e828c5e	1. En el año 2020, el 23 de abril, se le puso por parte de un policía, un comparendo por no cumplir en pandemia el "PICO Y CEDULA" a ella como ciudadana en movilidad peatonal.\n2. Manifiesta que realizó mediante derecho de petición en el año 2025 la prescripción del comparendo y copia del expediente.\nque en el año 2025, en el mes de agosto,  a falta de respuesta de la inspección de policía, ella interpuso una tutela.\n3. En el año 2026 se reiteró la solicitud de la prescripción de la Tutela.\n4. Que a razón de la solicitud de prescripción del comparendo, que se realizó en el año 2026, recibió una citación a Audiencia Pública en la Inspección Cuarta de Policía de Popayán para el día 5 de agosto de 2020, a las 09:00 am.		2026-07-28	pendiente_aprobacion	\N	publica	No creado	Como no trajo documentos de soporte, encontrar el contexto real es un poco difícil, sin embargo con la asesoría del docente se le informó a la Señora Angela, que a la audiencia se presente con todos los documentos de soporte, físicos o magnéticos que posea y con un nuevo documento de solicitud de prescripción y que por parte del Consultorio, debe presentarse, si así lo considera, a partir del día 10 de agosto, para una asesoría más técnica y específica del caso consultado.	\N	\N	2026-07-30 14:54:39.753601+00	2026-2	2026-07-28 14:54:39.753601+00	2026-07-29 14:29:27.902997+00
34	c5ef8770-e775-4f52-aca6-7e3f45f176e8	En el año 2010 vivía en Totoró en una casa de cabildo y tiene acta de adjudicación y la guerrilla llego hasta  y le dijeron que se tenia que ir y alejarse del sector que que se vino con sus hijos menores de edad para y la ciudad de Popayán al Barrio el recuerdo pagando arriendo.\n2. En el año 2018 como ya no tenia trabajo, para sostenerse decidió irse a trabajar al municipio de Gabriel López\ncon su hijo a varón menor de edad yhorman sneider y la guerrilla intentó llevárselo,\npor eso tuvieron que salir de nuevo del municipio  y regresarse a la ciudad de popayán  de nuevo con su hijo que era menor de edad en esa fecha  3)  de esa fecha para acá viven en popayán, pero sin tener trabajo estable, mis ingresos económicos no son apropiados para vivir y con afectaciones de salud en las manos por la violencia con la que la trataron en el año 2010 		2026-07-21	activo	\N	publica	No creado	\N	en_tramite	\N	\N	2026-2	2026-07-22 16:00:06.354372+00	2026-07-30 15:51:38.406889+00
\.


--
-- Data for Name: actividades_caso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."actividades_caso" ("id", "id_caso", "id_usuario", "titulo", "descripcion", "created_at") FROM stdin;
1	9	bbde362e-ad70-445c-be8c-861b0e06052c	CAMBIO DE ASIGNACIÓN DE ESTUDIANTE	Cordial Saludo. \n\nMe permito solicitar cambio de estudiante asignado, así mismo la o el estudiante debe estructurar la petición y remitirla por la presente plataforma, hasta el día 10 de julio del 2026.	2026-07-09 15:19:06.983968+00
2	5	bbde362e-ad70-445c-be8c-861b0e06052c	Realizar derecho de petición y remitir para aprobación	Cordial Saludo. \n\nJorge favor estructurar derecho de petición, remitir por la presente plataforma para su revisión y aprobación fecha máxima hasta el 10 de julio del 2026.	2026-07-09 15:21:09.397265+00
3	11	bbde362e-ad70-445c-be8c-861b0e06052c	Asignación de estudiante	Cordial Saludo. \n\nPor favor asignar estudiante para su trámite, recordar que por ser periodo intersemestral los estudiantes solo tiene un termino de 2 dias para realizar los derechos petición y remitir al docente para su aprobación.	2026-07-09 16:39:25.941979+00
4	9	bbde362e-ad70-445c-be8c-861b0e06052c	Corregir derecho de petición	Por favor el derecho de petición debe ir dirigido al fiscal delgado que conoció de la denuncia por ello se debe corregir el encabezado, así mismo en las peticiones solicitar información sobre porque ello caso fue cerrado, en torno a los fundamentos jurídicos no basta solo con relacionar la norma sobre los derechos de petición, también es menester relacionarlos con el caso en concreto, así mismo debe relacionar jurisprudencia y fuentes legales sobre la obligación de investigar los delitos, su termino de vigencia y porque el delito aun puede ser investigado, mejorar el derecho de pegtición en torno a las correcciones solicitadas.	2026-07-14 15:06:48.583834+00
5	10	bbde362e-ad70-445c-be8c-861b0e06052c	Información estado de proceso.	Por favor informar al suscrito asesor el estado del proceso	2026-07-14 15:08:39.943182+00
6	5	bbde362e-ad70-445c-be8c-861b0e06052c	Informe sobre derecho de petición	cordial saludo el termino para presentar el derecho de petición se encuentra vencido por favor cargarlo parta su aprobación al suscrito docente.	2026-07-14 15:22:51.666607+00
7	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Se solicita copia impresa de la cédula y fotocopia de la sentencia del Juzgado en Pasto, para el archivo físico del consultorio	Documentos fisicos	2026-07-14 16:39:47.345395+00
8	9	bbde362e-ad70-445c-be8c-861b0e06052c	APROBADO PARA ENTREGA	SE APRUEBA PARA ENTREGA AL USUARIO, POR FAVOR TIOMAR CONTACTO Y REALIZAR ENTREGA DEL DERECHO DE PETICIÓN, ACLARAR AL USUARIO QUE NUESTRA RESPONSABILIDAD Y MANEJO COMO CONSULTORIO FINALIZA UNA VEZ ENTREGADO EL ESCRITO,POR FAVOR TOMAR RECIBIDO DEL USUARIO Y SUBIRLO AL PRESENTE CASO.	2026-07-16 15:06:53.326678+00
9	19	bbde362e-ad70-445c-be8c-861b0e06052c	Corrección	Cordial Saludo. \nEl hecho primero corresponde a la solicitud de la petición, por tanto no va en hechos sino en peticiones. \n\nAsí mismo en el acapite de fundamentos de derecho, relacionar adecuadamente , los fundamentos jurídicos sobre inhabilidades para cargos de elección popular y como aplican o no para el caso en concreto. \n\nCorregir y cargar plazo hasta el día de mañana a las 10:00AM	2026-07-21 15:27:19.938626+00
10	11	bbde362e-ad70-445c-be8c-861b0e06052c	Corrección	Amparo, El trabajo realizado respecto de los hechos y las peticiones es excelente, sin embargo debes corregir los fundamentos de derecho, no basta solo con nombrarlos, se deben citar de la norma y la jurisprudencia y relacionarlos para el caso en concreto, por lo cual solicito corregir ese apartado, con plazo hasta mañana 22 de julio del 2026.	2026-07-21 16:14:26.82967+00
11	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	Buenas		2026-07-23 22:43:26.30872+00
12	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	Buenas	Buenas tardes profe, ya adjunté el derecho de petición para su revisión, muchas gracias, feliz día.	2026-07-23 22:43:51.481218+00
13	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Documento corregido con observaciones resueltas	Carga a la plataforma, del documento de petición del señor Carlos Arturo Noé "007_DERECHO DE PETICION CARLOS ARTURO NOE ASTAIZA CC No 10522479_v02.pdf"	2026-07-26 19:47:48.45829+00
14	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Documento corregido a solicitud del docente	Se carga el proyecto de derecho de petición "06_DERECHO DE PETICION v03.pdf" con las correcciones solicitadas.	2026-07-27 03:59:07.100324+00
15	11	bbde362e-ad70-445c-be8c-861b0e06052c	Aprobado	Se aprueba para entrega al usuario, por favor tener en cuenta que debes guardar una copia con recibido del usuario, para el archivo y así mismo redactar documento de archivo de caso, el cual debe reposar en carpeta en físico y ser cargado a la presente plataforma	2026-07-27 13:58:30.298561+00
16	19	bbde362e-ad70-445c-be8c-861b0e06052c	Aprobado	Amparoi se aprueba la petición para su entrega, recordar que debes contar con una copia de recibido del usuario, realizar el formato de archivo del caso, el cual se debe guardar en la carpeta en físico , así como en el presente medio digital	2026-07-27 14:00:04.826503+00
17	34	bbde362e-ad70-445c-be8c-861b0e06052c	Corrección	Julian, remito para corrección de fundamentos de derecho, no basta con nómbralos, se deben relacionar con el caso en concreto, así mismo se deben realizar las citas correspondientes con el fin de dar un mayor peso al escrito referido,	2026-07-27 15:10:58.476445+00
18	38	bbde362e-ad70-445c-be8c-861b0e06052c	Creación de Caso	Crear caso en plataforma para visualización del docente.	2026-07-27 15:14:27.854338+00
19	40	bbde362e-ad70-445c-be8c-861b0e06052c	Aprobado	Lisbeth se aprueba para entrega al usuario, por favor antes de entregar justificar documento, guardar copia de recibido del usuario y así mismo documento para archivo del proceso.	2026-07-27 15:17:17.420818+00
20	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	El día de ayer se presentó el Señor Carlos Arturo Noe a recibir el documento impreso en original y una copia (nueve folios cada uno) y el CD para que lo radicara en la Ventanilla Única de la alcaldía		2026-07-28 13:26:31.016687+00
21	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ENTREGA AL USUARIO DE DOCUMENTO DERECHO DE PETICIÓN	Se carga a la plataforma el documento soporte que acredita el envío, por medio de correo electrónico, del proyecto de Derecho de Petición al usuario, para su posterior radicación ante el Consejo Nacional Electoral – CNE.	2026-07-28 13:45:47.658987+00
22	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	CORRECCIÓN EN NUMERAL DE "RESUMEN DE LOS HECHOS"	4. Que a razón de la solicitud de prescripción del comparendo, que se realizó en el año 2026, recibió una citación a Audiencia Pública en la Inspección Cuarta de Policía de Popayán para el día 5 de agosto de 2026, a las 09:00 am.	2026-07-28 15:10:01.738829+00
23	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	SEGUIMIENTO DEL CASO	El usuario informó vía telefónica, hace aproximadamente cinco (5) minutos, que el Derecho de Petición correspondiente al presente caso ya fue remitido al Consejo Nacional Electoral (CNE), conforme a las instrucciones impartidas por el Consultorio Jurídico. Así mismo, manifestó que, una vez llegue a su residencia, enviará por correo electrónico el soporte de la remisión realizada, con el fin de incorporarlo al expediente del caso.	2026-07-29 16:02:03.192445+00
24	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Carga de soporte de radicación del Derecho de Petición – Alcaldía Municipal de Popayán	Se deja constancia de que, en la fecha, el señor Carlos Arturo Noé Astaiza hizo entrega al Consultorio Jurídico de la copia del Derecho de Petición con la constancia oficial de recibido expedida por la Ventanilla Única de la Alcaldía Municipal de Popayán, documento que acredita la radicación de la solicitud presentada ante dicha entidad.\n\nEn consecuencia, el soporte de radicación fue incorporado al expediente digital del caso y cargado en la plataforma del Consultorio Jurídico con el nombre de archivo: "01_CASO #011_CARLOS ARTURO NOE_RECIBIDO VU_ALCALDIA POPAYAN_20260729_100513720_MFNR", con el propósito de garantizar la trazabilidad documental, la integridad del expediente y la conservación del soporte que acredita la presentación formal del Derecho de Petición ante la administración municipal.	2026-07-29 16:37:26.912089+00
25	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	CORRECIÓN	El archivo que se cargó con el recibido, corresponde al CASO #011 y no al CASO #019	2026-07-29 16:39:14.682172+00
26	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Verificación de radicación e incorporación del soporte al expediente	Se verificó que el Derecho de Petición fue radicado por el usuario mediante el correo electrónico de Atención al Ciudadano del Consejo Nacional Electoral (CNE). Conforme al soporte remitido por el usuario, la solicitud quedó registrada bajo el radicado No. CNE-E-DG-2026-027753, documento que fue incorporado al expediente digital del caso.	2026-07-30 13:00:38.201551+00
\.


--
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perfiles" ("id", "nombre_completo", "correo", "cedula", "telefono", "activo") FROM stdin;
1b35a5ec-c188-4e69-b68c-d37f158859e2	Admin	consul.uac.admin@gmail.com	11111	111111	t
fb42a92d-b85a-4718-a456-1b8953871eaa	Maritza Repizo	profesional.consultoriojuridico@uniautonoma.edu.co	34555412	3137473148	t
b05fe275-d1f1-4af9-82af-06a688751425	Marcela Castro	consultoriojuridico@uniautonoma.edu.co	\N	\N	t
bbde362e-ad70-445c-be8c-861b0e06052c	Erasmo Javier Paredes Londoño	erasmo.paredes.l@uniautonoma.edu.co	1061810840	3147089029	t
8a923944-1c53-4584-94c1-f72c0848d04b	Valentina Gonzalez Giraldo	valentina.gonzalez.g@uniautonoma.edu.co	1061810825	3042910323	t
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	Derian Dilvey Torres Yule	derian.torres.y@uniautonoma.edu.co	1002949671	3156157685	t
ece5557b-c859-4da3-bd35-f1d2b3beb586	Lisbeth Daniela Muñoz Daza	lisbeth.munoz.d@uniautonoma.edu.co	1193096007	3102922004	t
2ee91872-abbe-4d2e-be03-8e4eb3b47e05	Jherson Danilo Valencia Cardozo	jherson.valencia.c@uniautonoma.edu.co	1002981408	3224062838	f
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	Julian Ortiz Chica	julian.ortiz.chica@uniautonoma.edu.co	1037668130	3116215477	t
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	Amparo Pareja López	amparo.pareja.l@uniautonoma.edu.co	41926676	3128010503	t
fac90012-570f-4d3c-90e2-dd3d991e5aec	Luisa Maria Tomassoni	luisa.tomassoni.m@uniautonoma.edu.co	1007143448	3113881374	f
c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	Augusto Torrejano	augusto.torrejano.f@uniautonoma.edu.co	12132604	3125380084	t
a5c3f506-7bf6-4a27-af1c-c26035301e50	Diego Fernando Cardenas Astudillo	diego.cardenas.a@uniautonoma.edu.co	1061685005	3104597499	t
180699bd-c51c-4921-baed-7e3f18d72a42	Alejandra Buitron Erazo	maalebuitron@unicauca.edu.co	1061767144	3147946181	t
a83bd223-61a7-4ece-9ccf-40f3771c5a5c	Luisa Fernanda Villamizar Segura	luisa.villamizar.s@uniautonoma.edu.co	1061786717	3127686651	t
\.


--
-- Data for Name: asesores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."asesores" ("id_perfil", "turno", "area", "dia", "horario") FROM stdin;
c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	9-11	civil	\N	\N
bbde362e-ad70-445c-be8c-861b0e06052c	\N	publica	\N	{"Lunes": {"turno": "9-11", "activo": true}, "Jueves": {"turno": "9-11", "activo": true}, "Martes": {"turno": "9-11", "activo": true}, "Sábado": {"turno": "9-11", "activo": false}, "Viernes": {"turno": "9-11", "activo": true}, "Miércoles": {"turno": "9-11", "activo": true}}
a5c3f506-7bf6-4a27-af1c-c26035301e50	9-11	laboral	\N	\N
180699bd-c51c-4921-baed-7e3f18d72a42	\N	publica	\N	\N
a83bd223-61a7-4ece-9ccf-40f3771c5a5c	\N	penal	\N	\N
\.


--
-- Data for Name: asesores_casos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."asesores_casos" ("id_asesor", "id_caso", "fecha_asignacion", "fecha_fin_asignacion") FROM stdin;
a5c3f506-7bf6-4a27-af1c-c26035301e50	1	2026-03-19	\N
c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	2	2026-04-09	\N
a5c3f506-7bf6-4a27-af1c-c26035301e50	3	2026-04-23	\N
c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	4	2026-05-07	\N
bbde362e-ad70-445c-be8c-861b0e06052c	5	2026-07-08	\N
bbde362e-ad70-445c-be8c-861b0e06052c	6	2026-07-08	\N
bbde362e-ad70-445c-be8c-861b0e06052c	7	2026-07-08	\N
bbde362e-ad70-445c-be8c-861b0e06052c	8	2026-07-08	\N
bbde362e-ad70-445c-be8c-861b0e06052c	9	2026-07-08	\N
bbde362e-ad70-445c-be8c-861b0e06052c	10	2026-07-09	\N
bbde362e-ad70-445c-be8c-861b0e06052c	11	2026-07-09	\N
bbde362e-ad70-445c-be8c-861b0e06052c	13	2026-07-09	\N
bbde362e-ad70-445c-be8c-861b0e06052c	14	2026-07-10	\N
bbde362e-ad70-445c-be8c-861b0e06052c	15	2026-07-10	\N
bbde362e-ad70-445c-be8c-861b0e06052c	16	2026-07-10	\N
bbde362e-ad70-445c-be8c-861b0e06052c	17	2026-07-10	\N
bbde362e-ad70-445c-be8c-861b0e06052c	18	2026-07-10	\N
bbde362e-ad70-445c-be8c-861b0e06052c	19	2026-07-14	\N
bbde362e-ad70-445c-be8c-861b0e06052c	20	2026-07-16	\N
bbde362e-ad70-445c-be8c-861b0e06052c	21	2026-07-16	\N
bbde362e-ad70-445c-be8c-861b0e06052c	22	2026-07-16	\N
bbde362e-ad70-445c-be8c-861b0e06052c	23	2026-07-16	\N
bbde362e-ad70-445c-be8c-861b0e06052c	27	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	28	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	29	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	30	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	31	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	32	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	33	2026-07-17	\N
bbde362e-ad70-445c-be8c-861b0e06052c	34	2026-07-21	\N
bbde362e-ad70-445c-be8c-861b0e06052c	35	2026-07-21	\N
bbde362e-ad70-445c-be8c-861b0e06052c	36	2026-07-21	\N
bbde362e-ad70-445c-be8c-861b0e06052c	37	2026-07-22	\N
bbde362e-ad70-445c-be8c-861b0e06052c	38	2026-07-22	\N
bbde362e-ad70-445c-be8c-861b0e06052c	39	2026-07-22	\N
bbde362e-ad70-445c-be8c-861b0e06052c	40	2026-07-22	\N
bbde362e-ad70-445c-be8c-861b0e06052c	41	2026-07-27	\N
bbde362e-ad70-445c-be8c-861b0e06052c	42	2026-07-27	\N
bbde362e-ad70-445c-be8c-861b0e06052c	43	2026-07-27	\N
bbde362e-ad70-445c-be8c-861b0e06052c	44	2026-07-27	\N
bbde362e-ad70-445c-be8c-861b0e06052c	45	2026-07-28	\N
bbde362e-ad70-445c-be8c-861b0e06052c	46	2026-07-28	\N
bbde362e-ad70-445c-be8c-861b0e06052c	47	2026-07-28	\N
bbde362e-ad70-445c-be8c-861b0e06052c	48	2026-07-28	\N
bbde362e-ad70-445c-be8c-861b0e06052c	49	2026-07-28	\N
bbde362e-ad70-445c-be8c-861b0e06052c	50	2026-07-28	\N
\.


--
-- Data for Name: auditoria_casos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."auditoria_casos" ("id", "id_caso", "id_usuario", "accion", "descripcion", "metadata", "created_at") FROM stdin;
1	5	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-08 15:38:46.595215+00
2	5	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #5	\N	2026-07-08 15:38:46.80386+00
3	5	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #5	\N	2026-07-08 15:38:46.953732+00
4	6	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-08 15:42:52.789811+00
5	6	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #6	\N	2026-07-08 15:42:52.898175+00
6	6	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #6	\N	2026-07-08 15:42:53.005168+00
7	6	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 15:51:05.747816+00
8	6	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-08 15:52:54.90162+00
9	6	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-08 15:53:02.619082+00
10	5	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 15:58:55.947806+00
11	7	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-08 16:10:09.967836+00
12	7	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #7	\N	2026-07-08 16:10:10.086539+00
13	7	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #7	\N	2026-07-08 16:10:10.251247+00
14	8	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-08 16:13:12.390158+00
15	8	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #8	\N	2026-07-08 16:13:12.519219+00
16	8	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #8	\N	2026-07-08 16:13:12.656076+00
17	7	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 16:27:15.080852+00
18	9	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-08 16:34:17.070136+00
19	9	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #9	\N	2026-07-08 16:34:17.229831+00
20	9	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #9	\N	2026-07-08 16:34:17.381889+00
21	9	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 17:58:49.30572+00
22	9	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 17:58:49.313637+00
23	9	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-08 17:58:50.279915+00
24	10	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-09 15:10:14.096419+00
25	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #10	\N	2026-07-09 15:10:14.271504+00
26	10	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #10	\N	2026-07-09 15:10:14.488057+00
27	11	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-09 15:14:20.098431+00
28	11	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #11	\N	2026-07-09 15:14:20.218207+00
29	11	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #11	\N	2026-07-09 15:14:20.379732+00
30	12	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-09 15:17:08.24709+00
31	12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #12	\N	2026-07-09 15:17:08.362357+00
32	9	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-09 15:17:36.975475+00
33	7	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-09 15:19:48.794978+00
34	7	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-09 15:19:51.378983+00
35	5	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-09 15:20:14.850626+00
36	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #9	\N	2026-07-09 15:24:29.162542+00
37	13	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-09 15:57:36.424023+00
38	13	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #13	\N	2026-07-09 15:57:36.547418+00
39	13	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #13	\N	2026-07-09 15:57:36.69433+00
40	12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 16:10:27.189155+00
41	12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 16:10:28.450228+00
42	8	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 16:24:03.710716+00
43	13	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 16:24:29.494114+00
44	11	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 16:29:22.043309+00
45	8	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-09 16:36:19.990894+00
46	8	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-09 16:36:33.533201+00
47	11	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-09 16:37:33.010393+00
48	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 23:03:55.969148+00
49	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-09 23:03:56.068435+00
50	14	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-10 15:05:09.469825+00
51	14	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #14	\N	2026-07-10 15:05:09.612186+00
52	14	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #14	\N	2026-07-10 15:05:09.797328+00
53	15	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-10 15:14:53.604695+00
54	15	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #15	\N	2026-07-10 15:14:53.731203+00
55	15	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #15	\N	2026-07-10 15:14:53.887473+00
56	16	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-10 15:22:59.741271+00
57	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #16	\N	2026-07-10 15:22:59.925308+00
58	16	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #16	\N	2026-07-10 15:23:00.105539+00
59	17	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-10 15:27:02.565988+00
60	17	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #17	\N	2026-07-10 15:27:02.69476+00
61	17	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #17	\N	2026-07-10 15:27:02.808873+00
62	17	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 15:41:50.423607+00
63	17	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 15:41:50.44957+00
64	18	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-10 15:47:07.220288+00
65	18	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #18	\N	2026-07-10 15:47:07.338466+00
66	18	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #18	\N	2026-07-10 15:47:07.50297+00
67	15	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 15:59:25.266839+00
68	18	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 16:01:19.949727+00
69	18	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 16:01:20.412777+00
70	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 16:10:58.9293+00
71	14	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-10 16:28:09.430871+00
72	13	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:08:02.63843+00
73	13	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:08:05.244343+00
74	10	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-14 15:08:14.090476+00
75	14	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:12:49.524227+00
76	14	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:12:51.392434+00
77	15	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:13:05.464172+00
78	15	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:13:09.945924+00
79	16	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:13:36.130673+00
80	16	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:13:39.033246+00
81	17	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:14:31.862208+00
82	17	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:14:34.751372+00
83	18	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-14 15:14:51.329518+00
84	18	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-14 15:14:54.277186+00
85	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #11	\N	2026-07-14 15:25:22.744267+00
86	19	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-14 15:30:30.568392+00
87	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #19	\N	2026-07-14 15:30:30.690731+00
88	19	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #19	\N	2026-07-14 15:30:30.861874+00
89	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se solicitó por vía celular el día martes 14 de julio de 2026 al usuario Carlos Astaiza, documentos adicionales a los entregados en la consulta, como son los recibos de predial que llegan al propietario del inmueble, recibos del año 2023, 2024 y 2025, para adicionarlos como soporte al derecho de petición, corroborar los valores cobrados en los recibos que se adjuntaron, con los recibos de predial del año 2024 y 2025 y así verificar el valor realmente adeudado.	\N	2026-07-15 15:20:39.999966+00
90	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El día de hoy 15 de julio a las 10:00 am se llama al usuario para preguntar por los documentos que el dia de ayer se acordó traer al consultorio o enviar por wp, pero la señora que atendió el celular manifestó que no encontraron los recibos o documentos por mí solicitados.  En estas condiciones, se procederá a realizar el documento "Derecho de Petición" al municipio de Popayán con los recibos de pago que se adjuntaron al formato de entrevista el día jueves 9 de julio de 2026, trece (13) folios.	\N	2026-07-15 15:25:47.746644+00
91	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se realiza cuadro de "Relación de pagos a Impuesto Predial" y se carga al proceso el cuadro en pdf.	\N	2026-07-15 16:42:14.055928+00
92	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se realiza el cargue del Derecho de Petición "Vo3" del señor Carlos Arturo Noe Astaiza, para la respectiva revisión del docente a cargo de la asignatura.	\N	2026-07-16 02:30:22.13007+00
93	20	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-16 14:57:40.185718+00
94	20	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #20	\N	2026-07-16 14:57:40.318627+00
95	20	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #20	\N	2026-07-16 14:57:40.47083+00
96	21	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-16 15:00:00.050828+00
97	21	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #21	\N	2026-07-16 15:00:00.246879+00
98	21	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #21	\N	2026-07-16 15:00:00.378036+00
99	22	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-16 15:58:10.443108+00
100	22	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #22	\N	2026-07-16 15:58:10.598817+00
101	22	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #22	\N	2026-07-16 15:58:10.766465+00
102	23	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-16 16:20:40.948485+00
103	23	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #23	\N	2026-07-16 16:20:41.072174+00
104	23	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #23	\N	2026-07-16 16:20:41.241157+00
105	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-16 16:26:16.106389+00
106	22	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-16 16:37:09.44159+00
107	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El día 14 de julio, se hizo la subida a la plataforma de unas imagenes jpg de los documentos suministrados por el usuario, donde por error se subió la imagen IMG_20260714_103648627_MFNR.jpg, el cual no pertenece al presente caso.	\N	2026-07-16 16:47:35.659466+00
108	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El día 14 de julio, se hizo la subida a la plataforma de un documento en pdf de los documentos suministrados por el usuario, donde por error se subió 01_DOCUMENTOS DE SOPORTE USUARIO.pdf, el cual tiene errores de subida.	\N	2026-07-16 16:48:56.046361+00
109	23	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-16 17:20:14.120258+00
110	23	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-16 17:20:14.308942+00
111	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se cargan documentos en pdf, después de realizar capacitación en el uso de la plataforma del consultorio, para corregir el defecto anterio de haber subido los documentos soporte del caso en formato jpg.	\N	2026-07-16 21:39:41.038692+00
112	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se carga el proyecto de derecho de petición "05_CASO 019_PROYECCION DERECHO DE PETICION_v01.pdf" dirigido al Consejo Nacional Electoral – CNE, mediante el cual se solicita concepto sobre la consulta planteada por el usuario, junto con sus respectivos anexos, para revisión y aprobación por parte del asesor del Consultorio Jurídico.	\N	2026-07-16 23:25:30.844985+00
113	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Corrijo el nombre del archivo cargado es "05_CASO 019_PROYECCION DERECHO DE PETICION_v02.pdf"	\N	2026-07-16 23:26:59.465012+00
114	27	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:11:29.294328+00
115	27	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #27	\N	2026-07-17 15:11:29.43973+00
116	27	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #27	\N	2026-07-17 15:11:29.597186+00
117	28	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:14:54.670531+00
118	28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #28	\N	2026-07-17 15:14:54.792123+00
119	28	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #28	\N	2026-07-17 15:14:54.911122+00
120	29	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:23:28.439335+00
121	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #29	\N	2026-07-17 15:23:28.563344+00
122	29	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #29	\N	2026-07-17 15:23:28.726965+00
123	30	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:31:31.247465+00
124	30	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #30	\N	2026-07-17 15:31:31.368161+00
125	30	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #30	\N	2026-07-17 15:31:31.496224+00
126	31	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:36:28.46902+00
127	31	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #31	\N	2026-07-17 15:36:28.602649+00
128	31	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #31	\N	2026-07-17 15:36:28.741128+00
129	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_112901857_MFNR.jpg'	\N	2026-07-17 15:39:22.280945+00
130	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_112916206_MFNR.jpg'	\N	2026-07-17 15:39:31.733835+00
131	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_112929074_MFNR.jpg'	\N	2026-07-17 15:39:39.670097+00
132	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103602827_MFNR.jpg'	\N	2026-07-17 15:39:47.983582+00
133	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103609344_MFNR.jpg'	\N	2026-07-17 15:39:57.231008+00
134	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103614036_MFNR.jpg'	\N	2026-07-17 15:40:04.771211+00
135	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103618840_MFNR.jpg'	\N	2026-07-17 15:40:11.641556+00
136	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103624098_MFNR.jpg'	\N	2026-07-17 15:40:30.353893+00
137	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103631184_MFNR.jpg'	\N	2026-07-17 15:40:37.47144+00
138	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103637076_MFNR.jpg'	\N	2026-07-17 15:40:50.955611+00
139	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103643446_MFNR.jpg'	\N	2026-07-17 15:40:57.818426+00
140	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103648627_MFNR.jpg'	\N	2026-07-17 15:41:04.187786+00
141	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103656714_MFNR.jpg'	\N	2026-07-17 15:41:10.131772+00
142	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103715716_MFNR.jpg'	\N	2026-07-17 15:41:14.838103+00
143	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_112901857_MFNR.jpg'	\N	2026-07-17 15:41:20.19902+00
144	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '01_Formato Consultorio Juridico III_CASO 019.pdf'	\N	2026-07-17 15:41:25.225187+00
145	5	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 8-07-26 11.01.pdf'	\N	2026-07-17 15:41:42.139653+00
146	5	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-17 15:41:52.973008+00
147	9	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'Derecho de petición fiscalía CORREGIDO.docx'	\N	2026-07-17 15:42:13.10276+00
148	9	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'Derecho de Petición fiscalía 1.docx'	\N	2026-07-17 15:42:16.79482+00
149	32	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 15:55:50.10636+00
150	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #32	\N	2026-07-17 15:55:50.239146+00
151	32	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #32	\N	2026-07-17 15:55:50.374557+00
152	23	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-17 15:55:51.729501+00
153	23	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-17 15:55:55.928918+00
154	33	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-17 16:06:12.884714+00
155	33	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #33	\N	2026-07-17 16:06:13.00575+00
156	33	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #33	\N	2026-07-17 16:06:13.16697+00
163	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 17-07-26 11.41_1.jpeg'	\N	2026-07-17 16:45:09.64714+00
164	28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-17 18:50:45.621673+00
165	31	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-17 19:00:07.633232+00
166	31	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-2 anaya compressed.pdf'	\N	2026-07-17 19:03:28.021049+00
167	28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-3_compressed.pdf'	\N	2026-07-17 19:04:12.040505+00
168	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El día de hoy se presentó el señor Carlos Arturo Noe, a entregar más documentos que soportan su petición al Municipio y se van a adjuntar al proceso.	\N	2026-07-18 01:38:15.81056+00
169	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '03_CORRECCION DOCUMENTOS DE SOPORTE PAGOS.pdf'	\N	2026-07-18 02:23:44.024997+00
170	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '04_RELACION PAGOS IMPUESTO PREDIAL.pdf'	\N	2026-07-18 02:23:53.635097+00
171	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se incorporó al expediente la documentación adicional aportada por el señor Carlos Arturo Noé. Del análisis de dichos soportes se identificaron nuevos elementos de relevancia jurídica, por lo cual se actualizó y complementó el Derecho de Petición, fortaleciendo las solicitudes probatorias encaminadas a reconstruir la trazabilidad administrativa, contable y jurídica del impuesto predial objeto de controversia.	\N	2026-07-18 06:51:24.175407+00
172	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento 'DERECHO DE PETICION v05.pdf'	\N	2026-07-18 06:51:44.998062+00
173	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se carga al expediente la versión consolidada del Derecho de Petición, debidamente actualizada con fundamento en el análisis de la documentación aportada por el usuario y los soportes recopilados durante el estudio del caso, para revisión del docente Dr. Erasmo y, de ser procedente, su aprobación a fin de continuar con las actuaciones propias del proceso de asesoría jurídica.	\N	2026-07-18 06:53:44.752706+00
174	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '003_2021_10_27_ESTADO DE CUENTA_Recibo No 21010310233448.pdf'	\N	2026-07-18 07:00:04.743214+00
175	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '004_2025_03_04_ESTADO DE CUENTA_Recibo No 25010310094348.pdf'	\N	2026-07-18 07:00:13.280485+00
176	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '005_2025_03_05_CERTIFICADO DE TRADICION.pdf'	\N	2026-07-18 07:00:20.578006+00
177	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '006_2024_04_24_DERECHO PETICION_PRESCRIPCION IMPUESTO PREDIAL.pdf'	\N	2026-07-18 07:00:33.910894+00
178	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se deja constancia de que, al momento de la carga documental, la plataforma del Consultorio Jurídico presentó la restricción "Límite de 30 documentos por caso alcanzado", razón por la cual no fue posible incorporar cinco (5) documentos adicionales que hacen parte de los soportes recopilados durante el estudio del caso. Los documentos se encuentran debidamente organizados y disponibles para su incorporación al expediente una vez sea habilitada la capacidad de carga o conforme a las instrucciones del docente Dr. Erasmo.	\N	2026-07-18 07:06:17.976235+00
179	10	fb42a92d-b85a-4718-a456-1b8953871eaa	archivado	El caso fue archivado.	{"nuevo_estado": "archivado", "estado_anterior": "activo"}	2026-07-21 13:46:37.67981+00
180	34	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-21 14:04:06.616208+00
181	34	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #34	\N	2026-07-21 14:04:06.793484+00
182	34	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #34	\N	2026-07-21 14:04:07.024819+00
183	35	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-21 15:12:46.3797+00
184	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #35	\N	2026-07-21 15:12:46.549603+00
185	35	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #35	\N	2026-07-21 15:12:46.706962+00
186	36	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-21 15:16:12.758955+00
187	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #36	\N	2026-07-21 15:16:12.898879+00
188	36	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #36	\N	2026-07-21 15:16:13.044137+00
189	21	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA entrevista .pdf'	\N	2026-07-21 15:20:58.881345+00
190	21	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 15:21:02.162557+00
191	21	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 15:21:05.684136+00
192	22	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 16-07-26 11.29_1.jpeg'	\N	2026-07-21 15:21:44.981687+00
193	22	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 16-07-26 11.29_2.jpeg'	\N	2026-07-21 15:21:49.778315+00
194	22	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 15:21:53.087911+00
195	22	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se clasifica como solo asesoría y se archiva	\N	2026-07-21 15:22:06.888603+00
196	22	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El caso fue cerrado.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 15:22:11.090562+00
197	19	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-21 15:23:47.409868+00
198	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '03_documento soporte CIUDADANO_SENTENCIA JUZGADO PASTO - NAR_01.pdf'	\N	2026-07-21 15:23:54.769507+00
199	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '04_documento soporte CIUDADANO_Anexo 01.pdf'	\N	2026-07-21 15:23:55.962964+00
200	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '05_CASO 019_PROYECCION DERECHO DE PETICION_v02.pdf'	\N	2026-07-21 15:24:00.926024+00
201	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Rechazó el documento '05_CASO 019_PROYECCION DERECHO DE PETICION_v02.pdf'	\N	2026-07-21 15:24:56.451958+00
202	27	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 15:28:34.875688+00
203	31	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 15:30:26.053346+00
204	31	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 15:30:29.385+00
205	28	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-3_compressed.pdf'	\N	2026-07-21 15:32:33.935526+00
206	28	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Usuaria que no es la titular del servicio por lo cual se clasifica solo como asesoría	\N	2026-07-21 15:33:07.689618+00
207	28	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 15:33:34.407714+00
208	28	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 15:33:43.630933+00
209	27	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 15:34:51.530474+00
210	27	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 15:34:56.606564+00
211	30	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 15:42:05.707628+00
212	30	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 21-07-26 10.39_1.jpeg'	\N	2026-07-21 15:42:38.705564+00
213	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102137324_MFNR.jpg'	\N	2026-07-21 16:09:37.919849+00
214	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102147076_MFNR.jpg'	\N	2026-07-21 16:14:32.417224+00
215	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 16:14:37.451615+00
216	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Rechazó el documento 'DERECHO DE PETICION v05.pdf'	\N	2026-07-21 16:14:38.88168+00
217	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102155102_MFNR.jpg'	\N	2026-07-21 16:14:59.676373+00
218	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102203207_MFNR.jpg'	\N	2026-07-21 16:15:19.40237+00
219	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102210117_MFNR.jpg'	\N	2026-07-21 16:15:26.647026+00
220	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102227041_MFNR.jpg'	\N	2026-07-21 16:15:34.008954+00
221	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102233562_MFNR.jpg'	\N	2026-07-21 16:15:41.144927+00
222	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102240068_MFNR.jpg'	\N	2026-07-21 16:15:48.115613+00
223	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_102248842_MFNR.jpg'	\N	2026-07-21 16:15:54.550915+00
224	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100827150_MFNR.jpg'	\N	2026-07-21 16:16:02.669765+00
225	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100836024_MFNR.jpg'	\N	2026-07-21 16:16:30.995734+00
226	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103643446_MFNR.jpg'	\N	2026-07-21 16:16:38.648117+00
227	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100842845_MFNR.jpg'	\N	2026-07-21 16:16:52.550166+00
228	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_103648627_MFNR.jpg'	\N	2026-07-21 16:17:05.406754+00
229	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100849756_MFNR.jpg'	\N	2026-07-21 16:17:11.369226+00
230	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100856653_MFNR.jpg'	\N	2026-07-21 16:17:17.888578+00
231	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100906442_MFNR.jpg'	\N	2026-07-21 16:17:25.950437+00
232	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100913908_MFNR.jpg'	\N	2026-07-21 16:17:33.680061+00
233	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'IMG_20260714_100919694_MFNR.jpg'	\N	2026-07-21 16:17:44.310094+00
234	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '01_DOCUMENTOS DE SOPORTE USUARIO.pdf'	\N	2026-07-21 16:17:51.762561+00
235	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '01_correccion_DOCUMENTOS DE SOPORTE USUARIO.pdf'	\N	2026-07-21 16:18:00.381258+00
236	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '02_RELACION PAGOS IMPUESTO PREDIAL.pdf'	\N	2026-07-21 16:18:07.009203+00
237	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Rechazó el documento 'DERECHO DE PETICION v03.pdf'	\N	2026-07-21 16:18:13.853422+00
238	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '03_CORRECCION DOCUMENTOS DE SOPORTE PAGOS.pdf'	\N	2026-07-21 16:18:23.562478+00
239	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Rechazó el documento '04_RELACION PAGOS IMPUESTO PREDIAL.pdf'	\N	2026-07-21 16:18:30.492408+00
240	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 16:18:33.415391+00
241	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '04_RELACION PAGOS IMPUESTO PREDIAL.pdf'	\N	2026-07-21 16:18:38.05075+00
242	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '003_2021_10_27_ESTADO DE CUENTA_Recibo No 21010310233448.pdf'	\N	2026-07-21 16:18:43.739669+00
243	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '004_2025_03_04_ESTADO DE CUENTA_Recibo No 25010310094348.pdf'	\N	2026-07-21 16:18:51.964864+00
244	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '005_2025_03_05_CERTIFICADO DE TRADICION.pdf'	\N	2026-07-21 16:18:59.773662+00
245	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '006_2024_04_24_DERECHO PETICION_PRESCRIPCION IMPUESTO PREDIAL.pdf'	\N	2026-07-21 16:19:05.112917+00
246	27	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'IMG_1337.jpeg'	\N	2026-07-21 16:20:32.110513+00
247	27	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'IMG_1338.jpeg'	\N	2026-07-21 16:20:41.136494+00
248	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 21-07-26 11.11.pdf'	\N	2026-07-21 16:20:44.538498+00
249	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 16:21:40.460034+00
250	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El pasado viernes 17 de julio de 2026, se le hace solicitud al señor Alberto de dos documentos importantes para determinar la trazabilidad del proceso (a criterio de la estudiante) \n1. Certificado de Cámara de Comercio de la empresa a la que se realiza la reclamación y \n2. Los extractos de la cuenta de ahorros del usuario, en los que se puede evidenciar los pagos realizados por la empresa accionada, desde el año 2010, hasta la fecha de su retiro de actividades.	\N	2026-07-21 16:22:42.60289+00
251	30	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 21-07-26 10.39_1.jpeg'	\N	2026-07-21 16:25:42.4408+00
252	30	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 16:25:46.888939+00
253	30	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se archiva como solo asesoría	\N	2026-07-21 16:25:59.527127+00
254	30	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 16:26:04.59543+00
255	35	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 16:26:43.431764+00
256	35	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 21-07-26 11.11.pdf'	\N	2026-07-21 16:26:47.886675+00
257	35	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se clasifica como solo asesoría y se archiva	\N	2026-07-21 16:30:22.403779+00
258	35	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 16:30:23.133857+00
259	36	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 16:31:43.707706+00
260	36	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Al tratarse de un asunto civil se clasifica como solo asesoría	\N	2026-07-21 16:32:00.455115+00
261	36	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 16:32:04.50695+00
262	32	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 16:32:31.338918+00
263	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 16:33:59.854163+00
264	32	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se trata de un asunto laboral, no se tiene rote de laboral, la atención se debe prestar como solo asesoría ya que el asunto no se puede tramitar, por lo que el usuario debe acudir a partir del 10 de agosto al consultorio, fecha en la cual se podrá prestar el servicio, Amparo, abstenerse de realizar acciones de manera independiente, ya que esto puede ocasionar sanciones en materia disciplinaria, la instrucción fue clara respecto de la indicación que se debía realizar al usuario sobre la imposibilidad de prestar el servicio referido. \n\nComunicarse con el usuario, abstenerse de recibir documentación y aclararle que el consultorio no puede prestar el servicio en el momento y debe volver el 10 de agosto.	\N	2026-07-21 16:37:21.871799+00
265	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 17-07-26 11.43.pdf'	\N	2026-07-21 16:38:15.989393+00
266	29	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-21 16:41:43.071928+00
267	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 17-07-26 11.52.pdf'	\N	2026-07-21 16:42:20.782687+00
268	29	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Consultorio jurídico, no cuenta actualmente con el servicio requerido, se clasifica como solo asesoría y se informa al usuario que debe volver a partir del 10 de agosto.	\N	2026-07-21 16:43:59.295902+00
269	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 21-07-26 11.11.pdf'	\N	2026-07-21 16:44:01.9888+00
270	29	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 21-07-26 11.11.pdf'	\N	2026-07-21 16:45:16.541002+00
271	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 17-07-26 11.52 (1).pdf'	\N	2026-07-21 16:45:22.948928+00
272	29	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 17-07-26 11.52.pdf'	\N	2026-07-21 16:45:23.681795+00
273	29	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 17-07-26 11.52 (1).pdf'	\N	2026-07-21 16:45:32.127572+00
274	29	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-21 16:45:40.169031+00
275	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento 'DOCUMENTOS DE SOPORTE CASO 32 - ENTREVISTA_V01.pdf'	\N	2026-07-21 16:46:36.843603+00
276	32	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Archivó el documento 'DOCUMENTOS DE SOPORTE CASO 32 - ENTREVISTA_V01.pdf'	\N	2026-07-21 16:46:50.040882+00
277	20	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-21 17:31:51.215542+00
278	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	observacion	Muchas Gracias, Doctor Erasmo lo tendre encuenta.	\N	2026-07-21 17:48:22.014051+00
279	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	observacion	Tendre en cuenta.	\N	2026-07-21 17:49:34.948316+00
280	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #34	\N	2026-07-21 19:47:24.719783+00
281	9	1b35a5ec-c188-4e69-b68c-d37f158859e2	documento	Aprobó el documento 'CamScanner 17-07-26 11.41_1.jpeg'	\N	2026-07-21 19:51:01.162492+00
282	16	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #16	\N	2026-07-22 15:11:46.637963+00
283	37	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-22 15:14:47.011078+00
284	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #37	\N	2026-07-22 15:14:47.124122+00
285	37	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #37	\N	2026-07-22 15:14:47.271703+00
286	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 22-07-26 10.21.pdf'	\N	2026-07-22 15:22:45.104755+00
287	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Buenos días Dr. \nAl señor Alberto se le informó que el asunto por ser del área laboral, él debe presentarse el día 10 de agosto o cualquier otro día de esa fecha en adelante, para que se presente al Consultorio para continuar con el proceso asignado.	\N	2026-07-22 15:23:42.844405+00
288	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 22-07-26 10.27.pdf'	\N	2026-07-22 15:28:31.954665+00
289	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '02_DOCUMENTOS DE SOPORTE CASO 32 - ENTREVISTA_v02.pdf'	\N	2026-07-22 15:39:09.80149+00
290	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'ilovepdf_compressed.zip'	\N	2026-07-22 15:43:22.133339+00
291	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:02.113813+00
292	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:15.462299+00
293	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:26.006715+00
294	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:33.920808+00
295	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:47.978473+00
296	20	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-22 15:44:55.231493+00
297	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:44:57.034225+00
298	20	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-22 15:44:57.529143+00
299	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA.pdf'	\N	2026-07-22 15:45:02.182667+00
300	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:45:09.766745+00
301	16	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-22 15:45:23.535249+00
302	38	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-22 15:49:00.900512+00
303	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #38	\N	2026-07-22 15:49:01.04457+00
304	38	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #38	\N	2026-07-22 15:49:01.194076+00
305	39	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-22 15:57:20.948768+00
306	39	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #39	\N	2026-07-22 15:57:21.088818+00
307	39	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #39	\N	2026-07-22 15:57:21.213975+00
308	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-22 16:00:06.354372+00
309	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-.pdf'	\N	2026-07-22 16:00:23.415819+00
310	40	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-22 16:00:38.058588+00
311	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #40	\N	2026-07-22 16:00:38.217497+00
312	40	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #40	\N	2026-07-22 16:00:38.378157+00
313	39	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-22 16:10:31.191003+00
314	39	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'Doc juvenal tutela.pdf'	\N	2026-07-22 16:12:01.010535+00
315	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-22 16:19:57.581935+00
316	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.14_1.jpeg'	\N	2026-07-22 16:21:10.316699+00
317	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.14_2.jpeg'	\N	2026-07-22 16:21:16.179861+00
318	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-22 16:24:30.866972+00
319	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_1.jpeg'	\N	2026-07-22 16:25:14.051082+00
320	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_3.jpeg'	\N	2026-07-22 16:25:27.277053+00
321	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_4.jpeg'	\N	2026-07-22 16:25:36.096141+00
322	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_6.jpeg'	\N	2026-07-22 16:25:46.112094+00
323	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_7.jpeg'	\N	2026-07-22 16:25:54.918948+00
324	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 22-07-26 11.04_5.jpeg'	\N	2026-07-22 16:26:04.37182+00
325	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'Derecho de petición súper giros 1.pdf'	\N	2026-07-23 22:42:48.514251+00
326	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '007_DERECHO DE PETICION CARLOS ARTURO NOE ASTAIZA CC No 10522479_v02.pdf'	\N	2026-07-26 19:41:51.655883+00
327	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se carga a la plataforma, el documento de petición del señor Carlos Arturo Noé "007_DERECHO DE PETICION CARLOS ARTURO NOE ASTAIZA CC No 10522479_v02", con las correcciones solicitadas por el Docente a Cargo en cuanto a "corregir los fundamentos de derecho".	\N	2026-07-26 19:44:54.179981+00
328	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Para el día de mañana se hará entrega al señor Carlos Arturo Noé Astaiza de un CD que contiene la totalidad de los documentos que deberán anexarse a la radicación del Derecho de Petición en la Ventanilla Única de la Alcaldía Municipal de Popayán. Dichos documentos corresponden a los soportes documentales relacionados e identificados dentro del escrito de petición.\n\nEl medio digital contiene dos (2) carpetas magnéticas: (i) "01_ANEXOS-para entregar con derecho de petición", integrada por diecisiete (17) archivos correspondientes a los comprobantes de consignación, soportes bancarios y documentos relacionados con los pagos efectuados dentro del acuerdo de pago; y (ii) "02_ANEXOS-para entregar con derecho de petición", integrada por once (11) archivos correspondientes a los demás documentos soporte del expediente administrativo tributario.\n\nLos documentos contenidos en ambas carpetas corresponden a los soportes documentales relacionados en el Derecho de Petición, debidamente organizados para su radicación, conservando la misma identificación y orden documental descritos en el escrito de petición, y coinciden con los documentos registrados en la plataforma del Consultorio Jurídico. Así mismo, corresponden a los documentos aportados y puestos en conocimiento del Consultorio Jurídico por el usuario durante la atención del caso.	\N	2026-07-26 20:06:47.19464+00
329	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '06_DERECHO DE PETICION v03.pdf'	\N	2026-07-27 03:52:11.090597+00
330	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se carga el proyecto de derecho de petición "06_DERECHO DE PETICION v03.pdf" dirigido al Consejo Nacional Electoral – CNE, para revisión y aprobación por parte del asesor del Consultorio Jurídico, atendiendo las correcciones realizadas por él, el pasado 21 de julio de 2026, a las 10:27 a.m.	\N	2026-07-27 03:56:45.848619+00
331	34	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-27 13:53:31.305335+00
332	39	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-27 13:53:49.824891+00
333	40	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "en_tramite".	{"clasificacion": "en_tramite"}	2026-07-27 13:54:07.097099+00
334	37	bbde362e-ad70-445c-be8c-861b0e06052c	aprobacion	El asesor aprobó el caso con clasificación "solo_asesoria".	{"clasificacion": "solo_asesoria"}	2026-07-27 13:54:20.346775+00
335	37	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se archiva al remitirse a centro de conciliación.	\N	2026-07-27 13:54:43.787693+00
336	37	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.14_2.jpeg'	\N	2026-07-27 13:54:48.373083+00
337	37	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.14_1.jpeg'	\N	2026-07-27 13:54:52.033848+00
338	37	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-27 13:54:55.142818+00
339	9	bbde362e-ad70-445c-be8c-861b0e06052c	cierre	El asesor cerró el caso.	{"nuevo_estado": "cerrado", "estado_anterior": "activo"}	2026-07-27 13:55:32.825879+00
340	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'derecho de peticion .docx'	\N	2026-07-27 13:56:48.082104+00
341	39	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'Accion de tutela Juvenal.docx'	\N	2026-07-27 13:57:14.116514+00
342	11	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '007_DERECHO DE PETICION CARLOS ARTURO NOE ASTAIZA CC No 10522479_v02.pdf'	\N	2026-07-27 13:58:32.932361+00
343	19	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento '06_DERECHO DE PETICION v03.pdf'	\N	2026-07-27 14:00:07.074569+00
344	38	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Envió un recordatorio de documentos al estudiante	\N	2026-07-27 14:01:07.232838+00
345	36	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'ilovepdf_compressed.zip'	\N	2026-07-27 14:15:25.639199+00
346	36	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA.pdf'	\N	2026-07-27 14:15:29.773337+00
347	10	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'documento_bancario.pdf'	\N	2026-07-27 14:28:01.45772+00
348	10	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'FISCALIA_compressed.pdf'	\N	2026-07-27 14:28:08.016125+00
349	10	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA_compressed.pdf'	\N	2026-07-27 14:28:13.975867+00
401	48	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 15:08:08.227257+00
350	10	bbde362e-ad70-445c-be8c-861b0e06052c	observacion	Se recibe caso, para instaurar acción de protección al consumidor financiero, se informa al usuario que esta acción tiene como fin evidenciar que el banco al momento de aprobar las comprar realizadas, debió estudiar su perfil financiero y revisar si estos gastos correspondiente a su historial de gastos diario y mensual, el usuario refiere entender y aceptar, sin  embargo dos días después, se acerca a informa que es su deseo desistir del proceso y no continuar con el mismo, se informa al usuario las consecuencias de su decisión a lo cual refiere entender y aceptar, firma el desistimiento por lo cual se archiva el proceso.	\N	2026-07-27 14:32:48.877604+00
351	41	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-27 15:06:30.186361+00
352	41	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	asignacion	Estudiante asignado al caso #41	\N	2026-07-27 15:06:30.327379+00
353	41	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #41	\N	2026-07-27 15:06:30.475743+00
354	34	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Rechazó el documento 'derecho de peticion .docx'	\N	2026-07-27 15:11:02.320852+00
355	34	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-.pdf'	\N	2026-07-27 15:11:09.291551+00
356	42	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-27 15:14:25.02107+00
357	42	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #42	\N	2026-07-27 15:14:25.135241+00
358	42	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #42	\N	2026-07-27 15:14:25.276884+00
359	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_1.jpeg'	\N	2026-07-27 15:14:58.812568+00
360	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_3.jpeg'	\N	2026-07-27 15:15:06.009087+00
361	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_4.jpeg'	\N	2026-07-27 15:15:13.481551+00
362	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_6.jpeg'	\N	2026-07-27 15:15:23.593727+00
363	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_7.jpeg'	\N	2026-07-27 15:15:32.138947+00
364	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'CamScanner 22-07-26 11.04_5.jpeg'	\N	2026-07-27 15:15:37.491185+00
365	43	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-27 15:16:30.304688+00
366	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #43	\N	2026-07-27 15:16:30.424828+00
367	43	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #43	\N	2026-07-27 15:16:30.611833+00
368	40	bbde362e-ad70-445c-be8c-861b0e06052c	documento	Aprobó el documento 'Derecho de petición súper giros 1.pdf'	\N	2026-07-27 15:17:23.501217+00
369	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 15:44:51.889437+00
370	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 27-07-26 10.37_1.jpeg'	\N	2026-07-27 15:45:35.569319+00
371	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 27-07-26 10.37_2.jpeg'	\N	2026-07-27 15:45:42.461633+00
372	42	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 15:48:57.635071+00
373	42	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-27 15:51:19.635268+00
374	42	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-27 15:51:31.935434+00
375	44	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-27 16:07:20.089385+00
376	44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #44	\N	2026-07-27 16:07:20.271373+00
377	44	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #44	\N	2026-07-27 16:07:20.447333+00
378	41	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 16:19:00.386348+00
379	41	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	documento	Subió el documento 'CamScanner 27-07-26 11.19.pdf'	\N	2026-07-27 16:26:11.951122+00
380	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 16:34:03.271471+00
381	33	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 16:49:57.747802+00
382	44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-27 21:32:51.242278+00
383	44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA ENTREVISTA .pdf'	\N	2026-07-27 21:36:56.941632+00
384	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'derecho de peticion maria- correción .docx'	\N	2026-07-27 22:07:14.200859+00
385	39	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'Copia de Tutela Juvenal.docx'	\N	2026-07-27 23:56:04.869884+00
386	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El día de ayer se presentó al señor Efraín el texto íntegro del proyecto de Derecho de Petición, conformado por nueve (9) folios y sus respectivos anexos, para su conocimiento y aprobación. Posteriormente, dichos documentos fueron remitidos por correo electrónico, junto con el documento soporte que se adjunta en la sección "Documentos", identificado con el nombre "07_ENTREGA DERECHO DE PETICIÓN 27 DE JULIO 2026 PARA CONSEJO NACIONAL ELECTORAL.pdf".	\N	2026-07-28 13:39:46.260984+00
387	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '07_ENTREGA DERECHO DE PETICIÓN 27 DE JULIO 2026 PARA CONSEJO NACIONAL ELECTORAL.pdf'	\N	2026-07-28 13:40:30.344728+00
388	45	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 13:53:23.016618+00
389	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #45	\N	2026-07-28 13:53:23.167346+00
390	45	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #45	\N	2026-07-28 13:53:23.38948+00
391	46	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 14:31:25.257037+00
392	46	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #46	\N	2026-07-28 14:31:25.410685+00
393	46	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #46	\N	2026-07-28 14:31:25.571973+00
394	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-28 14:54:39.753601+00
395	47	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 14:56:59.994005+00
396	47	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	asignacion	Estudiante asignado al caso #47	\N	2026-07-28 14:57:00.137217+00
397	47	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #47	\N	2026-07-28 14:57:00.296229+00
398	46	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-28 15:05:06.746551+00
399	46	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-28 15:06:40.413037+00
400	46	8a923944-1c53-4584-94c1-f72c0848d04b	documento	Subió el documento 'image.jpg'	\N	2026-07-28 15:06:55.699126+00
402	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	asignacion	Estudiante asignado al caso #48	\N	2026-07-28 15:08:08.3655+00
403	48	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #48	\N	2026-07-28 15:08:08.494601+00
404	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Aclaración:  en el numeral 4 me equivoqué al diligenciar la información en el teclado y el año de la audiencia es el 2026, y no como escribí en el texto del "Resumen de los hechos". "4. Que a razón de la solicitud de prescripción del comparendo, que se realizó en el año 2026, recibió una citación a Audiencia Pública en la Inspección Cuarta de Policía de Popayán para el día 5 de agosto de 2020, a las 09:00 am."	\N	2026-07-28 15:09:11.874923+00
405	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '01_FORMATO DE ENTREVISTA CONSULTORIO JURIDICO_20260728_101040772_MFNR.pdf'	\N	2026-07-28 15:21:57.106791+00
406	9	fb42a92d-b85a-4718-a456-1b8953871eaa	archivado	El profesional de apoyo archivó el caso como paso final.	{"nuevo_estado": "archivado", "estado_anterior": "cerrado"}	2026-07-28 15:28:51.188187+00
407	49	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 15:32:01.959287+00
408	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	asignacion	Estudiante asignado al caso #49	\N	2026-07-28 15:32:02.136763+00
409	49	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #49	\N	2026-07-28 15:32:02.390789+00
410	50	fb42a92d-b85a-4718-a456-1b8953871eaa	creacion	Caso creado en área no_asignada con estado en_proceso.	{"area": "no_asignada", "estado": "en_proceso"}	2026-07-28 15:34:08.211266+00
411	50	8a923944-1c53-4584-94c1-f72c0848d04b	asignacion	Estudiante asignado al caso #50	\N	2026-07-28 15:34:08.383224+00
412	50	bbde362e-ad70-445c-be8c-861b0e06052c	asignacion	Asesor asignado al caso #50	\N	2026-07-28 15:34:08.514042+00
413	47	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-28 15:46:07.945604+00
414	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-28 15:49:51.311643+00
415	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 28-07-26 10.50_1.jpeg'	\N	2026-07-28 15:51:24.445581+00
416	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	documento	Subió el documento 'CamScanner 28-07-26 10.50_2.jpeg'	\N	2026-07-28 15:51:30.186339+00
417	47	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-3.pdf'	\N	2026-07-28 15:59:29.953177+00
418	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-28 16:24:53.313426+00
419	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '01_CASO #38_CHAMIZO MEDINA_IMG_20260728_081843966_MFNR.pdf'	\N	2026-07-29 13:42:44.670609+00
420	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	El formato de entrevista se encuentra sin la firma del Docente Asesor, porque se encuentra con "Incapacidad", tan pronto se reintegre presento el documento al docente para su revisión y aprobación y lo cargo a la plataforma.	\N	2026-07-29 13:44:20.310411+00
421	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '01_CASO #49_LUZ ESNEILA DIAZ BUITRON_20260728_113903456_MFNR.pdf'	\N	2026-07-29 14:01:12.880122+00
422	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se deja constancia de que el formato de entrevista diligenciado con la usuaria fue escaneado y cargado en la plataforma sin la firma del docente asesor, debido a la incapacidad médica que actualmente presenta el Dr. Erasmo Paredes. Una vez se reincorpore a sus funciones, el documento será sometido a su revisión, aprobación y firma, con el fin de incorporar posteriormente a la plataforma la versión debidamente suscrita.	\N	2026-07-29 14:28:35.792509+00
423	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se deja constancia de que el formato de entrevista diligenciado con la usuaria fue escaneado y cargado en la plataforma sin la firma del docente asesor, debido a la incapacidad médica que actualmente presenta el Dr. Erasmo Paredes. Una vez se reincorpore a sus funciones, el documento será sometido a su revisión, aprobación y firma, con el fin de incorporar posteriormente a la plataforma la versión debidamente suscrita.	\N	2026-07-29 14:29:27.902997+00
424	50	8a923944-1c53-4584-94c1-f72c0848d04b	entrevista	El estudiante completó la entrevista y envió el caso para aprobación del asesor.	\N	2026-07-29 16:00:41.090113+00
425	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Durante la mañana del día de hoy se realizó contacto telefónico con el usuario, con el fin de efectuar seguimiento a la gestión encomendada. En la comunicación, el usuario informó que el Derecho de Petición ya fue remitido al Consejo Nacional Electoral (CNE). Así mismo, manifestó que, una vez llegue a su residencia, enviará al correo electrónico del Consultorio Jurídico el soporte de la remisión, con el propósito de incorporarlo al expediente del caso.	\N	2026-07-29 16:04:23.079086+00
426	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se deja constancia de que el señor Carlos Arturo Noé Astaiza informó telefónicamente que el Derecho de Petición elaborado en el marco del presente caso fue radicado ante la Alcaldía Municipal de Popayán, entidad que asignó el correspondiente número de radicado, acreditando con ello la recepción formal de la solicitud por parte de la administración municipal. No obstante, a la fecha de la presente anotación, el usuario no ha hecho entrega al Consultorio Jurídico de la copia del documento con el sello o constancia oficial de radicación, razón por la cual no ha sido posible incorporarla al expediente físico del caso ni al archivo documental correspondiente. En consecuencia, esta actuación se registra con fundamento en la información suministrada directamente por el usuario, quedando pendiente la incorporación del soporte de radicación una vez sea aportado al Consultorio Jurídico, con el fin de mantener la integridad, trazabilidad y completitud del expediente.	\N	2026-07-29 16:28:38.718141+00
427	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '01_CASO #019_CARLOS ARTURO NOE_RECIBIDO VU_ALCALDIA POPAYAN_20260729_100513720_MFNR.pdf'	\N	2026-07-29 16:33:19.649581+00
428	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '008_CASO #011_CARLOS ARTURO NOE_RECIBIDO VU_ALCALDIA POPAYAN_20260729_100513720_MFNR.pdf'	\N	2026-07-29 16:37:56.480992+00
429	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	documento	Subió el documento '08_RADICADO DERECHO PETICION_PQRS CNE-E-DG-2026-027753 - 27 julio 2026.pdf'	\N	2026-07-30 12:49:18.029525+00
430	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	observacion	Se realizó seguimiento al presente caso mediante comunicación telefónica con el usuario, con el propósito de verificar el cumplimiento de las instrucciones impartidas por el Consultorio Jurídico respecto de la radicación del Derecho de Petición ante el Consejo Nacional Electoral (CNE). Durante la llamada se solicitó el envío del soporte de la radicación, el cual fue remitido posteriormente por el usuario al correo institucional del Consultorio Jurídico. Conforme se evidencia en el documento cargado al expediente con el nombre "08_RADICADO DERECHO PETICION_PQRS CNE-E-DG-2026-027753 - 27 julio 2026", la solicitud fue registrada satisfactoriamente bajo el radicado No. CNE-E-DG-2026-027753, de fecha 27 de julio de 2026. En consecuencia, dicho soporte fue incorporado al expediente digital del caso para los fines correspondientes.	\N	2026-07-30 12:54:04.064932+00
431	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'Derecho De Petición Firmado.pdf'	\N	2026-07-30 15:51:28.177043+00
432	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	documento	Subió el documento 'Archivo Del Derecho De Petición.pdf'	\N	2026-07-30 15:51:38.406889+00
\.


--
-- Data for Name: contratos_laborales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."contratos_laborales" ("id_contrato", "id_usuario", "tipo_contrato", "representante_legal", "correo_patrono", "direccion_empresa", "fecha_inicio", "fecha_fin", "continua", "salario_inicial", "salario_actual") FROM stdin;
1	9bc43727-83dd-4b09-bf69-85c9c83b69a4	\N	\N	\N	\N	\N	\N	f	\N	\N
2	9bc43727-83dd-4b09-bf69-85c9c83b69a4	\N	\N	\N	\N	\N	\N	f	\N	\N
3	eb0d1b5f-1ea1-42de-9575-efc8c311ce46	escrito	Secretaria de Educación Municipal	\N	\N	\N	\N	f	\N	\N
4	47244b0a-a1ea-4473-8df6-3ee2244520fe	escrito	\N	\N	\N	\N	\N	f	\N	\N
5	47244b0a-a1ea-4473-8df6-3ee2244520fe	escrito	\N	\N	\N	\N	\N	f	\N	\N
\.


--
-- Data for Name: demandados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."demandados" ("id_demandado", "id_caso", "nombre_completo", "documento", "celular", "lugar_residencia", "correo") FROM stdin;
1	1	No hay accionado	\N	\N	\N	\N
2	1	No hay accionado	\N	\N	\N	\N
3	2	Elmer Orlando Vidal Palacios	10532453	\N	\N	\N
4	3	Colpensiones	Nit 900.336.004-7	\N	\N	\N
5	3	Colpensiones	Nit 900.336.004-7	\N	\N	\N
6	32	Comercializadora GILZA del Cauca S.A.S	900152290	\N	Popayán	\N
7	39	Alcaldía municipal de popayan 	891580006	\N	Alcaldía municipal de popayan 	\N
8	37	Daniel José Bucheli Velasco	\N	3122225163	\N	\N
9	40	Supergiros Bellavista 	\N	\N	calle 63 63-19 salón comunal bella vista	\N
10	38	Ana Teresa Medina Chantre	\N	\N	Vereda Los Tendidos	\N
11	33	COMERCIALIZADORA GILZA DEL CAUCA S.A.S	900152290	3122439343	\N	\N
12	49	Andrés Fernando Girón Cruz	10293303	3246741319	Cali - Valle	\N
\.


--
-- Data for Name: documentos_caso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."documentos_caso" ("id", "id_caso", "id_usuario", "storage_path", "nombre_original", "tipo", "mime_type", "tamano", "created_at", "updated_at", "estado", "estado_doc") FROM stdin;
2	12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	12/771d33ad-b868-4b1d-a1cc-4d4918f9a3a4.pdf	CamScanner 9-07-26 11.15.pdf	documento	application/pdf	1786321	2026-07-09 16:17:26.318441+00	\N	activo	pendiente
3	8	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	8/dbe716c6-25a7-43cc-978c-d5fa47c1f381.pdf	CamScanner 9-07-26 11.25.pdf	documento	application/pdf	3218750	2026-07-09 16:28:41.207654+00	\N	activo	pendiente
7	15	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	15/258ecc9b-aa29-4c3a-9fa9-ce24c7187edc.pdf	CamScanner 10-07-26 11.07.pdf	documento	application/pdf	1943644	2026-07-10 16:09:59.951969+00	\N	activo	pendiente
8	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	16/2c8e94a4-2c09-4cc7-9c36-eaa79a326381.jpeg	CamScanner 10-07-26 11.11_2.jpeg	documento	image/jpeg	938219	2026-07-10 16:13:02.695393+00	\N	activo	pendiente
9	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	16/7a1569b3-8193-4daa-a51d-ad6a9c34b6ed.jpeg	CamScanner 10-07-26 11.11_2.jpeg	documento	image/jpeg	938219	2026-07-10 16:13:27.519679+00	\N	activo	pendiente
10	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	16/5ba51a94-4874-4a5a-825e-ceae2cfbcc7e.jpeg	CamScanner 10-07-26 11.11_1.jpeg	documento	image/jpeg	981006	2026-07-10 16:13:48.405885+00	\N	activo	pendiente
11	14	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	14/7c1af02b-62d8-4b64-a018-fca85dfd4f98.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-1_compressed.pdf	documento	application/pdf	1242740	2026-07-10 16:30:40.825022+00	\N	activo	pendiente
12	17	8a923944-1c53-4584-94c1-f72c0848d04b	17/0394249e-27b0-4479-a6d7-66c5fa14021a.jpg	image.jpg	documento	image/jpeg	4042450	2026-07-10 16:44:18.488879+00	\N	activo	pendiente
14	17	8a923944-1c53-4584-94c1-f72c0848d04b	17/b49da9c9-0ad5-4fee-a9a3-51160345a334.jpg	image.jpg	documento	image/jpeg	3781427	2026-07-10 16:44:30.743896+00	\N	activo	pendiente
35	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/4dcc6e55-96ef-45ea-8303-396bbc723c69.jpg	IMG_20260714_112916206_MFNR.jpg	documento	image/jpeg	2778415	2026-07-14 16:31:02.14582+00	2026-07-17 15:39:31.4+00	activo	aprobado
36	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/a491d8c8-9fb0-48ed-9487-46b95c38c39a.jpg	IMG_20260714_112929074_MFNR.jpg	documento	image/jpeg	2329382	2026-07-14 16:31:10.310858+00	2026-07-17 15:39:39.393+00	activo	aprobado
37	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/86424faa-78bc-4130-ab6d-ecf1ca99c3ad.jpg	IMG_20260714_103602827_MFNR.jpg	documento	image/jpeg	2192347	2026-07-14 16:31:31.260947+00	2026-07-17 15:39:47.741+00	activo	aprobado
38	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/3cb664e9-a2a5-4281-a4c2-40e8de95fd5c.jpg	IMG_20260714_103609344_MFNR.jpg	documento	image/jpeg	2040685	2026-07-14 16:31:41.548515+00	2026-07-17 15:39:56.984+00	activo	aprobado
39	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/297fe06c-0010-4ea8-92d8-9162ed1726c7.jpg	IMG_20260714_103614036_MFNR.jpg	documento	image/jpeg	2155861	2026-07-14 16:31:59.840367+00	2026-07-17 15:40:04.507+00	activo	aprobado
1	5	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5/05018721-8d01-4655-bd2e-2533301bfb80.pdf	CamScanner 8-07-26 11.01.pdf	documento	application/pdf	1461824	2026-07-08 16:04:26.91953+00	2026-07-17 15:41:41.913+00	activo	aprobado
13	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	9/30bd97d5-9632-4872-92c5-8ff3e25c7103.docx	Derecho de Petición fiscalía 1.docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	24359	2026-07-10 16:44:26.265965+00	2026-07-17 15:42:16.515+00	activo	aprobado
15	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/4c264e37-7380-4c0e-b4b8-9ddf23ddafac.jpg	IMG_20260714_102137324_MFNR.jpg	documento	image/jpeg	2739148	2026-07-14 15:27:08.567019+00	2026-07-21 16:09:36.955+00	activo	aprobado
16	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/5e460dcb-e2c7-4931-a3f8-1a15341750d6.jpg	IMG_20260714_102147076_MFNR.jpg	documento	image/jpeg	2990648	2026-07-14 15:27:22.239265+00	2026-07-21 16:14:31.942+00	activo	aprobado
17	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/368c606c-1683-417f-bbaa-78e705d5b038.jpg	IMG_20260714_102155102_MFNR.jpg	documento	image/jpeg	2005540	2026-07-14 15:27:34.621876+00	2026-07-21 16:14:59.159+00	activo	aprobado
18	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/c83e9188-eae1-40ef-8193-5fa016535be4.jpg	IMG_20260714_102203207_MFNR.jpg	documento	image/jpeg	2457539	2026-07-14 15:28:35.967569+00	2026-07-21 16:15:18.487+00	activo	aprobado
19	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/be13afd7-0898-40d6-a488-f8157d75d3d4.jpg	IMG_20260714_102210117_MFNR.jpg	documento	image/jpeg	2250481	2026-07-14 15:28:53.057446+00	2026-07-21 16:15:26.199+00	activo	aprobado
20	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/757d9485-4ff6-472e-ae31-4cf4c1ed6197.jpg	IMG_20260714_102227041_MFNR.jpg	documento	image/jpeg	2237587	2026-07-14 15:29:06.776244+00	2026-07-21 16:15:33.466+00	activo	aprobado
21	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/800448e3-654b-40fb-af86-cda963c4b732.jpg	IMG_20260714_102233562_MFNR.jpg	documento	image/jpeg	2349645	2026-07-14 15:29:16.208812+00	2026-07-21 16:15:40.685+00	activo	aprobado
22	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/11273e60-260b-42c4-9f52-2deaa57375c4.jpg	IMG_20260714_102240068_MFNR.jpg	documento	image/jpeg	2453620	2026-07-14 15:29:25.932407+00	2026-07-21 16:15:47.657+00	activo	aprobado
23	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/2459d1d9-f0ee-4e44-a75c-70f70cf562e3.jpg	IMG_20260714_102248842_MFNR.jpg	documento	image/jpeg	2325016	2026-07-14 15:29:33.462995+00	2026-07-21 16:15:54.049+00	activo	aprobado
24	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/97948694-c3c7-442c-b8e7-e316e9759608.jpg	IMG_20260714_100827150_MFNR.jpg	documento	image/jpeg	3032496	2026-07-14 15:30:39.93454+00	2026-07-21 16:16:02.272+00	activo	aprobado
25	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/c6b98f3b-062a-4f1c-969e-96560fd6a5bd.jpg	IMG_20260714_100836024_MFNR.jpg	documento	image/jpeg	1588542	2026-07-14 15:30:57.139106+00	2026-07-21 16:16:30.273+00	activo	aprobado
26	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/502265ad-2282-4c3c-81d1-0f1658c44399.jpg	IMG_20260714_103643446_MFNR.jpg	documento	image/jpeg	2331820	2026-07-14 16:21:23.648611+00	2026-07-21 16:16:38.258+00	activo	aprobado
27	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/b7bf8e0b-662d-444e-8552-f0f88a463f7a.jpg	IMG_20260714_100842845_MFNR.jpg	documento	image/jpeg	3191213	2026-07-14 16:22:27.137496+00	2026-07-21 16:16:52.166+00	activo	aprobado
28	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/63f3e24d-48bf-4fc2-801a-874c8c268cc8.jpg	IMG_20260714_103648627_MFNR.jpg	documento	image/jpeg	2281003	2026-07-14 16:22:36.940188+00	2026-07-21 16:17:04.997+00	activo	aprobado
29	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/6205ab0a-77c0-4270-937c-f4072e619162.jpg	IMG_20260714_100849756_MFNR.jpg	documento	image/jpeg	2931175	2026-07-14 16:26:49.990554+00	2026-07-21 16:17:10.974+00	activo	aprobado
30	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/6518745f-53c5-4085-9f74-a5ce57c0c824.jpg	IMG_20260714_100856653_MFNR.jpg	documento	image/jpeg	3141239	2026-07-14 16:27:10.120151+00	2026-07-21 16:17:17.437+00	activo	aprobado
31	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/b24d04c6-f6f2-49d1-af67-e6563b861551.jpg	IMG_20260714_100906442_MFNR.jpg	documento	image/jpeg	2801690	2026-07-14 16:27:28.458774+00	2026-07-21 16:17:25.578+00	activo	aprobado
32	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/df1bf778-0712-40b6-a8f6-459a250345b2.jpg	IMG_20260714_100913908_MFNR.jpg	documento	image/jpeg	2912687	2026-07-14 16:27:46.780563+00	2026-07-21 16:17:33.116+00	activo	aprobado
33	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/98516022-335c-4156-b978-82b9887f069c.jpg	IMG_20260714_100919694_MFNR.jpg	documento	image/jpeg	2538266	2026-07-14 16:28:09.626811+00	2026-07-21 16:17:43.77+00	activo	aprobado
6	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10/0ed8b00b-b76b-45e7-b4d0-79debca801be.pdf	documento_bancario.pdf	documento	application/pdf	2405758	2026-07-10 01:05:07.832196+00	2026-07-27 14:28:00.857+00	activo	aprobado
5	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10/cc20d58d-f05a-47a0-8687-2090448bceef.pdf	FISCALIA_compressed.pdf	documento	application/pdf	1330271	2026-07-10 00:20:49.658863+00	2026-07-27 14:28:07.499+00	activo	aprobado
4	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10/bf074c2f-7822-4a8f-a04d-ea4424749471.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA_compressed.pdf	documento	application/pdf	771846	2026-07-10 00:20:20.161538+00	2026-07-27 14:28:13.515+00	activo	aprobado
54	20	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	20/2def3d1d-661e-4a0d-97f7-e20976c69c80.pdf	CamScanner 16-07-26 10.56.pdf	documento	application/pdf	1755564	2026-07-16 15:58:13.532894+00	\N	activo	pendiente
59	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/dcc931c2-3b8e-4542-9bc3-4c3d0bf45b79.pdf	02_copia cedula.pdf	documento	application/pdf	69331	2026-07-16 21:01:23.092178+00	\N	activo	pendiente
34	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/b4e22bfd-687a-49c3-b6cd-20e1d2b26d28.jpg	IMG_20260714_112901857_MFNR.jpg	documento	image/jpeg	2884207	2026-07-14 16:30:50.947354+00	2026-07-17 15:39:21.617+00	activo	aprobado
40	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/48ad9395-21e1-41c0-ac06-c54b0744d353.jpg	IMG_20260714_103618840_MFNR.jpg	documento	image/jpeg	2337480	2026-07-14 16:32:14.059834+00	2026-07-17 15:40:11.292+00	activo	aprobado
41	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/3b893017-77b5-452d-8e27-955e0886bb2b.jpg	IMG_20260714_103624098_MFNR.jpg	documento	image/jpeg	2578915	2026-07-14 16:32:31.143682+00	2026-07-17 15:40:30.099+00	activo	aprobado
42	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/a97bbc88-928e-4442-85c7-419fe1e4fdd6.jpg	IMG_20260714_103631184_MFNR.jpg	documento	image/jpeg	2436560	2026-07-14 16:32:46.576281+00	2026-07-17 15:40:37.216+00	activo	aprobado
43	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/75c8dc55-827f-44b5-8537-844c09499b23.jpg	IMG_20260714_103637076_MFNR.jpg	documento	image/jpeg	2188322	2026-07-14 16:33:05.288564+00	2026-07-17 15:40:50.635+00	activo	aprobado
44	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/9db71e68-eb79-45cd-8a7e-435784dd72b9.jpg	IMG_20260714_103643446_MFNR.jpg	documento	image/jpeg	2331820	2026-07-14 16:33:17.380969+00	2026-07-17 15:40:57.446+00	activo	aprobado
45	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/a550e391-8f85-4b07-b43c-d776c28da2f8.jpg	IMG_20260714_103648627_MFNR.jpg	documento	image/jpeg	2281003	2026-07-14 16:33:32.595965+00	2026-07-17 15:41:03.852+00	activo	aprobado
46	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/ccc786e4-2417-47e9-8f95-016897cc2541.jpg	IMG_20260714_103656714_MFNR.jpg	documento	image/jpeg	1969493	2026-07-14 16:33:47.215861+00	2026-07-17 15:41:09.822+00	activo	aprobado
47	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/215c27ba-551e-4187-b441-c4284870aa2d.jpg	IMG_20260714_103715716_MFNR.jpg	documento	image/jpeg	2354582	2026-07-14 16:34:03.512707+00	2026-07-17 15:41:14.573+00	activo	aprobado
48	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/f5c95fe9-424a-4cdb-a4ef-24e5c1cdad1d.jpg	IMG_20260714_112901857_MFNR.jpg	documento	image/jpeg	2884207	2026-07-14 16:34:21.725376+00	2026-07-17 15:41:19.922+00	activo	aprobado
58	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/6aff3589-cfcf-4c56-9252-e7f973b231d0.pdf	01_Formato Consultorio Juridico III_CASO 019.pdf	documento	application/pdf	378333	2026-07-16 21:01:12.690267+00	2026-07-17 15:41:24.95+00	activo	aprobado
49	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	9/4a8b47f0-9fb6-42cf-a9a6-9e28743ab6a3.docx	Derecho de petición fiscalía CORREGIDO.docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	18801314	2026-07-14 22:31:09.545134+00	2026-07-17 15:42:12.797+00	activo	aprobado
64	31	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	31/b5d361fd-395a-4b1f-9f97-c013550670a0.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-2 anaya compressed.pdf	documento	application/pdf	773204	2026-07-17 19:03:27.705262+00	\N	activo	pendiente
57	21	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	21/4af0cc2d-686f-4bef-ae96-a037cfae6166.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA entrevista .pdf	documento	application/pdf	798341	2026-07-16 20:43:20.398798+00	2026-07-21 15:20:58.01+00	activo	aprobado
55	22	ece5557b-c859-4da3-bd35-f1d2b3beb586	22/b22644bb-501e-4c63-8bef-a9233284610b.jpeg	CamScanner 16-07-26 11.29_1.jpeg	documento	image/jpeg	901173	2026-07-16 16:38:07.819312+00	2026-07-21 15:21:44.464+00	activo	aprobado
56	22	ece5557b-c859-4da3-bd35-f1d2b3beb586	22/c0ef5995-02d0-439f-a201-000daa2c9294.jpeg	CamScanner 16-07-26 11.29_2.jpeg	documento	image/jpeg	1001623	2026-07-16 16:38:14.766001+00	2026-07-21 15:21:49.256+00	activo	aprobado
60	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/2ce3d112-a123-426f-908f-fa3d59a2716f.pdf	03_documento soporte CIUDADANO_SENTENCIA JUZGADO PASTO - NAR_01.pdf	documento	application/pdf	973957	2026-07-16 21:01:31.120664+00	2026-07-21 15:23:54.071+00	activo	aprobado
61	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/8e964813-b894-4be7-8405-94b09cf98bff.pdf	04_documento soporte CIUDADANO_Anexo 01.pdf	documento	application/pdf	111168	2026-07-16 21:01:40.657842+00	2026-07-21 15:23:55.527+00	activo	aprobado
65	28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	28/f83e27c9-85b2-49a4-bf3c-b708bba66b43.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-3_compressed.pdf	documento	application/pdf	718620	2026-07-17 19:04:11.780933+00	2026-07-21 15:32:30.632+00	activo	aprobado
62	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/dbf9fa7c-67c0-46ab-8485-03d4ce316b57.pdf	05_CASO 019_PROYECCION DERECHO DE PETICION_v02.pdf	documento	application/pdf	36659	2026-07-16 23:22:11.168059+00	2026-07-21 15:24:56.009+00	activo	rechazado
68	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/53477ce6-09f8-4bcb-9f86-0a9f4a170097.pdf	DERECHO DE PETICION v05.pdf	documento	application/pdf	265119	2026-07-18 06:51:44.768881+00	2026-07-21 16:14:38.418+00	activo	rechazado
50	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/e4d61fa2-53ef-4357-a48d-75a5fcbb1aa0.pdf	01_DOCUMENTOS DE SOPORTE USUARIO.pdf	documento	application/pdf	1987757	2026-07-15 14:55:37.220132+00	2026-07-21 16:17:51.347+00	activo	aprobado
51	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/e0b8f279-5ad0-45de-9948-d2c7b52fdc0b.pdf	01_correccion_DOCUMENTOS DE SOPORTE USUARIO.pdf	documento	application/pdf	1987763	2026-07-15 15:30:46.97211+00	2026-07-21 16:17:59.914+00	activo	aprobado
52	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/995b535c-590e-4a9c-9cdb-46a31ccf6da9.pdf	02_RELACION PAGOS IMPUESTO PREDIAL.pdf	documento	application/pdf	116375	2026-07-15 16:40:46.276916+00	2026-07-21 16:18:06.628+00	activo	aprobado
53	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/b84b1812-7ca2-4d7d-a7c2-432ab82d8be4.pdf	DERECHO DE PETICION v03.pdf	documento	application/pdf	221444	2026-07-16 02:27:28.624796+00	2026-07-21 16:18:13.454+00	activo	rechazado
66	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/0d28c0cc-8280-4fcc-a0fb-56efcce9e0de.pdf	03_CORRECCION DOCUMENTOS DE SOPORTE PAGOS.pdf	documento	application/pdf	2524124	2026-07-18 02:23:43.419387+00	2026-07-21 16:18:22.966+00	activo	aprobado
69	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/8d7758e4-428f-4a1e-b24b-139015da4c4e.pdf	003_2021_10_27_ESTADO DE CUENTA_Recibo No 21010310233448.pdf	documento	application/pdf	825984	2026-07-18 07:00:04.446791+00	2026-07-21 16:18:43.337+00	activo	aprobado
67	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/543ad3a5-c4b4-4b91-8b71-5d09b85e1c0a.pdf	04_RELACION PAGOS IMPUESTO PREDIAL.pdf	documento	application/pdf	151777	2026-07-18 02:23:53.338036+00	2026-07-21 16:18:37.683+00	activo	aprobado
70	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/25142360-fdff-4457-ba84-20abfc71a936.pdf	004_2025_03_04_ESTADO DE CUENTA_Recibo No 25010310094348.pdf	documento	application/pdf	803837	2026-07-18 07:00:13.058768+00	2026-07-21 16:18:51.519+00	activo	aprobado
71	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/ae3e6896-8e27-4ba4-aae0-9da544d2e13e.pdf	005_2025_03_05_CERTIFICADO DE TRADICION.pdf	documento	application/pdf	1885390	2026-07-18 07:00:20.358583+00	2026-07-21 16:18:59.403+00	activo	aprobado
72	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/d49976aa-de52-4f87-a638-09c85b7f65c4.pdf	006_2024_04_24_DERECHO PETICION_PRESCRIPCION IMPUESTO PREDIAL.pdf	documento	application/pdf	346579	2026-07-18 07:00:33.696996+00	2026-07-21 16:19:04.59+00	activo	aprobado
74	27	8a923944-1c53-4584-94c1-f72c0848d04b	27/98ff8891-6fec-4ca0-90e3-c9185f70f950.jpeg	IMG_1337.jpeg	documento	image/jpeg	4232686	2026-07-21 16:20:31.793385+00	\N	activo	pendiente
75	27	8a923944-1c53-4584-94c1-f72c0848d04b	27/3d9a50c0-c550-4941-81c2-ec674abe431d.jpeg	IMG_1338.jpeg	documento	image/jpeg	4657904	2026-07-21 16:20:40.887598+00	\N	activo	pendiente
76	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35/1849e15d-85b1-47c9-b7ea-b77d455fd547.pdf	CamScanner 21-07-26 11.11.pdf	documento	application/pdf	2400362	2026-07-21 16:20:44.3007+00	2026-07-21 16:26:47.491+00	activo	aprobado
63	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	9/03ab0de7-dd34-4e37-ae44-246fc7cae4ec.jpeg	CamScanner 17-07-26 11.41_1.jpeg	documento	image/jpeg	389995	2026-07-17 16:45:09.224173+00	2026-07-21 19:51:00.793+00	activo	aprobado
73	30	ece5557b-c859-4da3-bd35-f1d2b3beb586	30/a9f48f19-3b98-4c19-8cae-2d26d10c5497.jpeg	CamScanner 21-07-26 10.39_1.jpeg	documento	image/jpeg	866472	2026-07-21 15:42:38.358408+00	2026-07-21 16:25:41.68+00	activo	aprobado
77	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29/c2b1f715-ca3a-4a47-a2d4-a55c9455591e.pdf	CamScanner 17-07-26 11.43.pdf	documento	application/pdf	486085	2026-07-21 16:38:15.729624+00	\N	activo	pendiente
79	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29/b884a7c1-16ea-41de-a867-74e452c234e7.pdf	CamScanner 21-07-26 11.11.pdf	documento	application/pdf	2400362	2026-07-21 16:44:01.733483+00	2026-07-21 16:45:15.392+00	activo	aprobado
78	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29/14bb089a-80e0-4d40-9599-691205a9fc9d.pdf	CamScanner 17-07-26 11.52.pdf	documento	application/pdf	1540539	2026-07-21 16:42:20.509224+00	2026-07-21 16:45:22.716+00	activo	aprobado
80	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29/53963f2c-2a20-4f05-857a-5060fa42a641.pdf	CamScanner 17-07-26 11.52 (1).pdf	documento	application/pdf	1540539	2026-07-21 16:45:22.71924+00	2026-07-21 16:45:30.702+00	activo	aprobado
81	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32/158c67df-862c-4066-9b9f-670127a5f008.pdf	DOCUMENTOS DE SOPORTE CASO 32 - ENTREVISTA_V01.pdf	documento	application/pdf	529015	2026-07-21 16:46:36.404351+00	2026-07-21 16:46:49.523+00	archivado	pendiente
82	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35/f7034470-4600-45ab-80eb-fd61b85786ab.pdf	CamScanner 22-07-26 10.21.pdf	documento	application/pdf	1897318	2026-07-22 15:22:44.586855+00	\N	activo	pendiente
83	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29/8d59bc4a-429f-4e10-92e1-f8cdc4049f41.pdf	CamScanner 22-07-26 10.27.pdf	documento	application/pdf	1830530	2026-07-22 15:28:31.627434+00	\N	activo	pendiente
84	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32/c08e2c96-05b0-46dc-b75a-2ac7b0bc83db.pdf	02_DOCUMENTOS DE SOPORTE CASO 32 - ENTREVISTA_v02.pdf	documento	application/pdf	477842	2026-07-22 15:39:09.318688+00	\N	activo	pendiente
86	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/3836b0b3-5a89-4362-bd2d-3e58a6f6c9fa.jpg	image.jpg	documento	image/jpeg	3876458	2026-07-22 15:44:01.805418+00	\N	activo	pendiente
87	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/bf9689ef-aedb-4229-a749-2630c8b79fd3.jpg	image.jpg	documento	image/jpeg	3501278	2026-07-22 15:44:15.214225+00	\N	activo	pendiente
88	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/70ca946b-2c94-498e-ad24-1eab6d331711.jpg	image.jpg	documento	image/jpeg	3668553	2026-07-22 15:44:25.781157+00	\N	activo	pendiente
89	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/4ea4f1a7-95c0-4921-9f08-852209df3b32.jpg	image.jpg	documento	image/jpeg	3689937	2026-07-22 15:44:33.675387+00	\N	activo	pendiente
90	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/159ea3f7-a8c0-477d-8396-338c0b69def5.jpg	image.jpg	documento	image/jpeg	3530172	2026-07-22 15:44:47.753927+00	\N	activo	pendiente
91	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/bddfce56-935d-4cae-aab5-997585d5066b.jpg	image.jpg	documento	image/jpeg	3103069	2026-07-22 15:44:56.722097+00	\N	activo	pendiente
93	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/702903fd-c79d-4e8d-84c9-de484545c6e9.jpg	image.jpg	documento	image/jpeg	2936608	2026-07-22 15:45:09.349139+00	\N	activo	pendiente
94	16	8a923944-1c53-4584-94c1-f72c0848d04b	16/75bd9948-f6a1-4551-9b7f-d6ab4df5d0f1.jpg	image.jpg	documento	image/jpeg	3498666	2026-07-22 15:45:23.114886+00	\N	activo	pendiente
96	39	8a923944-1c53-4584-94c1-f72c0848d04b	39/754c010e-b3ee-4669-9d3e-b4d9a64900e6.pdf	Doc juvenal tutela.pdf	documento	application/pdf	4739629	2026-07-22 16:12:00.681241+00	\N	activo	pendiente
98	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	37/87ed38a5-87e2-4461-8e42-d4c707758e14.jpeg	CamScanner 22-07-26 11.14_2.jpeg	documento	image/jpeg	645212	2026-07-22 16:21:15.914126+00	2026-07-27 13:54:48.071+00	activo	aprobado
97	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	37/23df4ef8-b2c5-4264-b750-b8547e290761.jpeg	CamScanner 22-07-26 11.14_1.jpeg	documento	image/jpeg	602483	2026-07-22 16:21:09.837211+00	2026-07-27 13:54:51.693+00	activo	aprobado
109	39	8a923944-1c53-4584-94c1-f72c0848d04b	39/029bf075-f83d-4a7b-a1c1-18f1b30f19ae.docx	Accion de tutela Juvenal.docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	31317	2026-07-27 13:57:13.689628+00	\N	activo	pendiente
106	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/84ea11ab-4a73-42a8-9c62-9e113e997297.pdf	007_DERECHO DE PETICION CARLOS ARTURO NOE ASTAIZA CC No 10522479_v02.pdf	documento	application/pdf	325865	2026-07-26 19:41:51.20665+00	2026-07-27 13:58:32.594+00	activo	aprobado
107	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/fa9cc5ae-1a17-4bb7-b3a4-eeb78465921b.pdf	06_DERECHO DE PETICION v03.pdf	documento	application/pdf	136066	2026-07-27 03:52:10.676422+00	2026-07-27 14:00:06.769+00	activo	aprobado
85	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36/397aa8ad-fff0-428a-8e4a-18aea8927765.zip	ilovepdf_compressed.zip	documento	application/zip	3703702	2026-07-22 15:43:21.631125+00	2026-07-27 14:15:24.692+00	activo	aprobado
92	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36/24b8aca3-8ad9-4d75-97db-892a46597b2a.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA.pdf	documento	application/pdf	1421701	2026-07-22 15:45:01.740351+00	2026-07-27 14:15:29.491+00	activo	aprobado
108	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34/86b7f54b-ea2f-4031-ba84-ea72672fa2fa.docx	derecho de peticion .docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	16381	2026-07-27 13:56:47.798224+00	2026-07-27 15:11:01.852+00	activo	rechazado
95	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34/a5c6099c-baae-4620-bde3-5a28eb1bec57.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-.pdf	documento	application/pdf	2282994	2026-07-22 16:00:23.193272+00	2026-07-27 15:11:08.811+00	activo	aprobado
99	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/1ac2f9b3-0f20-4c7e-a265-c0f0468ad225.jpeg	CamScanner 22-07-26 11.04_1.jpeg	documento	image/jpeg	921444	2026-07-22 16:25:13.744506+00	2026-07-27 15:14:58.374+00	activo	aprobado
100	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/aeaa9d23-ce80-4682-ab20-cdd9948d9eec.jpeg	CamScanner 22-07-26 11.04_3.jpeg	documento	image/jpeg	1248952	2026-07-22 16:25:26.932001+00	2026-07-27 15:15:05.451+00	activo	aprobado
101	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/405d88da-0e9a-49f9-8dc5-791401b1c478.jpeg	CamScanner 22-07-26 11.04_4.jpeg	documento	image/jpeg	1000390	2026-07-22 16:25:35.829126+00	2026-07-27 15:15:13.005+00	activo	aprobado
102	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/0071acaa-3259-4b8e-af2f-bfcea4c64d43.jpeg	CamScanner 22-07-26 11.04_6.jpeg	documento	image/jpeg	625579	2026-07-22 16:25:45.802048+00	2026-07-27 15:15:23.117+00	activo	aprobado
103	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/82663301-9546-443e-9824-51dc856d01ad.jpeg	CamScanner 22-07-26 11.04_7.jpeg	documento	image/jpeg	1040791	2026-07-22 16:25:54.631405+00	2026-07-27 15:15:31.698+00	activo	aprobado
104	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/eb21ada1-d80e-487e-af5b-a2018aa7f817.jpeg	CamScanner 22-07-26 11.04_5.jpeg	documento	image/jpeg	1596362	2026-07-22 16:26:04.043571+00	2026-07-27 15:15:37.084+00	activo	aprobado
105	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	40/8601f4fc-3b37-4c48-bb45-bdd05d7393f1.pdf	Derecho de petición súper giros 1.pdf	documento	application/pdf	908804	2026-07-23 22:42:48.075143+00	2026-07-27 15:17:22.87+00	activo	aprobado
110	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	43/cb358c6e-4401-4a22-966a-85ca484e4f7c.jpeg	CamScanner 27-07-26 10.37_1.jpeg	documento	image/jpeg	899388	2026-07-27 15:45:35.169593+00	\N	activo	pendiente
111	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	43/79da1662-9902-4bfc-ac3f-ab252a37bb47.jpeg	CamScanner 27-07-26 10.37_2.jpeg	documento	image/jpeg	943547	2026-07-27 15:45:42.181821+00	\N	activo	pendiente
112	42	8a923944-1c53-4584-94c1-f72c0848d04b	42/a6122ff7-492f-4063-ac3b-9d75431fde88.jpg	image.jpg	documento	image/jpeg	4025629	2026-07-27 15:51:19.07976+00	\N	activo	pendiente
113	42	8a923944-1c53-4584-94c1-f72c0848d04b	42/1d69cda9-dac0-4105-a7ea-b669d5c493da.jpg	image.jpg	documento	image/jpeg	3563247	2026-07-27 15:51:31.47399+00	\N	activo	pendiente
114	41	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	41/69adc83d-1693-4017-98fa-30c5c42fd8cc.pdf	CamScanner 27-07-26 11.19.pdf	documento	application/pdf	2227631	2026-07-27 16:26:11.617977+00	\N	activo	pendiente
115	44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	44/ca14fdac-7b88-48bd-9372-4b9d912ff27f.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA ENTREVISTA .pdf	documento	application/pdf	9990376	2026-07-27 21:36:56.353011+00	\N	activo	pendiente
116	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34/ac85c79d-49f7-418e-8128-ff43876a144a.docx	derecho de peticion maria- correción .docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	17618	2026-07-27 22:07:13.519294+00	\N	activo	pendiente
117	39	8a923944-1c53-4584-94c1-f72c0848d04b	39/c02fdaa8-51ed-498f-a41f-9376312d5efc.docx	Copia de Tutela Juvenal.docx	documento	application/vnd.openxmlformats-officedocument.wordprocessingml.document	33537	2026-07-27 23:56:04.385534+00	\N	activo	pendiente
118	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/63bcbb17-0e7d-4412-b38e-59fe8fa5367d.pdf	07_ENTREGA DERECHO DE PETICIÓN 27 DE JULIO 2026 PARA CONSEJO NACIONAL ELECTORAL.pdf	documento	application/pdf	126816	2026-07-28 13:40:29.926982+00	\N	activo	pendiente
119	46	8a923944-1c53-4584-94c1-f72c0848d04b	46/2d208b9f-5688-4410-9003-63116a7d31cf.jpg	image.jpg	documento	image/jpeg	3453023	2026-07-28 15:06:39.801383+00	\N	activo	pendiente
120	46	8a923944-1c53-4584-94c1-f72c0848d04b	46/7b67874f-3bae-4172-b6db-adbb22c22a6b.jpg	image.jpg	documento	image/jpeg	3403247	2026-07-28 15:06:55.290967+00	\N	activo	pendiente
121	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	45/36c58ff8-cc22-49b3-9717-35a2151f7e8a.pdf	01_FORMATO DE ENTREVISTA CONSULTORIO JURIDICO_20260728_101040772_MFNR.pdf	documento	application/pdf	301436	2026-07-28 15:21:56.705285+00	\N	activo	pendiente
122	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	48/8203b9e5-204e-4256-a2d0-73ab9689b9e4.jpeg	CamScanner 28-07-26 10.50_1.jpeg	documento	image/jpeg	956077	2026-07-28 15:51:24.083052+00	\N	activo	pendiente
123	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	48/49da1e2d-addb-46ad-b7f3-e7b79dbeecce.jpeg	CamScanner 28-07-26 10.50_2.jpeg	documento	image/jpeg	995281	2026-07-28 15:51:29.769199+00	\N	activo	pendiente
124	47	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	47/1d981da8-547d-4db0-bf9f-7ca6bbe0d006.pdf	CORPORACIÓN UNIVERSITARIA AUTÓNOMA DEL CAUCA-3.pdf	documento	application/pdf	8377304	2026-07-28 15:59:29.136785+00	\N	activo	pendiente
125	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	38/24eff9ef-8002-4114-b268-3b1972e2a22b.pdf	01_CASO #38_CHAMIZO MEDINA_IMG_20260728_081843966_MFNR.pdf	documento	application/pdf	306219	2026-07-29 13:42:44.17941+00	\N	activo	pendiente
126	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	49/67c7b0e3-6427-4d0c-9b36-f667c564975b.pdf	01_CASO #49_LUZ ESNEILA DIAZ BUITRON_20260728_113903456_MFNR.pdf	documento	application/pdf	321454	2026-07-29 14:01:12.487712+00	\N	activo	pendiente
127	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/f05a2994-5c69-4ff7-ab16-286e253daa03.pdf	01_CASO #019_CARLOS ARTURO NOE_RECIBIDO VU_ALCALDIA POPAYAN_20260729_100513720_MFNR.pdf	documento	application/pdf	2197747	2026-07-29 16:33:19.044187+00	\N	activo	pendiente
128	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11/649143d8-cad2-4551-8931-0396911d8684.pdf	008_CASO #011_CARLOS ARTURO NOE_RECIBIDO VU_ALCALDIA POPAYAN_20260729_100513720_MFNR.pdf	documento	application/pdf	2197747	2026-07-29 16:37:56.138327+00	\N	activo	pendiente
129	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19/da916c24-8ce6-4da7-879b-88ab3d495035.pdf	08_RADICADO DERECHO PETICION_PQRS CNE-E-DG-2026-027753 - 27 julio 2026.pdf	documento	application/pdf	170399	2026-07-30 12:49:17.701641+00	\N	activo	pendiente
130	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34/10f29c52-7a97-4881-ab28-1eb882c9222f.pdf	Derecho De Petición Firmado.pdf	documento	application/pdf	15311851	2026-07-30 15:51:27.837021+00	\N	activo	pendiente
131	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34/2d211b51-d872-4ee4-86db-7cfd4f5c91c8.pdf	Archivo Del Derecho De Petición.pdf	documento	application/pdf	3519171	2026-07-30 15:51:37.6605+00	\N	activo	pendiente
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."estudiantes" ("id_perfil", "semestre", "jornada", "turno", "dia") FROM stdin;
fac90012-570f-4d3c-90e2-dd3d991e5aec	9	mixto	9-11	\N
2ee91872-abbe-4d2e-be03-8e4eb3b47e05	7	diurna	9-11	\N
8a923944-1c53-4584-94c1-f72c0848d04b	9	diurna	9-11	Martes
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10	diurna	9-11	Martes
ece5557b-c859-4da3-bd35-f1d2b3beb586	10	diurna	9-11	Martes
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	9	diurna	\N	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9	diurna	\N	\N
\.


--
-- Data for Name: estudiantes_casos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."estudiantes_casos" ("id_estudiante", "id_caso", "fecha_asignacion", "fecha_fin_asignacion") FROM stdin;
fac90012-570f-4d3c-90e2-dd3d991e5aec	1	2026-03-19	\N
2ee91872-abbe-4d2e-be03-8e4eb3b47e05	2	2026-04-09	\N
2ee91872-abbe-4d2e-be03-8e4eb3b47e05	3	2026-04-23	\N
fac90012-570f-4d3c-90e2-dd3d991e5aec	4	2026-05-07	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5	2026-07-08	\N
8a923944-1c53-4584-94c1-f72c0848d04b	6	2026-07-08	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	7	2026-07-08	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	8	2026-07-08	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10	2026-07-09	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	12	2026-07-09	\N
8a923944-1c53-4584-94c1-f72c0848d04b	9	2026-07-08	2026-07-09
ece5557b-c859-4da3-bd35-f1d2b3beb586	9	2026-07-09	\N
8a923944-1c53-4584-94c1-f72c0848d04b	13	2026-07-09	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	14	2026-07-10	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	15	2026-07-10	\N
8a923944-1c53-4584-94c1-f72c0848d04b	17	2026-07-10	\N
8a923944-1c53-4584-94c1-f72c0848d04b	18	2026-07-10	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	11	2026-07-09	2026-07-14
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19	2026-07-14	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	20	2026-07-16	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	21	2026-07-16	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	22	2026-07-16	\N
8a923944-1c53-4584-94c1-f72c0848d04b	23	2026-07-16	\N
8a923944-1c53-4584-94c1-f72c0848d04b	27	2026-07-17	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	28	2026-07-17	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29	2026-07-17	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	30	2026-07-17	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	31	2026-07-17	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32	2026-07-17	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	33	2026-07-17	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35	2026-07-21	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36	2026-07-21	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	34	2026-07-21	2026-07-21
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34	2026-07-21	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	16	2026-07-10	2026-07-22
8a923944-1c53-4584-94c1-f72c0848d04b	16	2026-07-22	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	37	2026-07-22	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	38	2026-07-22	\N
8a923944-1c53-4584-94c1-f72c0848d04b	39	2026-07-22	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	40	2026-07-22	\N
e1b7662c-e9a6-45f6-87d5-5198548cd2c6	41	2026-07-27	\N
8a923944-1c53-4584-94c1-f72c0848d04b	42	2026-07-27	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	43	2026-07-27	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	44	2026-07-27	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	45	2026-07-28	\N
8a923944-1c53-4584-94c1-f72c0848d04b	46	2026-07-28	\N
ccd9c5b3-35ba-40ab-a345-c6bf1af51576	47	2026-07-28	\N
ece5557b-c859-4da3-bd35-f1d2b3beb586	48	2026-07-28	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	49	2026-07-28	\N
8a923944-1c53-4584-94c1-f72c0848d04b	50	2026-07-28	\N
cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11	2026-07-29	\N
\.


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."horarios" ("id", "id_perfil", "turno", "dia") FROM stdin;
4	bbde362e-ad70-445c-be8c-861b0e06052c	9-11	Lunes
5	bbde362e-ad70-445c-be8c-861b0e06052c	9-11	Martes
6	bbde362e-ad70-445c-be8c-861b0e06052c	9-11	Miercoles
7	bbde362e-ad70-445c-be8c-861b0e06052c	9-11	Jueves
8	bbde362e-ad70-445c-be8c-861b0e06052c	9-11	Viernes
9	8a923944-1c53-4584-94c1-f72c0848d04b	9-11	Martes
10	8a923944-1c53-4584-94c1-f72c0848d04b	10-12	Miercoles
11	8a923944-1c53-4584-94c1-f72c0848d04b	10-12	Jueves
12	8a923944-1c53-4584-94c1-f72c0848d04b	10-12	Viernes
13	8a923944-1c53-4584-94c1-f72c0848d04b	10-12	Lunes
14	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10-12	Lunes
15	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10-12	Martes
16	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10-12	Miercoles
17	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10-12	Jueves
18	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	10-12	Viernes
19	ece5557b-c859-4da3-bd35-f1d2b3beb586	10-12	Lunes
20	ece5557b-c859-4da3-bd35-f1d2b3beb586	10-12	Martes
21	ece5557b-c859-4da3-bd35-f1d2b3beb586	10-12	Miercoles
22	ece5557b-c859-4da3-bd35-f1d2b3beb586	10-12	Jueves
23	ece5557b-c859-4da3-bd35-f1d2b3beb586	10-12	Viernes
24	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10-12	Lunes
25	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10-12	Martes
26	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10-12	Miercoles
27	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10-12	Jueves
28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10-12	Viernes
29	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9-11	Martes
30	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9-11	Miercoles
31	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9-11	Jueves
32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9-11	Viernes
33	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	9-11	Lunes
34	180699bd-c51c-4921-baed-7e3f18d72a42	9-11	Lunes
35	180699bd-c51c-4921-baed-7e3f18d72a42	9-11	Martes
36	180699bd-c51c-4921-baed-7e3f18d72a42	9-11	Miercoles
37	180699bd-c51c-4921-baed-7e3f18d72a42	9-11	Jueves
38	180699bd-c51c-4921-baed-7e3f18d72a42	9-11	Viernes
39	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	9-11	Lunes
40	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	9-11	Martes
41	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	9-11	Miercoles
42	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	9-11	Jueves
43	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	9-11	Viernes
\.


--
-- Data for Name: llamados_atencion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."llamados_atencion" ("id", "id_caso", "id_usuario", "tipo", "motivo", "fecha_creacion", "leido", "resuelto", "fecha_resolucion", "resuelto_por") FROM stdin;
8	19	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-20 17:00:07.297654+00	f	f	\N	\N
9	22	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-20 17:00:07.297654+00	f	f	\N	\N
11	20	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	estudiante	El estudiante ha excedido el plazo de 3 dias habiles para la entrega del caso.	2026-07-21 17:00:04.803055+00	f	t	2026-07-21 17:31:51.215542+00	\N
13	34	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-24 17:00:04.686473+00	f	f	\N	\N
14	39	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-24 17:00:04.686473+00	f	f	\N	\N
15	37	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-24 17:00:04.686473+00	f	f	\N	\N
16	40	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-24 17:00:04.686473+00	f	f	\N	\N
12	33	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	estudiante	El estudiante ha excedido el plazo de 3 dias habiles para la entrega del caso.	2026-07-22 17:00:04.804836+00	f	t	2026-07-27 16:49:57.747802+00	\N
17	43	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 17:00:04.506437+00	f	f	\N	\N
18	42	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 17:00:04.506437+00	f	f	\N	\N
19	41	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 17:00:04.506437+00	f	f	\N	\N
20	38	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 17:00:04.506437+00	f	f	\N	\N
21	33	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 17:00:04.506437+00	f	f	\N	\N
10	21	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-20 23:00:06.899615+00	f	t	2026-07-29 19:37:48.239+00	b05fe275-d1f1-4af9-82af-06a688751425
22	44	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-29 23:00:05.564668+00	f	f	\N	\N
23	45	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-30 17:00:04.640953+00	f	f	\N	\N
24	46	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-30 17:00:04.640953+00	f	f	\N	\N
25	47	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-30 17:00:04.640953+00	f	f	\N	\N
26	48	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-30 17:00:04.640953+00	f	f	\N	\N
27	49	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-30 17:00:04.640953+00	f	f	\N	\N
28	50	bbde362e-ad70-445c-be8c-861b0e06052c	asesor	El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.	2026-07-31 17:00:04.371306+00	f	f	\N	\N
\.


--
-- Data for Name: notificaciones_pendientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."notificaciones_pendientes" ("id", "id_caso", "id_usuario", "tipo_notificacion", "canal", "source", "status", "attempts", "last_error", "created_at", "sent_at") FROM stdin;
60	34	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-21 19:47:24.719783+00	2026-07-21 20:00:03.867+00
1	5	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-08 15:38:46.80386+00	2026-07-08 15:38:48.407+00
2	5	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-08 15:38:46.953732+00	2026-07-08 15:38:48.612+00
29	11	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-14 15:25:22.744267+00	2026-07-14 15:30:31.382+00
30	19	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-14 15:30:30.690731+00	2026-07-14 15:30:31.658+00
3	6	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-08 15:42:52.898175+00	2026-07-08 15:42:53.463+00
4	6	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-08 15:42:53.005168+00	2026-07-08 15:42:53.693+00
31	19	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-14 15:30:30.861874+00	2026-07-14 15:30:31.89+00
61	16	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-22 15:11:46.637963+00	2026-07-22 15:14:47.878+00
5	7	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-08 16:10:10.086539+00	2026-07-08 16:10:10.938+00
6	7	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-08 16:10:10.251247+00	2026-07-08 16:10:11.252+00
32	20	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-16 14:57:40.318627+00	2026-07-16 14:57:41.257+00
33	20	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-16 14:57:40.47083+00	2026-07-16 14:57:41.554+00
7	8	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-08 16:13:12.519219+00	2026-07-08 16:13:13.174+00
8	8	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-08 16:13:12.656076+00	2026-07-08 16:13:13.404+00
34	21	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-16 15:00:00.246879+00	2026-07-16 15:00:01.831+00
9	9	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-08 16:34:17.229831+00	2026-07-08 16:34:17.969+00
10	9	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-08 16:34:17.381889+00	2026-07-08 16:34:18.269+00
35	21	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-16 15:00:00.378036+00	2026-07-16 15:00:02.063+00
11	10	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-09 15:10:14.271504+00	2026-07-09 15:10:15.673+00
12	10	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-09 15:10:14.488057+00	2026-07-09 15:10:15.935+00
36	22	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-16 15:58:10.598817+00	2026-07-16 15:58:11.219+00
37	22	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-16 15:58:10.766465+00	2026-07-16 15:58:11.839+00
13	11	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-09 15:14:20.218207+00	2026-07-09 15:14:20.858+00
14	11	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-09 15:14:20.379732+00	2026-07-09 15:14:21.047+00
15	12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-09 15:17:08.362357+00	2026-07-09 15:17:08.866+00
38	23	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-16 16:20:41.072174+00	2026-07-16 16:20:41.826+00
39	23	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-16 16:20:41.241157+00	2026-07-16 16:20:42.063+00
16	9	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-09 15:24:29.162542+00	2026-07-09 15:57:37.225+00
17	13	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-09 15:57:36.547418+00	2026-07-09 15:57:37.459+00
18	13	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-09 15:57:36.69433+00	2026-07-09 15:57:37.665+00
40	27	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:11:29.43973+00	2026-07-17 15:11:30.121+00
41	27	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:11:29.597186+00	2026-07-17 15:11:30.4+00
19	14	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-10 15:05:09.612186+00	2026-07-10 15:05:10.618+00
20	14	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-10 15:05:09.797328+00	2026-07-10 15:05:10.93+00
42	28	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:14:54.792123+00	2026-07-17 15:14:55.384+00
21	15	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-10 15:14:53.731203+00	2026-07-10 15:14:54.438+00
22	15	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-10 15:14:53.887473+00	2026-07-10 15:14:54.651+00
43	28	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:14:54.911122+00	2026-07-17 15:14:55.585+00
23	16	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-10 15:22:59.925308+00	2026-07-10 15:23:00.771+00
24	16	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-10 15:23:00.105539+00	2026-07-10 15:23:01.049+00
44	29	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:23:28.563344+00	2026-07-17 15:23:30.73+00
45	29	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:23:28.726965+00	2026-07-17 15:23:30.913+00
25	17	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-10 15:27:02.69476+00	2026-07-10 15:27:03.332+00
26	17	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-10 15:27:02.808873+00	2026-07-10 15:27:03.578+00
46	30	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:31:31.368161+00	2026-07-17 15:31:32.053+00
27	18	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-10 15:47:07.338466+00	2026-07-10 15:47:08.222+00
28	18	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-10 15:47:07.50297+00	2026-07-10 15:47:08.488+00
47	30	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:31:31.496224+00	2026-07-17 15:31:32.257+00
48	31	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:36:28.602649+00	2026-07-17 15:36:29.247+00
49	31	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:36:28.741128+00	2026-07-17 15:36:29.499+00
50	32	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 15:55:50.239146+00	2026-07-17 15:55:50.783+00
51	32	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 15:55:50.374557+00	2026-07-17 15:55:51.029+00
52	33	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-17 16:06:13.00575+00	2026-07-17 16:06:13.689+00
53	33	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-17 16:06:13.16697+00	2026-07-17 16:06:13.902+00
54	34	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-21 14:04:06.793484+00	2026-07-21 14:04:08.241+00
55	34	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-21 14:04:07.024819+00	2026-07-21 14:04:08.486+00
56	35	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-21 15:12:46.549603+00	2026-07-21 15:12:47.362+00
57	35	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-21 15:12:46.706962+00	2026-07-21 15:12:47.577+00
58	36	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-21 15:16:12.898879+00	2026-07-21 15:16:13.598+00
59	36	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-21 15:16:13.044137+00	2026-07-21 15:16:14.581+00
62	37	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-22 15:14:47.124122+00	2026-07-22 15:14:48.101+00
63	37	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-22 15:14:47.271703+00	2026-07-22 15:14:48.27+00
64	38	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-22 15:49:01.04457+00	2026-07-22 15:49:01.611+00
65	38	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-22 15:49:01.194076+00	2026-07-22 15:49:01.916+00
66	39	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-22 15:57:21.088818+00	2026-07-22 15:57:21.74+00
67	39	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-22 15:57:21.213975+00	2026-07-22 15:57:21.94+00
68	40	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-22 16:00:38.217497+00	2026-07-22 16:00:39.122+00
69	40	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-22 16:00:38.378157+00	2026-07-22 16:00:39.429+00
70	41	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-27 15:06:30.327379+00	2026-07-27 15:06:30.96+00
71	41	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-27 15:06:30.475743+00	2026-07-27 15:06:31.168+00
72	42	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-27 15:14:25.135241+00	2026-07-27 15:14:26.387+00
73	42	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-27 15:14:25.276884+00	2026-07-27 15:14:26.639+00
74	43	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-27 15:16:30.424828+00	2026-07-27 15:16:31.054+00
75	43	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-27 15:16:30.611833+00	2026-07-27 15:16:31.242+00
76	44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-27 16:07:20.271373+00	2026-07-27 16:07:20.968+00
77	44	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-27 16:07:20.447333+00	2026-07-27 16:07:21.175+00
78	45	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 13:53:23.167346+00	2026-07-28 13:53:24.01+00
79	45	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 13:53:23.38948+00	2026-07-28 13:53:24.318+00
80	46	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 14:31:25.410685+00	2026-07-28 14:31:26.274+00
81	46	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 14:31:25.571973+00	2026-07-28 14:31:26.495+00
82	47	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 14:57:00.137217+00	2026-07-28 14:57:00.828+00
83	47	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 14:57:00.296229+00	2026-07-28 14:57:01.233+00
84	48	ece5557b-c859-4da3-bd35-f1d2b3beb586	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 15:08:08.3655+00	2026-07-28 15:08:08.936+00
85	48	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 15:08:08.494601+00	2026-07-28 15:08:09.102+00
86	49	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 15:32:02.136763+00	2026-07-28 15:32:03.193+00
87	49	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 15:32:02.390789+00	2026-07-28 15:32:03.576+00
88	50	8a923944-1c53-4584-94c1-f72c0848d04b	ESTUDIANTE_ASIGNADO	email	trigger:estudiantes_casos	SENT	0	\N	2026-07-28 15:34:08.383224+00	2026-07-28 15:34:08.969+00
89	50	bbde362e-ad70-445c-be8c-861b0e06052c	ASESOR_ASIGNADO	email	trigger:asesores_casos	SENT	0	\N	2026-07-28 15:34:08.514042+00	2026-07-28 15:34:09.679+00
\.


--
-- Data for Name: notificaciones_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."notificaciones_usuario" ("id", "id_usuario", "id_caso", "tipo", "titulo", "mensaje", "leida", "created_at", "read_at") FROM stdin;
221	bbde362e-ad70-445c-be8c-861b0e06052c	29	documento_subido	Documento subido	Se subio un nuevo documento al caso #29	t	2026-07-21 16:42:20.509224+00	2026-07-21 16:45:49.982+00
50	8a923944-1c53-4584-94c1-f72c0848d04b	17	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #17	t	2026-07-10 15:27:02.69476+00	2026-07-14 15:31:53.23+00
54	8a923944-1c53-4584-94c1-f72c0848d04b	18	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #18	t	2026-07-10 15:47:07.338466+00	2026-07-14 15:31:53.23+00
3	8a923944-1c53-4584-94c1-f72c0848d04b	6	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #6	t	2026-07-08 15:42:52.898175+00	2026-07-08 15:51:59.348+00
81	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:27:22.239265+00	2026-07-14 15:56:37.303+00
6	8a923944-1c53-4584-94c1-f72c0848d04b	6	aprobacion	Caso aprobado	El asesor aprobo el caso #6	t	2026-07-08 15:52:54.90162+00	2026-07-08 15:56:30.535+00
227	bbde362e-ad70-445c-be8c-861b0e06052c	29	observacion	Nueva observacion	Hay una nueva observacion en el caso #29	t	2026-07-21 17:48:22.014051+00	2026-07-22 15:08:05.651+00
1	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #5	t	2026-07-08 15:38:46.80386+00	2026-07-08 16:05:06.502+00
73	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	14	aprobacion	Caso aprobado	El asesor aprobo el caso #14	t	2026-07-14 15:12:49.524227+00	2026-07-14 16:38:42.763+00
11	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	8	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #8	t	2026-07-08 16:13:12.519219+00	2026-07-08 16:14:16.242+00
94	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:22:27.137496+00	2026-07-16 15:08:55.127+00
95	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:22:36.940188+00	2026-07-16 15:08:55.127+00
118	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-15 14:55:37.220132+00	2026-07-16 15:08:55.127+00
14	8a923944-1c53-4584-94c1-f72c0848d04b	9	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #9	t	2026-07-08 16:34:17.229831+00	2026-07-08 17:59:01.476+00
9	ece5557b-c859-4da3-bd35-f1d2b3beb586	7	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #7	t	2026-07-08 16:10:10.086539+00	2026-07-09 00:03:41.759+00
121	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-15 15:30:46.97211+00	2026-07-16 15:08:55.127+00
124	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-16 02:27:28.624796+00	2026-07-16 15:08:55.127+00
127	bbde362e-ad70-445c-be8c-861b0e06052c	20	asignacion_asesor	Caso asignado	Se te ha asignado el caso #20	t	2026-07-16 14:57:40.47083+00	2026-07-16 15:08:55.127+00
107	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:32:14.059834+00	2026-07-16 15:08:55.127+00
21	ece5557b-c859-4da3-bd35-f1d2b3beb586	11	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #11	t	2026-07-09 15:14:20.218207+00	2026-07-09 15:15:06.371+00
108	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:32:31.143682+00	2026-07-16 15:08:55.127+00
109	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:32:46.576281+00	2026-07-16 15:08:55.127+00
23	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	12	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #12	t	2026-07-09 15:17:08.362357+00	2026-07-09 15:18:41.23+00
110	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:33:05.288564+00	2026-07-16 15:08:55.127+00
111	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:33:17.380969+00	2026-07-16 15:08:55.127+00
112	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:33:32.595965+00	2026-07-16 15:08:55.127+00
113	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:33:47.215861+00	2026-07-16 15:08:55.127+00
24	8a923944-1c53-4584-94c1-f72c0848d04b	9	aprobacion	Caso aprobado	El asesor aprobo el caso #9	t	2026-07-09 15:17:36.975475+00	2026-07-09 15:23:14.748+00
25	8a923944-1c53-4584-94c1-f72c0848d04b	9	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #9	t	2026-07-09 15:19:06.983968+00	2026-07-09 15:23:14.748+00
114	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:34:03.512707+00	2026-07-16 15:08:55.127+00
26	ece5557b-c859-4da3-bd35-f1d2b3beb586	7	aprobacion	Caso aprobado	El asesor aprobo el caso #7	t	2026-07-09 15:19:48.794978+00	2026-07-09 15:39:44.789+00
29	ece5557b-c859-4da3-bd35-f1d2b3beb586	9	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #9	t	2026-07-09 15:24:29.162542+00	2026-07-09 15:39:44.789+00
115	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:34:21.725376+00	2026-07-16 15:08:55.127+00
117	bbde362e-ad70-445c-be8c-861b0e06052c	9	documento_subido	Documento subido	Se subio un nuevo documento al caso #9	t	2026-07-14 22:31:09.545134+00	2026-07-16 15:08:55.127+00
30	8a923944-1c53-4584-94c1-f72c0848d04b	13	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #13	t	2026-07-09 15:57:36.547418+00	2026-07-09 15:58:22.034+00
120	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-15 15:25:47.746644+00	2026-07-16 15:08:55.127+00
27	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5	aprobacion	Caso aprobado	El asesor aprobo el caso #5	t	2026-07-09 15:20:14.850626+00	2026-07-09 16:24:28.196+00
130	ece5557b-c859-4da3-bd35-f1d2b3beb586	9	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #9	t	2026-07-16 15:06:53.326678+00	2026-07-16 15:10:20.403+00
28	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #5	t	2026-07-09 15:21:09.397265+00	2026-07-09 16:24:36.547+00
46	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	15	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #15	t	2026-07-10 15:14:53.731203+00	2026-07-16 15:44:09.725+00
126	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	20	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #20	t	2026-07-16 14:57:40.318627+00	2026-07-16 15:44:12.524+00
233	bbde362e-ad70-445c-be8c-861b0e06052c	35	documento_subido	Documento subido	Se subio un nuevo documento al caso #35	t	2026-07-22 15:22:44.586855+00	2026-07-27 15:26:10.772+00
89	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #19	t	2026-07-14 15:30:30.690731+00	2026-07-16 15:48:15.2+00
78	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	5	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #5	t	2026-07-14 15:22:51.666607+00	2026-07-16 15:53:34.758+00
36	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	8	aprobacion	Caso aprobado	El asesor aprobo el caso #8	t	2026-07-09 16:36:19.990894+00	2026-07-16 15:53:34.758+00
19	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #10	t	2026-07-09 15:10:14.271504+00	2026-07-09 23:04:16.687+00
38	ece5557b-c859-4da3-bd35-f1d2b3beb586	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	t	2026-07-09 16:39:25.941979+00	2026-07-10 15:01:04.594+00
37	ece5557b-c859-4da3-bd35-f1d2b3beb586	11	aprobacion	Caso aprobado	El asesor aprobo el caso #11	t	2026-07-09 16:37:33.010393+00	2026-07-10 16:14:39.041+00
44	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	14	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #14	t	2026-07-10 15:05:09.612186+00	2026-07-10 16:30:50.155+00
2	bbde362e-ad70-445c-be8c-861b0e06052c	5	asignacion_asesor	Caso asignado	Se te ha asignado el caso #5	t	2026-07-08 15:38:46.953732+00	2026-07-14 15:15:00.075+00
75	ece5557b-c859-4da3-bd35-f1d2b3beb586	16	aprobacion	Caso aprobado	El asesor aprobo el caso #16	t	2026-07-14 15:13:36.130673+00	2026-07-14 15:26:32.097+00
222	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29	observacion	Nueva observacion	Hay una nueva observacion en el caso #29	t	2026-07-21 16:43:59.295902+00	2026-07-21 17:07:48.65+00
228	bbde362e-ad70-445c-be8c-861b0e06052c	29	observacion	Nueva observacion	Hay una nueva observacion en el caso #29	t	2026-07-21 17:49:34.948316+00	2026-07-22 15:08:05.651+00
70	8a923944-1c53-4584-94c1-f72c0848d04b	13	aprobacion	Caso aprobado	El asesor aprobo el caso #13	t	2026-07-14 15:08:02.63843+00	2026-07-14 15:31:53.23+00
48	ece5557b-c859-4da3-bd35-f1d2b3beb586	16	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #16	t	2026-07-10 15:22:59.925308+00	2026-07-10 16:14:39.041+00
76	8a923944-1c53-4584-94c1-f72c0848d04b	17	aprobacion	Caso aprobado	El asesor aprobo el caso #17	t	2026-07-14 15:14:31.862208+00	2026-07-14 15:31:53.23+00
77	8a923944-1c53-4584-94c1-f72c0848d04b	18	aprobacion	Caso aprobado	El asesor aprobo el caso #18	t	2026-07-14 15:14:51.329518+00	2026-07-14 15:31:53.23+00
82	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:27:34.621876+00	2026-07-14 15:56:37.303+00
83	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:28:35.967569+00	2026-07-14 15:56:37.303+00
90	bbde362e-ad70-445c-be8c-861b0e06052c	19	asignacion_asesor	Caso asignado	Se te ha asignado el caso #19	t	2026-07-14 15:30:30.861874+00	2026-07-14 15:56:37.303+00
91	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:30:39.93454+00	2026-07-14 15:56:37.303+00
69	ece5557b-c859-4da3-bd35-f1d2b3beb586	9	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #9	t	2026-07-14 15:06:48.583834+00	2026-07-14 15:12:41.489+00
4	bbde362e-ad70-445c-be8c-861b0e06052c	6	asignacion_asesor	Caso asignado	Se te ha asignado el caso #6	t	2026-07-08 15:42:53.005168+00	2026-07-14 15:15:00.075+00
5	bbde362e-ad70-445c-be8c-861b0e06052c	6	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #6	t	2026-07-08 15:51:05.747816+00	2026-07-14 15:15:00.075+00
7	bbde362e-ad70-445c-be8c-861b0e06052c	5	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #5	t	2026-07-08 15:58:55.947806+00	2026-07-14 15:15:00.075+00
8	bbde362e-ad70-445c-be8c-861b0e06052c	5	documento_subido	Documento subido	Se subio un nuevo documento al caso #5	t	2026-07-08 16:04:26.91953+00	2026-07-14 15:15:00.075+00
10	bbde362e-ad70-445c-be8c-861b0e06052c	7	asignacion_asesor	Caso asignado	Se te ha asignado el caso #7	t	2026-07-08 16:10:10.251247+00	2026-07-14 15:15:00.075+00
12	bbde362e-ad70-445c-be8c-861b0e06052c	8	asignacion_asesor	Caso asignado	Se te ha asignado el caso #8	t	2026-07-08 16:13:12.656076+00	2026-07-14 15:15:00.075+00
13	bbde362e-ad70-445c-be8c-861b0e06052c	7	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #7	t	2026-07-08 16:27:15.080852+00	2026-07-14 15:15:00.075+00
15	bbde362e-ad70-445c-be8c-861b0e06052c	9	asignacion_asesor	Caso asignado	Se te ha asignado el caso #9	t	2026-07-08 16:34:17.381889+00	2026-07-14 15:15:00.075+00
16	bbde362e-ad70-445c-be8c-861b0e06052c	9	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #9	t	2026-07-08 17:58:49.313637+00	2026-07-14 15:15:00.075+00
17	bbde362e-ad70-445c-be8c-861b0e06052c	9	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #9	t	2026-07-08 17:58:49.30572+00	2026-07-14 15:15:00.075+00
18	bbde362e-ad70-445c-be8c-861b0e06052c	9	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #9	t	2026-07-08 17:58:50.279915+00	2026-07-14 15:15:00.075+00
20	bbde362e-ad70-445c-be8c-861b0e06052c	10	asignacion_asesor	Caso asignado	Se te ha asignado el caso #10	t	2026-07-09 15:10:14.488057+00	2026-07-14 15:15:00.075+00
22	bbde362e-ad70-445c-be8c-861b0e06052c	11	asignacion_asesor	Caso asignado	Se te ha asignado el caso #11	t	2026-07-09 15:14:20.379732+00	2026-07-14 15:15:00.075+00
31	bbde362e-ad70-445c-be8c-861b0e06052c	13	asignacion_asesor	Caso asignado	Se te ha asignado el caso #13	t	2026-07-09 15:57:36.69433+00	2026-07-14 15:15:00.075+00
32	bbde362e-ad70-445c-be8c-861b0e06052c	8	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #8	t	2026-07-09 16:24:03.710716+00	2026-07-14 15:15:00.075+00
33	bbde362e-ad70-445c-be8c-861b0e06052c	13	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #13	t	2026-07-09 16:24:29.494114+00	2026-07-14 15:15:00.075+00
34	bbde362e-ad70-445c-be8c-861b0e06052c	8	documento_subido	Documento subido	Se subio un nuevo documento al caso #8	t	2026-07-09 16:28:41.207654+00	2026-07-14 15:15:00.075+00
35	bbde362e-ad70-445c-be8c-861b0e06052c	11	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #11	t	2026-07-09 16:29:22.043309+00	2026-07-14 15:15:00.075+00
39	bbde362e-ad70-445c-be8c-861b0e06052c	10	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #10	t	2026-07-09 23:03:55.969148+00	2026-07-14 15:15:00.075+00
40	bbde362e-ad70-445c-be8c-861b0e06052c	10	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #10	t	2026-07-09 23:03:56.068435+00	2026-07-14 15:15:00.075+00
41	bbde362e-ad70-445c-be8c-861b0e06052c	10	documento_subido	Documento subido	Se subio un nuevo documento al caso #10	t	2026-07-10 00:20:20.161538+00	2026-07-14 15:15:00.075+00
42	bbde362e-ad70-445c-be8c-861b0e06052c	10	documento_subido	Documento subido	Se subio un nuevo documento al caso #10	t	2026-07-10 00:20:49.658863+00	2026-07-14 15:15:00.075+00
43	bbde362e-ad70-445c-be8c-861b0e06052c	10	documento_subido	Documento subido	Se subio un nuevo documento al caso #10	t	2026-07-10 01:05:07.832196+00	2026-07-14 15:15:00.075+00
45	bbde362e-ad70-445c-be8c-861b0e06052c	14	asignacion_asesor	Caso asignado	Se te ha asignado el caso #14	t	2026-07-10 15:05:09.797328+00	2026-07-14 15:15:00.075+00
47	bbde362e-ad70-445c-be8c-861b0e06052c	15	asignacion_asesor	Caso asignado	Se te ha asignado el caso #15	t	2026-07-10 15:14:53.887473+00	2026-07-14 15:15:00.075+00
49	bbde362e-ad70-445c-be8c-861b0e06052c	16	asignacion_asesor	Caso asignado	Se te ha asignado el caso #16	t	2026-07-10 15:23:00.105539+00	2026-07-14 15:15:00.075+00
51	bbde362e-ad70-445c-be8c-861b0e06052c	17	asignacion_asesor	Caso asignado	Se te ha asignado el caso #17	t	2026-07-10 15:27:02.808873+00	2026-07-14 15:15:00.075+00
52	bbde362e-ad70-445c-be8c-861b0e06052c	17	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #17	t	2026-07-10 15:41:50.423607+00	2026-07-14 15:15:00.075+00
53	bbde362e-ad70-445c-be8c-861b0e06052c	17	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #17	t	2026-07-10 15:41:50.44957+00	2026-07-14 15:15:00.075+00
55	bbde362e-ad70-445c-be8c-861b0e06052c	18	asignacion_asesor	Caso asignado	Se te ha asignado el caso #18	t	2026-07-10 15:47:07.50297+00	2026-07-14 15:15:00.075+00
56	bbde362e-ad70-445c-be8c-861b0e06052c	15	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #15	t	2026-07-10 15:59:25.266839+00	2026-07-14 15:15:00.075+00
57	bbde362e-ad70-445c-be8c-861b0e06052c	18	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #18	t	2026-07-10 16:01:19.949727+00	2026-07-14 15:15:00.075+00
92	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:30:57.139106+00	2026-07-14 15:56:37.303+00
71	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10	aprobacion	Caso aprobado	El asesor aprobo el caso #10	t	2026-07-14 15:08:14.090476+00	2026-07-14 16:38:42.763+00
72	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #10	t	2026-07-14 15:08:39.943182+00	2026-07-14 16:38:42.763+00
79	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #11	t	2026-07-14 15:25:22.744267+00	2026-07-16 15:48:15.2+00
74	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	15	aprobacion	Caso aprobado	El asesor aprobo el caso #15	t	2026-07-14 15:13:05.464172+00	2026-07-16 15:53:34.758+00
58	bbde362e-ad70-445c-be8c-861b0e06052c	18	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #18	t	2026-07-10 16:01:20.412777+00	2026-07-14 15:15:00.075+00
59	bbde362e-ad70-445c-be8c-861b0e06052c	15	documento_subido	Documento subido	Se subio un nuevo documento al caso #15	t	2026-07-10 16:09:59.951969+00	2026-07-14 15:15:00.075+00
60	bbde362e-ad70-445c-be8c-861b0e06052c	16	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #16	t	2026-07-10 16:10:58.9293+00	2026-07-14 15:15:00.075+00
61	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-10 16:13:02.695393+00	2026-07-14 15:15:00.075+00
62	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-10 16:13:27.519679+00	2026-07-14 15:15:00.075+00
63	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-10 16:13:48.405885+00	2026-07-14 15:15:00.075+00
64	bbde362e-ad70-445c-be8c-861b0e06052c	14	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #14	t	2026-07-10 16:28:09.430871+00	2026-07-14 15:15:00.075+00
65	bbde362e-ad70-445c-be8c-861b0e06052c	14	documento_subido	Documento subido	Se subio un nuevo documento al caso #14	t	2026-07-10 16:30:40.825022+00	2026-07-14 15:15:00.075+00
66	bbde362e-ad70-445c-be8c-861b0e06052c	17	documento_subido	Documento subido	Se subio un nuevo documento al caso #17	t	2026-07-10 16:44:18.488879+00	2026-07-14 15:15:00.075+00
67	bbde362e-ad70-445c-be8c-861b0e06052c	9	documento_subido	Documento subido	Se subio un nuevo documento al caso #9	t	2026-07-10 16:44:26.265965+00	2026-07-14 15:15:00.075+00
68	bbde362e-ad70-445c-be8c-861b0e06052c	17	documento_subido	Documento subido	Se subio un nuevo documento al caso #17	t	2026-07-10 16:44:30.743896+00	2026-07-14 15:15:00.075+00
223	bbde362e-ad70-445c-be8c-861b0e06052c	29	documento_subido	Documento subido	Se subio un nuevo documento al caso #29	t	2026-07-21 16:44:01.733483+00	2026-07-21 16:45:49.982+00
229	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #34	t	2026-07-21 19:47:24.719783+00	2026-07-22 15:45:26.836+00
80	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:27:08.567019+00	2026-07-14 15:56:37.303+00
84	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:28:53.057446+00	2026-07-14 15:56:37.303+00
85	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:29:06.776244+00	2026-07-14 15:56:37.303+00
86	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:29:16.208812+00	2026-07-14 15:56:37.303+00
87	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:29:25.932407+00	2026-07-14 15:56:37.303+00
88	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 15:29:33.462995+00	2026-07-14 15:56:37.303+00
248	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	38	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #38	t	2026-07-22 15:49:01.04457+00	2026-07-26 23:29:38.041+00
278	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34	aprobacion	Caso aprobado	El asesor aprobo el caso #34	t	2026-07-27 13:53:31.305335+00	2026-07-27 13:55:26.512+00
289	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	41	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #41	f	2026-07-27 15:06:30.327379+00	\N
279	8a923944-1c53-4584-94c1-f72c0848d04b	39	aprobacion	Caso aprobado	El asesor aprobo el caso #39	t	2026-07-27 13:53:49.824891+00	2026-07-27 15:12:37.818+00
235	bbde362e-ad70-445c-be8c-861b0e06052c	29	documento_subido	Documento subido	Se subio un nuevo documento al caso #29	t	2026-07-22 15:28:31.627434+00	2026-07-27 15:26:10.772+00
257	bbde362e-ad70-445c-be8c-861b0e06052c	39	documento_subido	Documento subido	Se subio un nuevo documento al caso #39	t	2026-07-22 16:12:00.681241+00	2026-07-27 15:26:10.772+00
264	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:25:35.829126+00	2026-07-27 15:26:10.772+00
268	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-23 22:42:48.075143+00	2026-07-27 15:26:10.772+00
295	ece5557b-c859-4da3-bd35-f1d2b3beb586	43	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #43	t	2026-07-27 15:16:30.424828+00	2026-07-27 15:46:46.715+00
297	ece5557b-c859-4da3-bd35-f1d2b3beb586	40	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #40	t	2026-07-27 15:17:17.420818+00	2026-07-27 15:46:46.715+00
96	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:26:49.990554+00	2026-07-16 15:08:55.127+00
97	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:27:10.120151+00	2026-07-16 15:08:55.127+00
98	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:27:28.458774+00	2026-07-16 15:08:55.127+00
99	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:27:46.780563+00	2026-07-16 15:08:55.127+00
100	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:28:09.626811+00	2026-07-16 15:08:55.127+00
116	bbde362e-ad70-445c-be8c-861b0e06052c	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	t	2026-07-14 16:39:47.345395+00	2026-07-16 15:08:55.127+00
119	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-15 15:20:39.999966+00	2026-07-16 15:08:55.127+00
122	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-15 16:40:46.276916+00	2026-07-16 15:08:55.127+00
93	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-14 16:21:23.648611+00	2026-07-16 15:08:55.127+00
101	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:30:50.947354+00	2026-07-16 15:08:55.127+00
102	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:31:02.14582+00	2026-07-16 15:08:55.127+00
103	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:31:10.310858+00	2026-07-16 15:08:55.127+00
104	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:31:31.260947+00	2026-07-16 15:08:55.127+00
105	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:31:41.548515+00	2026-07-16 15:08:55.127+00
106	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-14 16:31:59.840367+00	2026-07-16 15:08:55.127+00
128	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	21	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #21	t	2026-07-16 15:00:00.246879+00	2026-07-16 20:35:28.157+00
292	8a923944-1c53-4584-94c1-f72c0848d04b	42	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #42	t	2026-07-27 15:14:25.135241+00	2026-07-27 18:58:03.036+00
285	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	t	2026-07-27 13:58:30.298561+00	2026-07-28 13:33:19.925+00
123	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-15 16:42:14.055928+00	2026-07-16 15:08:55.127+00
125	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-16 02:30:22.13007+00	2026-07-16 15:08:55.127+00
129	bbde362e-ad70-445c-be8c-861b0e06052c	21	asignacion_asesor	Caso asignado	Se te ha asignado el caso #21	t	2026-07-16 15:00:00.378036+00	2026-07-16 15:08:55.127+00
224	bbde362e-ad70-445c-be8c-861b0e06052c	29	documento_subido	Documento subido	Se subio un nuevo documento al caso #29	t	2026-07-21 16:45:22.71924+00	2026-07-21 16:45:49.982+00
131	ece5557b-c859-4da3-bd35-f1d2b3beb586	22	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #22	t	2026-07-16 15:58:10.598817+00	2026-07-16 16:01:39.84+00
163	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #32	t	2026-07-17 15:55:50.239146+00	2026-07-22 15:39:41.227+00
166	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	33	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #33	t	2026-07-17 16:06:13.00575+00	2026-07-22 15:39:43.035+00
132	bbde362e-ad70-445c-be8c-861b0e06052c	22	asignacion_asesor	Caso asignado	Se te ha asignado el caso #22	t	2026-07-16 15:58:10.766465+00	2026-07-16 16:31:37.815+00
133	bbde362e-ad70-445c-be8c-861b0e06052c	20	documento_subido	Documento subido	Se subio un nuevo documento al caso #20	t	2026-07-16 15:58:13.532894+00	2026-07-16 16:31:37.815+00
135	bbde362e-ad70-445c-be8c-861b0e06052c	23	asignacion_asesor	Caso asignado	Se te ha asignado el caso #23	t	2026-07-16 16:20:41.241157+00	2026-07-16 16:31:37.815+00
136	bbde362e-ad70-445c-be8c-861b0e06052c	19	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #19	t	2026-07-16 16:26:16.106389+00	2026-07-16 16:31:37.815+00
230	8a923944-1c53-4584-94c1-f72c0848d04b	16	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #16	t	2026-07-22 15:11:46.637963+00	2026-07-27 15:12:37.818+00
239	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:15.214225+00	2026-07-27 15:26:10.772+00
244	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:56.722097+00	2026-07-27 15:26:10.772+00
246	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:45:09.349139+00	2026-07-27 15:26:10.772+00
247	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:45:23.114886+00	2026-07-27 15:26:10.772+00
262	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:25:13.744506+00	2026-07-27 15:26:10.772+00
234	bbde362e-ad70-445c-be8c-861b0e06052c	32	observacion	Nueva observacion	Hay una nueva observacion en el caso #32	t	2026-07-22 15:23:42.844405+00	2026-07-27 15:26:10.772+00
240	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:25.781157+00	2026-07-27 15:26:10.772+00
245	bbde362e-ad70-445c-be8c-861b0e06052c	36	documento_subido	Documento subido	Se subio un nuevo documento al caso #36	t	2026-07-22 15:45:01.740351+00	2026-07-27 15:26:10.772+00
256	bbde362e-ad70-445c-be8c-861b0e06052c	39	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #39	t	2026-07-22 16:10:31.191003+00	2026-07-27 15:26:10.772+00
263	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:25:26.932001+00	2026-07-27 15:26:10.772+00
157	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #29	t	2026-07-17 15:23:28.563344+00	2026-07-17 15:24:04.541+00
267	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:26:04.043571+00	2026-07-27 15:26:10.772+00
269	bbde362e-ad70-445c-be8c-861b0e06052c	40	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #40	t	2026-07-23 22:43:26.30872+00	2026-07-27 15:26:10.772+00
270	bbde362e-ad70-445c-be8c-861b0e06052c	40	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #40	t	2026-07-23 22:43:51.481218+00	2026-07-27 15:26:10.772+00
274	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-26 20:06:47.19464+00	2026-07-27 15:26:10.772+00
236	bbde362e-ad70-445c-be8c-861b0e06052c	32	documento_subido	Documento subido	Se subio un nuevo documento al caso #32	t	2026-07-22 15:39:09.318688+00	2026-07-27 15:26:10.772+00
249	bbde362e-ad70-445c-be8c-861b0e06052c	38	asignacion_asesor	Caso asignado	Se te ha asignado el caso #38	t	2026-07-22 15:49:01.194076+00	2026-07-27 15:26:10.772+00
258	bbde362e-ad70-445c-be8c-861b0e06052c	37	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #37	t	2026-07-22 16:19:57.581935+00	2026-07-27 15:26:10.772+00
265	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:25:45.802048+00	2026-07-27 15:26:10.772+00
271	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-26 19:41:51.20665+00	2026-07-27 15:26:10.772+00
275	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-27 03:52:10.676422+00	2026-07-27 15:26:10.772+00
280	ece5557b-c859-4da3-bd35-f1d2b3beb586	40	aprobacion	Caso aprobado	El asesor aprobo el caso #40	t	2026-07-27 13:54:07.097099+00	2026-07-27 15:46:46.715+00
281	ece5557b-c859-4da3-bd35-f1d2b3beb586	37	aprobacion	Caso aprobado	El asesor aprobo el caso #37	t	2026-07-27 13:54:20.346775+00	2026-07-27 15:46:46.715+00
155	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	28	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #28	t	2026-07-17 15:14:54.792123+00	2026-07-17 19:07:07.313+00
161	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	31	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #31	t	2026-07-17 15:36:28.602649+00	2026-07-17 19:07:07.313+00
282	ece5557b-c859-4da3-bd35-f1d2b3beb586	37	observacion	Nueva observacion	Hay una nueva observacion en el caso #37	t	2026-07-27 13:54:43.787693+00	2026-07-27 15:46:46.715+00
286	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	t	2026-07-27 14:00:04.826503+00	2026-07-28 13:33:21.454+00
134	8a923944-1c53-4584-94c1-f72c0848d04b	23	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #23	t	2026-07-16 16:20:41.072174+00	2026-07-21 15:28:39.169+00
137	bbde362e-ad70-445c-be8c-861b0e06052c	22	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #22	t	2026-07-16 16:37:09.44159+00	2026-07-21 16:41:09.191+00
138	bbde362e-ad70-445c-be8c-861b0e06052c	22	documento_subido	Documento subido	Se subio un nuevo documento al caso #22	t	2026-07-16 16:38:07.819312+00	2026-07-21 16:41:09.191+00
139	bbde362e-ad70-445c-be8c-861b0e06052c	22	documento_subido	Documento subido	Se subio un nuevo documento al caso #22	t	2026-07-16 16:38:14.766001+00	2026-07-21 16:41:09.191+00
225	bbde362e-ad70-445c-be8c-861b0e06052c	32	documento_subido	Documento subido	Se subio un nuevo documento al caso #32	t	2026-07-21 16:46:36.404351+00	2026-07-22 15:08:05.651+00
159	ece5557b-c859-4da3-bd35-f1d2b3beb586	30	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #30	t	2026-07-17 15:31:31.368161+00	2026-07-21 15:10:37.991+00
210	ece5557b-c859-4da3-bd35-f1d2b3beb586	30	aprobacion	Caso aprobado	El asesor aprobo el caso #30	t	2026-07-21 16:25:46.888939+00	2026-07-22 15:11:17.877+00
211	ece5557b-c859-4da3-bd35-f1d2b3beb586	30	observacion	Nueva observacion	Hay una nueva observacion en el caso #30	t	2026-07-21 16:25:59.527127+00	2026-07-22 15:11:17.877+00
186	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #35	t	2026-07-21 15:12:46.549603+00	2026-07-21 15:13:34.333+00
218	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32	observacion	Nueva observacion	Hay una nueva observacion en el caso #32	t	2026-07-21 16:37:21.871799+00	2026-07-22 15:30:36.729+00
184	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	34	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #34	t	2026-07-21 14:04:06.793484+00	2026-07-22 15:39:48.898+00
192	ece5557b-c859-4da3-bd35-f1d2b3beb586	22	observacion	Nueva observacion	Hay una nueva observacion en el caso #22	t	2026-07-21 15:22:06.888603+00	2026-07-21 15:25:27.844+00
191	ece5557b-c859-4da3-bd35-f1d2b3beb586	22	aprobacion	Caso aprobado	El asesor aprobo el caso #22	t	2026-07-21 15:21:53.087911+00	2026-07-21 15:25:29.024+00
153	8a923944-1c53-4584-94c1-f72c0848d04b	27	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #27	t	2026-07-17 15:11:29.43973+00	2026-07-21 15:28:39.169+00
165	8a923944-1c53-4584-94c1-f72c0848d04b	23	aprobacion	Caso aprobado	El asesor aprobo el caso #23	t	2026-07-17 15:55:51.729501+00	2026-07-21 15:28:39.169+00
188	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #36	t	2026-07-21 15:16:12.898879+00	2026-07-22 15:45:26.836+00
190	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	21	aprobacion	Caso aprobado	El asesor aprobo el caso #21	t	2026-07-21 15:21:02.162557+00	2026-07-22 15:45:26.836+00
196	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	31	aprobacion	Caso aprobado	El asesor aprobo el caso #31	t	2026-07-21 15:30:26.053346+00	2026-07-22 15:45:26.836+00
197	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	28	observacion	Nueva observacion	Hay una nueva observacion en el caso #28	t	2026-07-21 15:33:07.689618+00	2026-07-22 15:45:26.836+00
198	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	28	aprobacion	Caso aprobado	El asesor aprobo el caso #28	t	2026-07-21 15:33:34.407714+00	2026-07-22 15:45:26.836+00
214	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36	aprobacion	Caso aprobado	El asesor aprobo el caso #36	t	2026-07-21 16:31:43.707706+00	2026-07-22 15:45:26.836+00
199	8a923944-1c53-4584-94c1-f72c0848d04b	27	aprobacion	Caso aprobado	El asesor aprobo el caso #27	t	2026-07-21 15:34:51.530474+00	2026-07-21 16:20:53.157+00
215	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	36	observacion	Nueva observacion	Hay una nueva observacion en el caso #36	t	2026-07-21 16:32:00.455115+00	2026-07-22 15:45:26.836+00
212	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35	aprobacion	Caso aprobado	El asesor aprobo el caso #35	f	2026-07-21 16:26:43.431764+00	\N
213	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	35	observacion	Nueva observacion	Hay una nueva observacion en el caso #35	f	2026-07-21 16:30:22.403779+00	\N
140	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-16 16:47:35.659466+00	2026-07-21 16:41:09.191+00
141	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-16 16:48:56.046361+00	2026-07-21 16:41:09.191+00
142	bbde362e-ad70-445c-be8c-861b0e06052c	23	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #23	t	2026-07-16 17:20:14.120258+00	2026-07-21 16:41:09.191+00
143	bbde362e-ad70-445c-be8c-861b0e06052c	23	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #23	t	2026-07-16 17:20:14.308942+00	2026-07-21 16:41:09.191+00
144	bbde362e-ad70-445c-be8c-861b0e06052c	21	documento_subido	Documento subido	Se subio un nuevo documento al caso #21	t	2026-07-16 20:43:20.398798+00	2026-07-21 16:41:09.191+00
145	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-16 21:01:12.690267+00	2026-07-21 16:41:09.191+00
146	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-16 21:01:23.092178+00	2026-07-21 16:41:09.191+00
147	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-16 21:01:31.120664+00	2026-07-21 16:41:09.191+00
148	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-16 21:01:40.657842+00	2026-07-21 16:41:09.191+00
149	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	t	2026-07-16 21:39:41.038692+00	2026-07-21 16:41:09.191+00
150	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	t	2026-07-16 23:22:11.168059+00	2026-07-21 16:41:09.191+00
151	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	t	2026-07-16 23:25:30.844985+00	2026-07-21 16:41:09.191+00
183	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-18 07:06:17.976235+00	2026-07-21 16:41:09.191+00
185	bbde362e-ad70-445c-be8c-861b0e06052c	34	asignacion_asesor	Caso asignado	Se te ha asignado el caso #34	t	2026-07-21 14:04:07.024819+00	2026-07-21 16:41:09.191+00
187	bbde362e-ad70-445c-be8c-861b0e06052c	35	asignacion_asesor	Caso asignado	Se te ha asignado el caso #35	t	2026-07-21 15:12:46.706962+00	2026-07-21 16:41:09.191+00
189	bbde362e-ad70-445c-be8c-861b0e06052c	36	asignacion_asesor	Caso asignado	Se te ha asignado el caso #36	t	2026-07-21 15:16:13.044137+00	2026-07-21 16:41:09.191+00
231	ece5557b-c859-4da3-bd35-f1d2b3beb586	37	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #37	t	2026-07-22 15:14:47.124122+00	2026-07-22 16:26:15.753+00
216	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	32	aprobacion	Caso aprobado	El asesor aprobo el caso #32	t	2026-07-21 16:32:31.338918+00	2026-07-26 23:29:10.661+00
193	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19	aprobacion	Caso aprobado	El asesor aprobo el caso #19	t	2026-07-21 15:23:47.409868+00	2026-07-26 23:29:23.861+00
194	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	t	2026-07-21 15:27:19.938626+00	2026-07-26 23:29:30.844+00
202	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	t	2026-07-21 16:14:26.82967+00	2026-07-26 23:29:33.244+00
291	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	34	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #34	t	2026-07-27 15:10:58.476445+00	2026-07-27 21:24:37.437+00
287	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	38	documentos_faltantes	Faltan documentos	El caso #38 no tiene documentos adjuntos. Cargalos desde el detalle del caso.	t	2026-07-27 14:01:07.001637+00	2026-07-28 13:33:23.431+00
294	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	38	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #38	t	2026-07-27 15:14:27.854338+00	2026-07-28 13:33:24.373+00
152	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	t	2026-07-16 23:26:59.465012+00	2026-07-21 16:41:09.191+00
154	bbde362e-ad70-445c-be8c-861b0e06052c	27	asignacion_asesor	Caso asignado	Se te ha asignado el caso #27	t	2026-07-17 15:11:29.597186+00	2026-07-21 16:41:09.191+00
156	bbde362e-ad70-445c-be8c-861b0e06052c	28	asignacion_asesor	Caso asignado	Se te ha asignado el caso #28	t	2026-07-17 15:14:54.911122+00	2026-07-21 16:41:09.191+00
158	bbde362e-ad70-445c-be8c-861b0e06052c	29	asignacion_asesor	Caso asignado	Se te ha asignado el caso #29	t	2026-07-17 15:23:28.726965+00	2026-07-21 16:41:09.191+00
160	bbde362e-ad70-445c-be8c-861b0e06052c	30	asignacion_asesor	Caso asignado	Se te ha asignado el caso #30	t	2026-07-17 15:31:31.496224+00	2026-07-21 16:41:09.191+00
162	bbde362e-ad70-445c-be8c-861b0e06052c	31	asignacion_asesor	Caso asignado	Se te ha asignado el caso #31	t	2026-07-17 15:36:28.741128+00	2026-07-21 16:41:09.191+00
164	bbde362e-ad70-445c-be8c-861b0e06052c	32	asignacion_asesor	Caso asignado	Se te ha asignado el caso #32	t	2026-07-17 15:55:50.374557+00	2026-07-21 16:41:09.191+00
167	bbde362e-ad70-445c-be8c-861b0e06052c	33	asignacion_asesor	Caso asignado	Se te ha asignado el caso #33	t	2026-07-17 16:06:13.16697+00	2026-07-21 16:41:09.191+00
168	bbde362e-ad70-445c-be8c-861b0e06052c	9	documento_subido	Documento subido	Se subio un nuevo documento al caso #9	t	2026-07-17 16:45:09.224173+00	2026-07-21 16:41:09.191+00
169	bbde362e-ad70-445c-be8c-861b0e06052c	28	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #28	t	2026-07-17 18:50:45.621673+00	2026-07-21 16:41:09.191+00
170	bbde362e-ad70-445c-be8c-861b0e06052c	31	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #31	t	2026-07-17 19:00:07.633232+00	2026-07-21 16:41:09.191+00
171	bbde362e-ad70-445c-be8c-861b0e06052c	31	documento_subido	Documento subido	Se subio un nuevo documento al caso #31	t	2026-07-17 19:03:27.705262+00	2026-07-21 16:41:09.191+00
172	bbde362e-ad70-445c-be8c-861b0e06052c	28	documento_subido	Documento subido	Se subio un nuevo documento al caso #28	t	2026-07-17 19:04:11.780933+00	2026-07-21 16:41:09.191+00
173	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-18 01:38:15.81056+00	2026-07-21 16:41:09.191+00
174	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 02:23:43.419387+00	2026-07-21 16:41:09.191+00
175	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 02:23:53.338036+00	2026-07-21 16:41:09.191+00
176	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-18 06:51:24.175407+00	2026-07-21 16:41:09.191+00
177	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 06:51:44.768881+00	2026-07-21 16:41:09.191+00
178	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-18 06:53:44.752706+00	2026-07-21 16:41:09.191+00
179	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 07:00:04.446791+00	2026-07-21 16:41:09.191+00
180	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 07:00:13.058768+00	2026-07-21 16:41:09.191+00
181	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 07:00:20.358583+00	2026-07-21 16:41:09.191+00
182	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	t	2026-07-18 07:00:33.696996+00	2026-07-21 16:41:09.191+00
195	bbde362e-ad70-445c-be8c-861b0e06052c	27	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #27	t	2026-07-21 15:28:34.875688+00	2026-07-21 16:41:09.191+00
200	bbde362e-ad70-445c-be8c-861b0e06052c	30	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #30	t	2026-07-21 15:42:05.707628+00	2026-07-21 16:41:09.191+00
201	bbde362e-ad70-445c-be8c-861b0e06052c	30	documento_subido	Documento subido	Se subio un nuevo documento al caso #30	t	2026-07-21 15:42:38.358408+00	2026-07-21 16:41:09.191+00
203	bbde362e-ad70-445c-be8c-861b0e06052c	32	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #32	t	2026-07-21 16:14:37.451615+00	2026-07-21 16:41:09.191+00
204	bbde362e-ad70-445c-be8c-861b0e06052c	35	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #35	t	2026-07-21 16:18:33.415391+00	2026-07-21 16:41:09.191+00
205	bbde362e-ad70-445c-be8c-861b0e06052c	27	documento_subido	Documento subido	Se subio un nuevo documento al caso #27	t	2026-07-21 16:20:31.793385+00	2026-07-21 16:41:09.191+00
206	bbde362e-ad70-445c-be8c-861b0e06052c	27	documento_subido	Documento subido	Se subio un nuevo documento al caso #27	t	2026-07-21 16:20:40.887598+00	2026-07-21 16:41:09.191+00
207	bbde362e-ad70-445c-be8c-861b0e06052c	35	documento_subido	Documento subido	Se subio un nuevo documento al caso #35	t	2026-07-21 16:20:44.3007+00	2026-07-21 16:41:09.191+00
208	bbde362e-ad70-445c-be8c-861b0e06052c	36	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #36	t	2026-07-21 16:21:40.460034+00	2026-07-21 16:41:09.191+00
209	bbde362e-ad70-445c-be8c-861b0e06052c	32	observacion	Nueva observacion	Hay una nueva observacion en el caso #32	t	2026-07-21 16:22:42.60289+00	2026-07-21 16:41:09.191+00
217	bbde362e-ad70-445c-be8c-861b0e06052c	29	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #29	t	2026-07-21 16:33:59.854163+00	2026-07-21 16:41:09.191+00
219	bbde362e-ad70-445c-be8c-861b0e06052c	29	documento_subido	Documento subido	Se subio un nuevo documento al caso #29	t	2026-07-21 16:38:15.729624+00	2026-07-21 16:41:09.191+00
220	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	29	aprobacion	Caso aprobado	El asesor aprobo el caso #29	f	2026-07-21 16:41:43.071928+00	\N
226	bbde362e-ad70-445c-be8c-861b0e06052c	20	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #20	t	2026-07-21 17:31:51.215542+00	2026-07-22 15:08:05.651+00
243	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	20	aprobacion	Caso aprobado	El asesor aprobo el caso #20	f	2026-07-22 15:44:55.231493+00	\N
254	ece5557b-c859-4da3-bd35-f1d2b3beb586	40	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #40	t	2026-07-22 16:00:38.217497+00	2026-07-22 16:26:15.753+00
288	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	10	observacion	Nueva observacion	Hay una nueva observacion en el caso #10	t	2026-07-27 14:32:48.877604+00	2026-07-27 14:44:02.196+00
250	8a923944-1c53-4584-94c1-f72c0848d04b	39	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #39	t	2026-07-22 15:57:21.088818+00	2026-07-27 15:12:37.818+00
290	bbde362e-ad70-445c-be8c-861b0e06052c	41	asignacion_asesor	Caso asignado	Se te ha asignado el caso #41	t	2026-07-27 15:06:30.475743+00	2026-07-27 15:26:10.772+00
293	bbde362e-ad70-445c-be8c-861b0e06052c	42	asignacion_asesor	Caso asignado	Se te ha asignado el caso #42	t	2026-07-27 15:14:25.276884+00	2026-07-27 15:26:10.772+00
237	bbde362e-ad70-445c-be8c-861b0e06052c	36	documento_subido	Documento subido	Se subio un nuevo documento al caso #36	t	2026-07-22 15:43:21.631125+00	2026-07-27 15:26:10.772+00
241	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:33.675387+00	2026-07-27 15:26:10.772+00
242	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:47.753927+00	2026-07-27 15:26:10.772+00
251	bbde362e-ad70-445c-be8c-861b0e06052c	39	asignacion_asesor	Caso asignado	Se te ha asignado el caso #39	t	2026-07-22 15:57:21.213975+00	2026-07-27 15:26:10.772+00
259	bbde362e-ad70-445c-be8c-861b0e06052c	37	documento_subido	Documento subido	Se subio un nuevo documento al caso #37	t	2026-07-22 16:21:09.837211+00	2026-07-27 15:26:10.772+00
260	bbde362e-ad70-445c-be8c-861b0e06052c	37	documento_subido	Documento subido	Se subio un nuevo documento al caso #37	t	2026-07-22 16:21:15.914126+00	2026-07-27 15:26:10.772+00
266	bbde362e-ad70-445c-be8c-861b0e06052c	40	documento_subido	Documento subido	Se subio un nuevo documento al caso #40	t	2026-07-22 16:25:54.631405+00	2026-07-27 15:26:10.772+00
272	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	t	2026-07-26 19:44:54.179981+00	2026-07-27 15:26:10.772+00
276	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	t	2026-07-27 03:56:45.848619+00	2026-07-27 15:26:10.772+00
283	bbde362e-ad70-445c-be8c-861b0e06052c	34	documento_subido	Documento subido	Se subio un nuevo documento al caso #34	t	2026-07-27 13:56:47.798224+00	2026-07-27 15:26:10.772+00
232	bbde362e-ad70-445c-be8c-861b0e06052c	37	asignacion_asesor	Caso asignado	Se te ha asignado el caso #37	t	2026-07-22 15:14:47.271703+00	2026-07-27 15:26:10.772+00
238	bbde362e-ad70-445c-be8c-861b0e06052c	16	documento_subido	Documento subido	Se subio un nuevo documento al caso #16	t	2026-07-22 15:44:01.805418+00	2026-07-27 15:26:10.772+00
252	bbde362e-ad70-445c-be8c-861b0e06052c	34	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #34	t	2026-07-22 16:00:06.354372+00	2026-07-27 15:26:10.772+00
253	bbde362e-ad70-445c-be8c-861b0e06052c	34	documento_subido	Documento subido	Se subio un nuevo documento al caso #34	t	2026-07-22 16:00:23.193272+00	2026-07-27 15:26:10.772+00
255	bbde362e-ad70-445c-be8c-861b0e06052c	40	asignacion_asesor	Caso asignado	Se te ha asignado el caso #40	t	2026-07-22 16:00:38.378157+00	2026-07-27 15:26:10.772+00
261	bbde362e-ad70-445c-be8c-861b0e06052c	40	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #40	t	2026-07-22 16:24:30.866972+00	2026-07-27 15:26:10.772+00
273	bbde362e-ad70-445c-be8c-861b0e06052c	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	t	2026-07-26 19:47:48.45829+00	2026-07-27 15:26:10.772+00
277	bbde362e-ad70-445c-be8c-861b0e06052c	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	t	2026-07-27 03:59:07.100324+00	2026-07-27 15:26:10.772+00
284	bbde362e-ad70-445c-be8c-861b0e06052c	39	documento_subido	Documento subido	Se subio un nuevo documento al caso #39	t	2026-07-27 13:57:13.689628+00	2026-07-27 15:26:10.772+00
296	bbde362e-ad70-445c-be8c-861b0e06052c	43	asignacion_asesor	Caso asignado	Se te ha asignado el caso #43	t	2026-07-27 15:16:30.611833+00	2026-07-27 15:26:10.772+00
298	bbde362e-ad70-445c-be8c-861b0e06052c	43	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #43	f	2026-07-27 15:44:51.889437+00	\N
299	bbde362e-ad70-445c-be8c-861b0e06052c	43	documento_subido	Documento subido	Se subio un nuevo documento al caso #43	f	2026-07-27 15:45:35.169593+00	\N
300	bbde362e-ad70-445c-be8c-861b0e06052c	43	documento_subido	Documento subido	Se subio un nuevo documento al caso #43	f	2026-07-27 15:45:42.181821+00	\N
301	bbde362e-ad70-445c-be8c-861b0e06052c	42	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #42	f	2026-07-27 15:48:57.635071+00	\N
302	bbde362e-ad70-445c-be8c-861b0e06052c	42	documento_subido	Documento subido	Se subio un nuevo documento al caso #42	f	2026-07-27 15:51:19.07976+00	\N
303	bbde362e-ad70-445c-be8c-861b0e06052c	42	documento_subido	Documento subido	Se subio un nuevo documento al caso #42	f	2026-07-27 15:51:31.47399+00	\N
305	bbde362e-ad70-445c-be8c-861b0e06052c	44	asignacion_asesor	Caso asignado	Se te ha asignado el caso #44	f	2026-07-27 16:07:20.447333+00	\N
306	bbde362e-ad70-445c-be8c-861b0e06052c	41	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #41	f	2026-07-27 16:19:00.386348+00	\N
307	bbde362e-ad70-445c-be8c-861b0e06052c	41	documento_subido	Documento subido	Se subio un nuevo documento al caso #41	f	2026-07-27 16:26:11.617977+00	\N
308	bbde362e-ad70-445c-be8c-861b0e06052c	38	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #38	f	2026-07-27 16:34:03.271471+00	\N
309	bbde362e-ad70-445c-be8c-861b0e06052c	33	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #33	f	2026-07-27 16:49:57.747802+00	\N
304	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	44	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #44	t	2026-07-27 16:07:20.271373+00	2026-07-27 21:24:52.242+00
310	bbde362e-ad70-445c-be8c-861b0e06052c	44	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #44	f	2026-07-27 21:32:51.242278+00	\N
311	bbde362e-ad70-445c-be8c-861b0e06052c	44	documento_subido	Documento subido	Se subio un nuevo documento al caso #44	f	2026-07-27 21:36:56.353011+00	\N
312	bbde362e-ad70-445c-be8c-861b0e06052c	34	documento_subido	Documento subido	Se subio un nuevo documento al caso #34	f	2026-07-27 22:07:13.519294+00	\N
313	bbde362e-ad70-445c-be8c-861b0e06052c	39	documento_subido	Documento subido	Se subio un nuevo documento al caso #39	f	2026-07-27 23:56:04.385534+00	\N
314	bbde362e-ad70-445c-be8c-861b0e06052c	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	f	2026-07-28 13:26:31.016687+00	\N
315	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	f	2026-07-28 13:39:46.260984+00	\N
316	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	f	2026-07-28 13:40:29.926982+00	\N
317	bbde362e-ad70-445c-be8c-861b0e06052c	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	f	2026-07-28 13:45:47.658987+00	\N
319	bbde362e-ad70-445c-be8c-861b0e06052c	45	asignacion_asesor	Caso asignado	Se te ha asignado el caso #45	f	2026-07-28 13:53:23.38948+00	\N
321	bbde362e-ad70-445c-be8c-861b0e06052c	46	asignacion_asesor	Caso asignado	Se te ha asignado el caso #46	f	2026-07-28 14:31:25.571973+00	\N
322	bbde362e-ad70-445c-be8c-861b0e06052c	45	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #45	f	2026-07-28 14:54:39.753601+00	\N
324	bbde362e-ad70-445c-be8c-861b0e06052c	47	asignacion_asesor	Caso asignado	Se te ha asignado el caso #47	f	2026-07-28 14:57:00.296229+00	\N
325	bbde362e-ad70-445c-be8c-861b0e06052c	46	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #46	f	2026-07-28 15:05:06.746551+00	\N
326	bbde362e-ad70-445c-be8c-861b0e06052c	46	documento_subido	Documento subido	Se subio un nuevo documento al caso #46	f	2026-07-28 15:06:39.801383+00	\N
327	bbde362e-ad70-445c-be8c-861b0e06052c	46	documento_subido	Documento subido	Se subio un nuevo documento al caso #46	f	2026-07-28 15:06:55.290967+00	\N
329	bbde362e-ad70-445c-be8c-861b0e06052c	48	asignacion_asesor	Caso asignado	Se te ha asignado el caso #48	f	2026-07-28 15:08:08.494601+00	\N
330	bbde362e-ad70-445c-be8c-861b0e06052c	45	observacion	Nueva observacion	Hay una nueva observacion en el caso #45	f	2026-07-28 15:09:11.874923+00	\N
331	bbde362e-ad70-445c-be8c-861b0e06052c	45	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #45	f	2026-07-28 15:10:01.738829+00	\N
323	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	47	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #47	t	2026-07-28 14:57:00.137217+00	2026-07-28 15:18:43.554+00
332	bbde362e-ad70-445c-be8c-861b0e06052c	45	documento_subido	Documento subido	Se subio un nuevo documento al caso #45	f	2026-07-28 15:21:56.705285+00	\N
328	ece5557b-c859-4da3-bd35-f1d2b3beb586	48	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #48	t	2026-07-28 15:08:08.3655+00	2026-07-28 15:31:51.167+00
318	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	45	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #45	t	2026-07-28 13:53:23.167346+00	2026-07-29 14:39:41.518+00
320	8a923944-1c53-4584-94c1-f72c0848d04b	46	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #46	t	2026-07-28 14:31:25.410685+00	2026-07-29 16:25:16.655+00
334	bbde362e-ad70-445c-be8c-861b0e06052c	49	asignacion_asesor	Caso asignado	Se te ha asignado el caso #49	f	2026-07-28 15:32:02.390789+00	\N
336	bbde362e-ad70-445c-be8c-861b0e06052c	50	asignacion_asesor	Caso asignado	Se te ha asignado el caso #50	f	2026-07-28 15:34:08.514042+00	\N
337	bbde362e-ad70-445c-be8c-861b0e06052c	47	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #47	f	2026-07-28 15:46:07.945604+00	\N
338	bbde362e-ad70-445c-be8c-861b0e06052c	48	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #48	f	2026-07-28 15:49:51.311643+00	\N
339	bbde362e-ad70-445c-be8c-861b0e06052c	48	documento_subido	Documento subido	Se subio un nuevo documento al caso #48	f	2026-07-28 15:51:24.083052+00	\N
340	bbde362e-ad70-445c-be8c-861b0e06052c	48	documento_subido	Documento subido	Se subio un nuevo documento al caso #48	f	2026-07-28 15:51:29.769199+00	\N
341	bbde362e-ad70-445c-be8c-861b0e06052c	47	documento_subido	Documento subido	Se subio un nuevo documento al caso #47	f	2026-07-28 15:59:29.136785+00	\N
342	bbde362e-ad70-445c-be8c-861b0e06052c	49	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #49	f	2026-07-28 16:24:53.313426+00	\N
343	bbde362e-ad70-445c-be8c-861b0e06052c	38	documento_subido	Documento subido	Se subio un nuevo documento al caso #38	f	2026-07-29 13:42:44.17941+00	\N
344	bbde362e-ad70-445c-be8c-861b0e06052c	38	observacion	Nueva observacion	Hay una nueva observacion en el caso #38	f	2026-07-29 13:44:20.310411+00	\N
345	bbde362e-ad70-445c-be8c-861b0e06052c	49	documento_subido	Documento subido	Se subio un nuevo documento al caso #49	f	2026-07-29 14:01:12.487712+00	\N
346	bbde362e-ad70-445c-be8c-861b0e06052c	49	observacion	Nueva observacion	Hay una nueva observacion en el caso #49	f	2026-07-29 14:28:35.792509+00	\N
347	bbde362e-ad70-445c-be8c-861b0e06052c	45	observacion	Nueva observacion	Hay una nueva observacion en el caso #45	f	2026-07-29 14:29:27.902997+00	\N
333	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	49	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #49	t	2026-07-28 15:32:02.136763+00	2026-07-29 14:39:42.289+00
348	bbde362e-ad70-445c-be8c-861b0e06052c	50	entrevista	Entrevista completada	El estudiante completo la entrevista del caso #50	f	2026-07-29 16:00:41.090113+00	\N
349	bbde362e-ad70-445c-be8c-861b0e06052c	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	f	2026-07-29 16:02:03.192445+00	\N
350	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	f	2026-07-29 16:04:23.079086+00	\N
335	8a923944-1c53-4584-94c1-f72c0848d04b	50	asignacion_estudiante	Caso asignado	Se te ha asignado el caso #50	t	2026-07-28 15:34:08.383224+00	2026-07-29 16:25:16.655+00
351	bbde362e-ad70-445c-be8c-861b0e06052c	11	observacion	Nueva observacion	Hay una nueva observacion en el caso #11	f	2026-07-29 16:28:38.718141+00	\N
352	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	f	2026-07-29 16:33:19.044187+00	\N
353	bbde362e-ad70-445c-be8c-861b0e06052c	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	f	2026-07-29 16:37:26.912089+00	\N
354	bbde362e-ad70-445c-be8c-861b0e06052c	11	documento_subido	Documento subido	Se subio un nuevo documento al caso #11	f	2026-07-29 16:37:56.138327+00	\N
355	bbde362e-ad70-445c-be8c-861b0e06052c	11	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #11	f	2026-07-29 16:39:14.682172+00	\N
356	bbde362e-ad70-445c-be8c-861b0e06052c	19	documento_subido	Documento subido	Se subio un nuevo documento al caso #19	f	2026-07-30 12:49:17.701641+00	\N
357	bbde362e-ad70-445c-be8c-861b0e06052c	19	observacion	Nueva observacion	Hay una nueva observacion en el caso #19	f	2026-07-30 12:54:04.064932+00	\N
358	bbde362e-ad70-445c-be8c-861b0e06052c	19	actividad_registrada	Nueva actividad	Se registro una nueva actividad en el caso #19	f	2026-07-30 13:00:38.201551+00	\N
359	bbde362e-ad70-445c-be8c-861b0e06052c	34	documento_subido	Documento subido	Se subio un nuevo documento al caso #34	f	2026-07-30 15:51:27.837021+00	\N
360	bbde362e-ad70-445c-be8c-861b0e06052c	34	documento_subido	Documento subido	Se subio un nuevo documento al caso #34	f	2026-07-30 15:51:37.6605+00	\N
\.


--
-- Data for Name: perfiles_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perfiles_roles" ("id", "user_id", "role") FROM stdin;
1	1b35a5ec-c188-4e69-b68c-d37f158859e2	admin
5	fac90012-570f-4d3c-90e2-dd3d991e5aec	estudiante
6	2ee91872-abbe-4d2e-be03-8e4eb3b47e05	estudiante
7	c803bbe3-fdaf-4a0a-83c3-eb37eac4e69b	asesor
8	fb42a92d-b85a-4718-a456-1b8953871eaa	pro_apoyo
9	a5c3f506-7bf6-4a27-af1c-c26035301e50	asesor
10	b05fe275-d1f1-4af9-82af-06a688751425	admin
11	8a923944-1c53-4584-94c1-f72c0848d04b	estudiante
12	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	estudiante
13	ece5557b-c859-4da3-bd35-f1d2b3beb586	estudiante
14	bbde362e-ad70-445c-be8c-861b0e06052c	asesor
15	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	estudiante
16	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	estudiante
17	180699bd-c51c-4921-baed-7e3f18d72a42	asesor
18	a83bd223-61a7-4ece-9ccf-40f3771c5a5c	asesor
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."role_permissions" ("id", "role", "permission") FROM stdin;
1	estudiante	casos_asignados.read
2	estudiante	casos_asignados.update
3	asesor	casos_asignados.read
4	asesor	casos_asignados.update
5	admin	casos.delete
6	admin	usuarios.delete
7	admin	estudiantes.delete
8	admin	asesores.delete
9	admin	contratos_laborales.delete
10	admin	estudiantes_casos.delete
11	admin	asesores_casos.delete
12	admin	demandados.delete
13	admin	perfiles.delete
14	admin	casos.update
15	admin	usuarios.update
16	admin	estudiantes.update
17	admin	asesores.update
18	admin	contratos_laborales.update
19	admin	estudiantes_casos.update
20	admin	asesores_casos.update
21	admin	demandados.update
22	admin	perfiles.update
23	admin	casos.create
24	admin	usuarios.create
25	admin	estudiantes.create
26	admin	asesores.create
27	admin	contratos_laborales.create
28	admin	estudiantes_casos.create
29	admin	asesores_casos.create
30	admin	demandados.create
31	admin	perfiles.insert
32	admin	casos.read
33	admin	usuarios.read
34	admin	estudiantes.read
35	admin	asesores.read
36	admin	contratos_laborales.read
37	admin	estudiantes_casos.read
38	admin	asesores_casos.read
39	admin	demandados.read
40	admin	perfiles.read
41	admin	casos_asignados.read
42	admin	casos_asignados.update
43	pro_apoyo	usuarios.create
44	pro_apoyo	usuarios.read
45	pro_apoyo	usuarios.update
46	pro_apoyo	perfiles.read
47	pro_apoyo	perfiles.update
48	pro_apoyo	casos.create
49	pro_apoyo	casos.read
50	pro_apoyo	casos.update
51	pro_apoyo	estudiantes.read
52	pro_apoyo	estudiantes.update
53	pro_apoyo	estudiantes_casos.read
54	pro_apoyo	estudiantes_casos.update
55	pro_apoyo	estudiantes_casos.delete
56	pro_apoyo	estudiantes_casos.create
57	pro_apoyo	asesores.read
58	pro_apoyo	asesores.update
59	pro_apoyo	asesores_casos.create
60	pro_apoyo	asesores_casos.read
61	pro_apoyo	asesores_casos.update
62	pro_apoyo	asesores_casos.delete
63	pro_apoyo	demandados.read
64	pro_apoyo	demandados.create
65	pro_apoyo	demandados.update
66	estudiante	usuarios.read
67	estudiante	usuarios.update
68	estudiante	demandados.read
69	estudiante	demandados.update
70	estudiante	demandados.create
71	estudiante	contratos_laborales.create
72	estudiante	perfiles.read
73	estudiante	asesores.read
74	estudiante	estudiantes_casos.read
75	estudiante	asesores_casos.read
76	asesor	demandados.read
77	asesor	perfiles.read
78	asesor	estudiantes.read
79	asesor	estudiantes_casos.read
80	asesor	asesores_casos.read
81	asesor	usuarios.read
82	admin	perfiles_roles.read
83	asesor	usuarios.update
84	asesor	demandados.update
85	estudiante	contratos_laborales.read
86	estudiante	contratos_laborales.update
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
documentos-casos	documentos-casos	\N	2026-07-07 00:38:07.935106+00	2026-07-07 00:38:07.935106+00	f	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
d5bd3f79-53c0-4589-844e-b66a8e1017a0	documentos-casos	5/05018721-8d01-4655-bd2e-2533301bfb80.pdf	\N	2026-07-08 16:04:26.80768+00	2026-07-08 16:04:26.80768+00	2026-07-08 16:04:26.80768+00	{"eTag": "\\"358ec25a200abfc5f51d92fd1c2e9994\\"", "size": 1461824, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-08T16:04:27.000Z", "contentLength": 1461824, "httpStatusCode": 200}	026725fc-1e31-4a0c-9103-0284f4ffe8c7	\N	{}
e71b59cf-499d-4207-b78a-f0b6a04696c4	documentos-casos	11/995b535c-590e-4a9c-9cdb-46a31ccf6da9.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-15 16:40:45.69317+00	2026-07-15 16:40:45.69317+00	2026-07-15 16:40:45.69317+00	{"eTag": "\\"fa304480721000ce095da0fa634bb5c7\\"", "size": 116375, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-15T16:40:46.000Z", "contentLength": 116375, "httpStatusCode": 200}	eaee099e-feb6-497f-85e6-1b6255b20f63	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
cd261cb8-0602-48e2-86d3-bf857c85df13	documentos-casos	12/771d33ad-b868-4b1d-a1cc-4d4918f9a3a4.pdf	\N	2026-07-09 16:17:26.198149+00	2026-07-09 16:17:26.198149+00	2026-07-09 16:17:26.198149+00	{"eTag": "\\"652e241378ef29e7638fd051df322ae2\\"", "size": 1786321, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-09T16:17:27.000Z", "contentLength": 1786321, "httpStatusCode": 200}	1b803443-4bf1-4fe4-b38d-8e726aad23fb	\N	{}
67cd004e-ea7d-487d-b42a-6bde6f19a7db	documentos-casos	47/1d981da8-547d-4db0-bf9f-7ca6bbe0d006.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-28 15:59:28.528047+00	2026-07-28 15:59:28.528047+00	2026-07-28 15:59:28.528047+00	{"eTag": "\\"9cd2adf0d10dd673a0816eed8d2bc246\\"", "size": 8377304, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:59:29.000Z", "contentLength": 8377304, "httpStatusCode": 200}	e0b095af-ada5-4376-bb7b-7a39c374f342	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
83e8885a-66cb-46db-b53e-828b72e65093	documentos-casos	8/dbe716c6-25a7-43cc-978c-d5fa47c1f381.pdf	\N	2026-07-09 16:28:41.10586+00	2026-07-09 16:28:41.10586+00	2026-07-09 16:28:41.10586+00	{"eTag": "\\"4d43fe0a0b389ea76177d14ad5f4d568\\"", "size": 3218750, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-09T16:28:41.000Z", "contentLength": 3218750, "httpStatusCode": 200}	052178c7-9272-44db-8615-6bd81f570b83	\N	{}
be1b8104-bd45-47c2-a841-934482b7b018	documentos-casos	19/dbf9fa7c-67c0-46ab-8485-03d4ce316b57.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 23:22:10.611957+00	2026-07-16 23:22:10.611957+00	2026-07-16 23:22:10.611957+00	{"eTag": "\\"ad2efab6db4ec976b27f2a9681473f3b\\"", "size": 36659, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T23:22:11.000Z", "contentLength": 36659, "httpStatusCode": 200}	3cdd3e0b-1a8c-4359-bd92-8148a3cf6ee2	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
1c49b87c-9a31-4b2b-a678-179147e68973	documentos-casos	10/bf074c2f-7822-4a8f-a04d-ea4424749471.pdf	\N	2026-07-10 00:20:20.079031+00	2026-07-10 00:20:20.079031+00	2026-07-10 00:20:20.079031+00	{"eTag": "\\"4d288b9b93a8d037780146cdf67eb627\\"", "size": 771846, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T00:20:21.000Z", "contentLength": 771846, "httpStatusCode": 200}	8751ad97-db82-4b4e-89a7-e6693a108ad2	\N	{}
1dc69e4f-eab5-4b0d-abab-468c097aeb60	documentos-casos	10/cc20d58d-f05a-47a0-8687-2090448bceef.pdf	\N	2026-07-10 00:20:49.598285+00	2026-07-10 00:20:49.598285+00	2026-07-10 00:20:49.598285+00	{"eTag": "\\"a5bcd9255d66ad2db3bab63daa2cceb1\\"", "size": 1330271, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T00:20:50.000Z", "contentLength": 1330271, "httpStatusCode": 200}	4acd6e20-a7bb-4b7e-874c-ba6519d28f06	\N	{}
2004d3ce-36d1-4048-b464-c4aa4e9af7e6	documentos-casos	11/ae3e6896-8e27-4ba4-aae0-9da544d2e13e.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 07:00:20.123849+00	2026-07-18 07:00:20.123849+00	2026-07-18 07:00:20.123849+00	{"eTag": "\\"8d82249ddc275a2d051892d31673edd5\\"", "size": 1885390, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T07:00:21.000Z", "contentLength": 1885390, "httpStatusCode": 200}	4b0ec405-2e1b-4bc6-a4e8-8785a15f1841	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
75ed97d9-4979-4fb9-bcd5-08f82427d550	documentos-casos	10/0ed8b00b-b76b-45e7-b4d0-79debca801be.pdf	\N	2026-07-10 01:05:07.744629+00	2026-07-10 01:05:07.744629+00	2026-07-10 01:05:07.744629+00	{"eTag": "\\"5a5a6d6d69e566d7fa8c722b1defc13e\\"", "size": 2405758, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T01:05:08.000Z", "contentLength": 2405758, "httpStatusCode": 200}	996cd7df-34b6-4c1c-8342-dfcbaca1ec5d	\N	{}
9a00e58d-4e11-4dd9-b5ce-b047825f62e5	documentos-casos	15/258ecc9b-aa29-4c3a-9fa9-ce24c7187edc.pdf	\N	2026-07-10 16:09:59.824906+00	2026-07-10 16:09:59.824906+00	2026-07-10 16:09:59.824906+00	{"eTag": "\\"c8dabf760ed9ed7fc48262e5bff4b5eb\\"", "size": 1943644, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:10:00.000Z", "contentLength": 1943644, "httpStatusCode": 200}	4155f690-baa0-4647-b93c-c35bfab57671	\N	{}
d376ad6f-40ed-4741-96cc-204e3b375681	documentos-casos	16/2c8e94a4-2c09-4cc7-9c36-eaa79a326381.jpeg	\N	2026-07-10 16:13:02.590609+00	2026-07-10 16:13:02.590609+00	2026-07-10 16:13:02.590609+00	{"eTag": "\\"cc7597c055c0ed813d63e2cf95413035\\"", "size": 938219, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:13:03.000Z", "contentLength": 938219, "httpStatusCode": 200}	26233398-f131-4bdc-adea-397f91e9383d	\N	{}
8367427c-45af-408d-89ac-e2c4a2f11c16	documentos-casos	16/7a1569b3-8193-4daa-a51d-ad6a9c34b6ed.jpeg	\N	2026-07-10 16:13:27.446328+00	2026-07-10 16:13:27.446328+00	2026-07-10 16:13:27.446328+00	{"eTag": "\\"cc7597c055c0ed813d63e2cf95413035\\"", "size": 938219, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:13:28.000Z", "contentLength": 938219, "httpStatusCode": 200}	272d90a3-1ac1-48b5-9007-037ea87ff070	\N	{}
f70a8d8f-4333-4352-b305-272a0befe352	documentos-casos	16/5ba51a94-4874-4a5a-825e-ceae2cfbcc7e.jpeg	\N	2026-07-10 16:13:48.346124+00	2026-07-10 16:13:48.346124+00	2026-07-10 16:13:48.346124+00	{"eTag": "\\"947d01ee2397328df89aa17029d90a61\\"", "size": 981006, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:13:49.000Z", "contentLength": 981006, "httpStatusCode": 200}	cd89bb35-cb7b-4724-b03e-eba89c9f02f7	\N	{}
57e04a3a-5277-4454-ab1a-50aa225758f7	documentos-casos	14/7c1af02b-62d8-4b64-a018-fca85dfd4f98.pdf	\N	2026-07-10 16:30:40.727474+00	2026-07-10 16:30:40.727474+00	2026-07-10 16:30:40.727474+00	{"eTag": "\\"101b1c0093646dff9539e2cfcbbd560a\\"", "size": 1242740, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:30:41.000Z", "contentLength": 1242740, "httpStatusCode": 200}	a3974b91-bb6b-4ae1-a214-5cfbc6f401ce	\N	{}
5ab6539d-017d-49c8-bf0e-e62da34fb3d8	documentos-casos	11/b84b1812-7ca2-4d7d-a7c2-432ab82d8be4.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 02:27:28.102571+00	2026-07-16 02:27:28.102571+00	2026-07-16 02:27:28.102571+00	{"eTag": "\\"6081fea2d501f742c89247374af0fc10\\"", "size": 221444, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T02:27:29.000Z", "contentLength": 221444, "httpStatusCode": 200}	3f0ce484-3237-4427-808b-f441ed67ab5b	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
c07e1c2a-8c23-49fc-ad23-2fe057804264	documentos-casos	17/0394249e-27b0-4479-a6d7-66c5fa14021a.jpg	\N	2026-07-10 16:44:18.401305+00	2026-07-10 16:44:18.401305+00	2026-07-10 16:44:18.401305+00	{"eTag": "\\"dadb8891d710ccad32af1043bf944be2\\"", "size": 4042450, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:44:19.000Z", "contentLength": 4042450, "httpStatusCode": 200}	1e78c538-e586-4e57-a1fe-fa687216b39e	\N	{}
cfba40ef-00e8-4d34-ac0b-bcfbb3394c11	documentos-casos	38/24eff9ef-8002-4114-b268-3b1972e2a22b.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-29 13:42:43.674065+00	2026-07-29 13:42:43.674065+00	2026-07-29 13:42:43.674065+00	{"eTag": "\\"035faf1a619b98575fb24d53c27fe40b\\"", "size": 306219, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-29T13:42:44.000Z", "contentLength": 306219, "httpStatusCode": 200}	5b5e2373-38b9-4a06-b5ee-2f12ab4b6974	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
a594d336-cc43-4847-9788-9b1d701ea0f0	documentos-casos	9/30bd97d5-9632-4872-92c5-8ff3e25c7103.docx	\N	2026-07-10 16:44:26.201899+00	2026-07-10 16:44:26.201899+00	2026-07-10 16:44:26.201899+00	{"eTag": "\\"5e95123e572e741514afed8fb3401f59\\"", "size": 24359, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:44:27.000Z", "contentLength": 24359, "httpStatusCode": 200}	3487e7ed-f52e-46d1-9892-1288beb55d3b	\N	{}
afb364ca-16a6-45c7-95f0-2c35b2648852	documentos-casos	9/03ab0de7-dd34-4e37-ae44-246fc7cae4ec.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-17 16:45:08.755696+00	2026-07-17 16:45:08.755696+00	2026-07-17 16:45:08.755696+00	{"eTag": "\\"f1547a41c46fb5fb997d9335822dda46\\"", "size": 389995, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-17T16:45:09.000Z", "contentLength": 389995, "httpStatusCode": 200}	16eb47bb-66a6-43d7-be3d-167d0b8666bf	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
649971fb-e1c2-4292-966d-79395e896ee4	documentos-casos	17/b49da9c9-0ad5-4fee-a9a3-51160345a334.jpg	\N	2026-07-10 16:44:30.658545+00	2026-07-10 16:44:30.658545+00	2026-07-10 16:44:30.658545+00	{"eTag": "\\"ad913b2065c75b0850f2df01b4767976\\"", "size": 3781427, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:44:31.000Z", "contentLength": 3781427, "httpStatusCode": 200}	0875c5cf-8350-4e0e-aad6-945449fd568b	\N	{}
678d6d50-bc89-4d45-aed1-7ee560c10c54	documentos-casos	11/4c264e37-7380-4c0e-b4b8-9ddf23ddafac.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:27:08.143485+00	2026-07-14 15:27:08.143485+00	2026-07-14 15:27:08.143485+00	{"eTag": "\\"41b4a3586a5c6f0be35b264e0e8dfcb8\\"", "size": 2739148, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:27:08.000Z", "contentLength": 2739148, "httpStatusCode": 200}	7dcea7a4-ce35-40c9-b77d-d665d4eb087c	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
b595a6ef-5801-4df9-8a9e-096ec93567bd	documentos-casos	11/d49976aa-de52-4f87-a638-09c85b7f65c4.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 07:00:33.46097+00	2026-07-18 07:00:33.46097+00	2026-07-18 07:00:33.46097+00	{"eTag": "\\"b57e9c80283324e1fb94819ac3d78e7a\\"", "size": 346579, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T07:00:34.000Z", "contentLength": 346579, "httpStatusCode": 200}	34e59f1a-3aad-4cf8-9a90-2a9eae359216	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
c3759d14-ba1d-4195-8dc6-ea3d2cabd7fc	documentos-casos	11/5e460dcb-e2c7-4931-a3f8-1a15341750d6.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:27:21.806419+00	2026-07-14 15:27:21.806419+00	2026-07-14 15:27:21.806419+00	{"eTag": "\\"dbbbfe88f6cde898858b0ffee304ab3b\\"", "size": 2990648, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:27:22.000Z", "contentLength": 2990648, "httpStatusCode": 200}	0d7a83c1-5dc6-4690-b9b1-1dfa03ecaba4	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
1b1129de-6053-4cee-a1b9-41d78f37d287	documentos-casos	32/158c67df-862c-4066-9b9f-670127a5f008.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-21 16:46:36.077635+00	2026-07-21 16:46:36.077635+00	2026-07-21 16:46:36.077635+00	{"eTag": "\\"e00acefee06b921a8cb8bba99be04c1d\\"", "size": 529015, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:46:37.000Z", "contentLength": 529015, "httpStatusCode": 200}	67cd8365-7036-4d97-8058-68ccd5f13c65	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
bb2cf447-68fa-4de7-8a24-54a29a341353	documentos-casos	11/368c606c-1683-417f-bbaa-78e705d5b038.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:27:34.174657+00	2026-07-14 15:27:34.174657+00	2026-07-14 15:27:34.174657+00	{"eTag": "\\"2a72910a823fb797235a0d1a7951a79d\\"", "size": 2005540, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:27:35.000Z", "contentLength": 2005540, "httpStatusCode": 200}	71fa09d2-68b3-40fb-a581-4647994bac92	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
d6f1113c-6c2d-4d18-aea6-0ee78c3783fe	documentos-casos	11/c83e9188-eae1-40ef-8193-5fa016535be4.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:28:35.601671+00	2026-07-14 15:28:35.601671+00	2026-07-14 15:28:35.601671+00	{"eTag": "\\"2434d866824955b4dac67cea665065d4\\"", "size": 2457539, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:28:36.000Z", "contentLength": 2457539, "httpStatusCode": 200}	9559d5a1-0fd8-4906-9075-95a8db1bb4d4	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
0ea11f3f-4a30-4535-9233-12e166e521dd	documentos-casos	11/be13afd7-0898-40d6-a488-f8157d75d3d4.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:28:52.723154+00	2026-07-14 15:28:52.723154+00	2026-07-14 15:28:52.723154+00	{"eTag": "\\"914132ea68d3e13ee4cafbe52630e611\\"", "size": 2250481, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:28:53.000Z", "contentLength": 2250481, "httpStatusCode": 200}	1723048f-dd8e-4085-90f0-d57ab6453d05	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
5c0f3081-bdb4-484b-a2df-07e438c8135b	documentos-casos	11/757d9485-4ff6-472e-ae31-4cf4c1ed6197.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:29:06.484443+00	2026-07-14 15:29:06.484443+00	2026-07-14 15:29:06.484443+00	{"eTag": "\\"3fd728ebc74299b74759e260e21f6e70\\"", "size": 2237587, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:29:07.000Z", "contentLength": 2237587, "httpStatusCode": 200}	88d45459-d403-4464-bf35-eee457205fc4	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
1e27d279-95f2-4148-aa44-f05a8f159772	documentos-casos	11/800448e3-654b-40fb-af86-cda963c4b732.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:29:15.723683+00	2026-07-14 15:29:15.723683+00	2026-07-14 15:29:15.723683+00	{"eTag": "\\"ca768cbc33ff6e322c131d7df933a4ae\\"", "size": 2349645, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:29:16.000Z", "contentLength": 2349645, "httpStatusCode": 200}	1aec64a9-2d61-49a6-bbd0-613a8702eae5	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
8e1e41c5-d7ef-4699-8f3a-00eb413323b8	documentos-casos	20/2def3d1d-661e-4a0d-97f7-e20976c69c80.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-16 15:58:13.254337+00	2026-07-16 15:58:13.254337+00	2026-07-16 15:58:13.254337+00	{"eTag": "\\"07d043a141f5420c9323439ff84f6756\\"", "size": 1755564, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T15:58:14.000Z", "contentLength": 1755564, "httpStatusCode": 200}	a177dfe5-a04f-42ca-8190-07dd8982cc70	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
7af8f2d3-7843-4c1b-aa69-91180746b6c3	documentos-casos	11/11273e60-260b-42c4-9f52-2deaa57375c4.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:29:25.587543+00	2026-07-14 15:29:25.587543+00	2026-07-14 15:29:25.587543+00	{"eTag": "\\"dfb70eab86134b740ebabba12aa09ae4\\"", "size": 2453620, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:29:26.000Z", "contentLength": 2453620, "httpStatusCode": 200}	d48fbefb-a1c0-4583-bcff-4319f8ba7a8f	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
23f2f0e8-782f-4016-994e-1b82800ec408	documentos-casos	49/67c7b0e3-6427-4d0c-9b36-f667c564975b.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-29 14:01:12.060529+00	2026-07-29 14:01:12.060529+00	2026-07-29 14:01:12.060529+00	{"eTag": "\\"151a737b3f77f33d8b906aa66481722b\\"", "size": 321454, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-29T14:01:12.000Z", "contentLength": 321454, "httpStatusCode": 200}	ee77c11a-e0fc-493e-9e44-18409218107b	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
81fe47d7-156f-42cf-b4c1-766e8e6edcbd	documentos-casos	11/97948694-c3c7-442c-b8e7-e316e9759608.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:30:39.129273+00	2026-07-14 15:30:39.129273+00	2026-07-14 15:30:39.129273+00	{"eTag": "\\"3eb5c1dbda746fa1fb50814405012b82\\"", "size": 3032496, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:30:40.000Z", "contentLength": 3032496, "httpStatusCode": 200}	f683f641-5878-4fe7-8d2f-883f5c4dca99	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
fa9cc2f5-9347-4fb5-93f5-ea56c61a91e5	documentos-casos	31/b5d361fd-395a-4b1f-9f97-c013550670a0.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-17 19:03:27.267419+00	2026-07-17 19:03:27.267419+00	2026-07-17 19:03:27.267419+00	{"eTag": "\\"e35bc86cfba68a0269ab98e18222031e\\"", "size": 773204, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-17T19:03:28.000Z", "contentLength": 773204, "httpStatusCode": 200}	7416666b-619e-487f-8f17-8c02f4af58f5	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
b2cb26ae-8414-4753-a694-ee0257574f62	documentos-casos	28/f83e27c9-85b2-49a4-bf3c-b708bba66b43.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-17 19:04:11.451933+00	2026-07-17 19:04:11.451933+00	2026-07-17 19:04:11.451933+00	{"eTag": "\\"656041a314fe28c2a3f9b7b9631f7ee0\\"", "size": 718620, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-17T19:04:12.000Z", "contentLength": 718620, "httpStatusCode": 200}	efac3357-fef9-4210-873c-a429b8bc9b24	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
89ad019a-d668-4787-a1be-f60356fd2a4d	documentos-casos	30/a9f48f19-3b98-4c19-8cae-2d26d10c5497.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-21 15:42:37.955487+00	2026-07-21 15:42:37.955487+00	2026-07-21 15:42:37.955487+00	{"eTag": "\\"b60c910b7acef0a39f6d275a3cc658c2\\"", "size": 866472, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T15:42:38.000Z", "contentLength": 866472, "httpStatusCode": 200}	b59e9a4b-d33c-4e89-9f06-1a351a18a500	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
7d5d0c0b-3615-4367-b971-139a49353d2c	documentos-casos	35/f7034470-4600-45ab-80eb-fd61b85786ab.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-22 15:22:43.80205+00	2026-07-22 15:22:43.80205+00	2026-07-22 15:22:43.80205+00	{"eTag": "\\"2024414cf3a879ea0435469c0991fa99\\"", "size": 1897318, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:22:44.000Z", "contentLength": 1897318, "httpStatusCode": 200}	10a34e82-3661-4b41-a815-61a097de2148	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
957de01f-53fd-4e84-a9a4-c772f43786ef	documentos-casos	32/c08e2c96-05b0-46dc-b75a-2ac7b0bc83db.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-22 15:39:08.802923+00	2026-07-22 15:39:08.802923+00	2026-07-22 15:39:08.802923+00	{"eTag": "\\"82cc9b73c8c609e9bf3536c45ee70e8d\\"", "size": 477842, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:39:09.000Z", "contentLength": 477842, "httpStatusCode": 200}	a7e538a8-6041-43b9-b559-12668b3af4d9	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
96decee7-7884-497a-83d5-0b31cbd4c826	documentos-casos	11/2459d1d9-f0ee-4e44-a75c-70f70cf562e3.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:29:33.153081+00	2026-07-14 15:29:33.153081+00	2026-07-14 15:29:33.153081+00	{"eTag": "\\"82bcd7ad65c29c513cc18756c24d8f08\\"", "size": 2325016, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:29:34.000Z", "contentLength": 2325016, "httpStatusCode": 200}	54b49a4f-efca-472f-8d29-402c14dbbc16	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
214064c6-162c-4bcc-9f0d-a872606d6627	documentos-casos	22/b22644bb-501e-4c63-8bef-a9233284610b.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-16 16:38:07.438535+00	2026-07-16 16:38:07.438535+00	2026-07-16 16:38:07.438535+00	{"eTag": "\\"c065f8e138c59591eb5eded40f36f661\\"", "size": 901173, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T16:38:08.000Z", "contentLength": 901173, "httpStatusCode": 200}	c9ca5bd3-90b7-48ed-88b5-8f32d09524e5	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
a744dc25-6c16-4b84-81e0-b8d8a4777fd7	documentos-casos	11/c6b98f3b-062a-4f1c-969e-96560fd6a5bd.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 15:30:56.792304+00	2026-07-14 15:30:56.792304+00	2026-07-14 15:30:56.792304+00	{"eTag": "\\"dbaaae47d55a0f8873b4f3d9adec5808\\"", "size": 1588542, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T15:30:57.000Z", "contentLength": 1588542, "httpStatusCode": 200}	265f163c-f57c-44f9-af36-58e08d231106	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ff2c41e3-65cf-4349-b8af-109b4a8fca4e	documentos-casos	11/f05a2994-5c69-4ff7-ab16-286e253daa03.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-29 16:33:18.397596+00	2026-07-29 16:33:18.397596+00	2026-07-29 16:33:18.397596+00	{"eTag": "\\"ee8ae6dcbfdae804fcd791b95986ce91\\"", "size": 2197747, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-29T16:33:19.000Z", "contentLength": 2197747, "httpStatusCode": 200}	10482da7-d343-4c26-b9ce-23a185ad7d54	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
7caf0bc2-fc32-44f6-b453-b38b1cdba2e5	documentos-casos	11/502265ad-2282-4c3c-81d1-0f1658c44399.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:21:22.582334+00	2026-07-14 16:21:22.582334+00	2026-07-14 16:21:22.582334+00	{"eTag": "\\"c087f6c9afcea278760785771a1d823f\\"", "size": 2331820, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:21:23.000Z", "contentLength": 2331820, "httpStatusCode": 200}	97b29d14-ca3c-4c94-b0cf-039e37c2a60a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
2efd0224-6353-43a2-9a9e-28b357df9e92	documentos-casos	22/c0ef5995-02d0-439f-a201-000daa2c9294.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-16 16:38:14.492822+00	2026-07-16 16:38:14.492822+00	2026-07-16 16:38:14.492822+00	{"eTag": "\\"b3277a3415b5df5845f94219b2a0ceff\\"", "size": 1001623, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T16:38:15.000Z", "contentLength": 1001623, "httpStatusCode": 200}	af3f4717-ce59-4f09-b748-d67f57ef79f3	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
a72d0497-f53f-464c-af53-8fe904c418a0	documentos-casos	11/b7bf8e0b-662d-444e-8552-f0f88a463f7a.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:22:26.62854+00	2026-07-14 16:22:26.62854+00	2026-07-14 16:22:26.62854+00	{"eTag": "\\"1ca795560acc3d85f0659a44b7399ff3\\"", "size": 3191213, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:22:27.000Z", "contentLength": 3191213, "httpStatusCode": 200}	fbcd37da-8892-4ec2-9d37-352e5ff03e44	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ae78e805-2b9b-477e-8c5c-4f0ff57dd93f	documentos-casos	11/63f3e24d-48bf-4fc2-801a-874c8c268cc8.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:22:36.606023+00	2026-07-14 16:22:36.606023+00	2026-07-14 16:22:36.606023+00	{"eTag": "\\"3df17fe7fcb3eab7a1c99e232383d35c\\"", "size": 2281003, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:22:37.000Z", "contentLength": 2281003, "httpStatusCode": 200}	360dde72-2d87-4383-8915-4f17e08fce50	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
1441da13-52d9-45dc-9d9c-1b8d49665290	documentos-casos	11/0d28c0cc-8280-4fcc-a0fb-56efcce9e0de.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 02:23:42.575394+00	2026-07-18 02:23:42.575394+00	2026-07-18 02:23:42.575394+00	{"eTag": "\\"a8fd5978d22867a35d55f4f2cabbca16\\"", "size": 2524124, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T02:23:43.000Z", "contentLength": 2524124, "httpStatusCode": 200}	93f851e3-705c-40af-86ae-4e4baa8a5b81	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
f5b0e7b4-cf4e-4a8c-be24-216f01689ea9	documentos-casos	11/6205ab0a-77c0-4270-937c-f4072e619162.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:26:49.584744+00	2026-07-14 16:26:49.584744+00	2026-07-14 16:26:49.584744+00	{"eTag": "\\"c80c400bc360e52236279c23c681d708\\"", "size": 2931175, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:26:50.000Z", "contentLength": 2931175, "httpStatusCode": 200}	d470a1df-4f36-40fa-acc9-9fd95504fdd9	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ade6ab31-bdcd-4026-ac29-db6b74d6dc8a	documentos-casos	11/6518745f-53c5-4085-9f74-a5ce57c0c824.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:27:09.786623+00	2026-07-14 16:27:09.786623+00	2026-07-14 16:27:09.786623+00	{"eTag": "\\"aacd057b5d6a44cc7b33455928f82d88\\"", "size": 3141239, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:27:10.000Z", "contentLength": 3141239, "httpStatusCode": 200}	304b9ef0-6157-4c99-923d-4d35b02986db	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
9458326b-ab54-43b2-8c3f-6a859a2a6861	documentos-casos	11/b24d04c6-f6f2-49d1-af67-e6563b861551.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:27:28.049117+00	2026-07-14 16:27:28.049117+00	2026-07-14 16:27:28.049117+00	{"eTag": "\\"1a0725e378aefa035aa14a716c9fe3dc\\"", "size": 2801690, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:27:28.000Z", "contentLength": 2801690, "httpStatusCode": 200}	0cbda83e-16ea-4227-ab07-3e8334b1d31a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
bb601b47-1cdc-4c3d-9b29-eb2c6f63c3cf	documentos-casos	11/df1bf778-0712-40b6-a8f6-459a250345b2.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:27:46.168999+00	2026-07-14 16:27:46.168999+00	2026-07-14 16:27:46.168999+00	{"eTag": "\\"1a717525e49e7d1bdb75c8d187dd6307\\"", "size": 2912687, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:27:47.000Z", "contentLength": 2912687, "httpStatusCode": 200}	b5094ee7-0db5-478f-b196-e3aa2a70fad6	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
23a1653c-498f-43a3-b59f-e99febaeb8bd	documentos-casos	11/98516022-335c-4156-b978-82b9887f069c.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:28:09.184021+00	2026-07-14 16:28:09.184021+00	2026-07-14 16:28:09.184021+00	{"eTag": "\\"a2f93de126f992862fe7905e5f174cc2\\"", "size": 2538266, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:28:09.000Z", "contentLength": 2538266, "httpStatusCode": 200}	e91a3822-dc84-4730-ae89-0661266fabd4	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
8894bc87-5fcf-43ad-a138-13c5b70883c3	documentos-casos	21/4af0cc2d-686f-4bef-ae96-a037cfae6166.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-16 20:43:19.574593+00	2026-07-16 20:43:19.574593+00	2026-07-16 20:43:19.574593+00	{"eTag": "\\"045c27c6407d7e2c8f5c702ce77337b9\\"", "size": 798341, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T20:43:20.000Z", "contentLength": 798341, "httpStatusCode": 200}	095bef6f-4717-4002-bff4-5c8c18fb896a	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
560d39be-6868-44f7-90a7-f2155ebb89f8	documentos-casos	19/b4e22bfd-687a-49c3-b6cd-20e1d2b26d28.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:30:50.608316+00	2026-07-14 16:30:50.608316+00	2026-07-14 16:30:50.608316+00	{"eTag": "\\"7a2dde900ee03d98e4e94b5055f91a99\\"", "size": 2884207, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:30:51.000Z", "contentLength": 2884207, "httpStatusCode": 200}	355b15d6-335c-4b98-b15e-6a025986bfc0	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
71131f82-1c7c-4822-8434-9e0cf05ee9d9	documentos-casos	11/649143d8-cad2-4551-8931-0396911d8684.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-29 16:37:55.738474+00	2026-07-29 16:37:55.738474+00	2026-07-29 16:37:55.738474+00	{"eTag": "\\"ee8ae6dcbfdae804fcd791b95986ce91\\"", "size": 2197747, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-29T16:37:56.000Z", "contentLength": 2197747, "httpStatusCode": 200}	a5c51d86-6190-48c9-a5af-386e7dc25c1a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
48a44a05-182e-4c50-b4b4-ba61b13443e0	documentos-casos	19/4dcc6e55-96ef-45ea-8303-396bbc723c69.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:31:01.821521+00	2026-07-14 16:31:01.821521+00	2026-07-14 16:31:01.821521+00	{"eTag": "\\"0ddcf2731f0a66d630a3267ad1e6d6cc\\"", "size": 2778415, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:31:02.000Z", "contentLength": 2778415, "httpStatusCode": 200}	4fd4b15f-dca4-4178-8891-ed57299acf2c	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
e263eb77-d87f-4a3f-9023-dac55570abd7	documentos-casos	19/dcc931c2-3b8e-4542-9bc3-4c3d0bf45b79.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 21:01:22.822774+00	2026-07-16 21:01:22.822774+00	2026-07-16 21:01:22.822774+00	{"eTag": "\\"366a618f76475de8e4a9dd9798e1cb69\\"", "size": 69331, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T21:01:23.000Z", "contentLength": 69331, "httpStatusCode": 200}	12677e34-c822-42e7-8872-1a8a2963bae5	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ef51240b-0f82-4438-8642-07de30b05886	documentos-casos	19/a491d8c8-9fb0-48ed-9487-46b95c38c39a.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:31:10.028887+00	2026-07-14 16:31:10.028887+00	2026-07-14 16:31:10.028887+00	{"eTag": "\\"94d7dbd028d31e9a6481666f8411c1b2\\"", "size": 2329382, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:31:10.000Z", "contentLength": 2329382, "httpStatusCode": 200}	b3734537-6bb2-4c69-bda6-d0e56f417d40	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
84d80216-2fd6-494c-aea7-2871448ba9e2	documentos-casos	19/86424faa-78bc-4130-ab6d-ecf1ca99c3ad.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:31:30.953881+00	2026-07-14 16:31:30.953881+00	2026-07-14 16:31:30.953881+00	{"eTag": "\\"80c559bc32f74e196124bf84566ade4a\\"", "size": 2192347, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:31:31.000Z", "contentLength": 2192347, "httpStatusCode": 200}	f2f9ef61-ac8c-42f1-9cda-7f7c20ad1007	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
4de33791-759c-47fd-acfa-40ca6d05a873	documentos-casos	11/543ad3a5-c4b4-4b91-8b71-5d09b85e1c0a.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 02:23:53.040259+00	2026-07-18 02:23:53.040259+00	2026-07-18 02:23:53.040259+00	{"eTag": "\\"ef718582b69f2917fe3af761db147156\\"", "size": 151777, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T02:23:53.000Z", "contentLength": 151777, "httpStatusCode": 200}	1e1c6a04-d908-49b5-bbb5-3122a3619751	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
54ebae29-e6b3-4b2f-b68f-072c5b9dbadc	documentos-casos	19/3cb664e9-a2a5-4281-a4c2-40e8de95fd5c.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:31:41.230476+00	2026-07-14 16:31:41.230476+00	2026-07-14 16:31:41.230476+00	{"eTag": "\\"24278f04f6647347fe6447af7470226f\\"", "size": 2040685, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:31:42.000Z", "contentLength": 2040685, "httpStatusCode": 200}	b890d855-4e5a-4f2e-b326-e4ee1c226155	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
59808927-8715-4639-83cf-4c36aada5424	documentos-casos	27/98ff8891-6fec-4ca0-90e3-c9185f70f950.jpeg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-21 16:20:31.411758+00	2026-07-21 16:20:31.411758+00	2026-07-21 16:20:31.411758+00	{"eTag": "\\"46d4c22525526462cc4c0800d3f02ce7\\"", "size": 4232686, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:20:32.000Z", "contentLength": 4232686, "httpStatusCode": 200}	b444be3d-f5ab-495e-865f-7d0c7643ae0a	8a923944-1c53-4584-94c1-f72c0848d04b	{}
5db5e8c8-c8a1-44be-8354-088a0f2841b5	documentos-casos	27/3d9a50c0-c550-4941-81c2-ec674abe431d.jpeg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-21 16:20:40.577343+00	2026-07-21 16:20:40.577343+00	2026-07-21 16:20:40.577343+00	{"eTag": "\\"64a258dee59c8b04f0240e7995b4c54f\\"", "size": 4657904, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:20:41.000Z", "contentLength": 4657904, "httpStatusCode": 200}	599cfbaf-0b8a-46e5-a3b0-6b47befe137b	8a923944-1c53-4584-94c1-f72c0848d04b	{}
8ea2ff78-1bc3-4479-9a02-6bbc677a4828	documentos-casos	19/297fe06c-0010-4ea8-92d8-9162ed1726c7.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:31:59.517915+00	2026-07-14 16:31:59.517915+00	2026-07-14 16:31:59.517915+00	{"eTag": "\\"8e915a6083bae98fe6829d966f541d10\\"", "size": 2155861, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:32:00.000Z", "contentLength": 2155861, "httpStatusCode": 200}	783d1259-12da-4f18-a009-2edc9fdeab9a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
88a08021-d01a-4788-8d6d-07e5a60adde2	documentos-casos	19/6aff3589-cfcf-4c56-9252-e7f973b231d0.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 21:01:11.999419+00	2026-07-16 21:01:11.999419+00	2026-07-16 21:01:11.999419+00	{"eTag": "\\"ec277f41143906d075602c0dcdd644db\\"", "size": 378333, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T21:01:12.000Z", "contentLength": 378333, "httpStatusCode": 200}	e6cd8c3c-4f13-41aa-80aa-e84c87d7bfb6	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
2bb428e7-731d-431f-aef2-342f958c4648	documentos-casos	19/48ad9395-21e1-41c0-ac06-c54b0744d353.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:32:13.530574+00	2026-07-14 16:32:13.530574+00	2026-07-14 16:32:13.530574+00	{"eTag": "\\"1236a7b2ac72eb9fe24879dd41802063\\"", "size": 2337480, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:32:14.000Z", "contentLength": 2337480, "httpStatusCode": 200}	2aaded27-0791-42f4-ae48-049d6b5c5aba	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
a161af00-6d34-4478-9b8f-93ec9aa4ea47	documentos-casos	19/da916c24-8ce6-4da7-879b-88ab3d495035.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-30 12:49:17.325085+00	2026-07-30 12:49:17.325085+00	2026-07-30 12:49:17.325085+00	{"eTag": "\\"adccb41bb01614791650418a8ecb45ad\\"", "size": 170399, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-30T12:49:18.000Z", "contentLength": 170399, "httpStatusCode": 200}	e03e6837-ecba-43ef-9ad8-012b9663e199	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
34778d32-1f5d-4ebe-abfe-d9ba5b8d400b	documentos-casos	19/3b893017-77b5-452d-8e27-955e0886bb2b.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:32:30.689867+00	2026-07-14 16:32:30.689867+00	2026-07-14 16:32:30.689867+00	{"eTag": "\\"341c77f2e94c7c5750d222acc1ba3ba1\\"", "size": 2578915, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:32:31.000Z", "contentLength": 2578915, "httpStatusCode": 200}	63681344-2f00-4ad0-b932-90d4da72bd8f	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
cf1a1de7-c4d8-4c11-943c-c2b46fde0fae	documentos-casos	11/53477ce6-09f8-4bcb-9f86-0a9f4a170097.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 06:51:44.486893+00	2026-07-18 06:51:44.486893+00	2026-07-18 06:51:44.486893+00	{"eTag": "\\"35d64f16eaf306542aa129ae37a18eaa\\"", "size": 265119, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T06:51:45.000Z", "contentLength": 265119, "httpStatusCode": 200}	8a446853-07ba-4684-ab9c-c02a89958bfc	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
18960ce5-19dd-415a-98a3-062ecb2721c0	documentos-casos	19/a97bbc88-928e-4442-85c7-419fe1e4fdd6.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:32:46.28465+00	2026-07-14 16:32:46.28465+00	2026-07-14 16:32:46.28465+00	{"eTag": "\\"e2d4d9dd4401c2dd2a537d741d3a66d3\\"", "size": 2436560, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:32:47.000Z", "contentLength": 2436560, "httpStatusCode": 200}	e0436d2f-800e-4d18-9ce8-5a085a3b5235	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
d27b0bbc-e1cc-48d0-9aba-f6a4d7c35e44	documentos-casos	19/75c8dc55-827f-44b5-8537-844c09499b23.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:33:04.970328+00	2026-07-14 16:33:04.970328+00	2026-07-14 16:33:04.970328+00	{"eTag": "\\"c58bd3b33229fc68187281580f7f3128\\"", "size": 2188322, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:33:05.000Z", "contentLength": 2188322, "httpStatusCode": 200}	2643db32-bfbd-400a-9155-12c4e6ba3336	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
db480f9f-1549-4acc-9a98-351ba0f009bd	documentos-casos	35/1849e15d-85b1-47c9-b7ea-b77d455fd547.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-21 16:20:44.03994+00	2026-07-21 16:20:44.03994+00	2026-07-21 16:20:44.03994+00	{"eTag": "\\"7aeb94f958629ea15e24a5ebab5b2465\\"", "size": 2400362, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:20:44.000Z", "contentLength": 2400362, "httpStatusCode": 200}	8da20fcd-aa2d-4228-a028-80ba05cf7468	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
a751d114-51e0-4209-bab6-c1d73c4c1b57	documentos-casos	19/9db71e68-eb79-45cd-8a7e-435784dd72b9.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:33:17.082653+00	2026-07-14 16:33:17.082653+00	2026-07-14 16:33:17.082653+00	{"eTag": "\\"c087f6c9afcea278760785771a1d823f\\"", "size": 2331820, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:33:18.000Z", "contentLength": 2331820, "httpStatusCode": 200}	ed01c1d4-a20d-4ecd-96d5-cdaf52d8b437	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
892b544f-6b5f-44cb-8330-c764fa1a5ca8	documentos-casos	19/a550e391-8f85-4b07-b43c-d776c28da2f8.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:33:32.136584+00	2026-07-14 16:33:32.136584+00	2026-07-14 16:33:32.136584+00	{"eTag": "\\"3df17fe7fcb3eab7a1c99e232383d35c\\"", "size": 2281003, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:33:33.000Z", "contentLength": 2281003, "httpStatusCode": 200}	eba717fb-c4e3-41bf-a7d8-8107e7e7a652	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
22d05dbc-8070-4bbc-91fe-61f2814340ba	documentos-casos	29/c2b1f715-ca3a-4a47-a2d4-a55c9455591e.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-21 16:38:15.205621+00	2026-07-21 16:38:15.205621+00	2026-07-21 16:38:15.205621+00	{"eTag": "\\"f01957c25faebd2155d9ac76a75dbfdb\\"", "size": 486085, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:38:16.000Z", "contentLength": 486085, "httpStatusCode": 200}	fa41f319-8ae7-4dc1-aeb2-9232583e4982	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
35f45d20-7b58-48eb-af1d-2a0ec0e366bd	documentos-casos	19/ccc786e4-2417-47e9-8f95-016897cc2541.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:33:46.901809+00	2026-07-14 16:33:46.901809+00	2026-07-14 16:33:46.901809+00	{"eTag": "\\"2c86931eacb1c8d8a09c1504b6dd251d\\"", "size": 1969493, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:33:47.000Z", "contentLength": 1969493, "httpStatusCode": 200}	2011b6f5-a660-4785-8b72-c66a91abb68b	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
c19e702c-3eac-4a63-82ae-82cb557e7219	documentos-casos	19/215c27ba-551e-4187-b441-c4284870aa2d.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:34:03.117493+00	2026-07-14 16:34:03.117493+00	2026-07-14 16:34:03.117493+00	{"eTag": "\\"0cd18e7336d86108b5cb940ef5c9580e\\"", "size": 2354582, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:34:04.000Z", "contentLength": 2354582, "httpStatusCode": 200}	e137c396-fa5e-449b-b85f-5f225042545c	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
29cd3c69-8820-4206-903f-68f1c1100d99	documentos-casos	19/2ce3d112-a123-426f-908f-fa3d59a2716f.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 21:01:30.760906+00	2026-07-16 21:01:30.760906+00	2026-07-16 21:01:30.760906+00	{"eTag": "\\"2bb0ec895b80cdb730b6dc7a62363869\\"", "size": 973957, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T21:01:31.000Z", "contentLength": 973957, "httpStatusCode": 200}	f4e6306a-6a96-4f5c-8276-e998a594edec	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
24bd2625-fd1c-4568-adbd-3d299f736476	documentos-casos	34/10f29c52-7a97-4881-ab28-1eb882c9222f.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-30 15:51:27.387481+00	2026-07-30 15:51:27.387481+00	2026-07-30 15:51:27.387481+00	{"eTag": "\\"3e3ac6ce2c35fc16afc0ae5b6feb333d\\"", "size": 15311851, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-30T15:51:28.000Z", "contentLength": 15311851, "httpStatusCode": 200}	0e048728-4c14-40d3-9d55-b87cac8a20a8	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
40f4e02d-548d-4672-85c1-404639aab7f5	documentos-casos	11/8d7758e4-428f-4a1e-b24b-139015da4c4e.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 07:00:04.129722+00	2026-07-18 07:00:04.129722+00	2026-07-18 07:00:04.129722+00	{"eTag": "\\"73475bed0f28b927b01abd8991af3a63\\"", "size": 825984, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T07:00:04.000Z", "contentLength": 825984, "httpStatusCode": 200}	d4ee6385-d13c-4e6a-be26-f0a916deb302	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ee035b5e-ea7c-40ee-9145-597fec516a1f	documentos-casos	29/14bb089a-80e0-4d40-9599-691205a9fc9d.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-21 16:42:20.208956+00	2026-07-21 16:42:20.208956+00	2026-07-21 16:42:20.208956+00	{"eTag": "\\"dde13ece8aae31d0a5004eac5084f863\\"", "size": 1540539, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:42:20.000Z", "contentLength": 1540539, "httpStatusCode": 200}	906ace9d-b46d-4f93-a7bf-f0a4d60fe999	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
eaca85e5-1651-417c-b549-f6dea516336d	documentos-casos	29/8d59bc4a-429f-4e10-92e1-f8cdc4049f41.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-22 15:28:31.299804+00	2026-07-22 15:28:31.299804+00	2026-07-22 15:28:31.299804+00	{"eTag": "\\"8d0f12d1ec2d9e5f0f02f8ffc5ed0498\\"", "size": 1830530, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:28:32.000Z", "contentLength": 1830530, "httpStatusCode": 200}	9849ef2f-fc86-4dc6-9b6f-eb1252b0dcf6	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
012451b4-12cf-47ac-bfac-a6d53aca6694	documentos-casos	16/bf9689ef-aedb-4229-a749-2630c8b79fd3.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:14.954167+00	2026-07-22 15:44:14.954167+00	2026-07-22 15:44:14.954167+00	{"eTag": "\\"f10cc5fc959cb9e8ee9c5dbaa2d3ecbe\\"", "size": 3501278, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:15.000Z", "contentLength": 3501278, "httpStatusCode": 200}	77be3ec5-b8db-4299-8765-b298b80990aa	8a923944-1c53-4584-94c1-f72c0848d04b	{}
46d9543d-fe5d-4274-bcb5-dbb61188a09d	documentos-casos	16/70ca946b-2c94-498e-ad24-1eab6d331711.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:25.486299+00	2026-07-22 15:44:25.486299+00	2026-07-22 15:44:25.486299+00	{"eTag": "\\"1dc3367fb8dd56a990a16aefbd8d59b1\\"", "size": 3668553, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:26.000Z", "contentLength": 3668553, "httpStatusCode": 200}	a45b9939-2403-4596-ae48-ce40ac2ee5a2	8a923944-1c53-4584-94c1-f72c0848d04b	{}
0f237fd9-a722-48fd-abb4-0a0be762d173	documentos-casos	16/4ea4f1a7-95c0-4921-9f08-852209df3b32.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:33.37222+00	2026-07-22 15:44:33.37222+00	2026-07-22 15:44:33.37222+00	{"eTag": "\\"61356965ed1621bab211e9053522dc39\\"", "size": 3689937, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:34.000Z", "contentLength": 3689937, "httpStatusCode": 200}	ed2ae1bb-d6d6-4f82-b226-1b116869b42e	8a923944-1c53-4584-94c1-f72c0848d04b	{}
35b0bddc-8a5b-4463-8248-3d63e410ecd4	documentos-casos	16/159ea3f7-a8c0-477d-8396-338c0b69def5.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:47.48977+00	2026-07-22 15:44:47.48977+00	2026-07-22 15:44:47.48977+00	{"eTag": "\\"5ac05151abf5658856e37c347eaba24f\\"", "size": 3530172, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:48.000Z", "contentLength": 3530172, "httpStatusCode": 200}	020388f5-1822-40c2-b6ac-a9b08c0c7ec1	8a923944-1c53-4584-94c1-f72c0848d04b	{}
4b1a2d31-23e1-4520-841d-8a873d565c4f	documentos-casos	16/bddfce56-935d-4cae-aab5-997585d5066b.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:56.383568+00	2026-07-22 15:44:56.383568+00	2026-07-22 15:44:56.383568+00	{"eTag": "\\"d5d3103792e1569f1fff9dd54165440c\\"", "size": 3103069, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:57.000Z", "contentLength": 3103069, "httpStatusCode": 200}	ac69379f-9ad9-409b-a83d-7c1e86073cd4	8a923944-1c53-4584-94c1-f72c0848d04b	{}
3e448e79-ebb7-4ca5-a7d0-bc3f0d58f9d5	documentos-casos	36/24b8aca3-8ad9-4d75-97db-892a46597b2a.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-22 15:45:01.282774+00	2026-07-22 15:45:01.282774+00	2026-07-22 15:45:01.282774+00	{"eTag": "\\"6b7809ff8a42fd11a6b4c19f0ea43a40\\"", "size": 1421701, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:45:02.000Z", "contentLength": 1421701, "httpStatusCode": 200}	32ac10f2-fdf5-4d92-a7c9-e063381a84dd	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
268e0f75-83fb-4024-a5e5-b95fc7b80095	documentos-casos	19/f5c95fe9-424a-4cdb-a4ef-24e5c1cdad1d.jpg	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-14 16:34:21.406158+00	2026-07-14 16:34:21.406158+00	2026-07-14 16:34:21.406158+00	{"eTag": "\\"7a2dde900ee03d98e4e94b5055f91a99\\"", "size": 2884207, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T16:34:22.000Z", "contentLength": 2884207, "httpStatusCode": 200}	cc2580da-fc8b-43c0-9e41-3bce36f6da9c	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
58fda238-c715-43e3-b949-45c6a943494b	documentos-casos	19/8e964813-b894-4be7-8405-94b09cf98bff.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-16 21:01:40.377162+00	2026-07-16 21:01:40.377162+00	2026-07-16 21:01:40.377162+00	{"eTag": "\\"4a2b7c09496668245db35908cc04e05f\\"", "size": 111168, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T21:01:41.000Z", "contentLength": 111168, "httpStatusCode": 200}	0369742e-3277-4c2b-a909-1f036e6d467a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
fe69abf9-52e6-40fe-92cd-20120ad9adb3	documentos-casos	9/4a8b47f0-9fb6-42cf-a9a6-9e28743ab6a3.docx	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-14 22:31:09.08891+00	2026-07-14 22:31:09.08891+00	2026-07-14 22:31:09.08891+00	{"eTag": "\\"796a5697ac6a74b1a57541b7b0e52a77-2\\"", "size": 18801314, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T22:31:09.000Z", "contentLength": 18801314, "httpStatusCode": 200}	c37eaa6f-39e5-4ce8-bc39-34ad341c3144	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
b3bcfca0-c88b-438c-8899-571018c3d0f5	documentos-casos	34/2d211b51-d872-4ee4-86db-7cfd4f5c91c8.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-30 15:51:37.268568+00	2026-07-30 15:51:37.268568+00	2026-07-30 15:51:37.268568+00	{"eTag": "\\"b60788b4a3b4032c4c77a1a96757cdd0\\"", "size": 3519171, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-30T15:51:38.000Z", "contentLength": 3519171, "httpStatusCode": 200}	3dd81efb-2a22-45de-818c-5d1287edc304	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
aaecee2a-a801-4016-88b0-865d1aa25cc2	documentos-casos	11/e4d61fa2-53ef-4357-a48d-75a5fcbb1aa0.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-15 14:55:36.483912+00	2026-07-15 14:55:36.483912+00	2026-07-15 14:55:36.483912+00	{"eTag": "\\"e054eb0656e1aa4c335d4dad56c259fd\\"", "size": 1987757, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-15T14:55:37.000Z", "contentLength": 1987757, "httpStatusCode": 200}	8a668594-7da4-477d-b6cd-86c958061314	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
ad518b0c-4084-490e-9ff2-6db272dd9e4f	documentos-casos	11/25142360-fdff-4457-ba84-20abfc71a936.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-18 07:00:12.828961+00	2026-07-18 07:00:12.828961+00	2026-07-18 07:00:12.828961+00	{"eTag": "\\"2f4e5f712f4cdf91fb50c28928ae96d3\\"", "size": 803837, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-18T07:00:13.000Z", "contentLength": 803837, "httpStatusCode": 200}	b1509af8-882b-4af8-91e3-eca29ef735a6	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
367b5101-1acb-4e16-92b9-c7a047fe3b78	documentos-casos	11/e0b8f279-5ad0-45de-9948-d2c7b52fdc0b.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-15 15:30:46.525253+00	2026-07-15 15:30:46.525253+00	2026-07-15 15:30:46.525253+00	{"eTag": "\\"2ea92866de557ec2dcd359da6112e142\\"", "size": 1987763, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-15T15:30:47.000Z", "contentLength": 1987763, "httpStatusCode": 200}	9659300a-22eb-41f2-a373-642e5076879f	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
efb29400-d18d-447b-a77b-b3c198a78c45	documentos-casos	29/b884a7c1-16ea-41de-a867-74e452c234e7.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-21 16:44:01.466917+00	2026-07-21 16:44:01.466917+00	2026-07-21 16:44:01.466917+00	{"eTag": "\\"7aeb94f958629ea15e24a5ebab5b2465\\"", "size": 2400362, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:44:02.000Z", "contentLength": 2400362, "httpStatusCode": 200}	eff3b6a6-94f1-4600-9249-7f39ec7dc824	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
0aa56c66-9c9c-4de0-bdf3-f14745c353ec	documentos-casos	29/53963f2c-2a20-4f05-857a-5060fa42a641.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-21 16:45:22.387+00	2026-07-21 16:45:22.387+00	2026-07-21 16:45:22.387+00	{"eTag": "\\"dde13ece8aae31d0a5004eac5084f863\\"", "size": 1540539, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-21T16:45:23.000Z", "contentLength": 1540539, "httpStatusCode": 200}	6bf33b26-9a59-451a-b19c-fcb3aad80952	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
ef393152-1652-4dbd-b206-466b18c2e12d	documentos-casos	36/397aa8ad-fff0-428a-8e4a-18aea8927765.zip	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-22 15:43:20.973791+00	2026-07-22 15:43:20.973791+00	2026-07-22 15:43:20.973791+00	{"eTag": "\\"6021fb637f5c64c59d419a8d10705a24\\"", "size": 3703702, "mimetype": "application/zip", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:43:21.000Z", "contentLength": 3703702, "httpStatusCode": 200}	891a7fed-a534-49aa-992a-e7a75efb53fb	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
d1327ef8-75e6-4298-af27-02107d55c79d	documentos-casos	16/3836b0b3-5a89-4362-bd2d-3e58a6f6c9fa.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:44:01.234937+00	2026-07-22 15:44:01.234937+00	2026-07-22 15:44:01.234937+00	{"eTag": "\\"1fc9f28a2faa21f1858f22d4a1f8bf68\\"", "size": 3876458, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:44:02.000Z", "contentLength": 3876458, "httpStatusCode": 200}	0c7b18b1-2236-4825-8850-01877b974ec6	8a923944-1c53-4584-94c1-f72c0848d04b	{}
5851241e-9c36-43aa-8d22-8863ef3179a9	documentos-casos	16/702903fd-c79d-4e8d-84c9-de484545c6e9.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:45:08.759645+00	2026-07-22 15:45:08.759645+00	2026-07-22 15:45:08.759645+00	{"eTag": "\\"f739b935e1c05e2598e0386c241dddfb\\"", "size": 2936608, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:45:09.000Z", "contentLength": 2936608, "httpStatusCode": 200}	4ccf695c-c709-46d5-83c7-887bbbdbec17	8a923944-1c53-4584-94c1-f72c0848d04b	{}
10d6f256-0bad-468e-964d-999ee26a3ea3	documentos-casos	16/75bd9948-f6a1-4551-9b7f-d6ab4df5d0f1.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 15:45:22.48616+00	2026-07-22 15:45:22.48616+00	2026-07-22 15:45:22.48616+00	{"eTag": "\\"e9cc070e1730fba925711a14c4b9be9f\\"", "size": 3498666, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T15:45:23.000Z", "contentLength": 3498666, "httpStatusCode": 200}	e6c4506a-70bb-40cc-b3fa-33e6b260a57b	8a923944-1c53-4584-94c1-f72c0848d04b	{}
81e919a2-2406-459a-8e6e-1acd056da21f	documentos-casos	34/a5c6099c-baae-4620-bde3-5a28eb1bec57.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-22 16:00:22.600507+00	2026-07-22 16:00:22.600507+00	2026-07-22 16:00:22.600507+00	{"eTag": "\\"aee515badf8d643bef0a5a0d29f2f0d0\\"", "size": 2282994, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:00:23.000Z", "contentLength": 2282994, "httpStatusCode": 200}	a6a50369-c807-41e6-8599-7321779a6ed7	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
5f22ba89-4344-4d22-a580-cca370726b30	documentos-casos	39/754c010e-b3ee-4669-9d3e-b4d9a64900e6.pdf	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-22 16:12:00.215583+00	2026-07-22 16:12:00.215583+00	2026-07-22 16:12:00.215583+00	{"eTag": "\\"32331b122379cdede58ef56b0e36386a\\"", "size": 4739629, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:12:01.000Z", "contentLength": 4739629, "httpStatusCode": 200}	39837dc8-c169-4e92-b969-203e4b601da9	8a923944-1c53-4584-94c1-f72c0848d04b	{}
07011317-ea62-4578-adc4-d78009ad7643	documentos-casos	37/23df4ef8-b2c5-4264-b750-b8547e290761.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:21:09.111686+00	2026-07-22 16:21:09.111686+00	2026-07-22 16:21:09.111686+00	{"eTag": "\\"2eb42e1dabeeb6f863de7182bd10fd6d\\"", "size": 602483, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:21:09.000Z", "contentLength": 602483, "httpStatusCode": 200}	5d60a8ce-d1b8-4d25-ae43-9b1e7b843977	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
db2d239f-fcf6-4193-9025-7daffba8fd18	documentos-casos	37/87ed38a5-87e2-4461-8e42-d4c707758e14.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:21:15.474751+00	2026-07-22 16:21:15.474751+00	2026-07-22 16:21:15.474751+00	{"eTag": "\\"f49f9b265cbed84f4b69ab23938fe996\\"", "size": 645212, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:21:16.000Z", "contentLength": 645212, "httpStatusCode": 200}	650ac97c-c281-487d-b4b4-ace9ed42760b	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
35e293a7-20cd-43d3-a27a-515417e5810e	documentos-casos	40/1ac2f9b3-0f20-4c7e-a265-c0f0468ad225.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:25:13.284164+00	2026-07-22 16:25:13.284164+00	2026-07-22 16:25:13.284164+00	{"eTag": "\\"2632398e778e096c73c7b2562e482c84\\"", "size": 921444, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:25:14.000Z", "contentLength": 921444, "httpStatusCode": 200}	73952399-8f8e-4b58-8f53-d49097266925	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
727a4f74-46cc-4ba7-9c87-62f51a276eb9	documentos-casos	40/aeaa9d23-ce80-4682-ab20-cdd9948d9eec.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:25:26.655697+00	2026-07-22 16:25:26.655697+00	2026-07-22 16:25:26.655697+00	{"eTag": "\\"733a67353de4768992a5c80250a52696\\"", "size": 1248952, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:25:27.000Z", "contentLength": 1248952, "httpStatusCode": 200}	256bda0e-0fcc-4d3c-b8f1-f277a116aa9b	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
94dbbe4f-d0a7-4db4-8282-400e044a6d34	documentos-casos	40/405d88da-0e9a-49f9-8dc5-791401b1c478.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:25:35.469813+00	2026-07-22 16:25:35.469813+00	2026-07-22 16:25:35.469813+00	{"eTag": "\\"0a10fa301f2d88af032233bba47c60d5\\"", "size": 1000390, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:25:36.000Z", "contentLength": 1000390, "httpStatusCode": 200}	3e5a3328-2189-49dc-9228-2a155cefdfa4	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
a7cca57b-79a9-4b48-a038-77de5b6edadc	documentos-casos	40/0071acaa-3259-4b8e-af2f-bfcea4c64d43.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:25:45.418342+00	2026-07-22 16:25:45.418342+00	2026-07-22 16:25:45.418342+00	{"eTag": "\\"790dd2a18f8ceba8ac17486e2e69800e\\"", "size": 625579, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:25:46.000Z", "contentLength": 625579, "httpStatusCode": 200}	f735f2ea-2cae-4a24-9521-25d82ebae1e3	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
d75ef9f7-bb1b-4273-8d2b-c3f43bdc324e	documentos-casos	40/82663301-9546-443e-9824-51dc856d01ad.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:25:54.263128+00	2026-07-22 16:25:54.263128+00	2026-07-22 16:25:54.263128+00	{"eTag": "\\"9d5db8a9686358c36715e942f0140e56\\"", "size": 1040791, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:25:55.000Z", "contentLength": 1040791, "httpStatusCode": 200}	40c7cee1-3d52-4cb3-83ad-c84eaadbc193	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
9891f5a6-ef9f-4c07-9dda-0f644983eec9	documentos-casos	40/eb21ada1-d80e-487e-af5b-a2018aa7f817.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-22 16:26:03.549288+00	2026-07-22 16:26:03.549288+00	2026-07-22 16:26:03.549288+00	{"eTag": "\\"9ab1833c557b6b07f8c0e5a4ca639e35\\"", "size": 1596362, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-22T16:26:04.000Z", "contentLength": 1596362, "httpStatusCode": 200}	6433de8d-e31e-4a8d-b7a6-0dceb29d90d4	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
c04d0b10-e920-419f-9427-4f4352e74e26	documentos-casos	40/8601f4fc-3b37-4c48-bb45-bdd05d7393f1.pdf	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-23 22:42:47.526383+00	2026-07-23 22:42:47.526383+00	2026-07-23 22:42:47.526383+00	{"eTag": "\\"7a7ddc6658639c67750f384144ef8f8e\\"", "size": 908804, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-23T22:42:48.000Z", "contentLength": 908804, "httpStatusCode": 200}	b5ad08a2-fe3c-43c0-8c6c-526ce1949d1d	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
8f7f27be-d485-4e89-942f-94676a6a99d2	documentos-casos	11/84ea11ab-4a73-42a8-9c62-9e113e997297.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-26 19:41:50.738103+00	2026-07-26 19:41:50.738103+00	2026-07-26 19:41:50.738103+00	{"eTag": "\\"97cb88b35e63e9f551deae8f30c0f571\\"", "size": 325865, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-26T19:41:51.000Z", "contentLength": 325865, "httpStatusCode": 200}	f2acb9e5-a353-4448-99cb-368e8740dcd1	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
2b54ef51-a052-43be-b500-b9112e628781	documentos-casos	19/fa9cc5ae-1a17-4bb7-b3a4-eeb78465921b.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-27 03:52:10.315576+00	2026-07-27 03:52:10.315576+00	2026-07-27 03:52:10.315576+00	{"eTag": "\\"03d4004eeeda1817655230c34c032ecc\\"", "size": 136066, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T03:52:11.000Z", "contentLength": 136066, "httpStatusCode": 200}	019103c1-815a-4c39-8bb0-c751ad8d6a17	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
f18204f7-ed4d-48fe-a059-9b24f50007d2	documentos-casos	34/86b7f54b-ea2f-4031-ba84-ea72672fa2fa.docx	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-27 13:56:47.337187+00	2026-07-27 13:56:47.337187+00	2026-07-27 13:56:47.337187+00	{"eTag": "\\"b05022480de6ed68ebd298c5fb5e5da5\\"", "size": 16381, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T13:56:48.000Z", "contentLength": 16381, "httpStatusCode": 200}	536b2e0c-5fea-4e7e-a3f0-5e60d7ebb1cf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
fd44c035-6c86-4c42-82a5-2f7ae7c912c2	documentos-casos	39/029bf075-f83d-4a7b-a1c1-18f1b30f19ae.docx	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-27 13:57:13.078001+00	2026-07-27 13:57:13.078001+00	2026-07-27 13:57:13.078001+00	{"eTag": "\\"3bfca9a51dea63e33dab709dbdff45b9\\"", "size": 31317, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T13:57:14.000Z", "contentLength": 31317, "httpStatusCode": 200}	af4aa408-0bf7-49c6-a9c2-733e5a228be9	8a923944-1c53-4584-94c1-f72c0848d04b	{}
349fb662-167a-4d75-b3c3-4c94f0138021	documentos-casos	43/cb358c6e-4401-4a22-966a-85ca484e4f7c.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-27 15:45:34.727096+00	2026-07-27 15:45:34.727096+00	2026-07-27 15:45:34.727096+00	{"eTag": "\\"0a2150b8ec2fda130075f779e326fea5\\"", "size": 899388, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T15:45:35.000Z", "contentLength": 899388, "httpStatusCode": 200}	380de9f9-83f0-4039-bd77-d07df8a6efe8	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
046bb4c3-ded9-4556-a09e-0ffb4457a97e	documentos-casos	43/79da1662-9902-4bfc-ac3f-ab252a37bb47.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-27 15:45:41.788711+00	2026-07-27 15:45:41.788711+00	2026-07-27 15:45:41.788711+00	{"eTag": "\\"cfa2941c054b231cd16abfa5fa841e95\\"", "size": 943547, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T15:45:42.000Z", "contentLength": 943547, "httpStatusCode": 200}	36368362-37a5-41e5-bcb4-45cc837df678	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
1e7f9335-9e7f-4e87-a58d-0302e637dc74	documentos-casos	42/a6122ff7-492f-4063-ac3b-9d75431fde88.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-27 15:51:18.582762+00	2026-07-27 15:51:18.582762+00	2026-07-27 15:51:18.582762+00	{"eTag": "\\"dcafec1d6f6bdb1a4bc4fd1f43aeb77d\\"", "size": 4025629, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T15:51:19.000Z", "contentLength": 4025629, "httpStatusCode": 200}	8ce77669-c799-446c-a36d-edb64c91a3d7	8a923944-1c53-4584-94c1-f72c0848d04b	{}
a6a97ce6-fa2e-4412-ba73-a768073d4b14	documentos-casos	42/1d69cda9-dac0-4105-a7ea-b669d5c493da.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-27 15:51:30.983811+00	2026-07-27 15:51:30.983811+00	2026-07-27 15:51:30.983811+00	{"eTag": "\\"c740ead9f7392d3895318da2cd31989b\\"", "size": 3563247, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T15:51:31.000Z", "contentLength": 3563247, "httpStatusCode": 200}	c1da5321-378d-44de-bb62-a2eaca059921	8a923944-1c53-4584-94c1-f72c0848d04b	{}
f0d1eb73-6819-4d36-a773-67c522c9ed95	documentos-casos	41/69adc83d-1693-4017-98fa-30c5c42fd8cc.pdf	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	2026-07-27 16:26:11.240744+00	2026-07-27 16:26:11.240744+00	2026-07-27 16:26:11.240744+00	{"eTag": "\\"c78d778715a79c41e49d29f52891e522\\"", "size": 2227631, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T16:26:12.000Z", "contentLength": 2227631, "httpStatusCode": 200}	f99b025b-65a2-47e4-9ed1-565bd656db93	e1b7662c-e9a6-45f6-87d5-5198548cd2c6	{}
548de421-b5d8-489e-9fbb-3a863bbaade3	documentos-casos	44/ca14fdac-7b88-48bd-9372-4b9d912ff27f.pdf	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-27 21:36:55.626722+00	2026-07-27 21:36:55.626722+00	2026-07-27 21:36:55.626722+00	{"eTag": "\\"4f4766372b6c9bdb71c0827caf7f08b9\\"", "size": 9990376, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T21:36:56.000Z", "contentLength": 9990376, "httpStatusCode": 200}	92fbbef6-0899-42bd-9e61-da0c76bf5f16	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
2202b0ec-9093-42d1-adc0-68db47071444	documentos-casos	34/ac85c79d-49f7-418e-8128-ff43876a144a.docx	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	2026-07-27 22:07:12.588828+00	2026-07-27 22:07:12.588828+00	2026-07-27 22:07:12.588828+00	{"eTag": "\\"248b68e540f68cd62259937396f68f1d\\"", "size": 17618, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T22:07:13.000Z", "contentLength": 17618, "httpStatusCode": 200}	7c863350-4d35-4e37-879d-ba878d273a51	ccd9c5b3-35ba-40ab-a345-c6bf1af51576	{}
d5772cfd-d37c-430c-808c-88beb96100df	documentos-casos	39/c02fdaa8-51ed-498f-a41f-9376312d5efc.docx	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-27 23:56:03.681944+00	2026-07-27 23:56:03.681944+00	2026-07-27 23:56:03.681944+00	{"eTag": "\\"45cbe83025a08122fa022c6643b19789\\"", "size": 33537, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-07-27T23:56:04.000Z", "contentLength": 33537, "httpStatusCode": 200}	c76bbaa4-0bfb-4992-9e1b-c1d4f693ed25	8a923944-1c53-4584-94c1-f72c0848d04b	{}
e0714d82-933f-4682-84d2-21354c701ade	documentos-casos	19/63bcbb17-0e7d-4412-b38e-59fe8fa5367d.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-28 13:40:29.302539+00	2026-07-28 13:40:29.302539+00	2026-07-28 13:40:29.302539+00	{"eTag": "\\"e01f81e904da14134b2f094a1770ee99\\"", "size": 126816, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T13:40:30.000Z", "contentLength": 126816, "httpStatusCode": 200}	0b641634-0bdf-47f1-bb76-6b838683e49f	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
5404c5b7-0f09-483e-983b-2035a7729fc6	documentos-casos	46/2d208b9f-5688-4410-9003-63116a7d31cf.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-28 15:06:39.46679+00	2026-07-28 15:06:39.46679+00	2026-07-28 15:06:39.46679+00	{"eTag": "\\"4f7333526bda4b6819956c863ca1b2ca\\"", "size": 3453023, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:06:40.000Z", "contentLength": 3453023, "httpStatusCode": 200}	4ebaf0d7-2c92-4b82-9b5d-91e8ece13ba9	8a923944-1c53-4584-94c1-f72c0848d04b	{}
aebc5728-8a27-48ec-9971-0fca627e1e97	documentos-casos	46/7b67874f-3bae-4172-b6db-adbb22c22a6b.jpg	8a923944-1c53-4584-94c1-f72c0848d04b	2026-07-28 15:06:54.590168+00	2026-07-28 15:06:54.590168+00	2026-07-28 15:06:54.590168+00	{"eTag": "\\"667a67d697a085b516b558d31b7c78fa\\"", "size": 3403247, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:06:55.000Z", "contentLength": 3403247, "httpStatusCode": 200}	7f059f86-7b18-48a9-9dbe-5945d652c1b7	8a923944-1c53-4584-94c1-f72c0848d04b	{}
4b197c97-e08a-48ee-a93d-e7a8948141b5	documentos-casos	45/36c58ff8-cc22-49b3-9717-35a2151f7e8a.pdf	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	2026-07-28 15:21:56.346855+00	2026-07-28 15:21:56.346855+00	2026-07-28 15:21:56.346855+00	{"eTag": "\\"8f570e52909655a16e6c7ea1ac4e14b0\\"", "size": 301436, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:21:57.000Z", "contentLength": 301436, "httpStatusCode": 200}	832654dd-e5ce-4970-809a-b884a75d2c2a	cbbefa5f-0ab7-4065-bc7d-2ef147b5ffcd	{}
47edc881-6356-43e8-b355-798563cfd65b	documentos-casos	48/8203b9e5-204e-4256-a2d0-73ab9689b9e4.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-28 15:51:23.707912+00	2026-07-28 15:51:23.707912+00	2026-07-28 15:51:23.707912+00	{"eTag": "\\"2bf3fb16864ec64e6e56ac875ca47aac\\"", "size": 956077, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:51:24.000Z", "contentLength": 956077, "httpStatusCode": 200}	85960ec3-0d5a-45a3-a3da-d49cfddd1fa4	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
f6285ad3-a445-4926-b21b-4786e0420496	documentos-casos	48/49da1e2d-addb-46ad-b7f3-e7b79dbeecce.jpeg	ece5557b-c859-4da3-bd35-f1d2b3beb586	2026-07-28 15:51:29.305583+00	2026-07-28 15:51:29.305583+00	2026-07-28 15:51:29.305583+00	{"eTag": "\\"16c1ee9f941ff597c800852244033096\\"", "size": 995281, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-28T15:51:30.000Z", "contentLength": 995281, "httpStatusCode": 200}	f1c2c9de-b0cf-44db-a861-04b90720d4ff	ece5557b-c859-4da3-bd35-f1d2b3beb586	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 573, true);


--
-- Name: actividades_caso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."actividades_caso_id_seq"', 26, true);


--
-- Name: auditoria_casos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."auditoria_casos_id_seq"', 432, true);


--
-- Name: casos_id_caso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."casos_id_caso_seq"', 50, true);


--
-- Name: contratos_laborales_id_contrato_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."contratos_laborales_id_contrato_seq"', 5, true);


--
-- Name: demandados_id_demandado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."demandados_id_demandado_seq"', 12, true);


--
-- Name: documentos_caso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."documentos_caso_id_seq"', 131, true);


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."horarios_id_seq"', 43, true);


--
-- Name: llamados_atencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."llamados_atencion_id_seq"', 28, true);


--
-- Name: notificaciones_pendientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notificaciones_pendientes_id_seq"', 89, true);


--
-- Name: notificaciones_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notificaciones_usuario_id_seq"', 360, true);


--
-- Name: perfiles_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."perfiles_roles_id_seq"', 18, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."role_permissions_id_seq"', 86, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict WFiW8drSiL1oLfHgxnpfGFEtrAANovSGLHuhLKjPyaXdE7MT7UlJq3cWhLDKuzN

RESET ALL;
