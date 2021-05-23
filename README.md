# Welcome

This website is build with [Gatsby](https://www.gatsbyjs.com/).


## npm requirements

npm install --global surge

npm install gh-pages --save-dev


# Update / deploy


## with github pages

[gatsby docs](https://www.gatsbyjs.com/docs/how-gatsby-works-with-github-pages/)

* implement modifications

* locally render the website with `npx gatsby develop`

* run `npm run deploy` to publish at gh-pages branch

* the source files are in the master branch, so do not forget to `git push`

control to what branch the pages is deployed in `package.json` > organization websites cannot use the gh-pages branch!

### detailed explanation

currently used for sschwindt: gh-pages (`package.json`):

```
{
  "scripts": {
    "deploy": "gatsby build --prefix-paths && gh-pages -d public"
  }
}
```

for switching to the master branch use (`package.json`):

```
{
  "scripts": {
    "deploy": "gatsby build && gh-pages -d public -b master"
  }
}
```

then run `npm run deploy`

## with surge > .sh domain


1. login to surge
`surge login`

1. build website
`gatsby build`
> verify that public folder was created: `ls public`

1. push to custom surge domain
`surge pulic/ --domain becreative2134.surge.sh`

result:

```
   Running as user@host.com

        project: public/
         domain: becreative2134.surge.sh
         upload: [] 100% eta: 0.0s (50 files, 3321547 bytes)
            CDN: [====================] 100%

             IP: 138.197.235.123

   Success! - Published to becreative2134.surge.sh
```


https://www.gatsbyjs.com/dashboard/
