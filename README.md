# Obecné zadání
Úkolem je vytvořit monorepozitář pomocí NX, který obsahuje:
 1. angular frontend aplikaci
 2. nestjs backend aplikaci
 3. typescript knihovnu pro sdileni kodu mezi frontend a backend aplikaci

## Příprava environmentu pro vývoj
Prakticky jediné, co budete potřebovat je nějaké IDE a NodeJS.

### IDE
Doporučuji WebStorm, VSCode nebo pro odvážné Neovim

### NodeJS
Doporučuji použít Node Version Manager (NVM). Odkaz pro [windows](https://github.com/coreybutler/nvm-windows) nebo pro [linux](https://github.com/nvm-sh/nvm).
Poté nainstalujte verzi 20.10.0

# Konkrétní zadání
Jelikož to vypadá, že jsme všichni nadšenci do LLM, rozhodli jsme se úkol koncipovat kolem nich. Cílem je vytvořit jednoduchou chatovací aplikaci jako je např. https://chat.openai.com. 

Na straně frontendu se bude jednat pouze o posílání a příjem zpráv a jednoduché nastavení LLM parametrů na náš NestJS backend.

Na straně backendu je za cíl vytvořit REST API pro náš angular frontend a zavolat OpenAI služby prostřednictvím oficiálního OpenAI klienta.

## NX Monorepo
V této kapitole se naučíme pracovat s monorepem [NX](https://nx.dev/getting-started/installation). NX slouží jako build tool, codegen a zároveň usnadňuje sdílení kódu mezi aplikacemi pomocí vlastních knihoven.

### Inicializace repozitáře
V novém terminálu si ověříme, že máme nainstalované NodeJS:
`nvm current`

output by měl být:
`v20.10.0`

Následně můžeme spustit:
`npx create-nx-workspace@latest`

Což by mělo vrátit:
```
Need to install the following packages:
create-nx-workspace@18.3.4
Ok to proceed?
```
Potvrdíme pomocí `y`

Instalaci vyklikáme následovně:
```
√ Where would you like to create your workspace? · ukol-01
√ Which stack do you want to use? · none
√ Package-based monorepo, integrated monorepo, or standalone project? · integrated
√ Do you want Nx Cloud to make your CI fast? · skip
```
Nyní bychom měli mít vytvořený prázdný monorepozitář.
NX za nás inicializoval i Git repozitář, tak od nynější chvíle můžete začít verzovat.

### Přidání jednotlivých aplikací
V NX existují tzv. generátory, pomocí kterých můžeme jednoduše přidávat aplikace, knihovny, moduly, a jiné kusy kódu.
Většina generátorů existuje v samostatných NPM balíčcích, které si musíme dotáhnout zvlášť.
Pokud vás zajímají detaily, [zde odkaz na dokumentaci](https://nx.dev/features/generate-code)

## Frontend
Začneme přidáním NX pluginu pro Angular, pomocí kterého můžeme generovat Angular related kód jako jsou aplikace, knihovny, ale také jednotlivé komponenty, direktivy, pipy,...
`npx nx add @nx/angular`

Nyní můžeme vygenerovat naši aplikaci:
`npx nx g @nx/angular:app`

Vyplníme následovně:
```
√ What name would you like to use for the application? · chat-ui
√ Which stylesheet format would you like to use? · css
√ Which E2E test runner would you like to use? · none
√ Which bundler do you want to use to build the application? · webpack
√ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? (y/N) · false
```

A aplikace je na světě, můžeme jí spustit:
`npx nx serve chat-ui`

V tuto chvíli byste měli mít na adrese https://localhost:4200 lokální webserver s angular aplikací. Pokud budete provádět změny v kódu, po uložení by se měla aplikace automaticky reloadnout.

Nyní doporučuji vytvořit váš první commit. Můžete použít oblíbeného git klienta, nebo v konzoli:
 1. `git add .`
 2. `git commit -m "feat: generated example angular application"`

## Backend
Pokračujeme přidáním NX pluginu pro NestJS, pomocí kterého můžeme generovat NestJS related kód jako jsou aplikace, knihovny, controllery, moduly,...
`npx nx add @nx/nest`

Nyní bychom měli být schopni používat plugin nx/nest a vygenerovat aplikaci:
`npx nx g @nx/nest:app --frontendProject chat-ui`

Vyplníme následovně:
`√ What name would you like to use for the node application? · chat-api`

A opět ji můžeme i spustit:
`npx nx serve chat-api`

Na adrese http://localhost:3000/api by mělo běžet jednoduché REST API.
Můžeme zkusit, zda-li funguje odesláním GET Requestu přes curl:
`curl http://localhost:3000/api`

Nebo můžeme jednoduše otevřít v prohlížeči.

Tak či tak bychom měli vidět:
`{"message":"Hello API"}`

Nyní opět doporuřuji vytvořit commit.

## Typescript knihovna
Jedno z hlavních pravidel práce v NX monorepozitáři je to, že aplikace může importovat kód pouze z knihovny. Aplikace nikdy nemůže importovat kód z jiné aplikace.
Zároveň je ale častá situace, kdy si mezi BE a FE potřebujeme nějaký kód (typy, interfacy, funkce) sdílet. Díky tomu, že jsou obě aplikace psané v Typescriptu si můžeme takový kód jednoduše sdílet za pomocí čistá typescript (nebo javascript) knihovny. Rovnou si jednu vytvoříme:

`npx nx g @nx/js:lib common`

Vyplníme:
```
√ Which unit test runner would you like to use? · none
√ Which bundler would you like to use to build the library? Choose 'none' to skip build setup. · tsc
```

Nyní ve vzniklé složce `common\src\lib\common.ts` uděláme klasickou typescript funkci:
```ts
export function exampleFunction(): IResponse {
  return {
    message: 'Hello, world!',
  };
}

export interface IResponse {
  message: string;
}
```

Kterou můžeme použít jak na FE:

```ts
// chat-ui\src\app\app.component.tsc

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { exampleFunction } from '@ukol-01/common';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chat-ui';

  constructor() {
    const result = exampleFunction();
    console.log(result);
  }
}

```

Tak i na BE:
```ts
// chat-api\src\app\app.module.ts
import { Module } from '@nestjs/common';
import { exampleFunction } from '@ukol-01/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    const result = exampleFunction();
    console.log(result);
  }
}

```

Pomocí NX si můžeme i vizualizovat závislosti jednotlivých projektů (aplikace, knihovna):

`npx nx graph`

Vám spustí debug appku pro vizualizaci:

![Vystup nx graphu](/assets/graph.png?raw=true)
