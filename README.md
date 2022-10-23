# YACE


## ABOUT

YACE is a JSON-based headless CMS for Cloudflare's infrastructure.  it has been built using pages, workers, and KV datastores. 

it is a lightweight CMS for technical people.

## SETUP


clone YACE CMS into your directory

git clone https://github.com/cryptoskillz/YACEcms.git

run  the following 2 commands

`npm install --save-dev @11ty/eleventy`
`npm install `


### Change variables:

open _data/env.js and change the vars to whatever you want.

### create .env

rename _.env to .env to allow dotenv to see the local environment variables 

Change the secret to something else, this is the Key that JWT uses. 
The API is set to the local host.

### Javascript

All the reusable javascript is in /assets/app.js and 
Each file has its js file in _includes ie dashoard.njk has an accompanying _includes/dashboard.js file 


## Building 

The build script is a script you can locally to test the CMS before you deploy it.

`./build.sh local`   

`./build.sh prod`

`./build.sh cypress`

The first command will build a local version the second command will use production api and the cypress will run the tests

## API

The API endpoints are all in the functions/API directory


## DEPLOY TO CLOUDFLARE 

create a repo and push the code to it

`git init`

`git remote add cms <GIT URL>`

* Login into Cloudflare and click on workers and set the domain
* Click on KV 
* Click on create namespace give it a name and click add
* Click on pages from the left menu
* Click create the project and connect to git
* Connect your git hub and chose the repo
* Set the framework to eleventy
* Click Deploy

Click on setting and then environment variables and add the following

`	API: the root of your project`
`	SECRET: A secret phrase for JWT`

Click on functions and scroll down to the KV datastore
click add and add the following details

	`kvdata : <namesapce>`


## USING THE CMS

* Create a new user 
* Login 
* Click on sites / view and create new
* Add a new site and a name
* Add an optional build URL (this is what the cms will Use to trigger a build of your site you can see the Cloudflare example here https://developers.cloudflare.com/pages/platform/deploy-hooks )
* Click save
* Click back
* Click pages
* Add a new page name
* Click save
* Click back
* Click content
* Add some content
* Click save
* Click back and back again to go back to the sites
* Click API and you will see the page(s) you created (take this URL and add it to your frontend site as we do here https://orbitlabs.xyz/)
* Click publish if you have added a build URL and your site will rebuild