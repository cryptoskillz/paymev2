This is cryptoskillz generic admin for cloudflare pages that can be found in the current repo

clone this the directory of you choice then run  the following 2 commands

npm install --save-dev @11ty/eleventy
npm install 


Change variables:

Open _data/env.js
	Change "TITLE" to your customers title
	Change "COPYRIGHT" to your company / product name 
	Change "DATAMAIN" if you want to call the your data view something else IE projects.
	chnage "DASHBOARDSTRAP" if you want to change the strapline
Change env vars

open .env
	Change secret to something else, this is they Key that JWT uses. 

Javacript

	All the resuable javascript is in /assets/app.js and 
	Each file has its own js file in _includes ie dashoard.njk has an accompayning _includes/dashboard.js file 

Building 

	./build.sh local   
		Build a local version of the site 
	./build.sh prod
		Build a prodction version of the site
	./build.sh cypress
		runs the tests

	wrangler

	you can skip the build script and use wrangler directly

	wrangler pages dev _site --binding SECRET=fdfdf --kv=kvdata --local --live-reload  &


	api

	The api endpoints are all in the functions/api directory


	publishing

	https://developers.cloudflare.com/pages/get-started/

	create a new KV name space here

	https://dash.cloudflare.com/8851e575353a23f4511fbe2d1a74505e/workers/kv/namespaces

	add the following your cloudflare pages dashboard

	settings/enviorment-variables 

	API : the root of your project
	SECRET : A secret phrase for JWT

	setttings/functions

	add a kv binding

	KDATA = Your namespace you created earlier

TODO

sitemap
profile page









