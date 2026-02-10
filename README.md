# Dietetica
This is the end project of our Holberton program


Tuto lancement project/prisma:
	si premier lancement:
		- docker compose up --build
	sinon:
		- docker-compose start

	aller dans le contener backend puis le exec:
		- npx prisma db pull
		- nxp prisma generate
	pour ouvrir la visualisation de la BDD:
		- npx prisma studio --browser none
