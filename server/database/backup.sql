PGDMP      /                |            manualmaquinas    16.3    16.3 $    	           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398    manualmaquinas    DATABASE     �   CREATE DATABASE manualmaquinas WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE manualmaquinas;
                postgres    false            �            1259    16400 	   categoria    TABLE     }   CREATE TABLE public.categoria (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    maquina_id integer
);
    DROP TABLE public.categoria;
       public         heap    postgres    false            �            1259    16399    categoria_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.categoria_id_seq;
       public          postgres    false    216                       0    0    categoria_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;
          public          postgres    false    215            �            1259    16407    maquinas    TABLE     z   CREATE TABLE public.maquinas (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    setor_id integer
);
    DROP TABLE public.maquinas;
       public         heap    postgres    false            �            1259    16406    maquinas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.maquinas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.maquinas_id_seq;
       public          postgres    false    218                       0    0    maquinas_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.maquinas_id_seq OWNED BY public.maquinas.id;
          public          postgres    false    217            �            1259    16414    problema    TABLE     �   CREATE TABLE public.problema (
    id integer NOT NULL,
    descricao character varying(100) NOT NULL,
    categoria_id integer
);
    DROP TABLE public.problema;
       public         heap    postgres    false            �            1259    16413    problema_id_seq    SEQUENCE     �   CREATE SEQUENCE public.problema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.problema_id_seq;
       public          postgres    false    220                       0    0    problema_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.problema_id_seq OWNED BY public.problema.id;
          public          postgres    false    219            �            1259    16421    setor    TABLE     f   CREATE TABLE public.setor (
    id integer NOT NULL,
    descricao character varying(100) NOT NULL
);
    DROP TABLE public.setor;
       public         heap    postgres    false            �            1259    16420    setor_id_seq    SEQUENCE     �   CREATE SEQUENCE public.setor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.setor_id_seq;
       public          postgres    false    222                       0    0    setor_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.setor_id_seq OWNED BY public.setor.id;
          public          postgres    false    221            _           2604    16403    categoria id    DEFAULT     l   ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);
 ;   ALTER TABLE public.categoria ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            `           2604    16410    maquinas id    DEFAULT     j   ALTER TABLE ONLY public.maquinas ALTER COLUMN id SET DEFAULT nextval('public.maquinas_id_seq'::regclass);
 :   ALTER TABLE public.maquinas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            a           2604    16417    problema id    DEFAULT     j   ALTER TABLE ONLY public.problema ALTER COLUMN id SET DEFAULT nextval('public.problema_id_seq'::regclass);
 :   ALTER TABLE public.problema ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            b           2604    16424    setor id    DEFAULT     d   ALTER TABLE ONLY public.setor ALTER COLUMN id SET DEFAULT nextval('public.setor_id_seq'::regclass);
 7   ALTER TABLE public.setor ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222                       0    16400 	   categoria 
   TABLE DATA           9   COPY public.categoria (id, nome, maquina_id) FROM stdin;
    public          postgres    false    216   �%                 0    16407    maquinas 
   TABLE DATA           6   COPY public.maquinas (id, nome, setor_id) FROM stdin;
    public          postgres    false    218   �%                 0    16414    problema 
   TABLE DATA           ?   COPY public.problema (id, descricao, categoria_id) FROM stdin;
    public          postgres    false    220   �%                 0    16421    setor 
   TABLE DATA           .   COPY public.setor (id, descricao) FROM stdin;
    public          postgres    false    222   �%                  0    0    categoria_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categoria_id_seq', 1, false);
          public          postgres    false    215                       0    0    maquinas_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.maquinas_id_seq', 1, false);
          public          postgres    false    217                       0    0    problema_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.problema_id_seq', 1, false);
          public          postgres    false    219                       0    0    setor_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.setor_id_seq', 1, false);
          public          postgres    false    221            d           2606    16405    categoria categoria_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
       public            postgres    false    216            f           2606    16412    maquinas maquinas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.maquinas
    ADD CONSTRAINT maquinas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.maquinas DROP CONSTRAINT maquinas_pkey;
       public            postgres    false    218            h           2606    16419    problema problema_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.problema
    ADD CONSTRAINT problema_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.problema DROP CONSTRAINT problema_pkey;
       public            postgres    false    220            j           2606    16428    setor setor_descricao_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.setor
    ADD CONSTRAINT setor_descricao_key UNIQUE (descricao);
 C   ALTER TABLE ONLY public.setor DROP CONSTRAINT setor_descricao_key;
       public            postgres    false    222            l           2606    16426    setor setor_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.setor
    ADD CONSTRAINT setor_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.setor DROP CONSTRAINT setor_pkey;
       public            postgres    false    222            o           2606    16439    problema fk_categoria_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.problema
    ADD CONSTRAINT fk_categoria_id FOREIGN KEY (categoria_id) REFERENCES public.categoria(id);
 B   ALTER TABLE ONLY public.problema DROP CONSTRAINT fk_categoria_id;
       public          postgres    false    4708    220    216            m           2606    16434    categoria fk_maquina_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT fk_maquina_id FOREIGN KEY (maquina_id) REFERENCES public.maquinas(id);
 A   ALTER TABLE ONLY public.categoria DROP CONSTRAINT fk_maquina_id;
       public          postgres    false    216    218    4710            n           2606    16429    maquinas fk_setor_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.maquinas
    ADD CONSTRAINT fk_setor_id FOREIGN KEY (setor_id) REFERENCES public.setor(id);
 >   ALTER TABLE ONLY public.maquinas DROP CONSTRAINT fk_setor_id;
       public          postgres    false    222    218    4716                   x������ � �            x������ � �            x������ � �            x������ � �     