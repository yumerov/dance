# Dance

UI composer for dance steps

## Directory Structure

```bash
src/
    {dance}
        app.js # main application logic
        data.json # structured data
        index.html # includes app and data to build the frontend
```

## Run project locally

1. Run `docker-compose up -d`
2. Open 'localhost:8080/salsa' in your browser

## Commands

- `npm run lint # ./node_modules/.bin/eslint src/salsa/app.js` - linting
- `npm run lint-fix # ./node_modules/.bin/eslint src/salsa/app.js` - lint fixing

## TODO

- [ ] Better UI / some basic styles
- [x] Structured figure checklist
- [x] Liniting
- [x] Pipeline
- [x] Dockerize
- [ ] Add styles(LA, NY, Cuban) - checking/unchecking should check/uncheck figures
- [ ] Max repeat input option
- [ ] "Clean" button
- [x] "Add" button
- [ ] "Add 5" button
- [ ] "Shuffle" - rearranges the list
