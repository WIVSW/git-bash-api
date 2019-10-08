## Отчет о переводе проекта на TypeScript

### Перевод фронтенда:
1. Воспользовался [гайдом](https://create-react-app.dev/docs/adding-typescript) по переводу `create-react-app` на `ts`
2. Переименовал с помощью комманды `find client-react/src -name "*.js" -exec sh -c 'mv "$0" "${0%.js}.ts"' {} \;` все `js`-файлы в `ts`-файлы
3. Переимновал файлы с `jsx` в `tsx`, с помощью `IDE`.
Пока что не сложно.