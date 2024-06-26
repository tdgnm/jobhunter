# Jobhunter

## Leírás
React - Redux frontenddel illetve Sequelize - Express.js backenddel épített webapplikáció álláskereséshez. Regisztrálhatnak munkát keresők, és munkát ajánló felhasználók is. Új hirdetéseket lehet kitenni, szerkeszteni és szűrni lehet őket, valamint a munkát keresők jelentkezhetnek is ezekre. Az állások között lehet keresni, szűrni. A munkakeresők megadhatják és szerkeszthetik korábbi munkatapasztalataikat.

## Futtatás

#### Konfiguráció
A `client/config/ports.js` fájlban vannak megadva a szerver és kliens portjai. Ezek szabadon megváltoztathatók. A `rest-api` könyvtárban megadhatók a szervernek a portok egy `.env` fájlban. **A két fájlban a megfelelő portoknak egyeznie kell a program működéséhez!** (A program `.env` megadása nélkül is működik, ekkor a `ports.js` fájlban eredetileg megadott portokat használja.)

#### Backend
```
cd rest-api
npm install
npm run migrate
npm run dev
```

#### Frontend
```
cd client
npm install
npm run dev
```
