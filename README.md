# URL Shortening Server

Simple URL Shortening server created with Express and Mongo on NodeJS.
Built as a part of the Free Code Camp Curriculum. It starts generating URLS
with `0` and increments though 0 - 9, a-z, and A-Z, adding characters as
necessary.

The project uses ES6 features so it may be necessary to use Node 4.2 or above.

## Get it Running

+   Have mongo running and in the mongo shell `use urls` to create the db.
+   Then simply `npm install` and `npm run start`.

## API Usage

Simply send the URL you want to shorten to `/set/:url` and you will get a JSON
response with the shortened URL. Visiting this URL does a 302 redirect to the
URL that was shortened.

### Examples

Good Request:
```
serverurl.com/set/http://google.com
```

Good Response:
```javascript
{shortURL: 'http://serverurl.com/b'}
```

Bad Request:
```
serverurl.com/set/badtest
```

Bad Response:
```javascript
{error: 'invalid URL'}
```

### Try it out

I've got a demo running at [https://protected-stream-2880.herokuapp.com/](http://protected-stream-2880.herokuapp.com/)

## License

The project is licensed under the terms of the MIT license.