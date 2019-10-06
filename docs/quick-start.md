## Как запустить проект

1. убедится, что Ваша версия `node.js >= 10.3.0`, т.к. я использую `Promise.finally`
2. Склонировать репозиторий `git clone https://github.com/WIVSW/git-bash-api.git git-bash-api && cd git-bash-api`
3. Если Вы используете `Mac` или `Linux` можно запустить `npm run prebuild`,
который установит зависимости и запустить сервер с тестовыми данными. 
4. Открыть в браузере `http://localhost:4554`

#### Если prebuild не сработал:
1. создать папку `tmp` в корне проекте
2. Внутри папки `tmp` склонировать два репозитория `git clone https://github.com/facebook/react/`
`git clone https://github.com/WIVSW/foreign-api.git`
3. в корне проекта выполнить `npm i`
4. в корне проекта выполнить `./node_modules/.bin/selenium-standalone install`
5. в папке `client-react` выполнить `npm i`
6. в папке `client-react` выполнить `npm run build`
7. в корне проекта выполнить `npm run start ./tmp`
8. Открыть в браузере `http://localhost:4554`