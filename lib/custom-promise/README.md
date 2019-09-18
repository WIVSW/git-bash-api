# Custom Promise
Примеры использования можно посмотреть в
[файле для тестов](../../test/custom-promise/custom-promise.test.js).

А убедиться в том, что тесты проходят можно с помощью комманды `npm test`.

## Реализованы методы:
1. `new CustomPromise(() => {}).then`
2. `new CustomPromise(() => {}).catch`
3. `CustomPromise.resolve`
4. `CustomPromise.reject`

Также предусмотрена проверка среды выполнения на предмет того,
есть ли нативный объект `Promise`, если его нет то работает полифилл.