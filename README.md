


# Under construction

We will be back soon. Thank you for your patience.


## npm requirements

npm install --global surge

npm install gh-pages --save-dev


# Deploy 

## with surge > .sh domain


1. login to surge
`surg login`

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

## with github pages

[gatsby docs](https://www.gatsbyjs.com/docs/how-gatsby-works-with-github-pages/)

https://www.gatsbyjs.com/dashboard/