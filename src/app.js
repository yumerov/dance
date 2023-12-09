class Figure
{
    id;
    label;

    constructor(id, label) {
        this.id = id;
        this.label = label;
    }
}

class App
{
    appContainer;
    figures = [];
    init()
    {
        this.appContainer = document.getElementById('app');
        fetch("/salsa.json")
            .then( (data) => data.json().then((data) => {
                this.renderFields(data)
            }));
    }

    renderFields(fields)
    {
        fields.forEach(field => {
            this.figures.push(new Figure(field.id, field.label));
            this.renderField(field);
        });
        console.log('fields', fields);
    }

    renderField(field)
    {
        const wrapperElement = document.createElement('label');
        const checkboxElement = document.createElement('input');
        const labelElement = document.createElement('span');

        checkboxElement.setAttribute('type', 'checkbox');
        labelElement.innerText = field.label;
        wrapperElement.append(checkboxElement);
        wrapperElement.append(labelElement);

        this.appContainer.querySelector('.fields').append(wrapperElement);
    }

    getRandomFigure()
    {
        return this.figures[Math.floor((Math.random() * this.figures.length))];
    }
}

const app = new App();

app.init();

document.querySelector('#add').addEventListener('click', () => {
    const figure = app.getRandomFigure();
    const listItem = document.createElement('li');
    listItem.innerText = figure.label;

    document.querySelector('.output').querySelector('.list').append(listItem);
});