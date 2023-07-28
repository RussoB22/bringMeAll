Legend:
C - Create
R - Read
U - Update
D - Delete

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/api

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/api/user (CRUD)
// Can only have 1 Player, Owns Photos

Post:

{
  "username": "john123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

Values:
username
firstName
lastName
email
password
players
friends
photos

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/api/player (CRUD)
// Belongs to User, Can only be in 1 room

Post:

{
  "name": "Rain",
  "score": 10,
  "userId": "64b0cc2ce76ff065a97e668a"
}

Values:
name
joined
score
currentRoom
invitedRooms
bannedRooms

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/api/upload (C)

Post:

Body > form-data > Key/drop-down to file > Key = File + Value = File(png/jpeg)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/api/media (RD)

http://localhost:8080/api/media/1689331286792-aaadoggo.png

http://localhost:8080/api/media/<Media Name>


