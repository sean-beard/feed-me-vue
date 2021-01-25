# FeedMe Frontend

https://feedme.digital

RSS feed reader allowing users to curate a truly personalized newsfeed.

Users authenticate via GitHub and can subscribe to RSS feeds. 

<img src="demo.gif" width="600"></img>

## Development

The [FeedMe API](https://github.com/sean-beard/feed-me-api) is used in this application to manage users, feed content and subscriptions.

### Getting started

Get the dependencies

```bash
$ yarn install
```

Compile and hot-reload for development

```bash
$ yarn serve
```

Compile and minify for production

```bash
$ yarn build
```

Lint and fix files

```bash
$ yarn lint
```

### Deployment

This project uses [Netlify](https://www.netlify.com/) for deployment. The frontend is deployed when code gets merged.
