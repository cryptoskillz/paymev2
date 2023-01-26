DROP TABLE IF EXISTS crypto_payments;
DROP TABLE IF EXISTS user;

CREATE TABLE `crypto_payments` (
  "id" INTEGER,
  "adminId" INTEGER,
  "userId" INTEGER,
  "orderId" TEXT,
  "name" TEXT,
  "paymentId" TEXT,
  "amountCurrency" TEXT,
  "amount" TEXT,
  "paymentType" TEXT,
  "confirmed" INTEGER  DEFAULT 0,
  "amountUsd" TEXT,
  "boxType" TEXT,
  "address" TEXT,
  "txId" TEXT,
  "coinLabel" TEXT,
  "txConfirmed" TEXT,
  "txDate" TEXT,
  "txResponse" TEXT,
  "processed" INTEGER DEFAULT 0,
  "paid" INTEGER DEFAULT 0,
  "expired" INTEGER DEFAULT 0,
  "markedInvalid" INTEGER DEFAULT 0,
  "useTimer" INTEGER DEFAULT 1,
  "isDeleted" INTEGER DEFAULT 0,
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT,
  "publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
);




INSERT INTO "crypto_payments" ("adminId","userId","orderId","name","amountUsd","amountCurrency","paymentId") VALUES (1,1,'0d4e2f3d-1a24-919c-e8ef-915b4e598d7f','rental payment 1','50','$','023424d-1a24-919c-e8ef-915b4e22');

CREATE TABLE "user" (
	"id"	INTEGER,
	"name"	TEXT,
	"email" TEXT,
	"phone" TEXT,
	"cryptoAddress" TEXT,
	"username" TEXT,
	"password" TEXT,
	"apiSecret" TEXT,
	"confirmed" TEXT DEFAULT 0,
	"isBlocked" INTEGER DEFAULT 0,
	"isAdmin" INTEGER DEFAULT 0,
	"adminId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('cryptoskillz','test@orbitlabs.xyz','123456789','0x1521a6B56fFF63c9e97b9adA59716efF9D3A60eB','cryptoskillz','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,1,0,0);


