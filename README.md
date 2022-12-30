# PAYME

PAYME is the 100% serverless payment gateway.

SETUP

Install wrangler if you have  not already done so. 

get the code

git remote add origin  https://github.com/cryptoskillz/paymev2.git


update .env & .dev.vars (no idea why cloudflare did not just use env)

defaults:


Salt for web3 stuff

CRYPTOSALT=fdsfhsjdfhsdufysdufyu8ewyfefwefe

bnb explorer

BNBBLOCKEXPLORER=https://testnet.bscscan.com

bnb rpc for web3

BNBRPCURL=https://bsc-dataseed.binance.org

eth explorer

ETHBLOCKEXPLORER=https://testnet.bscscan.com

eth rpc for web3

ETHRPCURL=https://bsc-dataseed.binance.org


btc explorer mainnet 

BTCBLOCKEXPLORERMAIN=https://blockstream.info/api/

btc explorer testnet

BTCBLOCKEXPLORERTEST=https://blockstream.info/testnet/api/

net work to use

NETWORK=testnet

xpub mainnet (to generate BTC addresses)

XPUBMAINNET=xpub67yMUMbr2gAnBgnYvXcbJq8iUBe54Ev2dbUYKGN8jGY21AHJFeR7mnZqhbUNze4UbpRE9S1fWvmFCsFN4EvU1rWdqegW7dzoa7vZmYCLAAy

xpub testnet (to generate BTC addresses)


XPUBTESTNET=xpub69hLknP5tX11wPwujsEGF4YYKDtn5sAQoNv337CsWP8CuYMqjVDAEiUAnVRENbRS6ssN6uYtjSm8iVKRorpmmvceqQmK5H5y6y7ficWV2xeAPIKEY=youstupididiot

non btc address eth / bnb

CRYPTOADDRESS=0x960f470cE20Bfb519facA30b770474BBCdF78ef8

back up btc address mainnet (incase xpub fails or you dont want to use it)

BTCBACKUPADDRESSMAIN=bc1qxphczudn8retcx0umz3pf2xuwpaxwmeslwugvm

back up btc address testnet (incase xpub fails or you dont want to use it)


BTCBACKUPADDRESSTEST=tb1qtted8h90555x2jd53992kxa6rm5y7u2et2l47x

chainlink contract address for prices

CHAINLINKTESTBTC=0x5741306c21795FdCBb9b265Ea0255F499DFe515C
CHAINLINKTESTETH=0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7
CHAINLINKTESTBNB=0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526
CHAINLINKMAINBTC=0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf
CHAINLINKMAINETH=0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e
CHAINLINKMAINBNB=0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE

TERMINAL

from terminal (project root) run the following command

npm install 
wrangler d1 execute payme --local --file=./scripts/sql/schema.sql
./build.sh

BROWSE TO 

http://localhost:8788/payment/?orderId=0d4e2f3d-1a24-919c-e8ef-915b4e598d7f

DEPLOY TO CLOUDFLARE

from the cloudflare dashboard

DATABASE 

workers/d1
create database / dashboard
call it "payme" and click create

PAGES

create a project
connect to git
select your repository
framework present / Eleventy
click save and deploy

click settings
click environment variables
add the vars from .env

click functions
d1 database bindings
for variable name type "DB"
for variable D1 database select "payme"


from terminal run the following command


sudo wrangler d1 execute payme --local  --file=./scripts/sql/schema.sql

sudo wrangler d1 execute payme  --file=./scripts/sql/schema.sql

PUSH IT 

git add .
git commit -a -m 'first'
git push origin master


USEFUL COMMANDS

sudo wrangler d1 execute payme   --local --command="SELECT isDeleted,isBlocked,name,username,email,phone,id,isAdmin,apiSecret from user where email = 'test@orbitlabs.xyz' and password = 'test'"

sudo wrangler d1 --local execute payme   --command="SELECT isDeleted,isBlocked,name,username,email,phone,id,isAdmin,apiSecret from user where email = 'test@orbitlabs.xyz' and password = 'test'"

sudo wrangler d1 execute payme   --command="SELECT isDeleted,isBlocked,name,username,email,phone,id,isAdmin,apiSecret from user where email = 'test@orbitlabs.xyz' and password = 'test'"

sudo wrangler d1 execute payme   --command="SELECT COUNT(*) as total from crypto_payments where isDeleted = 0 and adminId = 1"





