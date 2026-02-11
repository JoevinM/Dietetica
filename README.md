# Dietetica
This is the end project of our Holberton program


Tuto lancement project/prisma:
	si premier lancement ce placé dans le dossier back-end:
		- npm install
		- docker compose up --build
	sinon:
		- docker-compose start

	aller dans le contener backend puis le exec:
		- npx prisma migrate dev --name init
		- npx prisma db pull
		- npx prisma generate
	pour ouvrir la visualisation de la BDD:
		- npx prisma studio --browser none
