# Zadani
- Cilem tohoto ukolu je kontejnerizace nasich 2 aplikaci do dockeru a pridani databazoveho kontejneru (postgres) 
- Docker kontejnery budeme spravovat pomoci docker pluginu `compose`, ktery nam umozni deklarovat vsechny kontejnery v jednom konfiguracnim souboru `docker-compose.yml`. V rootu repozitare na teto branchi jsem ho jiz pripravil a pridal do nej sluzbu `db`, ktera po spusteni vytvori kontejner s PostgreSQL databazi
- V prve rade je ale nutne docker nainstalovat. Doporucuju stahnout [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) coz je docker+GUI. Doporucuju zaroven nakonfit i [WSL2](https://docs.docker.com/desktop/wsl/)
- Po uspesne instalaci muzete v rootu repozitare spustit `docker compose up -d`, coz by melo stahnout docker image definovane v compose filu a rozjet vsechny definovane sluzby (v tuto chvili pouze DB). Pokud vse klaplo tak budete mit na `localhost:5432` funkcni PostgreSQL databazi.

## Uprava naseho BE
- Databazi zkusime vyuzit k tomu, abychom uchovavali konverzace a jeji zpravy. Ukolem tedy bude na nasem BE ukladat do DB konverzace a zpravy. Celkem by se melo jednat o 3 tabulky - konverzace, zprava a konverzace-zprava (vazebni tabulka)
- Abychom mohli PostgreSQL spravovat primo z kodu, vyuzijeme [ORM knihovnu drizzle](https://github.com/knaadh/nestjs-drizzle/blob/main/packages/postgres-js/README.md)
- Pro jednoduchost nam bude stacit postupovat instalaci knihoven v [tomto balicku](https://github.com/knaadh/nestjs-drizzle/blob/main/packages/postgres-js/README.md), ktery nam propoji drizzle a postgre connector do jednoho NestJS modulu a da nam k dispozici klasickou NestJS servicu abychom mohli volat databazi. Prerekvizita je tvorba databazoveho schema - tu tvorite sami a vpodstate definuje jak vypada dana tabulka, zde je [simple example](https://github.com/knaadh/nestjs-drizzle/blob/main/apps/demo/src/db/schema.ts). Nasledne schema lze pomoci [drizzle-kit](https://orm.drizzle.team/kit-docs/overview) prevest na migrace a spustit tak, aby se nam vytvorili tabulky v PostgreSQL. 
- Nas `ChatModule` bychom meli rozsirit o moznost ukladani konverzaci a zprav a dale o funkcionalitu fetchnuti seznamu konverzaci a fetchnuti vsech zprav dane konverzace, abychom je mohli zobrazit na FE.
- Martin by byl rad i za nejaky `Provisioning` modul, tzn. modul ktery zaplni databazi testovacimi daty. Implementacne staci, kdyz bude implementovat `onModuleInit` interface, ve kterem zkontroluje, zda-li ma seedovat (pres ENV variable `SEED=<true|false>`). Pokud true, tak zaplni databazi destovacimi daty (par konverzaci a zprav) - pro vymysleni dummy dat muzete vyuzit [faker.js](https://fakerjs.dev)

## Uprava naseho FE
- Asi by stalo za to, zobrazovat na FE seznam konverzaci a mit moznost nacist starou konverzaci vcetne zprav, tim padem mit i moznost pokracovavt v predchozi konverzaci.

## Docker-izace stavajicich aplikaci
- Pokud jste se uspesne dostali az sem (drizzle a ORM obecne jsou dost blackbox, na kterem se dokaze clovek zaseknout i na tydny...), zkusime vytvorit Docker Image z nasich aplikaci (ui, api)
- Do obou aplikaci pridejte soubor `Dockerfile`, ktery bude definovat, jakym zpusobem se docker image bude tvorit. V obou pripadech by mel docker file obsahovat 2 faze. Prvni faze bude build faze a bude vychazet z nejakeho nodejs image (`FROM node:20-slim as builder`). Druha faze bude runner, kde v pripade UI byste meli vychazet z nejakeho webserver image (`FROM nginx:1.17.5-alpine as runner`), v pripade backendu to bude opet nodejs (`FROM node:20-slim as runner`). Tomuhle se rika tzv. [multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- Jelikoz pouzivame NX, kde kazda aplikace/knihovna ma svuj `project.json`, zkuste se zamyslet jak toho vyuzit, aby se spoustela dockerizace pres prikaz neco jako `npx nx dockerize chat-api`, vice informaci [zde](https://nx.dev/recipes/running-tasks/run-commands-executor)
- Jakmile budete mit docker image vybuildene, zkopirujte soubor `docker-compose.yml` jako `docker-compose.test.yml`, do ktereho je zkusite pridat a spustit cely ekosystem v dockeru.
