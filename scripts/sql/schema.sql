DROP TABLE IF EXISTS crypto_payments;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS userAccess;


CREATE TABLE `crypto_payments` (
  "id" INTEGER,
  "userId" INTEGER,
  "orderId" TEXT,
  "productName" TEXT,
  "paymentId" TEXT,
  "amountCurrency" TEXT,
  "amount" TEXT,
  "cryptoUsed" TEXT,
  "amountUsd" TEXT,
  "boxType" TEXT,
  "address" TEXT,
  "txId" TEXT,
  "coinLabel" TEXT,
  "txConfirmed" TEXT,
  "txDate" TEXT,
  "processed" INTEGER DEFAULT 0,
  "paid" INTEGER DEFAULT 0,
  "expired" INTEGER DEFAULT 0,
  "isDeleted" INTEGER DEFAULT 0,
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT,
  "publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "crypto_payments" ("userId","orderId","productName","amountUsd","amountCurrency","paymentId") VALUES (1,'0d4e2f3d-1a24-919c-e8ef-915b4e598d7f','rental payment 1','50','$','023424d-1a24-919c-e8ef-915b4e22');

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

INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('cryptoskillz','cryptoskillz@protonmail.com','123456789','0x1521a6B56fFF63c9e97b9adA59716efF9D3A60eB','cryptoskillz','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,1,0,0);
INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('seller 2','test@test.com','123456789','0x060A17B831BFB09Fe95B244aaf4982ae7E8662B7','test','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,0,0,1);


CREATE TABLE "userAccess" (
	"id"	INTEGER,
	"userId"	INTEGER,
	"foreignId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userAccess" ("userId","foreignId") VALUES (1,1);
INSERT INTO "userAccess" ("userId","foreignId") VALUES (2,1);
